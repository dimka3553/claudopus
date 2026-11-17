// Updating Claudopus, the pure parts: it never installs by itself. A look only reads the version page on claudopus.ai (one small
// fetch, with no model or agent in it), and the panel says when it names a newer version. Then three steps, each a press: Download
// fetches the release and checks it is what the release published, Install puts it in place (Claude Code's own steps for an
// installed copy, a fast-forward for a folder of the code), Reload switches a chat to it.
// The page that says which version is current: site/version.json, made by build.mjs from plugin.json and served from main
export const VERSION_PAGE = 'https://www.claudopus.ai/version.json';
// How long the page may take to answer before the look counts it as not read
export const VERSION_WAIT = 30000;
// How often the Mac looks at the version page, and how long a look may hold the lock before another chat takes over
export const UPDATE_EVERY = 60 * 60 * 1000;
export const UPDATE_LOOK = 15 * 60 * 1000;
// How long after a chat loads before it looks, so a chat's start is never held up
export const UPDATE_AFTER = 2 * 60 * 1000;
// The marketplace and plugin a copy was installed from, read off its folder: Claude Code keeps an installed copy at
// <plugins>/cache/<marketplace>/<plugin>/<version>. A copy loaded from anywhere else (a folder of its code, as its maker runs it)
// is left alone: nothing was installed there to update
export const installedFrom = (root) => {
    const [, plugins = '', marketplace = '', plugin = ''] = /^(.*\/plugins)\/cache\/([^/]+)\/([^/]+)\/[^/]+\/?$/.exec(root) ?? [];
    return plugins && /^\w[\w.-]*$/.test(marketplace) && /^\w[\w.-]*$/.test(plugin) ? { plugins, marketplace, plugin } : undefined;
};
// The scope this copy was installed at, read from installed_plugins.json by its folder; absent, `plugin update` takes the user's
export const scopeOf = (installed, id, root) => {
    try {
        const entries = JSON.parse(installed)?.plugins?.[id] ?? [];
        const scope = entries.find(one => one.installPath?.replace(/\/$/, '') === root.replace(/\/$/, ''))?.scope;
        return scope && /^(user|project|local)$/.test(scope) ? scope : undefined;
    }
    catch {
        return undefined;
    }
};
// The version the page names, or undefined for anything that is not one
export const versionOnPage = (text) => {
    try {
        const version = JSON.parse(text)?.version;
        return typeof version === 'string' && /^\d+(\.\d+){1,3}([-+][\w.]+)?$/.test(version) ? version : undefined;
    }
    catch {
        return undefined;
    }
};
// The version installed at the scope this copy was installed at, from installed_plugins.json (a chat that started before an update
// runs the old folder, but the Mac has the new one); without an entry, the version folder this copy runs from
export const installedVersionOf = (installed, id, root, scope) => {
    const folder = root.replace(/\/$/, '').split('/').at(-1) ?? '';
    try {
        const entries = (JSON.parse(installed)?.plugins?.[id] ?? []).filter((one) => typeof one?.version === 'string' && one.version);
        // This very folder's entry first, then one at the scope it was installed at, then the user's
        const own = entries.find(one => one.installPath?.replace(/\/$/, '') === root.replace(/\/$/, ''));
        return (own ?? entries.find(one => one.scope === (scope ?? 'user')))?.version || folder;
    }
    catch {
        return folder;
    }
};
// The installed copy this chat would load if it started now, with the folder Claude Code put it in: this very folder's entry, else the
// project or local install of the folder the chat runs in (the nearest one), else the user's
export const copyOf = (installed, id, root, cwd = '') => {
    try {
        const entries = (JSON.parse(installed)?.plugins?.[id] ?? []).filter((one) => typeof one?.version === 'string' && one.version);
        const trim = (path = '') => path.replace(/\/$/, '');
        const own = entries.find(one => trim(one.installPath) === trim(root));
        const inFolder = entries
            .filter(one => one.scope !== 'user' && one.projectPath && (trim(cwd) === trim(one.projectPath) || trim(cwd).startsWith(`${trim(one.projectPath)}/`)))
            .sort((x, y) => trim(y.projectPath).length - trim(x.projectPath).length)[0];
        const one = own ?? inFolder ?? entries.find(one => one.scope === 'user');
        return one?.version ? { version: one.version, installPath: one.installPath ? trim(one.installPath) : undefined } : undefined;
    }
    catch {
        return undefined;
    }
};
// How often an open chat looks whether a newer copy is installed, and how long before a chat asks again for a reload to the same
// version (one that brought back the old copy, or was refused)
export const RELOAD_EVERY = 20000;
export const RELOAD_AGAIN = 10 * 60 * 1000;
// Whether a chat running `loaded` reloads to the installed copy: a newer one, whole on disk (its manifest names that version), and
// not already asked for in this chat within RELOAD_AGAIN
export const isReloadDue = (loaded, copy, manifest, before, now) => {
    if (!loaded || !copy?.version || !isNewer(copy.version, loaded))
        return false;
    if (copy.installPath && versionIn(manifest) !== copy.version)
        return false;
    const at = typeof before?.at === 'number' && Number.isFinite(before.at) ? before.at : undefined;
    return !(at !== undefined && before?.version === copy.version && now >= at && now - at < RELOAD_AGAIN);
};
// The moment a chat moves to a newer version, UPDATED_FOR long: the octopus turns blue and jumps (its own animation, played by the
// surface), the name line says "Claudopus updated" in blue and, from UPDATED_SAYS, the new version; a sound plays once; then all is
// as before. The look changes only at UPDATED_SAYS and UPDATED_FOR, so the moment adds no drawings of its own between them: the
// desktop app drops a drawing it asked for once the next change is announced, so a moment redrawn each 150 ms never reached a chat
// run over ssh, whose drawings take longer than that to come back. Its drawings then have as long as the panel's own beat allows. A panel first drawn later than UPDATED_LATE after the load shows nothing of it
export const UPDATED_FOR = 5000;
export const UPDATED_SAYS = 2500;
export const UPDATED_LATE = 10 * 60 * 1000;
// The version this chat ran before this load, when the load moved it to a newer one: the version the chat last loaded (kept
// through a reload), else, for a chat whose last copy kept none, the reload it asked for (reloads/<chat>.json) to this very
// version, if recent
export const updatedFrom = (loaded, ran, mark, now) => {
    const asked = mark?.version === loaded && typeof mark.from === 'string' && typeof mark.at === 'number' && now >= mark.at && now - mark.at < UPDATED_LATE ? mark.from : '';
    const before = ran || asked;
    return loaded && before && isNewer(loaded, before) ? before : '';
};
export const updatedLook = (to, t) => {
    if (!(t >= 0 && t < UPDATED_FOR) || !to)
        return undefined;
    return [{ text: 'Claudopus' }, { text: t >= UPDATED_SAYS ? `v${to}` : 'updated' }];
};
// The octopus of the moment: the happy one in the workflow blue, its jump played over the whole moment, resting on its last picture,
// and drawn closer, so it is as big as the octopus at rest (the happy drawing leaves room round it for its arms and sparkles)
export const updatedArt = (happy, blue) => happy.replace('viewBox="0 0 24 24"', 'viewBox="1 -1 22 22"').replaceAll('#4EBA65', blue).replaceAll('dur="2s"', `dur="${UPDATED_FOR / 4000}s" repeatCount="4"`);
const nameIn = (manifest) => {
    try {
        const name = JSON.parse(manifest)?.name;
        return typeof name === 'string' && /^[\w.-]+$/.test(name) ? name : '';
    }
    catch {
        return '';
    }
};
const versionIn = (manifest) => {
    try {
        return String(JSON.parse(manifest)?.version ?? '');
    }
    catch {
        return '';
    }
};
// Claude Code's two steps for an installed copy, in order: refresh the marketplace's copy, then update the mod from it, at the scope
// it was installed at
export const updateSteps = (engine, from, scope) => [
    [engine, 'plugin', 'marketplace', 'update', from.marketplace],
    [engine, 'plugin', 'update', `${from.plugin}@${from.marketplace}`, ...(scope ? ['--scope', scope] : [])],
];
const VERSION_RE = /^\d{1,4}(?:\.\d{1,6}){1,3}$/;
export const isVersion = (text) => typeof text === 'string' && VERSION_RE.test(text);
export const isTree = (text) => typeof text === 'string' && /^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(text);
const plainLine = (text, most = 140) => typeof text === 'string'
    ? text
        .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, most)
    : '';
export const publishedOf = (text) => {
    try {
        const page = JSON.parse(text);
        if (!isVersion(page?.version) || !isTree(page.tree))
            return undefined;
        const versions = (Array.isArray(page.versions) ? page.versions : [])
            .slice(0, 60)
            .filter((one) => isVersion(one?.version))
            .map(one => ({ version: one.version, line: plainLine(one.line), more: Math.max(0, Math.min(99, Math.floor(Number(one.more) || 0))) }));
        const size = Number(page.size);
        return { version: page.version, tree: page.tree, size: Number.isFinite(size) && size > 0 ? Math.floor(size) : 0, versions };
    }
    catch {
        return undefined;
    }
};
// The versions a chat running `loaded` has not had, newest first, as the page lists them (the page's own version always among them)
export const missedOn = (page, loaded) => {
    const listed = page.versions.filter(one => isNewer(one.version, loaded));
    return listed.some(one => one.version === page.version) || !isNewer(page.version, loaded) ? listed : [{ version: page.version, line: '', more: 0 }, ...listed];
};
// A size as people read it
export const sizeText = (bytes) => (bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : bytes >= 1e3 ? `${Math.round(bytes / 1e3)} KB` : `${bytes} bytes`);
const gitIn = (io, folder) => (args, timeoutMs = 20000) => io
    .run(['env', 'GIT_TERMINAL_PROMPT=0', 'GIT_ASKPASS=true', 'GIT_SSH_COMMAND=ssh -o BatchMode=yes', 'git', '-C', folder, ...args], timeoutMs)
    .catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }));
const lastLine = (out) => `${out.stderr || out.stdout}`.trim().split(/[\r\n]/).at(-1)?.trim().replace(/^(fatal|error): /, '').slice(0, 140) ?? '';
export const folderReady = async (io, folder) => {
    const git = gitIn(io, folder);
    if ((await git(['rev-parse', '--show-toplevel'])).exitCode !== 0)
        return { ok: false, what: "Claudopus code that Update can't change", why: "it isn't Claudopus's released code" };
    if ((await git(['ls-files', '--error-unmatch', ':/mods/claudopus/.claude-plugin/plugin.json'])).exitCode !== 0)
        return { ok: false, what: "Claudopus code that Update can't change", why: "it is part of another project's code" };
    const [gitDir = '', commonDir = ''] = (await git(['rev-parse', '--path-format=absolute', '--git-dir', '--git-common-dir'])).stdout.trim().split('\n');
    // Names as plain words of a bounded length: they are shown in the panel
    const named = (text) => text.replace(/[^\w./-]/g, '').slice(0, 40);
    const branch = named((await git(['symbolic-ref', '-q', '--short', 'HEAD'])).stdout.trim());
    if (gitDir.trim() !== commonDir.trim())
        return { ok: false, what: 'a build of Claudopus that a task is changing', why: 'Update leaves it alone; it gets the newest version when that task merges it in' };
    if (!branch)
        return { ok: false, what: 'a test build of Claudopus', why: 'Update leaves it alone' };
    const upstream = named((await git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])).stdout.trim());
    if (branch !== 'main' || !/^[^/]+\/main$/.test(upstream))
        return { ok: false, what: 'a test build of Claudopus', why: 'Update leaves it alone' };
    return { ok: true, branch, upstream };
};
export const FAILS = {
    page: "claudopus.ai's version page couldn't be read",
    unchecked: 'the version page has nothing to check the new version against',
    fetch: "the release couldn't be downloaded from GitHub",
    mismatch: "what was downloaded isn't what the release published, so it was thrown away",
    'own-commits': "your copy of Claudopus has changes of its own that this version doesn't have, so Update leaves it as it is",
    overwrite: 'your copy of Claudopus has changes of its own in files this version changes, so updating would lose them: ask a chat to set them aside, then press Try again',
    moved: "it couldn't be put in place",
    install: "Claude Code's update step failed",
    'installed-mismatch': "the copy Claude Code installed isn't what the release published, so the old one was put back",
    'newer-out': 'a newer version came out since this one was downloaded',
    stopped: 'it stopped before it finished, when its chat closed or reloaded',
    busy: 'another chat is updating Claudopus right now',
    gone: 'the download is no longer there',
    'kept-copy': "changes of your own kept Claude Code's copy on the old version: ask a chat to set them aside, then press Try again",
};
export const stepsOf = (text) => {
    try {
        const v = JSON.parse(text);
        const stages = ['downloading', 'downloaded', 'installing', 'installed', 'failed'];
        if (!isVersion(v?.version) || !stages.includes(v.stage) || typeof v.at !== 'number')
            return undefined;
        const commit = typeof v.commit === 'string' && /^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(v.commit) ? v.commit : undefined;
        const fail = typeof v.fail === 'string' && v.fail in FAILS ? v.fail : undefined;
        const num = (n, most) => (typeof n === 'number' && Number.isFinite(n) ? Math.max(0, Math.min(most, n)) : undefined);
        return {
            version: v.version,
            stage: v.stage,
            at: v.at,
            ...(commit ? { commit } : {}),
            ...(isTree(v.tree) ? { tree: v.tree } : {}),
            ...(fail ? { fail } : {}),
            ...(v.step === 'download' || v.step === 'install' ? { step: v.step } : {}),
            ...(num(v.pct, 100) !== undefined ? { pct: num(v.pct, 100) } : {}),
            ...(num(v.got, 1e10) !== undefined ? { got: num(v.got, 1e10) } : {}),
            ...(isVersion(v.from) ? { from: v.from } : {}),
        };
    }
    catch {
        return undefined;
    }
};
// A step under way that has said nothing for this long has stopped: its chat closed or reloaded mid-way
export const STEP_STALE = 90000;
// git's own progress as a download comes: the percent of what it receives and how much so far, then of resolving what came
export const fetchProgress = (said) => {
    const lines = said.split(/[\r\n]+/).filter(Boolean);
    for (const line of lines.reverse()) {
        const got = /Receiving objects:\s+(\d{1,3})%[^,]*(?:,\s+([\d.]+)\s+(KiB|MiB|GiB|bytes))?/.exec(line);
        if (got) {
            const n = Number(got[2] ?? 0);
            const unit = { bytes: 1, KiB: 1024, MiB: 1024 ** 2, GiB: 1024 ** 3 }[(got[3] ?? 'bytes')] ?? 1;
            return { pct: Math.min(100, Number(got[1])), got: Math.round(n * unit), phase: 'receiving' };
        }
        const resolving = /Resolving deltas:\s+(\d{1,3})%/.exec(line);
        if (resolving)
            return { pct: Math.min(100, Number(resolving[1])), got: 0, phase: 'resolving' };
    }
    return undefined;
};
// git's fingerprint of a folder as it is on disk, every file counted, whatever ignore files in it say (a folder that ignores itself
// would otherwise hide what it holds), but for what the engine itself makes in each copy it keeps: its `.in_use` and
// `.orphaned_at` marks and the types it writes in `.claude-plugin/types`. So a copy Claude Code installed is compared with the
// release's `tree` file for file
export const TREE_OF_FOLDER = 'd=$(mktemp -d) || exit 1; trap \'rm -rf "$d"\' EXIT; git init -q --bare "$d/g" || exit 1; ' +
    'GIT_DIR="$d/g" GIT_INDEX_FILE="$d/i" GIT_WORK_TREE="$1" git -C "$1" -c core.excludesFile=/dev/null add -A -f -- . ":(exclude).in_use" ":(exclude).orphaned_at" ":(exclude).claude-plugin/types" >/dev/null 2>&1 || exit 1; ' +
    'GIT_DIR="$d/g" GIT_INDEX_FILE="$d/i" GIT_WORK_TREE="$1" git -C "$1" write-tree';
export const treeOfFolder = async (io, folder) => {
    const out = await io.run(['sh', '-c', TREE_OF_FOLDER, 'sh', folder], 60000).catch(() => ({ exitCode: 1, stdout: '', stderr: '' }));
    const tree = out.exitCode === 0 ? out.stdout.trim() : '';
    return isTree(tree) ? tree : '';
};
// The ref a download is kept under in the repo's git, apart from its branches and tags, so nothing the person has is touched
export const DOWNLOAD_REF = 'refs/claudopus/update';
export const download = async (io, src, page, progressFile, onProgress) => {
    const git = gitIn(io, src.repo);
    const tag = `v${page.version}`;
    const fetching = io
        .run(['sh', '-c', '"$@" 2>"$0"', progressFile, 'env', 'GIT_TERMINAL_PROMPT=0', 'GIT_ASKPASS=true', 'GIT_SSH_COMMAND=ssh -o BatchMode=yes', 'git', '-C', src.repo, 'fetch', '--progress', '--no-tags', '--no-write-fetch-head', 'origin', `+refs/tags/${tag}:${DOWNLOAD_REF}`], 600000)
        .catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }));
    let isDone = false;
    void fetching.then(() => (isDone = true));
    while (!isDone && io.wait) {
        await Promise.race([fetching, io.wait(700)]);
        const p = fetchProgress(await io.read(progressFile).catch(() => ''));
        if (p && !isDone)
            await onProgress?.(p);
    }
    const fetched = await fetching;
    const said = await io.read(progressFile).catch(() => '');
    if (fetched.exitCode !== 0)
        return { ok: false, fail: 'fetch', detail: lastLine({ stdout: '', stderr: said || fetched.stderr }) };
    await onProgress?.({ pct: 100, got: fetchProgress(said)?.got ?? 0, phase: 'checking' });
    const commit = (await git(['rev-parse', '--verify', '-q', `${DOWNLOAD_REF}^{commit}`])).stdout.trim();
    const tree = commit ? (await git(['rev-parse', '--verify', '-q', `${commit}:${src.sub}`])).stdout.trim() : '';
    const manifest = commit ? (await git(['show', `${commit}:${src.sub}/.claude-plugin/plugin.json`])).stdout : '';
    if (!commit || tree !== page.tree || versionIn(manifest) !== page.version) {
        await git(['update-ref', '-d', DOWNLOAD_REF]);
        await io.log(`Claudopus ${page.version} download thrown away: its folder is ${tree || 'missing'}, the release published ${page.tree}`);
        return { ok: false, fail: 'mismatch', detail: '' };
    }
    if (src.kind === 'folder' && (await git(['merge-base', '--is-ancestor', 'HEAD', commit])).exitCode !== 0)
        return { ok: false, fail: 'own-commits', detail: '' };
    await io.log(`Claudopus ${page.version} downloaded into ${src.repo} and checked: it is the tree the release published (${page.tree})`);
    return { ok: true, commit };
};
export const install = async (io, src, page, commit, engine) => {
    const git = gitIn(io, src.repo);
    // The commit is the one this repo's download ref holds, and the release's own tag online, whatever a file said: its whole tree is
    // what a folder moves to, not only the mod's part of it
    const held = (await git(['rev-parse', '--verify', '-q', `${DOWNLOAD_REF}^{commit}`])).stdout.trim();
    if (!held || held !== commit)
        return { ok: false, fail: 'gone', detail: '' };
    const tree = (await git(['rev-parse', '--verify', '-q', `${commit}:${src.sub}`])).stdout.trim();
    if (!tree)
        return { ok: false, fail: 'gone', detail: '' };
    if (tree !== page.tree)
        return { ok: false, fail: 'mismatch', detail: '' };
    const tagged = (await git(['ls-remote', 'origin', `refs/tags/v${page.version}^{}`, `refs/tags/v${page.version}`], 60000)).stdout;
    const tagCommit = (tagged.split('\n').find(one => one.endsWith('^{}')) ?? tagged.split('\n')[0] ?? '').split(/\s/)[0] ?? '';
    if (!tagCommit)
        return { ok: false, fail: 'fetch', detail: 'GitHub did not answer' };
    if (tagCommit !== commit)
        return { ok: false, fail: 'mismatch', detail: '' };
    const record = src.kind === 'clone' ? src : src.record;
    // Claude Code's steps, then what they installed checked; a copy that isn't the release has its record put back
    const viaClaudeCode = async (rec) => {
        const path = `${rec.plugins}/installed_plugins.json`;
        const before = await io.read(path).catch(() => '');
        const id = `${rec.plugin}@${rec.marketplace}`;
        for (const step of updateSteps(engine, rec, rec.scope)) {
            const out = await io.run(step, 300000).catch(err => ({ exitCode: -1, stdout: '', stderr: String(err) }));
            if (out.exitCode !== 0)
                return { ok: false, fail: 'install', detail: lastLine(out) };
        }
        // The entry at the scope the update ran at, which must now name this version
        const text = await io.read(path).catch(() => '');
        const copy = (() => {
            try {
                const entries = (JSON.parse(text)?.plugins?.[id] ?? []);
                return entries.find(one => (one?.scope ?? 'user') === (rec.scope ?? 'user'));
            }
            catch {
                return undefined;
            }
        })();
        const installPath = typeof copy?.installPath === 'string' && copy.version === page.version ? copy.installPath : '';
        const got = installPath ? await treeOfFolder(io, installPath) : '';
        if (got === page.tree)
            return undefined;
        if (before)
            await io.write(path, before);
        await io.log(`Claudopus ${page.version}: the copy Claude Code installed (${installPath || 'none'}) is ${got || 'unreadable'}, not the release's ${page.tree}; its record was put back`);
        return { ok: false, fail: 'installed-mismatch', detail: '' };
    };
    if (src.kind === 'clone') {
        // Claude Code's refresh takes whatever is newest online: only when that is still this release are its steps run
        const online = (await git(['ls-remote', 'origin', 'HEAD'], 60000)).stdout.trim().split(/\s/)[0] ?? '';
        if (!online)
            return { ok: false, fail: 'fetch', detail: 'GitHub did not answer' };
        if (online !== commit)
            return { ok: false, fail: 'newer-out', detail: '' };
        const failed = await viaClaudeCode(src);
        return failed ?? { ok: true, version: page.version, dirty: false };
    }
    const ready = await folderReady(io, src.repo);
    if (!ready.ok)
        return { ok: false, fail: 'moved', detail: ready.why };
    if ((await git(['merge-base', '--is-ancestor', 'HEAD', commit])).exitCode !== 0)
        return { ok: false, fail: 'own-commits', detail: '' };
    const merged = await git(['merge', '--ff-only', '--quiet', commit], 120000);
    if (merged.exitCode !== 0) {
        const said = `${merged.stderr}\n${merged.stdout}`;
        return /would be overwritten/.test(said) ? { ok: false, fail: 'overwrite', detail: '' } : { ok: false, fail: 'moved', detail: lastLine(merged) };
    }
    const status = await git(['status', '--porcelain', '--untracked-files=no', '--', src.sub]);
    const dirty = status.exitCode !== 0 || Boolean(status.stdout.trim());
    // An installed copy made from the folder is copied from it as it is on disk: with uncommitted changes there it is left as it was
    if (src.runs === 'copy' && dirty) {
        await io.log(`Claudopus updated to ${page.version}, but changes of your own kept Claude Code's copy as it was`);
        return { ok: false, fail: 'kept-copy', detail: '' };
    }
    await io.log(`Claudopus updated to ${page.version}${dirty ? ', with changes of your own kept' : ''}`);
    // Claude Code's record of the folder follows it, only from a folder with nothing uncommitted, as it copies the folder as it is
    if (src.record && !dirty) {
        const failed = await viaClaudeCode(src.record);
        if (failed)
            return failed;
    }
    return { ok: true, version: page.version, dirty };
};
// The marketplace a copy run from a folder belongs to, when Claude Code knows that folder as a directory marketplace: its record
// then follows the folder too, so /plugin and new installs agree with it
export const folderMarketplace = (known, root) => {
    try {
        const trim = (path = '') => path.replace(/\/+$/, '');
        const entries = Object.entries(JSON.parse(known) ?? {});
        const found = entries.find(([name, one]) => /^[\w.-]+$/.test(name) && one?.source?.source === 'directory' && one.source.path && (trim(root) === trim(one.source.path) || trim(root) === `${trim(one.source.path)}/mods/claudopus`));
        return found?.[0];
    }
    catch {
        return undefined;
    }
};
export const noticeOf = (at) => {
    const { loaded, installed, steps, now } = at;
    if (!isVersion(loaded))
        return undefined;
    const isPut = (version) => Boolean(at.later && at.later.version === version && now < at.later.until);
    // The Mac has a newer copy than this chat runs: what is left is this chat's reload
    if (isVersion(installed) && isNewer(installed, loaded))
        return isPut(installed) ? undefined : { kind: 'reload', version: installed };
    const out = [at.seen, at.page?.version].filter(isVersion).sort((a, b) => (isNewer(a, b) ? -1 : 1))[0] ?? '';
    const isOut = (version) => isNewer(version, loaded) && !(isVersion(at.skipped) && !isNewer(version, at.skipped)) && !isPut(version);
    // A step on this Mac, for a version still newer than this chat's and no older than the newest out
    if (steps && isNewer(steps.version, loaded) && !(out && isNewer(out, steps.version))) {
        const isLive = now - steps.at < STEP_STALE && now >= steps.at;
        if (steps.stage === 'downloading' || steps.stage === 'installing')
            return isLive
                ? steps.stage === 'downloading'
                    ? { kind: 'downloading', version: steps.version, pct: steps.pct, got: steps.got }
                    : { kind: 'installing', version: steps.version }
                : isPut(steps.version) ? undefined : { kind: 'failed', version: steps.version, fail: 'stopped', step: steps.stage === 'downloading' ? 'download' : 'install' };
        if (isPut(steps.version))
            return undefined;
        if (steps.stage === 'downloaded' && steps.commit)
            return { kind: 'downloaded', version: steps.version, commit: steps.commit };
        if (steps.stage === 'failed' && steps.fail)
            return { kind: 'failed', version: steps.version, fail: steps.fail, step: steps.step ?? 'download' };
    }
    if (!out || !isOut(out))
        return undefined;
    if (at.cannot)
        return { kind: 'cannot', version: out, ...at.cannot };
    const count = at.page && at.page.version === out ? missedOn(at.page, loaded).length : 1;
    return { kind: 'available', version: out, count: Math.max(1, count) };
};
// How often the look may run, as Config offers it, in hours; anything else is the hour as shipped
export const LOOK_EVERY_HOURS = [1, 6, 24, 168];
export const lookEveryOf = (hours) => (LOOK_EVERY_HOURS.includes(Number(hours)) ? Number(hours) : 1) * 3600000;
// Whether a look is due: none yet, or the last one is older than `every` (a clock moved back counts as due)
export const isUpdateDue = (stamp, now, every = UPDATE_EVERY) => !stamp || now - stamp.at >= every || now < stamp.at;
// Whether version a is newer than b, by its dotted numbers
export const isNewer = (a, b) => {
    const pa = a.split(/[.-]/).map(n => parseInt(n, 10) || 0);
    const pb = b.split(/[.-]/).map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++)
        if ((pa[i] ?? 0) !== (pb[i] ?? 0))
            return (pa[i] ?? 0) > (pb[i] ?? 0);
    return false;
};
export const stampOf = (text) => {
    try {
        const v = JSON.parse(text);
        return typeof v?.at === 'number' ? { at: v.at, version: String(v.version ?? ''), result: String(v.result ?? '') } : undefined;
    }
    catch {
        return undefined;
    }
};
