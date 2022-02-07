// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Oracle.sol";

contract Depot  is Ownable{
    
    Oracle _oracle;

    constructor() Ownable(){

    }
    event OracleUpdated(address _newOracle);
    /**Set the Oracle address. **/
    function setOracle(Oracle oracle) public onlyOwner returns (bool) {
        _oracle = oracle;
        emit OracleUpdated(address(oracle));
        return true;
    }
    function depositToken(address tokenAddress,uint256 _amount) public returns (bool success) {
        // Perform deposit : Allowance would have been fulfiled
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        // record event in Oracle
        require(_oracle.recordDeposit(tokenAddress, msg.sender, _amount), 'There was an issue recording the deposit action');   
        return true;
    }
    /**Ownership transfer. **/
    function transferOwnership(address newOwner) public override virtual onlyOwner{
        super.transferOwnership(newOwner);
    }

    // function withdraw() public returns (bool success){
       
    // }
    

 
       
}
