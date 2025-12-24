'use client';

import { motion } from 'framer-motion';
import useWalletStore from '../context/WalletContext';
import { formatAddress } from '../utils/contracts';
import useMultiSig from '../hooks/useMultiSig';

export default function ReputationCard() {
    const { address, isConnected, isOwner } = useWalletStore();
    const { reputation } = useMultiSig();

    // Get current user's reputation
    const userRep = reputation && address ? reputation[address] : null;

    // Use real data or fallback
    const reputationData = {
        points: userRep?.points || 0,
        rank: userRep?.rank || '-',
        badges: [
            { id: 1, name: 'Early Adopter', icon: '🌱', color: '#CFFB54' },
            { id: 2, name: 'Active Voter', icon: '🗳️', color: '#3B82F6' },
            { id: 3, name: 'Proposal Master', icon: '📜', color: '#A855F7' },
        ],
        stats: {
            votesParticipated: userRep?.votes || 0,
            proposalsSubmitted: userRep?.proposals || 0,
            transactionsApproved: userRep?.votes || 0, // Same as votes for now
        },
    };

    if (!isConnected) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 rounded-2xl"
        >
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CFFB54] to-[#A855F7] p-1">
                        <div className="w-full h-full rounded-xl bg-[#141414] flex items-center justify-center text-4xl">
                            🧑‍🚀
                        </div>
                    </div>
                    {isOwner && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#CFFB54] flex items-center justify-center">
                            <span className="text-xs">✓</span>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-mono text-sm text-[#94A3B8] mb-1">{formatAddress(address)}</p>
                    <h3 className="text-xl font-bold gradient-text">DAO Member</h3>
                    {isOwner && (
                        <span className="inline-block mt-1 px-2 py-1 rounded text-xs bg-[#CFFB54]/20 text-[#CFFB54]">
                            Owner
                        </span>
                    )}
                </div>
            </div>

            {/* Reputation Points */}
            <div className="glass-hover p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[#94A3B8]">Reputation Points</p>
                    <span className="text-xs text-[#CFFB54]">Rank #{reputationData.rank}</span>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold gradient-text">{reputationData.points}</p>
                    <p className="text-sm text-[#94A3B8] mb-2">pts</p>
                </div>
                <div className="mt-3 h-2 bg-[#141414] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-[#CFFB54] to-[#A855F7]"
                    />
                </div>
            </div>

            {/* Badges */}
            <div className="mb-6">
                <p className="text-sm text-[#94A3B8] mb-3">Achievements</p>
                <div className="grid grid-cols-3 gap-3">
                    {reputationData.badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-hover p-3 rounded-xl text-center"
                        >
                            <div className="w-8 h-8 mx-auto mb-2 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-lg">
                                {badge.icon}
                            </div>
                            <p className="text-xs font-semibold" style={{ color: badge.color }}>
                                {badge.name}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contribution Stats */}
            <div>
                <p className="text-sm text-[#94A3B8] mb-3">Contribution Stats</p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Votes Participated</span>
                        <span className="font-semibold text-[#3B82F6]">{reputationData.stats.votesParticipated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Proposals Submitted</span>
                        <span className="font-semibold text-[#A855F7]">{reputationData.stats.proposalsSubmitted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Transactions Approved</span>
                        <span className="font-semibold text-[#CFFB54]">{reputationData.stats.transactionsApproved}</span>
                    </div>
                </div>
            </div>

            {/* Leaderboard Link */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary w-full mt-6"
            >
                View Leaderboard
            </motion.button>
        </motion.div>
    );
}
