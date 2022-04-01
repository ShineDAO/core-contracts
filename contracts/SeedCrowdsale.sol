pragma solidity ^0.5.11;
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";

//https://forum.openzeppelin.com/t/simple-erc20-crowdsale/4863
//https://forum.openzeppelin.com/t/warning-the-extcodehash-instruction-is-not-supported-by-the-vm-version-byzantium-you-are-currently-compiling-for/1208

/**
 * @title SimpleCrowdsale
 * @dev This is an example of a fully fledged crowdsale.
 */
contract SeedCrowdsale is Crowdsale {
    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    ) public Crowdsale(rate, wallet, token) {}
}

//https://ethereum.stackexchange.com/questions/25089/allocating-unsold-tokens-at-the-end-of-a-crowdsale-to-a-specific-address