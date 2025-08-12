# PowerShell script to connect to PostgreSQL and create database
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

Write-Host "Connecting to PostgreSQL..." -ForegroundColor Green
Write-Host "Using psql from: $psqlPath" -ForegroundColor Yellow

# Try to connect and create database
try {
    # Create database using psql
    & $psqlPath -U postgres -c "CREATE DATABASE inventory_db;"
    Write-Host "Database 'inventory_db' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 