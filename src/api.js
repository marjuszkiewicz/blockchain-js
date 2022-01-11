const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const blockchain = require('./blockchain');
const port = 3000;
const crypto = require('crypto');

const  nodeAddress = crypto.randomBytes(16).toString('hex');

let coin = blockchain()
  .createNewBlock(123, 'ffasd', '4rfsw45'); // genesis block

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', (req, res) => {
  res.send(coin.toJSON());
});

app.post('/transaction', (req, res) => {
  console.log(req.body);
  const { amount, sender, recipient } = req.body;
  console.log(amount, sender, recipient, 'amount, sender, recipient');
  coin = coin.createNewTransaction( amount, sender, recipient );
  const lastBlock = coin.getLastBlock();
  console.log(lastBlock, 'lastblock');
  res.json({ note: `Will be added in ${lastBlock['index']+1}`});
});

app.get('/mine', (req, res) => {
  const { hash: lastBlockHash, index: lastBlockIndex } =  coin.getLastBlock();
  const currentBlockData = {
    transactions: coin.getPendingTransactions(),
    index: lastBlockIndex + 1,

  }
  const nonce = coin.proofOfWork(lastBlockHash, currentBlockData);
  const blockHash = coin.hashBlock(lastBlockHash, currentBlockData, nonce);

  coin.createNewTransaction(12.5, "00", nodeAddress);

  coin = coin.createNewBlock(nonce, lastBlockHash, blockHash);
  res.json({
    note: "New block mined",
    block: coin.getLastBlock(),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});