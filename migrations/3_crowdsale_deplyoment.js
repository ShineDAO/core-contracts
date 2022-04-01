const ShineToken = artifacts.require("ShineToken");
const SeedCrowdsale = artifacts.require("SeedCrowdsale");

module.exports = async function (deployer, network, accounts) {
  const token = await ShineToken.deployed();
  
  await deployer.deploy(SeedCrowdsale, 181818, accounts[0], token.address);
  const crowdsale = await SeedCrowdsale.deployed();

  await token.transfer(crowdsale.address, "12000000000000000000000000") // transfer only 12 M

};
