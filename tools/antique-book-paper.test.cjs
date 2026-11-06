'use strict';
// Fast, deterministic release regression: correct paper preset, no image
// cropping/filtering, no simulated art or new network dependency.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lt-antique-book.css'),'utf8');
const svg=fs.readFileSync(path.join(root,'app/src/main/assets/lt-antique-paper-grain.svg'),'utf8');
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
assert.match(html,/<link rel="stylesheet" href="lt-antique-book.css">/);
assert.match(css,/data-lt-reader-material="book"/);
for(const forbidden of ['data-lt-reader-material="white"','data-lt-reader-material="night"','filter:sepia','object-fit:cover','background-attachment:fixed','@keyframes']){
 assert.ok(!css.includes(forbidden),'unexpected alteration: '+forbidden);
}
assert.match(css,/lt-curl-book\[data-spread="2"\]/);
assert.match(css,/\.lt-archive-source-approved/);
assert.match(css,/object-fit:contain!important/);
assert.match(css,/url\("lt-antique-paper-grain\.svg"\)/);
assert.match(svg,/<feTurbulence/);
assert.ok(!/https?:\/\//.test(css),'paper styling must remain offline');
console.log('PASS archive book grain, safe art, full-colour preservation, isolated book material');
