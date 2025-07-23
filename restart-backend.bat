@echo off
echo Restarting Java Backend...

echo Stopping existing Java processes...
taskkill /f /im javaw.exe 2>nul
taskkill /f /im java.exe 2>nul

echo Waiting for processes to stop...
timeout /t 3 /nobreak

echo Starting Java Backend...
start "Grocito Backend" cmd /k "echo Starting Backend Server... && mvn spring-boot:run"

echo Backend restart initiated!
echo Check the new window for startup logs.
pause