'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import useWalletStore from '../context/WalletContext';

export default function LoginModal({ isOpen, onClose }) {
    const { connectWallet, loading, wrongNetwork, checkNetwork, switchNetwork, isConnected } = useWalletStore();
    const [switching, setSwitching] = useState(false);

    useEffect(() => {
        if (isConnected) {
            checkNetwork();
        }
    }, [isConnected, checkNetwork]);

    const handleConnect = async (type) => {
        await connectWallet(type);
        onClose();
    };

    const handleSwitchNetwork = async () => {
        setSwitching(true);
        try {
            await switchNetwork();
        } catch (error) {
            console.error('Failed to switch network:', error);
        } finally {
            setSwitching(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="glass p-8 rounded-2xl max-w-md w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center">Connect Wallet</h2>

                        {/* Network Warning Banner */}
                        {wrongNetwork && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-yellow-500 mb-1">Wrong Network</p>
                                        <p className="text-sm text-white/70 mb-3">
                                            Please switch to Mantle Sepolia Testnet to use this dApp.
                                        </p>
                                        <button
                                            onClick={handleSwitchNetwork}
                                            disabled={switching}
                                            className="w-full bg-[#CFFB54] text-black font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {switching ? 'Switching...' : 'Switch to Mantle Sepolia'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            {/* MetaMask */}
                            <button
                                onClick={() => handleConnect('metamask')}
                                disabled={loading}
                                className="w-full glass-hover p-4 rounded-xl flex items-center gap-4 group transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                                        alt="MetaMask"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">MetaMask</p>
                                    <p className="text-xs text-[#94A3B8]">Connect using browser wallet</p>
                                </div>
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#141414] px-4 text-[#94A3B8] font-medium tracking-wider text-[10px]">Or Social Login</span>
                                </div>
                            </div>

                            {/* Particle Network */}
                            <button
                                onClick={() => handleConnect('particle')}
                                disabled={loading}
                                className="w-full glass-hover p-4 rounded-xl flex items-center gap-4 group transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                                    <img
                                        src="https://avatars.githubusercontent.com/u/104958184?s=200&v=4"
                                        alt="Particle Network"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">Social Login</p>
                                    <p className="text-xs text-[#94A3B8]">Google, Twitter, Email via Particle</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-6 text-sm text-[#94A3B8] hover:text-white w-full text-center"
                        >
                            Cancel
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
