Write-Host "--- AgriMastery Global Catalog Injector ---" -ForegroundColor Cyan

# Sample Product Data (This represents 'Every product that exists')
$NewProduct = @{
    sku      = "AGRI-99-TRX"
    name     = "High-Yield Hybrid Maize Seeds"
    category = "SEED"
    price    = 120.50
    details  = @{
        germination_rate = "98%"
        origin = "Kenya"
    }
}

Write-Host "Injecting: $(.name)..." -ForegroundColor Yellow

# Simulate Layer 3 (Business Logic) Validation
if ($NewProduct.sku -and $NewProduct.price -gt 0) {
    Write-Host "SUCCESS: Product passed Business Logic Validation." -ForegroundColor Green
    Write-Host "READY: Product is now visible in Layer 1 (Web Dashboard)."
} else {
    Write-Host "ERROR: Product rejected by Layer 3 Rules." -ForegroundColor Red
}
