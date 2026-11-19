# deploy.ps1 - build RawDataWorksheet and copy it to the IIS server.
#
# Put this file in the repo root (the folder that contains "frontend" and "backend").
# Run from PowerShell in that folder:
#     powershell -ExecutionPolicy Bypass -File .\deploy.ps1
#
# What it does:
#   1. npm run build            (frontend -> frontend\dist)
#   2. dotnet publish -c Release (backend  -> .\publish)
#   3. copies frontend\dist into .\publish\wwwroot
#   4. if $ServerPath is reachable: puts app_offline.htm there (IIS stops the app),
#      copies the new files, removes app_offline.htm (IIS starts the app again).
#
# Change the four paths below if yours are different.

param(
    [string]$Frontend   = ".\frontend",
    [string]$Backend    = ".\backend\RawDataWorkSheet\RawDataWorkSheet",
    [string]$Publish    = ".\publish",
    # The IIS site folder on 192.168.2.220 (D:\Applications-Abhijit\RawDataWorksheetFood),
    # reached through the server's built-in admin share D$ (needs an admin account on the server).
    # If you share the folder instead, use e.g. "\\192.168.2.220\RawDataWorksheetFood".
    [string]$ServerPath = "\\192.168.2.220\D$\Applications-Abhijit\RawDataWorksheetFood"
)

$ErrorActionPreference = "Stop"
$root = Get-Location

function Step($text) { Write-Host "`n=== $text ===" -ForegroundColor Cyan }

# 1. Frontend
Step "Building frontend"
Push-Location $Frontend
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }
Pop-Location

# 2. Backend
Step "Publishing backend"
if (Test-Path $Publish) { Remove-Item $Publish -Recurse -Force }
dotnet publish $Backend -c Release -o $Publish
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }

# 3. Frontend into wwwroot
Step "Copying frontend into wwwroot"
$wwwroot = Join-Path $Publish "wwwroot"
New-Item -ItemType Directory -Force -Path $wwwroot | Out-Null
Copy-Item (Join-Path $Frontend "dist\*") $wwwroot -Recurse -Force

Write-Host "`nBuild ready in: $(Resolve-Path $Publish)" -ForegroundColor Green

# 4. Copy to server
if (-not (Test-Path $ServerPath)) {
    Write-Host "Server folder $ServerPath not reachable. Copy the publish folder to the server by hand." -ForegroundColor Yellow
    exit 0
}

Step "Deploying to $ServerPath"
$offline = Join-Path $ServerPath "app_offline.htm"
Set-Content -Path $offline -Value "<html><body><h3>Updating RawDataWorksheet. Please wait a minute.</h3></body></html>"
Start-Sleep -Seconds 5   # give IIS time to stop the app and release the DLLs

# Keep the server's own settings file if it has one (production connection strings etc.)
robocopy $Publish $ServerPath /E /XF app_offline.htm appsettings.Production.json /R:3 /W:5 /NFL /NDL /NP
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with code $LASTEXITCODE" }

Remove-Item $offline -Force
Write-Host "`nDeployed. Open http://192.168.2.220:8091" -ForegroundColor Green
Set-Location $root