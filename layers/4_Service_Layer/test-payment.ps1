Write-Host "--- AgriMastery Transaction Simulator ---" -ForegroundColor Cyan
Write-Host "Buyer 'Alice' is purchasing Omondi's Maize for $120..." -ForegroundColor White

# Simulating the Escrow process
Write-Host "STATUS: Payment of $120 Captured." -ForegroundColor Yellow
Write-Host "STATUS: Funds HELD in Secure Escrow." -ForegroundColor Cyan
Write-Host "--- Awaiting Delivery Confirmation ---" -ForegroundColor Gray
Start-Sleep -Seconds 2
Write-Host "CONFIRMED: Alice received the Maize!" -ForegroundColor Green
Write-Host "ACTION: Releasing $120 to Omondi's Wallet." -ForegroundColor Green
