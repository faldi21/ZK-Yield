<p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity" alt="Solidity"/>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Circom-2.0-blue" alt="Circom"/>
  <img src="https://img.shields.io/badge/Network-Mantle%20Sepolia-brightgreen" alt="Mantle"/>
</p>

<h1 align="center">🔐 ZK-Yield</h1>

<p align="center">
  <strong>Privacy-Preserving Yield Aggregator with Zero-Knowledge Proofs</strong>
</p>

<p align="center">
  A decentralized yield aggregation protocol that allows users to deposit, earn yield across multiple DeFi strategies, and withdraw — all while maintaining complete privacy through ZK-SNARK proofs.
</p>

---

## ✨ Features

| Feature                       | Description                                                          |
| ----------------------------- | -------------------------------------------------------------------- |
| 🔒 **Zero-Knowledge Privacy** | Verify your balance without revealing actual amounts using ZK-SNARKs |
| 📊 **Multi-Strategy Vault**   | Automated allocation across Aave, Uniswap, and Lido strategies       |
| ✅ **KYC Compliance**         | On-chain KYC verification with self-approval for testnet             |
| 💰 **Auto-Compounding**       | Yields automatically reinvested to maximize returns                  |
| 🎛️ **Admin Dashboard**        | Manage strategies, allocations, and user compliance                  |
| ⚡ **Built on Mantle**        | Fast, low-cost transactions on Mantle Sepolia testnet                |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         ZK-Yield Protocol                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│   │   Frontend  │───▶│  StrategyVaultV2 │───▶│   Strategies   │  │
│   │   (Next.js) │    │     (Multi)      │    ├────────────────┤  │
│   └──────┬──────┘    └────────┬─────────┘    │ • Aave         │  │
│          │                    │              │ • Uniswap      │  │
│          │           ┌────────┴─────────┐    │ • Lido         │  │
│          │           │                  │    └────────────────┘  │
│   ┌──────▼──────┐    │                  │                        │
│   │  ZK Proofs  │    │  ComplianceV2    │                        │
│   │  (Circom)   │    │  (KYC Manager)   │                        │
│   └─────────────┘    └──────────────────┘                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
zk-yield/
├── circuits/              # ZK circuits (Circom)
│   ├── kyc-verification/  # KYC verification circuit
│   └── scripts/           # Build scripts
│
├── contracts/             # Smart contracts (Foundry)
│   ├── src/
│   │   ├── StrategyVaultV2_Multi.sol  # Main vault contract
│   │   ├── ComplianceManagerV2.sol    # KYC management
│   │   ├── MockAaveStrategy.sol       # Aave strategy (mock)
│   │   ├── MockLidoStrategy.sol       # Lido strategy (mock)
│   │   └── MockUniswapStrategy.sol    # Uniswap strategy (mock)
│   └── script/            # Deployment scripts
│
├── frontend/              # Web application (Next.js)
│   ├── app/
│   │   ├── dashboard/     # User dashboard
│   │   ├── admin/         # Admin panel
│   │   └── login/         # Login & KYC flow
│   ├── components/        # React components
│   └── lib/               # Utilities & ABIs
│
└── docs/                  # Documentation
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Foundry (for smart contracts)
- Circom (for ZK circuits)

### Installation

```bash
# Clone repository
git clone https://github.com/faldi21/ZK-Yield.git
cd ZK-Yield

# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Fill in your values:
# - PRIVATE_KEY (for contract deployment)
# - RPC_URL (Mantle Sepolia)
# - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
```

### Run Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy Contracts

```bash
cd contracts
forge build
forge script script/DeployMantle.s.sol --rpc-url $RPC_URL --broadcast
```

---

## 📜 Smart Contracts

### Deployed on Mantle Sepolia

| Contract             | Address |
| -------------------- | ------- |
| ComplianceManagerV2  | `0x...` |
| StrategyVaultV2Multi | `0x...` |
| MockAaveStrategy     | `0x...` |
| MockLidoStrategy     | `0x...` |
| MockUniswapStrategy  | `0x...` |

### Key Functions

```solidity
// Deposit with KYC check
function deposit() external payable;

// Deposit with ZK balance proof
function deposit(
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    uint256[3] memory publicSignals
) external payable;

// Withdraw shares
function withdraw(uint256 sharesToBurn) external;

// Admin: Allocate funds to strategies
function allocateToStrategies() external onlyOwner;

// Admin: Harvest yields
function harvestYields() external onlyOwner;
```

---

## 🔐 Zero-Knowledge Circuits

The protocol uses Circom circuits to generate ZK proofs:

### KYC Verification Circuit

Proves that a user has completed KYC without revealing personal information.

```circom
template KycVerification() {
    signal input userId;
    signal input kycHash;
    signal input timestamp;
    signal output isValid;

    // Verify KYC without revealing identity
    ...
}
```

### Balance Proof Circuit

Proves minimum balance requirements without revealing exact amounts.

---

## 🖥️ Frontend Pages

| Page         | Description                          |
| ------------ | ------------------------------------ |
| `/`          | Landing page with features overview  |
| `/login`     | Wallet connection & KYC verification |
| `/dashboard` | User dashboard with deposit/withdraw |
| `/admin`     | Admin panel for strategy management  |

---

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity, Foundry, OpenZeppelin
- **ZK Proofs**: Circom, SnarkJS
- **Frontend**: Next.js 16, React, Wagmi, Viem
- **Wallet**: RainbowKit, WalletConnect
- **Network**: Mantle Sepolia Testnet

---

## 🗺️ Roadmap

- [x] Multi-strategy vault architecture
- [x] KYC compliance system
- [x] Admin dashboard
- [x] ZK balance verification
- [x] DeFi strategy integration

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  <strong>Built with ❤️ for the future of private DeFi</strong>
</p>
