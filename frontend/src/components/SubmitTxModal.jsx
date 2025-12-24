'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SubmitTxModal({ isOpen, onClose, onSubmit }) {
    const [to, setTo] = useState('');
    const [value, setValue] = useState('');
    const [data, setData] = useState('0x');
    const [autoExecute, setAutoExecute] = useState(false);
    const [isGasless, setIsGasless] = useState(false); // Default off
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading('Submitting transaction...');

        try {
            await onSubmit(to, value, data, autoExecute, isGasless);
            toast.success('Transaction submitted successfully!', { id: toastId });

            // Reset form
            setTo('');
            setValue('');
            setData('0x');
            setAutoExecute(false);
            setIsGasless(false);

            onClose();
        } catch (error) {
            console.error('Submission failed:', error);
            toast.error(`Failed: ${error.message || 'Unknown error'}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // Debug log
    console.log('SubmitTxModal - isOpen:', isOpen);

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
                        className="glass p-8 rounded-2xl max-w-lg w-full shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">New Transaction</h2>
                            <button onClick={onClose} className="text-[#94A3B8] hover:text-white">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#94A3B8] mb-1">Recipient Address</label>
                                <input
                                    type="text"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#CFFB54] transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#94A3B8] mb-1">Amount (MNT)</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#CFFB54] transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#94A3B8] mb-1">Data (Bytes)</label>
                                <input
                                    type="text"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#CFFB54] transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="autoExecute"
                                    checked={autoExecute}
                                    onChange={(e) => setAutoExecute(e.target.checked)}
                                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#CFFB54] cursor-pointer"
                                />
                                <label htmlFor="autoExecute" className="text-sm text-[#94A3B8] cursor-pointer">
                                    Auto-Execute when threshold met
                                </label>
                            </div>

                            {/* Gasless Option */}
                            <div className="flex items-center gap-3 py-2 border-t border-white/10 mt-2 pt-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-white">Gasless Transaction</span>
                                        <span className="text-[10px] bg-gradient-to-r from-[#3B82F6] to-[#A855F7] text-white px-2 py-0.5 rounded-full">BETA</span>
                                    </div>
                                    <p className="text-xs text-[#94A3B8]">DAO pays the gas fee for you</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isGasless}
                                        onChange={(e) => setIsGasless(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CFFB54]"></div>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? 'Submitting...' : 'Submit Tx'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
