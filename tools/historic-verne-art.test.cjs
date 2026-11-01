'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const root='app/src/main/assets/';
const manifest=JSON.parse(fs.readFileSync('docs/literature/HISTORIC_VERNES_ASSETS.json','utf8'));
const exact=[
 {chapter:2,index:27,file:'verne-route-map-1872.webp',source:'4dad34a533511ec83929a2a973cfc844a141177a'},
 {chapter:10,index:43,file:'verne-kiouni-1873.webp',source:'3e6023d89833734936fd68b8163f5b13252a1339'},
 {chapter:20,index:34,file:'verne-tankadere-1872.webp',source:'6cede9030b81f8312ace0da3aa3cfda0482328d4'},
 {chapter:4,index:1,file:'verne-news-readers-1873.webp',source:'06e996151ae69a80a4e8d61ec5427c220199dc7b'},
 {chapter:19,index:66,file:'verne-tankadere-cabin-1873.webp',source:'29162c6b1037af214d1cba85f7939365d60d3259'}
];
assert.equal(manifest.length,exact.length,'all five historical original scans');
for(const expected of exact){
 const row=manifest.find(x=>x.file===expected.file);
 assert.ok(row,'missing historic manifest '+expected.file);
 assert.equal(row.chapter,expected.chapter,'chapter metadata is source-aligned');
 assert.equal(row.expected_sha1,expected.source,'pinned Commons scan signature');
 assert.match(row.commons,/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
 const file=fs.readFileSync(root+'art/'+row.file);
 assert.equal(crypto.createHash('sha256').update(file).digest('hex'),row.webp_sha256,
  'published offline bytes cannot drift from the verified archive artifact');
 assert.equal(file.length,row.webp_bytes);
 assert.ok(file.length<270000,'keep actual art size small for the phone');
 assert.equal(file.toString('ascii',0,4),'RIFF');
 assert.equal(file.toString('ascii',8,12),'WEBP');
}
const js=fs.readFileSync(root+'reader-experience.js','utf8');
const css=fs.readFileSync(root+'lt-device-acceptance.css','utf8');
const scope=js.slice(js.indexOf('const periodArt=state.story.id==='),js.indexOf('const approvedArt=periodArt.length>0'));
assert.ok(scope.length>400&&scope.length<4000,'real production art mapping exists');
for(const row of exact){
 assert.ok(scope.includes('afterParagraph:'+row.index+',src:\'art/'+row.file+'\''),
  'scene placement uses the actual archived picture and paragraph: '+row.file);
}
assert.match(js,/const approvedArt=periodArt\.length>0\|\|curatedArt\.some/);
assert.match(js,/const inlineArt=chapterScene\?\[chapterScene,\.\.\.periodArt,\.\.\.curatedArt\]:\[\.\.\.periodArt,\.\.\.curatedArt\]/);
assert.match(css,/background-image:url\("art\/verne-kiouni-1873\.webp"\)!important/);
assert.equal((scope.match(/credit:uiText\(/g)||[]).length,5,
 'all original archive illustration credits are localized in Arabic and English');
assert.ok(!scope.includes('http:')&&!scope.includes('https:'),'art must never fetch online during reading');
const yaml=fs.readFileSync('.github/workflows/android.yml','utf8');
assert.ok(!yaml.includes('historic_art_intake:'),'one-time original downloader removed after asset commit');
assert.ok(!yaml.includes('verne_additional_art_intake:'),'second batch archive downloader removed after source verification');
console.log('PASS: five original source-era WebP assets verified by SHA-256 and mounted at exact chapter paragraphs');
