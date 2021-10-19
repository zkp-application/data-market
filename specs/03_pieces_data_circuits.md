# The pieces reveal data proof circuit

This circuit proves the pieces is part of encrypted data

- Public Inputs
- Private Inputs
- Check 1: The private key can decrypt the data correctly 
- Check 2: The reveal pieces of the file is part of the merkle tree which rebuild from encrypted data
- Check 3: The public input private key hash is equal to the hash of the private key
  
### Public inputs
  All inputs are set by the contract

 | Params  | Description |
|-|-|
| `encryptedDataSlice` | The encrypted data |
| `rootHash` | The Merkle root of the data tree hash |
| `privateKeyHash` | The Private key hash |
| `randomPaths` | For the random path generated in the smart contract, the publisher needs to provide the encrypted data proof of the path, and provide path proof and private key decrypt proof  |
| `randomPathsRawData` | Raw data for the random paths |

### Private input
 | Params  | Description |
|-|-|
|  `privateKey`| Private key which can decrypt encrypted data |


### Check 1: The private key can decrypt the data correctly 
```
var proofDataSlice = getEncryptedDataFromPath(encryptedDataSlice, randomPaths);

var rawData = decryptData(proofDataSlice, privateKey)

assert(rawData, randomPathsRawData)
```

### Check 2: The reveal pieces of the file is part of the merkle tree which rebuild from encrypted data

```
var generatedDataTreeRoot = generateMerkleRoot(
    dataTreePathElements,
    dataTreePathIndex,
    encryptedDataSlice
)

assert(generatedDataTreeRoot, dataTreeRoot)
```

### Check3: The public input private key hash is equal to the hash of the private key
```
var hash = PoseidonHash(privateKey);

assert(hash, privateKeyHash)
```