# Simple script to create PostgreSQL database
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

Write-Host "Creating PostgreSQL database 'inventory_db'..." -ForegroundColor Green

# Set password as environment variable (common default)
$env:PGPASSWORD = "postgres"

# Create the database
& $psqlPath -U postgres -h localhost -c "CREATE DATABASE inventory_db;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database 'inventory_db' created successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to create database. Please check your PostgreSQL password." -ForegroundColor Red
    Write-Host "You may need to run this manually and enter your password." -ForegroundColor Yellow
}

# Clean up environment variable
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue 