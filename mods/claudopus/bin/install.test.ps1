# Tests claudopus.ai's one-line installer for Windows (site/install.ps1) in made-up home folders, read into iex as
# `irm ... | iex` does, in Windows PowerShell (the one every Windows has) and in PowerShell 7 when it is there, with this repo as
# its marketplace so nothing is fetched. ENGINE: the Claude Code to install with (claude on the PATH by default); with none it
# says so and passes. Nothing in the real home folder is read or changed. Elsewhere than Windows it is skipped.
#   powershell -NoProfile -File mods/claudopus/bin/install.test.ps1
$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT') { Write-Host 'install.test.ps1: skipped, it tests the Windows installer'; exit 0 }
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$script = Join-Path $repo 'site\install.ps1'
$engine = if ($env:ENGINE) { $env:ENGINE } else { (Get-Command claude -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1).Source }
if (-not $engine -or -not (Test-Path -LiteralPath $engine)) { Write-Host 'ok   skipped: no Claude Code here to install with'; exit 0 }
# The app's copy is one program; a claude.cmd that npm makes cannot stand in for it, so that case runs with a real claude.exe only
$exe = if ($engine -like '*.exe') { $engine } else { $null }
$tmp = Join-Path ([IO.Path]::GetTempPath()) ("claudopus-install-test-" + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Path $tmp | Out-Null
$fails = 0
$version = ([IO.File]::ReadAllText((Join-Path $repo 'mods\claudopus\.claude-plugin\plugin.json')) | ConvertFrom-Json).version
$shells = @('powershell') + @(if (Get-Command pwsh -ErrorAction SilentlyContinue) { 'pwsh' })
$system = "$env:SystemRoot\System32;$env:SystemRoot;$env:SystemRoot\System32\WindowsPowerShell\v1.0"
$git = Split-Path (Get-Command git -CommandType Application).Source

function Check([string]$what, [scriptblock]$test) {
  $ok = $false; try { $ok = [bool](& $test) } catch { }
  if ($ok) { Write-Host "ok   $what" } else { Write-Host "FAIL $what"; $script:fails++ }
}

# Home <name> [path]: a fresh home folder with Claude Code where the person has it: the app's copy (when there is a claude.exe),
# or claude on the PATH
function Home([string]$name, [string]$how = '') {
  $h = Join-Path $tmp $name
  New-Item -ItemType Directory -Force -Path (Join-Path $h 'AppData\Roaming'), (Join-Path $h 'AppData\Local'), (Join-Path $h 'bin') | Out-Null
  $p = "$git;$system"
  if ($exe -and $how -ne 'path') {
    New-Item -ItemType Directory -Force -Path (Join-Path $h 'AppData\Roaming\Claude\claude-code\2.1.1\abc') | Out-Null
    $to = Join-Path $h 'AppData\Roaming\Claude\claude-code\2.1.99\def'
    New-Item -ItemType Directory -Force -Path $to | Out-Null
    Copy-Item -LiteralPath $exe -Destination (Join-Path $to 'claude.exe')
  } else {
    $p = "$(Split-Path $engine);$p"
  }
  @{ Home = $h; Path = $p }
}

# Install <home> <shell>: the script read into iex, as from irm, with what a fresh PowerShell window has
function Install($h, [string]$shell = 'powershell') {
  $saved = @{}
  $set = @{ USERPROFILE = $h.Home; HOME = $h.Home; APPDATA = (Join-Path $h.Home 'AppData\Roaming'); LOCALAPPDATA = (Join-Path $h.Home 'AppData\Local'); Path = $h.Path; CLAUDOPUS_SOURCE = $repo; CLAUDE_CONFIG_DIR = $null }
  foreach ($k in $set.Keys) { $saved[$k] = [Environment]::GetEnvironmentVariable($k); [Environment]::SetEnvironmentVariable($k, $set[$k]) }
  # What the installer writes to its error stream is part of what it says, never an error of this test's own
  $was = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $out = & $shell -NoProfile -NonInteractive -Command "Get-Content -Raw -LiteralPath '$script' | iex" 2>&1 | ForEach-Object { "$_" } | Out-String
    $rc = $LASTEXITCODE
  } finally { $ErrorActionPreference = $was; foreach ($k in $saved.Keys) { [Environment]::SetEnvironmentVariable($k, $saved[$k]) } }
  [IO.File]::WriteAllText("$($h.Home).out", $out)
  @{ Out = $out; Rc = $rc }
}
function Settings($h) { [IO.File]::ReadAllText((Join-Path $h.Home '.claude\settings.json')) }
function IsOn($h) { (Settings $h) -match '"claudopus@claudopus"\s*:\s*true' }
function Cache($h, $v) { (Settings $h) -match "`"subagentPromptCacheTtl`"\s*:\s*`"$v`"" }

try {
  foreach ($shell in $shells) {
    # A. A home with nothing in it: installed, on, and the version said
    $h = Home "empty-$shell"; $r = Install $h $shell
    Check "$shell - a fresh home installs and exits 0" { $r.Rc -eq 0 }
    Check "$shell - it is on in settings.json" { IsOn $h }
    Check "$shell - the marketplace is known to Claude Code" { (Settings $h) -match '"claudopus"' }
    Check "$shell - Claude Code's record has it" { [IO.File]::ReadAllText((Join-Path $h.Home '.claude\plugins\installed_plugins.json')) -match "claudopus[\\/]+claudopus[\\/]+$([regex]::Escape($version))" }
    Check "$shell - it says the version and how to start" { $r.Out -match "Claudopus $([regex]::Escape($version)) is installed and on" -and $r.Out -match '/reload-plugins' }
    Check "$shell - it runs to its last line" { $r.Out -match '/claudopus opens it again' }
    Check "$shell - tasks keep their prompt cache an hour, and it says so" { (Cache $h '1h') -and $r.Out -match 'prompt cache for an hour' }
  }

  # B. A settings.json with the person's own settings, another plugin, and Claudopus switched off: all kept byte for byte, Claudopus
  # on, and the hour's cache for tasks added
  $h = Home 'full'
  New-Item -ItemType Directory -Force -Path (Join-Path $h.Home '.claude') | Out-Null
  $own = "{`n  `"env`": { `"SOME_SETTING`": `"1`" },`n  `"permissions`": { `"allow`": [`"Bash(ls:*)`"] },`n  `"model`": `"opus`",`n  `"big`": 12345678901234567890,`n  `"enabledPlugins`": { `"other@elsewhere`": true, `"claudopus@claudopus`": false }`n}`n"
  [IO.File]::WriteAllText((Join-Path $h.Home '.claude\settings.json'), $own)
  $r = Install $h
  Check 'a home with settings installs and exits 0' { $r.Rc -eq 0 }
  Check 'a switched-off Claudopus is switched on' { IsOn $h }
  Check "the person's own settings stay, a long number too" { $s = Settings $h; $s -match 'SOME_SETTING' -and $s -match 'Bash\(ls:\*\)' -and $s -match '"model":\s*"opus"' -and $s -match 'other@elsewhere' -and $s -match '12345678901234567890' }
  Check "the hour's cache for tasks is added beside them" { Cache $h '1h' }
  Check 'the file is still valid JSON' { $null -ne ((Settings $h) | ConvertFrom-Json) }

  # C. The same line again, after the person chose 5 minutes for tasks: nothing breaks, still on, their choice kept
  [IO.File]::WriteAllText((Join-Path $h.Home '.claude\settings.json'), ((Settings $h) -replace '"subagentPromptCacheTtl":\s*"1h"', '"subagentPromptCacheTtl": "5m"'))
  $r = Install $h
  Check 'running it again exits 0 and leaves it on' { $r.Rc -eq 0 -and (IsOn $h) }
  Check 'a cache time the person set is kept, and nothing said of it' { (Cache $h '5m') -and $r.Out -notmatch 'prompt cache' }

  # D. Claude Code as claude on the PATH, with no app
  if ($exe) {
    $h = Home 'path' 'path'; $r = Install $h
    Check 'claude on the PATH is used when there is no app' { $r.Rc -eq 0 -and (IsOn $h) }
  }

  # E. No Claude Code at all: it stops, says where to get it, and writes nothing
  $h = @{ Home = (Join-Path $tmp 'none'); Path = "$git;$system" }
  New-Item -ItemType Directory -Force -Path $h.Home | Out-Null
  $r = Install $h
  Check 'with no Claude Code it fails and says where to get it' { $r.Rc -ne 0 -and $r.Out -match 'claude\.ai/download' -and -not (Test-Path (Join-Path $h.Home '.claude\settings.json')) }
} finally {
  if ($fails) { Get-ChildItem -LiteralPath $tmp -Filter '*.out' -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "--- $($_.Name)"; Get-Content -Raw $_.FullName } }
  if (-not $env:INSTALL_TEST_KEEP) { Remove-Item -Recurse -Force -LiteralPath $tmp -ErrorAction SilentlyContinue }
}
if ($fails -eq 0) { Write-Host 'all passed'; exit 0 }
Write-Host "$fails failed"
exit 1
