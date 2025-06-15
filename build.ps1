# CineAI Production Build Script for Windows
Write-Host "🚀 Building CineAI for Production..." -ForegroundColor Green

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
pnpm install

# Build the application
Write-Host "🏗️ Building application..." -ForegroundColor Cyan
$env:NODE_ENV = "production"
pnpm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "📊 Build statistics:" -ForegroundColor White
    if (Test-Path ".next") {
        $size = (Get-ChildItem -Recurse ".next" | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "Build size: $([math]::Round($size, 2)) MB" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "🚀 Ready for deployment!" -ForegroundColor Green
    Write-Host "📝 To start production server: pnpm start" -ForegroundColor White
    Write-Host "🐳 To build Docker image: docker build -t cineai ." -ForegroundColor White
    Write-Host "☁️ To deploy to Google Cloud Run: gcloud builds submit" -ForegroundColor White
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
