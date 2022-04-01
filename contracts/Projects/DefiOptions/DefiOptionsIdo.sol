pragma solidity ^0.5.11;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Secondary.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "../../ShineToken.sol";

contract DefiOptionsIdo is Crowdsale, Ownable{
    using SafeMath for uint256;
    enum Tiers {NoTier, Tier1, Tier2, Tier3, Tier4 }
    uint256 public relativeCap = 327868852500000000;
    bool public isSaleOpenForAll;
    mapping(address => uint256) public contributions;
    mapping(address => uint256) public vestedBalances;
    mapping(address => uint256) public vestingPeriod;
    ShineToken public shineToken; 
    __unstable__TokenVault public vault;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    ) public Crowdsale(rate, wallet, token) {
        vault = new __unstable__TokenVault();
    }
    
    function setRelativeCap(uint256 _relativeCap) public onlyOwner {
        relativeCap = _relativeCap;
    }
    function setShineTokenAddress(address tokenAddress) public onlyOwner {
        shineToken = ShineToken(tokenAddress);
    }

    function allowAllTierAccess(bool _isSaleOpenForAll) public onlyOwner {
        isSaleOpenForAll = _isSaleOpenForAll;
    }


    function getShineTokenBalance(address beneficiary) public view returns (uint256) {
        require(address(shineToken) != address(0), "Reference to the Shine Token contract has not been set");
        return shineToken.balanceOf(beneficiary);
    }

    function getTier(uint256 shineBalance) public pure returns (Tiers){
        if (shineBalance < 15000000000000000000000){
            return Tiers.NoTier;
        }else if(shineBalance >= 15000000000000000000000 && shineBalance < 50000000000000000000000){
            return Tiers.Tier1;
        }else if(shineBalance >= 50000000000000000000000 && shineBalance < 200000000000000000000000){
            return Tiers.Tier2;
        }else if(shineBalance >= 200000000000000000000000 && shineBalance < 400000000000000000000000){
            return Tiers.Tier3;
        }else if (shineBalance >= 400000000000000000000000){
            return Tiers.Tier4;
        }
    }

    function getContribution(address beneficiary) public view returns (uint256) {
        return contributions[beneficiary];
    }

    function _updatePurchasingState(address beneficiary, uint256 weiAmount) internal {
        uint256 shineBalance = getShineTokenBalance(beneficiary);
        
        Tiers tier = getTier(shineBalance);
        require(tier != Tiers.NoTier, "Currently you are below Tier 1 level, but you need to be at least Tier3 in order to participate in the seed sale");
        require(tier != Tiers.Tier1 || isSaleOpenForAll, "You are Tier 1, but you need to be Tier3 in order to participate in the seed sale");
        require(tier != Tiers.Tier2 || isSaleOpenForAll, "You are Tier 2, but You need to be Tier3 in order to participate in the seed sale");
        
        if(tier == Tiers.Tier1){ // do we need isSaleOpenForAll again to check?
            require(contributions[beneficiary].add(weiAmount) <= relativeCap.mul(1), "Relative cap exceeded for Tier 1, consider getting into the next tier");
        }else if(tier == Tiers.Tier2){ 
            require(contributions[beneficiary].add(weiAmount) <= relativeCap.mul(2), "Relative cap exceeded for Tier 2, consider getting into the next tier");
        }else if(tier == Tiers.Tier3){
            require(contributions[beneficiary].add(weiAmount) <= relativeCap.mul(4), "Relative cap exceeded for Tier 3, consider getting into the next tier");
        }else if(tier == Tiers.Tier4){
            require(contributions[beneficiary].add(weiAmount) <= relativeCap.mul(8), "Relative cap exceeded for Tier 4");
        }

        contributions[beneficiary] = contributions[beneficiary].add(weiAmount);
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal {
        require((tokenAmount.div(100)).mul(100) == tokenAmount, 'The amount that is being bought is too small to split it partially for vesting');
        vestedBalances[beneficiary] = vestedBalances[beneficiary].add(tokenAmount.mul(75).div(100));

        vestingPeriod[beneficiary] = block.timestamp + 100 days;

        // deliver only 25% now
        _deliverTokens(beneficiary, tokenAmount.mul(25).div(100));
     
        // deliver the rest 75% to the vault 
        _deliverTokens(address(vault), tokenAmount.mul(75).div(100));
    }

    function withdrawTokens(address beneficiary) public {
        uint256 amount = vestedBalances[beneficiary];
        require(amount > 0, "PostDeliveryCrowdsale: beneficiary is not due any tokens");
        require(block.timestamp >= vestingPeriod[beneficiary], "Vesting: the time required for vesting is not expired yet");

        vestedBalances[beneficiary] = 0;
        vault.transfer(token(), beneficiary, amount);
    }

}

contract __unstable__TokenVault is Secondary {
    function transfer(IERC20 token, address to, uint256 amount) public onlyPrimary {
        token.transfer(to, amount);
    }
}

