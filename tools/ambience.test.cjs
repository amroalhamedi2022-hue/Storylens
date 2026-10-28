'use strict';
/* LT-11 functional Web Audio graph smoke; synthetic browser AudioContext only.
 * This does NOT test acoustic quality, Android audio focus or physical Pad 5. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assets=path.join(__dirname,'../app/src/main/assets');
const script=fs.readFileSync(path.join(assets,'lingua-ambience.js'),'utf8');
const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');
const shell=fs.readFileSync(path.join(assets,'lingua-shell.js'),'utf8');
const backup=fs.readFileSync(path.join(assets,'data-backup.js'),'utf8');
const css=fs.readFileSync(path.join(assets,'lingua-shell.css'),'utf8');
assert.ok(html.includes('<script src="lingua-ambience.js"></script><script src="lingua-licensed-audio.js"></script><script src="lingua-shell.js"></script>'));
assert.ok(shell.includes('LinguaAmbience.controls(sheet,rtl())'));
assert.ok(shell.includes("'velvet-theatre'"));
assert.ok(backup.includes("tail==='audioPrefs'"));
assert.ok(css.includes('body.theme-velvet-theatre'));
assert.ok(!script.includes('getUserMedia')&&!script.includes('fetch('));
let created=0,starts=0,stops=0,nextTimer=0,gainDisconnects=0;
const intervals=new Map();
const listeners={},stored={};
const node=(kind='node')=>({connect(){return this},disconnect(){if(kind==='gain')gainDisconnects++;},start(){starts++},stop(){stops++},
 frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},
 gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},onended:null});
class FakeAudioContext {
 constructor(){created++;this.state='suspended';this.sampleRate=8000;this.currentTime=1;this.destination=node()}
 createGain(){return node('gain')}
 createBuffer(ch,len){return {getChannelData(){return new Float32Array(len)}}}
 createBufferSource(){return node()}
 createBiquadFilter(){return node()}
 createOscillator(){return node()}
 async resume(){this.state='running'}
 async suspend(){this.state='suspended'}
}
const document={hidden:false,addEventListener(name,cb){listeners['doc:'+name]=cb},createElement(){}};
const window={AudioContext:FakeAudioContext,addEventListener(name,cb){listeners['win:'+name]=cb},
 setInterval(cb){const id=++nextTimer;intervals.set(id,cb);return id;},clearInterval(id){intervals.delete(id)}};
const sandbox={window,document,Math,Number,Set,get:(k,def)=>stored[k]||def,put:(k,v)=>{stored[k]=v}};
vm.runInNewContext(script,sandbox);
const audio=window.LinguaAmbience;
assert.equal(created,0,'silent cold start, no AudioContext');
assert.equal(audio.isPlaying(),false);
assert.equal(audio.SCENES.length,24,'20 original ambience scenes plus four original melodic presets');
assert.equal(audio.SCENES.filter(s=>s.type==='music').length,4,'four presets must generate a real note sequence');
assert.equal(audio.SCENES.filter(s=>s.type==='ambience').length,20,'all original ambience scenes remain available');
assert.equal(new Set(audio.SCENES.map(s=>s.id)).size,24,'all ambience and melodic preset identifiers are distinct');
assert.ok(audio.SCENES.every(s=>s.en&&s.ar),'bilingual scene labels');
assert.equal(audio.selectScene('evil'),false);
assert.equal(audio.selectScene('ocean'),true);
audio.setVolume(2);
assert.equal(audio.prefs().volume,1,'volume clamped');
audio.setSfx(true);
assert.equal(created,0,'no audio created by settings change');
(async()=>{
 assert.equal(await audio.play(),true);
 assert.equal(created,1);
 assert.equal(audio.isPlaying(),true);
 assert.ok(starts>=2,'loop and oscillator connected');
 assert.equal(await audio.play(),true);
 assert.equal(created,1,'reuse one context');
 audio.selectScene('quiet-keys');
 assert.equal(intervals.size,1,'melodic preset schedules one bounded timer');
 const gainsBeforeMelodyCleanup=gainDisconnects;
 const startsBeforeMelodyTick=starts;[...intervals.values()][0]();
 assert.ok(starts>startsBeforeMelodyTick,'melody timer emits a note rather than only filtered noise');
 audio.selectScene('rain');
 assert.equal(intervals.size,0,'switching back to ambience clears the melody timer');
 assert.ok(gainDisconnects>gainsBeforeMelodyCleanup,'scene switch disconnects melodic envelope gains, not only oscillators');
 for(const scene of audio.SCENES)assert.equal(audio.selectScene(scene.id),true);
 audio.selectScene('rain');
 assert.ok(stops>=20,'previous soundscape nodes stopped on each switch');
 await audio.pause();
 assert.equal(audio.isPlaying(),false);
 assert.equal(intervals.size,0,'pause releases any melodic timer');
 // A bubbling click on the ambience Pause/Play control must not schedule a second
 // one-shot SFX or resume the just-paused AudioContext behind the user's back.
 const startsBeforeAudioControlClick=starts;
 const audioSettingsButton={closest(selector){return selector==='.lt-audio-settings'?{}:null;}};
 listeners['doc:click']({target:{closest(selector){return selector==='button'?audioSettingsButton:null;}}});
 assert.equal(starts,startsBeforeAudioControlClick,'audio settings clicks must not race their own pause/play lifecycle');
 assert.equal(await audio.play(),true);
 document.hidden=true;
 listeners['doc:visibilitychange']();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(audio.isPlaying(),false,'no background playback');
 assert.equal(await audio.play(),false,'hidden play denied');
 document.hidden=false;
 assert.equal(stored.audioPrefs.scene,'rain');
 assert.equal(stored.audioPrefs.sfx,true);
 // A visibility change while AudioContext.resume is pending must NOT
 // start a hidden audio graph when the delayed resume finally completes.
 let finishResume;
 const pending=new Promise(resolve=>{finishResume=resolve});
 let slowContext;
 class SlowAudioContext extends FakeAudioContext {
  constructor(){super();slowContext=this}
  async resume(){await pending;this.state='running'}
 }
 const hiddenListeners={};
 const doc2={hidden:false,addEventListener(name,cb){hiddenListeners[name]=cb}};
 const win2={AudioContext:SlowAudioContext,addEventListener(){},setInterval(cb){const id=++nextTimer;intervals.set(id,cb);return id;},clearInterval(id){intervals.delete(id)}};
 vm.runInNewContext(script,{window:win2,document:doc2,Math,Number,Set,get:()=>({}),put:()=>{}});
 const slow=win2.LinguaAmbience;
 const delayed=slow.play();
 doc2.hidden=true;hiddenListeners.visibilitychange();
 finishResume();
 assert.equal(await delayed,false,'no stale play after visibility pause');
 assert.equal(slow.isPlaying(),false,'no hidden soundscape graph');
 assert.equal(slowContext.state,'suspended','a late resume after visibility pause must not leave AudioContext running');

 // Native Android audio focus is a separate gate from Web Audio availability.
 // A denied focus request must not even create an AudioContext; focus loss pauses
 // playback and releases the grant. These are bridge-contract tests, not device audio.
 let focusGranted=false,focusRequests=0,focusReleases=0,focusContext;
 const focusListeners={};
 const focusDocument={hidden:false,addEventListener(name,cb){focusListeners[name]=cb}};
 class FocusAudioContext extends FakeAudioContext {constructor(){super();focusContext=this}}
 const focusWindow={AudioContext:FocusAudioContext,
  LinguaTalesAudioFocus:{requestFocus(){focusRequests++;return focusGranted},releaseFocus(){focusReleases++;}},
  addEventListener(){},setInterval(cb){const id=++nextTimer;intervals.set(id,cb);return id;},
  clearInterval(id){intervals.delete(id)}};
 vm.runInNewContext(script,{window:focusWindow,document:focusDocument,Math,Number,Set,
  get:()=>({}),put:()=>{}});
 const focusAudio=focusWindow.LinguaAmbience;
 focusAudio.setSfx(true);
 focusListeners.click({target:{closest:()=>({})}});
 assert.equal(focusRequests,1,'button SFX must request focus when no ambience is playing');
 assert.equal(focusAudio.hasContext(),false,'denied SFX focus must remain silent');
 assert.equal(await focusAudio.play(),false,'denied ambience focus must remain silent');
 assert.equal(focusRequests,2);
 assert.equal(focusAudio.hasContext(),false,'denied ambience focus must not create an AudioContext');
 focusGranted=true;
 assert.equal(await focusAudio.play(),true,'granted native focus permits opt-in ambience');
 assert.equal(focusRequests,3);
 assert.equal(focusAudio.isPlaying(),true);
 focusAudio.onNativeAudioFocusLoss();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(focusAudio.isPlaying(),false,'native focus loss pauses ambience');
 assert.equal(focusReleases,1,'pausing after focus loss abandons native focus');
 assert.equal(focusContext.state,'suspended');

 // A button SFX may call AudioContext.resume() just before Android revokes focus.
 // The delayed resume must not leave a new tone running after pause/focus loss.
 let finishSfxResume;
 const sfxResumeGate=new Promise(resolve=>{finishSfxResume=resolve});
 let sfxContext,sfxFocusReleases=0;
 const sfxListeners={};
 const sfxDocument={hidden:false,addEventListener(name,cb){sfxListeners[name]=cb}};
 class DelayedSfxContext extends FakeAudioContext{
  constructor(){super();sfxContext=this}
  async resume(){await sfxResumeGate;this.state='running'}
 }
 const sfxWindow={AudioContext:DelayedSfxContext,
  LinguaTalesAudioFocus:{requestFocus(){return true},releaseFocus(){sfxFocusReleases++}},
  addEventListener(){},setInterval(cb){const id=++nextTimer;intervals.set(id,cb);return id;},
  clearInterval(id){intervals.delete(id)}};
 vm.runInNewContext(script,{window:sfxWindow,document:sfxDocument,Math,Number,Set,
  get:()=>({}),put:()=>{}});
 const sfxAudio=sfxWindow.LinguaAmbience;
 sfxAudio.setSfx(true);
 const outsideButton={closest(selector){return selector==='.lt-audio-settings'?null:null}};
 sfxListeners.click({target:{closest(selector){return selector==='button'?outsideButton:null}}});
 assert.ok(sfxContext,'button SFX creates the audio context after explicit opt-in');
 sfxAudio.onNativeAudioFocusLoss();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(sfxFocusReleases,1,'focus loss releases the existing grant once');
 finishSfxResume();
 await new Promise(resolve=>setImmediate(resolve));
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(sfxContext.state,'suspended','late SFX resume must not leave AudioContext running after focus loss');
 assert.equal(sfxFocusReleases,1,'stale SFX completion must not release focus a second time');
 console.log('PASS LT-11: 24 offline procedural presets; native-focus denial/loss contract, lifecycle, volume, switching, cleanup and delayed-SFX resume race');
})().catch(e=>{console.error(e);process.exitCode=1});
