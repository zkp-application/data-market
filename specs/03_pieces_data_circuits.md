# The pieces reveal data proof circuit

This circuit proves the pieces is part of encrypted data

- Public Inputs
- Private Inputs
- Check 1: The input private key and the public key are a pair
- Check 2: The reveal pieces of the file is part of the merkle tree which rebuild from encrypted data

  
### Public inputs
  All inputs are set by the contract

 | Params  | Description |
|-|-|
| `encryptedDataSlice` | The encrypted data |
| `rootHash` | The Merkle root of the data tree hash |
| `publicKey` | The public key which encrypted data |

### Private input
 | Params  | Description |
|-|-|
|  `privateKey`| Private key which can decrypt encrypted data |


### Check 1: The input private key and the public key are a pair
```
var pubKey = getPubkeyFromPrivKey(privateKey)

assert(pubKey, publicKey)
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
