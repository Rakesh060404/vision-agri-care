@echo off
echo Starting Plant Disease Detection System...
echo.

echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask backend server...
start "Backend Server" cmd /k "python backend.py"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting React frontend...
cd vision-agri-care-main
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
