const BlockchainHealthRecord = artifacts.require("BlockchainHealthRecord");

module.exports = function(deployer) {
  deployer.deploy(BlockchainHealthRecord);
};
