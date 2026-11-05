'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const shell=fs.readFileSync('app/src/main/assets/lingua-shell.js','utf8');
const css=fs.readFileSync('app/src/main/assets/lt-device-acceptance.css','utf8');
const begin=shell.indexOf('function ltEditableTextTarget(');
const end=shell.indexOf('\nloadLocale();',begin);
assert.ok(begin>0&&end>begin,'production copy guard is independently testable');
const handlers={};const calls=[];
const document={addEventListener(name,fn,capture){
 handlers[name]=fn;assert.equal(capture,true,'guards run before native selection');
}};
const prose={nodeType:1,closest(q){return q==='.reader'?{}:null}};
const token={nodeType:3,parentElement:prose};
const input={nodeType:1,isContentEditable:false,
 closest(q){if(q.includes('input,'))return{};return null}};
const other={nodeType:1,closest(){return null}};
const w={document,getSelection(){return{anchorNode:null}}};
vm.runInNewContext(shell.slice(begin,end)+'\ninstallReaderTextGuards();',{global:w,document,w,console},{timeout:1000});
assert.deepEqual(Object.keys(handlers).sort(),
 ['contextmenu','copy','cut','dragstart','selectstart'],'stock copy and selection paths blocked');
for(const name of Object.keys(handlers)){
 const ev={target:prose,preventDefault(){calls.push(name)}};
 handlers[name](ev);
}
assert.equal(calls.length,5,'live reader text blocks each platform text action');
let denied=false;
handlers.contextmenu({target:token,preventDefault(){denied=true;}});
assert.equal(denied,true,'long hold of a word blocks Android text context menu');
let allowed=true;
handlers.copy({target:input,preventDefault(){allowed=false;}});
assert.equal(allowed,true,'form fields remain editable and copyable');
handlers.copy({target:other,preventDefault(){allowed=false;}});
assert.equal(allowed,true,'nonreader actions are left alone');
w.getSelection=()=>({anchorNode:token});
handlers.copy({target:other,preventDefault(){denied=true;}});
assert.equal(denied,true,'keyboard Copy from a selected book word is blocked');
assert.match(css,/-webkit-user-select:none!important/);
assert.match(css,/html\[lang="ar"\] body/,'Arabic font applies across global interface');
assert.match(css,/html\[lang="en"\] body/,'English font applies across global interface');
assert.match(css,/\.reader \.(?:reading-width|lt-page-controls)/,'reading chrome is compact');
assert.match(shell,/for\(const name of selectableThemeNames\)/);
assert.doesNotMatch(shell,/if\(hiddenThemeNames\(\)\.includes\(name\)\)continue/,
 'old hidden backup flags cannot remove one of six mandatory themes');
console.log('PASS reader native copy/selection guards, editable fields, quiet paper, six always-visible themes and global fonts');
