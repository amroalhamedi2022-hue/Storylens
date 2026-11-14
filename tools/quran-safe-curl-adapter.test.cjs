'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {QuranSafeCurlAdapter,checkedPageNumber}=require('../app/src/main/assets/quran-safe-curl-adapter.js');
assert.throws(()=>checkedPageNumber(0));
assert.throws(()=>checkedPageNumber(605));
assert.equal(checkedPageNumber(604),604);
(async()=>{
 const source=Buffer.from('PNG test bytes; deliberately not sacred content');
 const hash=crypto.createHash('sha256').update(source).digest('hex');
 let uploaded=0,turned=0;
 const engine={setTextures(){uploaded++},startTurn(){turned++}};
 const env={
  crypto:crypto.webcrypto,
  createImageBitmap:async()=>({close(){}})
 };
 const provider={
  manifestTrusted:true,getExpectedHash:()=>hash,
  getVerifiedPageBitmap:async()=>({encodedBytes:source})
 };
 const adapter=new QuranSafeCurlAdapter(engine,provider,env);
 assert.equal(await adapter.initiateTurn({current:1,next:2},1),true);
 assert.equal(uploaded,1);assert.equal(turned,1);
 provider.getExpectedHash=()=>('f'.repeat(64));
 await assert.rejects(adapter.initiateTurn({current:1,next:2},-1),/SECURITY HALT/);
 assert.equal(uploaded,1,'no GPU handoff after failed digest');
 provider.manifestTrusted=false;
 await assert.rejects(adapter.initiateTurn({current:1,next:2},1),/SECURITY HALT/);
 console.log('PASS: fail-closed verified Quran bitmap adapter; no Quran text was accessed');
})().catch(e=>{console.error(e);process.exitCode=1});
