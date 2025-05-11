@echo off
REM Start EDUPLANET full stack (frontend, backend, database, and LLM)

REM Start MongoDB (if installed locally)
start "MongoDB" cmd /k "mongod --dbpath %cd%\data"

REM Start Ollama (user must have it installed and model pulled)
start "Ollama" cmd /k "ollama run deepseek-r1:8b"

REM Start backend
cd hackathon-backend
start "Backend" cmd /k "npm run dev"
cd ..

REM Start frontend
start "Frontend" cmd /k "npm run dev"

REM Confirmation window
start "EDUPLANET Status" cmd /k "echo All EDUPLANET dependencies are now running! && echo. && echo - MongoDB (Database) && echo - Ollama (LLM: deepseek-r1:8b) && echo - Backend API (Node.js/Express) && echo - Frontend (Next.js) && echo. && echo You can now use the platform at http://localhost:3000 && pause" 