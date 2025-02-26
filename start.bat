@echo off
title Morbid Discord Server Paneli
chcp 65001 >nul

:menu
cls
echo ============================
echo        Bot Seçim Paneli      
echo ============================
echo [1] Ban Botu
echo [2] İsim Değiştirme Botu
echo [3] Kanal Silme Botu
echo [4] Log Temizleme Botu
echo [0] Çıkış
echo.

set /p choice=Çalıştırmak istediğiniz botun numarasını girin: 

if "%choice%"=="1" (
    echo Ban Botu başlatılıyor...
    start cmd /k "node ban.js"
    pause
    goto menu
)
if "%choice%"=="2" (
    echo İsim Değiştirme Botu başlatılıyor...
    start cmd /k "node changenick.js"
    pause
    goto menu
)
if "%choice%"=="3" (
    echo Kanal Silme Botu başlatılıyor...
    start cmd /k "node deletechannel.js"
    pause
    goto menu
)
if "%choice%"=="4" (
    echo Log Temizleme Botu başlatılıyor...
    start cmd /k "node deletelog.js"
    pause
    goto menu
)
if "%choice%"=="0" (
    echo Çıkış yapılıyor...
    exit
)

echo Geçersiz seçim, lütfen tekrar deneyin!
pause
goto menu
