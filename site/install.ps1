# Installs Claudopus for Claude Code on Windows and switches it on, in one line in PowerShell:
#   irm https://www.claudopus.ai/install.ps1 | iex
# The same steps as install.sh on a Mac or Linux: it finds Claude Code (the Claude desktop app's own copy, or `claude` in a
# terminal), makes sure git is there (Claude Code fetches the marketplace with it; it offers Git for Windows through winget and
# carries on once it is in) and jq (for Stats and the memory, the same way), then runs Claude Code's own steps: add the claudopus marketplace from GitHub (dimka3553/claudopus),
# install claudopus@claudopus for you (user scope) and switch it on. Claude Code merges both into %USERPROFILE%\.claude\settings.json
# and keeps everything else in it. It then sets subagentPromptCacheTtl to "1h" there, so tasks and their helpers keep their prompt
# cache an hour, as the chat does, unless the file already holds a value for it. Running it again brings Claudopus up to date.
# The whole script is one script block run on its last line, so a download cut off half way runs nothing; it never closes the
# PowerShell window it runs in, as `exit` would under iex.

& {
  $ErrorActionPreference = 'Stop'
  $repo = if ($env:CLAUDOPUS_SOURCE) { $env:CLAUDOPUS_SOURCE } else { 'dimka3553/claudopus' }
  $plugin = 'claudopus@claudopus'
  $userHome = if ($env:USERPROFILE) { $env:USERPROFILE } else { $HOME }
  $config = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $userHome '.claude' }
  $settings = Join-Path $config 'settings.json'

  function Say([string]$text) { Write-Host $text }
  function Stop([string]$text) { Write-Host ''; Write-Host "Claudopus is not installed: $text" -ForegroundColor Red; throw 'Claudopus is not installed' }

  # A version folder's name as a version, so 2.1.10 sorts after 2.1.9; a name that is no version sorts first
  function VersionOf([string]$name) { $v = $null; if ([version]::TryParse(($name -replace '[^0-9.].*$', ''), [ref]$v)) { $v } else { [version]'0.0' } }

  # Claude Code: the newest copy the desktop app keeps (in its own folder, or the one Windows gives an app from the Store), else
  # `claude` on the PATH or where its installer puts it
  $engine = $null
  $appFolders = @()
  if ($env:APPDATA) { $appFolders += Join-Path $env:APPDATA 'Claude\claude-code' }
  if ($env:LOCALAPPDATA) {
    $appFolders += Join-Path $env:LOCALAPPDATA 'Claude-Data\claude-code'
    $appFolders += Join-Path $env:LOCALAPPDATA 'Claude\claude-code'
    $appFolders += @(Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA 'Packages') -Directory -Filter '*Claude*' -ErrorAction SilentlyContinue |
      ForEach-Object { Join-Path $_.FullName 'LocalCache\Roaming\Claude\claude-code' })
  }
  $found = foreach ($folder in $appFolders) {
    if (-not (Test-Path -LiteralPath $folder -PathType Container)) { continue }
    Get-ChildItem -LiteralPath $folder -Directory -ErrorAction SilentlyContinue | ForEach-Object {
      $version = $_.Name
      Get-ChildItem -LiteralPath $_.FullName -Recurse -Depth 3 -File -Filter 'claude.exe' -ErrorAction SilentlyContinue |
        ForEach-Object { [pscustomobject]@{ Version = (VersionOf $version); Path = $_.FullName } }
    }
  }
  if ($found) { $engine = ($found | Sort-Object Version | Select-Object -Last 1).Path }
  if (-not $engine) {
    $onPath = Get-Command claude -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    foreach ($e in @($(if ($onPath) { $onPath.Source }), (Join-Path $userHome '.local\bin\claude.exe'), (Join-Path $userHome '.claude\local\claude.exe'))) {
      if ($e -and (Test-Path -LiteralPath $e -PathType Leaf)) { $engine = $e; break }
    }
  }
  if (-not $engine) { Stop "Claude Code isn't on this computer yet.`nInstall the Claude app from https://claude.ai/download, open its Code tab once, then paste this line again." }

  # git: Claude Code fetches the marketplace with it, and runs its own commands in Git for Windows' bash
  $gitFolders = @((Join-Path $env:ProgramFiles 'Git\cmd'), (Join-Path $env:LOCALAPPDATA 'Programs\Git\cmd'))
  function HasGit { [bool](Get-Command git -CommandType Application -ErrorAction SilentlyContinue) }
  function AddGitToPath { foreach ($f in $gitFolders) { if ((Test-Path -LiteralPath (Join-Path $f 'git.exe')) -and ($env:Path -notlike "*$f*")) { $env:Path = "$f;$env:Path" } } }
  AddGitToPath
  if (-not (HasGit)) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
      Stop "Claude Code needs Git for Windows to fetch Claudopus. Install it from https://git-scm.com/download/win, then paste this line again."
    }
    Say 'Claude Code needs Git for Windows to fetch Claudopus. Installing it now; Windows may ask you to allow it.'
    & winget install --id Git.Git --exact --source winget --silent --accept-package-agreements --accept-source-agreements | Out-Host
    AddGitToPath
    if (-not (HasGit)) { Stop "Git for Windows did not install. Install it from https://git-scm.com/download/win, then paste this line again." }
    Say 'Git for Windows is in.'
  }

  # jq: Claudopus reads Claude Code's chat records with it, for Stats and the memory. Asked of winget as Git is; without it
  # Claudopus still installs and runs, and says where it is missing
  $wingetLinks = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links'
  if (-not (Get-Command jq -CommandType Application -ErrorAction SilentlyContinue) -and -not (Test-Path -LiteralPath (Join-Path $wingetLinks 'jq.exe'))) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
      Say 'Installing jq, which Claudopus reads your chats with for Stats and its memory...'
      & winget install --id jqlang.jq --exact --source winget --silent --accept-package-agreements --accept-source-agreements | Out-Null
    }
    if (-not (Get-Command jq -CommandType Application -ErrorAction SilentlyContinue) -and -not (Test-Path -LiteralPath (Join-Path $wingetLinks 'jq.exe'))) {
      Say 'jq is not installed, so Stats and the memory stay empty until it is: winget install jqlang.jq'
    }
  }

  # run <words...>: Claude Code with those words, reading nothing; its words are shown only when it fails
  function Run {
    $out = & $engine @args 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0) { return $true }
    Write-Host $out.TrimEnd()
    return $false
  }

  $ErrorActionPreference = 'Continue'
  Say 'Adding the Claudopus marketplace from GitHub...'
  if (-not (Run plugin marketplace add $repo)) { Stop 'Claude Code could not add the marketplace (its words are above).' }
  if (-not (Run plugin marketplace update claudopus)) { Stop 'Claude Code could not fetch the newest Claudopus (its words are above).' }
  Say 'Installing Claudopus...'
  if (-not (Run plugin install $plugin --scope user)) { Stop 'Claude Code could not install it (its words are above).' }
  $null = Run plugin update $plugin --scope user
  $null = & $engine plugin enable $plugin --scope user 2>&1

  $text = if (Test-Path -LiteralPath $settings) { [IO.File]::ReadAllText($settings) } else { '' }
  if ($text -notmatch '"claudopus@claudopus"\s*:\s*true') { Stop "Claude Code installed it but did not switch it on in $settings." }

  # Tasks keep their prompt cache an hour, as the chat does: with Claude Code's 5 minutes, a task that waits longer on a command or
  # a helper pays to read its whole context again. The key goes in as text after the opening brace, so every other byte of the
  # file stays as it was, and only when the file reads as a JSON object before and after
  $cache = ''
  try {
    $before = $text | ConvertFrom-Json
    if ($before -is [pscustomobject] -and -not ($before.PSObject.Properties.Name -contains 'subagentPromptCacheTtl')) {
      $at = $text.IndexOf('{')
      $after = $text.Substring(0, $at + 1) + "`n  `"subagentPromptCacheTtl`": `"1h`"," + $text.Substring($at + 1)
      if ((($after | ConvertFrom-Json).subagentPromptCacheTtl) -eq '1h') {
        $tmp = "$settings.claudopus-tmp"
        [IO.File]::WriteAllText($tmp, $after, (New-Object Text.UTF8Encoding $false))
        Move-Item -LiteralPath $tmp -Destination $settings -Force
        $cache = 'set'
      }
    }
  } catch { }

  $version = ''
  try {
    $installed = [IO.File]::ReadAllText((Join-Path $config 'plugins\installed_plugins.json'))
    $m = [regex]::Matches($installed, '[\\/]cache[\\/]+claudopus[\\/]+claudopus[\\/]+([^"\\/]+)"')
    if ($m.Count) { $version = $m[$m.Count - 1].Groups[1].Value }
  } catch { }

  Say ''
  Say ("Claudopus " + $(if ($version) { "$version " } else { '' }) + 'is installed and on, in every chat.')
  if ($cache -eq 'set') { Say "Tasks keep their prompt cache for an hour, as the chat does (subagentPromptCacheTtl in $settings)." }
  Say 'In the Claude app, open a new chat in the Code tab. In a chat that is already open, type /reload-plugins.'
  Say 'In a terminal, start claude. The Claudopus panel opens with a welcome; /claudopus opens it again.'
}
