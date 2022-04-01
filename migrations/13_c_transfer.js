const CSnapshot = artifacts.require("CSnapshot");

const aggregatedBalances = require("../parser/aggregatedBalances.json");

module.exports =  function (deployer, network, accounts) {
    console.log("accounts ", accounts )
    //await deployer.deploy(CSnapshot, 'CSnapshot', 'CSNAP', '100000000000000000000000000', {gasPrice: "225000000000", from: accounts[2] });
    const token = await CSnapshot.deployed();

    let res = await token.transfer("0x01cb39640424e1fa7cfd36d413516254b88a44bd", "500000", { gasPrice: "47000000000", from: accounts[2] }) // transfer 5 M to seed sale contract

    console.log(res)

    //truffle migrate --f 8 --to 8 --network fuji --skip-dry-run

};


//https://ethereum.stackexchange.com/questions/82384/how-to-act-as-another-wallet-when-using-truffle-exec-scripts