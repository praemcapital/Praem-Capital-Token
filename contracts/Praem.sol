// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Praem is ERC20, Ownable
{
    using SafeMath for uint256;

    uint256 public openTransferTime;

    constructor(uint256 _openTransferTime)
        public
        ERC20("Praem", "PRM")
    {
        _setupDecimals(8);
        openTransferTime = 0;
        _mint(_msgSender(), 20 * (10 ** 6) * (10 ** uint256(decimals())));
        openTransferTime = _openTransferTime;
    }

    function setOpenTransferTime(uint256 _openTransferTime) public onlyOwner
    {
        openTransferTime = _openTransferTime;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override
    {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(this))
            require(now >= openTransferTime ||
                    (
                        from == owner() ||
                        to == owner()
                    )
                   );
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