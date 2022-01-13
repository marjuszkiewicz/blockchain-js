const { createHash } = require('crypto');
const currentNodeUrl = process.env.NODE_URL;

const blockchain = ({chain: [], pendingTransactions: [], networkNodes: []}) => {
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

        return blockchain({ chain });
    }

    const getLastBlock = () => chain[chain.length-1];

    const toJSON = () => ({chain, pendingTransactions});

    const createNewTransaction = (amount, sender, recipient) => {
        const transaction = { amount, sender, recipient };

        pendingTransactions.push(transaction);
        return  blockchain({ chain, pendingTransactions });
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

    const getNetworkNodes = () => networkNodes;

    const addNetworkNode = (node) => {
        if (networkNodes.includes(node)) {
            return false;
        }

        return blockchain({ chain, pendingTransactions, networkNodes: networkNodes.pop(node)  });
    }

    return {
        createNewBlock,
        toJSON,
        createNewTransaction,
        hashBlock,
        proofOfWork,
        getLastBlock,
        getPendingTransactions,
        getNetworkNodes,
        addNetworkNode
    }
}

module.exports = blockchain;