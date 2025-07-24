@echo off
echo Starting Grocito Delivery Partner System...
echo.

echo Starting Backend (Port 8080)...
start "Grocito Backend" cmd /k "mvn spring-boot:run"

timeout /t 10

echo Starting Admin Dashboard (Port 3000)...
start "Admin Dashboard" cmd /k "cd grocito-frontend-admin && npm start"

timeout /t 5

echo Starting Delivery Partner Dashboard (Port 3002)...
start "Delivery Partner Dashboard" cmd /k "cd grocito-frontend-delivery-partner && npm start"

echo.
echo All services are starting...
echo.
echo Backend: http://localhost:8080
echo Admin Dashboard: http://localhost:3000
echo Delivery Partner Dashboard: http://localhost:3002
echo.
echo Press any key to exit...
pause > nul