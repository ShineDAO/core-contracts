const ShineToken = artifacts.require("ShineToken");
const PreSale2 = artifacts.require("PreSale2");

module.exports = async function (deployer, network, accounts) {
  const token = await ShineToken.deployed();
  
  await deployer.deploy(PreSale2, 136571, accounts[0], token.address);
  const presale2 = await PreSale2.deployed();

  await token.transfer(presale2.address, "7000000000000000000000000") // transfer only 7 M

};

