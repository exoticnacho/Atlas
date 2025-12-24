# Atlas DAO Hub 🚀

A premium decentralized autonomous organization (DAO) interface built on **Mantle Sepolia Network** featuring multi-signature wallet management, gasless transactions, and a gamified reputation system.

## ✨ Features

### Core Functionality
- **🔐 Multi-Sig Wallet**: Secure multi-signature transaction management with real-time updates
- **⚡ Gasless Transactions**: Execute operations without paying gas fees (Biconomy integration - Beta)
- **🔑 Social Login**: Connect via Google, Twitter, Discord (Particle Network - Beta)
- **📊 Treasury Dashboard**: Real-time visualization of DAO assets from blockchain
- **💎 Treasury Analytics**: Live charts with balance history, transaction volume, and asset distribution

### Governance & Reputation
- **🏆 Reputation System**: Earn points based on actual votes and proposals created
- **👥 Member Directory**: View all DAO owners with dynamic stats and rankings
- **🗳️ Governance Proposals**: View and vote on multi-sig proposals
- **⚙️ DAO Settings**: Manage configuration, view owners, and advanced settings

### Premium UX
- **🎨 Premium UI**: Glassmorphism design with GSAP animations
- **🖱️ Smooth Cursor**: Custom animated cursor for premium feel
- **💫 Interactive Effects**: Glowing cards, lamp effects, pixelated canvas
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile
- **🔔 Toast Notifications**: Real-time feedback on all actions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Styling**: Tailwind CSS v4 + Custom Design System
- **Blockchain**: Ethers.js v6 + Real-time Event Listeners
- **State Management**: Zustand
- **Animations**: Framer Motion + GSAP
- **Charts**: Recharts + Chart.js
- **Gasless**: Biconomy SDK (Beta)
- **Social Auth**: Particle Network (Beta)
- **Network**: Mantle Sepolia Testnet (5003)

## 📁 Project Structure

```
/
├── contracts/             # Smart Contract source code
│   └── AtlasMultiSig.sol  # Core Multi-Sig implementation
├── frontend/              # Next.js Frontend application
│   ├── src/
│   │   ├── abi/           # Contract ABIs
│   │   ├── app/           # App Router pages
│   │   ├── components/    # UI Components
│   │   └── hooks/         # Custom hooks (logic)
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies
│   └── ...
├── README.md              # Project overview
├── WALKTHROUGH.md         # User journey & feature demo
├── BLUEPRINT_COMPLIANCE.md # Requirement check
└── IMPLEMENTATION_SUMMARY.md # Technical architecture
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Mantle Sepolia testnet MNT tokens ([Get from faucet](https://faucet.sepolia.mantle.xyz))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-folder>
```

2. Setup Frontend:
```bash
cd frontend
npm install
```

3. Configure environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
NEXT_PUBLIC_ATLAS_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_PARTICLE_PROJECT_ID=your_particle_project_id
NEXT_PUBLIC_PARTICLE_CLIENT_KEY=your_particle_client_key
NEXT_PUBLIC_PARTICLE_APP_ID=your_particle_app_id
NEXT_PUBLIC_BICONOMY_PAYMASTER_URL=your_biconomy_paymaster_url
NEXT_PUBLIC_BICONOMY_BUNDLER_URL=your_biconomy_bundler_url
NEXT_PUBLIC_GOLDRUSH_API_KEY=your_goldrush_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Mantle Sepolia Network

The app is configured to work with Mantle Sepolia testnet:
- **Chain ID**: 5003 (0x138B)
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Explorer**: https://sepolia.mantlescan.xyz
- **Faucet**: https://faucet.sepolia.mantle.xyz

The app will automatically prompt you to add/switch to Mantle Sepolia when connecting your wallet.

### Contract Integration

The Atlas Multi-Sig contract ABI is located at `src/abi/Atlas.json`. Update the contract address in `.env.local` after deployment.

## 🎨 Design System

The app uses a "Premium Dark" aesthetic with:

- **Primary Color**: `#CFFB54` (Mantle Lime Green)
- **Secondary Color**: `#A855F7` (Purple)
- **Accent Color**: `#3B82F6` (Blue)
- **Background**: `#0B0C0C` (Deep Black)
- **Glassmorphism**: Cards with backdrop blur and subtle borders
- **Mesh Gradients**: Animated background effects
- **Typography**: System fonts with custom weights
- **Animations**: Smooth transitions with Framer Motion & GSAP

## 🔐 Smart Contract Functions

The frontend integrates with these Atlas contract functions:

- `submitTransaction(to, value, data, autoExecute)` - Submit new transaction
- `approveTransaction(txId)` - Approve pending transaction
- `executeTransaction(txId)` - Execute approved transaction
- `getTransactionCount()` - Get total transaction count
- `transactions(txId)` - Get transaction details
- `approved(txId, owner)` - Check if owner approved
- `isOwner(address)` - Check if address is owner
- `threshold()` - Get approval threshold
- `owners(index)` - Get owner by index

## ✅ Completed Features

- [x] Particle Network integration for social login (Beta)
- [x] Biconomy SDK for gasless transactions (Beta)
- [x] Real-time event listeners for transaction updates
- [x] Treasury analytics with real contract data
- [x] Reputation system based on actual participation
- [x] Member directory with dynamic metadata
- [x] DAO settings and configuration page
- [x] Premium UI with animations and effects
- [x] Mobile responsive optimization
- [x] **Portfolio & NFT Analytics (GoldRush)**: Integrated Covalent GoldRush SDK for real-time asset tracking (Active on Mantle Mainnet, with premium fallbacks for Sepolia)
- [x] Toast notifications for user feedback

## 🚧 Future Enhancements

- [ ] Multi-chain treasury aggregation (Beyond Mantle)
- [ ] WebSocket notifications for instant updates
- [ ] Advanced proposal creation with custom parameters
- [ ] Delegation and voting power system
- [ ] DAO analytics dashboard with deep historical indexing (SubQuery/Dune)

## 📝 License

MIT License - feel free to use this project for your own DAO!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for **Mantle Global Hackathon 2025**
