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

// Native Android SAF callbacks must be localized without changing legacy
// backup keys or showing a success message as an error. Exercise production JS.
{
 const feedback={textContent:''};
 const doc={documentElement:{lang:'en'},
  getElementById:id=>id==='stl-backup-feedback'?feedback:null,
  querySelector:()=>null};
 const nativeWindow={};
 vm.runInNewContext(src,{window:nativeWindow,document:doc,localStorage:storage,
  library:()=>{},console},{filename:'data-backup.js native statuses',timeout:5000});
 const native=nativeWindow.StoryLensBackup;
 const expected={
  saved:'Backup saved to the selected location.',
  save_failed:'Could not save the backup. Check storage space and try again.',
  import_failed:'Could not read the backup file. Check the file and try again.',
  export_too_large:'The backup exceeds the allowed size.',
  picker_busy:'Finish or cancel the current file picker before starting another operation.'
 };
 for(const [code,label] of Object.entries(expected)){
  assert.equal(native.nativeStatus(code),true,'recognized native status '+code);
  assert.equal(feedback.textContent,label,'English native feedback '+code);
 }
 doc.documentElement.lang='ar';
 assert.equal(native.nativeStatus('saved'),true);
 assert.match(feedback.textContent,/تم حفظ النسخة الاحتياطية/);
 const previous=feedback.textContent;
 assert.equal(native.nativeStatus('unknown'),false,'unknown native event ignored');
 assert.equal(feedback.textContent,previous);
 assert.match(kt,/notifyBackup\("nativeStatus", "saved"\)/);
 assert.match(kt,/notifyBackup\("nativeStatus", "save_failed"\)/);
 assert.match(kt,/notifyBackup\("nativeStatus", "import_failed"\)/);
 assert.match(kt,/notifyBackup\("nativeStatus", "export_too_large"\)/);
 assert.match(kt,/method != "nativeStatus"/);
}

// Quota rollback must first free space occupied by imported replacements,
// then restore larger original values. Old forward-order rollback lost saved words.
{
 const initial=new Map([
  ['storylens_saved',JSON.stringify(['x'.repeat(500)])],
  ['storylens_cards','[]'],['storylens_favorites','[]']
 ]);
 const limited=new Map(initial);
 const usage=()=>[...limited].reduce((sum,[key,val])=>sum+key.length+val.length,0);
 const quota=usage()+100;
 const limitedStorage={
  get length(){return limited.size},key:i=>[...limited.keys()][i]??null,
  getItem:key=>limited.get(key)??null,
  removeItem:key=>limited.delete(key),
  setItem(key,value){
   const next=String(value);
   const size=usage()-(limited.has(key)?key.length+limited.get(key).length:0)+key.length+next.length;
   if(size>quota)throw Error('QuotaExceededError');
   limited.set(key,next);
  }
 };
 const limitedWindow={};
 vm.runInNewContext(src,{window:limitedWindow,localStorage:limitedStorage,
  document:{querySelector:()=>null},library:()=>{},console},{timeout:5000});
 assert.throws(()=>limitedWindow.StoryLensBackup.restore({
  storylens_saved:'[]',
  storylens_cards:JSON.stringify([{term:'a',meaning:'x'.repeat(490)}]),
  storylens_favorites:JSON.stringify(['z'.repeat(150)])
 }),/لم تتغير بياناتك السابقة/);
 for(const [key,value] of initial)
  assert.equal(limited.get(key),value,'quota rollback preserved '+key);
}
// UTF-8 quotas can invert rollback ordering relative to UTF-16 code-unit
// lengths (emoji vs ASCII). Free actual bytes before restoring larger values.
{
 const original=new Map([
  ['storylens_saved',JSON.stringify(['😀'.repeat(85)])],
  ['storylens_cards',JSON.stringify([{term:'x',meaning:'a'.repeat(200)}])],
  ['storylens_favorites','[]']
 ]);
 const data=new Map(original);
 const bytes=value=>Buffer.byteLength(value,'utf8');
 const used=()=>[...data].reduce((n,[key,value])=>n+bytes(key)+bytes(value),0);
 const quota=used()+100;
 const quotaStorage={
  get length(){return data.size},key:i=>[...data.keys()][i]??null,
  getItem:key=>data.get(key)??null,removeItem:key=>data.delete(key),
  setItem(key,value){
   value=String(value);
   const after=used()-(data.has(key)?bytes(key)+bytes(data.get(key)):0)+bytes(key)+bytes(value);
   if(after>quota)throw Error('QuotaExceededError');
   data.set(key,value);
  }
 };
 const win={};
 vm.runInNewContext(src,{window:win,localStorage:quotaStorage,
  document:{querySelector:()=>null},library:()=>{},console},{timeout:5000});
 assert.throws(()=>win.StoryLensBackup.restore({
  storylens_saved:JSON.stringify(['a'.repeat(180),'b'.repeat(40)]),
  storylens_cards:JSON.stringify([{term:'x',meaning:'😀'.repeat(100)}]),
  storylens_favorites:JSON.stringify(Array.from({length:8},()=> 'z'.repeat(150)))
 }),/لم تتغير بياناتك السابقة/);
 for(const [key,value] of original)assert.equal(data.get(key),value,'UTF-8 quota rollback: '+key);
}
storage.setItem('storylens_saved',JSON.stringify(['reached','break the ice']));
storage.setItem('storylens_cards',JSON.stringify([{term:'break the ice',sentence:'He broke the ice.',meaning:'كسر التوتر'}]));
storage.setItem('storylens_favorites',JSON.stringify(['eleven-minute-alibi']));
storage.setItem('storylens_chapter_eleven-minute-alibi','1');
storage.setItem('personal_secret','"should not be exported"');
// An export must fail visibly rather than silently omit an allowed key.
// Unrelated application keys remain outside the archive and cannot block it.
storage.setItem('storylens_cards','not valid JSON');
assert.throws(()=>api.exportObject(),/storylens_cards/,'corrupt cards cannot be silently dropped');
storage.setItem('storylens_cards',JSON.stringify({term:'wrong shape'}));
assert.throws(()=>api.exportObject(),/storylens_cards/,'wrong-shaped cards cannot be silently dropped');
storage.setItem('storylens_cards',JSON.stringify([{term:'broken',meaning:0}]));
assert.throws(()=>api.exportObject(),/storylens_cards/,'numeric card meaning cannot pass export');
assert.throws(()=>api.parseBackup(JSON.stringify({format:'storylens.backup',version:1,
 entries:{storylens_cards:JSON.stringify([{term:'broken',translation:false}])}})),/نوع/,
 'false optional translation cannot pass import');
storage.setItem('storylens_cards',JSON.stringify([{term:'break the ice',sentence:'He broke the ice.',meaning:'كسر التوتر'}]));
storage.setItem('storylens_chapter_corrupt','-3');
assert.throws(()=>api.exportObject(),/storylens_chapter_corrupt/,'invalid progress must block incomplete backups');
storage.removeItem('storylens_chapter_corrupt');
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
// Native SAF writes UTF-8 bytes, not JS UTF-16 characters. A multibyte
// archive must never pass export only to fail in Android's file bridge.
{
 const previous=storage.getItem('storylens_cards');
 const cjkCards=Array.from({length:120},(_,i)=>({term:'term-'+i,meaning:'漢'.repeat(4500)}));
 storage.setItem('storylens_cards',JSON.stringify(cjkCards));
 assert.throws(()=>api.exportObject(),/حجم النسخة/,'oversized UTF-8 export rejected');
 storage.setItem('storylens_cards',previous);
 assert.throws(()=>api.parseBackup('漢'.repeat(520_000)),/كبير/,'oversized UTF-8 import rejected before JSON parse');
 const arabicBackup=api.exportObject();
 assert.ok(api.parseBackup(arabicBackup).storylens_cards,'valid Arabic backup still roundtrips');
}
assert.ok(html.includes('src="data-backup.js"')&&html.includes('href="data-backup.css"'));
assert.ok(kt.includes('ActivityResultContracts.CreateDocument')&&kt.includes('ActivityResultContracts.OpenDocument'));
assert.ok(kt.includes('addJavascriptInterface(OfflineBackupBridge(), "StoryLensNative")'));
assert.ok(kt.includes('JSONObject.quote(data)'),'native callback escapes JSON');
assert.ok(kt.includes('maxBackupBytes'),'files bounded');
// Import must decode strict UTF-8, not Java's replacement-mode String decoder.
const strictUtf8=fs.readFileSync(path.join(root,'app/src/main/java/com/storylens/reader/BackupUtf8.kt'),'utf8');
const strictTest=fs.readFileSync(path.join(root,'app/src/test/java/com/storylens/reader/BackupUtf8Test.kt'),'utf8');
assert.match(kt,/BackupUtf8\.decode\(bytes\.toByteArray\(\)\)/,'SAF import uses strict decoder');
assert.match(strictUtf8,/CodingErrorAction\.REPORT/,'malformed input fails closed');
assert.match(strictUtf8,/removePrefix\("\\uFEFF"\)/,'optional UTF-8 BOM handled');
assert.match(strictTest,/malformedTruncatedOverlongAndSurrogateBytesAreRejected/,'Kotlin unit regression included');
assert.match(kt,/private var pickerInFlight = false/,'one native SAF picker at a time');
assert.equal((kt.match(/if \(pickerInFlight\)/g)||[]).length,2,'both import and export reject concurrent pickers');
assert.equal((kt.match(/pickerInFlight = false/g)||[]).length,5,'both callbacks and failed launches clear picker guard');
assert.match(kt,/pendingExport = null\s+notifyBackup\("nativeStatus", "save_failed"\)/,
 'failed export launch clears pending payload');
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


// Vocabulary text maps must be strings, never nested JSON from a corrupt
// archive. The same gate applies to export so data is not silently dropped.
{
 const backupMap=(name,value)=>JSON.stringify({format:'storylens.backup',version:1,
  entries:{['storylens_'+name]:JSON.stringify(value)}});
 assert.doesNotThrow(()=>api.parseBackup(backupMap('written_examples',{'break the ice':'He broke the ice.'})));
 assert.doesNotThrow(()=>api.parseBackup(backupMap('wordSenses',{'book\\u001f1\\u001fword':'كلمة'})));
 for(const invalid of [{term:{nested:'not text'}},{term:23},{term:null}])
  assert.throws(()=>api.parseBackup(backupMap('written_examples',invalid)),/نوع/);
 for(const invalid of [{term:['not text']},{term:false},{term:null}])
  assert.throws(()=>api.parseBackup(backupMap('wordSenses',invalid)),/نوع/);
 assert.throws(()=>api.parseBackup(backupMap('written_examples',{['x'.repeat(501)]:'text'})),/نوع/);
 assert.throws(()=>api.parseBackup(backupMap('wordSenses',{term:'x'.repeat(5001)})),/نوع/);
 const old=storage.getItem('storylens_written_examples');
 storage.setItem('storylens_written_examples',JSON.stringify({term:{nested:'bad'}}));
 assert.throws(()=>api.exportObject(),/storylens_written_examples/);
 if(old===null)storage.removeItem('storylens_written_examples');
 else storage.setItem('storylens_written_examples',old);
}
console.log('PASS: vocabulary example/sense map validation on import and export');


// SRS scheduling fields are optional for old archives, but when present must
// be finite numbers. Otherwise an imported card may never appear in Due Today.
{
 const pack=cards=>JSON.stringify({format:'storylens.backup',version:1,
  entries:{storylens_cards:JSON.stringify(cards)}});
 const valid={term:'fracture',surface:'fractures',dueAt:0,intervalDays:2,
  ease:2.5,repetitions:1,lapses:0};
 assert.doesNotThrow(()=>api.parseBackup(pack([valid])));
 assert.doesNotThrow(()=>api.parseBackup(pack([{term:'legacy',meaning:'كسر'}])),
  'old cards without SRS fields remain importable');
 for(const card of [
  {...valid,dueAt:'tomorrow'}, {...valid,dueAt:-1},
  {...valid,intervalDays:'2'}, {...valid,ease:null},
  {...valid,repetitions:1.5}, {...valid,lapses:-1},
  {...valid,surface:42}, {...valid,term:'   '}
 ])assert.throws(()=>api.parseBackup(pack([card])),/نوع/,
  'corrupt SRS metadata cannot silently suppress due reviews');
 const old=storage.getItem('storylens_cards');
 storage.setItem('storylens_cards',JSON.stringify([{term:'fracture',dueAt:'never'}]));
 assert.throws(()=>api.exportObject(),/storylens_cards/,
  'corrupt local review schedule cannot silently enter exported backup');
 if(old===null)storage.removeItem('storylens_cards');
 else storage.setItem('storylens_cards',old);
}
console.log('PASS: SRS review-card backup schema and legacy compatibility');


// Android SAF regression: an escaped "\\n" inside a // comment once swallowed
// the receiveImport call. Matching the method name alone missed this outage.
{
 const callbackStart=kt.indexOf('private val importDocument');
 const callbackEnd=kt.indexOf('private inner class OfflineBackupBridge',callbackStart);
 assert.ok(callbackStart>=0&&callbackEnd>callbackStart,'import callback exists');
 const callback=kt.slice(callbackStart,callbackEnd);
 const active=callback.split(/\r?\n/).filter(line=>
  /^\s*notifyBackup\("receiveImport", BackupUtf8\.decode\(bytes\.toByteArray\(\)\)\)\s*$/.test(line));
 assert.equal(active.length,1,'exactly one executable strict-UTF8 import delivery');
 assert.ok(callback.indexOf('input.use { stream ->')<callback.indexOf(active[0]),
  'file read completes before import delivery');
 assert.ok(callback.indexOf(active[0])<callback.indexOf('} catch (ex: Exception)'),
  'import delivery occurs on success, not after error handling');
 assert.ok(!callback.includes('consent.\\n            notifyBackup'),
  'literal escaped newlines must never comment out the delivery');
}
console.log('PASS: Android SAF receiveImport callback is executable and strictly decoded');
