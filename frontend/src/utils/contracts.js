import AtlasABI from '../abi/Atlas.json';

// Mantle Sepolia Network Configuration
export const MANTLE_SEPOLIA = {
    chainId: '0x138B', // 5003 in hex
    chainName: 'Mantle Sepolia Testnet',
    nativeCurrency: {
        name: 'MNT',
        symbol: 'MNT',
        decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
    blockExplorerUrls: ['https://sepolia.mantlescan.xyz'],
};

// Atlas Multi-Sig Contract Configuration
export const ATLAS_CONTRACT = {
    address: process.env.NEXT_PUBLIC_ATLAS_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    abi: AtlasABI,
};

// Helper to add Mantle Sepolia to MetaMask
export async function addMantleSepoliaNetwork() {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
    }

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MANTLE_SEPOLIA],
        });
    } catch (error) {
        console.error('Failed to add Mantle Sepolia network:', error);
        throw error;
    }
}

// Helper to switch to Mantle Sepolia
export async function switchToMantleSepolia() {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
    }

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MANTLE_SEPOLIA.chainId }],
        });
    } catch (error) {
        // If network doesn't exist, add it
        if (error.code === 4902) {
            await addMantleSepoliaNetwork();
        } else {
            console.error('Failed to switch to Mantle Sepolia:', error);
            throw error;
        }
    }
}

// Format address for display
export function formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format MNT amount
export function formatMNT(amount, decimals = 4) {
    if (!amount) return '0';
    const formatted = parseFloat(amount).toFixed(decimals);
    return formatted;
}
