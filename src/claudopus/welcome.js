"use strict";
// First run: the welcome at the top of the panel, and indexing old chats
let isWelcomeOpen = false;
// Decided at a session's start: a new person (no index.md yet) gets the welcome, which stays through reloads of that session
// and is put away when the next session starts or a button on it is pressed; anyone already set up never sees it
const welcomeAt = (isNew, stored, sessionId) => {
    if (isNew)
        return { shownIn: sessionId, isOpen: true };
    if (!stored?.isOpen)
        return stored;
    return stored.shownIn === sessionId ? stored : { ...stored, isOpen: false };
};
const readWelcome = ($) => readOr($, `${dir}/welcome.json`)
    .then(text => (text ? JSON.parse(text) : undefined))
    .catch(() => undefined);
const settleWelcome = async ($, isNew, sessionId) => {
    const stored = await readWelcome($);
    const next = welcomeAt(isNew, stored, sessionId);
    if (next && JSON.stringify(next) !== JSON.stringify(stored))
        await $.fs.write(`${dir}/welcome.json`, `${JSON.stringify(next)}\n`);
    isWelcomeOpen = Boolean(next?.isOpen);
};
const closeWelcome = async ($) => {
    isWelcomeOpen = false;
    presses += 1;
    const stored = await readWelcome($);
    await $.fs.write(`${dir}/welcome.json`, `${JSON.stringify({ shownIn: stored?.shownIn ?? '', isOpen: false })}\n`);
    await redraw($);
};
// What the chat is sent when the person presses Index my old chats: the two onboarding steps the mod ships, then the subjects recorded
const indexAsk = (root) => [
    'Bring in my old chats (pressed in the Claudopus panel).',
    `Run python3 "${root}/onboard/extract.py" "${dir}/onboard": it writes digests of your past chats, one or more per project, into ${dir}/onboard (Claudopus saves each chat's words under ${dir}/words itself).`,
    'If python3 is missing (macOS asks to install the Command Line Tools), say so with the command xcode-select --install and stop.',
    `Then for each digest file it wrote, have a helper follow ${root}/onboard/reader.md on it, writing its streams to ${dir}/onboard/streams/<the digest's file name>.`,
    'Last, record each stream found as a topic with the `update` tool (its name, folder, state and summary, and its section as `brief`), and list the topics you found in a few lines.',
].join(' ');
const indexOldChats = async ($) => {
    await closeWelcome($);
    await sendForPerson($, indexAsk($.plugin.root));
};
const welcomeCard = ($, ui) => (<ui.Box key="welcome" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Text bold wrap="wrap">Welcome to Claudopus</ui.Text>
    <ui.Text wrap="wrap">Each message you send in a chat starts a background task, and its card shows here while it runs.</ui.Text>
    <ui.Text wrap="wrap">Closed this panel? Type /claudopus to bring it back.</ui.Text>
    <ui.Text bold wrap="wrap">Bring in your old chats</ui.Text>
    <ui.Text wrap="wrap">Claudopus can read your past Claude Code chats on {thisMac()} into Memory, so it knows what you work on. A task does it in a few minutes.</ui.Text>
    <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
      <ui.Button key={`welcome-index-${presses}`} label="Bring in old chats" onPress={() => void indexOldChats($).catch(err => log($, `old chats not indexed: ${String(err)}`))}/>
      <ui.Button key={`welcome-later-${presses}`} label="Not now" plain dimColor onPress={() => void closeWelcome($).catch(err => log($, `welcome not put away: ${String(err)}`))}/>
    </ui.Box>
  </ui.Box>);
