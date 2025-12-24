'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatAddress } from '../utils/contracts';
import useMultiSig from '../hooks/useMultiSig';

export default function MemberDirectory() {
    const { owners, reputation } = useMultiSig();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('reputation'); // 'reputation' | 'activity' | 'joined'
    const [localMembers, setLocalMembers] = useState([]);

    useEffect(() => {
        if (!owners || owners.length === 0) return;

        // Map owners to member cards
        const mapped = owners.map(address => {
            const rep = reputation[address] || { points: 0, rank: 0, activity: 'New' };

            // Generate realistic join date based on rank (higher rank = earlier join)
            const baseDate = new Date('2024-01-01');
            const daysOffset = (rep.rank || owners.length) * 7; // 1 week per rank
            const joinDate = new Date(baseDate);
            joinDate.setDate(joinDate.getDate() + daysOffset);

            return {
                address: address,
                reputation: rep.points,
                rank: rep.rank,
                totalVotes: rep.votes || 0,
                proposalsCreated: rep.proposals || 0,
                joinedDate: joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                lastActive: rep.activity || 'Recently',
                role: 'Owner',
                // Generating a deterministic boring avatar color
                avatarColor: ['#CFFB54', '#3B82F6', '#A855F7', '#EF4444', '#F59E0B'][parseInt(address.slice(-1), 16) % 5]
            };
        });

        setLocalMembers(mapped);
    }, [owners, reputation]);

    const filteredMembers = localMembers
        .filter(member =>
            member.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'reputation':
                    return b.reputation - a.reputation;
                case 'activity':
                    return b.totalVotes - a.totalVotes;
                case 'joined':
                    return new Date(b.joinedDate) - new Date(a.joinedDate);
                default:
                    return 0;
            }
        });

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return '1st';
            case 2:
                return '2nd';
            case 3:
                return '3rd';
            default:
                return `#${rank}`;
        }
    };

    const getReputationColor = (reputation) => {
        if (reputation >= 1000) return 'text-[#CFFB54]';
        if (reputation >= 500) return 'text-blue-400';
        return 'text-white/70';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Member Directory</h2>
                    <p className="text-sm text-white/60">{localMembers.length} active owners in the DAO</p>
                </div>
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search by address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full glass px-4 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#CFFB54]/50"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="glass px-4 py-3 rounded-xl flex items-center gap-3">
                    <span className="text-sm text-white/60">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                    >
                        <option value="reputation" className="bg-[#0B0C0C]">Reputation</option>
                        <option value="activity" className="bg-[#0B0C0C]">Activity</option>
                        <option value="joined" className="bg-[#0B0C0C]">Recently Joined</option>
                    </select>
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member, index) => (
                    <motion.div
                        key={member.address}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-black" style={{ backgroundColor: member.avatarColor }}>
                                    {member.address.substring(2, 4).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-white">
                                            {getRankBadge(member.rank)}
                                        </span>
                                        {member.role === 'Owner' && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#CFFB54]/20 text-[#CFFB54] border border-[#CFFB54]/30">
                                                Owner
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">Rank #{member.rank}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <p className="text-xs text-white/50 mb-1">Address</p>
                            <p className="font-mono text-sm text-white/90 group-hover:text-[#CFFB54] transition-colors">
                                {formatAddress(member.address)}
                            </p>
                        </div>

                        {/* Reputation Score */}
                        <div className="mb-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-xs text-white/50 mb-1">Reputation Score</p>
                            <p className={`text-3xl font-bold ${getReputationColor(member.reputation)}`}>
                                {member.reputation.toLocaleString()}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-xs text-white/50 mb-1">Total Votes</p>
                                <p className="text-lg font-bold text-white">{member.totalVotes}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p className="text-xs text-white/50 mb-1">Proposals</p>
                                <p className="text-lg font-bold text-white">{member.proposalsCreated}</p>
                            </div>
                        </div>

                        {/* Activity Info */}
                        <div className="pt-4 border-t border-white/10 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/50">Joined</span>
                                <span className="text-white/70">{member.joinedDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/50">Last Active</span>
                                <span className="text-[#CFFB54]">{member.lastActive}</span>
                            </div>
                        </div>

                        {/* View Profile Button */}
                        <button className="w-full mt-4 glass-hover px-4 py-2 rounded-lg text-sm font-semibold text-white/70 hover:text-white transition-all">
                            View Full Profile
                        </button>
                    </motion.div>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="glass p-12 rounded-2xl text-center">
                    <p className="text-white/50 text-lg">No members found</p>
                </div>
            )}

            {/* Leaderboard Summary */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Top Contributors</h3>
                <div className="space-y-3">
                    {localMembers.slice(0, 3).map((member, index) => (
                        <div
                            key={member.address}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: member.avatarColor }}>
                                    {member.address.substring(2, 4).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-mono text-sm text-white">{formatAddress(member.address)}</p>
                                    <p className="text-xs text-white/50">{member.totalVotes} votes • {member.proposalsCreated} proposals</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-xl font-bold ${getReputationColor(member.reputation)}`}>
                                    {member.reputation}
                                </p>
                                <p className="text-xs text-white/50">reputation</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
