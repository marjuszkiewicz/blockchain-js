const { createHash } = require('crypto');

const currentNodeUrl = process.env.NODE_URL;
const crypto = require('crypto');

const blockchain = (chain = [], pendingTransactions = [], networkNodes = []) => {
  const createNewBlock = (nonce, previousBlockHash, hash) => {
    const newBlock = {
      index: chain.length + 1,
      timestamp: Date.now(),
      transactions: pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    };

    chain.push(newBlock);

    return blockchain(chain, [], networkNodes);
  };

  const getLastBlock = () => chain[chain.length - 1];

  const toJSON = () => ({ chain, pendingTransactions, networkNodes });

  const createNewTransaction = (amount, sender, recipient) => ({
    amount, sender, recipient, transactionId: crypto.randomBytes(16).toString('hex'),
  });

  const addTransactionToPendingTransactions = (transaction) => {
    pendingTransactions.push(transaction);
    return blockchain(chain, pendingTransactions, networkNodes);
  };

  const hashBlock = (prevBlockHash, currentBlockData, nonce) => {
    const hash = createHash('sha256');
    hash.update(`${prevBlockHash}${nonce}${JSON.stringify(currentBlockData)}`);
    return hash.digest('hex');
  };

  const proofOfWork = (prevBlockHash, currentBlockData) => {
    let nonce = 0;
    while (hashBlock(prevBlockHash, currentBlockData, nonce).substring(0, 4) !== '0000') {
      nonce += 1;
    }
    return nonce;
  };

  const getPendingTransactions = () => pendingTransactions;

  const getNetworkNodes = () => networkNodes;

  const addNetworkNode = (node) => {
    if (networkNodes.includes(node) || node === currentNodeUrl) {
      return blockchain(chain, pendingTransactions, networkNodes);
    }

    const newNetworkNodes = networkNodes;
    newNetworkNodes.push(node);
    return blockchain(chain, pendingTransactions, newNetworkNodes);
  };

  const addNetworkNodes = (nodes) => {
    const newNetworkNodes = networkNodes;
    nodes.forEach((node) => {
      if (!networkNodes.includes(node) && node !== currentNodeUrl) {
        newNetworkNodes.push(node);
      }
    });
    return blockchain(chain, pendingTransactions, newNetworkNodes);
  };

  const getCurrentNodeUrl = () => currentNodeUrl;

  const addBlock = (block) => blockchain(chain.concat([block]), [], networkNodes);

  return {
    createNewBlock,
    toJSON,
    createNewTransaction,
    hashBlock,
    proofOfWork,
    getLastBlock,
    getPendingTransactions,
    getNetworkNodes,
    addNetworkNode,
    getCurrentNodeUrl,
    addNetworkNodes,
    addTransactionToPendingTransactions,
    addBlock,
  };
};

module.exports = blockchain;
