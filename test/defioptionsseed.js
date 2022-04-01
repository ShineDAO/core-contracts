
// Users are not able to buy tokens if the reference to SHN has not been set (done)
// only owner account (account[0]) is able to set a SHN token reference (done)
// User is not able to buy tokens without SHN (No Tier) (done)
// Random User is not able to set isSaleOpenForAll (done)
// User is not able to buy tokens if isSaleOpenForAll flag is present but he still doesn't have SHN tokens (done)
// Random User is not able to set relative cap (done)
// User is not able to withdraw tokens before buying (done)
// User is able to check that he has no tier even if he doenst have SHN (done)
// User is able to check his tier after getting some SHN ( works for tier1, tier2, and tier 3, and tier4) (done)
// User with Shine is able to buy tokens (done)
// User is not able to exceed his cap (for all tiers) (done)
// Buying very small amounts is reject because of percentage calculation (done)
// User is able to purchase tokens if he has tier 2 (and _isSaleOpenForAll is set to True) (done)
// user is not able to witdhraw tokens if vesting is not expired (done)
// user is able to withdraw tokens if vesting is expired (await timeTravel(SECONDS_IN_A_DAY * 2)) (done)
// Random user is not able to transfer ownership (done)
// Owner user is able to transfer ownership (done)
// Random User is not able to call transfer in "__unstable__TokenVault" contract (done)
// Random User is not able to transfer ownership in "__unstable__TokenVault" contract (done)

const ShineToken = artifacts.require("../contracts/ShineToken.sol");
const DefiOptionsSeed = artifacts.require("../contracts/DefiOptionsSeed.sol");
const DefiOptionsToken = artifacts.require("../contracts/DefiOptionsToken.sol");
const __unstable__TokenVault = artifacts.require("__unstable__TokenVault");
const truffleAssert = require('truffle-assertions');
const testUtils = require("./utils/timeTravel.js");
const SECONDS_IN_A_DAY = 86400;

async function getBalance(tokenInstance, address) {
    const balanceInWei = await tokenInstance.balanceOf(address);
    const balanceInTkn = web3.utils.fromWei(balanceInWei, "ether");
    return balanceInTkn;
}

contract("Defi Options Seed ", async (accounts) => {
    let shineTokenInstance, defiOptionsSeedInstance, defiOptionsTokenInstance


    beforeEach(async () => {
        shineTokenInstance = await ShineToken.deployed();
        defiOptionsSeedInstance = await DefiOptionsSeed.deployed();
        defiOptionsTokenInstance = await DefiOptionsToken.deployed();

    });


    it("... Seed contract has 10M DOD tokens", async function () {
        const balanceInTkn = await getBalance(defiOptionsTokenInstance, defiOptionsSeedInstance.address);
        console.log("balance in tkns", balanceInTkn);

        assert.equal(balanceInTkn, 5000000);
    });

    it("Users are not able to buy tokens if the reference to SHN has not been set", async function () {
        const shineUserBalance0 = await getBalance(shineTokenInstance, accounts[0])
        console.log(" shine balance 0", shineUserBalance0)

        const shineUserBalance1 = await getBalance(shineTokenInstance, accounts[1])
        console.log(" shine balance 1", shineUserBalance1)

        const balanceInTknBefore = await getBalance(defiOptionsTokenInstance, defiOptionsSeedInstance.address);
        console.log("balance before purchase ", balanceInTknBefore);

        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[0], { from: accounts[0], value: "100000000000000000" }),//0.1 ethers
            "Reference to the Shine Token contract has not been set"
        );

        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[1], { from: accounts[1], value: "100000000000000000" }),//0.1 ethers
            "Reference to the Shine Token contract has not been set"
        );

        await truffleAssert.passes(
            defiOptionsSeedInstance.setShineTokenAddress(shineTokenInstance.address, { from: accounts[0] })
        );


        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[1], { from: accounts[1], value: "100000000000000000" }),//0.1 ethers
            "Currently you are below Tier 1 level, but you need to be at least Tier3 in order to participate in the seed sale"
        );

        //await defiOptionsSeedInstance.setShineTokenAddress(shineTokenInstance.address)

        //const tier = await defiOptionsSeedInstance.getTier("15000000000000000000000")
        //console.log("the tier is ", tier)

        const balanceInTknAfter = await getBalance(defiOptionsTokenInstance, defiOptionsSeedInstance.address);
        console.log("balance after purchase lots", balanceInTknAfter);
        //assert.equal(balanceInTknBefore, 6931714.5);
        //assert.equal(balanceInTknAfter, 6931714.5);
    });

    it("only owner account (account[0]) is able to set a SHN token reference", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.setShineTokenAddress(shineTokenInstance.address, { from: accounts[1] }),
            "Ownable: caller is not the owner."
        );

    });


    it("User is not able to buy tokens without SHN (No Tier)", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[1], { from: accounts[1], value: "100000000000000000" }),//0.1 ethers
            "Currently you are below Tier 1 level, but you need to be at least Tier3 in order to participate in the seed sale"
        );
    });

    it("Random User is not able to set isSaleOpenForAll", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.allowAllTierAccess(true, { from: accounts[1] }),
            "Ownable: caller is not the owner."
        );

        await truffleAssert.passes(
            defiOptionsSeedInstance.allowAllTierAccess(true, { from: accounts[0] })
        );

    });

    it("User is not able to buy tokens if isSaleOpenForAll flag is present but he still doesn't have SHN tokens", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[1], { from: accounts[1], value: "10000000000000000" }),//0.01 ethers
            "Currently you are below Tier 1 level, but you need to be at least Tier3 in order to participate in the seed sale"
        );
    });

    it("Random User is not able to set relative cap", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.setRelativeCap("88476661622527504", { from: accounts[1] }),
            "Ownable: caller is not the owner."
        );
    });

    it("User is not able to withdraw tokens before buying", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.withdrawTokens(accounts[1], { from: accounts[1] }),
            "PostDeliveryCrowdsale: beneficiary is not due any tokens"
        );
    });

    it("User is able to check that he has no tier even if he doenst have SHN", async function () {
        const shnBalance = await getBalance(shineTokenInstance, accounts[1]);
        console.log("bla ", shnBalance)

        const tier = await defiOptionsSeedInstance.getTier(shnBalance, { from: accounts[2] })
        console.log("tier ", tier.words[0])
        assert.equal(tier.words[0], 0)

    });

    it("User is able to check his tier after getting some SHN ( works for tier1, tier2, and tier 3, and tier4)", async function () {
        await shineTokenInstance.transfer(accounts[1], "15000000000000000000000", { from: accounts[0] }) //15k SH        
        const shnBalance1 = await defiOptionsSeedInstance.getShineTokenBalance(accounts[1])
        const tier1 = await defiOptionsSeedInstance.getTier(shnBalance1, { from: accounts[1] })
        assert.equal(tier1.words[0], 1)


        await shineTokenInstance.transfer(accounts[1], "35000000000000000000000", { from: accounts[0] }) //35k SHN
        const shnBalance2 = await defiOptionsSeedInstance.getShineTokenBalance(accounts[1])
        const tier2 = await defiOptionsSeedInstance.getTier(shnBalance2, { from: accounts[1] })
        assert.equal(tier2.words[0], 2)


        await shineTokenInstance.transfer(accounts[1], "150000000000000000000000", { from: accounts[0] }) //150k SHN
        const shnBalance3 = await defiOptionsSeedInstance.getShineTokenBalance(accounts[1])
        const tier3 = await defiOptionsSeedInstance.getTier(shnBalance3, { from: accounts[1] })
        assert.equal(tier3.words[0], 3)

    });

    it("User with Shine is able to buy tokens", async function () {
        const contribution = await defiOptionsSeedInstance.getContribution(accounts[1])
        assert.equal(contribution, 0)

        const balanceInTknBefore = await getBalance(defiOptionsTokenInstance, accounts[1]);
        assert.equal(balanceInTknBefore, 0)

        await truffleAssert.passes(
            defiOptionsSeedInstance.buyTokens(accounts[1], { from: accounts[1], value: "100000000000000000" }),//0.1 ethers
        );

        const contribution1 = await defiOptionsSeedInstance.getContribution(accounts[1])
        assert.equal(contribution1, "100000000000000000")

        const balanceInTknAfter = await getBalance(defiOptionsTokenInstance, accounts[1]); 
        assert.equal(balanceInTknAfter, 5083.325) // only 25% of tokens are delivered immediately (total is 20,333.3 
    });

    it("User is not able to exceed his cap (for all tiers)", async function () {
        await shineTokenInstance.transfer(accounts[2], "15000000000000000000000", { from: accounts[0] }) //15k SH    

        await truffleAssert.passes(
            defiOptionsSeedInstance.buyTokens(accounts[2], { from: accounts[2], value: "1000000" }), //0.001 ETH, around 3.05 USD
        );

        await truffleAssert.passes(
            defiOptionsSeedInstance.buyTokens(accounts[2], { from: accounts[2], value: "71000000000000000" }), //0.071 ETH, around 216.55 USD if ETH is 3050 USD
        );

        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[2], { from: accounts[2], value: "400000000000000000" }), //0.4 ETH, around 1220 USD if ETH is 3050 USD, reverts because cap of 1k USD is exceeded for Tier 1.
            "Relative cap exceeded for Tier 1, consider getting into the next tier"
        );

        await shineTokenInstance.transfer(accounts[2], "35000000000000000000000", { from: accounts[0] }) //35k SH    

        await truffleAssert.passes(
            defiOptionsSeedInstance.buyTokens(accounts[2], { from: accounts[2], value: "71000000000000000" }), //0.071 ETH, around 216.55 USD if ETH is 3050 USD
        );


        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[2], { from: accounts[2], value: "1000000000000000000" }), //1 ETH, 3050 USD if ETH is 3050 USD, reverts because cap of 2k USD is exceeded for Tier 2.
            "Relative cap exceeded for Tier 2, consider getting into the next tier"
        );

        await shineTokenInstance.transfer(accounts[2], "350000000000000000000000", { from: accounts[0] }) //350k SH    
        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[2], { from: accounts[2], value: "4000000000000000000" }), //4 ETH, around 12,220 USD if ETH is 3050 USD. at this levvel cap is 8k USD
            "Relative cap exceeded for Tier 4"
        );
    });

    it("Buying very small amounts is reject because of percentage calculation", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.buyTokens(accounts[1], { from: accounts[1], value: "1" }),
            "The amount that is being bought is too small to split it partially for vesting"
        );
    });

    it("User is able to purchase tokens if he has tier 2 (and _isSaleOpenForAll is set to True)", async function () {
        await shineTokenInstance.transfer(accounts[3], "15000000000000000000000", { from: accounts[0] }) //15k SH    

        await truffleAssert.passes(
            defiOptionsSeedInstance.buyTokens(accounts[3], { from: accounts[3], value: "1000000" }),
        );
    });

    it("user is not able to witdhraw tokens if vesting is not expired", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.withdrawTokens(accounts[1], { from: accounts[1] }),
            "Vesting: the time required for vesting is not expired yet"
        );
    });

    it("user is able to withdraw tokens if vesting is expired (await timeTravel(SECONDS_IN_A_DAY * 2))", async function () {
        console.log("current time ", await testUtils.currentTime());
        await testUtils.fastForward(SECONDS_IN_A_DAY * 101);
        console.log("current time after ", await testUtils.currentTime());


        const balanceInTknBefore = await getBalance(defiOptionsTokenInstance, accounts[1]);
        assert.equal(balanceInTknBefore, 5083.325) // only 25% of tokens are delivered immediately (total is 20,333.3)

        await truffleAssert.passes(
            defiOptionsSeedInstance.withdrawTokens(accounts[1], { from: accounts[1] }),
        );

        const balanceInTknAfter = await getBalance(defiOptionsTokenInstance, accounts[1]);
        assert.equal(balanceInTknAfter, 20333.3) //  (total is 20,333.3 
    });


    it("Random user is not able to transfer ownership ", async function () {
        await truffleAssert.reverts(
            defiOptionsSeedInstance.transferOwnership(accounts[3], { from: accounts[1] }),
            "Ownable: caller is not the owner"
        );
    });


    it("Owner user is able to transfer ownership", async function () {
        await truffleAssert.passes(
            defiOptionsSeedInstance.transferOwnership(accounts[3], { from: accounts[0] }),
        );
    });

    it("Random User is not able to call transfer in __unstable__TokenVault contract", async function () {
        const vaultAddress = await defiOptionsSeedInstance.vault()
        __unstable__TokenVaultInstance = await __unstable__TokenVault.at(vaultAddress);

        await truffleAssert.reverts(
            __unstable__TokenVaultInstance.transfer(defiOptionsTokenInstance.address, accounts[1], "10000", { from: accounts[0] }),
            "Secondary: caller is not the primary account"
        );

        await truffleAssert.reverts(
            __unstable__TokenVaultInstance.transfer(defiOptionsTokenInstance.address, accounts[1], "10000", { from: accounts[1] }),
            "Secondary: caller is not the primary account"
        );
    });

    it("Random User is not able to transfer ownership in __unstable__TokenVault contract", async function () {
        const vaultAddress = await defiOptionsSeedInstance.vault()
        __unstable__TokenVaultInstance = await __unstable__TokenVault.at(vaultAddress);

        await truffleAssert.reverts(
            __unstable__TokenVaultInstance.transferPrimary(accounts[1], { from: accounts[0] }),
            "Secondary: caller is not the primary account"
        );
    });
});





