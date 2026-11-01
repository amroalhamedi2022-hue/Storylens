'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'docs/literature/staging/dracula');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
assert.equal(manifest.id,'bram-stoker-dracula-1897');
assert.equal(manifest.source.upstreamCommit,'e9968b274918e5a79b8e34cc93e50492363d1612');
assert.equal(manifest.originalLanguage,'en');
assert.equal(manifest.originalPublicationYear,1897);
assert.equal(manifest.originalSourceComplete,true);
assert.equal(manifest.publishable,false);
assert.equal(manifest.narrativeParts.length,29);
assert.equal(manifest.narrativeParts[0].file,'preface.xhtml');
assert.equal(manifest.narrativeParts.at(-1).file,'epilogue.xhtml');
assert.deepEqual(manifest.narrativeParts.slice(1,28).map(x=>x.file),Array.from({length:27},(_,i)=>'chapter-'+(i+1)+'.xhtml'));
for(const [name,value] of Object.entries(manifest.acceptance))assert.equal(value,false,'Never bypass editorial release gate '+name);
let total=0;
for(const item of manifest.narrativeParts){
 const bytes=fs.readFileSync(path.join(dir,item.file));total+=bytes.length;
 assert.equal(bytes.length,item.bytes,'Original upstream bytes changed: '+item.file);
 const sha=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(sha,item.upstreamGitBlobSha,'Git source hash changed: '+item.file);
 const text=bytes.toString('utf8');
 assert.ok(text.includes('<section')&&text.includes('</html>')&&text.includes('<p>'),'Truncated narrative XHTML: '+item.file);
}
assert.ok(total>850000,'Historical 27-chapter novel unexpectedly short');
assert.match(fs.readFileSync(path.join(dir,'SOURCE_LICENSE.md'),'utf8'),/CC0 1\.0 Universal Public Domain Dedication/);
assert.ok(!fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8').includes(manifest.id),'Untranslated title wrongly published as bilingual novel');
console.log('PASS: original Dracula preface, 27 full chapters and epilogue, exact 29 SHA and size checks; AR and rights gates closed');
