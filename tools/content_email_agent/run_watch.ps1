Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")

Set-Location $repoRoot
C:/.venv/Scripts/python.exe "$scriptDir\content_email_agent.py" watch
