// rate is how many TokenBits per wei
//for DOD seed it was 203333
// meaning

// 1 ETH is 4000 USD
// 1000000000000000000 wei = 4000 USD / 1000

// 1,000,000,000,000,000 = 4 USD / 100
// 10,000,000,000,000 = 0.04 USD / 4
// 2,500,000,000,000 = 0.01 USD == 10 ^ 18 TKNbits

// price of native token = 4000
// price of offered token in cents

// 1. find out how much is 1 cent in wei at current price
// multiply by the amount of cents token is offered for
// divide the token bits by amount of wei

function getTokenRate(nativeTokenPriceInUsd, offeredTokenPriceInUsd) {
  const oneUsdInWei = 1000000000000000000 / nativeTokenPriceInUsd ;
  //console.log("oneUsdInWei ", oneUsdInWei);
  const oneOfferedTokenInWei = oneUsdInWei * offeredTokenPriceInUsd;
  //console.log("oneOfferedTokenInWei ", oneOfferedTokenInWei);

  const rate = Math.pow(10, 18) / oneOfferedTokenInWei;
  console.log("rate ", rate);
  return rate;
}

getTokenRate(2.3, 0.049);


//getTokenRate(3000, 0.015);
