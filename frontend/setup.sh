#!/bin/bash

# Wedding Commerce Frontend Setup Script
echo "🚀 Setting up Wedding Commerce Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1

# Development Configuration
VITE_APP_NAME="Wedding Commerce"
VITE_APP_ENV=development

# Optional: Enable debug mode
VITE_DEBUG=true
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Check if backend is running
echo "🔍 Checking backend connection..."
if curl -s http://localhost:8080/api/v1 > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend is not running. Please start the backend first:"
    echo "   go run . serve"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure backend is running: go run . serve"
echo "2. Start frontend development server: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "Happy coding! 🚀"
