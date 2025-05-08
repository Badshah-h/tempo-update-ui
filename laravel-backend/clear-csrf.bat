@echo off
echo Clearing all Laravel caches (including CSRF tokens and sessions)...
php artisan clear:all
echo.
echo Done!
pause
