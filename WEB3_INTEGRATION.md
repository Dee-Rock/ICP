# 🎬 CineAI Web3 Integration Guide

## 🌟 Overview

CineAI has been enhanced with **Internet Computer Protocol (ICP)** blockchain integration, transforming it into a decentralized movie discovery platform with:

- **🔐 Wallet Authentication** - Connect with Internet Identity
- **📝 Blockchain Reviews** - Immutable, verified movie reviews
- **🪙 CINE Token Rewards** - Earn tokens for quality contributions
- **👤 Decentralized Profiles** - User profiles stored on-chain
- **⭐ Reputation System** - Build credibility through quality reviews

## 🏗️ Smart Contract Architecture

### 1. Movie Reviews Contract (`movie_reviews`)
- **Decentralized Reviews**: Store reviews immutably on ICP blockchain
- **Anti-Spam Protection**: One review per user per movie
- **Helpful Voting**: Community-driven review quality assessment
- **Reputation Tracking**: Build reviewer credibility over time

### 2. CineToken Contract (`cine_token`)
- **ICRC-1 Compatible**: Standard ICP token implementation
- **Reward System**: Automatic token distribution for platform engagement
- **Token Economics**:
  - 📝 Movie Review: 0.1 CINE
  - ⭐ Quality Review: 0.5 CINE
  - 👍 Helpful Vote: 0.05 CINE
  - 📅 Daily Login: 0.02 CINE
  - 🤝 Referral: 1.0 CINE

### 3. User Profiles Contract (`user_profiles`)
- **Decentralized Identity**: Wallet-based user profiles
- **Watch History**: Encrypted viewing preferences
- **Social Features**: Follow users, share watchlists
- **Privacy Controls**: User-controlled data sharing

## 🚀 Quick Start

### Prerequisites
1. **Node.js 18+** and **pnpm**
2. **DFX SDK** - Internet Computer development kit
3. **Internet Identity** - For wallet authentication

### Installation Steps

1. **Install ICP Dependencies**
```bash
# Fix pnpm virtual store issue first
rm -rf node_modules
pnpm install --force

# Install ICP packages
pnpm add @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/principal
```

2. **Install DFX SDK**
```bash
# On macOS/Linux
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# On Windows (use WSL)
wsl --install
# Then run the above command in WSL
```

3. **Deploy Smart Contracts**
```bash
# Start local ICP replica
dfx start --background --clean

# Deploy contracts
dfx deploy

# Get canister IDs
dfx canister id movie_reviews
dfx canister id cine_token
dfx canister id user_profiles
```

4. **Configure Environment**
```bash
# Copy environment template
cp .env.example .env.local

# Add your canister IDs to .env.local
NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID=your_movie_reviews_id
NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID=your_cine_token_id
NEXT_PUBLIC_USER_PROFILES_CANISTER_ID=your_user_profiles_id
```

5. **Start Development Server**
```bash
pnpm dev
```

## 🔧 Configuration

### Environment Variables
```env
# ICP Blockchain Integration
NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID=rdmx6-jaaaa-aaaah-qdrqq-cai
NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID=rrkah-fqaaa-aaaah-qdrqa-cai
NEXT_PUBLIC_USER_PROFILES_CANISTER_ID=ryjl3-tyaaa-aaaah-qdrqq-cai

# Network Configuration
NEXT_PUBLIC_IC_HOST=https://ic0.app
NEXT_PUBLIC_DFX_NETWORK=ic
```

### Network Deployment

**Local Development:**
```bash
dfx start --background
dfx deploy
```

**IC Mainnet:**
```bash
dfx deploy --network ic --with-cycles 1000000000000
```

## 🎯 Features

### Web3 Authentication
- **Internet Identity Integration**: Secure, anonymous authentication
- **Wallet Connection**: One-click wallet connection
- **Profile Management**: Decentralized user profiles

### Blockchain Reviews
- **Immutable Storage**: Reviews stored permanently on ICP
- **Verification System**: Blockchain-verified authenticity
- **Reward Mechanism**: Earn CINE tokens for quality reviews
- **Community Voting**: Vote on review helpfulness

### Token Economy
- **Earning Opportunities**: Multiple ways to earn CINE tokens
- **Utility Features**: Use tokens for premium features
- **Transparent Distribution**: All transactions on-chain

### Social Features
- **Follow System**: Follow other movie enthusiasts
- **Watchlists**: Share and discover movie lists
- **Reputation Building**: Build credibility through quality contributions

## 🛠️ Development

### Smart Contract Development
```bash
# Compile contracts
dfx build

# Deploy to local network
dfx deploy --network local

# Deploy to IC mainnet
dfx deploy --network ic
```

### Frontend Integration
```typescript
// Connect to ICP
import { useICP } from '@/contexts/ICPContext';

const { isAuthenticated, login, createReview } = useICP();

// Create a review
await createReview(movieId, rating, title, content);
```

### Testing
```bash
# Run frontend tests
pnpm test

# Test smart contracts
dfx canister call movie_reviews createReview '(record { movieId="test"; rating=8; title="Great movie"; content="Really enjoyed this film!" })'
```

## 📊 Token Economics

### Earning CINE Tokens
| Action | Reward | Description |
|--------|--------|-------------|
| Movie Review | 0.1 CINE | Write a movie review |
| Quality Review | 0.5 CINE | High-quality, detailed review |
| Helpful Vote | 0.05 CINE | Vote on review helpfulness |
| Daily Login | 0.02 CINE | Daily platform engagement |
| Referral | 1.0 CINE | Refer new users |
| Achievement | 0.25 CINE | Platform milestones |

### Token Utility
- **Premium Features**: Access advanced AI recommendations
- **Exclusive Content**: Early access to new features
- **Governance**: Vote on platform improvements
- **Rewards**: Higher rewards for token holders

## 🔒 Security

### Smart Contract Security
- **Immutable Reviews**: Reviews cannot be deleted or modified
- **Access Control**: Only authenticated users can interact
- **Rate Limiting**: Prevent spam and abuse
- **Validation**: Input validation on all contract calls

### Privacy Protection
- **Anonymous Identity**: Internet Identity provides privacy
- **Encrypted Data**: Sensitive data encrypted on-chain
- **User Control**: Users control their data sharing

## 🚀 Deployment

### Mainnet Deployment Checklist
- [ ] Test all contracts on local network
- [ ] Verify canister IDs in environment
- [ ] Deploy with sufficient cycles
- [ ] Test wallet connection
- [ ] Verify token distribution
- [ ] Test review creation and voting

### Production Configuration
```bash
# Deploy to IC mainnet
dfx deploy --network ic --with-cycles 1000000000000

# Verify deployment
dfx canister --network ic status movie_reviews
dfx canister --network ic status cine_token
dfx canister --network ic status user_profiles
```

## 🎉 Hackathon Features

### Akwaaba Dappathon Integration
- **AI + Blockchain**: Combines AI recommendations with blockchain reviews
- **DeFi Elements**: Token rewards and governance
- **Digital Payments**: CINE token for platform transactions
- **Scalable Architecture**: Built for growth on ICP

### Demo Features
- **Live Blockchain Reviews**: Real-time review creation and voting
- **Token Rewards**: Immediate CINE token distribution
- **Wallet Integration**: Seamless Internet Identity connection
- **Social Features**: Follow users and share watchlists

## 📚 Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [DFX SDK Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language](https://internetcomputer.org/docs/current/motoko/intro)
- [Internet Identity](https://identity.ic0.app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes locally
4. Deploy and test on IC testnet
5. Submit a pull request

---

**🎬 Built with ❤️ for the Akwaaba Dappathon - Empowering the future of decentralized entertainment!**
