const FraudRegistry = artifacts.require("FraudRegistry");

module.exports = function(deployer) {
  deployer.deploy(FraudRegistry);
};