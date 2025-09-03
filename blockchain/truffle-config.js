const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const mnemonic = process.env.MNEMONIC || "test test test test test test test test test test test junk";
const polygonRPC = process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com/";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6721975,
      gasPrice: 20000000000
    },
    
    polygon_mumbai: {
      provider: () => new HDWalletProvider(mnemonic, polygonRPC),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000
    },
    
    polygon_mainnet: {
      provider: () => new HDWalletProvider(mnemonic, "https://polygon-rpc.com/"),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 30000000000
    }
  },
  
  mocha: {
    timeout: 100000
  },
  
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "istanbul"
      }
    }
  },
  
  db: {
    enabled: false
  }
};