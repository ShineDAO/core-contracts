const ShineToken = artifacts.require("ShineToken");

module.exports = async function (deployer) {
    await deployer.deploy(ShineToken, 'Shine', 'SHN', '100000000000000000000000000');
};
