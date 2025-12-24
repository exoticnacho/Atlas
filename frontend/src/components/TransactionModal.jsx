'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TransactionModal({
    isOpen,
    status, // 'pending' | 'success' | 'error'
    txHash,
    message,
    onClose,
    onRetry
}) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (status === 'success') {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    }, [status]);

    const getStatusIcon = () => {
        switch (status) {
            case 'pending':
                return (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-4 border-[#CFFB54] border-t-transparent"
                    />
                );
            case 'success':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-20 h-20 rounded-full bg-[#CFFB54] flex items-center justify-center"
                    >
                        <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-12 h-12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                        >
                            <motion.path d="M5 13l4 4L19 7" />
                        </motion.svg>
                    </motion.div>
                );
            case 'error':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center"
                    >
                        <span className="text-4xl">✕</span>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    const getStatusTitle = () => {
        switch (status) {
            case 'pending':
                return 'Processing Transaction...';
            case 'success':
                return 'Transaction Successful!';
            case 'error':
                return 'Transaction Failed';
            default:
                return '';
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
                    onClick={status !== 'pending' ? onClose : undefined}
                >
                    {/* Confetti Effect */}
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        x: '50%',
                                        y: '50%',
                                        scale: 0,
                                        rotate: 0
                                    }}
                                    animate={{
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                        scale: [0, 1, 0],
                                        rotate: Math.random() * 360
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: Math.random() * 0.5,
                                        ease: "easeOut"
                                    }}
                                    className="absolute w-3 h-3 bg-[#CFFB54] rounded-full"
                                    style={{
                                        left: '50%',
                                        top: '50%'
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="glass p-8 rounded-2xl max-w-md w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Status Icon */}
                        <div className="flex justify-center mb-6">
                            {getStatusIcon()}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            {getStatusTitle()}
                        </h2>

                        {/* Message */}
                        {message && (
                            <p className="text-center text-white/70 mb-6">
                                {message}
                            </p>
                        )}

                        {/* Transaction Hash Link */}
                        {txHash && status === 'success' && (
                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                href={`https://explorer.sepolia.mantle.xyz/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full glass-hover p-4 rounded-xl mb-4 text-center group"
                            >
                                <p className="text-sm text-[#94A3B8] mb-1">Transaction Hash</p>
                                <p className="text-[#CFFB54] font-mono text-sm group-hover:underline">
                                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                                </p>
                                <p className="text-xs text-white/50 mt-1">Click to view on Explorer →</p>
                            </motion.a>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {status === 'error' && onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="flex-1 bg-[#CFFB54] text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all"
                                >
                                    Try Again
                                </button>
                            )}
                            {status !== 'pending' && (
                                <button
                                    onClick={onClose}
                                    className={`${status === 'error' && onRetry ? 'flex-1' : 'w-full'} glass-hover px-6 py-3 rounded-xl font-semibold`}
                                >
                                    Close
                                </button>
                            )}
                        </div>

                        {/* Pending State Info */}
                        {status === 'pending' && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-xs text-white/50 mt-4"
                            >
                                Please confirm the transaction in your wallet...
                            </motion.p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
