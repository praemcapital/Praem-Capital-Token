# Praem token

This is an implementation of the [ERC-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) fungible token standard for the Ethereum blockchain. It is needed for Praem ICO.

## Requirements

* NodeJS 9.0+ recommended.
* Windows, Linux or Mac OS X.

## Installation

Clone the repository and install the required `npm` dependencies:

```
$ git clone git@github.com:Rock-n-Block/Praem-token.git
$ cd Praem-token/
$ npm install
```

## Deploy

### Env file

Before deploy and verify need to make `"./.env"` file. In it there must be `mnemonic` and `api_etherscan` :

    mnemonic = "first second ..."
    api_etherscan = ABCD1234...

### Mainnet

    truffle deploy --network mainnet

### Ropsten

    truffle deploy --network ropsten

## Verify

### Mainnet

    truffle run verify Praem --network mainnet --license MIT

### Ropsten

    truffle run verify Praem --network ropsten --license MIT

## Interface

### Functions

It has default funcions of [ERC-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) standart and openzeppelin's [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.0/contracts/access/Ownable.sol). Also it has:

1) Function that sets opening time for transfers

        setOpenTransferTime(uint256 _openTransferTime) public onlyOwner

2) Function that adds address to the transfer's whitelist

        addWhiteListTransfer(address newAddress) public onlyOwner

3) Function that remove address from the transfer's whitelist

        removeWhiteListTransfer(address oldAddress) public onlyOwner

4) Function that returns length of transfer's whitelist

        whiteListTransferLen() public view returns(uint256)

5) Overload for transferOwnership function of openzeppelin's [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.0/contracts/access/Ownable.sol). Besides the transfer of ownership, it also removes the old owner from the transfer's whitelist and adds a new owner to this list.

        transferOwnership(address newOwner) public onlyOwner

### Variables

1) List of addresses of transfer's whitelist

        address[] public whiteListTransfer

2) Transfer's opening time

        uint256 public openTransferTime

## Licence

See [LICENSE](./LICENSE) for details.