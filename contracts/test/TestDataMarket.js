const DataMarket = artifacts.require("./DataMarket.sol");

const aes_private = "0xf46348323ca14b1d6b5616a192df90ba"
const private_key_hash = "0xae40f00fbf8a5adb673fcc2b5fb4af3ed3bdf03afc25353e24fc13f75c984bbf"

const encrypted_data_hash = "0x68656c6c6f20776f726c64"; // hello world
const value = 200000000000;
const data_extra = "0xdeadbeef";

contract("DataMarket", accounts => {
    it("get commodity list", async () => {
        let marketInstance = await DataMarket.deployed();
        const account1 = accounts[0];
        // create a new data item
        await marketInstance.create(encrypted_data_hash, private_key_hash, "0x01", value, {
            from: account1
        });
        await marketInstance.create(encrypted_data_hash, private_key_hash, "0x02", value, {
            from: account1
        });
        await marketInstance.create(encrypted_data_hash, private_key_hash, "0x03", value, {
            from: account1
        });
        await marketInstance.create(encrypted_data_hash, private_key_hash, "0x04", value, {
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
        await marketInstance.create(encrypted_data_hash, private_key_hash, data_extra, value);

        const data_item_id = 0;
        await marketInstance.getCommodityInfo(data_item_id, {
            from: account1
        }).then(
            function (result) {
                var id = result[0];
                assert.equal(id.toNumber(), 0, "err item id");
                var value = result[1];
                assert.equal(value.toNumber(), value, "err value");

                var encrypted_data_hash = result[2];
                assert.equal(encrypted_data_hash, encrypted_data_hash, "encrypted_data_hash is invalid");

                var data_status = result[3];
                assert.equal(data_status.toNumber(), 0, "status error");

                var received_value = result[4];
                assert.equal(received_value.toNumber(), 0, "received_value error");

                var priv_key_hash = result[5];
                assert.equal(priv_key_hash, private_key_hash, "priv_key_hash error");

                var my_support = result[7];
                assert.equal(my_support.toNumber(), 0, "my_support error")
            }
        )
    });

    it("participate and refund", async () => {
        let marketInstance = await DataMarket.deployed();
        const account1 = accounts[0];
        const account2 = accounts[1];
        // create a new data item
        await marketInstance.create(encrypted_data_hash, private_key_hash, data_extra, value);

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
                var received_value = result[4];
                assert.equal(received_value.toNumber(), received_value, "received_value error");
                var my_support = result[7];
                assert.equal(my_support.toNumber(), received_value, "received_value error");
            }
        )

        await marketInstance.refund(data_item_id, {
            from: account2
        });
        await marketInstance.getCommodityInfo(data_item_id, {
            from: account1
        }).then(
            function (result) {
                var received_value = result[4];
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
        await marketInstance.create(encrypted_data_hash, private_key_hash, data_extra, value, {
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
                var received_value = result[4];
                assert.equal(received_value.toNumber(), received_value, "received_value error");
            }
        )

        marketInstance.withdraw(data_item_id, aes_private, {
            from: account3
        });

        marketInstance.getCommodityInfo(data_item_id, {
            from: account1
        }).then(
            function (result) {
                var data_status = result[3];
                assert.equal(data_status.toNumber(), 1, "status error");
                var priv_key = result[6];
                assert.equal(priv_key, aes_private, "aes_private error");
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
