// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token  is ERC20{
  //using SafeMath for uint256;
  uint256 tSupply = 100 * 10**6 * (10 ** uint256(decimals()));
 
  constructor() ERC20("Token", "STK")  {
          _mint(msg.sender, tSupply);
  }


 

}
