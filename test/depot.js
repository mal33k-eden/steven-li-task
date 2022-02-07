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
contract("Depot", function ([deployer, user_01, user_02]) {
  let token,oracle;
  before(async()=>{
     token = await Token.new();
     oracle = await Oracle.new();
     depot = await Depot.new();
    await token.transfer(user_01, tokens('5000000'))
    await oracle.setOperator(depot.address)
  })

  it("should assert true", async function () {
    await Depot.deployed();
    return assert.isTrue(true);
  });

  describe('Oracle Update', async ()=>{
    it("verify oracle contract address can be updated ", async ()=> {
      const result = await depot.setOracle(oracle.address)
      const event = result.logs[0].args 
      assert.equal(event._newOracle, oracle.address)
    });
    it("verify address other than admin cannot update oracle address", async ()=> {
      
      await expectRevert(depot.setOracle(oracle.address,{from:user_02}),"Ownable: caller is not the owner");
    });
})
  describe('Depot contract can record deposit', async ()=>{
    
    before(async()=>{
 
     await token.approve(depot.address, tokens('10000'), {from:user_01})
   })

    it("verify depot contract address can operate (write)", async ()=> {   
       const receipt = await depot.depositToken(token.address,tokens('10000'), {from:user_01, })
       expectEvent(receipt, 'DepotCreated', {
            _tokenAddress: token.address,
            _tokenSentBy: user_01,
            _operator: deployer,
            _tokenSent:tokens('10000').toString(),
        });
        //const event = result.logs[0].args
        //console.log(result)
      // assert.equal(event._tokenAddress, token.address)
      // assert.equal(event._tokenSentBy, user_01)
      // assert.equal(event._operator, deployer)
      // assert.equal(event._tokenSent.toString(), tokens('10000').toString()) 
    });
 
 
    
 
   })
});
