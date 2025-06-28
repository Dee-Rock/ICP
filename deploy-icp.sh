#!/bin/bash

# CineAI ICP Smart Contract Deployment Script
# This script deploys the CineAI smart contracts to the Internet Computer

echo "🎬 CineAI ICP Deployment Script"
echo "================================"

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX is not installed. Please install the Internet Computer SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check dfx version
echo "📋 Checking DFX version..."
dfx --version

# Start local replica if not running (for local deployment)
if [ "$1" = "local" ]; then
    echo "🚀 Starting local ICP replica..."
    dfx start --background --clean
    
    # Wait for replica to be ready
    echo "⏳ Waiting for replica to be ready..."
    sleep 10
fi

# Deploy Internet Identity (for local development)
if [ "$1" = "local" ]; then
    echo "🔐 Deploying Internet Identity..."
    dfx deploy internet_identity
fi

# Build and deploy canisters
echo "🏗️  Building and deploying smart contracts..."

# Deploy Movie Reviews canister
echo "📝 Deploying Movie Reviews canister..."
dfx deploy movie_reviews

# Deploy CineToken canister
echo "🪙 Deploying CineToken canister..."
dfx deploy cine_token

# Deploy User Profiles canister
echo "👤 Deploying User Profiles canister..."
dfx deploy user_profiles

# Get canister IDs
echo "📋 Getting canister IDs..."
MOVIE_REVIEWS_ID=$(dfx canister id movie_reviews)
CINE_TOKEN_ID=$(dfx canister id cine_token)
USER_PROFILES_ID=$(dfx canister id user_profiles)

echo "✅ Deployment completed!"
echo ""
echo "📋 Canister IDs:"
echo "Movie Reviews: $MOVIE_REVIEWS_ID"
echo "CineToken: $CINE_TOKEN_ID"
echo "User Profiles: $USER_PROFILES_ID"
echo ""

# Create .env.local with canister IDs
echo "📝 Creating .env.local with canister IDs..."
cat > .env.local << EOF
# Auto-generated ICP Canister IDs
NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID=$MOVIE_REVIEWS_ID
NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID=$CINE_TOKEN_ID
NEXT_PUBLIC_USER_PROFILES_CANISTER_ID=$USER_PROFILES_ID

# Network configuration
NEXT_PUBLIC_IC_HOST=http://localhost:4943
NEXT_PUBLIC_DFX_NETWORK=local

# Add your other environment variables here
# Copy from .env.example and fill in your values
EOF

echo "✅ Environment file created: .env.local"
echo ""
echo "🎉 CineAI ICP deployment completed successfully!"
echo ""
echo "📖 Next steps:"
echo "1. Copy your other environment variables from .env.example to .env.local"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Connect your wallet and start using Web3 features!"
echo ""
echo "🌐 Canister URLs:"
if [ "$1" = "local" ]; then
    echo "Movie Reviews: http://localhost:4943/?canisterId=$MOVIE_REVIEWS_ID"
    echo "CineToken: http://localhost:4943/?canisterId=$CINE_TOKEN_ID"
    echo "User Profiles: http://localhost:4943/?canisterId=$USER_PROFILES_ID"
else
    echo "Movie Reviews: https://$MOVIE_REVIEWS_ID.ic0.app"
    echo "CineToken: https://$CINE_TOKEN_ID.ic0.app"
    echo "User Profiles: https://$USER_PROFILES_ID.ic0.app"
fi
