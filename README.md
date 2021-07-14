# DF-data-market
DataMarket is a data publish protocol using Zero-knowledge proof (ZKP) proposed by Barry whitehay. For the detail specification. please read the [post](https://hackmd.io/3D4lOndVSi6Ee0W_XL4Jrw?view)

[Telegram group](https://t.me/joinchat/_eztiSjvJtMyYzdl)   
[Discord](https://discord.gg/Bg7FRGGp)   

## Motivation
Sellers try and sell data all the time. After the data is sold, sellers have to trust that that the buyer will not give away or re-sell the data to a third party.It is easy to make copies of data so people will always be able to re-sell data. An alternative approach is to be paid to publish some data to everyone.Here we propose a way to publish data so that everyone is able to pay for it at once. Once a certain amount has been raised the data is published or the seller is unable to retrieve the funds.


## Roles

### Publisher
When any publisher wants to publish data, they must first encrypt the source data, and then the data-market protocol will open part of the data for others to preview, just like when we watch a movie, we generally choose to preview for a few minutes before choosing Pay to watch the full movie. After a part of the data is published, the publisher needs to provide a ZK-Proof proving that the public part is part of the complete data 


### Other user
Users can browse all the data in the market, download some data that has been published by the publisher, or choose to sponsor some data to be published. When the user chooses to support a certain data, the page will automatically verify the proof provided by the publisher , If the verification fails, the data cannot be sponsored to ensure the accuracy of the supporting data 



## Get Started
Data market homepage is now working. User guide right [here](./website/user-guide.md)

## Project modules
  ```
  .
  ├── circuits                      # zkp circuit module
  │   ├── circom                    # circuits code 
  │   ├── ts                        # test case for circuits which written by typescript 
  ├── contracts                     # eth smart contract
  │   ├── contracts                 # contract source code
  │   ├── github                    # import contract lib 
  │   ├── migrations                # truffle migrations 
  │   └── test                      # contract test
  ├── lib                           # wasm lib. data format process/hash
  ├── server                        # mini server service. upload/download REST interface
  ├── specs                         # specs doc

  ├── website                       # data-market website source code
  ├── README.md
  ```

## Testing Guide
All data market unit tests are independent. and the unit tests description is included in each sub-module



