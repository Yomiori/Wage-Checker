# 🛡️ Security Verification Script for SalaryCheck.us on Vercel
# This script tests all security redirects to ensure WordPress attacks are blocked

Write-Host "🛡️ SalaryCheck.us Security Verification" -ForegroundColor Cyan
Write-Host "Testing security redirects on Vercel deployment..." -ForegroundColor Yellow
Write-Host ""

# Define test URLs that should return 404
$testUrls = @(
    # WordPress attack patterns
    "https://salarycheck.us/wp-admin/setup-config.php",
    "https://salarycheck.us/wordpress/wp-admin/setup-config.php",
    "https://salarycheck.us/xmlrpc.php",
    "https://salarycheck.us/wp-includes/license.txt",
    
    # Infrastructure probes
    "https://salarycheck.us/.aws/credentials",
    "https://salarycheck.us/_profiler/phpinfo",
    "https://salarycheck.us/.env",
    "https://salarycheck.us/config/database.php",
    "https://salarycheck.us/cmd_sco",
    
    # Admin panel probes
    "https://salarycheck.us/admin/config.php",
    "https://salarycheck.us/phpmyadmin/index.php",
    "https://salarycheck.us/administrator/index.php"
)

$passedTests = 0
$failedTests = 0

Write-Host "Testing attack vector blocking..." -ForegroundColor Green
Write-Host ""

foreach ($url in $testUrls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -ErrorAction Stop
        Write-Host "❌ FAILED: $url returned $($response.StatusCode)" -ForegroundColor Red
        $failedTests++
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "✅ PASSED: $url correctly blocked (404)" -ForegroundColor Green
            $passedTests++
        }
        else {
            Write-Host "⚠️  WARNING: $url returned $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
            $failedTests++
        }
    }
}

Write-Host ""
Write-Host "📊 Security Test Results:" -ForegroundColor Cyan
Write-Host "✅ Passed: $passedTests tests" -ForegroundColor Green
Write-Host "❌ Failed: $failedTests tests" -ForegroundColor Red

if ($failedTests -eq 0) {
    Write-Host ""
    Write-Host "🎉 ALL SECURITY TESTS PASSED!" -ForegroundColor Green
    Write-Host "Your website is properly protected against the 294+ WordPress attacks." -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "⚠️  Some security tests failed. Please check vercel.json configuration." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Additional verification steps:" -ForegroundColor Cyan
Write-Host "1. Check security headers at: https://securityheaders.com/" -ForegroundColor White
Write-Host "2. Monitor Vercel analytics for blocked requests" -ForegroundColor White
Write-Host "3. Verify SSL certificate is active" -ForegroundColor White
