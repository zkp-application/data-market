const BigNumber = artifacts.require("../github/solidity-BigNumber/contracts/BigNumber.sol");
const SolRsaVerify = artifacts.require("../github/SolRsaVerify/contracts/SolRsaVerify.sol");
const DataMarket = artifacts.require("DataMarket");

async function doDeploy(deployer) {
  await deployer.deploy(BigNumber);
  await deployer.deploy(SolRsaVerify);
  await deployer.link(SolRsaVerify, DataMarket);
  await deployer.link(BigNumber, DataMarket);
  await deployer.deploy(DataMarket);
}


module.exports = (deployer) => {
  deployer.then(async () => {
      await doDeploy(deployer);
  });
};
