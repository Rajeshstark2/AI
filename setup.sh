#!/bin/bash

# Create and activate virtual environment
python -m venv backend/venv
source backend/venv/Scripts/activate  # On Windows
# source backend/venv/bin/activate  # On Unix/MacOS

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
cd mobile
npm install
cd ..

echo "Setup complete! Please follow these steps:"
echo "1. Update the backend/.env file with your API keys"
echo "2. Start the backend server: cd backend && python run.py"
echo "3. Start the mobile app: cd mobile && npm start" 