const PreSale1 = artifacts.require("../contracts/PreSale1.sol");
const ShineToken = artifacts.require("../contracts/ShineToken.sol");
const truffleAssert = require('truffle-assertions');


async function getBalance(shineTokenInstance, address) {
    const balanceInWei = await shineTokenInstance.balanceOf(address);
    const balanceInTkn = web3.utils.fromWei(balanceInWei, "ether");
    return balanceInTkn;
}


contract("PreSale1 ", async (accounts) => {
    it("... PreSale1 contract has 7 M Shine tokens", async function () {
        const preSale1Instance = await PreSale1.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTkn = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance in tkns", balanceInTkn);

        assert.equal(balanceInTkn, 7000000);
    });

    it("... User is able to buy tokens for 1 ETH in presale 1", async function () {
        const preSale1Instance = await PreSale1.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance before purchase", balanceInTknBefore);

        await preSale1Instance.buyTokens(accounts[1], { from: accounts[1], value: "1000000000000000000" }); //1 ether

        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance after purchase", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 7000000);
        assert.equal(balanceInTknAfter, 6916000);
    });

    it("... User is not able to buy more 80 ETH worth of tokens in presale1", async function () {
        const preSale1Instance = await PreSale1.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance before purchase lots", balanceInTknBefore);

        await truffleAssert.reverts(
            preSale1Instance.buyTokens(accounts[1], { from: accounts[1], value: "80000000000000000000" }),//97 ethers
            "IndividuallyCappedCrowdsale: beneficiary's cap exceeded"
        );


        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6916000);
        assert.equal(balanceInTknAfter, 6916000);
    });


    it("... User is able to buy 3 ETH worth of tokens (total of 4 ETH so far) in presale1", async function () {
        const preSale1Instance = await PreSale1.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance before purchase 3 ETH", balanceInTknBefore);


        try {
            await preSale1Instance.buyTokens(accounts[1], { from: accounts[1], value: "3000000000000000000" }); // 3 ether
        } catch (error) {
            let text = "sender doesn't have enough funds to send tx";
            assert(error.message.search(text) >= 0, "Expected throw, got '" + error + "' instead");
        }

        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6916000);
        assert.equal(balanceInTknAfter, 6664000);
    });

    it("... User is able to buy 1 more ETH worth of tokens (total of 5 ETH so far) in presale1", async function () {
        const preSale1Instance = await PreSale1.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance before purchase 1 more eth (total 5eth)", balanceInTknBefore);


        try {
            await preSale1Instance.buyTokens(accounts[1], { from: accounts[1], value: "1000000000000000000" }); // 1 ether
        } catch (error) {
            let text = "sender doesn't have enough funds to send tx";
            assert(error.message.search(text) >= 0, "Expected throw, got '" + error + "' instead");
        }

        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6664000);
        assert.equal(balanceInTknAfter, 6580000);
    });

    

    it("... User is not able to buy 1 wei worth of tokens in presale1 (becase he has 5 eth and 1 wei total contribution)", async function () {
        const preSale1Instance = await PreSale1.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance before purchase lots", balanceInTknBefore);

        await truffleAssert.reverts(
            preSale1Instance.buyTokens(accounts[1], { from: accounts[1], value: "1" }),//1 wei
            "IndividuallyCappedCrowdsale: beneficiary's cap exceeded"
        );


        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale1Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6580000);
        assert.equal(balanceInTknAfter, 6580000);
    });
});
