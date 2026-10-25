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
 ['cabin','Quiet Cabin','كوخ هادئ',620,0.13,165]
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
let context=null,master=null,noiseSource=null,noiseFilter=null,drone=null,droneGain=null,playing=false;
function persist(){if(typeof put==='function')put(KEY,{...prefs});}
function stopNodes(){
 for(const node of [noiseSource,drone]){
  if(node){try{node.stop();}catch(_){}try{node.disconnect();}catch(_){}}
 }
 noiseSource=null;drone=null;
 if(noiseFilter){noiseFilter.disconnect();noiseFilter=null;}
 if(droneGain){droneGain.disconnect();droneGain=null;}
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
 // Shared two-second mono texture (~350 KB at 44.1 kHz), not eight decoded tracks.
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
 noiseSource=ctx.createBufferSource();noiseSource.buffer=buffer(ctx);noiseSource.loop=true;
 noiseFilter=ctx.createBiquadFilter();noiseFilter.type='lowpass';noiseFilter.frequency.value=spec[3];
 const noiseGain=ctx.createGain();noiseGain.gain.value=spec[4];
 noiseSource.connect(noiseFilter);noiseFilter.connect(noiseGain);noiseGain.connect(master);
 noiseSource.start();
 if(spec[5]){
  drone=ctx.createOscillator();drone.type=scene==='ocean'?'sine':'triangle';
  drone.frequency.value=spec[5];
  droneGain=ctx.createGain();droneGain.gain.value=scene==='thunder'?0.012:0.008;
  drone.connect(droneGain);droneGain.connect(master);drone.start();
 }
}
async function play(){
 if(document.hidden)return false;
 const ctx=ensureContext();
 // Call resume in the user's click handler, per Chromium autoplay policy.
 if(ctx.state!=='running')await ctx.resume();
 if(playing)return true;
 build(prefs.scene);master.gain.value=prefs.volume*0.36;
 playing=true;return true;
}
async function pause(){
 playing=false;stopNodes();
 if(master)master.gain.value=0;
 if(context&&context.state==='running')await context.suspend();
}
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
 if(!prefs.sfx||document.hidden||!context||context.state!=='running')return;
 const osc=context.createOscillator(),gain=context.createGain();
 osc.type='sine';osc.frequency.setValueAtTime(720,context.currentTime);
 osc.frequency.exponentialRampToValueAtTime(490,context.currentTime+0.045);
 gain.gain.setValueAtTime(Math.max(0.0001,prefs.sfxVolume*0.06),context.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.0001,context.currentTime+0.05);
 osc.connect(gain);gain.connect(context.destination);
 osc.start();osc.stop(context.currentTime+0.055);
 osc.onended=()=>{osc.disconnect();gain.disconnect();};
}
function controls(sheet,rtl){
 const section=document.createElement('section');section.className='lt-audio-settings';
 const heading=document.createElement('h3');heading.textContent=rtl?'🎧 أجواء القراءة':'🎧 Reading ambience';
 section.appendChild(heading);
 const note=document.createElement('p');note.className='quiet';
 note.textContent=rtl?'أصوات مولّدة محليًا للتجربة؛ ليست تسجيلات أو موسيقى مرخّصة. صامتة افتراضيًا، وتبدأ فقط عند الضغط على تشغيل.':'Original synthesized ambience previews, not licensed recordings or music. Silent by default; starts only when you press Play.';
 section.appendChild(note);
 const sceneLabel=document.createElement('label');sceneLabel.className='lt-font-setting';
 const caption=document.createElement('span');caption.textContent=rtl?'الأجواء':'Soundscape';
 sceneLabel.appendChild(caption);
 const select=document.createElement('select');select.setAttribute('aria-label',caption.textContent);
 for(const scene of SCENES){
  const option=document.createElement('option');option.value=scene[0];option.textContent=rtl?scene[2]:scene[1];select.appendChild(option);
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
document.addEventListener('click',event=>{if(event.target?.closest?.('button'))clickSound();});
global.LinguaAmbience={SCENES:SCENES.map(s=>({id:s[0],en:s[1],ar:s[2]})),
 controls,play,pause,selectScene,setVolume,setSfx,setSfxVolume,
 prefs:()=>({...prefs}),isPlaying:()=>playing,hasContext:()=>!!context};
})(window);
