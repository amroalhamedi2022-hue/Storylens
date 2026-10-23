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
// Exports must never produce an archive that the importer refuses (>900 keys).
for(let i=0;i<901;i++)storage.setItem('storylens_chapter_test-'+i,'0');
assert.throws(()=>api.exportObject(),/عدد عناصر/);
for(let i=0;i<901;i++)storage.removeItem('storylens_chapter_test-'+i);
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


// LT-06/LT-12: run the real backup dialog and confirmed import in a bilingual
// fake DOM. Imported locale/fonts must apply immediately without a restart.
{
 const data=new Map(), elements=new Map(), applied=[];
 const element=()=>({innerHTML:'',textContent:'',value:'',children:[],events:{},attributes:{},
  setAttribute(name,value){this.attributes[name]=value;},
  addEventListener(type,handler){this.events[type]=handler;},
  appendChild(child){this.children.push(child);},focus(){},select(){},remove(){}});
 const doc={documentElement:{lang:'en'},body:{className:'',appendChild(){}},
  getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},
  createElement:()=>element(),querySelector:selector=>selector==='.library-actions'?elements.get('library-actions'):null};
 elements.set('library-actions',element());
 const local={get length(){return data.size},key:i=>[...data.keys()][i],
  getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 const window={scrollTo(){},LinguaShell:{
  applyLocale(value){applied.push(['locale',value]);doc.documentElement.lang=value;return true;},
  applyFont(lang,value){applied.push([lang,value]);return true;}
 }};
 const state={page:'reader',saved:[],cards:[],dark:false,size:22,uiTheme:'nebula'};
 const get=(key,fallback)=>{try{return JSON.parse(local.getItem('storylens_'+key))??fallback}catch{return fallback}};
 const domSandbox={window,localStorage:local,document:doc,library(){},get,state,
  closeSheet(){},setTimeout(){},console};
 vm.runInNewContext(src,domSandbox,{filename:'data-backup.js bilingual',timeout:5000});
 const backupApi=window.StoryLensBackup;
 const backupButton=elements.get('library-actions').children.at(-1);
 assert.equal(backupButton.textContent,'⤓ Backup');
 assert.equal(backupButton.attributes['aria-label'],'Save or restore learning data');
 backupApi.open();
 assert.match(elements.get('modals').innerHTML,/Backup & restore/);
 assert.match(elements.get('modals').innerHTML,/Export backup/);
 doc.documentElement.lang='ar';backupApi.open();
 assert.match(elements.get('modals').innerHTML,/النسخ الاحتياطي/);
 doc.documentElement.lang='en';
 const payload=JSON.stringify({format:'storylens.backup',version:1,entries:{
  storylens_uiLocale:'"en"',storylens_fontArabic:'"naskh"',storylens_fontEnglish:'"sans"'
 }});
 assert.equal(backupApi.receiveImport(payload),true);
 const confirm=elements.get('stl-backup-feedback').children.at(-1);
 assert.equal(confirm.textContent,'Yes, restore my data');
 confirm.events.click();
 assert.equal(state.page,'library');
 assert.deepEqual(applied,[['locale','en'],['ar','naskh'],['en','sans']],
  'confirmed restore immediately reapplies locale and independent fonts');
 // A newer preview must revoke an older confirmation button, even when both
 // backups are individually valid. Restore exactly the preview being confirmed.
 assert.equal(backupApi.receiveImport(payload),true);
 const staleConfirm=elements.get('stl-backup-feedback').children.at(-1);
 const replacement=JSON.stringify({format:'storylens.backup',version:1,entries:{storylens_uiLocale:'"ar"'}});
 assert.equal(backupApi.receiveImport(replacement),true);
 const currentConfirm=elements.get('stl-backup-feedback').children.at(-1);
 staleConfirm.events.click();
 assert.equal(local.getItem('storylens_uiLocale'),'"en"','stale preview did not restore');
 currentConfirm.events.click();
 assert.equal(local.getItem('storylens_uiLocale'),'"ar"','latest preview restored');
 assert.equal(elements.get('library-actions').children.at(-1).textContent,'⤓ نسخ احتياطي');
 assert.equal(backupApi.receiveImport('invalid JSON'),false,
  'bad follow-up import is rejected without restoring stale data');
}
console.log('PASS: LT-06 bilingual backup UI and immediate restored locale/fonts');
