# keep-alive.ps1
# ----------------
# This script pings your API every 5 minutes to keep the Cloudflare tunnel alive

# Set your API endpoint
$apiUrl = "https://api.magmdomain.com/health"   # Or /test if you prefer

# Infinite loop
while ($true) {
    try {
        $response = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing -TimeoutSec 10
        Write-Host "$(Get-Date -Format "HH:mm:ss") - Ping successful: $($response.StatusCode)"
    }
    catch {
        Write-Host "$(Get-Date -Format "HH:mm:ss") - Ping failed: $($_.Exception.Message)"
    }

    # Wait 5 minutes (300 seconds)
    Start-Sleep -Seconds 300
}


