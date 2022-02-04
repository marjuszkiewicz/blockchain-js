const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;
const axios = require('axios');
const blockchain = require('./blockchain');

const app = express();

let port = process.env.PORT || 3000;

const getNodeUrl = () => `http://localhost:${port}`;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < totalCPUs; i++) {
    port += 1;
    cluster.fork({ PORT: port, NODE_URL: getNodeUrl(port) });
  }

  cluster.on('exit', (worker) => {
    port += 1;
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork({ PORT: port, NODE_URL: getNodeUrl(port) });
  });
} else {
  const nodeAddress = crypto.randomBytes(16).toString('hex');

  let coin = blockchain()
    .createNewBlock(100, '0', '0'); // genesis block

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/blockchain', (req, res) => {
    res.send(coin.toJSON());
  });

  app.post('/transaction', (req, res) => {
    const {
      amount, sender, recipient, transactionId,
    } = req.body;
    coin = coin.addTransactionToPendingTransactions({
      amount, sender, recipient, transactionId,
    });
    res.json({ note: `transaction will be added in ${coin.getLastBlock() + 1}` });
  });

  app.post('/transaction/broadcast', async (req, res) => {
    const { amount, sender, recipient } = req.body;
    const newTransaction = coin.createNewTransaction(amount, sender, recipient);
    coin = coin.addTransactionToPendingTransactions(newTransaction);

    const promises = [];
    coin.getNetworkNodes().forEach((networkNodeUrl) => {
      promises.push(axios.post(`${networkNodeUrl}/transaction`, newTransaction));
    });

    try {
      await Promise.all(promises);
      res.json({ note: 'Transaction broadcasted' });
    } catch (e) {
      console.error('Cannot broadcast transaction', e);
    }
  });

  app.get('/mine', async (req, res) => {
    const { hash: lastBlockHash, index: lastBlockIndex } = coin.getLastBlock();
    const currentBlockData = {
      transactions: coin.getPendingTransactions(),
      index: lastBlockIndex + 1,

    };
    const nonce = coin.proofOfWork(lastBlockHash, currentBlockData);
    const blockHash = coin.hashBlock(lastBlockHash, currentBlockData, nonce);

    coin = coin.createNewBlock(nonce, lastBlockHash, blockHash);
    const newBlock = coin.getLastBlock();

    const promises = [];
    coin.getNetworkNodes().forEach((nodeUrl) => {
      promises.push(axios.post(`${nodeUrl}/receive-new-block`, { newBlock })
        .catch((e) => console.error(`Cannot bloadcast new block to ${nodeUrl}`, e)));
    });

    try {
      await Promise.all(promises);

      await axios.post(`${coin.getCurrentNodeUrl()}/transaction/broadcast`, {
        amount: 2.15,
        sender: '00',
        recipient: nodeAddress,
      });

      res.json({
        note: 'New block mined',
        block: coin.getLastBlock(),
      });
    } catch (e) {
      console.error(e);
    }
  });

  app.post('/receive-new-block', async (req, res) => {
    const { newBlock } = req.body;

    const lastBlock = coin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock.index + 1 === newBlock.index;

    if (correctHash && correctIndex) {
      coin = coin.addBlock(newBlock);

      return res.json({
        note: 'New block accepted',
        newBlock,
      });
    }

    return res.json({
      note: 'Block rejected',
      newBlock,
    });
  });

  app.post('/node/register-and-broadcast', async (req, res) => {
    const { newNodeUrl } = req.body;
    coin = coin.addNetworkNode(newNodeUrl);

    const nodeRegisterPromises = [];
    coin.getNetworkNodes().forEach((nodeUrl) => {
      nodeRegisterPromises.push(axios.post(`${nodeUrl}/node/register`, {
        newNodeUrl,
      }));
    });

    try {
      await Promise.all(nodeRegisterPromises);
    } catch (e) {
      console.error(e, 'Error on node registration');
    }

    try {
      await axios.post(`${newNodeUrl}/nodes/register`, {
        allNetworkNodes: [...coin.getNetworkNodes(), coin.getCurrentNodeUrl()],
      });

      res.json({ note: 'new node registered' });
    } catch (e) {
      console.error(e, 'cannot register bulk nodes');
    }
  });

  app.post('/node/register', (req, res) => {
    const { newNodeUrl } = req.body;

    coin = coin.addNetworkNode(newNodeUrl);
    res.json({ note: 'New node registered' });
  });

  app.post('/nodes/register', (req, res) => {
    const { allNetworkNodes } = req.body;
    coin = coin.addNetworkNodes(allNetworkNodes);
    res.json({ note: 'Nodes added' });
  });

  app.get('/consensus', async (req, res) => {
    const networkNodes = coin.getNetworkNodes();
    let chainReplaced = false;

    const promises = [];
    networkNodes.forEach((nodeUrl) => {
      promises.push(axios.get(`${nodeUrl}/blockchain`));
    });

    const blockchains = (await Promise.all(promises))
      .map((response) => {
        const { data: bc } = response;
        return blockchain(bc.chain, bc.pendingTransactions, networkNodes);
      });

    blockchains.forEach((bc) => {
      if (bc.getChainLength() > coin.getChainLength() && bc.chainIsValid()) {
        coin = bc;
        chainReplaced = true;
      }
    });

    res.json({
      note: chainReplaced ? 'Chain has been replaced' : 'Chain not replaced',
      chain: coin.getChain(),
    });
  });

  app.get('/block/:blockHash', (req, res) => {
    const { blockHash } = req.params;
    const block = coin.getBlock(blockHash);
    if (!block) {
      return res.status(404);
    }

    return res.json({ block });
  });

  app.get('/transaction/:transactionId', (req, res) => {
    const { transactionId } = req.params;
    const { block, transaction } = coin.getTransaction(transactionId);

    res.json({ block, transaction });
  });

  app.get('/address/:address', (req, res) => {
    const { address } = req.params;
    const addressData = coin.getAddressData(address);
    res.json({
      addressData,
    });
  });

  app.listen(port, () => {
    console.log(`Blockchain app listening at http://localhost:${port}`);
  });
}
