// Mantle Sepolia Network Configuration
export const MANTLE_SEPOLIA = {
    chainId: '0x138B', // 5003 in hex
    chainIdDecimal: 5003,
    chainName: 'Mantle Sepolia Testnet',
    nativeCurrency: {
        name: 'MNT',
        symbol: 'MNT',
        decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
    blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz'],
};

export const SUPPORTED_CHAIN_ID = MANTLE_SEPOLIA.chainIdDecimal;
