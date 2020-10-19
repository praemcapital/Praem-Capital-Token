const Praem = artifacts.require("Praem");

const BN = require("bn.js");

module.exports = function (deployer) {
    // 0
    // 1610236800 -- Sun, 10 Jan 2021 00:00:00 GMT
    deployer.deploy(Praem, new BN(0))
};
