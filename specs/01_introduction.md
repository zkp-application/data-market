# Data Publishing Market Place
Barry WhiteHat
 
## Motivation
Sellers try and sell data all the time. After the data is sold, sellers have to trust that that the buyer will not give away or re-sell the data to a third party.

It is easy to make copies of data so people will always be able to re-sell data. An alternative approach is to be paid to publish some data to everyone. 

Here we propose a way to publish data so that everyone is able to pay for it at once. Once a certain amount has been raised the data is published or the seller is unable to retrieve the funds. 

## High Level Description

### Buying data 

When I buy data I want to know that 

1. The data I am buying is what I think it is 
2. When I send the money I will receive the data or get my money back
3. The seller will only be able to get the money after they have published the file. 

### Fair data exchange 

1. The seller encrypts the file and shares the file in a p2p network. 
2. No one is able to decrypt the file unless they have the private key. 
3. We deploy a smart contract where anyone can deposit funds but the owner is only able to withdraw funds IF they publish the private key.

### Integrity checks 

1. The seller wants to prove to the users that the encrypted file has the expected content. The seller commits to revealing random pieces of the file.
2. Buyers manually checks the random pieces to validate that this file has the expected content.   
3. Sellers need to prove that the private key can decrypt a random part of the data 
## Detailed Description

We want to test this idea with audio files e.g. a podcast.

2. The Buyer
* Sends his 

### Buying data 

### Fair data exchange 

1. The seller encrypts the file and shares the file in a p2p network. 
2. No one is able to decrypt the file unless they have the private key. 
3. We deploy a smart contract where anyone can deposit funds but the owner is only able to withdraw funds IF they publish the private key.



## How it works 

1. Create merkle tree with each leaf encrypted. We need to use some snark efficient encryption. WJ has some for maci i think its in circom standard gadgets lib. https://github.com/appliedzkp/maci/blob/master/crypto/ts/index.ts#L265 is the encryption algorithm
2. Each leaf in the tree contains encrypted data. In the dark forrest case it contains the coordinates of a planet. 
3. The encrypted data is shared with everyone. It is on a website anyone can click download. They download the file and reconstruct the root. Then they find this root in the smart contract. 
4. The website also provides various ZKPs that attest to properties of the encrypted data.

a) first ZKP decrypts and reveals a section of the ZKP, it also reveals the public key required to decrypt that section. 
b) second ZKP decrypts various sections of the ZKP , performs df proof of work on it and sums the difficulty of all the planets. Thus providing a score of the various map sections.

https://github.com/appliedzkp/maci/blob/master/circuits/circom/decrypt.circom is the decrypt gadget

5. There is a smart contract that users can send funds to. If funds arrive the "owner" of the data needs to publish this private key in order to withdraw all the funds send to that data set. https://github.com/appliedzkp/maci/blob/master/crypto/ts/index.ts#L253 is the check you need to do in smart contract

6. The website / UI should not be Df specific tho having DF maps and ZKPs included on the site is totally fine. 

## Future work 

1. Do full proof of validity on the whole map for sale. First we just validate big planets 
2. Make a DF specific action where users with a new higher difficulty are able to replace the current map. 
3. Allow someone to sell images revealing certain pieces of the image with ZKP


