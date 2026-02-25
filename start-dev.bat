@echo off
echo Starting Development Servers...

echo Starting Frontend on port 3000...
start "Frontend - Next.js" cmd /k "cd frontend && npm run dev"

echo Starting Backend on port 4000...
start "Backend - NestJS" cmd /k "cd backend && npm run start:dev"

echo Servers are running!
