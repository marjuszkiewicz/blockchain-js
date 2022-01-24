const blockchain = require('./blockchain');

console.log(blockchain);
const coin = blockchain();
coin.createNewBlock(123, 'ffasd', '4rfsw45') // genesis block
  .createNewTransaction(99, 'sender1', 'recipient1')
  .createNewBlock(1234, 'bbbbb', 'bbbbbbbfsdd')
  .createNewTransaction(199, 'sender1', 'recipient1')
  .createNewTransaction(299, 'sender1', 'recipient1')
  .createNewTransaction(399, 'sender1', 'recipient1')
  .createNewBlock(12345, 'cccc', 'cccccdsadfas');

const prev = 'hjjjh';
const curr = [{
  amount: 1,
  sender: 'jas',
  recipient: 'malgosia',
}];
const nonnce = 100;
console.log(coin.proofOfWork(prev, curr));

console.dir(coin.toJSON(), { depth: 5 });
