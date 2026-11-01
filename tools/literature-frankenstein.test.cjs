'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'docs/literature/staging/frankenstein');
const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
assert.equal(m.id,'mary-shelley-frankenstein-1818');
assert.equal(m.source.upstreamCommit,'3909a2b9d956377e797e235562cd237d3667fa9b');
assert.equal(m.originalLanguage,'en');
assert.equal(m.publishable,false);
assert.equal(m.completeOriginalSource,true);
assert.equal(m.narrativeParts.length,28);
assert.deepEqual(m.narrativeParts.slice(0,4).map(x=>x.file),Array.from({length:4},(_,i)=>'letter-'+(i+1)+'.xhtml'));
assert.deepEqual(m.narrativeParts.slice(4).map(x=>x.file),Array.from({length:24},(_,i)=>'chapter-'+(i+1)+'.xhtml'));
for(const val of Object.values(m.acceptance))assert.equal(val,false,'Premature release gate');
let total=0;
for(const item of m.narrativeParts){
 const data=fs.readFileSync(path.join(dir,item.file));total+=data.length;
 assert.equal(data.length,item.bytes,item.file+' size mismatch');
 const sha=crypto.createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');
 assert.equal(sha,item.upstreamGitBlobSha,item.file+' source altered');
 const xml=data.toString('utf8');
 assert.ok(xml.includes('<section')&&xml.includes('</html>')&&xml.includes('<p'),item.file+' incomplete');
}
assert.ok(total>300000,'Unexpectedly incomplete source');
assert.ok(!fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8').includes(m.id),'Do not ship source-only title as bilingual novel');
console.log('PASS: all 4 letters + 24 authentic Frankenstein chapters, exact upstream hashes, release gates closed');
