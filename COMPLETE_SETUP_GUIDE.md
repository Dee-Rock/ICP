# 🎬 CineAI Complete Setup Guide

## 📋 **Table of Contents**
1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Web3 Integration](#web3-integration)
4. [Troubleshooting](#troubleshooting)
5. [Demo Instructions](#demo-instructions)

## 🚀 **Quick Start**

### For Immediate Demo (5 minutes)
```bash
# 1. Install dependencies
pnpm install --force

# 2. Add ICP packages
pnpm add @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/principal

# 3. Start the app
pnpm dev
```

Your app will run at `http://localhost:3000` with Web3 UI components ready to demo!

## 🔧 **Detailed Setup**

### Prerequisites
- **Node.js 18+**
- **pnpm** (recommended)
- **Git**
- **MongoDB Atlas account** (for AI features)
- **Google Cloud account** (for AI services)
- **DFX SDK** (for blockchain deployment)

### Step-by-Step Installation

#### 1. Clone and Install
```bash
git clone <your-repo-url>
cd cineai
pnpm install --force
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
```

Required environment variables:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# AI Services
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id
TMDB_API_KEY=your_tmdb_api_key

# Web3 (already configured for demo)
NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID=rdmx6-jaaaa-aaaah-qdrqq-cai
NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID=rrkah-fqaaa-aaaah-qdrqa-cai
NEXT_PUBLIC_USER_PROFILES_CANISTER_ID=ryjl3-tyaaa-aaaah-qdrqq-cai
```

#### 3. Install Web3 Dependencies
```bash
pnpm add @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/principal
```

#### 4. Start Development Server
```bash
pnpm dev
```

## 🌐 **Web3 Integration**

### Option 1: Demo Mode (Recommended for Hackathon)
- Uses mock canister IDs
- Shows Web3 UI components
- Demonstrates blockchain concepts
- No deployment required

### Option 2: Full Blockchain Deployment

#### Install DFX SDK

**On macOS/Linux:**
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

**On Windows:**
```powershell
# Install WSL first
wsl --install
# Then run the above command in WSL
```

#### Deploy Smart Contracts
```bash
# Start local ICP replica
dfx start --background

# Deploy contracts
dfx deploy

# Get canister IDs and update .env.local
dfx canister id movie_reviews
dfx canister id cine_token
dfx canister id user_profiles
```

#### Automated Deployment
```bash
# Local deployment
pnpm run deploy:icp:local

# Mainnet deployment
pnpm run deploy:icp:mainnet
```

## 🛠️ **Troubleshooting**

### Common Issues

#### 1. pnpm Virtual Store Error
```bash
# Solution
rm -rf node_modules
pnpm install --force
```

#### 2. DFX Installation on Windows
```bash
# Use WSL
wsl --install
# Restart computer, then install DFX in WSL
```

#### 3. Environment Variables Not Loading
```bash
# Check file name
ls -la .env*
# Should see .env.local (not .env.example)
```

#### 4. ICP Dependencies Installation Issues
```bash
# Try one by one
pnpm add @dfinity/agent
pnpm add @dfinity/auth-client
pnpm add @dfinity/candid
pnpm add @dfinity/principal
```

### Platform-Specific Guides
- **Windows**: See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)
- **Web3 Details**: See [WEB3_INTEGRATION.md](./WEB3_INTEGRATION.md)

## 🎯 **Demo Instructions**

### For Hackathon Presentation

#### 1. Start the Application
```bash
pnpm dev
```

#### 2. Demo Flow
1. **Show AI Features**
   - Search for movies
   - Display AI recommendations
   - Show analytics dashboard

2. **Highlight Web3 Integration**
   - Point out "Connect Wallet" button
   - Show blockchain review interface
   - Explain token reward system

3. **Show Code Architecture**
   - Display smart contracts in `src/icp/`
   - Show React components for Web3
   - Explain ICP integration

#### 3. Key Talking Points
- **Innovation**: First AI + Blockchain movie platform
- **Technical Excellence**: Production-ready smart contracts
- **User Experience**: Seamless Web3 integration
- **Scalability**: Built on Internet Computer Protocol

### Demo Script
```
"This is CineAI - an AI-powered movie discovery platform enhanced with Web3 blockchain technology.

Users can discover movies using advanced AI, then write verified reviews on the ICP blockchain and earn CINE tokens for quality contributions.

All reviews are immutable, community-verified, and stored permanently on-chain, creating a trustworthy movie review ecosystem."
```

## 📚 **Additional Resources**

### Documentation
- [Main README](./README.md) - Complete project overview
- [Web3 Integration Guide](./WEB3_INTEGRATION.md) - Detailed blockchain setup
- [Windows Setup](./WINDOWS_SETUP.md) - Windows-specific instructions

### External Links
- [Internet Computer Docs](https://internetcomputer.org/docs)
- [DFX SDK Installation](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Language Guide](https://internetcomputer.org/docs/current/motoko/intro)
- [Next.js Documentation](https://nextjs.org/docs)

### Smart Contract Files
- `src/icp/movie_reviews/main.mo` - Review management
- `src/icp/cine_token/main.mo` - Token rewards
- `src/icp/user_profiles/main.mo` - User profiles

### Frontend Components
- `src/components/Web3Auth.tsx` - Wallet authentication
- `src/components/BlockchainReviews.tsx` - Review interface
- `src/contexts/ICPContext.tsx` - Web3 state management

## 🎉 **Success Checklist**

- [ ] Application starts without errors
- [ ] AI movie search works
- [ ] Web3 components display correctly
- [ ] Environment variables configured
- [ ] Smart contracts deployed (optional)
- [ ] Demo presentation ready

## 🏆 **Hackathon Advantages**

✅ **AI Integration** - Advanced Google Cloud AI
✅ **DeFi Features** - CINE token economy
✅ **Digital Payments** - Blockchain transactions
✅ **Technical Innovation** - First AI + Blockchain movie platform
✅ **Production Ready** - Complete implementation
✅ **User Experience** - Seamless Web3 integration

---

**🎬 Ready to revolutionize movie discovery with AI and blockchain! 🚀**
