#!/bin/bash

# CineAI ICP Smart Contract Deployment Script
# This script deploys the CineAI smart contracts to the Internet Computer

set -e

echo "🎬 CineAI ICP Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo -e "${RED}❌ DFX is not installed. Please install the Internet Computer SDK first.${NC}"
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check dfx version
echo -e "${BLUE}📋 Checking DFX version...${NC}"
dfx --version

# Parse command line arguments
NETWORK="local"
CLEAN=false
CYCLES="1000000000000"

while [[ $# -gt 0 ]]; do
    case $1 in
        --network)
            NETWORK="$2"
            shift 2
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --cycles)
            CYCLES="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --network NETWORK    Deploy to network (local|ic) [default: local]"
            echo "  --clean             Clean start (local only)"
            echo "  --cycles AMOUNT     Cycles for deployment [default: 1000000000000]"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}🚀 Deploying to network: ${NETWORK}${NC}"

# Start local replica if deploying locally
if [ "$NETWORK" = "local" ]; then
    echo -e "${YELLOW}🚀 Starting local ICP replica...${NC}"
    if [ "$CLEAN" = true ]; then
        dfx start --background --clean
    else
        dfx start --background
    fi
    
    # Wait for replica to be ready
    echo -e "${YELLOW}⏳ Waiting for replica to be ready...${NC}"
    sleep 10
    
    # Deploy Internet Identity for local development
    echo -e "${BLUE}🔐 Deploying Internet Identity...${NC}"
    dfx deploy internet_identity --network local || echo -e "${YELLOW}⚠️  Internet Identity deployment failed (might already exist)${NC}"
fi

# Build and deploy canisters
echo -e "${BLUE}🏗️  Building and deploying smart contracts...${NC}"

# Deploy Movie Reviews canister
echo -e "${BLUE}📝 Deploying Movie Reviews canister...${NC}"
if [ "$NETWORK" = "ic" ]; then
    dfx deploy movie_reviews --network ic --with-cycles $CYCLES
else
    dfx deploy movie_reviews --network local
fi

# Deploy CineToken canister
echo -e "${BLUE}🪙 Deploying CineToken canister...${NC}"
if [ "$NETWORK" = "ic" ]; then
    dfx deploy cine_token --network ic --with-cycles $CYCLES
else
    dfx deploy cine_token --network local
fi

# Deploy User Profiles canister
echo -e "${BLUE}👤 Deploying User Profiles canister...${NC}"
if [ "$NETWORK" = "ic" ]; then
    dfx deploy user_profiles --network ic --with-cycles $CYCLES
else
    dfx deploy user_profiles --network local
fi

# Get canister IDs
echo -e "${BLUE}📋 Getting canister IDs...${NC}"
MOVIE_REVIEWS_ID=$(dfx canister id movie_reviews --network $NETWORK)
CINE_TOKEN_ID=$(dfx canister id cine_token --network $NETWORK)
USER_PROFILES_ID=$(dfx canister id user_profiles --network $NETWORK)

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Canister IDs:${NC}"
echo "Movie Reviews: $MOVIE_REVIEWS_ID"
echo "CineToken: $CINE_TOKEN_ID"
echo "User Profiles: $USER_PROFILES_ID"
echo ""

# Create or update .env.local with canister IDs
echo -e "${BLUE}📝 Updating .env.local with canister IDs...${NC}"

# Backup existing .env.local if it exists
if [ -f .env.local ]; then
    cp .env.local .env.local.backup
    echo -e "${YELLOW}📋 Backed up existing .env.local to .env.local.backup${NC}"
fi

# Create/update .env.local
cat > .env.local << EOF
# Auto-generated ICP Canister IDs - $(date)
NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID=$MOVIE_REVIEWS_ID
NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID=$CINE_TOKEN_ID
NEXT_PUBLIC_USER_PROFILES_CANISTER_ID=$USER_PROFILES_ID

# Network configuration
EOF

if [ "$NETWORK" = "local" ]; then
    cat >> .env.local << EOF
NEXT_PUBLIC_IC_HOST=http://localhost:4943
NEXT_PUBLIC_DFX_NETWORK=local
INTERNET_IDENTITY_CANISTER_ID=$(dfx canister id internet_identity --network local 2>/dev/null || echo "rdmx6-jaaaa-aaaah-qdrqq-cai")
EOF
else
    cat >> .env.local << EOF
NEXT_PUBLIC_IC_HOST=https://ic0.app
NEXT_PUBLIC_DFX_NETWORK=ic
EOF
fi

cat >> .env.local << EOF

# Add your other environment variables here
# Copy from .env.example and fill in your values
EOF

echo -e "${GREEN}✅ Environment file updated: .env.local${NC}"
echo ""
echo -e "${GREEN}🎉 CineAI ICP deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📖 Next steps:${NC}"
echo "1. Copy your other environment variables from .env.example to .env.local"
echo "2. Install ICP dependencies: pnpm add @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/principal"
echo "3. Run 'pnpm dev' to start the development server"
echo "4. Connect your wallet and start using Web3 features!"
echo ""
echo -e "${BLUE}🌐 Canister URLs:${NC}"
if [ "$NETWORK" = "local" ]; then
    echo "Movie Reviews: http://localhost:4943/?canisterId=$MOVIE_REVIEWS_ID"
    echo "CineToken: http://localhost:4943/?canisterId=$CINE_TOKEN_ID"
    echo "User Profiles: http://localhost:4943/?canisterId=$USER_PROFILES_ID"
    echo "Internet Identity: http://localhost:4943/?canisterId=$(dfx canister id internet_identity --network local 2>/dev/null || echo "rdmx6-jaaaa-aaaah-qdrqq-cai")"
else
    echo "Movie Reviews: https://$MOVIE_REVIEWS_ID.ic0.app"
    echo "CineToken: https://$CINE_TOKEN_ID.ic0.app"
    echo "User Profiles: https://$USER_PROFILES_ID.ic0.app"
fi

echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo "Check canister status: dfx canister status movie_reviews --network $NETWORK"
echo "View canister logs: dfx canister logs movie_reviews --network $NETWORK"
echo "Stop local replica: dfx stop"
echo ""
echo -e "${GREEN}Happy building! 🚀${NC}"
