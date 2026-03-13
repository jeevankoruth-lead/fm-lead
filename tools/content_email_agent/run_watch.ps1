Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")

Set-Location $repoRoot
C:/.venv/Scripts/python.exe "$scriptDir\fmlead_com_focus_a_writer.py" watch
