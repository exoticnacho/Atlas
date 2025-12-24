'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useMultiSig from '../hooks/useMultiSig';
import useWalletStore from '../context/WalletContext';
import { formatAddress } from '../utils/contracts';
import SubmitTxModal from './SubmitTxModal';
import TransactionModal from './TransactionModal';

export default function MultiSigTxList() {
    const { isConnected, isOwner } = useWalletStore();
    const { transactions, loading, threshold, approveTransaction, executeTransaction, submitTransaction } = useMultiSig();
    const [selectedTx, setSelectedTx] = useState(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // Transaction Modal State
    const [txModal, setTxModal] = useState({
        isOpen: false,
        status: 'pending', // 'pending' | 'success' | 'error'
        txHash: null,
        message: '',
        retryAction: null
    });

    // Global Click Debugger
    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (e.target.closest('.btn-primary')) {
                console.log('Global Debug: btn-primary clicked!', e.target);
            }
        };
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    // Debug logging
    console.log('MultiSigTxList - isConnected:', isConnected, 'isOwner:', isOwner, 'threshold:', threshold);

    const handleApprove = async (txId) => {
        setActionLoading(`approve-${txId}`);
        setTxModal({
            isOpen: true,
            status: 'pending',
            txHash: null,
            message: 'Approving transaction...',
            retryAction: () => handleApprove(txId)
        });

        try {
            const tx = await approveTransaction(txId);
            const receipt = await tx.wait();

            setTxModal({
                isOpen: true,
                status: 'success',
                txHash: receipt.hash,
                message: 'Transaction approved successfully!',
                retryAction: null
            });
        } catch (error) {
            console.error('Approval failed:', error);
            setTxModal({
                isOpen: true,
                status: 'error',
                txHash: null,
                message: error.message || 'Failed to approve transaction',
                retryAction: () => handleApprove(txId)
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleExecute = async (txId) => {
        setActionLoading(`execute-${txId}`);
        setTxModal({
            isOpen: true,
            status: 'pending',
            txHash: null,
            message: 'Executing transaction...',
            retryAction: () => handleExecute(txId)
        });

        try {
            const tx = await executeTransaction(txId);
            const receipt = await tx.wait();

            setTxModal({
                isOpen: true,
                status: 'success',
                txHash: receipt.hash,
                message: 'Transaction executed successfully!',
                retryAction: null
            });
        } catch (error) {
            console.error('Execution failed:', error);
            setTxModal({
                isOpen: true,
                status: 'error',
                txHash: null,
                message: error.message || 'Failed to execute transaction',
                retryAction: () => handleExecute(txId)
            });
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (tx) => {
        if (tx.executed) {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#CFFB54] text-black">
                    Executed
                </span>
            );
        }
        if (tx.approvals >= threshold) {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6] text-white">
                    Ready to Execute
                </span>
            );
        }
        return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#A855F7] text-white">
                Pending ({tx.approvals}/{threshold})
            </span>
        );
    };

    if (!isConnected) {
        return (
            <div className="glass p-12 rounded-2xl text-center">
                <p className="text-[#94A3B8]">Connect your wallet to view transactions</p>
            </div>
        );
    }

    return (
        <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Multi-Sig Transactions</h2>
                    <p className="text-[#94A3B8] text-sm">
                        Threshold: {threshold} approval{threshold !== 1 ? 's' : ''} required
                    </p>
                </div>
                <div className="flex gap-3">
                    {isOwner ? (
                        <button
                            onClick={(e) => {
                                console.log('DEBUG: New Transaction Clicked!');
                                e.preventDefault();
                                e.stopPropagation();
                                setIsSubmitModalOpen(true);
                            }}
                            className="btn-primary"
                            style={{
                                position: 'relative',
                                zIndex: 10,
                                cursor: 'pointer',
                                pointerEvents: 'auto'
                            }}
                        >
                            + New Transaction
                        </button>
                    ) : (
                        <div className="text-sm text-[#94A3B8] italic">
                            Connect as owner to submit transactions
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-24 rounded-xl"></div>
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-[#94A3B8]">No transactions yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map((tx) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-hover p-5 rounded-xl cursor-pointer"
                            onClick={() => setSelectedTx(tx)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-mono text-[#94A3B8]">TX #{tx.id}</span>
                                        {getStatusBadge(tx)}
                                        {tx.autoExecute && (
                                            <span className="px-2 py-1 rounded text-xs bg-[#CFFB54]/20 text-[#CFFB54]">
                                                Auto-Execute
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-[#94A3B8]">To:</span>
                                        <span className="font-mono">{formatAddress(tx.to)}</span>
                                        <span className="text-[#94A3B8]">•</span>
                                        <span className="text-[#CFFB54] font-semibold">{tx.value} MNT</span>
                                    </div>
                                </div>

                                {!tx.executed && isOwner && (
                                    <div className="flex gap-2">
                                        {!tx.isApprovedByMe && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApprove(tx.id);
                                                }}
                                                disabled={actionLoading === `approve-${tx.id}`}
                                                className="btn-secondary text-sm px-4 py-2"
                                            >
                                                {actionLoading === `approve-${tx.id}` ? 'Approving...' : 'Approve'}
                                            </motion.button>
                                        )}
                                        {tx.approvals >= threshold && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleExecute(tx.id);
                                                }}
                                                disabled={actionLoading === `execute-${tx.id}`}
                                                className="btn-primary text-sm px-4 py-2"
                                            >
                                                {actionLoading === `execute-${tx.id}` ? 'Executing...' : 'Execute'}
                                            </motion.button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {tx.isApprovedByMe && !tx.executed && (
                                <div className="flex items-center gap-2 text-xs text-[#CFFB54]">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    You approved this transaction
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Submit Transaction Modal */}
            <SubmitTxModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onSubmit={submitTransaction}
            />

            {/* Transaction Detail Modal */}
            <AnimatePresence>
                {selectedTx && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
                        onClick={() => setSelectedTx(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass p-8 rounded-2xl max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-6">Transaction Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-[#94A3B8] mb-1">Transaction ID</p>
                                    <p className="font-mono">#{selectedTx.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#94A3B8] mb-1">Recipient</p>
                                    <p className="font-mono text-sm break-all">{selectedTx.to}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#94A3B8] mb-1">Amount</p>
                                    <p className="text-2xl font-bold text-[#CFFB54]">{selectedTx.value} MNT</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#94A3B8] mb-1">Status</p>
                                    {getStatusBadge(selectedTx)}
                                </div>
                                <div>
                                    <p className="text-sm text-[#94A3B8] mb-1">Approvals</p>
                                    <p className="text-lg font-semibold">{selectedTx.approvals} / {threshold}</p>
                                </div>

                                {/* Approvers List */}
                                {selectedTx.approvers && selectedTx.approvers.length > 0 && (
                                    <div className="border-t border-white/10 pt-4">
                                        <p className="text-sm text-[#94A3B8] mb-3">Approved By:</p>
                                        <div className="space-y-2">
                                            {selectedTx.approvers.map((approver, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 glass-hover p-3 rounded-lg"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-[#CFFB54]"></div>
                                                    <span className="font-mono text-sm">{formatAddress(approver)}</span>
                                                    <span className="text-xs text-[#94A3B8]">({approver.slice(0, 6)}...{approver.slice(-4)})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedTx(null)}
                                className="btn-secondary w-full mt-6"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Transaction Feedback Modal */}
            <TransactionModal
                isOpen={txModal.isOpen}
                status={txModal.status}
                txHash={txModal.txHash}
                message={txModal.message}
                onClose={() => setTxModal({ ...txModal, isOpen: false })}
                onRetry={txModal.retryAction}
            />
        </div>
    );
}
