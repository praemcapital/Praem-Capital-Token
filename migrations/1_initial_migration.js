const Praem = artifacts.require("Praem");

const BN = require("bn.js");

module.exports = function (deployer) {
    // 0
    //
    deployer.deploy(Praem, new BN(1609372800))
};
