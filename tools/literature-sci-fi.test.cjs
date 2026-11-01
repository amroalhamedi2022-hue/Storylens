'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'docs/literature/staging/the-lost-world');
const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
a.equal(m.originalLanguage,'en');a.equal(m.originalPublicationYear,1912);
a.equal(m.source.upstreamCommit,'77cda24ba881969982a09063e9f6c7651d87a728');
a.equal(m.publishable,false);a.equal(m.completeOriginalSource,true);
for(const gate of ['completeArabicCompanion','contextualArabicEditorialReview','historicChapterArtCleared','territoryRightsReviewed','offlineDeviceVerified'])a.equal(m.acceptance[gate],false);
a.equal(m.originalChapters.length,16);
a.deepEqual(m.originalChapters.map(x=>x.number),Array.from({length:16},(_,i)=>i+1));
let total=0;
for(const item of m.originalChapters){
 a.equal(item.file,'chapter-'+item.number+'.xhtml');
 const bytes=fs.readFileSync(path.join(dir,item.file));
 total+=bytes.length;
 a.equal(bytes.length,item.bytes,'Wrong source size: '+item.file);
 const hash=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 a.equal(hash,item.upstreamGitBlobSha,'Original upstream hash mismatch: '+item.file);
 const xml=bytes.toString('utf8');
 a.ok(xml.includes('<section ')&&xml.includes('</section>')&&xml.includes('</html>')&&xml.includes('<p>'),'Incomplete chapter '+item.file);
}
a.ok(total>400000,'Full science/adventure original unexpectedly truncated');
a.match(fs.readFileSync(path.join(dir,'SOURCE_LICENSE.md'),'utf8'),/CC0 1\.0 Universal Public Domain Dedication/);
a.ok(!fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8').includes(m.id),'Do not ship without full natural AR translation');
console.log('PASS: 16 exact unchanged historical The Lost World chapters; rights, period art, Arabic companion gates remain closed');
