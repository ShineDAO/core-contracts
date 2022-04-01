const KSAT = artifacts.require("KSAT");
const aggregatedBalances = require("../parser/aggregatedBalances.json");

const transferTokens = async function transferTokens(
  token,
  key,
  value,
  accounts
) {
  await token.transfer(key, web3.utils.toWei(value), {
    gasPrice: "47000000000",
    from: accounts[2],
  }); // transfer 5 M to seed sale contract

  // ...
};
module.exports = async function (deployer, network, accounts) {
  console.log("network ", network);

  console.log("accounts ", accounts);
  //await deployer.deploy(KSAT, 'KSAT', 'KSAT', '100000000000000000000000000', {gasPrice: "225000000000", from: accounts[2] });

  deployer.then(async () => {
    const token = await KSAT.deployed();

    //console.log("aggregatedBalances ", aggregatedBalances);
    //console.log("tokk", token);
    let total = 0;
    let promiseArray = [];

    let keys = [];
    let values = [];

    for (var address in aggregatedBalances) {
      if (aggregatedBalances.hasOwnProperty(address)) {
        keys.push(address);
        values.push(aggregatedBalances[address]);
      }
    }

    token.transfer(keys[4], web3.utils.toWei(values[4]), {
      gasPrice: "47000000000",
      from: accounts[2],
    });

    let promiseChain = Promise.resolve();
    keys.forEach((key, index) => {
      promiseChain = promiseChain.then(() => {
        token
          .transfer(key, web3.utils.toWei(values[index]), {
            gasPrice: "47000000000",
            from: accounts[2],
          })
          .then((result) => {
            console.log("finished  ", result);
          });
      });
    });
    await promiseChain;

    //https://github.com/trufflesuite/truffle/issues/501

    //console.log("keys ", keys);
    //console.log("values ", values);

    //return Promise.all(promiseArray);
  });

  //truffle migrate --f 8 --to 8 --network fuji --skip-dry-run
};
