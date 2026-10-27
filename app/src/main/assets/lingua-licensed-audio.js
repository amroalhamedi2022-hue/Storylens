(function(global){
'use strict';
/* LT-11: 16 pinned, licensed looped soundscapes + 4 short licensed sound effects.
 * All files are packaged locally by tools/fetch_licensed_audio.py. No runtime network,
 * autoplay, microphone or speech synthesis. Audio begins only after an explicit tap.
 */
const TRACKS = [
 {id:"forest",en:"Forest canopy",ar:"أجواء الغابة",file:"forest-loop.ogg"},
 {id:"night-forest",en:"Night forest",ar:"غابة ليلية",file:"night-forest.ogg"},
 {id:"quiet-room",en:"Quiet room",ar:"غرفة هادئة",file:"quiet-room.ogg"},
 {id:"lake-shore",en:"Lake shore",ar:"شاطئ البحيرة",file:"lake-shore.ogg"},
 {id:"coastal-waves",en:"Coastal waves and birds",ar:"أمواج ساحلية وطيور",file:"coastal-waves.ogg"},
 {id:"underwater",en:"Underwater hush",ar:"هدوء تحت الماء",file:"underwater.ogg"},
 {id:"distant-city",en:"Distant city",ar:"مدينة بعيدة",file:"distant-city.ogg"},
 {id:"book-cafe",en:"Book café murmur",ar:"همهمة مقهى الكتب",file:"book-cafe.ogg"},
 {id:"rain-cabin",en:"Rain on a cabin",ar:"مطر على كوخ",file:"rain-cabin.ogg"},
 {id:"forest-rain",en:"Forest rain",ar:"مطر الغابة",file:"forest-rain.ogg"},
 {id:"city-rain",en:"City rain",ar:"مطر المدينة",file:"city-rain.ogg"},
 {id:"ocean-waves",en:"Ocean waves",ar:"أمواج المحيط",file:"ocean-waves.ogg"},
 {id:"river-flow",en:"River flow",ar:"جريان النهر",file:"river-flow.ogg"},
 {id:"waterfall",en:"Waterfall",ar:"شلال",file:"waterfall.ogg"},
 {id:"wind-birds",en:"Wind and birds",ar:"رياح وطيور",file:"wind-birds.ogg"},
 {id:"wind-chimes",en:"Wind chimes",ar:"أجراس الرياح",file:"wind-chimes.ogg"}
];
const SFX = [
 {id:"book-open",en:"Book opens",ar:"فتح كتاب",file:"book-open.ogg"},
 {id:"page-turn",en:"Page turns",ar:"تقليب صفحات",file:"page-turn.ogg"},
 {id:"clock-tick",en:"Old clock tick",ar:"دقات ساعة قديمة",file:"clock-tick.ogg"},
 {id:"forest-birds",en:"Forest birds",ar:"طيور الغابة",file:"forest-birds.ogg"}
];
const LICENSE = 'CC BY 4.0';
const KEY='licensedAudioPrefs';
const DEFAULT={track:'forest',volume:0.24,sfxVolume:0.18};
const trackIds=new Set(TRACKS.map(x=>x.id)),sfxIds=new Set(SFX.map(x=>x.id));
const clamp=v=>Math.max(0,Math.min(1,Number.isFinite(Number(v))?Number(v):0));
function sanitize(raw){
 const o=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 return {track:trackIds.has(o.track)?o.track:DEFAULT.track,
  volume:clamp(o.volume===undefined?DEFAULT.volume:o.volume),
  sfxVolume:clamp(o.sfxVolume===undefined?DEFAULT.sfxVolume:o.sfxVolume)};
}
let prefs=sanitize(typeof global.get==='function'?global.get(KEY,DEFAULT):DEFAULT);
let player=null,playerTrack=null,playing=false,focusOwned=false,generation=0;
const sfxPlayers=new Set();
let playButton=null,statusNote=null,rtlUi=false;
const doc=global.document;
function persist(){if(typeof global.put==='function')global.put(KEY,{...prefs});}
function proceduralPlaying(){
 const a=global.LinguaAmbience;
 try{return !!(a&&typeof a.isPlaying==='function'&&a.isPlaying());}catch(_){return false;}
}
function requestFocus(){
 if(focusOwned)return true;
 const bridge=global.LinguaTalesAudioFocus;
 if(!bridge||typeof bridge.requestFocus!=='function')return true;
 try{const ok=bridge.requestFocus()===true;if(ok)focusOwned=true;return ok;}catch(_){return false;}
}
function releaseFocus(){
 if(!focusOwned)return;
 focusOwned=false;
 const bridge=global.LinguaTalesAudioFocus;
 if(!bridge||typeof bridge.releaseFocus!=='function')return;
 try{bridge.releaseFocus();}catch(_){}
}
function syncUi(){
 if(playButton)playButton.textContent=playing?(rtlUi?'إيقاف مؤقت':'Pause'):(rtlUi?'تشغيل الأجواء':'Play ambience');
 if(statusNote)statusNote.textContent=rtlUi
  ?'16 أجواء مسجّلة ومرخّصة + 4 مؤثرات قصيرة؛ تعمل محليًا بعد اختيارك. CC BY 4.0.'
  :'16 licensed recorded ambiences + 4 short effects; local playback only after your tap. CC BY 4.0.';
}
function stopSfx(){
 for(const audio of sfxPlayers){try{audio.pause();audio.currentTime=0;}catch(_){}}
 sfxPlayers.clear();
}
async function pause(options){
 ++generation;playing=false;
 if(player){try{player.pause();}catch(_){}}
 stopSfx();
 if(!(options&&options.keepFocus)&&!proceduralPlaying())releaseFocus();
 syncUi();
}
async function stopProceduralKeepingFocus(){
 const a=global.LinguaAmbience;
 if(a&&typeof a.isPlaying==='function'&&a.isPlaying()&&typeof a.pause==='function')
  return a.pause({keepFocus:true});
 return Promise.resolve();
}
async function playTrack(id){
 const track=TRACKS.find(x=>x.id===id);
 if(!track||doc?.hidden)return false;
 if(playing&&playerTrack===id&&player&&!player.paused)return true;
 const ticket=++generation;
 const pausePromise=stopProceduralKeepingFocus(); // sync pause happens before Audio.play, preserving user gesture
 if(!requestFocus()){await pausePromise;releaseFocus();return false;}
 if(playerTrack!==id||!player){
  if(player){try{player.pause();player.currentTime=0;}catch(_){}}
  const createdPlayer=new global.Audio('licensed-audio/'+track.file);
  player=createdPlayer;
  playerTrack=id;createdPlayer.preload='none';createdPlayer.loop=true;
  // A cached Audio element can fail on a later replay, after its original
  // request ticket has expired. Tie recovery to element identity, not that
  // one-shot ticket, and evict failed elements so the next tap gets a fresh one.
  createdPlayer.addEventListener('error',()=>{
   if(player!==createdPlayer)return;
   playing=false;
   try{createdPlayer.pause();createdPlayer.currentTime=0;}catch(_){}
   player=null;playerTrack=null;
   releaseFocus();syncUi();
  });
 }
 const active=player;
 active.loop=true;active.volume=prefs.volume;
 let playPromise;
 try{playPromise=active.play();}catch(error){
  if(ticket===generation){
   playing=false;
   try{active.pause();active.currentTime=0;}catch(_){}
   if(player===active){player=null;playerTrack=null;}
   releaseFocus();syncUi();
  }
  throw error;
 }
 try{await Promise.all([pausePromise,playPromise]);}
 catch(error){
  if(ticket===generation){
   playing=false;
   try{active.pause();active.currentTime=0;}catch(_){}
   if(player===active){player=null;playerTrack=null;}
   releaseFocus();syncUi();
  }
  throw error;
 }
 if(ticket!==generation||doc?.hidden){
  try{active.pause();}catch(_){}
  if(!playing)releaseFocus();
  return false;
 }
 playing=true;syncUi();return true;
}
function selectTrack(id){
 if(!trackIds.has(id))return false;
 prefs.track=id;persist();
 if(playing)playTrack(id).catch(error=>{if(statusNote)statusNote.textContent=(rtlUi?'تعذر تشغيل الصوت: ':'Audio unavailable: ')+(error?.message||String(error));});
 return true;
}
function setVolume(value){prefs.volume=clamp(value);persist();if(player)player.volume=prefs.volume;}
async function playSfx(id){
 const sfx=SFX.find(x=>x.id===id);
 if(!sfx||doc?.hidden)return false;
 const anotherLoop=playing||proceduralPlaying();
 if(!anotherLoop&&!requestFocus())return false;
 const audio=new global.Audio('licensed-audio/'+sfx.file);
 audio.loop=false;audio.preload='none';audio.volume=prefs.sfxVolume;
 sfxPlayers.add(audio);
 const finish=()=>{
  sfxPlayers.delete(audio);
  if(!playing&&!proceduralPlaying()&&sfxPlayers.size===0)releaseFocus();
 };
 audio.addEventListener('ended',finish,{once:true});
 audio.addEventListener('error',finish,{once:true});
 let promise;
 try{promise=audio.play();}catch(error){finish();throw error;}
 try{await promise;return true;}catch(error){finish();throw error;}
}
function controls(sheet,rtl){
 rtlUi=!!rtl;
 const section=doc.createElement('section');section.className='lt-audio-settings lt-licensed-audio-settings';
 const heading=doc.createElement('h3');heading.textContent=rtl?'🎧 أجواء مسجّلة مرخّصة':'🎧 Licensed recorded ambience';section.appendChild(heading);
 statusNote=doc.createElement('p');statusNote.className='quiet';section.appendChild(statusNote);
 const label=doc.createElement('label');label.className='lt-font-setting';
 const caption=doc.createElement('span');caption.textContent=rtl?'أجواء القراءة':'Reading ambience';label.appendChild(caption);
 const select=doc.createElement('select');select.setAttribute('aria-label',caption.textContent);
 for(const track of TRACKS){const option=doc.createElement('option');option.value=track.id;option.textContent=rtl?track.ar:track.en;select.appendChild(option);}
 select.value=prefs.track;select.addEventListener('change',()=>selectTrack(select.value));label.appendChild(select);section.appendChild(label);
 const row=doc.createElement('div');row.className='lt-audio-buttons';
 playButton=doc.createElement('button');playButton.type='button';playButton.className='secondary';
 const update=()=>syncUi();update();
 playButton.addEventListener('click',async()=>{
  playButton.disabled=true;
  try{if(playing)await pause();else await playTrack(prefs.track);}
  catch(error){if(statusNote)statusNote.textContent=(rtl?'تعذر تشغيل الصوت: ':'Audio unavailable: ')+(error?.message||String(error));}
  finally{playButton.disabled=false;syncUi();}
 });
 row.appendChild(playButton);section.appendChild(row);
 const volumeLabel=doc.createElement('label');volumeLabel.className='lt-audio-range';volumeLabel.textContent=rtl?'مستوى الصوت':'Ambience volume';
 const volume=doc.createElement('input');volume.type='range';volume.min='0';volume.max='1';volume.step='0.01';volume.value=String(prefs.volume);volume.setAttribute('aria-label',volumeLabel.textContent);
 volume.addEventListener('input',()=>setVolume(volume.value));volumeLabel.appendChild(volume);section.appendChild(volumeLabel);
 const sfxTitle=doc.createElement('h4');sfxTitle.textContent=rtl?'مؤثرات قصيرة (تشغيل يدوي)':'Short sound effects (tap to play)';section.appendChild(sfxTitle);
 const sfxRow=doc.createElement('div');sfxRow.className='lt-audio-buttons';
 for(const sfx of SFX){const button=doc.createElement('button');button.type='button';button.className='secondary';button.textContent=rtl?sfx.ar:sfx.en;
  button.addEventListener('click',()=>playSfx(sfx.id).catch(error=>{if(statusNote)statusNote.textContent=(rtl?'تعذر تشغيل المؤثر: ':'Sound effect unavailable: ')+(error?.message||String(error));}));
  sfxRow.appendChild(button);}
 section.appendChild(sfxRow);
 sheet.appendChild(section);
 return section;
}
function onNativeAudioFocusLoss(){focusOwned=false;pause({keepFocus:true}).catch(()=>{});}
if(doc&&typeof doc.addEventListener==='function'){
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)pause().catch(()=>{});});
}
if(typeof global.addEventListener==='function')global.addEventListener('pagehide',()=>pause().catch(()=>{}));
const procedural=global.LinguaAmbience;
if(procedural&&!procedural.__licensedAudioBridge){
 const originalPlay=procedural.play;
 procedural.play=async function(...args){
  const pending=pause({keepFocus:true});
  const result=originalPlay.apply(this,args);
  focusOwned=false; // the procedural engine now owns native focus lifecycle
  await pending;
  return result;
 };
 const originalLoss=procedural.onNativeAudioFocusLoss;
 procedural.onNativeAudioFocusLoss=function(...args){
  pause({keepFocus:true}).catch(()=>{});
  // The original procedural handler releases the native grant after this wrapper.
  // Clear our local ownership bit so the next licensed play must reacquire focus.
  focusOwned=false;
  if(typeof originalLoss==='function')return originalLoss.apply(this,args);
 };
 procedural.__licensedAudioBridge=true;
}
global.LinguaLicensedAudio={
 TRACKS,SFX,LICENSE,controls,playTrack,pause,selectTrack,setVolume,playSfx,
 isPlaying:()=>playing,prefs:()=>({...prefs}),onNativeAudioFocusLoss
};
})(window);
