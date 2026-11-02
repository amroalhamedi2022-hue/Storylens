'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'docs/literature/staging/the-sign-of-the-four');
const m=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
assert.equal(m.id,'doyle-sign-of-the-four-1890');
assert.equal(m.originalLanguage,'en');assert.equal(m.originalPublicationYear,1890);
assert.equal(m.source.upstreamCommit,'25466e1b77a718b0ad1d427fdad57642ec0bd9ca');
assert.equal(m.completeOriginalSource,true);
assert.equal(m.publishable,false);assert.equal(m.status,'SOURCE_STAGED_EDITORIAL_HOLD');
for(const gate of ['completeArabicCompanion','contextualArabicEditorialReview','historicChapterArtCleared','territoryRightsReviewed','offlineDeviceVerified'])
 assert.equal(m.acceptance[gate],false,'Source staging cannot approve '+gate);
assert.equal(m.originalChapters.length,12);
assert.deepEqual(m.originalChapters.map(c=>c.number),Array.from({length:12},(_,i)=>i+1));
let total=0,words=0;
for(const item of m.originalChapters){
 assert.equal(item.file,'chapter-'+item.number+'.xhtml');
 const bytes=fs.readFileSync(path.join(folder,item.file));
 assert.equal(bytes.length,item.bytes,'Source byte count changed: '+item.file);
 const sha=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(sha,item.upstreamGitBlobSha,'Pinned original Git blob changed: '+item.file);
 const doc=bytes.toString('utf8');
 assert.ok(doc.includes('<section id="chapter-'+item.number+'"')&&doc.includes('</section>')&&doc.includes('</html>')&&doc.includes('<p>'),
  'Authentic chapter is incomplete: '+item.file);
 total+=bytes.length;
 words+=(doc.replace(/<[^>]+>/g,' ').match(/\b[\w’'-]+\b/g)||[]).length;
}
assert.ok(total>240000,'Original novel unexpectedly truncated');
assert.ok(words>20000,'Original novel appears shortened');
assert.match(fs.readFileSync(path.join(folder,'SOURCE_LICENSE.md'),'utf8'),/CC0 1\.0 Universal Public Domain Dedication/);
assert.ok(!fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8').includes(m.id),
 'Never ship source-only novel as a complete bilingual app book');
console.log('PASS: all 12 unmodified The Sign of the Four English source chapters, exact hashes, unpublished rights/translation gates');
