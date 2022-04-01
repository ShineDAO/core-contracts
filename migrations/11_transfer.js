

const ShineToken = artifacts.require("ShineToken");
const DefiOptionsSeed = artifacts.require("DefiOptionsSeed");


const SECONDS_IN_A_DAY = 86400;

module.exports = async function (deployer, network, accounts) {
  if (network == "development") {
    const token = await ShineToken.deployed();
    const seedSale = await DefiOptionsSeed.deployed();

    await token.transfer(accounts[5], "100000000000000000000000") // send 100k Shn to the second acc  
    await seedSale.setShineTokenAddress(token.address)
    // dont forget to set shineToken Address in remix in defioptions seed

    await seedSale.allowAllTierAccess(true)

  
  }

};

