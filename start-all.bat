@echo off
echo.
echo ========================================
echo 🚀 Grocito Multi-App Platform Startup
echo ========================================
echo.

echo 📊 Starting Backend Server (Port 8080)...
start "Grocito Backend" cmd /k "echo Starting Backend Server... && mvn spring-boot:run"
timeout /t 2

echo.
echo 🛒 Starting Customer App (Port 3000)...
start "Grocito Customer" cmd /k "echo Starting Customer App... && cd grocito-frontend\frontend && npm start"
timeout /t 2

echo.
echo 👨‍💼 Starting Admin Portal (Port 3001)...
start "Grocito Admin" cmd /k "echo Starting Admin Portal... && cd grocito-frontend-admin && npm start"

echo.
echo ========================================
echo ✅ All applications are starting...
echo ========================================
echo.
echo 🌐 Access URLs:
echo   • Backend API:    http://localhost:8080
echo   • Customer App:   http://localhost:3000  
echo   • Admin Portal:   http://localhost:3001
echo.
echo 🔐 Demo Login Credentials:
echo   • Customer:  john@example.com / password123
echo   • Admin:     admin@grocito.com / admin123
echo.
echo 📝 Notes:
echo   • Wait for all apps to fully load (2-3 minutes)
echo   • Backend must be running for login to work
echo   • Check console windows for any errors
echo.
echo Press any key to close this window...
pause > nul