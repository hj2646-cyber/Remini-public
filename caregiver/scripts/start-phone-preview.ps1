$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$workspaceRoot = Split-Path -Parent $scriptDir
$apiServerDir = Join-Path $workspaceRoot "artifacts\api-server"
$caregiverAppDir = Join-Path $workspaceRoot "artifacts\caregiver-app"
$ngrokCmd = Join-Path $workspaceRoot "node_modules\.bin\ngrok.CMD"

function Start-Window {
  param(
    [string]$Title,
    [string]$Command
  )

  $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($Command))
  Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-EncodedCommand",
    $encoded
  ) -WindowStyle Normal | Out-Null
}

if (-not (Test-Path $ngrokCmd)) {
  throw "ngrok executable not found at $ngrokCmd"
}

$apiCommand = @"
Set-Location '$apiServerDir'
pnpm.cmd run dev
"@

Start-Window -Title "API Server" -Command $apiCommand
Start-Sleep -Seconds 4

$ngrokCommand = @"
Set-Location '$workspaceRoot'
& '$ngrokCmd' http 5000
"@

Start-Window -Title "ngrok API Tunnel" -Command $ngrokCommand

$publicUrl = $null
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 2

  try {
    $tunnelInfo = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
    $availableTunnels = @($tunnelInfo.tunnels)
    $httpsTunnel = $availableTunnels |
      Where-Object { $_.public_url -like "https://*" -or $_.proto -eq "https" } |
      Select-Object -First 1
    $fallbackTunnel = $availableTunnels |
      Where-Object { $_.public_url } |
      Select-Object -First 1

    if ($httpsTunnel -and $httpsTunnel.public_url) {
      $publicUrl = $httpsTunnel.public_url
      break
    }

    if ($fallbackTunnel -and $fallbackTunnel.public_url) {
      $publicUrl = $fallbackTunnel.public_url
      break
    }
  } catch {
  }
}

if (-not $publicUrl) {
  throw "ngrok tunnel URL was not detected. If ngrok asked for auth setup, run it once manually and try again."
}

$caregiverCommand = @"
Set-Location '$caregiverAppDir'
\$env:EXPO_PUBLIC_DOMAIN = '$publicUrl'
Write-Host 'Using API tunnel:' \$env:EXPO_PUBLIC_DOMAIN
pnpm.cmd run dev:phone
"@

Start-Window -Title "Caregiver App (Expo Tunnel)" -Command $caregiverCommand

Write-Host ""
Write-Host "Phone preview is starting."
Write-Host "API tunnel: $publicUrl"
Write-Host "Expo window will show a QR code. Open it with Expo Go on your phone."
Write-Host ""
Write-Host "If ngrok fails with an auth error, run this once first:"
Write-Host "  .\node_modules\.bin\ngrok.CMD authtoken <YOUR_NGROK_TOKEN>"
