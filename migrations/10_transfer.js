

const ShineToken = artifacts.require("ShineToken");
const DefiOptionsSeed = artifacts.require("DefiOptionsSeed");

module.exports = async function (deployer, network, accounts) {
  if (network == "development") {
    const token = await ShineToken.deployed();
    const seedSale = await DefiOptionsSeed.deployed();

    await token.transfer(accounts[1], "1000000000000000000000000") // send 1M Shn to the second acc  
    await seedSale.setShineTokenAddress(token.address)
    // dont forget to set shineToken Address in remix in defioptions seed
  }

};

