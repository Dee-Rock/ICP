# 🪟 CineAI Windows Setup Guide

## Quick Start for Dappathon Demo

Since you're on Windows and need to get up and running quickly for the Akwaaba Dappathon, here are the fastest options:

### Option 1: Use ICP Playground (Fastest) ⚡

1. **Visit ICP Playground**: https://m7sm4-2iaaa-aaaah-qcrfa-cai.ic0.app/
2. **Create a new project**
3. **Upload your smart contracts**:
   - Copy content from `src/icp/movie_reviews/main.mo`
   - Copy content from `src/icp/cine_token/main.mo`
   - Copy content from `src/icp/user_profiles/main.mo`
4. **Deploy to IC mainnet** with one click
5. **Get canister IDs** and update your `.env.local`

### Option 2: Use WSL (Recommended for Development)

1. **Install WSL** (if not already done):
   ```powershell
   wsl --install
   ```
   
2. **Restart your computer** when prompted

3. **Open WSL terminal** and install DFX:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

4. **Navigate to your project**:
   ```bash
   cd /mnt/c/Users/BIGA/Desktop/hack/ICP/cineai
   ```

5. **Deploy contracts**:
   ```bash
   dfx start --background
   dfx deploy
   ```

### Option 3: Frontend-Only Demo

For immediate demo purposes, you can showcase the Web3 UI without deploying contracts:

1. **Install dependencies**:
   ```powershell
   pnpm install --force
   pnpm add @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/principal
   ```

2. **Use mock canister IDs** in `.env.local`:
   ```env
   NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID=rdmx6-jaaaa-aaaah-qdrqq-cai
   NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID=rrkah-fqaaa-aaaah-qdrqa-cai
   NEXT_PUBLIC_USER_PROFILES_CANISTER_ID=ryjl3-tyaaa-aaaah-qdrqq-cai
   NEXT_PUBLIC_IC_HOST=https://ic0.app
   NEXT_PUBLIC_DFX_NETWORK=ic
   ```

3. **Start the app**:
   ```powershell
   pnpm dev
   ```

4. **Demo the UI**: Show wallet connection, review interface, token display

## Hackathon Presentation Strategy

### 1. Show the Code Architecture
- **Smart Contracts**: Display the Motoko code
- **Frontend Integration**: Show React components
- **Web3 Features**: Demonstrate wallet connection UI

### 2. Explain the Innovation
- **AI + Blockchain**: First movie platform combining both
- **Token Economy**: CINE rewards for quality reviews
- **Decentralization**: All reviews stored on ICP blockchain

### 3. Demo the Features
- **Web3 Authentication**: Show wallet connection button
- **Blockchain Reviews**: Display review creation interface
- **Token Rewards**: Show token balance and earning system
- **Social Features**: Demonstrate user profiles and following

### 4. Highlight Technical Excellence
- **Production-Ready**: Complete smart contract implementation
- **Scalable**: Built on Internet Computer Protocol
- **User-Friendly**: Seamless Web3 integration
- **Secure**: Blockchain-verified reviews

## Quick Deploy Commands

If you get WSL working:

```bash
# Clone your project in WSL
cd /mnt/c/Users/BIGA/Desktop/hack/ICP/cineai

# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Start local replica
dfx start --background

# Deploy contracts
dfx deploy

# Get canister IDs
dfx canister id movie_reviews
dfx canister id cine_token
dfx canister id user_profiles
```

## Troubleshooting

### If WSL installation fails:
1. Enable Windows features manually:
   - Windows Subsystem for Linux
   - Virtual Machine Platform
2. Restart computer
3. Try `wsl --install` again

### If pnpm has issues:
```powershell
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install --force
```

### If you need to demo immediately:
1. Use the existing AI features
2. Show the Web3 code architecture
3. Explain the blockchain integration
4. Use mock data for demonstration

## Presentation Tips

1. **Start with AI features** - Show your existing movie discovery
2. **Introduce Web3 enhancement** - Explain the blockchain integration
3. **Show smart contracts** - Display the Motoko code
4. **Demo UI components** - Show Web3Auth and BlockchainReviews
5. **Explain token economy** - Detail the CINE reward system
6. **Highlight innovation** - First AI + Blockchain movie platform

## Resources

- **ICP Playground**: https://m7sm4-2iaaa-aaaah-qcrfa-cai.ic0.app/
- **Internet Computer Docs**: https://internetcomputer.org/docs
- **Motoko Language**: https://internetcomputer.org/docs/current/motoko/intro
- **WSL Installation**: https://docs.microsoft.com/en-us/windows/wsl/install

Remember: Even without full deployment, your Web3 integration code demonstrates significant technical achievement for the Akwaaba Dappathon! 🏆
