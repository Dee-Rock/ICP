@echo off
echo 🚀 CineAI Smart Contract Deployment (Windows)
echo ===============================================

echo.
echo 📋 Prerequisites Check:
echo 1. WSL installed and rebooted? (Required)
echo 2. Plug Wallet installed? (https://plugwallet.ooo/)
echo.

pause

echo 🔄 Starting deployment in WSL...
wsl bash -c "cd /mnt/c/Users/BIGA/Desktop/hack/ICP/cineai && chmod +x deploy.sh && ./deploy.sh"

echo.
echo ✅ Deployment complete!
echo.
echo 🎯 Next Steps:
echo 1. Restart your app: pnpm dev
echo 2. Connect Plug Wallet
echo 3. Start earning real CINE tokens!
echo.

pause
