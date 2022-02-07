// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {

    event DepotCreated(
        address indexed _tokenAddress,
        address indexed _tokenSentBy,
        address indexed _operator,
        uint256  _tokenSent
    );
  struct DepotStruct {
      address _tokenAddress;
      address _tokenSentBy;
      uint256 _tokenSent;
  }
  modifier onlyOperators {
      require(canOperate(msg.sender), "You can not write to oracle");
      _;
  }
  mapping(uint256 => DepotStruct) DepotStructs; 
  mapping(address => uint256[])  DepotIds; 
  address  _operator; 

  constructor()  Ownable() {
       
  }

   /**verify operator **/
  function canOperate(address operator) public view returns (bool){
        if ((_operator == operator) ||  (owner() == operator)) {
            return true;
        } 
        return false;
  }
  function setOperator(address operator) public onlyOwner returns (bool){
      _operator = operator;
      return true;
  }
  /**generate unique Record ID. **/
  function createDepotKey(address beneficiary, uint identifier) internal view returns (uint256) {
      uint arrLen = DepotIds[beneficiary].length;
      uint enc = arrLen * block.timestamp + identifier;
      return uint256( keccak256( abi.encodePacked(enc, block.difficulty)));
  }

  /**create a deposit record. **/
  function recordDeposit(address tokenAddress, address sender, uint256 amount) public onlyOperators() returns (bool) { 
      uint key = createDepotKey(sender,amount);

      DepotStruct memory depot;
      depot._tokenAddress = tokenAddress;
      depot._tokenSentBy = sender;
      depot._tokenSent = amount;
      DepotStructs[key] = depot;
      DepotIds[sender].push(key);
      
      // emit event;
      emit DepotCreated(tokenAddress, sender,msg.sender,amount);
      return true;
  }

  /**get deposit IDs of user. **/
  function getDepotIds(address _beneficiary) public view returns (uint256[] memory) {
      return DepotIds[_beneficiary];
  }

  /**read deposit record. **/
  function getDepotRecord(uint depotId) public view returns (address,address,uint256){
      DepotStruct storage d = DepotStructs[depotId];
      return (d._tokenAddress,d._tokenSentBy,d._tokenSent);
  }

    /**Ownership transfer. **/
  function transferOwnership(address newOwner) public override virtual onlyOwner{
        super.transferOwnership(newOwner);
    }
   
}
