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

  const chainIsValid = () => {
    let isValid = true;
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const prevBlock = chain[i - 1];
      const blockHash = hashBlock(
        prevBlock.hash,
        { transactions: currentBlock.transactions, index: currentBlock.index },
        currentBlock.nonce,
      );

      if (blockHash.substring(0, 4) !== '0000') {
        isValid = false;
      }
      if (currentBlock.previousBlockHash !== prevBlock.hash) {
        isValid = false;
      }
    }

    const genesisBlock = chain[0];
    const correctNonce = genesisBlock.nonce === 100;
    const correctPrevBlickHash = genesisBlock.previousBlockHash === '0';
    const correctHash = genesisBlock.hash === '0';
    const correctTransactions = genesisBlock.transactions.length === 0;

    if (!correctNonce || !correctPrevBlickHash || !correctHash || !correctTransactions) {
      isValid = false;
    }

    return isValid;
  };

  const getChain = () => chain;

  const getChainLength = () => chain.length;

  const getBlock = (blockHash) => chain.find((block) => block.hash === blockHash);

  const getTransaction = (transactionId) => {
    const chainWithTransaction = chain.find(
      (block) => block.transactions
        .find((singleTransaction) => singleTransaction.transactionId === transactionId),
    );
    const transaction = chainWithTransaction
      .find((singleTransaction) => singleTransaction.transactionId === transactionId);

    return { block: chainWithTransaction, transaction };
  };

  const getAddressData = (address) => {
    const addressTransactions = [];
    chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (transaction.recipient === address || transaction.sender === address) {
          addressTransactions.push(transaction);
        }
      });
    });

    const addressBalance = addressTransactions
      .reduce(
        (prev, curr) => (address === curr.sender ? prev - curr.amount : prev + curr.amount),
        0,
      );

    return {
      addressTransactions,
      addressBalance,
    };
  };

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
    chainIsValid,
    getChain,
    getChainLength,
    getBlock,
    getTransaction,
    getAddressData,
  };
};

module.exports = blockchain;
