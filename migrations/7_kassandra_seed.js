const KSAT = artifacts.require("KSAT");
const KassandraSeed = artifacts.require("KassandraSeed");

module.exports = async function (deployer, network, accounts) {
    console.log("accounts ", accounts )
    await deployer.deploy(KSAT, 'KSAT coupon', 'KSAT', '100000000000000000000000000', {gasPrice: "225000000000", from: accounts[2] });
    const token = await KSAT.deployed();

    await deployer.deploy(KassandraSeed, 47, accounts[2], token.address, { gasPrice: "225000000000", from: accounts[2] }); //deployer.deploy(A, {gas: 4612388, from: "0x...."});
    const seedSale = await KassandraSeed.deployed();

    await token.transfer(seedSale.address, "2250000000000000000000000", { gasPrice: "47000000000", from: accounts[2] }) // transfer 225k to seed sale contract

    //truffle migrate --f 8 --to 8 --network fuji --skip-dry-run

};



// cassandra was in the wrong folder
// check build to see if its correct