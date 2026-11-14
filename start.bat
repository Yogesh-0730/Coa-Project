@echo off
title 8086 Smart Student Performance Evaluation System
echo.
echo  ====================================================
echo   8086 SMART STUDENT PERFORMANCE EVALUATION SYSTEM
echo   COA Project - B.Tech CSE
echo  ====================================================
echo.
echo  Starting Backend Server (Flask)...
echo  Starting Frontend Server (Vite + React)...
echo.
echo  Backend : http://localhost:5000
echo  Frontend: http://localhost:3000
echo.
echo  Press Ctrl+C in each window to stop.
echo  ====================================================
echo.

start "Backend - Flask" cmd /k "cd /d %~dp0backend && python app.py"
timeout /t 3 /nobreak > nul
start "Frontend - Vite" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 4 /nobreak > nul
echo.
echo  Both servers are running!
echo  Open http://localhost:3000 in your browser.
echo.
pause
