#Requires -Version 7.0
<#
.SYNOPSIS
  One-time NEW signing identity for Lingua Tales 1.0.0 and future Android updates.
.DESCRIPTION
  Creates a new private keystore on the OWNER'S COMPUTER only (never in repo),
  configures five encrypted GitHub Actions secrets and starts the signed build.
  An older differently signed app can be backed up and uninstalled ONCE by the
  owner; no user data is ever touched by this script.
.EXAMPLE
  pwsh -File tools/bootstrap_first_release.ps1
#>
[CmdletBinding()]
param(
    [string]$KeystorePath = (Join-Path (Join-Path $HOME 'LinguaTales-Private-Signing') 'lingua-tales-v1.p12'),
    [string]$KeyAlias = 'lingua-tales-permanent',
    [string]$Repository = 'amroalhamedi2022-hue/Storylens',
    [switch]$ConfigureOnly
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
foreach ($command in @('gh','keytool','pwsh')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Missing $command. Install PowerShell 7, GitHub CLI and JDK first."
    }
}
& gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Run gh auth login first (with repository access).' }

$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\','/')
$destination = [System.IO.Path]::GetFullPath($KeystorePath)
$rootPrefix = $root + [System.IO.Path]::DirectorySeparatorChar
if ($destination.StartsWith($rootPrefix,[System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'The private signing key must be OUTSIDE the GitHub repository.'
}
if (Test-Path -LiteralPath $destination) {
    throw "A signing keystore ALREADY EXISTS at $destination. Refusing to overwrite it; rerun tools/configure_stable_signing.ps1 for that key."
}
$folder = Split-Path -Path $destination -Parent
[void](New-Item -ItemType Directory -Force -Path $folder)

Write-Host 'This is the new PERMANENT Lingua Tales Android signing identity.'
Write-Host 'Choose a LONG unique password and record it in your secure password manager.'
Write-Host 'Keytool asks for the keystore password interactively; never paste it into chat.'
Write-Host "Creating private keystore: $destination"
& keytool -genkeypair -keystore $destination -storetype PKCS12 -alias $KeyAlias -keyalg RSA -keysize 3072 -validity 12000 -dname 'CN=Lingua Tales,O=Lingua Tales Android,C=PS'
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $destination -PathType Leaf)) {
    throw 'Keytool failed; no release requested. Inspect the path before retrying.'
}
Write-Host 'Private keystore generated locally; also create an offline ENCRYPTED backup.'
Write-Host 'GitHub stores an encrypted copy through Actions secrets, never a Git commit.'

# Existing setup asks privately for passwords and sends secrets by stdin.
& pwsh -NoProfile -File (Join-Path $PSScriptRoot 'configure_stable_signing.ps1') -KeystorePath $destination -KeyAlias $KeyAlias -Repository $Repository
if ($LASTEXITCODE -ne 0) { throw 'GitHub setup failed. KEEP YOUR KEY; do not generate another signing identity.' }

if ($ConfigureOnly) {
    Write-Host 'Secrets set; manually dispatch stable-release when ready.'
    exit 0
}
Write-Host 'Requesting stable, signed Lingua Tales 1.0.0 build from GitHub Actions.'
& gh workflow run android.yml --repo $Repository --ref main -f release_channel=stable-release
if ($LASTEXITCODE -ne 0) {
    throw 'Failed to dispatch workflow. Keystore/secrets remain configured; retry ONLY gh workflow run.'
}
Write-Host "Follow: https://github.com/$Repository/actions/workflows/android.yml"
Write-Host 'After a passing run, download Lingua-Tales-Stable-Signed-Release.'
Write-Host 'The DRAFT GitHub Release also holds this candidate privately for the owner.'
Write-Host 'Reuse this exact keystore for ALL future same-package updates.'
Write-Warning 'Back up saved reading data BEFORE removing an old differently signed app. This script uninstalls nothing.'
