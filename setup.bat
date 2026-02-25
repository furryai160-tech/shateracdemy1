@echo off
echo Setting up El Shate' Academy project...

echo Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%

echo Installing Backend dependencies...
cd ../backend
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%

echo Generating Prisma Client...
cd ../backend
call npx prisma generate
if %errorlevel% neq 0 exit /b %errorlevel%

echo Setup complete!
pause
