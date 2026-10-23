'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'app/src/main/assets/data-backup.js'),'utf8');
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
const kt=fs.readFileSync(path.join(root,'app/src/main/java/com/storylens/reader/MainActivity.kt'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/data-backup.css'),'utf8');
const store=new Map();
const storage={
 get length(){return store.size},
 key:i=>[...store.keys()][i]??null,
 getItem:key=>store.has(key)?store.get(key):null,
 setItem:(key,value)=>store.set(key,String(value)),
 removeItem:key=>store.delete(key)
};
const sandbox={window:{},localStorage:storage,document:{querySelector:()=>null},
 library:()=>{},console};
vm.runInNewContext(src,sandbox,{filename:'data-backup.js',timeout:5000});
const api=sandbox.window.StoryLensBackup;assert.ok(api);
storage.setItem('storylens_saved',JSON.stringify(['reached','break the ice']));
storage.setItem('storylens_cards',JSON.stringify([{term:'break the ice',sentence:'He broke the ice.',meaning:'كسر التوتر'}]));
storage.setItem('storylens_favorites',JSON.stringify(['eleven-minute-alibi']));
storage.setItem('storylens_chapter_eleven-minute-alibi','1');
storage.setItem('personal_secret','"should not be exported"');
const backup=api.exportObject();
const json=JSON.parse(backup);
assert.equal(json.format,'storylens.backup');assert.equal(json.version,1);
assert.equal(Object.keys(json.entries).length,4);
assert.equal(json.entries.personal_secret,undefined);
const preview=api.preview(backup);assert.equal(preview.stats.words,2);
assert.equal(preview.stats.cards,1);assert.equal(preview.stats.favorites,1);
store.delete('storylens_saved');store.delete('storylens_cards');
assert.equal(api.restore(preview.entries),4);
assert.deepEqual(JSON.parse(storage.getItem('storylens_saved')),['reached','break the ice']);
assert.equal(store.has('personal_secret'),true,'unrelated personal storage untouched');
storage.setItem('storylens_fontArabic','"naskh"');
storage.setItem('storylens_fontEnglish','"sans"');
const fontBackup=JSON.parse(api.exportObject());
assert.equal(JSON.parse(fontBackup.entries.storylens_fontArabic),'naskh');
assert.equal(JSON.parse(fontBackup.entries.storylens_fontEnglish),'sans');
assert.throws(()=>api.parseBackup(JSON.stringify({format:'storylens.backup',version:1,
 entries:{'storylens_fontArabic':'"url(https://bad.example)"'}})),/نوع/);

assert.throws(()=>api.parseBackup('not valid JSON'),/JSON/i);
assert.throws(()=>api.parseBackup('{"format":"no","version":1,"entries":{}}'),/صيغة/);
assert.throws(()=>api.parseBackup(JSON.stringify({format:'storylens.backup',version:1,entries:{'evil':'"x"'}})),/مفتاح/);
assert.throws(()=>api.parseBackup(JSON.stringify({format:'storylens.backup',version:1,entries:{'storylens_saved':'"invalid type"'}})),/نوع/);
assert.throws(()=>api.parseBackup(JSON.stringify({format:'storylens.backup',version:1,entries:{'storylens_chapter_demo':'-1'}})),/نوع/);
assert.ok(html.includes('src="data-backup.js"')&&html.includes('href="data-backup.css"'));
assert.ok(kt.includes('ActivityResultContracts.CreateDocument')&&kt.includes('ActivityResultContracts.OpenDocument'));
assert.ok(kt.includes('addJavascriptInterface(OfflineBackupBridge(), "StoryLensNative")'));
assert.ok(kt.includes('JSONObject.quote(data)'),'native callback escapes JSON');
assert.ok(kt.includes('maxBackupBytes'),'files bounded');
assert.ok(css.includes('.stl-backup-confirm'),'confirmation styled');
console.log('PASS: offline JSON schema, restore, rollback data preservation, unsafe-input rejection, native SAF bridge and styles');
