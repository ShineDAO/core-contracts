await send({ method: 'evm_increaseTime', params:[seconds],}); // fast forward to 
await send({ method: 'evm_mine' }); // needed to run after the above command
await web3.eth.getBlock('latest'); // get the latest block