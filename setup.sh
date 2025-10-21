#!/bin/bash

# ============================================
# BASS Training Academy - Setup Script
# For Linux/Mac - New Device Setup
# ============================================

echo ""
echo "========================================"
echo " BASS TRAINING ACADEMY - SETUP"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "[1/7] Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
node --version
echo ""

# Check if MySQL is running
echo "[2/7] Checking MySQL connection..."
if ! mysql -u root -padmin -e "SELECT 1" &> /dev/null; then
    echo -e "${YELLOW}[WARNING]${NC} Cannot connect to MySQL!"
    echo "Please make sure:"
    echo "  1. MySQL is installed and running"
    echo "  2. Root password is 'admin' OR update .env.local"
    echo ""
    read -p "Press Enter to continue anyway..."
else
    echo -e "${GREEN}MySQL connection OK${NC}"
fi
echo ""

# Install dependencies
echo "[3/7] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Failed to install dependencies!"
    exit 1
fi
echo ""

# Check if .env.local exists
echo "[4/7] Checking environment variables..."
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}[INFO]${NC} .env.local not found, copying from .env.example..."
    cp .env.example .env.local
    echo ""
    echo -e "${YELLOW}[ACTION REQUIRED]${NC} Please edit .env.local and configure:"
    echo "  - DATABASE_URL (MySQL connection string)"
    echo "  - JWT_SECRET (generate a strong secret)"
    echo ""
    read -p "Press Enter after you've edited .env.local..."
else
    echo -e "${GREEN}.env.local already exists${NC}"
fi
echo ""

# Generate Prisma Client
echo "[5/7] Generating Prisma Client..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Failed to generate Prisma Client!"
    exit 1
fi
echo ""

# Push schema to database
echo "[6/7] Syncing database schema..."
npm run db:push
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Failed to sync database!"
    echo "Please check your DATABASE_URL in .env.local"
    exit 1
fi
echo ""

# Seed database
echo "[7/7] Seeding database with dummy data..."
node prisma/seed.js
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}[WARNING]${NC} Seeding failed, but setup can continue"
    echo "You can run 'node prisma/seed.js' manually later"
fi
echo ""

echo "========================================"
echo -e " ${GREEN}SETUP COMPLETE!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Open: http://localhost:3000"
echo "  3. Login with:"
echo "     Email: admin@basstrainingacademy.com"
echo "     Password: admin123"
echo ""
echo "Useful commands:"
echo "  npm run dev          - Start development server"
echo "  npm run db:studio    - Open Prisma Studio (database GUI)"
echo "  node prisma/seed.js  - Re-seed database"
echo ""
