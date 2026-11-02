'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const repo=path.resolve(__dirname,'..');
const folder=path.join(repo,'docs/literature/staging/the-hound-of-the-baskervilles');
const m=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
assert.equal(m.id,'doyle-hound-of-the-baskervilles-1902');
assert.equal(m.originalLanguage,'en');
assert.equal(m.originalPublicationYear,1902);
assert.equal(m.source.upstreamCommit,'0097160e42afc58fa86337b8496de440267cf831');
assert.equal(m.completeOriginalSource,true);
assert.equal(m.publishable,false);
assert.equal(m.status,'SOURCE_STAGED_EDITORIAL_HOLD');
for(const gate of ['completeArabicCompanion','contextualArabicEditorialReview',
 'historicChapterArtCleared','territoryRightsReviewed','offlineDeviceVerified'])
 assert.equal(m.acceptance[gate],false,'Do not silently waive '+gate);
assert.equal(m.originalChapters.length,15);
assert.deepEqual(m.originalChapters.map(x=>x.number),Array.from({length:15},(_,i)=>i+1));
let bytesTotal=0,wordTotal=0;
for(const x of m.originalChapters){
 assert.equal(x.file,'chapter-'+x.number+'.xhtml');
 const bytes=fs.readFileSync(path.join(folder,x.file));
 assert.equal(bytes.length,x.bytes,'Original source length changed: '+x.file);
 const sha=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(sha,x.upstreamGitBlobSha,'Upstream source was rewritten: '+x.file);
 const prose=bytes.toString('utf8');
 assert.ok(prose.includes('<section id="chapter-'+x.number+'"')&&
  prose.includes('</section>')&&prose.includes('</html>')&&prose.includes('<p>'),
  'Missing authentic complete chapter source: '+x.file);
 bytesTotal+=bytes.length;
 wordTotal+=(prose.replace(/<[^>]+>/g,' ').match(/\b[\w’'-]+\b/g)||[]).length;
}
assert.ok(bytesTotal>350000,'Original long novel unexpectedly truncated');
assert.ok(wordTotal>30000,'Full historical work unexpectedly replaced with excerpts');
assert.match(fs.readFileSync(path.join(folder,'SOURCE_LICENSE.md'),'utf8'),
 /CC0 1\.0 Universal Public Domain Dedication/);
const assets=fs.readFileSync(path.join(repo,'app/src/main/assets/index.html'),'utf8');
assert.ok(!assets.includes(m.id),'Incomplete Arabic translation may not be shown as a finished novel');
console.log('PASS: 15/15 original Hound of the Baskervilles source chapters, exact upstream Git hashes, unshipped editorial gates');
