$user = Read-Host "Enter Username"
$pass = Read-Host "Enter Password" -AsSecureString
$passPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass))

if ($user -eq "omondi" -and $passPlain -eq "1234") {
    Write-Host "Welcome to AgriMastery, Omondi! Accessing Executive Layers..." -ForegroundColor Green
} else {
    Write-Host "Login Failed. Security Alert Sent to okoth-hash." -ForegroundColor Red
}
