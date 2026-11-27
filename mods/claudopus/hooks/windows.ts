// What Claudopus needs only on Windows and reads nothing of the engine: the PowerShell and Git bash scripts it runs there, and what
// reads their output. The joined file imports them, so they take none of the room the engine gives it

// A path as the mod keeps it: a Windows one (C:\Users\x, \\server\share) with forward slashes, which Windows takes as well, so every
// path the mod builds, splits and compares has one separator on every system. Any other path stays as it is
export const slashed = (path: string) => (/^(?:[A-Za-z]:\\|\\\\)/.test(path) ? path.replace(/\\/g, '/') : path)
// On Windows, Windows PowerShell's own clipboard: the files copied in Explorer, else a picture saved where CLAUDOPUS_PASTE_TO says,
// each path on a line of its own, in UTF-8 so a name in any language comes through whole
export const PASTE_WINDOWS = [
  "$ErrorActionPreference = 'Stop'",
  '[Console]::OutputEncoding = [Text.Encoding]::UTF8',
  'Add-Type -AssemblyName System.Windows.Forms, System.Drawing',
  '$files = [Windows.Forms.Clipboard]::GetFileDropList()',
  'if ($files.Count) { $files | ForEach-Object { $_ }; exit 0 }',
  '$image = [Windows.Forms.Clipboard]::GetImage()',
  'if ($image) { $image.Save($env:CLAUDOPUS_PASTE_TO, [Drawing.Imaging.ImageFormat]::Png); $env:CLAUDOPUS_PASTE_TO }',
].join('; ')
export const PICK_WINDOWS = [
  'powershell',
  '-NoProfile',
  '-NonInteractive',
  '-STA',
  '-Command',
  [
    '[Console]::OutputEncoding = [Text.Encoding]::UTF8',
    'Add-Type -AssemblyName System.Windows.Forms',
    '$owner = New-Object Windows.Forms.Form -Property @{ TopMost = $true }',
    "$box = New-Object Windows.Forms.OpenFileDialog -Property @{ Multiselect = $true; Title = 'Attach files' }",
    'if ($box.ShowDialog($owner) -eq [Windows.Forms.DialogResult]::OK) { $box.FileNames }',
  ].join('; '),
]
export const PATHS_SAID_WINDOWS = /(?:file:\/\/\/?)?((?<![\w:])[A-Za-z]:[\\/][^\s'"`<>]+|\/(?:\\ |[^\s'"`<>])+)|'((?:[A-Za-z]:[\\/]|\/)[^'\n]+)'|"((?:[A-Za-z]:[\\/]|\/)[^"\n]+)"/g
// On Windows, in Git's bash, openssl is Git's own Windows program, which cannot open the shell's pipe by its name: the public key is
// a file in a folder of this run's own, removed as it ends, and base64 is perl's. The value still goes on openssl's stdin alone
export const SEAL_FOR_WINDOWS =
  'PATH=/usr/bin:/bin:/mingw64/bin; d=$(mktemp -d) || exit 1; trap \'rm -rf "$d"\' EXIT; printf %s "$1" | perl -MMIME::Base64 -0777 -ne \'print decode_base64($_)\' >"$d/key" && openssl pkeyutl -encrypt -pubin -keyform DER -inkey "$d/key" -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 -out "$d/sealed" && perl -MMIME::Base64 -0777 -ne \'print encode_base64($_, "")\' "$d/sealed"'
// On Windows the chat's open is Git's start (cmd's own, whose first quoted word is a window's title, here empty), Explorer, or
// cygstart: each shows a page, a folder or a file as open does, Explorer's /select, as open's -R, and no switch of their own
export const WINDOWS_OPENS = ['start', 'explorer', 'explorer.exe', 'cygstart']
export const windowsOpenArgs = (head: string, args: string[]) => {
  const rest = head === 'start' && args[0] === '' ? args.slice(1) : args
  if (rest.some(one => one === '' || /^\/[A-Za-z]+$/.test(one) || (one.startsWith('/') && one.includes(',') && !one.toLowerCase().startsWith('/select,')))) return ['-x']
  return rest.flatMap(one => (one.toLowerCase().startsWith('/select,') ? ['-R', one.slice(8).replace(/\\/g, '/')] : [one.replace(/\\/g, '/')]))
}
// Windows has no lsof, and Git's ps sees none of its programs: what listens comes from netstat (a TCP row whose far end is 0.0.0.0:0
// or [::]:0 listens, whatever language Windows writes its state in), and every process, with its parent, program and command line,
// from PowerShell. Windows tells no process's folder: a server's is the folder its command line names under the home folder (the
// part before node_modules, else the script's own folder), never one in AppData, where the person's apps live
export const WINDOWS_PROCS = "Get-CimInstance Win32_Process | ForEach-Object { '' + $_.ProcessId + [char]9 + $_.ParentProcessId + [char]9 + $_.ExecutablePath + [char]9 + $_.Name + [char]9 + $_.CommandLine }"
export const windowsPortsOf = (text: string) => {
  const ports = new Map<number, string[]>()
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*TCP\s+(\S+):(\d+)\s+(?:0\.0\.0\.0|\[::\]):0\s+\S+\s+(\d+)\s*$/i.exec(line)
    const pid = Number(m?.[3] ?? 0)
    if (m && pid > 4 && !ports.get(pid)?.includes(m[2] ?? '')) ports.set(pid, [...(ports.get(pid) ?? []), m[2] ?? ''])
  }
  return ports
}
export const windowsProcsOf = (text: string) => {
  const table = new Map<number, { parent: number; path: string; args: string }>()
  for (const line of text.split(/\r?\n/)) {
    const [pid = '', parent = '', path = '', name = '', ...args] = line.split('\t')
    if (/^\d+$/.test(pid)) table.set(Number(pid), { parent: Number(parent) || 0, path: slashed(path || name), args: args.join('\t').trim() })
  }
  return table
}
export const windowsFolderOf = (args: string, home: string, scratch: string) => {
  const lower = (one: string) => one.toLowerCase()
  for (const m of args.matchAll(/"([^"]*)"|(\S+)/g)) {
    const word = slashed(m[1] ?? m[2] ?? '')
    if (!/^[A-Za-z]:\//.test(word)) continue
    const inHome = home && lower(word).startsWith(`${lower(home)}/`) && !lower(word).startsWith(`${lower(home)}/appdata/`)
    const inScratch = scratch && lower(word).startsWith(`${lower(scratch)}/`)
    if (!inHome && !inScratch) continue
    // (spelt as the home folder is, as Windows takes either case)
    const whole = inHome ? `${home}${word.slice(home.length)}` : `${scratch}${word.slice(scratch.length)}`
    const [before] = whole.split('/node_modules/')
    return before !== whole ? (before ?? whole) : whole.replace(/\/[^/]*$/, '')
  }
  return ''
}
