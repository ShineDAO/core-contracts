const SeedCrowdsale = artifacts.require("../contracts/SeedCrowdsale.sol");
const ShineToken = artifacts.require("../contracts/ShineToken.sol");

async function getBalance(shineTokenInstance, address) {
  const balanceInWei = await shineTokenInstance.balanceOf(address);
  const balanceInTkn = web3.utils.fromWei(balanceInWei, "ether");
  return balanceInTkn;
}

contract("SeedCrowdsale", async (accounts) => {
  it("... Seed Sale contract has 12 M Shine tokens", async function () {
    const seedCrowdsaleInstance = await SeedCrowdsale.deployed();
    const shineTokenInstance = await ShineToken.deployed();

    const balanceInTkn = await getBalance(shineTokenInstance, seedCrowdsaleInstance.address);
    console.log("balance in tkns", balanceInTkn);

    assert.equal(balanceInTkn, 12000000);
  });

  it("... User is able to buy tokens", async function () {
    const seedCrowdsaleInstance = await SeedCrowdsale.deployed();
    const shineTokenInstance = await ShineToken.deployed();

    const balanceInTknBefore = await getBalance(shineTokenInstance, seedCrowdsaleInstance.address);
    console.log("balance before purchase", balanceInTknBefore);

    await seedCrowdsaleInstance.buyTokens(accounts[1], { from: accounts[1], value: "1000000000000000000" });

    const balanceInTknAfter = await getBalance(shineTokenInstance, seedCrowdsaleInstance.address);
    console.log("balance after purchase", balanceInTknAfter);
    assert.equal(balanceInTknBefore, 12000000);
    assert.equal(balanceInTknAfter, 11818182);
  });

  it("... User is not able to buy more tokens than in seedsale", async function () {
    const seedCrowdsaleInstance = await SeedCrowdsale.deployed();
    const shineTokenInstance = await ShineToken.deployed();

    const balanceInTknBefore = await getBalance(shineTokenInstance, seedCrowdsaleInstance.address);
    console.log("balance before purchase lots", balanceInTknBefore);

    try {
      await seedCrowdsaleInstance.buyTokens(accounts[1], { from: accounts[1], value: "99000000000000000000" });
    } catch (error) {
      let text = "sender doesn't have enough funds to send tx";
      assert(error.message.search(text) >= 0, "Expected throw, got '" + error + "' instead");
    }

    const balanceInTknAfter = await getBalance(shineTokenInstance, seedCrowdsaleInstance.address);
    console.log("balance after purchase lots", balanceInTknAfter);
    assert.equal(balanceInTknBefore, 11818182);
    assert.equal(balanceInTknAfter, 11818182);
  });
 
  
});
