'use strict';
// Production playback watchdog exercised with a deterministic fake media clock.
// Control-flow evidence only; audible Android playback still requires device QA.
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('app/src/main/assets/lingua-licensed-audio.js','utf8');
const timers=new Map(),all=new Map(),instances=[];
let next=0,focusRequests=0,focusReleases=0;
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.listeners={};
  this.textContent='';this.className='';this.value='';this.checked=false;}
 appendChild(x){this.children.push(x);return x;}
 setAttribute(k,v){this.attributes[k]=v;}
 addEventListener(k,f){(this.listeners[k]||(this.listeners[k]=[])).push(f);}
}
class Audio{
 constructor(src){instances.push(this);this.src=src;this.currentTime=0;
  this.readyState=4;this.paused=true;this.listeners={};}
 addEventListener(k,f){(this.listeners[k]||(this.listeners[k]=[])).push(f);}
 play(){this.paused=false;return Promise.resolve();}
 pause(){this.paused=true;}
 emit(k){for(const f of this.listeners[k]||[])f();}
}
const document={hidden:false,createElement:tag=>new Element(tag),addEventListener(){}};
const window={
 document,Audio,get:(key,fallback)=>fallback,put(){},addEventListener(){},
 LinguaTalesAudioFocus:{
  requestFocus(){focusRequests++;return true;},
  releaseFocus(){focusReleases++;}
 },
 setInterval(fn,ms){
  assert.equal(ms,2000,'bounded, low-frequency audio check');
  const id=++next;timers.set(id,fn);all.set(id,fn);return id;
 },
 clearInterval(id){timers.delete(id);}
};
vm.runInNewContext(source,{window},{filename:'production-licensed-audio.js'});
const player=window.LinguaLicensedAudio;
const root=new Element('root'),section=player.controls(root,false);
const info=section.children.find(x=>x.className==='quiet');
assert.ok(info,'visible bilingual playback diagnostics exist');
const tick=()=>{for(const f of [...timers.values()])f();};
(async()=>{
 assert.equal(await player.playTrack('forest'),true);
 assert.equal(timers.size,1,'monitor begins after successful user-started playback');
 const old=[...all.values()][0];
 for(let i=0;i<3;i++)tick();
 assert.equal(player.isPlaying(),true,'do not misdiagnose brief buffering');
 tick();
 assert.equal(player.isPlaying(),false,'stalled, unpaused element is detected');
 assert.match(info.textContent,/stalled/i,'user receives actionable diagnostic');
 assert.equal(timers.size,0,'stalled stream stops its interval');
 assert.equal(focusReleases,1,'stalled stream releases native focus exactly once');
 const oldPlayer=instances.at(-1);
 assert.equal(oldPlayer.paused,true,'stalled stream is stopped before retry');
 assert.equal(await player.playTrack('forest'),true);
 assert.notEqual(instances.at(-1),oldPlayer,'retry opens a fresh audio decoder');
 old();
 assert.equal(player.isPlaying(),true,'already-queued old timer cannot stop new playback');
 const current=instances.at(-1);
 current.currentTime=1.3;tick();
 for(let i=0;i<8;i++){current.emit('timeupdate');tick();}
 assert.equal(player.isPlaying(),true,'genuine loop ticks avoid false stalled status');
 current.readyState=1;
 for(let i=0;i<8;i++)tick();
 assert.equal(player.isPlaying(),true,'low readiness indicates buffering, not definite failure');
 current.readyState=4;current.currentTime=2.7;tick();
 for(let i=0;i<3;i++)tick();
 assert.equal(player.isPlaying(),true,'three stalled polls are tolerated');
 await player.pause();
 assert.equal(timers.size,0,'manual pause has no background polling');
 assert.equal(await player.playTrack('forest'),true);
 document.hidden=true;tick();
 assert.equal(timers.size,0,'hidden reader stops interval, protecting battery');
 document.hidden=false;
 await player.pause();
 assert.equal(timers.size,0,'all monitors cleared on pause');
 assert.ok(focusRequests>=2);
 console.log('PASS: licensed audio watchdog detects decoder stall, preserves buffering, loops, safe retry and timers');
})().catch(error=>{console.error(error);process.exitCode=1;});
