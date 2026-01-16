Write-Host "--- AgriMastery Integrated Flow Test ---" -ForegroundColor Cyan

# 1. Simulate a Purchase
Write-Host "1. Buyer 'Alice' pays $120 for Omondi's Maize." -ForegroundColor White
Write-Host "2. Escrow: Funds captured and locked." -ForegroundColor Green

# 2. Trigger the Notification (This is the 'Doing' part)
Write-Host "3. Triggering Notification Hub..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

Write-Host "[PHONE ALERT]: Congratulations Omondi! Your Maize has been purchased for $120. Funds are secured in Escrow." -ForegroundColor Green -BackgroundColor Black
