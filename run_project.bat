@echo off
title Lanzador Calculadora FullStack - Joshua Chiguay
echo ==========================================
echo   INICIANDO CALCULADORA FULL STACK...
echo ==========================================

:: 1. Activar el entorno virtual e iniciar el Backend en una nueva ventana
echo [+] Iniciando Servidor Python (FastAPI)...
start "Backend - FastAPI" cmd /k "call venv\Scripts\activate && python backend/main.py"

:: 2. Esperar 3 segundos para asegurar que el servidor levante antes de abrir el navegador
timeout /t 3 /nobreak > nul

:: 3. Abrir el Frontend (index.html) en el navegador predeterminado
echo [+] Abriendo Interfaz de Usuario...
start "" "frontend/index.html"

echo ==========================================
echo   SISTEMA OPERATIVO Y LISTO PARA USAR
echo ==========================================
pause