# ZK-Yield: Privacy-Preserving Compliant Yield Aggregator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/solidity-0.8.24-brightgreen.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**Mantle Global Hackathon 2025 - ZK & Privacy Track**

Privacy-preserving DeFi yield aggregation platform using zero-knowledge proofs to enable institutional-grade compliance without compromising strategic privacy.

---

## 🎯 Problem Statement

Institutional investors face a critical paradox in DeFi:
- **Privacy Requirements**: Need to protect trading strategies and portfolio positions
- **Compliance Obligations**: Must prove regulatory compliance (KYC, jurisdiction, source of funds)
- **Current Limitation**: Forced to choose between full transparency (losing competitive advantage) or complete anonymity (failing compliance)

**Result**: $120B+ institutional capital remains sidelined from DeFi's 10-15% yields.

---

## 💡 Solution

ZK-Yield uses zero-knowledge proofs to enable selective disclosure:

✅ **Prove compliance** WITHOUT revealing identity  
✅ **Prove capital threshold** WITHOUT revealing exact balance  
✅ **Prove yield legitimacy** WITHOUT revealing transaction history

### Core Innovation: Three-Pillar ZK Architecture

1. **ZK-KYC**: Selective disclosure identity verification
2. **Yield-Proof Mechanism**: Source legitimacy verification
3. **Balance-Proof Gating**: Tiered access without exposure

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│  Next.js + TypeScript + wagmi/viem + Mantle SDK             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     ZK PROOF SYSTEM                          │
│  Circom Circuits + SnarkJS                                   │
│  - KYC credential verification circuit                       │
│  - Balance range proof circuit                               │
│  - Yield source verification circuit                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   SMART CONTRACTS (Mantle)                   │
│  Solidity + Foundry                                          │
│  - Verifier contracts (auto-generated from Circom)           │
│  - Strategy vault contracts                                  │
│  - Access control with ZK-gating                             │
│  - Yield aggregation logic                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   MANTLE DeFi ECOSYSTEM                      │
│  - mETH liquid staking                                       │
│  - FBTC wrapped bitcoin                                      │
│  - Native DEXs and lending protocols                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
zk-yield/
├── circuits/               # Circom ZK circuits
│   ├── kyc-verification.circom
│   ├── balance-range.circom
│   └── yield-source.circom
├── contracts/              # Solidity smart contracts
│   ├── src/
│   │   ├── ZKVerifier.sol
│   │   ├── ComplianceManager.sol
│   │   ├── StrategyVault.sol
│   │   └── YieldRouter.sol
│   └── test/
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── public/
├── scripts/                # Deployment and utility scripts
├── tests/                  # Integration tests
└── docs/                   # Documentation
```

---

## 🛠️ Technology Stack

### ZK Layer
- **Circom 0.5.46+**: Circuit design language
- **SnarkJS 0.7.5+**: Proof generation and verification
- **Groth16**: Proof system (production-ready, efficient)

### Smart Contracts
- **Solidity 0.8.24**: Contract language
- **Foundry**: Development framework
- **OpenZeppelin**: Security libraries

### Frontend
- **Next.js 14+**: React framework
- **TypeScript**: Type safety
- **wagmi + viem**: Ethereum interactions
- **Mantle SDK**: Network-specific tools

### Network
- **Mantle Network**: Layer 2 deployment
- **Mantle Sepolia**: Testnet development

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js (v18+)
node --version

# npm or yarn
npm --version

# Circom compiler
circom --version

# SnarkJS
snarkjs --version

# Foundry (forge, cast, anvil)
forge --version
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/[your-username]/zk-yield.git
cd zk-yield
```

2. **Install dependencies**
```bash
# Install circuit dependencies
cd circuits
npm install

# Install contract dependencies
cd ../contracts
forge install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development Workflow

#### 1. Compile ZK Circuits

```bash
cd circuits

# Compile circuit
circom kyc-verification.circom --r1cs --wasm --sym -o build/

# Generate proving/verification keys (using Powers of Tau)
snarkjs groth16 setup build/kyc-verification.r1cs powersoftau_final.ptau circuit_0000.zkey

# Export verification key
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

# Export Solidity verifier
snarkjs zkey export solidityverifier circuit_final.zkey ../contracts/src/KYCVerifier.sol
```

#### 2. Develop & Test Smart Contracts

```bash
cd contracts

# Build contracts
forge build

# Run tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Deploy to local testnet
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

#### 3. Run Frontend

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🧪 Testing

### Circuit Tests
```bash
cd circuits
npm test
```

### Smart Contract Tests
```bash
cd contracts
forge test -vvv
```

### Integration Tests
```bash
cd tests
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📊 Performance Benchmarks

### Target Metrics (MVP)
- **Proof Generation**: <10 seconds (browser)
- **Verification Gas**: <150K gas (~$2 on Mantle)
- **Circuit Constraints**: <50K per proof type
- **Smart Contract Coverage**: >90%

---

## 🔒 Security

### Audit Status
- [ ] Internal security review
- [ ] External audit (planned post-hackathon)
- [ ] Bug bounty program (planned)

### Security Features
- Multi-layer security architecture
- Reentrancy guards on all state-changing functions
- Access control with role-based permissions
- Emergency pause functionality
- Comprehensive test coverage

### Reporting Vulnerabilities
Please report security vulnerabilities to: [security@zk-yield.io]

---

## 🗺️ Roadmap

### Phase 1: MVP (Hackathon - 5 Weeks) ✅
- [x] Core ZK circuits (KYC, Balance, Yield)
- [x] Smart contracts on Mantle testnet
- [x] Functional web interface
- [x] Single strategy demonstration

### Phase 2: Post-Hackathon (Q1 2025)
- [ ] Professional security audit
- [ ] Multiple yield strategies
- [ ] Enhanced UI/UX
- [ ] Mainnet deployment (limited beta)

### Phase 3: Public Launch (Q2 2025)
- [ ] Full mainnet launch
- [ ] Institutional partnerships (3-5 pilot programs)
- [ ] Marketing campaign
- [ ] DAO governance structure

### Phase 4: Expansion (Q3-Q4 2025)
- [ ] Cross-chain expansion
- [ ] Additional asset types
- [ ] API for institutional integrations
- [ ] Series A fundraising

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

**[Your Name]**  
PhD Candidate - Computer Science  
Blockchain Researcher (ECC, Layer 2 Scaling, DeFi)

- Previous: RWA lending protocol, Plasma blockchain research
- Specialization: Zero-knowledge proofs, Smart contract security
- Contact: [your-email@example.com]
- GitHub: [@your-username](https://github.com/your-username)

---

## 🏆 Acknowledgments

- **Mantle Network** for hosting the hackathon
- **Circom & SnarkJS** teams for ZK tooling
- **Foundry** for development framework
- **Community** for feedback and support

---

## 📞 Contact & Links

- **Website**: [zk-yield.io](https://zk-yield.io) (coming soon)
- **Demo**: [demo.zk-yield.io](https://demo.zk-yield.io)
- **Documentation**: [docs.zk-yield.io](https://docs.zk-yield.io)
- **Twitter**: [@ZKYield](https://twitter.com/ZKYield)
- **Discord**: [Join our community](https://discord.gg/zkyield)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/zk-yield&type=Date)](https://star-history.com/#your-username/zk-yield&Date)

---

**Built with ❤️ for Mantle Global Hackathon 2025**

*Privacy AND Compliance - Finally Possible*
