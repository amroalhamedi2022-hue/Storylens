#Requires -Version 7.0
<#
.SYNOPSIS
  Securely configure the EXISTING Lingua Tales Android release keystore.
.DESCRIPTION
  Runs locally on the repository owner's Windows computer.
  The keystore is never copied into the repository or passed to command-line
  arguments. GitHub CLI encrypts each secret before uploading it.
  THIS DOES NOT CONVERT A DIFFERENT SIGNER INTO AN IN-PLACE UPDATE!
.EXAMPLE
  pwsh -File tools/configure_stable_signing.ps1 -KeystorePath 'D:\Keys\lingua-release.jks' -KeyAlias 'lingua-release'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$KeystorePath,
    [Parameter(Mandatory = $true)][string]$KeyAlias,
    [string]$Repository = 'amroalhamedi2022-hue/Storylens'
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

foreach ($command in @('gh', 'keytool')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Missing $command. Install GitHub CLI and a JDK before proceeding."
    }
}
$resolved = (Resolve-Path -LiteralPath $KeystorePath -ErrorAction Stop).Path
if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
    throw "The original signing keystore does not exist."
}
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\','/')
$prefix = $projectRoot + [System.IO.Path]::DirectorySeparatorChar
if ($resolved.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Keep the signing keystore OUTSIDE the Git repository and all its subdirectories.'
}
& gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'First authenticate using gh auth login.' }

Write-Host 'The keytool password prompt below runs locally. No private password is sent to this chat.'
$certOutput = & keytool -J-Duser.language=en -list -v -keystore $resolved -alias $KeyAlias 2>&1
if ($LASTEXITCODE -ne 0) { throw 'Unable to inspect the specified keystore and alias.' }
$fingerprintLine = ($certOutput | Where-Object { $_ -match 'SHA256:\s*[0-9A-Fa-f:]+' } | Select-Object -First 1)
$match = [regex]::Match([string]$fingerprintLine,'SHA256:\s*([0-9A-Fa-f:]+)')
if (-not $match.Success) { throw 'No SHA-256 certificate fingerprint found.' }
$cert = $match.Groups[1].Value.Replace(':','').ToLowerInvariant()
if ($cert -notmatch '^[a-f0-9]{64}$') { throw 'Invalid certificate SHA-256 fingerprint.' }

$storeSecure = Read-Host 'Enter the EXISTING keystore password' -AsSecureString
$keySecure = Read-Host 'Enter the EXISTING key password' -AsSecureString
function ConvertFrom-LocalSecureString([securestring]$value) {
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($value)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}
function Set-SecretFromStdin([string]$name,[string]$value) {
    $start = [System.Diagnostics.ProcessStartInfo]::new('gh')
    foreach ($argument in @('secret','set',$name,'--repo',$Repository)) {
        [void]$start.ArgumentList.Add($argument)
    }
    $start.UseShellExecute = $false
    $start.RedirectStandardInput = $true
    $start.RedirectStandardOutput = $true
    $start.RedirectStandardError = $true
    $process = [System.Diagnostics.Process]::new()
    $process.StartInfo = $start
    if (-not $process.Start()) { throw "Could not start GitHub CLI for $name" }
    try {
        $process.StandardInput.Write($value) # exact value, no trailing newline
        $process.StandardInput.Close()
        $outTask = $process.StandardOutput.ReadToEndAsync()
        $errTask = $process.StandardError.ReadToEndAsync()
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) {
            throw "GitHub rejected secret $name. $($errTask.GetAwaiter().GetResult())"
        }
        [void]$outTask.GetAwaiter().GetResult()
        Write-Host "Configured: $name"
    } finally { $process.Dispose() }
}
try {
    $store = ConvertFrom-LocalSecureString $storeSecure
    $key = ConvertFrom-LocalSecureString $keySecure
    if ([string]::IsNullOrWhiteSpace($store) -or [string]::IsNullOrWhiteSpace($key)) {
        throw 'Passwords may not be empty.'
    }
    Set-SecretFromStdin 'LT_SIGNING_KEYSTORE_BASE64' ([Convert]::ToBase64String([IO.File]::ReadAllBytes($resolved)))
    Set-SecretFromStdin 'LT_SIGNING_STORE_PASSWORD' $store
    Set-SecretFromStdin 'LT_SIGNING_KEY_ALIAS' $KeyAlias
    Set-SecretFromStdin 'LT_SIGNING_KEY_PASSWORD' $key
    Set-SecretFromStdin 'LT_SIGNING_CERT_SHA256' $cert
} finally {
    $store = $null
    $key = $null
    $storeSecure.Dispose()
    $keySecure.Dispose()
}
Write-Host "Five private signing secrets configured. Public certificate SHA-256: $cert"
Write-Warning 'This only proves the keystore is retained. You MUST compare it with the existing installed APK certificate before attempting an in-place update.'
Write-Host 'After checking the installed signer and exporting your backup, build the signed candidate with:'
Write-Host "gh workflow run android.yml --repo $Repository --ref main -f release_channel=stable-release"
