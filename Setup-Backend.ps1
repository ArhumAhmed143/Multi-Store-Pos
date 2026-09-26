# POS System Backend - Automated Setup Script
# Run this script as Administrator in PowerShell

# Colors for output
$Success = @{ ForegroundColor = "Green" }
$Error = @{ ForegroundColor = "Red" }
$Info = @{ ForegroundColor = "Cyan" }

Write-Host "`n========================================" @Info
Write-Host "POS System - Laravel Backend Setup" @Info
Write-Host "========================================`n" @Info

# Step 1: Check Prerequisites
Write-Host "[1/8] Checking Prerequisites..." @Info

# Check Composer
try {
    $composerVersion = composer --version 2>$null
    Write-Host "✓ Composer is installed: $composerVersion" @Success
    $composerInstalled = $true
} catch {
    Write-Host "✗ Composer not found. Please install from: https://getcomposer.org/download/" @Error
    $composerInstalled = $false
}

if (-not $composerInstalled) {
    Write-Host "`nPlease install Composer first, then run this script again." @Error
    exit
}

# Check PHP
try {
    $phpVersion = php --version 2>$null | Select-Object -First 1
    Write-Host "✓ PHP is installed: $phpVersion" @Success
} catch {
    Write-Host "✗ PHP not found in PATH" @Error
    exit
}

# Step 2: Create Project Structure
Write-Host "`n[2/8] Creating project structure..." @Info
New-Item -ItemType Directory -Path "C:\projects" -Force | Out-Null
Set-Location "C:\projects"
Write-Host "✓ Project directory ready: C:\projects" @Success

# Step 3: Create Laravel Project
Write-Host "`n[3/8] Creating Laravel project (this takes 2-5 minutes)..." @Info
if (-not (Test-Path "C:\projects\pos-system-backend")) {
    composer create-project laravel/laravel pos-system-backend "10.*" --prefer-dist --no-interaction
    Write-Host "✓ Laravel project created" @Success
} else {
    Write-Host "✓ Laravel project already exists" @Success
}

Set-Location "C:\projects\pos-system-backend"

# Step 4: Install Sanctum
Write-Host "`n[4/8] Installing Laravel Sanctum..." @Info
composer require laravel/sanctum --no-interaction
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --no-interaction --force
Write-Host "✓ Sanctum installed and published" @Success

# Step 5: Copy Backend Files
Write-Host "`n[5/8] Copying backend files..." @Info
$sourceBase = "C:\Users\Jannat\Pictures\pos-system1123456789\laravel-files"
$destBase = "C:\projects\pos-system-backend"

# Create API controllers directory if it doesn't exist
New-Item -ItemType Directory -Path "$destBase\app\Http\Controllers\Api" -Force | Out-Null

# Copy files
try {
    Copy-Item "$sourceBase\models\*" "$destBase\app\Models\" -Force -ErrorAction Stop
    Copy-Item "$sourceBase\controllers\Api\*" "$destBase\app\Http\Controllers\Api\" -Force -ErrorAction Stop
    Copy-Item "$sourceBase\migrations\*" "$destBase\database\migrations\" -Force -ErrorAction Stop
    Copy-Item "$sourceBase\seeders\*" "$destBase\database\seeders\" -Force -ErrorAction Stop
    Copy-Item "$sourceBase\routes\api.php" "$destBase\routes\api.php" -Force -ErrorAction Stop
    Write-Host "✓ Backend files copied successfully" @Success
} catch {
    Write-Host "✗ Error copying files: $_" @Error
    exit
}

# Step 6: Generate Application Key
Write-Host "`n[6/8] Generating application key..." @Info
php artisan key:generate --quiet
Write-Host "✓ Application key generated" @Success

# Step 7: Configure .env
Write-Host "`n[7/8] Configuring .env file..." @Info
$envFile = "C:\projects\pos-system-backend\.env"

# Update .env with database configuration
$envContent = Get-Content $envFile -Raw

$replacements = @{
    "DB_CONNECTION=sqlite" = "DB_CONNECTION=mysql"
    "DB_HOST=127.0.0.1`nDB_PORT=3306`nDB_DATABASE=`nDB_USERNAME=root`nDB_PASSWORD=" = "DB_HOST=127.0.0.1`nDB_PORT=3306`nDB_DATABASE=pos_system_db`nDB_USERNAME=root`nDB_PASSWORD="
}

foreach ($old in $replacements.Keys) {
    $envContent = $envContent -replace [regex]::Escape($old), $replacements[$old]
}

# Add CORS configuration
if ($envContent -notmatch "SANCTUM_STATEFUL_DOMAINS") {
    $envContent += "`n`nSANCTUM_STATEFUL_DOMAINS=localhost:3000`nCORS_ALLOWED_ORIGINS=http://localhost:3000"
}

Set-Content $envFile -Value $envContent
Write-Host "✓ .env file configured" @Success

# Step 8: Create Database and Run Migrations
Write-Host "`n[8/8] Setting up database..." @Info

# Try to create database
try {
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS pos_system_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
    Write-Host "✓ Database created (or already exists)" @Success
} catch {
    Write-Host "⚠ Could not create database via command line" @Error
    Write-Host "  Please create manually in phpMyAdmin or via MySQL command" @Info
}

# Run migrations
php artisan migrate --force --quiet
Write-Host "✓ Migrations completed" @Success

# Seed database
php artisan db:seed --quiet
Write-Host "✓ Database seeded with sample data" @Success

# Success!
Write-Host "`n========================================" @Success
Write-Host "✓ Backend Setup Complete!" @Success
Write-Host "========================================`n" @Success

Write-Host "Next Steps:" @Info
Write-Host "1. Keep this terminal open or open a NEW terminal" @Info
Write-Host "2. Run: cd C:\projects\pos-system-backend" @Info
Write-Host "3. Run: php artisan serve" @Info
Write-Host "`nIn a different terminal:" @Info
Write-Host "1. Run: cd C:\Users\Jannat\Pictures\pos-system1123456789" @Info
Write-Host "2. Run: npm start" @Info
Write-Host "`nThen open: http://localhost:3000" @Info
Write-Host "Login with: admin@pos.com / password123" @Info
