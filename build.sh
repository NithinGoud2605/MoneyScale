#!/bin/bash

# Build script for MoneyScale deployment

echo "🚀 Starting MoneyScale build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build completed successfully!" 