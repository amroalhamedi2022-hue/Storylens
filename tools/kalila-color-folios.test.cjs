'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const prefix='docs/literature/staging/kalila-arabic-wikisource/';
const manifest=JSON.parse(fs.readFileSync(path.join(root,prefix,'COLOR_FOLIOS.json'),'utf8'));
const source=fs.readFileSync(path.join(root,prefix,'kalila.md'),'utf8');
assert.equal(manifest.releaseApproved,false,'no editorial/public release');
assert.equal(manifest.completeEnglishTranslation,false,'do not claim complete translation');
assert.equal(manifest.productionAppAssetCount,0,'staged images must not ship in production');
assert.equal(manifest.images.length,2,'two genuine coloured originals only');
const expected={
 453083:{file:'kalila-fox-drum-met-453083.webp',anchor:'زعموا أن ثعلباً أتى أجمةً فيها طبل معلق على شجرةٍ',digest:'83eb649377c2f98555fdb813b8f4645f7a184f72f8e86ea7a14703521e02be68',object:'1981.373.29'},
 453084:{file:'kalila-lion-ox-met-453084.webp',anchor:'ثم أقبل والثور معه، حتى دخلا على الأسد فأحسن الأسد إلى الثور وقرّبه',digest:'0faba225828042f69aaf3ceb3bd09ac11830fc992277d6a5145f390e2ad800f0',object:'1981.373.30'}
};
for(const item of manifest.images){
 const check=expected[item.objectID];
 assert.ok(check,'not an authorized Met acquisition');
 assert.equal(item.file,check.file);
 assert.equal(item.accession,check.object);
 assert.equal(item.sourceTextAnchor,check.anchor);
 assert.equal(source.split(item.sourceTextAnchor).length-1,1,'unique original Arabic scene');
 assert.equal(item.webpSha256,check.digest,'pinned verified image bytes');
 assert.match(item.sourceSha256,/^[a-f0-9]{64}$/,'actual original JPG sha');
 assert.equal(item.sceneVerifiedInStagedArabic,true);
 assert.equal(item.contextualEnglishComplete,false);
 assert.equal(item.stagingOnly,true);
 assert.equal(item.packagedInApk,false);
 assert.equal(item.visualTreatment,'original-colour');
 assert.ok(item.sourceColourfulPixelFraction>.30,'actual historical pigment, not B&W');
 assert.equal(item.alteration,'resize and WEBP encoding only; full original scan uncropped');
 assert.equal(item.width,760);assert.ok(item.height>1000);
 assert.match(item.rights,/Metropolitan Museum of Art Public Domain/);
 const file=path.join(root,prefix,'art',item.file);
 assert.ok(fs.existsSync(file),'source must be checked into staging');
 assert.ok(!fs.existsSync(path.join(root,'app/src/main/assets/art',item.file)),
  'untranslated historic source cannot appear in production APK');
 const bytes=fs.readFileSync(file);
 assert.equal(bytes.length,item.webpBytes);
 assert.ok(bytes.length<200000,'compressed color folio must remain phone friendly');
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.webpSha256);
}
const js=fs.readFileSync(path.join(root,'app/src/main/assets/reader-experience.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lt-device-acceptance.css'),'utf8');
assert.ok(js.includes("item.visualTreatment==='original-colour'"),'colour art renderer');
assert.ok(js.includes("plate.visualTreatment==='original-colour'"),'colour translated companion');
assert.ok(css.includes('.lt-archive-colour-original'),'colour safe original layout');
assert.ok(!js.includes('kalila-fox-drum-met-453083.webp'),'staged work is not a fake published volume');
console.log('PASS: two original full-colour manuscript folios independently SHA256 pinned, exact Arabic scenes, no public APK leak');
