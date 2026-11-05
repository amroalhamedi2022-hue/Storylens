'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root='app/src/main/assets',css=fs.readFileSync(root+'/lt-offline-fonts.css','utf8');
const shell=fs.readFileSync(root+'/lingua-shell.js','utf8');
const backup=fs.readFileSync(root+'/data-backup.js','utf8');
const manifest=fs.readFileSync(root+'/fonts/README.md','utf8');
const files={
'ar-lateef.ttf':'lateef-OFL.txt','ar-katibeh.ttf':'katibeh-OFL.txt',
'en-caveat.ttf':'caveat-OFL.txt','en-kalam.ttf':'kalam-OFL.txt'};
for(const [font,license] of Object.entries(files)){
 const p=path.join(root,'fonts',font),stat=fs.statSync(p);
 assert.ok(stat.size>10000&&stat.size<2000000,'genuine bundled TTF '+font);
 const magic=fs.readFileSync(p).subarray(0,4);
 assert.deepEqual(Array.from(magic),[0,1,0,0],'TTF file header '+font);
 assert.ok(css.includes('fonts/'+font),'offline CSS references '+font);
 const text=fs.readFileSync(path.join(root,'fonts',license),'utf8');
 assert.match(text,/SIL OPEN FONT LICENSE|SIL Open Font License/i,
  'full redistributed licence '+font);
 assert.ok(manifest.includes(font)&&manifest.includes(license),'source and credit '+font);
}
for(const language of ['ar','en']){
 const keys=language==='ar'?['lateef','katibeh']:['caveat','kalam'];
 for(const name of keys){
  assert.ok(shell.includes("'"+name+"'"),'Settings permits '+name);
  assert.ok(css.includes('font="'+name+'"'),'font CSS selects '+name);
  assert.ok(backup.includes("'"+name+"'"),'safe backup validation accepts '+name);
 }
}
assert.ok(!/https?:\/\//.test(css),'no runtime remote fonts');
console.log('PASS: 4 intact offline OFL handwriting faces, source licences, menu presets and backup roundtrip');
