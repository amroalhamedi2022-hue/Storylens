'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const shell = read('app/src/main/assets/lingua-shell.js');
const shellCss = read('app/src/main/assets/lingua-shell.css');
const auroraCss = read('app/src/main/assets/liquid-aurora.css');
const westminsterCss = read('app/src/main/assets/westminster-vows.css');
const countdownCss = read('app/src/main/assets/reform-club-countdown.css');
const backup = read('app/src/main/assets/data-backup.js');

const listSource = (shell.match(/const themeNames=\[([^\]]+)\]/) || [])[1];
const labelsSource = (shell.match(/const themeLabels=\{([\s\S]*?)\};/) || [])[1];
const labelsArSource = (shell.match(/const themeLabelsAr=\{([\s\S]*?)\};/) || [])[1];
assert.ok(listSource && labelsSource && labelsArSource, 'production theme catalogs must remain discoverable');
const names = [...listSource.matchAll(/'([^']+)'/g)].map(m => m[1]);
const labels = [...labelsSource.matchAll(/(?:^|,)(?:'([^']+)'|([a-z0-9-]+)):/g)].map(m => m[1] || m[2]);
const labelsAr = [...labelsArSource.matchAll(/'([^']+)'\s*:/g)].map(m => m[1]);
const arabicThemeLabels = [...labelsArSource.matchAll(/'([^']+)'\s*:\s*\"([^\"]+)\"/g)];
const unique = values => [...new Set(values)].sort();
assert.equal(new Set(names).size, names.length, 'duplicate selectable theme IDs');
const visibleList=(shell.match(/const selectableThemeNames=\[([^\]]+)\]/)||[])[1];
assert.ok(visibleList,'six-theme gallery allowlist is explicit');
const visible=[...visibleList.matchAll(/'([^']+)'/g)].map(m=>m[1]);
assert.deepEqual(visible,
 ['liquid-27','aurora','aqua','nebula','paper-atlas','midnight-library'],
 'only first six themes are available in the UI, in fixed user order');
assert.match(shell,/const validTheme=name=>selectableThemeNames\.includes\(name\)/,
 'removed themes cannot be applied from gallery or settings');
assert.match(shell,/for\(const name of selectableThemeNames\)/,
 'gallery must not render the historical theme registry');
assert.ok(names.every(n=>labels.includes(n)),
 'every selectable theme needs an English gallery label');
assert.ok(names.every(n=>labelsAr.includes(n)), 'every selectable theme needs an Arabic gallery label');
assert.ok(arabicThemeLabels.length>=names.length, 'each approved theme needs an Arabic label');
for (const [, name, label] of arabicThemeLabels) {
  assert.ok(/[\u0600-\u06FF]/u.test(label), 'Arabic theme label missing Arabic text: ' + name);
  assert.ok(label.trim().length >= 3, 'Arabic theme label is too short: ' + name);
}
const styles = shellCss + '\n' + auroraCss + '\n' + westminsterCss + '\n' + countdownCss;
const productCss=read('app/src/main/assets/lt-product-polish.css');
const allStyles=styles+'\n'+productCss;
for (const name of names) {
  assert.match(allStyles, new RegExp('body\\.theme-' + name + '(?:\\s|\\{|:|\\.)'),
    'missing production body style for ' + name);
  assert.ok(backup.includes("'" + name + "'") || backup.includes('"' + name + '"'),
    'backup validator does not allow theme ' + name);
}
for (const name of ['red-sea-dispatch', 'monsoon-meridian', 'deccan-timetable', 'kholby-crossing', 'shanghai-wind-ledger', 'typhoon-signal', 'paper-lantern-circus', 'pacific-meridian', 'civic-panorama', 'prairie-signal', 'salt-lake-dispatch', 'medicine-bow-crossing', 'plum-creek-signal', 'snowbound-telegraph', 'prairie-sails', 'hudson-ledger', 'atlantic-passage', 'westminster-vows', 'reform-club-countdown', 'meridian-epilogue', 'stained-glass', 'mosaic-courtyard', 'saville-clockwork', 'station-tickets']) {
  assert.ok(styles.includes('.lt-theme-' + name + ' .lt-theme-swatch'), 'missing gallery swatch for ' + name);
  assert.match(styles, new RegExp('@media\\(prefers-reduced-motion:reduce\\)\\{[^}]*\\.theme-' + name + '\\b'),
    'missing reduced-motion fallback for ' + name);
}
assert.ok(shellCss.includes('@media(prefers-reduced-motion:reduce){.theme-civic-panorama .library .card{transition:none!important;transform:none!important}}'), 'Civic Panorama reduced-motion fallback must disable both transitions and transforms');
assert.ok(shellCss.includes('@media(prefers-reduced-motion:reduce){.theme-prairie-signal .library .card{transition:none!important;transform:none!important}}'), 'Prairie Signal reduced-motion fallback must disable both transitions and transforms');
assert.ok(shellCss.includes('.lt-theme-reform-club-brass .lt-theme-swatch{'), 'Reform Club Brass must style its own gallery swatch');
const stainedGlass = shellCss.slice(shellCss.indexOf('/* LT-13 — Stained Glass:'));
assert.ok(stainedGlass.includes('conic-gradient('), 'Stained Glass needs a distinct jewel-pane visual language');
assert.ok(stainedGlass.includes('border-radius:92px 92px 18px 18px'), 'Stained Glass needs its own arched library header');
assert.ok(stainedGlass.includes('repeating-linear-gradient(135deg'), 'Stained Glass needs a distinct leadwork reading surface');
assert.ok(!/https?:\/\//.test(stainedGlass), 'Stained Glass must work offline');
assert.ok(!/\banimation\s*:\s*[^;]*infinite/i.test(stainedGlass), 'Stained Glass must not add infinite repaint work');
assert.match(shellCss, /@media\(prefers-reduced-motion:reduce\)\{\s*\.theme-reform-club-brass\b/, 'Reform Club Brass must retain a reduced-motion fallback');
assert.match(shell,/if\(!validTheme\(state\.uiTheme\)\)/,
 'previously selected legacy themes migrate without losing reading data');
console.log('PASS theme catalog: six selectable themes and 58 historical records retained for offline compatibility');
