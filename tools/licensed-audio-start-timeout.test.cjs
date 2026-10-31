'use strict';
// Reproduce the WebView case in which Audio.play() never resolves or rejects.
// The user's next tap must regain control without leaking a timer/audio focus.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/main/assets/lingua-licensed-audio.js','utf8');
let mode='hang',uid=0,focus=0,released=0;
const timers=new Map(),instances=[];
class FakeAudio{
 constructor(src){this.src=src;this.paused=true;this.currentTime=0;this.readyState=4;this.listeners={};instances.push(this);}
 addEventListener(k,fn){(this.listeners[k]||(this.listeners[k]=[])).push(fn);}
 play(){this.paused=false;return mode==='hang'?new Promise(()=>{}):Promise.resolve();}
 pause(){this.paused=true;}
}
const document={hidden:false,addEventListener(){},createElement(tag){return {tag,children:[],appendChild(n){this.children.push(n);},setAttribute(){},addEventListener(){}};}};
const window={document,Audio:FakeAudio,get:(k,d)=>d,put(){},addEventListener(){},
 LinguaTalesAudioFocus:{requestFocus(){focus++;return true;},releaseFocus(){released++;}},
 setTimeout(fn,ms){assert.equal(ms,12000);let id=++uid;timers.set(id,fn);return id;},
 clearTimeout(id){timers.delete(id);}
};
vm.runInNewContext(source,{window},{filename:'audio-timeout-production.js'});
const audio=window.LinguaLicensedAudio;
(async()=>{
 const startup=audio.playTrack('forest');
 await Promise.resolve();
 assert.equal(timers.size,1,'pending offline audio has one bounded startup deadline');
 const [id,timeout]=[...timers.entries()][0];
 timers.delete(id);timeout();
 await assert.rejects(startup,/12 seconds/,'hung decoder rejects with a clear retry diagnostic');
 assert.equal(audio.isPlaying(),false,'failed startup must not claim playback');
 assert.equal(instances[0].paused,true,'hung media element is explicitly paused');
 assert.equal(released,1,'native audio focus is released on timeout');
 mode='ready';
 assert.equal(await audio.playTrack('forest'),true,'retry opens a working media element');
 assert.notEqual(instances[1],instances[0],'broken decoder is evicted before retry');
 assert.equal(timers.size,0,'successful retry clears startup deadline');
 await audio.pause();
 assert.equal(released,2,'manual pause releases focus once');
 assert.equal(timers.size,0,'no startup timer survives manual pause');
 assert.equal(focus,2,'both attempts acquire focus only after explicit calls');
 console.log('PASS: hung offline play() times out, evicts decoder, frees focus and permits safe manual retry');
})().catch(error=>{console.error(error);process.exitCode=1;});
