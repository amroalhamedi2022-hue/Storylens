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
assert.deepEqual(unique(names), unique(labels), 'every selectable theme needs an English gallery label');
assert.deepEqual(unique(names), unique(labelsAr), 'every selectable theme needs an Arabic gallery label');
assert.equal(arabicThemeLabels.length, names.length, 'each theme needs exactly one Arabic label');
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
console.log('PASS theme catalog: ' + names.length + ' selectable themes have labels, production body styles and backup allowlist; routed themes have swatches and reduced-motion fallbacks.');
