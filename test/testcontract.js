const SimpleContract = artifacts.require("../contracts/SimpleContract.sol");

contract("SimpleContract", async (accounts) => {
  it("... Should be able to store in item", async  function () {
    const simpleContractInstance =  await SimpleContract.deployed();

    //console.log("balance ", await simpleContractInstance.balance());
    const balance = await simpleContractInstance.setBalance(124)
    //console.log("bal", balance)
    //console.log("balance ", await simpleContractInstance.balance());
    //console.log("insta" , simpleContractInstance)

    //console.log("res, ", result);
    //assert.equal(true, false);
  });
});


