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
assert.ok(html.indexOf('lingua-ambience.js')<html.indexOf('lingua-licensed-audio.js'));
assert.ok(html.indexOf('lingua-licensed-audio.js')<html.indexOf('lingua-shell.js'));
assert.ok(shell.includes('global.LinguaLicensedAudio.controls(sheet,rtl())'));
assert.ok(workflow.includes('python3 tools/fetch_licensed_audio.py'));
assert.ok(workflow.includes('node tools/licensed-audio.test.cjs'));
assert.ok(license.includes('CC BY 4.0')&&license.includes('Oculus Audio Pack 01'));
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
const loopTracks=manifest.tracks.filter(x=>x.kind==='loop');
const effects=manifest.tracks.filter(x=>x.kind==='oneshot');
assert.ok(loopTracks.every(x=>script.includes(x.id)&&script.includes(x.file)));
assert.ok(effects.every(x=>script.includes(x.id)&&script.includes(x.file)));

let focusGranted=true,focusRequests=0,focusReleases=0,proceduralPlaying=false,proceduralPauses=0,proceduralPlays=0;
let rejectNextPlay=false;
const instances=[];
class FakeAudio{
 constructor(src){this.src=src;this.loop=false;this.volume=1;this.preload='auto';this.paused=true;this.currentTime=0;this.listeners={};instances.push(this);}
 addEventListener(name,cb){(this.listeners[name]||(this.listeners[name]=[])).push(cb);}
 async play(){if(rejectNextPlay){rejectNextPlay=false;throw new Error('synthetic decode failure');}this.paused=false;return Promise.resolve();}
 pause(){this.paused=true;}
 emit(name){for(const cb of this.listeners[name]||[])cb();}
}
const document={hidden:false,listeners:{},createElement(){return {children:[],appendChild(x){this.children.push(x);},setAttribute(){},addEventListener(){},className:'',textContent:'',value:'',type:'',min:'',max:'',step:'',disabled:false};},addEventListener(name,cb){this.listeners[name]=cb;}};
const window={
 Audio:FakeAudio,document,listeners:{},addEventListener(name,cb){this.listeners[name]=cb;},
 get(key,def){return key==='licensedAudioPrefs'?{track:'forest',volume:0.24,sfxVolume:0.18}:def;},put(){},
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
 assert.equal(audio.selectTrack('missing'),false);
 assert.equal(audio.selectTrack('ocean-waves'),true);
 audio.setVolume(2);assert.equal(audio.prefs().volume,1,'volume is clamped');
 audio.setVolume(0.24);
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
 assert.equal(instances.length,beforeRejectedPlay+1);
 const failedPlayInstance=instances.at(-1);
 const beforeRetry=instances.length;
 assert.equal(await audio.playTrack('lake-shore'),true);
 assert.equal(instances.length,beforeRetry+1,'rejected play must discard cached Audio element');
 assert.notEqual(instances.at(-1),failedPlayInstance);

 // A later media error must also evict a cached element even when its original
 // playback ticket is stale; an error from a replaced element must be ignored.
 const failedEventInstance=instances.at(-1);
 failedEventInstance.emit('error');
 assert.equal(audio.isPlaying(),false,'current media error must stop active playback');
 const beforeErrorRetry=instances.length;
 assert.equal(await audio.playTrack('lake-shore'),true);
 assert.equal(instances.length,beforeErrorRetry+1,'media error must discard cached Audio element');
 const staleInstance=instances.at(-1);
 assert.equal(await audio.playTrack('forest'),true,'switching ambience should create a new current player');
 const activeAfterSwitch=instances.at(-1);
 staleInstance.emit('error');
 assert.equal(audio.isPlaying(),true,'late error from replaced player must not stop current ambience');
 assert.equal(instances.at(-1),activeAfterSwitch);
 await audio.pause();

 const beforeSfx=instances.length;
 assert.equal(await audio.playSfx('page-turn'),true);
 assert.equal(instances.length,beforeSfx+1);
 assert.equal(instances.at(-1).loop,false,'short effects never loop');
 assert.ok(instances.at(-1).src.endsWith('licensed-audio/page-turn.ogg'));
 instances.at(-1).emit('ended');
 assert.ok(focusReleases>=2,'one-shot effect releases focus after it ends when no ambience is playing');
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
 console.log('PASS LT-11: 20 pinned CC-BY ambience loops + 4 licensed one-shot effects, retry-safe player errors, focus denial/loss, lifecycle and exclusive playback.');
})().catch(error=>{console.error(error);process.exitCode=1});
