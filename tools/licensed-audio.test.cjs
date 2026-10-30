'use strict';
/* Tests the licensed-audio manifest, offline packaging contract and user-gesture lifecycle.
 * Fake Audio verifies control flow only; it does not establish acoustic/device acceptance. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('app/src/main/assets/index.html');
const shell=read('app/src/main/assets/lingua-shell.js');
const workflow=read('.github/workflows/android.yml');
const script=read('app/src/main/assets/lingua-licensed-audio.js');
const license=read('app/src/main/assets/LICENSE_AUDIO.txt');
const manifest=JSON.parse(read('app/src/main/assets/licensed-audio/manifest.json'));
const provenance=read('docs/ASSET_PROVENANCE_AUDIO.md');
assert.ok(html.indexOf('lingua-ambience.js')<html.indexOf('lingua-licensed-audio.js'));
assert.ok(html.indexOf('lingua-licensed-audio.js')<html.indexOf('lingua-shell.js'));
assert.ok(shell.includes('global.LinguaLicensedAudio.controls(sheet,rtl())'));
assert.ok(workflow.includes('python3 tools/fetch_licensed_audio.py'));
assert.ok(workflow.includes('node tools/licensed-audio.test.cjs'));
assert.ok(license.includes('CC BY 4.0')&&license.includes('Oculus Audio Pack 01'));
assert.ok(license.includes('All 24 selected OGG files'),'license attribution must describe the exact 20-loop + 4-effect pack');
assert.equal(manifest.tracks.length,24);
assert.equal(manifest.tracks.filter(x=>x.kind==='loop').length,20);
assert.equal(manifest.tracks.filter(x=>x.kind==='oneshot').length,4);
const expectedLoopIds=['forest','night-forest','quiet-room','lake-shore','coastal-waves','underwater','distant-city','book-cafe','rain-cabin','forest-rain','city-rain','ocean-waves','river-flow','waterfall','wind-birds','wind-chimes','farm','european-city','creek-in-woods','water-lapping'];
assert.deepEqual(manifest.tracks.filter(x=>x.kind==='loop').map(x=>x.id),expectedLoopIds,'the 20 licensed ambience choices remain ordered and complete');

assert.equal(manifest.license,'CC BY 4.0');
assert.equal(manifest.sourceCommit,'251c0be57d5d1b3242b91f53e0cde62ab1cb42d9');
assert.equal(new Set(manifest.tracks.map(x=>x.id)).size,24);
assert.equal(new Set(manifest.tracks.map(x=>x.file)).size,24);
for(const item of manifest.tracks){
 assert.ok(/^[a-z0-9-]+\.ogg$/.test(item.file));
 assert.equal(item.sourceCommit,manifest.sourceCommit);
 assert.match(item.gitBlobSha1,/^[a-f0-9]{40}$/);
 assert.ok(item.sizeBytes>0);
 assert.ok(item.en&&item.ar&&/[ء-ي]/.test(item.ar));
 const bytes=fs.readFileSync(path.join(assets,'licensed-audio',item.file));
 assert.equal(bytes.length,item.sizeBytes,'pinned byte length: '+item.id);
 assert.equal(bytes.subarray(0,4).toString('ascii'),'OggS','OGG signature: '+item.id);
}
assert.ok(!script.includes('fetch(')&&!script.includes('getUserMedia')&&!script.includes('speechSynthesis'));
assert.ok(script.includes('new global.Audio(\'licensed-audio/'));
assert.ok(script.includes('doc.addEventListener(\'visibilitychange\''));
assert.ok(script.includes('keepFocus:true'));
assert.ok(provenance.includes('20 looped ambience recordings and four short sound effects'));
for(const item of manifest.tracks){const row='| '+item.id+' | `'+item.file+'` | `'+item.sourceFile+'` | '+item.kind+' | '+item.sizeBytes+' | `'+item.gitBlobSha1+'` |';assert.ok(provenance.includes(row),'license provenance table must contain exact pinned source metadata: '+item.id);}
assert.ok(script.includes('lt-ambience-enabled')&&script.includes('lt-sfx-enabled'));
assert.ok(script.includes('lt-ambience-volume')&&script.includes('lt-sfx-volume'));
assert.ok(script.includes('lt-audio-disable-all')&&script.includes('function disableAll()'));
const loopTracks=manifest.tracks.filter(x=>x.kind==='loop');
const effects=manifest.tracks.filter(x=>x.kind==='oneshot');
assert.ok(loopTracks.every(x=>script.includes(x.id)&&script.includes(x.file)));
assert.ok(effects.every(x=>script.includes(x.id)&&script.includes(x.file)));

let focusGranted=true,focusRequests=0,focusReleases=0,proceduralPlaying=false,proceduralPauses=0,proceduralPlays=0;
let rejectNextPlay=false,deferNextPlay=false,resolveDeferredPlay=null,resolvePausedNextPlay=false;
const instances=[];
const persisted=[];
class FakeAudio{
 constructor(src){this.src=src;this.loop=false;this.volume=1;this.preload='auto';this.paused=true;this.currentTime=0;this.listeners={};instances.push(this);}
 addEventListener(name,cb){(this.listeners[name]||(this.listeners[name]=[])).push(cb);}
 async play(){
  if(rejectNextPlay){rejectNextPlay=false;throw new Error('synthetic decode failure');}
  if(deferNextPlay){deferNextPlay=false;this.paused=false;await new Promise(resolve=>{resolveDeferredPlay=resolve;});return;}
  if(resolvePausedNextPlay){resolvePausedNextPlay=false;this.paused=true;return;}
  this.paused=false;return Promise.resolve();
 }
 pause(){this.paused=true;}
 emit(name){for(const cb of this.listeners[name]||[])cb();}
}
class FakeElement{constructor(tag){this.tag=tag;this.children=[];this.listeners={};this.attributes={};this.className='';this.textContent='';this.value='';this.type='';this.id='';this.min='';this.max='';this.step='';this.disabled=false;this.checked=false;}appendChild(child){this.children.push(child);return child;}setAttribute(name,value){this.attributes[name]=String(value);}addEventListener(name,callback){(this.listeners[name]||(this.listeners[name]=[])).push(callback);}fire(name){for(const callback of this.listeners[name]||[])callback({target:this});}}
const document={hidden:false,listeners:{},createElement(tag){return new FakeElement(tag);},addEventListener(name,cb){this.listeners[name]=cb;}};
const window={
 Audio:FakeAudio,document,listeners:{},addEventListener(name,cb){this.listeners[name]=cb;},
 get(key,def){return key==='licensedAudioPrefs'?{track:'forest',volume:0.24,sfxVolume:0.18}:def;},put(key,value){persisted.push([key,value]);},
 LinguaTalesAudioFocus:{requestFocus(){focusRequests++;return focusGranted;},releaseFocus(){focusReleases++;}},
 LinguaAmbience:{
  isPlaying(){return proceduralPlaying;},
  async pause(options){proceduralPauses++;proceduralPlaying=false;return Promise.resolve();},
  async play(){proceduralPlays++;proceduralPlaying=true;return true;},
  onNativeAudioFocusLoss(){proceduralPlaying=false;}
 }
};
vm.runInNewContext(script,{window,Promise,Set,Math,Number});
const audio=window.LinguaLicensedAudio;
(async()=>{
 assert.equal(instances.length,0,'silent cold start');
 assert.equal(audio.TRACKS.length,20);
 assert.equal(audio.SFX.length,4);
 assert.equal(audio.isPlaying(),false);
 assert.equal(audio.prefs().ambienceEnabled,false,'legacy preferences default to silent ambience');
 assert.equal(audio.prefs().sfxEnabled,false,'legacy preferences default to silent SFX');
 const mutedBefore=instances.length;assert.equal(await audio.playSfx('page-turn'),false,'SFX cannot play until explicitly enabled');assert.equal(instances.length,mutedBefore,'disabled SFX creates no Audio instance');
 const controlsRoot=new FakeElement('section');audio.controls(controlsRoot,false);
 function findNode(node,predicate){if(predicate(node))return node;for(const child of node.children||[]){const found=findNode(child,predicate);if(found)return found;}return null;}
 const audioStatus=findNode(controlsRoot,node=>node.tag==='p'&&node.className==='quiet');
 assert.ok(audioStatus,'audio controls expose a status for playback diagnostics');
 const ambienceToggle=findNode(controlsRoot,node=>node.id==='lt-ambience-enabled'),sfxToggle=findNode(controlsRoot,node=>node.id==='lt-sfx-enabled');
 const ambienceSlider=findNode(controlsRoot,node=>node.id==='lt-ambience-volume'),sfxSlider=findNode(controlsRoot,node=>node.id==='lt-sfx-volume'),disableAllButton=findNode(controlsRoot,node=>node.id==='lt-audio-disable-all');
 assert.ok(ambienceToggle&&sfxToggle&&ambienceSlider&&sfxSlider&&disableAllButton,'Settings exposes two switches, two sliders and disable-all');
 assert.equal(ambienceToggle.checked,false);assert.equal(sfxToggle.checked,false);assert.equal(ambienceSlider.value,'0.24');assert.equal(sfxSlider.value,'0.18');
 assert.equal(findNode(controlsRoot,node=>node.textContent==='Page turns').disabled,true,'SFX buttons stay disabled until opted in');
 ambienceToggle.checked=true;ambienceToggle.fire('change');await new Promise(resolve=>setImmediate(resolve));assert.equal(audio.prefs().ambienceEnabled,true);assert.equal(instances.length,mutedBefore,'enabling ambience never autoplays');
 ambienceToggle.checked=false;ambienceToggle.fire('change');await new Promise(resolve=>setImmediate(resolve));assert.equal(audio.prefs().ambienceEnabled,false,'turning off ambience stops its engine');
 sfxToggle.checked=true;sfxToggle.fire('change');assert.equal(audio.prefs().sfxEnabled,true);assert.equal(findNode(controlsRoot,node=>node.textContent==='Page turns').disabled,false,'SFX controls enable only after opt-in');
 assert.ok(persisted.some(x=>x[0]==='licensedAudioPrefs'&&x[1].sfxEnabled===true),'audio opt-in persists locally');
 assert.equal(audio.selectTrack('missing'),false);
 assert.equal(audio.selectTrack('ocean-waves'),true);
 audio.setVolume(2);assert.equal(audio.prefs().volume,1,'ambience volume is clamped');audio.setVolume(0.24);
 audio.setSfxVolume(2);assert.equal(audio.prefs().sfxVolume,1,'SFX volume is clamped');audio.setSfxVolume(0.18);
 proceduralPlaying=true;
 assert.equal(await audio.playTrack('forest'),true);
 assert.ok(proceduralPauses>0,'licensed playback pauses the procedural engine without dropping focus first');
 assert.equal(proceduralPlaying,false);
 assert.equal(audio.isPlaying(),true);
 assert.equal(instances.at(-1).loop,true);
 assert.ok(instances.at(-1).src.endsWith('licensed-audio/forest-loop.ogg'));
 assert.equal(instances.at(-1).volume,0.24);
 await audio.pause();
 assert.equal(audio.isPlaying(),false);
 assert.equal(instances.at(-1).paused,true);
 assert.equal(focusReleases,1);

 // A rejected play() promise must evict the failed element, not cache it forever.
 rejectNextPlay=true;
 const beforeRejectedPlay=instances.length;
 await assert.rejects(()=>audio.playTrack('lake-shore'),/synthetic decode failure/);
 assert.equal(audio.isPlaying(),false);
 assert.match(audioStatus.textContent,/synthetic decode failure|Error/i,'failed playback remains visible after UI refresh');
 audio.setVolume(.31);
 assert.match(audioStatus.textContent,/synthetic decode failure|Error/i,'slider refresh cannot hide decoder failure');
 audio.setVolume(.24);
 assert.equal(instances.length,beforeRejectedPlay+1);
 const failedPlayInstance=instances.at(-1);
 const beforeRetry=instances.length;
 assert.equal(await audio.playTrack('lake-shore'),true);
 assert.equal(instances.length,beforeRetry+1,'rejected play must discard cached Audio element');
 assert.notEqual(instances.at(-1),failedPlayInstance);

 // A later media error must also evict a cached element even when its original
 // playback ticket is stale; an error from a replaced element must be ignored.
 const failedEventInstance=instances.at(-1);
 failedEventInstance.error={code:3};
 failedEventInstance.emit('error');
 assert.equal(audio.isPlaying(),false,'current media error must stop active playback');
 assert.match(audioStatus.textContent,/decoding failed|code 3/i,'native media error code is shown instead of silently wiped');
 const beforeErrorRetry=instances.length;
 assert.equal(await audio.playTrack('lake-shore'),true);
 assert.equal(instances.length,beforeErrorRetry+1,'media error must discard cached Audio element');
 const staleInstance=instances.at(-1);
 assert.equal(await audio.playTrack('forest'),true,'switching ambience should create a new current player');
 const activeAfterSwitch=instances.at(-1);
 staleInstance.emit('error');
 assert.equal(audio.isPlaying(),true,'late error from replaced player must not stop current ambience');
 assert.equal(instances.at(-1),activeAfterSwitch);
 activeAfterSwitch.paused=true;
 activeAfterSwitch.emit('pause');
 assert.equal(audio.isPlaying(),false,'unexpected Chromium pause reconciles UI with actual audio state');
 assert.match(audioStatus.textContent,/unexpectedly interrupted/i,'unexpected pause is explained visibly');
 assert.equal(await audio.playTrack('forest'),true,'paused player is retryable');
 assert.match(audioStatus.textContent,/licensed recorded ambiences/i,'successful retry clears the diagnostic');
 await audio.pause();

 // Overlapping taps on one track must not let an older play() completion
 // pause the current stream (a real WebView race on slow media startup).
 deferNextPlay=true;
 const oldRequest=audio.playTrack('forest');
 assert.equal(typeof resolveDeferredPlay,'function','first play is still pending');
 const newestRequest=audio.playTrack('forest');
 assert.equal(await newestRequest,true,'newest tap can start the same track');
 resolveDeferredPlay();
 assert.equal(await oldRequest,false,'superseded play resolves without taking ownership');
 assert.equal(audio.isPlaying(),true,'older completion must not silence the newer stream');
 assert.equal(instances.at(-1).paused,false,'active HTMLAudioElement stays audible');
 await audio.pause();

 // Chromium can resolve play() after an immediate platform pause without
 // firing an observable error. Never report playback while paused.
 resolvePausedNextPlay=true;
 assert.equal(await audio.playTrack('night-forest'),false,'paused-after-resolve is not success');
 assert.equal(audio.isPlaying(),false,'UI must not lie about a paused decoder');
 assert.match(audioStatus.textContent,/unexpectedly interrupted/i,'interruption has a retry diagnostic');
 assert.equal(await audio.playTrack('night-forest'),true,'a fresh tap recovers');
 await audio.pause();

 const beforeSfx=instances.length;
 audio.setSfxVolume(0.4);
 assert.equal(await audio.playSfx('page-turn'),true);
 assert.equal(instances.length,beforeSfx+1);
 assert.equal(instances.at(-1).loop,false,'short effects never loop');
 assert.ok(instances.at(-1).src.endsWith('licensed-audio/page-turn.ogg'));
 assert.equal(instances.at(-1).volume,0.4);
 audio.setSfxVolume(0.33);assert.equal(instances.at(-1).volume,0.33,'SFX slider updates active one-shots');
 instances.at(-1).emit('ended');
 assert.ok(focusReleases>=2,'one-shot effect releases focus after it ends when no ambience is playing');
 sfxToggle.checked=false;sfxToggle.fire('change');assert.equal(audio.prefs().sfxEnabled,false);
 const afterSfxOff=instances.length;assert.equal(await audio.playSfx('page-turn'),false,'turning SFX off blocks new one-shots');assert.equal(instances.length,afterSfxOff);
 sfxToggle.checked=true;sfxToggle.fire('change');
 focusGranted=false;
 const beforeDenied=instances.length;
 assert.equal(await audio.playTrack('night-forest'),false);
 assert.equal(instances.length,beforeDenied,'denied focus must not create or start a player');
 focusGranted=true;
 assert.equal(await audio.playTrack('night-forest'),true);
 const current=instances.at(-1);
 document.hidden=true;document.listeners.visibilitychange();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(audio.isPlaying(),false,'backgrounding pauses licensed audio');
 assert.equal(current.paused,true);
 assert.equal(await audio.playTrack('forest'),false,'hidden page cannot start audio');
 document.hidden=false;
 assert.equal(await window.LinguaAmbience.play(),true,'procedural engine can take over after licensed playback');
 assert.equal(proceduralPlaying,true);
 assert.equal(audio.isPlaying(),false,'the two background engines never play simultaneously');
 assert.ok(proceduralPlays>0);
 proceduralPlaying=false;
 assert.equal(await audio.playTrack('forest'),true,'licensed playback can take focus back');
 const focusBeforeLoss=focusRequests;
 window.LinguaAmbience.onNativeAudioFocusLoss();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(audio.isPlaying(),false,'native focus loss pauses licensed audio');
 assert.equal(await audio.playTrack('forest'),true,'licensed playback can resume after focus is reacquired');
 assert.equal(focusRequests,focusBeforeLoss+1,'focus loss must invalidate the licensed module ownership bit');
 await audio.pause();
 await window.LinguaAmbience.play();assert.equal(proceduralPlaying,true);
 assert.equal(await audio.disableAll(),true);assert.equal(audio.prefs().ambienceEnabled,false);assert.equal(audio.prefs().sfxEnabled,false);assert.equal(audio.isPlaying(),false);assert.equal(proceduralPlaying,false,'disable-all also stops the procedural ambience engine');
 assert.equal(ambienceToggle.checked,false);assert.equal(sfxToggle.checked,false);assert.equal(findNode(controlsRoot,node=>node.textContent==='Page turns').disabled,true);
 console.log('PASS LT-11: 20 pinned CC-BY ambience loops + 4 licensed one-shot effects, independent opt-in switches/volumes, disable-all, retry-safe player errors, focus and lifecycle.');
})().catch(error=>{console.error(error);process.exitCode=1});
