Write-Host "--- AgriMastery Security Gate ---" -ForegroundColor Yellow
$EnteredUser = Read-Host "Username"
$EnteredPass = Read-Host "Password"

if ($EnteredUser -eq "omondi" -and $EnteredPass -eq "1234") {
    Write-Host "ACCESS GRANTED. Welcome, Omondi." -ForegroundColor Green
    Write-Host "Initializing Layer 7 Admin Tools..." -ForegroundColor Cyan
} else {
    Write-Host "ACCESS DENIED. Invalid Credentials." -ForegroundColor Red
}
