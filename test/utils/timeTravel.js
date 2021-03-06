const BN = require('bn.js');

/**
 * Sets default properties on the jsonrpc object and promisifies it so we don't have to copy/paste everywhere.
 */
const send = payload => {
	if (!payload.jsonrpc) payload.jsonrpc = '2.0';
	if (!payload.id) payload.id = new Date().getTime();

	return new Promise((resolve, reject) => {
		web3.currentProvider.send(payload, (error, result) => {
			if (error) return reject(error);

			return resolve(result);
		});
	});
};


/**
 *  Mines a single block in Ganache (evm_mine is non-standard)
 */
const mineBlock = () => send({ method: 'evm_mine' });

const timeTravel = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}


/**
 *  Increases the time in the EVM.
 *  @param seconds Number of seconds to increase the time by
 */
 const fastForward = async seconds => {
	// It's handy to be able to be able to pass big numbers in as we can just
	// query them from the contract, then send them back. If not changed to
	// a number, this causes much larger fast forwards than expected without error.
	if (BN.isBN(seconds)) seconds = seconds.toNumber();

	// And same with strings.
	if (typeof seconds === 'string') seconds = parseFloat(seconds);

	await send({
		method: 'evm_increaseTime',
		params: [seconds],
	});

	await mineBlock();
};



/**
 *  Gets the time of the last block.
 */
 const currentTime = async () => {
	const { timestamp } = await web3.eth.getBlock('latest');
	return timestamp;
};


module.exports = {
	mineBlock,
	fastForward,
	currentTime,
};