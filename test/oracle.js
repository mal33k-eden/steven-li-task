const Oracle = artifacts.require("Oracle");
const Depot = artifacts.require("Depot");
const Token = artifacts.require("Token");
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}
contract("Oracle", function ([deployer, user_01, user_02]) {
  let token,oracle;
  before(async()=>{
     token = await Token.new();
     oracle = await Oracle.new();
    await token.transfer(user_01, tokens('1000000'))
  })
  it("should assert true", async function () {
    await Oracle.deployed();
    return assert.isTrue(true);
  });

  describe('Only Operators can record deposit', async ()=>{
    
   it("verify address can operate (write)", async ()=> {   
      const result = await oracle.canOperate(deployer)
      return assert.isTrue(result);
   });

   it("owner can record manually", async ()=> {
      const result = await oracle.recordDeposit(token.address,user_01, tokens('10000'),{from:deployer})
      const event = result.logs[0].args
      assert.equal(event._tokenAddress, token.address)
      assert.equal(event._tokenSentBy, user_01)
      assert.equal(event._operator, deployer)
      assert.equal(event._tokenSent.toString(), tokens('10000').toString()) 
   });

 
    it("verify address other than admin cannot record depot", async ()=> {
      await expectRevert(oracle.recordDeposit(token.address,user_01, tokens('10000'),{from:user_01}),"You can not write to oracle");
    });

  })


});
