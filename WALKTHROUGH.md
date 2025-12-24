# Atlas Mantle DAO Hub - Complete Walkthrough

## 🎯 Project Overview

**Atlas** is a next-generation Multi-Signature DAO governance platform built specifically for **Mantle Network**. It combines gasless transactions, on-chain reputation scoring, and premium UX to redefine how DAOs operate.

### Key Innovations

1. **Gasless Multi-Sig Operations** - Execute approvals and transactions without holding MNT for gas fees
2. **On-Chain Reputation System** - Earn and decay reputation based on participation
3. **Premium Dark UI** - Modern, animated interface with smooth interactions
4. **Social Login Support** - Connect via Google/Twitter through Particle Network
5. **Auto Network Detection** - Automatically prompts users to switch to Mantle Sepolia

---

## 🚀 Quick Start Guide

### Prerequisites

- MetaMask or any Web3 wallet
- Mantle Sepolia Testnet configured
- MNT tokens for testing (from [Mantle Faucet](https://faucet.sepolia.mantle.xyz/))

### Installation

```bash
cd frontend/mantle-dao-hub
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## 📱 User Journey

### 1. Landing Page Experience

When you first visit Atlas, you'll see:

- **Hero Section** with animated Lamp effect showcasing the "Atlas DAO Hub" title
- **Navigation** New Pill-style floating navigation bar with blurred glass effect
- **Welcome Section** with interactive pixelated Atlas logo (hover to see distortion effect)
- **Text Reveal** - Scroll-based sticky animation highlighting key value propositions
- **Protocol Features** - Three core features with hover animations

### 2. Wallet Connection

Click **"Connect Wallet"** to open the login modal with two options:

#### Option A: MetaMask
- Click "MetaMask" button
- Approve connection in MetaMask popup
- **Auto Network Check**: If you're not on Mantle Sepolia, you'll see a warning banner
- Click "Switch to Mantle Sepolia" to automatically add/switch networks

#### Option B: Social Login (Particle Network)
- Click "Social Login"
- Choose Google, Twitter, or Email
- Particle handles wallet creation behind the scenes
- Gasless experience powered by Particle's AA infrastructure
*Note: Requires valid Particle Network API keys in `.env.local`*

### 3. Dashboard Overview

Once connected, you'll see three main sections:

#### A. Treasury Stats
#### A. Treasury Stats & Analytics
- **Real-time Charts**:
  - **Balance History**: Visualizes treasury growth (simulated history based on current balance)
  - **Transaction Volume**: Daily incoming vs outgoing activity derived from contract events
  - **Asset Distribution**: Breakdown of treasury holdings (MNT)
- **Key Metrics**: Avg transaction size, active member count, and total volume

#### B. Multi-Sig Transactions
- **Pending Transactions**: Awaiting approvals
- **Executed Transactions**: Completed transactions
- **Submit New Transaction**: Create new multi-sig proposals

#### C. Reputation Card
- **Your Score**: Current reputation points
- **Rank**: Position among DAO members
- **Activity**: Recent participation history

---

## 🔐 Multi-Sig Transaction Flow

### Submitting a Transaction

1. Click **"Submit New Transaction"** button
2. Fill in the form:
   - **Recipient Address**: Destination wallet
   - **Amount**: MNT to send (in ether)
   - **Description**: Purpose of transaction
3. Click **"Submit Transaction"**
4. **Transaction Modal** appears:
   - ⏳ **Pending**: "Processing Transaction..." with animated spinner
   - ✅ **Success**: Confetti animation + transaction hash link
   - ❌ **Error**: Retry button if failed

### Approving a Transaction

1. Navigate to **"Pending Transactions"** tab
2. Find the transaction you want to approve
3. Click **"Approve"** button
4. **Transaction Modal** shows:
   - Pending state while waiting for wallet confirmation
   - Success state with link to Mantle Explorer
   - Approval count updates automatically

### Executing a Transaction

Once a transaction reaches the required threshold (e.g., 2/3 approvals):

1. The **"Execute"** button becomes enabled
2. Click **"Execute"**
3. **Transaction Modal** displays:
   - Pending animation
   - Success with 🎉 confetti effect
   - Transaction hash link to verify on-chain

### Gasless Transactions (BETA)

1. In the "Submit Transaction" modal, toggle **"Gasless Transaction"**.
2. **Prerequisite**: The Biconomy Smart Account address (created from your wallet) must be an **Owner** of the Multi-Sig contract.
   - *Why?* The transaction is submitted by the Smart Account, not your EOA (MetaMask wallet).
   - If the Smart Account is not an owner, the transaction will revert.
3. The system encodes your proposal and sends it via Biconomy's Paymaster.

---

## 🏆 Reputation System

### How It Works

- **Earn Points**: +10 points for each approval, +20 for execution
- **Decay Logic**: Points decrease over time if inactive
- **Ranking**: Leaderboard shows top contributors
- **Rewards**: High reputation unlocks governance privileges

### Viewing Reputation

1. Check **Reputation Card** on the right sidebar
2. See your current score and rank
3. View activity history
4. Track decay rate

---

## 🎨 UI/UX Features

### Interactive Elements

1. **Pixelated Logo**: Hover over the Atlas logo in the Welcome section to see swirl distortion
2. **Smooth Cursor**: Custom cursor with trailing effect
3. **Text Reveal**: Scroll slowly through the tagline section to see word-by-word highlighting
4. **Lamp Effect**: Animated spotlight on the hero title
5. **Glass Morphism**: Frosted glass effects on cards and modals

### Animations

- **Framer Motion** powers all animations
- **Micro-interactions** on buttons (scale on hover/tap)
- **Stagger animations** on transaction lists
- **Confetti effect** on successful transactions

---

## 🔧 Technical Architecture

### Smart Contracts

- **AtlasMultiSig.sol**: Core multi-sig logic with reputation
- **Deployed on**: Mantle Sepolia Testnet
- **Address**: `0x...` (check `.env.local`)

### Frontend Stack

- **Next.js 14** (App Router)
- **Ethers.js v6** for Web3 interactions
- **Framer Motion** for animations
- **Zustand** for state management
- **TailwindCSS** for styling

### Key Integrations

1. **Particle Network**: Social login + Account Abstraction
2. **Mantle Paymaster**: Gasless transactions
3. **Mantle Explorer**: Transaction verification

---

## 🐛 Troubleshooting

### "Wrong Network" Warning

**Problem**: You're not on Mantle Sepolia  
**Solution**: Click the yellow "⚠️ Wrong Network" button in the navbar or login modal

### Transaction Fails

**Problem**: Transaction reverts  
**Solution**: 
- Check you have enough MNT balance
- Verify you're an owner of the multi-sig
- Ensure transaction hasn't been executed already
- Click "Try Again" in the error modal

### Wallet Not Connecting

**Problem**: MetaMask doesn't respond  
**Solution**:
- Refresh the page
- Unlock MetaMask
- Try Social Login instead

---

## 📊 Testing Scenarios

### Scenario 1: First-Time User

1. Visit landing page
2. Scroll through all sections
3. Connect with MetaMask
4. Switch to Mantle Sepolia when prompted
5. Explore dashboard

### Scenario 2: Submit & Approve Flow

1. Connect as Owner 1
2. Submit a transaction (0.01 MNT to test address)
3. Disconnect and connect as Owner 2
4. Approve the transaction
5. Execute when threshold is met

### Scenario 3: Reputation Tracking

1. Approve multiple transactions
2. Watch reputation score increase
3. Check ranking on leaderboard
4. View activity history

---

## 🎥 Demo Video

[Link to demo video showing full user journey]

---

## 📝 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_ATLAS_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_PARTICLE_PROJECT_ID=...
NEXT_PUBLIC_PARTICLE_CLIENT_KEY=...
NEXT_PUBLIC_PARTICLE_APP_ID=...
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
NEXT_PUBLIC_PAYMASTER_URL=...
```

---

## 🏗️ Future Enhancements

- [ ] Governance proposal voting system
- [ ] Member directory with profiles
- [ ] Multi-chain support (Mantle Mainnet)
- [ ] Mobile app (React Native)

---

## 📞 Support

- **GitHub**: [Repository Link]
- **Discord**: [Community Link]
- **Email**: support@atlas-dao.xyz

---

## 🙏 Acknowledgments

Built for **Mantle Global Hackathon 2025**

Special thanks to:
- Mantle Network team for the amazing L2 infrastructure
- Particle Network for seamless social login
- The Web3 community for continuous inspiration

---

**Made with ❤️ for the future of DAO governance**
