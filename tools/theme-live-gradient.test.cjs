'use strict';const a=require('node:assert/strict'),fs=require('node:fs'),read=p=>fs.readFileSync(p,'utf8');
const sh=read('app/src/main/assets/lingua-shell.js'),css=read('app/src/main/assets/lt-custom-gradient.css');
for(const key of ['lt-has-custom-gradient','lt-theme-live-preview','syncPreview();',"['lagoon'","['ember'"])a.ok(sh.includes(key),key);
a.match(css,/body\.lt-has-custom-gradient \.library \.shelf \.card/);
a.match(css,/body\.lt-has-custom-gradient \.lt-drawer/);
a.doesNotMatch(css,/\.reader \.lt-book-page/);
a.match(read('app/src/main/assets/index.html'),/href="lt-custom-gradient\.css"/);
console.log('PASS: real-time custom palette applied to library, drawer and live preview');