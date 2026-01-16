Write-Host "Simulating Academy Graduation..." -ForegroundColor Cyan
# This mimics a student passing the Soil Health course
node -e "const engine = require('./CertificateEngine.js'); console.log(CertificateEngine.generate('John Doe', 'Sustainable Soil Management'));"
