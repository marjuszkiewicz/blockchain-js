const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const blockchain = require('./blockchain');
let port = process.env.PORT || 3000;
const nodeUrl = process.env.NODE_URL || `http://localhost:${port}`;
const crypto = require('crypto');
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork({PORT: port++, NODE_URL: nodeUrl});
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork({PORT: port++, NODE_URL: nodeUrl});
  });
} else {
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

  app.post('/node/register-and-broadcast', (req, res) => {
    const { newNodeUrl }  = req.body;
    blockchain.addNetworkNode(newNodeUrl);
  });

  app.post('/node', (req, res) => {

  });

  app.post('/nodes', (req, res) => {

  });
  
  app.listen(port, () => {
    console.log(`Blockchain app listening at http://localhost:${port}`)
  });
}