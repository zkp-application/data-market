const memory = artifacts.require("../github/ethereum/solidity-examples/Memory.sol");
const DataMarket = artifacts.require("DataMarket");

async function doDeploy(deployer) {
  await deployer.deploy(memory);
  await deployer.link(memory, DataMarket);
  await deployer.deploy(DataMarket);
}


module.exports = (deployer) => {
  deployer.then(async () => {
      await doDeploy(deployer);
  });
};
