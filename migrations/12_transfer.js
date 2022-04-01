

const ShineToken = artifacts.require("ShineToken");
const DefiOptionsSeed = artifacts.require("DefiOptionsSeed");


module.exports = async function (deployer, network, accounts) {
  if (network == "development") {
    const token = await ShineToken.deployed();
    //const seedSale = await DefiOptionsSeed.deployed();

    await token.transfer(accounts[3], "15000000000000000000000") // send 15k Shn to the first acc  
    await token.transfer(accounts[4], "50000000000000000000000") // send 50k Shn to the second acc  
    await token.transfer(accounts[5], "200000000000000000000000") // send 200k Shn to the third acc  
    await token.transfer(accounts[6], "400000000000000000000000") // send 400 Shn to the fourth acc  



   // await seedSale.setShineTokenAddress(token.address)
    // dont forget to set shineToken Address in remix in defioptions seed

   // await seedSale.allowAllTierAccess(true)

  
  }

};

