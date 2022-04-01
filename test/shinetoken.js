const ShineToken = artifacts.require("../contracts/ShineToken.sol");

async function getBalance(shineTokenInstance, address) {
  const balanceInWei = await shineTokenInstance.balanceOf(address);
  const balanceInTkn = web3.utils.fromWei(balanceInWei, "ether");
  return balanceInTkn;
}

async function getTotalSupply(shineTokenInstance) {
  const totalSupplyInWei = await shineTokenInstance.totalSupply();
  const totalSupplyInTkn = web3.utils.fromWei(totalSupplyInWei, "ether");
  return totalSupplyInTkn;
}

contract("ShineToken", async (accounts) => {
  it("... Account that deployed the SHN contract has remaining tokens after seed sale, presale 1 and presale 2", async function () {
    const shineTokenInstance = await ShineToken.deployed();

    const balanceInTkn = await getBalance(shineTokenInstance, accounts[0]);
    assert.equal(balanceInTkn, 74000000);
  });

  it("... Total supply is correct", async function () {
    const shineTokenInstance = await ShineToken.deployed();

    let totalSupply = await getTotalSupply(shineTokenInstance);

    assert.equal(totalSupply, 100000000);
  });

  it("... User is able to transfer 1 SHN token", async function () {
    const shineTokenInstance = await ShineToken.deployed();

    let balanceInTknBefore = await getBalance(shineTokenInstance, accounts[0]);
    console.log("balance before ", balanceInTknBefore);
    await shineTokenInstance.transfer(accounts[1], "1000000000000000000");
    let balanceInTknAfter = await getBalance(shineTokenInstance, accounts[0]);
    console.log("balance after ", balanceInTknAfter);

    assert.notEqual(balanceInTknBefore, balanceInTknAfter);
  });

  it("... Hard Cap works", async function () {
    const shineTokenInstance = await ShineToken.deployed();

    try {
      await shineTokenInstance.mint(accounts[0], "1000000000000000000000000");
      let totalSupply = await getTotalSupply(shineTokenInstance);
      assert.notEqual(totalSupply, 101000000);
    } catch (err) {
      let totalSupply = await getTotalSupply(shineTokenInstance);
      assert.notEqual(totalSupply, 101000000);
    }
  });

  it("... Minting process for other users", async function () {
    const shineTokenInstance = await ShineToken.deployed();
    try {
      await shineTokenInstance.mint(accounts[1], "1000000000000000000000000", { from: accounts[1] });
      let totalSupply = await getTotalSupply(shineTokenInstance);
      assert.notEqual(totalSupply, 101000000);
    } catch (err) {
      let totalSupply = await getTotalSupply(shineTokenInstance);
      assert.notEqual(totalSupply, 101000000);
      //console.log("errrr", err);
    }
  });

  it("... Burning mechanism works", async function () {
    const shineTokenInstance = await ShineToken.deployed();

    try {
      await shineTokenInstance.burn("1000000000000000000000000", { from: accounts[0] });
      let totalSupply = await getTotalSupply(shineTokenInstance);
      assert.equal(totalSupply, 99000000);
    } catch (err) {
      let totalSupply = await getTotalSupply(shineTokenInstance);
      console.log("errrr", err);
      assert.equal(totalSupply, 100000000);
    }
  });

  it("... Burning mechanism for other users", async function () {
    const shineTokenInstance = await ShineToken.deployed();

    try {
      await shineTokenInstance.burn("1000000000000000000", { from: accounts[1] });
      let totalSupply = await getTotalSupply(shineTokenInstance);
      assert.equal(totalSupply, 98999999);
    } catch (err) {
      let totalSupply = await getTotalSupply(shineTokenInstance);
      console.log("errrr", err);
      assert.equal(totalSupply, 99000000);
    }
  });
});
