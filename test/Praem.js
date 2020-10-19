const BN = require("bn.js");
const chai = require("chai");
const { expect, assert } = require("chai");
const helper = require("./utils/utils.js");
const expectRevert = require("./utils/expectRevert.js");
chai.use(require("chai-bn")(BN));


const PRAEM = artifacts.require('Praem');
const OPEN_TRANSFER_TIME = new BN(10);
const DECIMALS = new BN(8);
const TOKEN_AMOUNT = new BN((10 ** DECIMALS).toString());
const ETH_ZERO_ADDERSS = '0x0000000000000000000000000000000000000000';
const INITIAL_SUPPLY = new BN(20 * 10 ** 6 * 10 ** DECIMALS);

contract(
    'Praem-test',
    ([
        praemOwner,
        customer,
        whitelist1,
        whitelist2,
        whitelist3
    ]) => {
        let Praem;
        let timeDeploy;

        beforeEach(async () => {
            // Init contracts
            timeDeploy = new BN((await web3.eth.getBlock("latest")).timestamp);
            Praem = await PRAEM.new(timeDeploy.add(OPEN_TRANSFER_TIME), {from: praemOwner});
        })

        it("#0 deploy validation", async () => {
            expect(await Praem.name()).to.be.equals("Praem");
            expect(await Praem.symbol()).to.be.equals("PRM");
            expect(await Praem.decimals()).to.be.bignumber.that.equals(DECIMALS);
            expect(await Praem.totalSupply()).to.be.bignumber.that.equals(INITIAL_SUPPLY);
            expect(await Praem.balanceOf(praemOwner)).to.be.bignumber.that.equals(INITIAL_SUPPLY);
            expect(await Praem.openTransferTime()).to.be.bignumber.that.equals(timeDeploy.add(OPEN_TRANSFER_TIME));
            expect(await Praem.owner()).to.be.equals(praemOwner);
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(1));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);
        })

        it("#1 Check white lists", async () => {
            await Praem.addWhiteListTransfer(whitelist1, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(2));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);
            expect(await Praem.whiteListTransfer(1)).to.be.equals(whitelist1);

            await Praem.addWhiteListTransfer(whitelist2, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(3));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);
            expect(await Praem.whiteListTransfer(1)).to.be.equals(whitelist1);
            expect(await Praem.whiteListTransfer(2)).to.be.equals(whitelist2);

            await Praem.addWhiteListTransfer(whitelist3, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(4));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);
            expect(await Praem.whiteListTransfer(1)).to.be.equals(whitelist1);
            expect(await Praem.whiteListTransfer(2)).to.be.equals(whitelist2);
            expect(await Praem.whiteListTransfer(3)).to.be.equals(whitelist3);

            await Praem.removeWhiteListTransfer(whitelist2, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(3));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);
            expect(await Praem.whiteListTransfer(1)).to.be.equals(whitelist1);
            expect(await Praem.whiteListTransfer(2)).to.be.equals(whitelist3);

            await Praem.removeWhiteListTransfer(whitelist3, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(2));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);
            expect(await Praem.whiteListTransfer(1)).to.be.equals(whitelist1);

            await Praem.removeWhiteListTransfer(praemOwner, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(1));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(whitelist1);

            await Praem.removeWhiteListTransfer(whitelist1, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(0));

            await Praem.addWhiteListTransfer(praemOwner, {from: praemOwner});
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(1));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);

            await Praem.transferOwnership(whitelist1, {from: praemOwner});
            expect(await Praem.owner()).to.be.equals(whitelist1);
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(1));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(whitelist1);
        })

        it("#2 Check transfers", async () => {
            await Praem.transfer(customer, TOKEN_AMOUNT, {from: praemOwner});
            await expectRevert(Praem.transfer(whitelist1, TOKEN_AMOUNT, {from: customer}),
            "revert");

            await Praem.addWhiteListTransfer(whitelist1);
            expect(await Praem.whiteListTransferLen()).to.be.bignumber.that.equals(new BN(2));
            expect(await Praem.whiteListTransfer(0)).to.be.equals(praemOwner);
            expect(await Praem.whiteListTransfer(1)).to.be.equals(whitelist1);

            await Praem.transfer(whitelist1, TOKEN_AMOUNT, {from: praemOwner});
            await Praem.transfer(customer, TOKEN_AMOUNT, {from: whitelist1});
            await Praem.transfer(whitelist1, TOKEN_AMOUNT, {from: customer});

            expect(await Praem.balanceOf(customer)).to.be.bignumber.that.equals(TOKEN_AMOUNT);
            expect(await Praem.balanceOf(whitelist1)).to.be.bignumber.that.equals(TOKEN_AMOUNT);

            let timeNow = new BN((await web3.eth.getBlock("latest")).timestamp);
            await sleep(timeDeploy.add(OPEN_TRANSFER_TIME).sub(timeNow).sub(new BN(-1)).mul(new BN(1000)));

            await Praem.transfer(customer, TOKEN_AMOUNT, {from: praemOwner});
            await Praem.transfer(praemOwner, TOKEN_AMOUNT, {from: customer});
            await Praem.transfer(whitelist2, TOKEN_AMOUNT, {from: customer});
            expect(await Praem.balanceOf(customer)).to.be.bignumber.that.equals(new BN(0));
            expect(await Praem.balanceOf(whitelist2)).to.be.bignumber.that.equals(TOKEN_AMOUNT);
        })

        function sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
    }
)