# Contract

This is an Ethereum contract which provides the following interface.

- Merkle tree in storage
- constructor(PubKey pubkey, uint8[] memory root_hash, uint value)
- participate()
- refund()
- withdraw(uint8[] memory priv_key)
- getPrivKey() external view return (uint8 [])

### Merkle tree in storage

We maintain merkle root in the contract. dataTree each leaf contain  encrypted data
zero value leaf value is   
``` 
uint256 SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
uint ZERO_VALUE = uint256(keccak256(abi.encodePacked('df_data_market'))) % SNARK_SCALAR_FIELD;
```

#### Contract functions
  ### 1: build(uint8[] uid, uint8[] memory pub_key, uint8[] memory encrypted_data, uint value)
  constructor build a contract for sale data

| Param     |  Description  |
|----------|------:|
| pub_key  | public key to encrypt data |
| encrypted_data |  Encrypted data |
| value  |   Want to sell value  |


#### 2: participate()
participate the func does not have any params.  address and value was included in the eth transaction. 


#### 3: refund()
  Participant can apply for a refund before the seller withdraw.

#### 4: withdraw(uint8[] memory priv_key)
  The seller withdraw the value when he hash the private key
| Param     |  Description  |
|----------|------:|
| priv_key  | private key |

#### 5: getPrivKey() external view return (uint8 [])
  After the seller withdraw. everyone can read the private key