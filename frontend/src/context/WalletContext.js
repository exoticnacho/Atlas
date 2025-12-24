import { create } from 'zustand';
import { ethers } from 'ethers';
import { ATLAS_CONTRACT, switchToMantleSepolia } from '../utils/contracts';
import { MANTLE_SEPOLIA, SUPPORTED_CHAIN_ID } from '../config/networks';

const useWalletStore = create((set, get) => ({
    // State
    address: null,
    provider: null,
    signer: null,
    contract: null,
    isConnected: false,
    isOwner: false,
    chainId: null,
    balance: '0',
    loading: false,
    error: null,
    connectionType: null, // 'metamask' | 'particle'
    wrongNetwork: false,

    // Actions
    connectWallet: async (type = 'metamask') => {
        set({ loading: true, error: null });

        try {
            let provider, signer, address;

            if (type === 'metamask') {
                if (typeof window.ethereum === 'undefined') {
                    throw new Error('Please install MetaMask to use this dApp');
                }

                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Switch to Mantle Sepolia
                await switchToMantleSepolia();

                provider = new ethers.BrowserProvider(window.ethereum);
                signer = await provider.getSigner();
                address = await signer.getAddress();
            } else if (type === 'particle') {
                const { getParticle } = await import('../services/particle');
                const { ParticleProvider } = await import('@particle-network/provider');

                const particle = getParticle();
                if (!particle) throw new Error('Particle Network not configured. Check API keys.');

                // Login with Particle
                if (!particle.auth.isLogin()) {
                    await particle.auth.login();
                }

                // Create Ethers provider using Particle
                const particleProvider = new ParticleProvider(particle.auth);
                provider = new ethers.BrowserProvider(particleProvider, 'any');
                signer = await provider.getSigner();
                address = await signer.getAddress();
            }

            const network = await provider.getNetwork();
            const balance = await provider.getBalance(address);

            // Create contract instance
            const contract = new ethers.Contract(
                ATLAS_CONTRACT.address,
                ATLAS_CONTRACT.abi,
                signer
            );

            // Check if user is owner
            let isOwner = false;
            try {
                isOwner = await contract.isOwner(address);
                console.log('WalletContext: Owner check result:', isOwner);
            } catch (error) {
                console.warn('Could not check owner status:', error);
                // Fallback check if contract call fails (e.g. wrong network initially)
            }

            set({
                address,
                provider,
                signer,
                contract,
                isConnected: true,
                isOwner,
                chainId: network.chainId.toString(),
                balance: ethers.formatEther(balance),
                loading: false,
                connectionType: type
            });

            // Listen for account changes (MetaMask only for now)
            if (type === 'metamask') {
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        get().disconnectWallet();
                    } else {
                        get().connectWallet('metamask');
                    }
                });
                window.ethereum.on('chainChanged', () => window.location.reload());
            }

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            set({
                error: error.message,
                loading: false,
            });
        }
    },

    disconnectWallet: async () => {
        const { connectionType } = get();

        if (connectionType === 'particle') {
            const { getParticle } = await import('../services/particle');
            const particle = getParticle();
            if (particle) await particle.auth.logout();
        }

        set({
            address: null,
            provider: null,
            signer: null,
            contract: null,
            isConnected: false,
            isOwner: false,
            chainId: null,
            balance: '0',
            error: null,
            connectionType: null
        });
    },

    updateBalance: async () => {
        const { provider, address } = get();
        if (!provider || !address) return;

        try {
            const balance = await provider.getBalance(address);
            set({ balance: ethers.formatEther(balance) });
        } catch (error) {
            console.error('Failed to update balance:', error);
        }
    },

    checkNetwork: async () => {
        const { provider } = get();
        if (!provider) return false;

        try {
            const network = await provider.getNetwork();
            const currentChainId = Number(network.chainId);
            const isCorrectNetwork = currentChainId === SUPPORTED_CHAIN_ID;

            set({ wrongNetwork: !isCorrectNetwork });
            return isCorrectNetwork;
        } catch (error) {
            console.error('Failed to check network:', error);
            return false;
        }
    },

    switchNetwork: async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed');
            }

            try {
                // Try to switch to Mantle Sepolia
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: MANTLE_SEPOLIA.chainId }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: MANTLE_SEPOLIA.chainId,
                                chainName: MANTLE_SEPOLIA.chainName,
                                nativeCurrency: MANTLE_SEPOLIA.nativeCurrency,
                                rpcUrls: MANTLE_SEPOLIA.rpcUrls,
                                blockExplorerUrls: MANTLE_SEPOLIA.blockExplorerUrls,
                            },
                        ],
                    });
                } else {
                    throw switchError;
                }
            }

            // Reload the page after network switch
            window.location.reload();
        } catch (error) {
            console.error('Failed to switch network:', error);
            throw error;
        }
    },
}));

export default useWalletStore;
