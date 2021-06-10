### MINI server for data-market
This part is a very simple service that provides an upload/download API interface and saves the zkp proof and encrypted data created by the user offline on the server


### Get started 
Clone this repo. install Golang 1.14+. and build the source code 

```sh
git clone github.com/zkp-application/data-market.git && \
cd data-market/server && \
go build && \
./server config.json
```


### Restful API
#### 1: Proof upload

##### URL: /api/v1/proof-upload     
##### Method: POST   

##### Params:
| Name | type | Describe |
| :-----| ----: | :----: |
| proof_file_zip | bin | proof zip file binary. which contain zkp proof and encrypted data |
| part_file | bin | reveal part data |  

##### Response
application/json
{
  "hash": "0b08d19e68994a1bfa459210e0dfed4eb851b28a1ac4052e2ae930cd607fc1d9"
}


#### 2: Proof download
##### URL: /api/v1/proof-download
##### Method: GET

##### Query
| Name | type | Describe |
| :-----| ----: | :----: |
| file_hash | string | the file hash |
| file_type | string | download file type. part_file/proof_file_zip |
##### Response 
payload file binary

