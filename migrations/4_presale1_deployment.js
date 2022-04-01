const ShineToken = artifacts.require("ShineToken");
const PreSale1 = artifacts.require("PreSale1");

module.exports = async function (deployer, network, accounts) {
  const token = await ShineToken.deployed();
  
  await deployer.deploy(PreSale1, 84000, accounts[0], token.address);
  const presale1 = await PreSale1.deployed();

  await token.transfer(presale1.address, "7000000000000000000000000") // transfer only 7 M

};

