'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatAddress } from '../utils/contracts';
import useMultiSig from '../hooks/useMultiSig';
import useWalletStore from '../context/WalletContext';

export default function DAOSettings() {
    const { threshold, owners, reputation } = useMultiSig();
    const { address, isOwner } = useWalletStore();
    const [selectedOwner, setSelectedOwner] = useState(null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">DAO Settings</h2>
                    <p className="text-sm text-white/60">Manage your DAO configuration and members</p>
                </div>
            </div>

            {/* Configuration Card */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Multi-Sig Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-hover p-4 rounded-xl">
                        <p className="text-xs text-white/60 mb-1">Approval Threshold</p>
                        <p className="text-3xl font-bold text-[#CFFB54]">{threshold}</p>
                        <p className="text-xs text-white/50 mt-1">Required approvals</p>
                    </div>
                    <div className="glass-hover p-4 rounded-xl">
                        <p className="text-xs text-white/60 mb-1">Total Owners</p>
                        <p className="text-3xl font-bold text-white">{owners.length}</p>
                        <p className="text-xs text-white/50 mt-1">Active members</p>
                    </div>
                    <div className="glass-hover p-4 rounded-xl">
                        <p className="text-xs text-white/60 mb-1">Your Status</p>
                        <p className="text-lg font-bold text-white mt-2">
                            {isOwner ? (
                                <span className="text-[#CFFB54] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#CFFB54] animate-pulse"></span>
                                    Owner
                                </span>
                            ) : (
                                <span className="text-white/50">Member</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Owners List */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">DAO Owners</h3>
                    <button
                        className="btn-secondary text-sm"
                        disabled
                        title="Add owner functionality requires contract upgrade"
                    >
                        + Add Owner
                    </button>
                </div>

                <div className="space-y-3">
                    {owners.map((owner, index) => {
                        const rep = reputation[owner] || { points: 0, rank: 0, votes: 0, proposals: 0 };
                        const isCurrentUser = owner.toLowerCase() === address?.toLowerCase();

                        return (
                            <motion.div
                                key={owner}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`glass-hover p-4 rounded-xl cursor-pointer ${isCurrentUser ? 'border border-[#CFFB54]/30 bg-[#CFFB54]/5' : ''
                                    }`}
                                onClick={() => setSelectedOwner(owner)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Avatar */}
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-black"
                                            style={{
                                                background: `linear-gradient(135deg, ${['#CFFB54', '#3B82F6', '#A855F7', '#EF4444', '#F59E0B'][parseInt(owner.slice(-1), 16) % 5]
                                                    }, ${['#A8D93D', '#2563EB', '#7C3AED', '#DC2626', '#D97706'][parseInt(owner.slice(-1), 16) % 5]
                                                    })`
                                            }}
                                        >
                                            {owner.substring(2, 4).toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-mono text-sm text-white font-semibold">
                                                    {formatAddress(owner)}
                                                </p>
                                                {isCurrentUser && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#CFFB54]/20 text-[#CFFB54]">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-white/60">
                                                <span>Rank #{rep.rank}</span>
                                                <span>•</span>
                                                <span>{rep.points} pts</span>
                                                <span>•</span>
                                                <span>{rep.votes || 0} votes</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <button
                                        className="text-red-500/50 hover:text-red-500 text-sm px-3 py-1 rounded-lg hover:bg-red-500/10 transition-all"
                                        disabled
                                        title="Remove owner functionality requires contract upgrade"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Advanced Settings */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Advanced Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <p className="text-sm font-semibold text-white">Change Threshold</p>
                            <p className="text-xs text-white/50 mt-1">Modify the number of required approvals</p>
                        </div>
                        <button className="btn-secondary text-sm" disabled title="Requires contract upgrade">
                            Configure
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <p className="text-sm font-semibold text-white">Gasless Transactions</p>
                            <p className="text-xs text-white/50 mt-1">Enable/disable gasless operations via Biconomy</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#CFFB54]">Beta</span>
                            <div className="w-12 h-6 bg-[#CFFB54]/20 rounded-full flex items-center px-1 cursor-pointer">
                                <div className="w-4 h-4 bg-[#CFFB54] rounded-full translate-x-6 transition-transform"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <p className="text-sm font-semibold text-white">Export DAO Data</p>
                            <p className="text-xs text-white/50 mt-1">Download transaction history and member data</p>
                        </div>
                        <button className="btn-secondary text-sm">
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="glass p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <p className="text-sm font-semibold text-white mb-1">Contract Upgrade Required</p>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Some settings like adding/removing owners or changing the threshold require deploying an upgraded contract version.
                            Current contract is view-only for these operations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
