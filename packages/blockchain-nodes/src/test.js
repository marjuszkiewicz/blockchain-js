const blockchain = require('./blockchain');

const coin = blockchain()
  .createNewBlock(100, '0', '0');

const bc = {
  chain: [{
    index: 1, timestamp: 1643357898847, transactions: [], nonce: 100, hash: '0', previousBlockHash: '0',
  }, {
    index: 2, timestamp: 1643357914756, transactions: [], nonce: 18140, hash: '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100', previousBlockHash: '0',
  }, {
    index: 3,
    timestamp: 1643357917242,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: 'b8272baf55d7c90e4ff954554a399742',
    }],
    nonce: 216425,
    hash: '00003920f9e5a7a53825f6cfa4ff49b27e0f0a56cae3c48699f72979a8d25dd5',
    previousBlockHash: '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100',
  }, {
    index: 4,
    timestamp: 1643357918996,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: 'c2eaa849060846d8863b66b869ffa2a8',
    }],
    nonce: 1964,
    hash: '000035054242435ce7e67825e832cfae7830103bcc7c30bff72f718e4ed4fa04',
    previousBlockHash: '00003920f9e5a7a53825f6cfa4ff49b27e0f0a56cae3c48699f72979a8d25dd5',
  }, {
    index: 5,
    timestamp: 1643357919842,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: 'd18ae5cdedf23e8cbca4799bb05b3272',
    }],
    nonce: 33663,
    hash: '00000db21e1fd1a272c01b2881764870393ad32800d158f4850117933e7d91a7',
    previousBlockHash: '000035054242435ce7e67825e832cfae7830103bcc7c30bff72f718e4ed4fa04',
  }, {
    index: 6,
    timestamp: 1643357920744,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: '1720abdcaca520aa5acb7faa6ad6b98c',
    }],
    nonce: 105108,
    hash: '0000114c8d94bcd11dd2c7be84f1f9e40936ae6c58dda6170d0ad170428cf5e5',
    previousBlockHash: '00000db21e1fd1a272c01b2881764870393ad32800d158f4850117933e7d91a7',
  }, {
    index: 7,
    timestamp: 1643357922082,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: '267ce9a540184a6870766d295cd880b4',
    }],
    nonce: 191252,
    hash: '0000584dda47f1c0f5402647af6d13d07e80666d2b0af0dd8544b30c2c376247',
    previousBlockHash: '0000114c8d94bcd11dd2c7be84f1f9e40936ae6c58dda6170d0ad170428cf5e5',
  }, {
    index: 8,
    timestamp: 1643357922757,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: '60942f7c7b32aa04c53a5be869b9a596',
    }],
    nonce: 49985,
    hash: '0000fa71a73bee9a4070efdc0b6e5760de9e0eee4376a80034313356c6f01ab1',
    previousBlockHash: '0000584dda47f1c0f5402647af6d13d07e80666d2b0af0dd8544b30c2c376247',
  }, {
    index: 9,
    timestamp: 1643357979879,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: '20cd8013e0c254ed59915aceb096a2ee',
    }, {
      amount: 1, sender: 'a', recipient: 'b', transactionId: '6059cb7e966fca9e8766e82a5839832b',
    }, {
      amount: 2, sender: 'b', recipient: 'c', transactionId: 'e649217257b7517a2da50bc93e423213',
    }],
    nonce: 165881,
    hash: '0000a4eaa7bea3ea7bf724e918b4bd73de934751a021367f0a6d1f135f7017d0',
    previousBlockHash: '0000fa71a73bee9a4070efdc0b6e5760de9e0eee4376a80034313356c6f01ab1',
  }, {
    index: 10,
    timestamp: 1643357980473,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: '21332f0527259478a5bf759bb072fa6b',
    }],
    nonce: 7924,
    hash: '0000682ee19639e42b140b66dc631d973a853c19c8c6f66819149fa12a5fb58b',
    previousBlockHash: '0000a4eaa7bea3ea7bf724e918b4bd73de934751a021367f0a6d1f135f7017d0',
  }, {
    index: 11,
    timestamp: 1643358741739,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: 'a62097df83b76b6b35d0ceea9b588c5c',
    }, {
      amount: 3, sender: 'c', recipient: 'd', transactionId: 'e31a02352113fa10471856b8c57de719',
    }, {
      amount: 4, sender: 'd', recipient: 'e', transactionId: '4a36e5ce1169364f70a2063ef3366a15',
    }],
    nonce: 303894,
    hash: '0000e3bf8cc27da7f241a587592994305717ffc7a9b7e6a7c73fc0c041676ebe',
    previousBlockHash: '0000682ee19639e42b140b66dc631d973a853c19c8c6f66819149fa12a5fb58b',
  }, {
    index: 12,
    timestamp: 1643358742403,
    transactions: [{
      amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: '51ed43ea0015373b8f19fd236633d07d',
    }],
    nonce: 22766,
    hash: '000088a92b6592d5ffa0b0dce667ff494762dff122276166dfd7da1903ed3e42',
    previousBlockHash: '0000e3bf8cc27da7f241a587592994305717ffc7a9b7e6a7c73fc0c041676ebe',
  }],
  pendingTransactions: [{
    amount: 2.15, sender: '00', recipient: 'a8c2a6c2fd4cf6a20569ac9a8884af6c', transactionId: '8f2105ac653fb427030b5ea31996e074',
  }],
  networkNodes: [],
};

console.log(coin.chainIsValid(bc.chain));
