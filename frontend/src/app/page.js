'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import Navbar from '../components/Navbar'; // Removing Navbar
import PillNav from '../components/ui/PillNav';
import { formatAddress } from '../utils/contracts';
import Dashboard from '../components/Dashboard';
import MultiSigTxList from '../components/MultiSigTxList';
import ReputationCard from '../components/ReputationCard';
import TreasuryAnalytics from '../components/TreasuryAnalytics';
import GovernanceProposals from '../components/GovernanceProposals';
import MemberDirectory from '../components/MemberDirectory';
import DAOSettings from '../components/DAOSettings';
import useWalletStore from '../context/WalletContext';
import LoginModal from '../components/LoginModal';
import { PixelatedCanvas } from '../components/ui/pixelated-canvas';
import { LampContainer } from '../components/ui/lamp';
import { SmoothCursor } from '../components/ui/smooth-cursor';
import { TextReveal } from '../components/ui/text-reveal';

export default function Home() {
  const { address, isConnected, balance, disconnectWallet, loading, wrongNetwork, checkNetwork, switchNetwork } = useWalletStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'analytics' | 'governance' | 'members' | 'settings'

  // Network check
  useEffect(() => {
    if (isConnected) {
      checkNetwork();
    }
  }, [isConnected, checkNetwork]);

  // Handle hash navigation for PillNav to switch activeSection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'analytics', 'governance', 'members', 'settings'].includes(hash)) {
        setActiveSection(hash);
      }
    };
    // Sync on mount and changes
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Governance', href: '#governance' },
    { label: 'Members', href: '#members' },
    { label: 'Settings', href: '#settings' }
  ];

  return (
    <div className="min-h-screen relative bg-[#0B0C0C] selection:bg-[#CFFB54] selection:text-black">
      <SmoothCursor />
      <div className="mesh-bg opacity-20" />

      {/* Navigation - PillNav */}
      <PillNav
        logo="/logo/logo without text.png"
        items={navItems}
        activeHref={`#${activeSection}`}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000]"
        pillColor="#1a1a1a"
        baseColor="rgba(20, 20, 20, 0.8)"
        pillTextColor="#e5e5e5"
        hoveredPillTextColor="#0B0C0C"
      />

      {/* Wallet Connection - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-[1001] flex items-center gap-3">
        {isConnected ? (
          <>
            <div className="hidden sm:block px-4 py-2 rounded-full border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md">
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mb-0.5">Balance</p>
              <p className="text-xs font-mono font-bold text-white">
                {parseFloat(balance).toFixed(4)} MNT
              </p>
            </div>

            {wrongNetwork && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={switchNetwork}
                className="px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 backdrop-blur-md"
              >
                <span>⚠️</span>
                <span className="hidden md:inline">Wrong Network</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={disconnectWallet}
              className="px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 bg-[#1a1a1a]/80 border border-white/10 backdrop-blur-md hover:bg-white/5 hover:border-white/20 text-white transition-all"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              <span className="font-mono text-xs">{formatAddress(address)}</span>
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLoginModalOpen(true)}
            disabled={loading}
            className="bg-[#CFFB54] text-black font-semibold text-sm px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(207,251,84,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
            )}
          </motion.button>
        )}
      </div>

      <main className="pt-20 pb-0 px-0">

        {/* TOP SECTION: Hero & Welcome (Boxed) */}
        <div className="max-w-[85rem] mx-auto border-x border-t border-white/10 bg-[#0B0C0C] relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* 1. HERO SECTION (Lamp) */}
          <section className="relative w-full overflow-hidden border-b border-white/5">
            <LampContainer>
              <motion.div
                initial={{ opacity: 0.5, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="relative z-50 flex flex-col items-center px-4"
              >
                <h1 className="bg-gradient-to-br from-[#CFFB54] via-green-400 to-[#CFFB54]/50 py-4 bg-clip-text text-center text-6xl md:text-9xl font-bold tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(207,251,84,0.3)] leading-none mb-4">
                  Atlas DAO Hub
                </h1>

                <p className="mt-4 text-lg md:text-2xl text-white/80 max-w-3xl mx-auto font-light tracking-wide text-center leading-relaxed">
                  Decentralized governance on Mantle Network with <span className="text-[#CFFB54] font-medium">gasless transactions</span>,
                  reputation system, and cross-chain treasury management.
                </p>
              </motion.div>
            </LampContainer>
          </section>

          {!isConnected && (
            <div className="w-full relative z-20 bg-[#0B0C0C] py-0 border-b border-white/5 -mt-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center px-4"
              >
                <div className="mx-auto flex items-center justify-center mb-2">
                  <div className="relative">
                    <PixelatedCanvas
                      src="/logo/logo without background.png"
                      width={600}
                      height={600}
                      cellSize={4}
                      dotScale={0.9}
                      shape="square"
                      backgroundColor="transparent"
                      dropoutStrength={0.2}
                      interactive={true}
                      distortionStrength={0.8}
                      distortionRadius={250}
                      distortionMode="swirl"
                      followSpeed={0.2}
                      jitterStrength={1}
                      jitterSpeed={1}
                      sampleAverage={true}
                      tintColor="#CFFB54"
                      tintStrength={0.1}
                      className="rounded-xl relative z-10"
                    />
                  </div>
                </div>

                <motion.h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight -mt-24 relative z-20">
                  Welcome to the Future of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CFFB54] to-white">DAO Governance</span>
                </motion.h2>

                <motion.p className="text-[#94A3B8] mb-10 leading-relaxed text-lg md:text-xl font-light max-w-2xl mx-auto">
                  Connect your wallet to access the DAO dashboard and start participating
                  in governance decisions on Mantle Sepolia.
                </motion.p>

                <motion.div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-[#CFFB54] text-black text-lg font-bold px-10 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(207,251,84,0.4)] transition-all duration-300"
                  >
                    Connect Wallet
                  </button>
                  <button className="bg-transparent text-white border border-white/20 text-lg font-medium px-10 py-4 rounded-full hover:bg-white/5 hover:border-[#CFFB54]/50 hover:text-[#CFFB54] transition-all duration-300">
                    Read Documentation
                  </button>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>


        {/* MIDDLE SECTION: Text Reveal (Full Width / Outside Boxed) */}
        {/* Must be outside to stick correctly without border interference */}
        {!isConnected && (
          <div className="w-full bg-[#0B0C0C] border-y border-white/5">
            <TextReveal text="Redefining DAO Governance. Zero Gas. 100% On-Chain Reputation." />
          </div>
        )}

        {/* BOTTOM SECTION: Features or Dashboard (Boxed Again) */}
        <div className="max-w-[85rem] mx-auto border-x border-b border-white/10 bg-[#0B0C0C] relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">

          {!isConnected ? (
            <section className="py-24 w-full relative bg-[#0B0C0C]">
              <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center tracking-tighter text-white">
                  Protocol Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  {[
                    {
                      icon: '⚡',
                      title: 'Gasless Operations',
                      description: 'Execute multi-sig approvals and transactions without holding MNT for gas. Powered by Paymaster.',
                    },
                    {
                      icon: '🏆',
                      title: 'Reputation Scoring',
                      description: 'Earn on-chain reputation for active voting and contribution. Decaying logic ensures active participation.',
                    },
                    {
                      icon: '🌐',
                      title: 'Asset Management',
                      description: 'Comprehensive view of DAO treasury across Mantle and connected networks with real-time analytics.',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="glass p-8 group hover:bg-[#CFFB54]/5 hover:border-[#CFFB54]/30 hover:shadow-[0_0_30px_-5px_rgba(207,251,84,0.1)] transition-all duration-500 rounded-3xl"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-white/5 group-hover:bg-[#CFFB54] group-hover:text-black group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-[#CFFB54]`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 tracking-tight text-white group-hover:text-[#CFFB54] transition-colors">{feature.title}</h3>
                      <p className="text-[#94A3B8] leading-relaxed font-light text-lg opacity-80 group-hover:opacity-100 transition-opacity">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <div className="space-y-8 p-8">
              {/* Dashboard Stats */}
              <section id="dashboard" className="scroll-mt-32">
                <Dashboard />
              </section>

              {/* Navigation Tabs */}
              <div className="flex gap-2 glass p-1 rounded-lg w-fit">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'analytics', label: 'Analytics' },
                  { key: 'governance', label: 'Governance' },
                  { key: 'members', label: 'Members' },
                  { key: 'settings', label: 'Settings' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSection(tab.key)}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeSection === tab.key
                      ? 'bg-[#CFFB54] text-black'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Sections */}
              {activeSection === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6" id="transactions">
                    <MultiSigTxList />
                  </div>
                  <div id="reputation" className="space-y-6">
                    <ReputationCard />
                  </div>
                </div>
              )}

              {activeSection === 'analytics' && (
                <TreasuryAnalytics />
              )}

              {activeSection === 'governance' && (
                <GovernanceProposals />
              )}

              {activeSection === 'members' && (
                <MemberDirectory />
              )}

              {activeSection === 'settings' && (
                <DAOSettings />
              )}
            </div>
          )}

          <footer className="py-12 border-t border-white/10 bg-black">
            <div className="text-center text-[#94A3B8]">
              <p className="mb-2 font-medium text-[#CFFB54]">Built for Mantle Global Hackathon 2025</p>
              <p className="text-sm opacity-50">© 2024 Atlas Multi-Sig Protocol</p>
            </div>
          </footer>

        </div>
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
