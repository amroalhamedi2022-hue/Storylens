/* StoryLens v0.6 data portability. JSON versioned backups, entirely offline.
 * Android SAF file picker is provided by a narrow native bridge; browser
 * preview degrades to manual copy/paste. Import always needs confirmation.
 */
(function(global){
'use strict';
const PREFIX='storylens_';
const VERSION=1;
const MAX_BYTES=1_500_000;
// Count actual UTF-8 bytes, not JavaScript UTF-16 code units. Android SAF
// writes UTF-8; non-ASCII vocabulary must obey the same bound end to end.
// Unpaired surrogates are encoded as U+FFFD (three bytes), as in TextEncoder.
function utf8ByteLength(value, limit=Infinity){
 let bytes=0;
 for(let i=0;i<value.length;i++){
  const code=value.charCodeAt(i);
  if(code<0x80)bytes++;
  else if(code<0x800)bytes+=2;
  else if(code>=0xd800&&code<=0xdbff&&i+1<value.length&&
          value.charCodeAt(i+1)>=0xdc00&&value.charCodeAt(i+1)<=0xdfff){
   bytes+=4;i++;
  }else bytes+=3;
  if(bytes>limit)return bytes;
 }
 return bytes;
}
function exceedsUtf8Limit(value, limit){
 return utf8ByteLength(value,limit)>limit;
}
const MAX_ENTRIES=900;
const simple=new Set(['saved','cards','favorites','bookmarks','last_story','uiTheme','readerPrefs',
 'written_examples','discoveryLevel','discoverySort','favoritesOnly','wordSenses','dark','size',
 'fontArabic','fontEnglish','uiLocale','audioPrefs']);
function allowed(key){
 if(typeof key!=='string'||!key.startsWith(PREFIX))return false;
 const suffix=key.slice(PREFIX.length);
 return simple.has(suffix)||/^(chapter|has_read)_[a-z0-9-]{1,90}$/.test(suffix)||
  /^scroll_[a-z0-9-]{1,90}_[0-9]{1,4}$/.test(suffix);
}
const safeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// A backup must not silently restore objects/arrays where the reader expects
// plain user-authored text. Keep limits generous for legitimate older cards.
function validStringMap(value,maxKeyChars,maxValueChars){
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const entries=Object.entries(value);
 return entries.length<=5000&&entries.every(([key,text])=>
  key.length<=maxKeyChars&&typeof text==='string'&&text.length<=maxValueChars);
}
function validValue(key,val){
 const tail=key.slice(PREFIX.length);
 if(tail==='saved'||tail==='favorites'){
  return Array.isArray(val)&&val.length<=5000&&val.every(x=>typeof x==='string'&&x.length<=180);
 }
 if(tail==='cards'){
  // Malformed SRS timestamps silently hide due reviews; nonnumeric counters
  // can also corrupt the next review calculation. Older cards may omit fields.
  const optionalNumber=(x,key,min,max)=>x[key]===undefined||
   (typeof x[key]==='number'&&Number.isFinite(x[key])&&x[key]>=min&&x[key]<=max);
  const optionalCount=(x,key)=>x[key]===undefined||
   (Number.isSafeInteger(x[key])&&x[key]>=0&&x[key]<=100000);
  return Array.isArray(val)&&val.length<=5000&&val.every(x=>x&&typeof x==='object'&&
   typeof x.term==='string'&&x.term.trim().length>0&&x.term.length<=180&&
   ['sentence','translation','meaning','surface'].every(k=>x[k]===undefined||x[k]===null||
    (typeof x[k]==='string'&&x[k].length<5000))&&
   optionalNumber(x,'dueAt',0,7258118400000)&&
   optionalNumber(x,'intervalDays',0,36500)&&
   optionalNumber(x,'ease',0,10)&&
   optionalCount(x,'repetitions')&&optionalCount(x,'lapses'));
 }
 if(tail==='last_story')return typeof val==='string'&&val.length<=100;
 if(tail==='uiTheme')return ['aurora','aqua','nebula','paper-atlas','midnight-library','botanical-folio','rain-glass','solar-atelier','ink-workshop','velvet-theatre'].includes(val);
 if(tail==='audioPrefs')return val!==null&&typeof val==='object'&&!Array.isArray(val)&&
  Object.keys(val).sort().join(',')==='scene,sfx,sfxVolume,volume'&&
  ['rain','thunder','forest','night','ocean','fire','wind','cabin'].includes(val.scene)&&
  typeof val.sfx==='boolean'&&
  [val.volume,val.sfxVolume].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1);
 if(tail==='fontArabic')return ['sans','naskh'].includes(val);
 if(tail==='fontEnglish')return ['serif','sans'].includes(val);
 if(tail==='uiLocale')return ['ar','en'].includes(val);
 if(tail==='discoveryLevel')return ['all','A1','A2','B1','B2','C1','C2'].includes(val);
 if(tail==='discoverySort')return ['editorial','title','level'].includes(val);
 if(tail==='favoritesOnly'||tail==='dark'||tail.startsWith('has_read_'))return typeof val==='boolean';
 if(tail==='size')return Number.isInteger(val)&&val>=16&&val<=32;
 if(tail.startsWith('chapter_'))return Number.isInteger(val)&&val>=0&&val<1000;
 if(tail.startsWith('scroll_'))return Number.isFinite(val)&&val>=0&&val<1e9;
 if(tail==='readerPrefs')return val!==null&&typeof val==='object'&&!Array.isArray(val);
 if(tail==='written_examples')return validStringMap(val,500,5000);
 if(tail==='wordSenses')return validStringMap(val,4000,5000);
 if(tail==='bookmarks'){
  return val!==null&&typeof val==='object'&&!Array.isArray(val)&&Object.keys(val).length<=5000;
 }
 return false;
}
function exportObject(){
 const entries=Object.create(null);
 for(let i=0;i<localStorage.length;i++){
  const key=localStorage.key(i);
  if(!allowed(key))continue;
  const raw=localStorage.getItem(key);
  if(raw===null)continue;
  // Never produce a backup that silently drops an existing learning key.
  // A corrupt allowed entry needs explicit repair before export, otherwise
  // restoring this apparently successful archive could lose saved progress.
  let val;
  try{val=JSON.parse(raw)}catch(_){
   throw Error('تعذّر تصدير نسخة كاملة: بيانات تالفة في '+key);
  }
  if(!validValue(key,val))throw Error('تعذّر تصدير نسخة كاملة: بيانات غير صالحة في '+key);
  entries[key]=raw;
 }
 if(Object.keys(entries).length>MAX_ENTRIES)throw Error('عدد عناصر النسخة الاحتياطية يتجاوز الحد الآمن.');
 const payload={format:'storylens.backup',version:VERSION,createdAt:new Date().toISOString(),entries};
 const text=JSON.stringify(payload);
 if(exceedsUtf8Limit(text,MAX_BYTES))throw Error('حجم النسخة الاحتياطية يتجاوز الحد الآمن.');
 return text;
}
function parseBackup(input){
 if(typeof input!=='string'||exceedsUtf8Limit(input,MAX_BYTES))throw Error('ملف النسخة غير صالح أو كبير جدًا.');
 let obj;try{obj=JSON.parse(input)}catch(_){throw Error('هذا ليس ملف JSON صالحًا.');}
 if(!obj||obj.format!=='storylens.backup'||obj.version!==VERSION||
    !obj.entries||typeof obj.entries!=='object'||Array.isArray(obj.entries))throw Error('صيغة النسخة غير مدعومة.');
 const names=Object.keys(obj.entries);
 if(names.length>MAX_ENTRIES)throw Error('النسخة تتضمن عناصر أكثر من الحد الآمن.');
 const clean=Object.create(null);
 for(const name of names){
  if(!allowed(name))throw Error('النسخة تحتوي على مفتاح غير مسموح به.');
  const raw=obj.entries[name];
  if(typeof raw!=='string'||raw.length>700_000)throw Error('بيانات تالفة في '+name);
  let parsed;try{parsed=JSON.parse(raw)}catch(_){throw Error('بيانات JSON تالفة في '+name)}
  if(!validValue(name,parsed))throw Error('نوع البيانات غير صحيح في '+name);
  clean[name]=raw;
 }
 return clean;
}
function preview(input){
 const entries=parseBackup(input);
 const names=Object.keys(entries);
 const words=entries[PREFIX+'saved']?JSON.parse(entries[PREFIX+'saved']).length:0;
 const cards=entries[PREFIX+'cards']?JSON.parse(entries[PREFIX+'cards']).length:0;
 const favorite=entries[PREFIX+'favorites']?JSON.parse(entries[PREFIX+'favorites']).length:0;
 return {entries,stats:{keys:names.length,words,cards,favorites:favorite}};
}
function restore(entries){
 const names=Object.keys(entries);
 // Stage/validate before mutating any data. Never clear unrelated saved keys.
 for(const name of names) {
  if(!allowed(name)||!validValue(name,JSON.parse(entries[name])))throw Error('بيانات غير صالحة.');
 }
 const previous=new Map();
 for(const name of names)previous.set(name,localStorage.getItem(name));
 try {for(const name of names)localStorage.setItem(name,entries[name]);}
 catch(error){
  // Revert changes that FREE space before those that need space. Restoring
  // large old values first can itself fail under quota while newer imported
  // values still occupy storage; silently swallowing that loses progress.
  // Storage quota counts UTF-8 bytes, not JavaScript string code units.
  const rollback=[...previous].map(([name,raw])=>{
   const current=localStorage.getItem(name);
   return {name,raw,delta:(raw===null?0:utf8ByteLength(raw))-(current===null?0:utf8ByteLength(current))};
  }).sort((a,b)=>a.delta-b.delta);
  let rollbackComplete=true;
  for(const {name,raw} of rollback){
   try{
    if(raw===null)localStorage.removeItem(name);else localStorage.setItem(name,raw);
    if(localStorage.getItem(name)!==raw)rollbackComplete=false;
   }catch(_){rollbackComplete=false;}
  }
  throw new Error(rollbackComplete?
   'تعذّر الحفظ؛ لم تتغير بياناتك السابقة. قد تكون مساحة التخزين ممتلئة.':
   'تعذّر الحفظ واسترجاع بعض البيانات السابقة؛ لا تغلق التطبيق قبل حفظ نسخة من بياناتك.');
 }
 return names.length;
}
let staged=null;
function close(){if(typeof closeSheet==='function')closeSheet();}
function show(message){
 const box=document.getElementById('stl-backup-feedback');
 if(box)box.textContent=message;
}
const ui=(ar,en)=>document.documentElement.lang==='en'?en:ar;
const nativeStatusMessages={
 saved:['تم حفظ النسخة الاحتياطية في الموقع الذي اخترته.','Backup saved to the selected location.'],
 save_failed:['تعذّر حفظ النسخة الاحتياطية. تأكد من مساحة التخزين وأعد المحاولة.','Could not save the backup. Check storage space and try again.'],
 import_failed:['تعذّر قراءة النسخة الاحتياطية. تأكد من الملف وأعد المحاولة.','Could not read the backup file. Check the file and try again.'],
 export_too_large:['النسخة الاحتياطية أكبر من الحد المسموح.','The backup exceeds the allowed size.'],
 picker_busy:['أغلق نافذة اختيار الملف الحالية قبل بدء عملية أخرى.','Finish or cancel the current file picker before starting another operation.']
};
function showNativeStatus(code){
 const messages=nativeStatusMessages[code];
 if(!messages)return false;
 if(!document.getElementById('stl-backup-feedback'))renderBackup();
 show(ui(messages[0],messages[1]));
 return true;
}
function renderBackup(){
 const parent=document.getElementById('modals');
 if(!parent)return;
 parent.innerHTML='<div class="overlay" onclick="closeSheet(event)"><div class="sheet stl-backup-sheet" onclick="event.stopPropagation()">'+
  '<div class="tag">OFFLINE · DATA SAFETY</div><h2>'+ui('النسخ الاحتياطي','Backup & restore')+'</h2>'+
  '<p class="quiet">'+ui('احفظ مفرداتك ومواقع القراءة والإعدادات محليًا. لن يغادر الملف جهازك.','Save your words, reading progress and settings locally. Nothing is uploaded.')+'</p>'+
  '<div class="stl-backup-actions"><button class="primary" id="stl-backup-export">'+ui('تصدير نسخة','Export backup')+'</button>'+
  '<button class="secondary" id="stl-backup-import">'+ui('استيراد نسخة','Import backup')+'</button></div>'+
  '<label for="stl-backup-paste">'+ui('أو الصق نسخة JSON هنا','Or paste your JSON backup here')+'</label>'+
  '<textarea id="stl-backup-paste" placeholder="'+ui('الصق ملف Lingua Tales هنا','Paste your Lingua Tales JSON here')+'" spellcheck="false"></textarea>'+
  '<button class="secondary" id="stl-backup-validate">'+ui('فحص النسخة الملصوقة','Validate pasted backup')+'</button>'+
  '<p id="stl-backup-feedback" class="stl-backup-feedback" role="status" aria-live="polite"></p>'+
  '<footer><button class="secondary" onclick="closeSheet()">'+ui('إغلاق','Close')+'</button></footer></div></div>';
 document.getElementById('stl-backup-export').addEventListener('click',()=>{
  try{
   const value=exportObject();
   if(global.StoryLensNative&&typeof global.StoryLensNative.saveBackup==='function'){
    global.StoryLensNative.saveBackup(value);
    show(ui('اختر مكان حفظ ملف النسخة الاحتياطية على جهازك.','Choose where to save your backup file on this device.'));
   }else{
    const textarea=document.getElementById('stl-backup-paste');
    textarea.value=value;textarea.focus();textarea.select();
    show(ui('لا يوجد جسر حفظ ملفات في هذه المعاينة. انسخ النص المحدد واحتفظ به.','File saving is unavailable here. Copy the selected JSON and keep it safe.'));
   }
  }catch(e){show(e.message)}
 });
 document.getElementById('stl-backup-import').addEventListener('click',()=>{
  if(global.StoryLensNative&&typeof global.StoryLensNative.openBackup==='function'){
   global.StoryLensNative.openBackup();
   show(ui('اختر ملف JSON من جهازك؛ لن تُستبدل البيانات قبل الموافقة.','Choose a JSON backup; no data will change before you confirm.'));
  }else{
   document.getElementById('stl-backup-paste').focus();
   show(ui('الصق محتوى ملف النسخة في المربع ثم اضغط فحص.','Paste the backup JSON above, then choose Validate.'));
  }
 });
 document.getElementById('stl-backup-validate').addEventListener('click',()=>{
  showImport(document.getElementById('stl-backup-paste').value);
 });
}
function showImport(value){
 let data;try{data=preview(value)}catch(e){staged=null;if(!document.getElementById('stl-backup-feedback'))renderBackup();show(e.message);return false;}
 staged=data.entries;
 const approvedEntries=staged;
 if(!document.getElementById('stl-backup-feedback'))renderBackup();
 const box=document.getElementById('stl-backup-feedback');
 box.textContent=ui('وجدت ','Found ')+data.stats.words+ui(' كلمة، ',' words, ')+data.stats.favorites+
  ui(' قصة مفضلة، ',' favorites, ')+data.stats.cards+ui(' بطاقة مراجعة في ',' review cards in ')+data.stats.keys+
  ui(' مجموعة بيانات. الاستيراد سيستبدل البيانات المماثلة بعد التأكيد.',' groups. Import replaces matching data only after confirmation.');
 const go=document.createElement('button');go.type='button';go.className='primary stl-backup-confirm';
 go.textContent=ui('نعم، استرجع بياناتي','Yes, restore my data');
 go.addEventListener('click',()=>{
  try {
   // A newer/invalid preview revokes this button's authorization. Never
   // restore a different file than the one shown when this button appeared.
   if(staged!==approvedEntries)throw Error(ui('انتهت صلاحية التأكيد؛ افحص النسخة مرة أخرى.','Confirmation expired; validate the backup again.'));
   const count=restore(approvedEntries);staged=null;close();state.saved=get('saved',[]);
   state.cards=get('cards',[]);state.dark=get('dark',false);state.size=get('size',22);
   state.uiTheme=get('uiTheme','aurora');document.body.className='theme-'+state.uiTheme;
   // Restore imported UI preferences immediately; no app restart or change to
   // legacy storage keys. The shell is loaded later than this module.
   if(global.LinguaShell){
    global.LinguaShell.applyLocale(get('uiLocale','ar'),false);
    global.LinguaShell.applyFont('ar',get('fontArabic','sans'));
    global.LinguaShell.applyFont('en',get('fontEnglish','serif'));
   }
   state.page='library';library();window.scrollTo(0,0);
   alertOnce(count);
  }catch(e){show(e.message)}
 });
 box.appendChild(go);
 return true;
}
function alertOnce(count){
 const note=document.createElement('div');note.className='stl-backup-toast';note.role='status';
 note.textContent=ui('تم استيراد ','Restored ')+count+ui(' مجموعة بيانات بنجاح.',' data groups successfully.');document.body.appendChild(note);
 setTimeout(()=>note.remove(),3800);
}
const baseLibrary=library;
library=function(){
 baseLibrary();
 const bar=document.querySelector('.library-actions');
 if(!bar)return;
 const b=document.createElement('button');b.type='button';b.className='secondary stl-backup-open';
 b.textContent=ui('⤓ نسخ احتياطي','⤓ Backup');b.setAttribute('aria-label',ui('حفظ أو استعادة بيانات التعلم','Save or restore learning data'));
 b.addEventListener('click',renderBackup);bar.appendChild(b);
};
global.StoryLensBackup={
 exportObject,parseBackup,preview,restore,
 receiveImport:showImport,nativeStatus:showNativeStatus,nativeError:message=>{if(!document.getElementById('stl-backup-feedback'))renderBackup();show(message);},
 open:renderBackup
};
library();
})(window);
