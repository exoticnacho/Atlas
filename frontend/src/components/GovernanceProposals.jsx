'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatAddress } from '../utils/contracts';
import useMultiSig from '../hooks/useMultiSig';

export default function GovernanceProposals() {
    const { transactions, threshold, approveTransaction, loading } = useMultiSig();
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'passed' | 'rejected'
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [localProposals, setLocalProposals] = useState([]);

    useEffect(() => {
        if (!transactions) return;

        // Map multi-sig transactions to governance proposals
        const mapped = transactions.map(tx => {
            // Determine status based on executed and approvals
            let status = 'active';
            if (tx.executed) {
                status = 'passed';
            } else if (tx.approvals >= threshold) {
                // If it's not executed but has enough approvals, it's ready to execute
                // For UI purposes, we'll keep it active until executed or mark it differently
                status = 'active';
            }

            return {
                id: tx.id,
                title: tx.title || `Proposal #${tx.id + 1}`,
                description: tx.description || `Transaction to ${formatAddress(tx.to)} with value ${tx.value} MNT.`,
                proposer: tx.proposer || 'DAO Contract',
                status: status,
                votesFor: tx.approvals,
                votesAgainst: 0, // Multi-sig usually doesn't have "against" votes in the same way
                totalVotes: tx.approvals,
                quorum: threshold,
                endDate: 'On-going',
                category: tx.value > 0 ? 'Treasury' : 'Governance',
                isApprovedByMe: tx.isApprovedByMe,
                to: tx.to,
                value: tx.value,
                data: tx.data
            };
        });

        setLocalProposals(mapped);
    }, [transactions, threshold]);

    const filteredProposals = localProposals.filter(p => p.status === activeTab);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-[#CFFB54] bg-[#CFFB54]/10 border-[#CFFB54]/30';
            case 'passed': return 'text-green-500 bg-green-500/10 border-green-500/30';
            case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/30';
            default: return 'text-white/70 bg-white/5 border-white/10';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Treasury': return 'bg-blue-500/20 text-blue-400';
            case 'Governance': return 'bg-purple-500/20 text-purple-400';
            case 'Technical': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-white/10 text-white/70';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Governance Proposals</h2>
                    <p className="text-sm text-white/60">Vote on important DAO decisions</p>
                </div>

                <button className="btn-primary">
                    + Create Proposal
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 glass p-1 rounded-lg w-fit">
                {[
                    { key: 'active', label: 'Active', count: localProposals.filter(p => p.status === 'active').length },
                    { key: 'passed', label: 'Passed', count: localProposals.filter(p => p.status === 'passed').length },
                    { key: 'rejected', label: 'Rejected', count: localProposals.filter(p => p.status === 'rejected').length },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.key
                            ? 'bg-[#CFFB54] text-black'
                            : 'text-white/70 hover:text-white'
                            }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-black/20' : 'bg-white/10'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {filteredProposals.map((proposal, index) => (
                        <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                            onClick={() => setSelectedProposal(proposal)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#CFFB54] transition-colors">
                                            {proposal.title}
                                        </h3>
                                        <span className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(proposal.category)}`}>
                                            {proposal.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/60 mb-3 line-clamp-2">
                                        {proposal.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-white/50">
                                        <span>Proposed by {formatAddress(proposal.proposer)}</span>
                                        <span>•</span>
                                        <span>Ends {proposal.endDate}</span>
                                    </div>
                                </div>

                                <div className={`px-4 py-2 rounded-lg border text-sm font-semibold ${getStatusColor(proposal.status)}`}>
                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                </div>
                            </div>

                            {/* Voting Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/70">Voting Progress</span>
                                    <span className="text-white font-semibold">{proposal.totalVotes}/{proposal.quorum} votes</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(proposal.votesFor / proposal.quorum) * 100}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        className="absolute left-0 top-0 h-full bg-[#CFFB54]"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(proposal.votesAgainst / proposal.quorum) * 100}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        className="absolute right-0 top-0 h-full bg-red-500"
                                        style={{ width: `${(proposal.votesAgainst / proposal.quorum) * 100}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#CFFB54]">For: {proposal.votesFor}</span>
                                    <span className="text-red-500">Against: {proposal.votesAgainst}</span>
                                </div>
                            </div>

                            {/* Vote Buttons (only for active proposals) */}
                            {proposal.status === 'active' && (
                                <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                    <button
                                        disabled={proposal.isApprovedByMe || loading}
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await approveTransaction(proposal.id);
                                            } catch (err) {
                                                console.error('Voting failed:', err);
                                            }
                                        }}
                                        className={`flex-1 font-bold px-4 py-2 rounded-lg transition-all ${proposal.isApprovedByMe
                                            ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                            : 'bg-[#CFFB54] text-black hover:scale-105'
                                            }`}
                                    >
                                        {proposal.isApprovedByMe ? 'Already Voted' : 'Approve Proposal'}
                                    </button>
                                    <div className="flex-1 text-center text-xs text-white/40 italic">
                                        Multi-sig proposals require approvals. Rejection is handled by not voting.
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredProposals.length === 0 && (
                    <div className="glass p-12 rounded-2xl text-center">
                        <p className="text-white/50 text-lg">No {activeTab} proposals</p>
                    </div>
                )}
            </div>

            {/* Proposal Detail Modal */}
            <AnimatePresence>
                {selectedProposal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
                        onClick={() => setSelectedProposal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass p-8 rounded-2xl max-w-2xl w-full relative max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{selectedProposal.title}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(selectedProposal.category)}`}>
                                            {selectedProposal.category}
                                        </span>
                                        <span className={`text-xs px-3 py-1 rounded-lg border ${getStatusColor(selectedProposal.status)}`}>
                                            {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProposal(null)}
                                    className="text-white/50 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-white/70 mb-2">Description</h3>
                                    <p className="text-white/90 leading-relaxed">{selectedProposal.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass p-4 rounded-lg">
                                        <p className="text-xs text-white/60 mb-1">Proposer</p>
                                        <p className="text-sm font-mono text-white">{formatAddress(selectedProposal.proposer)}</p>
                                    </div>
                                    <div className="glass p-4 rounded-lg">
                                        <p className="text-xs text-white/60 mb-1">End Date</p>
                                        <p className="text-sm font-semibold text-white">{selectedProposal.endDate}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-white/70 mb-3">Voting Results</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#CFFB54]">For</span>
                                            <span className="text-white font-bold">{selectedProposal.votesFor} votes</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-red-500">Against</span>
                                            <span className="text-white font-bold">{selectedProposal.votesAgainst} votes</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                            <span className="text-white/70">Total / Quorum</span>
                                            <span className="text-white font-bold">{selectedProposal.totalVotes} / {selectedProposal.quorum}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedProposal.status === 'active' && (
                                    <div className="flex gap-3 pt-4 border-t border-white/10">
                                        <button className="flex-1 btn-primary">
                                            Vote For
                                        </button>
                                        <button className="flex-1 bg-red-500/20 text-red-500 border border-red-500/30 font-bold px-6 py-3 rounded-xl hover:bg-red-500/30 transition-all">
                                            Vote Against
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
