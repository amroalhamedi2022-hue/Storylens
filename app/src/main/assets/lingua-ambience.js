/* Lingua Tales LT-11 — opt-in, original procedural ambient previews.
 * NO recordings, no microphone, no network, no third-party audio assets.
 * These are synthesised soundscapes, not the requested licensed music library.
 * Web Audio is created ONLY by an explicit user click. No background autoplay.
 */
(function(global){
'use strict';
const SCENES=[
 ['rain','Soft Rain','مطر هادئ',950,0.24,0],
 ['thunder','Distant Storm','عاصفة بعيدة',260,0.38,48],
 ['forest','Forest Breeze','نسيم الغابة',1100,0.12,190],
 ['night','Night Air','هواء الليل',480,0.13,130],
 ['ocean','Ocean Hush','هدوء البحر',350,0.26,72],
 ['fire','Hearth','موقد هادئ',1800,0.10,0],
 ['wind','Highland Wind','رياح المرتفعات',320,0.19,105],
 ['cabin','Quiet Cabin','كوخ هادئ',620,0.13,165],
 ['brook','Woodland Brook','جدول في الغابة',1450,0.19,220],
 ['waterfall','Distant Waterfall','شلال بعيد',2400,0.21,80],
 ['dawn','First Light','فجر هادئ',1750,0.10,310],
 ['snow','Snowfall','تساقط الثلج',720,0.09,60],
 ['train','Night Train','قطار ليلي',460,0.22,92],
 ['library','Old Library','مكتبة قديمة',280,0.08,115],
 ['window','Rain on Glass','مطر على النافذة',2800,0.23,0],
 ['cliffs','Coastal Cliffs','جروف ساحلية',800,0.18,55],
 ['meadow','Spring Meadow','مرج الربيع',2100,0.10,260],
 ['leaves','Autumn Leaves','أوراق الخريف',1250,0.14,135],
 ['desert','Desert Night','ليل الصحراء',390,0.11,180],
 ['stars','Starry Observatory','مرصد النجوم',180,0.07,432],
 ['quiet-keys','Quiet Keys','مفاتيح هادئة',1800,0,0,'music',[261.63,329.63,392,329.63,293.66,349.23,329.63,261.63],1250],
 ['moonlit-chimes','Moonlit Chimes','رنين ضوء القمر',1800,0,0,'music',[220,261.63,329.63,392,349.23,329.63,261.63,246.94],1550],
 ['lantern-motif','Lantern Motif','لحن الفوانيس',1800,0,0,'music',[196,246.94,293.66,369.99,329.63,293.66,246.94,220],1120],
 ['paper-atlas-melody','Paper Atlas Melody','لحن أطلس الورق',1800,0,0,'music',[174.61,220,261.63,293.66,261.63,220,196,220],1680]
];
const KEY='audioPrefs';
const DEFAULT={scene:'rain',volume:0.28,sfxVolume:0.18,sfx:false};
const ids=new Set(SCENES.map(s=>s[0]));
const clamp=v=>Math.max(0,Math.min(1,Number.isFinite(Number(v))?Number(v):0));
function sanitize(raw){
 const obj=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 return {scene:ids.has(obj.scene)?obj.scene:DEFAULT.scene,
  volume:clamp(obj.volume===undefined?DEFAULT.volume:obj.volume),
  sfxVolume:clamp(obj.sfxVolume===undefined?DEFAULT.sfxVolume:obj.sfxVolume),
  sfx:obj.sfx===true};
}
let prefs=sanitize(typeof get==='function'?get(KEY,DEFAULT):DEFAULT);
let context=null,master=null,noiseSource=null,noiseFilter=null,noiseGain=null,drone=null,droneGain=null,playing=false;
let melodyTimer=null,melodyNodes=new Set(),melodyStep=0;
let playbackGeneration=0; // invalidates an in-flight AudioContext.resume after pagehide/pause
const clickVoices=new Set();
function persist(){if(typeof put==='function')put(KEY,{...prefs});}
function stopNodes(){
 if(melodyTimer!==null){global.clearInterval(melodyTimer);melodyTimer=null;}
 for(const node of [noiseSource,drone]){
  if(node){try{node.stop();}catch(_){}try{node.disconnect();}catch(_){}}
 }
 for(const voice of melodyNodes){
  try{voice.osc.stop();}catch(_){}
  try{voice.osc.disconnect();}catch(_){}
  try{voice.gain.disconnect();}catch(_){}
 }
 melodyNodes.clear();melodyStep=0;
 noiseSource=null;drone=null;
 if(noiseFilter){noiseFilter.disconnect();noiseFilter=null;}
 if(noiseGain){noiseGain.disconnect();noiseGain=null;}
 if(droneGain){droneGain.disconnect();droneGain=null;}
}
function playMelodyNote(ctx,spec){
 const notes=Array.isArray(spec[7])?spec[7]:[];
 if(!notes.length)return;
 const frequency=notes[melodyStep%notes.length],now=ctx.currentTime;
 melodyStep++;
 const osc=ctx.createOscillator(),gain=ctx.createGain(),voice={osc,gain};
 osc.type='sine';osc.frequency.setValueAtTime(frequency,now);
 gain.gain.setValueAtTime(0.0001,now);
 gain.gain.exponentialRampToValueAtTime(0.032,now+0.055);
 gain.gain.exponentialRampToValueAtTime(0.0001,now+0.98);
 osc.connect(gain);gain.connect(master);melodyNodes.add(voice);
 osc.onended=()=>{melodyNodes.delete(voice);try{osc.disconnect();gain.disconnect();}catch(_){}};
 osc.start(now);osc.stop(now+1);
 // A quiet fifth on alternate beats gives the original motif a soft harmonic bed.
 if(melodyStep%2===0){
  const harmony=ctx.createOscillator(),hGain=ctx.createGain(),harmonicVoice={osc:harmony,gain:hGain};
  harmony.type='triangle';harmony.frequency.setValueAtTime(frequency*1.5,now);
  hGain.gain.setValueAtTime(0.0001,now);
  hGain.gain.exponentialRampToValueAtTime(0.009,now+0.08);
  hGain.gain.exponentialRampToValueAtTime(0.0001,now+1.18);
  harmony.connect(hGain);hGain.connect(master);melodyNodes.add(harmonicVoice);
  harmony.onended=()=>{melodyNodes.delete(harmonicVoice);try{harmony.disconnect();hGain.disconnect();}catch(_){}};
  harmony.start(now);harmony.stop(now+1.2);
 }
}
function ensureContext(){
 if(!context){
  const Constructor=global.AudioContext||global.webkitAudioContext;
  if(!Constructor)throw Error('Web Audio unavailable');
  context=new Constructor();
  master=context.createGain();master.gain.value=0;master.connect(context.destination);
 }
 return context;
}
function buffer(ctx){
 // Shared two-second mono texture (~350 KB at 44.1 kHz), not twenty decoded tracks.
 if(buffer.cache&&buffer.rate===ctx.sampleRate)return buffer.cache;
 const count=Math.floor(ctx.sampleRate*2);
 const b=ctx.createBuffer(1,count,ctx.sampleRate),data=b.getChannelData(0);
 // Deterministic local noise; no runtime network, no repeated buffer allocation.
 let seed=0x6c756e61,low=0;
 for(let i=0;i<count;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const white=(seed/2147483648)-1;
  low=low*0.93+white*0.07;
  data[i]=white*0.63+low*0.37;
 }
 buffer.cache=b;buffer.rate=ctx.sampleRate;return b;
}
function build(scene){
 const ctx=ensureContext();
 stopNodes();
 const spec=SCENES.find(s=>s[0]===scene)||SCENES[0];
 if(spec[6]==='music'){
  playMelodyNote(ctx,spec);
  melodyTimer=global.setInterval(()=>{
   if(playing&&!document.hidden&&context===ctx)playMelodyNote(ctx,spec);
  },spec[8]||1300);
  return;
 }
 noiseSource=ctx.createBufferSource();noiseSource.buffer=buffer(ctx);noiseSource.loop=true;
 noiseFilter=ctx.createBiquadFilter();noiseFilter.type='lowpass';noiseFilter.frequency.value=spec[3];
 noiseGain=ctx.createGain();noiseGain.gain.value=spec[4];
 noiseSource.connect(noiseFilter);noiseFilter.connect(noiseGain);noiseGain.connect(master);
 noiseSource.start();
 if(spec[5]){
  drone=ctx.createOscillator();drone.type=scene==='ocean'?'sine':'triangle';
  drone.frequency.value=spec[5];
  droneGain=ctx.createGain();droneGain.gain.value=scene==='thunder'?0.012:0.008;
  drone.connect(droneGain);droneGain.connect(master);drone.start();
 }
}
function requestNativeAudioFocus(){
 const bridge=global.LinguaTalesAudioFocus;
 if(!bridge||typeof bridge.requestFocus!=='function')return true; // Browser preview.
 try{return bridge.requestFocus()===true;}catch(_){return false;}
}
function releaseNativeAudioFocus(){
 const bridge=global.LinguaTalesAudioFocus;
 if(!bridge||typeof bridge.releaseFocus!=='function')return;
 try{bridge.releaseFocus();}catch(_){}
}
function licensedPlaybackActive(){
 const licensed=global.LinguaLicensedAudio;
 try{return !!(licensed&&typeof licensed.isPlaying==='function'&&licensed.isPlaying());}
 catch(_){return false;}
}
function releaseClickFocusIfIdle(ticket){
 // A short click sound must not abandon focus acquired by newer ambience/music.
 if(ticket!==playbackGeneration||playing||licensedPlaybackActive()||clickVoices.size>0)return;
 releaseNativeAudioFocus();
}
function disposeClickVoice(voice,stop){
 if(!clickVoices.delete(voice))return;
 if(stop){try{voice.osc.stop();}catch(_){}}
 try{voice.osc.disconnect();}catch(_){}
 try{voice.gain.disconnect();}catch(_){}
}
function stopClickSounds(){
 for(const voice of [...clickVoices])disposeClickVoice(voice,true);
}
async function play(){
 if(document.hidden)return false;
 if(playing)return true;
 // Android focus is acquired synchronously from the user gesture, before an
 // AudioContext is created or resumed. A denied request remains silent.
 if(!requestNativeAudioFocus())return false;
 const ticket=++playbackGeneration;
 let ctx;
 try{
  ctx=ensureContext();
  if(ctx.state!=='running')await ctx.resume();
 }catch(error){
  releaseNativeAudioFocus();
  throw error;
 }
 if(document.hidden||ticket!==playbackGeneration){
  // A stale resume must not suspend a newer play request or retain focus.
  if(!playing){
   try{if(ctx.state==='running')await ctx.suspend();}
   finally{releaseNativeAudioFocus();}
  }
  return false;
 }
 if(playing)return true;
 try{
  build(prefs.scene);master.gain.value=prefs.volume*0.36;
  playing=true;return true;
 }catch(error){
  releaseNativeAudioFocus();
  throw error;
 }
}
async function pause(options){
 ++playbackGeneration; // a delayed resume must never start audio after pause
 playing=false;stopNodes();stopClickSounds();
 if(master)master.gain.value=0;
 try{if(context&&context.state==='running')await context.suspend();}
 finally{if(!(options&&options.keepFocus))releaseNativeAudioFocus();}
}
function onNativeAudioFocusLoss(){pause().catch(()=>{});}
function pauseFromNative(){return pause();}
function selectScene(id){
 if(!ids.has(id))return false;
 prefs.scene=id;persist();
 if(playing)build(id);
 return true;
}
function setVolume(value){
 prefs.volume=clamp(value);persist();
 if(master&&playing)master.gain.value=prefs.volume*0.36;
}
function setSfx(enabled){prefs.sfx=enabled===true;persist();}
function setSfxVolume(value){prefs.sfxVolume=clamp(value);persist();}
function clickSound(){
 if(!prefs.sfx||document.hidden)return;
 const ticket=playbackGeneration;
 const needsFocus=!playing;
 if(needsFocus&&!requestNativeAudioFocus())return;
 let ctx,resumePromise=null;
 try{
  ctx=ensureContext();
  // Invoke resume synchronously from the user gesture, but do not trust its
  // eventual completion: focus may be lost while the promise is still pending.
  if(ctx.state!=='running')resumePromise=ctx.resume();
 }catch(_){if(needsFocus)releaseClickFocusIfIdle(ticket);return;}
 const osc=ctx.createOscillator(),gain=ctx.createGain(),voice={osc,gain};
 clickVoices.add(voice);
 osc.type='sine';osc.frequency.setValueAtTime(720,ctx.currentTime);
 osc.frequency.exponentialRampToValueAtTime(490,ctx.currentTime+0.045);
 gain.gain.setValueAtTime(Math.max(0.0001,prefs.sfxVolume*0.06),ctx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.05);
 osc.connect(gain);gain.connect(ctx.destination);
 osc.onended=()=>{
  disposeClickVoice(voice,false);
  if(needsFocus)releaseClickFocusIfIdle(ticket);
 };
 try{osc.start();osc.stop(ctx.currentTime+0.055);}
 catch(_){disposeClickVoice(voice,true);if(needsFocus)releaseClickFocusIfIdle(ticket);return;}
 if(resumePromise&&typeof resumePromise.then==='function'){
  Promise.resolve(resumePromise).then(async()=>{
   if(document.hidden||ticket!==playbackGeneration){
    disposeClickVoice(voice,true);
    // A stale resume can complete after pause already observed a suspended
    // context. Suspend it again, but never release a newer playback's focus.
    if(ctx.state==='running'){try{await ctx.suspend();}catch(_){}}
    if(needsFocus)releaseClickFocusIfIdle(ticket);
   }
  }).catch(()=>{
   disposeClickVoice(voice,true);
   if(needsFocus)releaseClickFocusIfIdle(ticket);
  });
 }
}
function controls(sheet,rtl){
 const section=document.createElement('section');section.className='lt-audio-settings';
 const heading=document.createElement('h3');heading.textContent=rtl?'🎧 موسيقى وأجواء القراءة':'🎧 Reading music & ambience';
 section.appendChild(heading);
 const note=document.createElement('p');note.className='quiet';
 note.textContent=rtl
  ?'24 إعدادًا محليًا: 20 مشهد أجواء و4 ألحان إلكترونية أصلية. ليست تسجيلات مرخّصة؛ صامتة افتراضيًا ولا تحتاج إلى شبكة.'
  :'24 offline presets: 20 ambience scenes and 4 original synthesized melodies. These are not licensed recordings; silent by default and network-free.';
 section.appendChild(note);
 const sceneLabel=document.createElement('label');sceneLabel.className='lt-font-setting';
 const caption=document.createElement('span');caption.textContent=rtl?'موسيقى وأجواء':'Music & ambience';
 sceneLabel.appendChild(caption);
 const select=document.createElement('select');select.setAttribute('aria-label',caption.textContent);
 for(const scene of SCENES){
  const option=document.createElement('option');option.value=scene[0];
  option.textContent=(scene[6]==='music'?'♫ ':'◌ ')+(rtl?scene[2]:scene[1]);select.appendChild(option);
 }
 select.value=prefs.scene;select.addEventListener('change',()=>selectScene(select.value));
 sceneLabel.appendChild(select);section.appendChild(sceneLabel);
 const row=document.createElement('div');row.className='lt-audio-buttons';
 const playButton=document.createElement('button');playButton.type='button';playButton.className='secondary';
 const update=()=>{playButton.textContent=playing?(rtl?'إيقاف مؤقت':'Pause'):(rtl?'تشغيل الأجواء':'Play ambience');};
 update();
 playButton.addEventListener('click',async()=>{
  playButton.disabled=true;
  try{if(playing)await pause();else await play();}
  catch(e){note.textContent=(rtl?'تعذر تشغيل الصوت: ':'Audio unavailable: ')+(e?.message||String(e));}
  finally{playButton.disabled=false;update();}
 });
 row.appendChild(playButton);section.appendChild(row);
 const volumeLabel=document.createElement('label');volumeLabel.className='lt-audio-range';
 volumeLabel.textContent=rtl?'مستوى الأجواء':'Ambience volume';
 const volume=document.createElement('input');volume.type='range';volume.min='0';volume.max='1';volume.step='0.05';volume.value=String(prefs.volume);
 volume.setAttribute('aria-label',volumeLabel.textContent);volume.addEventListener('input',()=>setVolume(volume.value));
 volumeLabel.appendChild(volume);section.appendChild(volumeLabel);
 const sfxLabel=document.createElement('label');sfxLabel.className='lt-audio-checkbox';
 const sfx=document.createElement('input');sfx.type='checkbox';sfx.checked=prefs.sfx;
 sfx.addEventListener('change',()=>setSfx(sfx.checked));
 sfxLabel.appendChild(sfx);sfxLabel.appendChild(document.createTextNode(rtl?' أصوات الأزرار (اختياري)':' Button sounds (optional)'));
 section.appendChild(sfxLabel);
 const sfxLabelVol=document.createElement('label');sfxLabelVol.className='lt-audio-range';
 sfxLabelVol.textContent=rtl?'مستوى أصوات الأزرار':'Button sound volume';
 const sfxVolume=document.createElement('input');sfxVolume.type='range';sfxVolume.min='0';sfxVolume.max='1';sfxVolume.step='0.05';sfxVolume.value=String(prefs.sfxVolume);
 sfxVolume.setAttribute('aria-label',sfxLabelVol.textContent);
 sfxVolume.addEventListener('input',()=>setSfxVolume(sfxVolume.value));
 sfxLabelVol.appendChild(sfxVolume);section.appendChild(sfxLabelVol);
 sheet.appendChild(section);
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause().catch(()=>{});});
global.addEventListener('pagehide',()=>{pause().catch(()=>{});});
document.addEventListener('click',event=>{
 const button=event.target?.closest?.('button');
 // Audio controls own their focus/playback lifecycle. A bubbling click on Play/Pause
 // must not race a second one-shot focus request against the explicit user action.
 if(!button||button.closest?.('.lt-audio-settings'))return;
 clickSound();
});
global.LinguaAmbience={SCENES:SCENES.map(s=>({id:s[0],en:s[1],ar:s[2],type:s[6]||'ambience'})),
 controls,play,pause,pauseFromNative,onNativeAudioFocusLoss,selectScene,setVolume,setSfx,setSfxVolume,clickSound,
 prefs:()=>({...prefs}),isPlaying:()=>playing,hasContext:()=>!!context};
})(window);
