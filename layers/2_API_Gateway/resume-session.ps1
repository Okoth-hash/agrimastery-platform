Write-Host "--- AgriMastery Session Recovery ---" -ForegroundColor Yellow
$Email = Read-Host "Enter Registered Email"
$HintCheck = Read-Host "Security Question: What is your favorite crop?"

if ($HintCheck -eq "Maize") {
    Write-Host "Verification Success! Loading your last saved progress..." -ForegroundColor Green
    Write-Host "Redirecting Omondi to: Module 3 - Soil Irrigation" -ForegroundColor Cyan
} else {
    Write-Host "Verification Failed. Access Denied." -ForegroundColor Red
}
