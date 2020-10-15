const Praem = artifacts.require("Praem");

const BN = require("bn.js");

module.exports = function (deployer) {
  deployer.deploy(Praem, new BN(1))
};
