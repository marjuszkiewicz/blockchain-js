const { createHash } = require('crypto');

const blockchain = (chain = [], pendingTransactions = []) => {
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

        return blockchain(chain);
    }

    const getLastBlock = () => chain[chain.length-1];

    const toJSON = () => ({chain, pendingTransactions});

    const createNewTransaction = (amount, sender, recipient) => {
        const transaction = { amount, sender, recipient };

        pendingTransactions.push(transaction);
        return  blockchain(chain, pendingTransactions);
    }

    const hashBlock = (prevBlockHash, currentBlockData, nonce) => {
        const hash = createHash('sha256');
        hash.update(`${prevBlockHash}${nonce}${JSON.stringify(currentBlockData)}`);
        return hash.digest('hex');
    }

    const proofOfWork = (prevBlockHash, currentBlockData) => {
        let nonce = 0;
        while (hashBlock(prevBlockHash, currentBlockData, nonce).substring(0,4) !== '0000')  {
            nonce++;
        }
        return nonce;
    }

    const getPendingTransactions = () =>  pendingTransactions;

    return {
        createNewBlock,
        toJSON,
        createNewTransaction,
        hashBlock,
        proofOfWork,
        getLastBlock,
        getPendingTransactions,
    }
}

module.exports = blockchain;