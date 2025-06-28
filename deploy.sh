#!/bin/bash

# CineAI Smart Contract Deployment Script
echo "🚀 CineAI Smart Contract Deployment"
echo "=================================="

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX not found. Installing..."
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
    source ~/.bashrc
fi

# Start local replica
echo "🔄 Starting local Internet Computer replica..."
dfx start --background --clean

# Deploy all canisters
echo "📦 Deploying smart contracts..."
dfx deploy

# Get canister IDs
echo "📋 Getting canister IDs..."
MOVIE_REVIEWS_ID=$(dfx canister id movie_reviews)
CINE_TOKEN_ID=$(dfx canister id cine_token)
USER_PROFILES_ID=$(dfx canister id user_profiles)

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo "Movie Reviews: $MOVIE_REVIEWS_ID"
echo "CINE Token:    $CINE_TOKEN_ID"
echo "User Profiles: $USER_PROFILES_ID"
echo ""

# Update .env.local
echo "🔧 Updating .env.local..."
cat > .env.local << EOF
# MongoDB Configuration
MONGODB_URI=mongodb+srv://bigabdoul:Bigabdoul123@cluster0.mongodb.net/cineai?retryWrites=true&w=majority

# TMDb API Configuration
TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzE5YzNhNzJhNzE4ZjY5ZjE5ZjY5ZjE5ZjY5ZjE5ZiIsIm5iZiI6MTczNTM5NzI5Ny4zNzMsInN1YiI6IjY3NzBhNzQxNzE5NzI4ZGJhNzE5YzNhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ej8rOGJhZjE5ZjE5ZjE5ZjE5ZjE5ZjE5ZjE5ZjE5Zg
TMDB_BASE_URL=https://api.themoviedb.org/3

# Google Cloud AI Configuration
GOOGLE_CLOUD_PROJECT_ID=cineai-dappathon
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json

# ICP Blockchain Integration (Real Deployed Contracts)
NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID=$MOVIE_REVIEWS_ID
NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID=$CINE_TOKEN_ID
NEXT_PUBLIC_USER_PROFILES_CANISTER_ID=$USER_PROFILES_ID
NEXT_PUBLIC_IC_HOST=http://localhost:4943

# Development
NODE_ENV=development
EOF

echo "✅ Environment updated with real canister IDs!"
echo ""
echo "🎉 Ready for Real Blockchain!"
echo "============================="
echo "1. Restart your Next.js app: pnpm dev"
echo "2. Connect Plug Wallet"
echo "3. Start earning real CINE tokens!"
echo ""
echo "🔗 Canister URLs:"
echo "Movie Reviews: http://localhost:4943/?canisterId=$MOVIE_REVIEWS_ID"
echo "CINE Token:    http://localhost:4943/?canisterId=$CINE_TOKEN_ID"
echo "User Profiles: http://localhost:4943/?canisterId=$USER_PROFILES_ID"
