#!/bin/bash

# MellowKraft Cloudflare Pages Deployment Script
# Run this on your local machine to deploy to Cloudflare

set -e

echo "🚀 MellowKraft Deployment to Cloudflare Pages"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo "✓ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✓ npm: $(npm --version)"

# Check Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler..."
    npm install -g wrangler
fi
echo "✓ Wrangler available"

# Check if authenticated with Cloudflare
echo ""
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not authenticated with Cloudflare. Running: wrangler login"
    wrangler login
fi
echo "✓ Authenticated with Cloudflare"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Build
echo ""
echo "🔨 Building project..."
npm run build

# Deploy
echo ""
echo "🚀 Deploying to Cloudflare Pages..."
npm run pages:deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your site is live!"
echo "Visit: https://mellowkraft-site.pages.dev"
echo ""
