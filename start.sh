#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting SoulTalk Application...${NC}\n"

# Check Database Connection
echo -e "${GREEN}📊 Checking Database Connection...${NC}"
cd backend
source venv/bin/activate
if ! python3 check_db.py; then
    echo -e "\n${BLUE}❌ Database check failed.${NC}"
    echo "Please check your .env settings and Supabase status."
    exit 1
fi

echo -e "\n${GREEN}🔄 Running Migrations...${NC}"
python3 manage.py migrate
cd ..



# Start Backend Server
echo -e "\n${GREEN}🔧 Starting Django Backend...${NC}"
cd backend
source venv/bin/activate
python3 manage.py runserver &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend Server
echo -e "\n${GREEN}⚛️  Starting React Frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

echo -e "\n${BLUE}✅ Application started successfully!${NC}"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}Backend:${NC}  http://127.0.0.1:8000"
echo -e "${GREEN}Admin:${NC}    http://127.0.0.1:8000/admin"
echo -e "\n${BLUE}Press Ctrl+C to stop all servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${BLUE}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ All servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait
