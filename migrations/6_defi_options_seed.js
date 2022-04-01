const DefiOptionsToken = artifacts.require("DefiOptionsToken");
const DefiOptionsSeed = artifacts.require("DefiOptionsSeed");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(DefiOptionsToken, 'DefiOptions', 'DOD', '100000000000000000000000000', { from: accounts[1] });
    const token = await DefiOptionsToken.deployed();

    await deployer.deploy(DefiOptionsSeed, 203333, accounts[1], token.address, { from: accounts[1] }); //deployer.deploy(A, {gas: 4612388, from: "0x...."});
    const seedSale = await DefiOptionsSeed.deployed();

    await token.transfer(seedSale.address, "5000000000000000000000000", { gasPrice: "47000000000", from: accounts[1] }) // transfer 5 M to seed sale contract


};

