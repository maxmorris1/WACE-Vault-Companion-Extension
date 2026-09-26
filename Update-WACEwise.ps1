# Run from a Git clone of this project, not a ZIP extraction.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Test-Path '.git')) { throw 'This folder is not a Git clone. Follow PUBLISHING.md to clone the repository first.' }
git pull --ff-only
if ($LASTEXITCODE -ne 0) { throw 'Git pull failed. Check for local edits or network issues.' }
Write-Host 'Files updated. Open chrome://extensions and click Reload on WACE Study Companion.'
Start-Process 'chrome://extensions' -ErrorAction SilentlyContinue
