const DefiOptionsToken = artifacts.require("DefiOptionsToken");
const DefiOptionsIdo = artifacts.require("DefiOptionsIdo");

module.exports = async function (deployer, network, accounts) {
    const token = await DefiOptionsToken.deployed();

    await deployer.deploy(DefiOptionsIdo, 203333, accounts[1], token.address, { from: accounts[1] }); //deployer.deploy(A, {gas: 4612388, from: "0x...."});
    const idoSale = await DefiOptionsIdo.deployed();

    await token.transfer(idoSale.address, "10000000000000000000000000", { gasPrice: "47000000000", from: accounts[1] }) // transfer 5 M to seed sale contract

};

