#!/bin/bash

# CineAI Production Build Script
echo "🚀 Building CineAI for Production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Run linting
echo "🔍 Running linter..."
pnpm run lint --fix || echo "⚠️ Linting warnings found, continuing..."

# Build the application
echo "🏗️ Building application..."
NODE_ENV=production pnpm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📊 Build statistics:"
    du -sh .next
    echo ""
    echo "🚀 Ready for deployment!"
    echo "📝 To start production server: pnpm start"
    echo "🐳 To build Docker image: docker build -t cineai ."
    echo "☁️ To deploy to Google Cloud Run: gcloud builds submit"
else
    echo "❌ Build failed!"
    exit 1
fi
