const DataMarket = artifacts.require("./DataMarket.sol");

/*
    -----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDSZdbvjbOkUmd+jEbF3DPnktez3V0DPAsSyZRO+M84yixnSEI1
guDdL+0ba687wn9pDTg8/fDxwzwqB9xTOE8MmTPq03qJ5PPAKhBpBbAhRVoNg1ej
NQVNqa14pjCpR9IBcYelqO+rOgPNDOMboQBpu9Mten2NxVQQIgZwe1ZaHQIDAQAB
AoGAdKlZY50L1fqHPmkjuQRfl3EZv7bnoyqA7VrurFdT96ZKtr4fUDKQ4rR3YbP1
B0rSgPp+i3s3Raa+zoNrTI21bkJIblCvc6kQK1p7Y3wmtFvnxLhuCEFWGOgK4GKR
CKUdtR8CTBJxvYNJ6FzB7bGpEtbIrp1sEFdN4xqJMNVq9UECQQDymbzTCKGq7lKr
MRjKMkfMDWIiTB2dxk+qbo7omC5nsT65i4IAktchJ+4yXFRGKCptgjrVszTxC6rG
7SU3vNyNAkEA3gTFGrA5BszDgCnP5qg4YHAF01WHhoiLgSG7B9g2adDJZF/mVbGK
zZbtAHtOgTK2dlOr3Tin3KhM8yThStQ30QJAZdteiExLdHTziKTof5x0wJut5DCJ
DsFAmZIptkaO1UJ5z3Vfc9YzNNyLCeHyEDK0/Z18DlVbmQkI/tR6l9hX0QJBAKUb
BP146Z+97PFFpt9QYESPajWkWFna92u7itwllSmR5ALqMl+t3ZxQTcXa7SG1de1/
AcNNG8BDxJ3Y4lYEhdECQQDvtX9lc6aQKUbZPBboY6BxeUPcOUsSiJ7oPllHqI1+
w0P4XfLAqGjDLi4yuccAOZnmYwAFnno03YBFNdWhR+yQ
-----END RSA PRIVATE KEY-----
*/

const encrypted_data_hash = "0x68656c6c6f20776f726c64"; // hello world
const prime1 = "0xf299bcd308a1aaee52ab3118ca3247cc0d62224c1d9dc64faa6e8ee8982e67b13eb98b820092d72127ee325c5446282a6d823ad5b334f10baac6ed2537bcdc8d";
const prime2 = "0xde04c51ab03906ccc38029cfe6a838607005d3558786888b8121bb07d83669d0c9645fe655b18acd96ed007b4e8132b67653abdd38a7dca84cf324e14ad437d1";
const d = "0x74a959639d0bd5fa873e6923b9045f977119bfb6e7a32a80ed5aeeac5753f7a64ab6be1f503290e2b47761b3f5074ad280fa7e8b7b3745a6bece836b4c8db56e42486e50af73a9102b5a7b637c26b45be7c4b86e08415618e80ae0629108a51db51f024c1271bd8349e85cc1edb1a912d6c8ae9d6c10574de31a8930d56af541"
const e = "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001";
const sign = "0x2e3978b55120bf06520f2163baf5245139be1e5f25827c852437b2a5864edc061789bd9793e673046426318bf5b52dddf4d9e2555107a629f569f0076965e64dfe756ac52f63b2374d236b932f604b1d0a52f8689fe04c82c8f9e82c378f48be1c12af71bf01633fd4be519b7d21f73dce863dbd2708e7c808d29dab27d5e311";
// private key modulus
const n = "0xd265d6ef8db3a452677e8c46c5dc33e792d7b3dd5d033c0b12c9944ef8cf38ca2c6748423582e0dd2fed1b6baf3bc27f690d383cfdf0f1c33c2a07dc53384f0c9933ead37a89e4f3c02a106905b021455a0d8357a335054da9ad78a630a947d2017187a5a8efab3a03cd0ce31ba10069bbd32d7a7d8dc554102206707b565a1d";
const value = 200000000000;
const data_extra = "0xdeadbeef";

contract("DataMarket", accounts => {
    it("get commodity list", async () => {
        let marketInstance = await DataMarket.deployed();
        const account1 = accounts[0];
        // create a new data item
        await marketInstance.create(encrypted_data_hash, prime1, prime2, n, e, "0x01", value, {
            from: account1
        });
        await marketInstance.create(encrypted_data_hash, prime1, prime2, n, e, "0x02", value, {
            from: account1
        });
        await marketInstance.create(encrypted_data_hash, prime1, prime2, n, e, "0x03", value, {
            from: account1
        });
        await marketInstance.create(encrypted_data_hash, prime1, prime2, n, e, "0x04", value, {
            from: account1
        });

        const start = 0;
        const limit = 3;
        marketInstance.getCommodityList(start, limit, {
            from: account1
        }).then(
            function (result) {
                assert.equal(result[0][0], 0, "status error");
                assert.equal(result[1][0], 1, "status error");
                assert.equal(result[2][0], 2, "status error");

                assert.equal(result[0][1], "0x01", "unexpected extra data");
                assert.equal(result[1][1], "0x02", "unexpected extra data");
                assert.equal(result[2][1], "0x03", "unexpected extra data");
            }
        )
    });

    it("create new data item correctly", async () => {
        const account1 = accounts[0];
        const marketInstance = await DataMarket.deployed();
        // create a new data item
        await marketInstance.create(encrypted_data_hash, prime1, prime2, n, e, data_extra, value);

        const data_item_id = 0;
        await marketInstance.getCommodityInfo(data_item_id, {
            from: account1
        }).then(
            function (result) {
                var id = result[0];
                assert.equal(id.toNumber(), 0, "err item id");
                var value = result[1];
                assert.equal(value.toNumber(), value, "err value");
                var pubKey_n = result[2];
                assert.equal(pubKey_n, n, "pubKey_n is invalid");
                var pubKey_e = result[3];
                assert.equal(pubKey_e, e, "pubKey_e is invalid");
                var data_status = result[5];
                assert.equal(data_status.toNumber(), 0, "status error");
                var received_value = result[6];
                assert.equal(received_value.toNumber(), 0, "received_value error");
            }
        )
    });

    it("participate and refund", async () => {
        let marketInstance = await DataMarket.deployed();
        const account1 = accounts[0];
        const account2 = accounts[1];
        // create a new data item
        await marketInstance.create(encrypted_data_hash, prime1, prime2, n, e, data_extra, value);

        const data_item_id = 0;
        const received_value = 200000000;

        await marketInstance.participate(data_item_id, {
            from: account2,
            value: received_value
        });
        // check the commodity received value
        await marketInstance.getCommodityInfo(data_item_id, {
            from: account2
        }).then(
            function (result) {
                var received_value = result[6];
                assert.equal(received_value.toNumber(), received_value, "received_value error");
                var my_support = result[8];
                assert.equal(received_value.toNumber(), received_value, "received_value error");
            }
        )

        await marketInstance.refund(data_item_id, {
            from: account2
        });
        await marketInstance.getCommodityInfo(data_item_id, {
            from: account1
        }).then(
            function (result) {
                var received_value = result[6];
                assert.equal(received_value.toNumber(), 0, "received_value error");
            }
        )
    });

    it("participate and withdraw", async () => {
        let marketInstance = await DataMarket.deployed();
        const account1 = accounts[0];
        const account2 = accounts[1];
        const account3 = accounts[2];
        // create a new data item
        await marketInstance.create(encrypted_data_hash, prime1, prime2, n, e, data_extra, value, {
            from: account1
        });

        const data_item_id = 0;
        const received_value = 200000000;

        marketInstance.participate(data_item_id, {
            from: account2,
            value: received_value
        });
        // check the commodity received value
        marketInstance.getCommodityInfo(data_item_id, {
            from: account1
        }).then(
            function (result) {
                var received_value = result[5];
                assert.equal(received_value.toNumber(), received_value, "received_value error");
            }
        )

        marketInstance.withdraw(data_item_id, n, sign, {
            from: account3
        });

        marketInstance.getCommodityInfo(data_item_id, {
            from: account1
        }).then(
            function (result) {
                var data_status = result[5];
                assert.equal(data_status.toNumber(), 1, "status error");
                var priv_key_d = result[7];
                assert.equal(priv_key_d, d, "received_value error");
            }
        )

        marketInstance.getMarketInfo({from: account1}).then(
            function(result) {
                var all = result[0];
                var sold = result[1];
                var selling = result[2];
                var participate = result[3];
                assert.equal(all.toNumber(), 1, "market all info error");
                assert.equal(sold.toNumber(), 1, "market sold info error");
                assert.equal(selling.toNumber(), 0, "market selling info error");
                assert.equal(participate.toNumber(), 1, "market participate info error");
            }
        )
    })

})
