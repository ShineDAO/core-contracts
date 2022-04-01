const PreSale2 = artifacts.require("../contracts/PreSale2.sol");
const ShineToken = artifacts.require("../contracts/ShineToken.sol");
const truffleAssert = require('truffle-assertions');


async function getBalance(shineTokenInstance, address) {
    const balanceInWei = await shineTokenInstance.balanceOf(address);
    const balanceInTkn = web3.utils.fromWei(balanceInWei, "ether");
    return balanceInTkn;
}


contract("PreSale2 ", async (accounts) => {
    it("... PreSale2 contract has 7 M Shine tokens", async function () {
        const preSale2Instance = await PreSale2.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTkn = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance in tkns", balanceInTkn);

        assert.equal(balanceInTkn, 7000000);
    });

    it("... User is able to buy tokens for 0.5 ETH in presale 2", async function () {
        const preSale2Instance = await PreSale2.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance before purchase", balanceInTknBefore);

        await preSale2Instance.buyTokens(accounts[1], { from: accounts[1], value: "500000000000000000" }); //0.5 ether

        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance after purchase", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 7000000);
        assert.equal(balanceInTknAfter, 6931714.5);
    });

    it("... User is not able to buy more 80 ETH worth of tokens in presale2", async function () {
        const preSale2Instance = await PreSale2.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance before purchase lots", balanceInTknBefore);

        await truffleAssert.reverts(
            preSale2Instance.buyTokens(accounts[1], { from: accounts[1], value: "80000000000000000000" }),//97 ethers
            "IndividuallyCappedCrowdsale: beneficiary's cap exceeded"
        );


        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6931714.5);
        assert.equal(balanceInTknAfter, 6931714.5);
    });


    it("... User is able to buy 0.3 ETH worth of tokens (total of 0.8 ETH so far) in presale2", async function () {
        const preSale2Instance = await PreSale2.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance before purchase 3 ETH", balanceInTknBefore);


        try {
            await preSale2Instance.buyTokens(accounts[1], { from: accounts[1], value: "300000000000000000" }); // 3 ether
        } catch (error) {
            let text = "sender doesn't have enough funds to send tx";
            assert(error.message.search(text) >= 0, "Expected throw, got '" + error + "' instead");
        }

        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6931714.5);
        assert.equal(balanceInTknAfter, 6890743.2);
    });

    it("... User is able to buy 0.2 more ETH worth of tokens (total of 1 ETH so far) in presale2", async function () {
        const preSale2Instance = await PreSale2.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance before purchase 1 more eth (total 5eth)", balanceInTknBefore);


        try {
            await preSale2Instance.buyTokens(accounts[1], { from: accounts[1], value: "200000000000000000" }); // 1 ether
        } catch (error) {
            let text = "sender doesn't have enough funds to send tx";
            assert(error.message.search(text) >= 0, "Expected throw, got '" + error + "' instead");
        }

        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6890743.2);
        assert.equal(balanceInTknAfter, 6863429);
    });

    

    it("... User is not able to buy 1 wei worth of tokens in presale2 (becase he has 1 eth and 1 wei total contribution)", async function () {
        const preSale2Instance = await PreSale2.deployed();
        const shineTokenInstance = await ShineToken.deployed();

        const balanceInTknBefore = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance before purchase lots", balanceInTknBefore);

        await truffleAssert.reverts(
            preSale2Instance.buyTokens(accounts[1], { from: accounts[1], value: "1" }),//1 wei
            "IndividuallyCappedCrowdsale: beneficiary's cap exceeded"
        );


        const balanceInTknAfter = await getBalance(shineTokenInstance, preSale2Instance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        assert.equal(balanceInTknBefore, 6863429);
        assert.equal(balanceInTknAfter, 6863429);
    });
});
