pragma solidity >=0.4.20 <0.6.0;
pragma experimental ABIEncoderV2;

import {Memory} from "../github/ethereum/solidity-examples/Memory.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract DataMarket is Ownable, VRFConsumerBase {
    using SafeMath for uint256;

    enum CommodityStatus {Selling, Done}
    uint256 CommodityID = 0;

    // market info
    uint64 all;
    uint64 sold;
    uint64 selling;
    uint64 participate_addr;

    // chainlink VRF params
    bytes32 internal keyHash;
    uint256 internal fee;

    struct Commodity {
        uint256 id;
        uint256 value;
        uint256 received_value;
        bytes encrypted_data_hash;
        bytes extra;
        address publisher;
        string privateKey;
        bytes privateKeyHash;
        mapping(address => uint256) buyer;
        CommodityStatus status;
        uint8 flag;
        // VRF randomness
        bytes32 requestId;
        uint256[16] memory randomness 
    }


    mapping(uint256 => Commodity) _market; // data_item_id => Commodity
    mapping(bytes32 => uint256) _requestid2commodityid;

    event Participate(address bidder, uint256 amount, uint256 data_item_id); // buyer participate event
    event Refund(address bidder, uint256 amount, uint256 data_item_id); // buyer refund event
    event Withdraw(uint256 data_item_id, uint256 amount); // seller withdraw event

    constructor() VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
    ) {
        // init market infomation
        all = 0;
        sold = 0;
        selling = 0;
        participate_addr = 0;

        owner = msg.sender;

        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }

    // chainlink function

    /** 
     * Requests randomness 
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        
        return requestRandomness(keyHash, fee);
    }

     /**if (
            _market[data_item_id].flag != 1 ||
            _market[data_item_id].status != CommodityStatus.Selling
        )
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 data_item_id = _requestid2commodityid[requestId];
        if (
            _market[data_item_id].flag != 1 ||
            _market[data_item_id].status != CommodityStatus.Selling
        ) {
            return;
        }

        for (uint256 i = 0; i < 16; i++) {
            // expand the random number
            _market[data_item_id].randomness[i] = uint256(keccak256(abi.encode(randomResult, i)));
        }

        return;
    }

    
    // chainlink end

    // create a new Commodity in the market
    /*
    encrypted_data_hash: encrypted data hash
    private_key_hash:    private key hash
     */
    function create(
        bytes memory encrypted_data_hash,
        bytes memory private_key_hash,
        bytes memory extra,
        uint256 value
    ) public returns (uint256) {
        require(value > 0, "value is zero");
        _market[CommodityID].id = CommodityID;
        _market[CommodityID].buyer[msg.sender] = 0;
        _market[CommodityID].privateKeyHash = private_key_hash;

        _market[CommodityID].encrypted_data_hash = encrypted_data_hash;
        _market[CommodityID].status = CommodityStatus.Selling;
        _market[CommodityID].received_value = 0;
        _market[CommodityID].flag = 1;
        _market[CommodityID].extra = extra;
        _market[CommodityID].value = value;
        _market[CommodityID].publisher = msg.sender;

        all++;
        selling++;

        bytes32 requestId = getRandomNumber();
        _requestid2commodityid[requestId] = CommodityID;
        
        return CommodityID++;
    }

    // buyer participate the data commodity sale
    /*
    data_item_id: data commodity id
     */
    function participate(uint256 data_item_id) public payable {
        require(msg.value > 0, "value is zero");

        // Commodity not exist or has been done
        if (
            _market[data_item_id].flag != 1 ||
            _market[data_item_id].status != CommodityStatus.Selling
        ) {
            msg.sender.transfer(msg.value);
            return;
        }

        _market[data_item_id].received_value += msg.value;
        _market[data_item_id].buyer[msg.sender] += msg.value;

        participate_addr++;
        emit Participate(msg.sender, msg.value, data_item_id);
        return;
    }

    // buyer apply for refund
    /*
    data_item_id: data commodity id
     */
    function refund(uint256 data_item_id) public payable {
        require(_market[data_item_id].flag == 1, "commodity item is not exist");
        require(
            _market[data_item_id].status == CommodityStatus.Selling,
            "item is done"
        );

        require(_market[data_item_id].buyer[msg.sender] > 0, "value is zero");

        // refund the ether
        msg.sender.transfer(_market[data_item_id].buyer[msg.sender]);

        emit Refund(
            msg.sender,
            _market[data_item_id].buyer[msg.sender],
            data_item_id
        );

        _market[data_item_id].received_value -= _market[data_item_id].buyer[
            msg.sender
        ];
        _market[data_item_id].buyer[msg.sender] = 0;
        return;
    }

    // Seller provide a private key to withdraw ETH value of the data sale
    /*
    data_item_id: data commodity id
    modulus: rsa modulus
    sign: sign(encrypted_data_hash)
     */
    function withdraw(uint256 data_item_id, string memory private_key)
        public
        payable
    {
        require(_market[data_item_id].flag == 1, "item is not exist");
        require(
            _market[data_item_id].status == CommodityStatus.Selling,
            "item is done"
        );

        require(_market[data_item_id].publisher == msg.sender, "Invalid publisher");

        Commodity memory data_item = _market[data_item_id];
        bytes memory pkBytes = abi.encodePacked(sha256(bytes(private_key)));
        require(
            equals(pkBytes, data_item.privateKeyHash) == true,
            "check failed"
        );

        msg.sender.transfer(_market[data_item_id].received_value);
        _market[data_item_id].privateKey = private_key;
        _market[data_item_id].status = CommodityStatus.Done;

        selling--;
        sold++;
        emit Withdraw(data_item_id, _market[data_item_id].received_value);
        return;
    }

    function equals(bytes memory self, bytes memory other)
        internal
        pure
        returns (bool equal)
    {
        if (self.length != other.length) {
            return false;
        }
        uint256 addr;
        uint256 addr2;
        assembly {
            addr := add(
                self,
                /*BYTES_HEADER_SIZE*/
                32
            )
            addr2 := add(
                other,
                /*BYTES_HEADER_SIZE*/
                32
            )
        }
        equal = Memory.equals(addr, addr2, self.length);
    }

    // return the commodity infomation by given data item id
    function getCommodityInfo(uint256 data_item_id)
        public
        view
        returns (
            uint256 id,
            uint256 value,
            bytes memory encrypted_data_hash,
            CommodityStatus status,
            // mapping (address => uint256) buyer,
            uint256 received_value,
            bytes memory priv_key_hash,
            string memory priv_key,
            uint256 my_support,
            bytes memory extra,
            address publisher
        )
    {
        require(_market[data_item_id].flag == 1, "item is not exist");
        id = _market[data_item_id].id;
        value = _market[data_item_id].value;
        encrypted_data_hash = _market[data_item_id].encrypted_data_hash;
        status = _market[data_item_id].status;
        received_value = _market[data_item_id].received_value;
        priv_key_hash = _market[data_item_id].privateKeyHash;
        priv_key = _market[data_item_id].privateKey;
        my_support = _market[data_item_id].buyer[msg.sender];
        extra = _market[data_item_id].extra;
        publisher = _market[data_item_id].publisher;
    }

    struct miniCommodity {
        uint256 id;
        bytes extra;
        CommodityStatus status;
    }

    // get Commodity list
    function getCommodityList(uint256 start, uint256 limit)
        public
        view
        returns (miniCommodity[] memory)
    {
        require(start <= CommodityID, "no Commodity item by given start");
        if (start + limit > CommodityID) {
            limit = CommodityID - start;
        }
        miniCommodity[] memory results = new miniCommodity[](limit);

        for (uint256 i = 0; i < limit; i++) {
            results[i].id = _market[start].id;
            results[i].extra = _market[start].extra;
            results[i].status = _market[start].status;
            start++;
        }

        return results;
    }

    // get market infomation
    function getMarketInfo()
        public
        view
        returns (
            uint64 all,
            uint64 sold,
            uint64 selling,
            uint64 participate
        )
    {
        all = all;
        sold = sold;
        selling = selling;
        participate = participate_addr;
    }
}
