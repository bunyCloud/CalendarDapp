export const networks = {
  '1': {
    chainId: 1,
    chainName: "Ethereum",
    currencyName: "Ethereum",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://etherscan.io/",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    rpcUrl: 'https://mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948',
    blockExplorerName: "Etherscan.io",
  },
  
  '43114': {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorerName: "Snowtrace.io",
    blockExplorerUrl: "https://cchain.explorer.avax.network/",
  },
  '43113': {
    chainId: 43113,
    chainName: "Fuji Testnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    blockExplorerName: "Snowtrace.io",
    blockExplorerUrl: "https://cchain.explorer.avax.network/",
  },
  "137": {
    chainId: 137,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorerUrl: "https://polygonscan.com/",
    blockExplorerName: "Polygonscan.com",
    wrapped: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  },
  "41": {
    chainId: 41,
    chainName: "Telos Testnet",
    currencyName: "Telos",
    currencySymbol: "TLOS",
    hexdecimal:"0x29",
    rpcUrl: "https://testnet.telos.net/evm/",
    blockExplorerUrl: "https://testnet.teloscan.io",
    blockExplorerName: "Teloscan.io",
  },
  "40": {
    chainId: 40,
    chainName: "Telos",
    currencyName: "Telos",
    hexdecimal:"0x28",
    currencySymbol: "TLOS",
    rpcUrl: "https://telos.net/evm/",
    blockExplorerUrl: "https://teloscan.io/",
    blockExplorerName: "Teloscan.io",
  }
};

export const getNativeByChain = (chain) =>
  networks[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networks[chain]?.chainId || null;

export const getChainByName = (chain) => networks[chain]?.chainName;

export const getExplorerName = (chain) =>
  networks[chain]?.blockExplorerName;

export const getExplorer = (chain) => networks[chain]?.blockExplorerUrl;

export const getWrappedNative = (chain) =>
  networks[chain]?.wrapped || null;
