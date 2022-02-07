const Token = artifacts.require("Token");
const Oracle = artifacts.require("Oracle");
const Depot = artifacts.require("Depot");

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy Oracle
  await deployer.deploy(Oracle);
  const oracle = await Oracle.deployed()

  // Deploy Depot
  await deployer.deploy(Depot);
  const depot = await Depot.deployed()
};