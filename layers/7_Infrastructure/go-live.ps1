./deploy-system.ps1
Write-Host "AgriMastery is now LIVE in the local environment." -ForegroundColor Green
Write-Host "Syncing final codebase to GitHub (okoth-hash)..." -ForegroundColor Cyan
git add .
git commit -m "Deployment: Full 7-Layer Enterprise Stack Operational"
git push origin main
