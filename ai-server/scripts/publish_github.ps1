param(
  [Parameter(Mandatory = $false)]
  [string]$RepoName = "dementia-llm",
  [Parameter(Mandatory = $false)]
  [ValidateSet("private", "public")]
  [string]$Visibility = "private"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Set-Location $projectRoot

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (!(Test-Path $gh)) {
  throw "GitHub CLI not found at '$gh'"
}

& $gh auth status | Out-Null

# Create remote repo under current authenticated user account.
& $gh repo create $RepoName --$Visibility --source . --remote origin --push

Write-Host "Done. Remote repository created and pushed."
