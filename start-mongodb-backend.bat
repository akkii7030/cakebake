@echo off
echo Starting Bake & Take MongoDB Backend...
echo.

cd backend-nodejs

echo Installing dependencies...
npm install

echo.
echo Starting server...
npm run dev

pause