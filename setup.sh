#!/bin/bash

# TrustX Platform - Development Setup Script

echo "🚀 Setting up TrustX - AI + Blockchain Investment Fraud Detection Platform"
echo "=================================================================="

# Create virtual environment for backend
echo "📦 Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Database initialized successfully!')
"

# Download NLTK data
python -c "
import nltk
nltk.download('vader_lexicon', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
print('NLTK data downloaded successfully!')
"

cd ..

# Setup frontend
echo "⚛️  Setting up React frontend..."
cd frontend
npm install

# Build frontend for production (optional)
echo "Building frontend..."
npm run build

cd ..

# Setup blockchain
echo "⛓️  Setting up Blockchain contracts..."
cd blockchain
npm install

# Compile smart contracts
echo "Compiling smart contracts..."
npx truffle compile

cd ..

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "Environment file created. Please configure your API keys."
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend environment file..."
    cp backend/.env.example backend/.env
    echo "Backend environment file created."
fi

echo ""
echo "✅ TrustX Platform setup completed!"
echo ""
echo "🚦 To start the development servers:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend" 
echo "  npm run dev"
echo ""
echo "📊 Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "  API Documentation: http://localhost:5000/api/docs"
echo ""
echo "🔧 Next steps:"
echo "  1. Configure API keys in .env files"
echo "  2. Set up blockchain network (Polygon Mumbai testnet)"
echo "  3. Deploy smart contracts: cd blockchain && truffle migrate --network polygon_mumbai"
echo "  4. Update contract addresses in backend/.env"
echo ""
echo "📖 Documentation:"
echo "  - Architecture: docs/architecture/"
echo "  - API Reference: docs/api/"
echo "  - Deployment: docs/deployment/"
echo "  - Hackathon Pitch: docs/HACKATHON_PITCH.md"
echo ""
echo "🎯 Happy fraud detection! 🔍🛡️"