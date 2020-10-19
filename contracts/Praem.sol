// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Praem is ERC20, Ownable
{
    using SafeMath for uint256;

    address[] public whiteListTransfer;
    uint256 public openTransferTime;

    constructor(uint256 _openTransferTime)
        public
        ERC20("Praem", "PRM")
    {
        _setupDecimals(8);
        whiteListTransfer.push(_msgSender());
        openTransferTime = 0;
        _mint(_msgSender(), 20 * (10 ** 6) * (10 ** uint256(decimals())));
        openTransferTime = _openTransferTime;
    }

    function setOpenTransferTime(uint256 _openTransferTime) public onlyOwner
    {
        openTransferTime = _openTransferTime;
    }

    function addWhiteListTransfer(address newAddress) public onlyOwner
    {
        uint256 findInd = _find(whiteListTransfer, newAddress);
        if (findInd >= whiteListTransfer.length)
            whiteListTransfer.push(newAddress);
    }

    function removeWhiteListTransfer(address oldAddress) public onlyOwner
    {
        uint256 findInd = _find(whiteListTransfer, oldAddress);
        uint256 len = whiteListTransfer.length;
        if (findInd < len)
        {
            whiteListTransfer[findInd] = whiteListTransfer[len - 1];
            whiteListTransfer.pop();
        }
    }

    function whiteListTransferLen() public view returns(uint256)
    {
        return whiteListTransfer.length;
    }

    function transferOwnership(address newOwner) public onlyOwner override {
        removeWhiteListTransfer(owner());
        addWhiteListTransfer(newOwner);
        super.transferOwnership(newOwner);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override
    {
        super._beforeTokenTransfer(from, to, amount);
        uint256 len = whiteListTransfer.length;
        if (_find(whiteListTransfer, from) == len)
        {
            require(now >= openTransferTime, "Praem: Contract does not open yet.");
            require(_find(whiteListTransfer, to)   != len, "Praem: At least one address must be in white list.");
        }
    }

    function _find(address[] memory list, address toFind) pure internal returns(uint256)
    {
        uint256 len = list.length;
        uint256 ind = 0;
        while(ind < len)
        {
            if (list[ind] == toFind)
                break;
            ++ind;
        }
        return ind;
    }
}