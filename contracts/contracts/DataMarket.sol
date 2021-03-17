pragma solidity >=0.4.20 <0.6.0;
pragma experimental ABIEncoderV2;

import "../github/SolRsaVerify/contracts/SolRsaVerify.sol";
import "../github/solidity-BigNumber/contracts/BigNumber.sol";

contract DataMarket {
    enum CommodityStatus {Selling, Done}
    uint256 CommodityID = 0;
    address owner;

    struct RSA {
        bytes p1;
        bytes p2;
        bytes n;
        bytes e;
        bytes d;
    }

    struct Commodity {
        uint256 id;
        uint256 value;
        uint256 received_value;
        bytes encrypted_data_hash;
        bytes extra;
        RSA rsa;
        mapping(address => uint256) buyer;
        CommodityStatus status;
        uint8 flag;
    }

    mapping(uint256 => Commodity) _market; // data_item_id => Commodity

    event Participate(address bidder, uint256 amount, uint256 data_item_id); // buyer participate event
    event Refund(address bidder, uint256 amount, uint256 data_item_id); // buyer refund event
    event Withdraw(uint256 data_item_id, uint256 amount); // seller withdraw event

    constructor() public {
        owner = msg.sender;
    }

    // create a new Commodity in the market
    /*
    encrypted_data_hash: encrypted data hash
    _p1:                 rsa prime number
    _p2:                 rsa prime number
    pubKey_n:            rsa public key n
    pubkey_e:            rsa public key e
     */
    function create(
        bytes memory encrypted_data_hash,
        bytes memory _p1,
        bytes memory _p2,
        bytes memory pubKey_n,
        bytes memory pubkey_e,
        bytes memory extra,
        uint256 value
    ) public returns (uint256) {
        require(value > 0, "value is zero");
        _market[CommodityID].id = CommodityID;
        _market[CommodityID].buyer[msg.sender] = 0;

        _market[CommodityID].rsa.p1 = _p1;
        _market[CommodityID].rsa.p2 = _p2;
        _market[CommodityID].rsa.e = pubkey_e;
        _market[CommodityID].rsa.n = pubKey_n;

        _market[CommodityID].encrypted_data_hash = encrypted_data_hash;
        _market[CommodityID].status = CommodityStatus.Selling;
        _market[CommodityID].received_value = 0;
        _market[CommodityID].flag = 1;
        _market[CommodityID].extra = extra;
        _market[CommodityID].value = value;

        return CommodityID++;
    }

    // buyer participate the data commodity sale
    /*
    data_item_id: data commodity id
     */
    function participate(uint256 data_item_id) public payable {
        require(msg.value > 0, "value is zero");
        require(_market[data_item_id].flag == 1, "data item is not exist");
        require(
            _market[data_item_id].status == CommodityStatus.Selling,
            "data item is done"
        );

        _market[data_item_id].received_value += msg.value;
        _market[data_item_id].buyer[msg.sender] += msg.value;

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
    function withdraw(
        uint256 data_item_id,
        bytes memory modulus,
        bytes memory sign
    ) public payable {
        require(_market[data_item_id].flag == 1, "item is not exist");
        require(
            _market[data_item_id].status == CommodityStatus.Selling,
            "item is done"
        );

        Commodity memory data_item = _market[data_item_id];

        require(
            SolRsaVerify.pkcs1Sha256VerifyRaw(
                data_item.encrypted_data_hash,
                sign,
                data_item.rsa.e,
                modulus
            ) == 0,
            "check sign failed"
        );

        require(
            rsa_key_pair_check(
                data_item.rsa.p1,
                data_item.rsa.p2,
                data_item.rsa.e,
                modulus
            ),
            "key pair check failed"
        );

        msg.sender.transfer(_market[data_item_id].received_value);
        _market[data_item_id].rsa.d = modulus;
        _market[data_item_id].status = CommodityStatus.Done;

        emit Withdraw(data_item_id, _market[data_item_id].received_value);
        return;
    }

    // return the commodity infomation by given data item id
    function getCommodityInfo(uint256 data_item_id)
        public
        view
        returns (
            uint256 id,
            uint256 value,
            bytes memory pubKey_n,
            bytes memory pubKey_e,
            bytes memory encrypted_data_hash,
            CommodityStatus status,
            // mapping (address => uint256) buyer,
            uint256 received_value,
            bytes memory priv_key,
            uint256 my_support
        )
    {
        require(_market[data_item_id].flag == 1, "item is not exist");
        id = _market[data_item_id].id;
        value = _market[data_item_id].value;
        pubKey_n = _market[data_item_id].rsa.n;
        pubKey_e = _market[data_item_id].rsa.e;
        encrypted_data_hash = _market[data_item_id].encrypted_data_hash;
        status = _market[data_item_id].status;
        received_value = _market[data_item_id].received_value;
        priv_key = _market[data_item_id].rsa.d;
        my_support = _market[data_item_id].buyer[msg.sender];
    }

    function rsa_key_pair_check(
        bytes memory _p1,
        bytes memory _p2,
        bytes memory _e,
        bytes memory _d
    ) public view returns (bool) {
        BigNumber.instance memory p1 = BigNumber._new(_p1, false, false);
        BigNumber.instance memory p2 = BigNumber._new(_p2, false, false);

        BigNumber.instance memory e = BigNumber._new(_e, false, false);
        BigNumber.instance memory d = BigNumber._new(_d, false, false);
        // BigNumber.instance memory n = BigNumber.bn_mul(p1, p2);

        // BigNumber.instance memory e_mul_d = BigNumber.bn_mul(e, d);
        BigNumber.instance memory one =
            BigNumber.instance(
                hex"0000000000000000000000000000000000000000000000000000000000000001",
                false,
                1
            );
        BigNumber.instance memory _m_one =
            BigNumber.instance(
                hex"0000000000000000000000000000000000000000000000000000000000000001",
                true,
                1
            );

        // phi
        BigNumber.instance memory phi =
            BigNumber.bn_mul(
                BigNumber.prepare_add(p1, _m_one),
                BigNumber.prepare_add(p2, _m_one)
            );
        // modulo multiplicative inverse
        BigNumber.instance memory ed = BigNumber.bn_mul(e, d);
        ed.neg = true;

        BigNumber.instance memory y =
            BigNumber.bn_mod(BigNumber.prepare_add(one, ed), phi);
        return bytesToUint(y.val) == 0;
    }

    function bytesToUint(bytes memory b) internal pure returns (uint256) {
        uint256 number;
        for (uint256 i = 0; i < b.length; i++) {
            number = number + uint8(b[i]) * (2**(8 * (b.length - (i + 1))));
        }
        return number;
    }

    struct miniCommodity {
        uint256 id;
        bytes extra;
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
            start++;
        }

        return results;
    }
}
