pragma solidity ^0.5.11;
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";

contract PreSale1 is Crowdsale {
    using SafeMath for uint256;
    mapping(address => uint256) private _contributions;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    ) public Crowdsale(rate, wallet, token) {}
    
     function getContribution(address beneficiary) public view returns (uint256) {
        return _contributions[beneficiary];
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(_contributions[beneficiary].add(weiAmount) <= 5000000000000000000, "IndividuallyCappedCrowdsale: beneficiary's cap exceeded");
        //require(weiAmount <= 5000000000000000000);
        // solhint-disable-next-line max-line-length
        //require(_contributions[beneficiary].add(weiAmount) <= _caps[beneficiary], "IndividuallyCappedCrowdsale: beneficiary's cap exceeded");
    }

     function _updatePurchasingState(address beneficiary, uint256 weiAmount) internal {
        super._updatePurchasingState(beneficiary, weiAmount);
        _contributions[beneficiary] = _contributions[beneficiary].add(weiAmount);
    }

}
