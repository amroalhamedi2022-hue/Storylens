/* StoryLens v0.6 data portability. JSON versioned backups, entirely offline.
 * Android SAF file picker is provided by a narrow native bridge; browser
 * preview degrades to manual copy/paste. Import always needs confirmation.
 */
(function(global){
'use strict';
const PREFIX='storylens_';
const VERSION=1;
const MAX_BYTES=1_500_000;
const MAX_ENTRIES=900;
const simple=new Set(['saved','cards','favorites','bookmarks','last_story','uiTheme','readerPrefs',
 'written_examples','discoveryLevel','discoverySort','favoritesOnly','wordSenses','dark','size']);
function allowed(key){
 if(typeof key!=='string'||!key.startsWith(PREFIX))return false;
 const suffix=key.slice(PREFIX.length);
 return simple.has(suffix)||/^(chapter|has_read)_[a-z0-9-]{1,90}$/.test(suffix)||
  /^scroll_[a-z0-9-]{1,90}_[0-9]{1,4}$/.test(suffix);
}
const safeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validValue(key,val){
 const tail=key.slice(PREFIX.length);
 if(tail==='saved'||tail==='favorites'){
  return Array.isArray(val)&&val.length<=5000&&val.every(x=>typeof x==='string'&&x.length<=180);
 }
 if(tail==='cards'){
  return Array.isArray(val)&&val.length<=5000&&val.every(x=>x&&typeof x==='object'&&
   typeof x.term==='string'&&x.term.length<=180&&
   ['sentence','translation','meaning'].every(k=>!x[k]||typeof x[k]==='string'&&x[k].length<5000));
 }
 if(tail==='last_story')return typeof val==='string'&&val.length<=100;
 if(tail==='uiTheme')return ['aurora','aqua','nebula','paper-atlas','midnight-library'].includes(val);
 if(tail==='discoveryLevel')return ['all','A1','A2','B1','B2','C1','C2'].includes(val);
 if(tail==='discoverySort')return ['editorial','title','level'].includes(val);
 if(tail==='favoritesOnly'||tail==='dark'||tail.startsWith('has_read_'))return typeof val==='boolean';
 if(tail==='size')return Number.isInteger(val)&&val>=16&&val<=32;
 if(tail.startsWith('chapter_'))return Number.isInteger(val)&&val>=0&&val<1000;
 if(tail.startsWith('scroll_'))return Number.isFinite(val)&&val>=0&&val<1e9;
 if(tail==='readerPrefs')return val!==null&&typeof val==='object'&&!Array.isArray(val);
 if(['bookmarks','written_examples','wordSenses'].includes(tail)){
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
  try{
   const val=JSON.parse(raw);
   if(validValue(key,val))entries[key]=raw;
  }catch(_){}
 }
 const payload={format:'storylens.backup',version:VERSION,createdAt:new Date().toISOString(),entries};
 const text=JSON.stringify(payload);
 if(text.length>MAX_BYTES)throw Error('حجم النسخة الاحتياطية يتجاوز الحد الآمن.');
 return text;
}
function parseBackup(input){
 if(typeof input!=='string'||input.length>MAX_BYTES)throw Error('ملف النسخة غير صالح أو كبير جدًا.');
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
  for(const [name,raw] of previous){
   try{if(raw===null)localStorage.removeItem(name);else localStorage.setItem(name,raw);}catch(_){}
  }
  throw new Error('تعذّر الحفظ؛ قد تكون مساحة التخزين ممتلئة.');
 }
 return names.length;
}
let staged=null;
function close(){if(typeof closeSheet==='function')closeSheet();}
function show(message){
 const box=document.getElementById('stl-backup-feedback');
 if(box)box.textContent=message;
}
function renderBackup(){
 const parent=document.getElementById('modals');
 if(!parent)return;
 parent.innerHTML='<div class="overlay" onclick="closeSheet(event)"><div class="sheet stl-backup-sheet" onclick="event.stopPropagation()">'+
  '<div class="tag">OFFLINE · DATA SAFETY</div><h2>النسخ الاحتياطي</h2>'+
  '<p class="quiet">احفظ المفردات والمفضلة ومواقع القراءة والإعدادات في ملف JSON خاص بك. لن يغادر جهازك.</p>'+
  '<div class="stl-backup-actions"><button class="primary" id="stl-backup-export">تصدير نسخة</button>'+
  '<button class="secondary" id="stl-backup-import">استيراد نسخة</button></div>'+
  '<label for="stl-backup-paste">أو الصق نسخة JSON هنا لاسترجاعها يدويًا</label>'+
  '<textarea id="stl-backup-paste" placeholder="Paste your StoryLens JSON here" spellcheck="false"></textarea>'+
  '<button class="secondary" id="stl-backup-validate">فحص النسخة الملصوقة</button>'+
  '<p id="stl-backup-feedback" class="stl-backup-feedback" role="status" aria-live="polite"></p>'+
  '<footer><button class="secondary" onclick="closeSheet()">إغلاق</button></footer></div></div>';
 document.getElementById('stl-backup-export').addEventListener('click',()=>{
  try{
   const value=exportObject();
   if(global.StoryLensNative&&typeof global.StoryLensNative.saveBackup==='function'){
    global.StoryLensNative.saveBackup(value);
    show('اختر مكان حفظ ملف النسخة الاحتياطية على جهازك.');
   }else{
    const textarea=document.getElementById('stl-backup-paste');
    textarea.value=value;textarea.focus();textarea.select();
    show('لا يوجد جسر حفظ ملفات في هذه المعاينة. انسخ النص المحدد واحتفظ به.');
   }
  }catch(e){show(e.message)}
 });
 document.getElementById('stl-backup-import').addEventListener('click',()=>{
  if(global.StoryLensNative&&typeof global.StoryLensNative.openBackup==='function'){
   global.StoryLensNative.openBackup();
   show('اختر ملف JSON من جهازك؛ لن تُستبدل البيانات قبل الموافقة.');
  }else{
   document.getElementById('stl-backup-paste').focus();
   show('الصق محتوى ملف النسخة في المربع ثم اضغط فحص.');
  }
 });
 document.getElementById('stl-backup-validate').addEventListener('click',()=>{
  showImport(document.getElementById('stl-backup-paste').value);
 });
}
function showImport(value){
 let data;try{data=preview(value)}catch(e){if(!document.getElementById('stl-backup-feedback'))renderBackup();show(e.message);return false;}
 staged=data.entries;
 if(!document.getElementById('stl-backup-feedback'))renderBackup();
 const box=document.getElementById('stl-backup-feedback');
 box.innerHTML='وجدت '+data.stats.words+' كلمة و'+data.stats.favorites+
  ' قصة مفضلة و'+data.stats.cards+' بطاقة مراجعة ضمن '+data.stats.keys+
  ' مجموعة بيانات. <strong>استيرادها سيستبدل المجموعات المماثلة الموجودة عندك.</strong>';
 const go=document.createElement('button');go.type='button';go.className='primary stl-backup-confirm';
 go.textContent='نعم، استرجع بياناتي';
 go.addEventListener('click',()=>{
  try {const count=restore(staged);staged=null;close();state.saved=get('saved',[]);
   state.cards=get('cards',[]);state.dark=get('dark',false);state.size=get('size',22);
   state.uiTheme=get('uiTheme','aurora');document.body.className='theme-'+state.uiTheme;
   state.page='library';library();window.scrollTo(0,0);
   alertOnce(count);
  }catch(e){show(e.message)}
 });
 box.appendChild(go);
 return true;
}
function alertOnce(count){
 const note=document.createElement('div');note.className='stl-backup-toast';note.role='status';
 note.textContent='تم استيراد '+count+' مجموعة بيانات بنجاح.';document.body.appendChild(note);
 setTimeout(()=>note.remove(),3800);
}
const baseLibrary=library;
library=function(){
 baseLibrary();
 const bar=document.querySelector('.library-actions');
 if(!bar)return;
 const b=document.createElement('button');b.type='button';b.className='secondary stl-backup-open';
 b.textContent='⤓ نسخ احتياطي';b.setAttribute('aria-label','حفظ أو استعادة بيانات التعلم');
 b.addEventListener('click',renderBackup);bar.appendChild(b);
};
global.StoryLensBackup={
 exportObject,parseBackup,preview,restore,
 receiveImport:showImport,nativeError:message=>{if(!document.getElementById('stl-backup-feedback'))renderBackup();show(message);},
 open:renderBackup
};
library();
})(window);
