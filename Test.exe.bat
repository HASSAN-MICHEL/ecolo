@echo off
chcp 65001 >nul
echo === DIAGNOSTIC DRINK MANAGE ===
echo.

echo 1. Arret des processus existants...
taskkill /F /IM "DRINK MANAGE.exe" >nul 2>&1
timeout /t 2 /nobreak >nul

echo 2. Lancement de l'application...
cd /d "C:\Program Files\DRINK MANAGE"
start "" "DRINK MANAGE.exe"

echo 3. Attente du demarrage...
timeout /t 5 /nobreak >nul

echo 4. Verification des processus...
tasklist /FI "IMAGENAME eq DRINK MANAGE.exe" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Application en cours d'execution
) else (
    echo ❌ Application non detectee
)

echo 5. Verification du port 5000...
netstat -an | find ":5000" >nul
if %errorlevel% equ 0 (
    echo ✅ Port 5000 actif
) else (
    echo ❌ Port 5000 inactif
)

echo.
echo Diagnostic termine.
echo Appuyez sur une touche pour continuer...
pause >nul