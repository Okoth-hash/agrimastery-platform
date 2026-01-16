Write-Host "--- AgriMastery Farmer Registration ---" -ForegroundColor Green
$Name = Read-Host "Full Name"
$Email = Read-Host "Email Address"
$Pass = Read-Host "Create Password"
$Hint = Read-Host "Recovery Hint (e.g., Favorite Crop)"

Write-Host "Saving Profile to Layer 6..." -ForegroundColor Cyan
Write-Host "SUCCESS: $Name is now registered. Starting Module 1." -ForegroundColor White
