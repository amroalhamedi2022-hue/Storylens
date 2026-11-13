#!/usr/bin/env node
/* OFFLINE TEST ONLY: replay a pre-existing historical WebP through a mocked image
 * provider. This is NOT newly generated art and must never be committed or shipped.
 * It exercises actual source-binding, image file, review SHA, and queue-state writes.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const {verified,record}=require('./story_art_queue_60.cjs');
const {main:generate}=require('./generate_story_art_openai.cjs');
const statePath=path.join(ROOT,'docs/art-generation/production-run-state.json');
const fixture=path.join(ROOT,'docs/art-generation/review/2026-11-10/verne-ch01-saville-house-full.webp');
async function run(){
 const v=verified();
 const job=v.q.items.find(i=>i.sceneId&&i.chapterOneBased>=5&&i.status==='ready_for_generation'&&
   Array.isArray(i.charactersPresent)&&!i.charactersPresent.length&&
   !v.s.candidates.some(c=>c.queueId===i.queueId));
 if(!job){console.log('SKIP: no suitable noncharacter, ungenerated review task to exercise');return;}
 const file='docs/art-generation/review/'+job.bookId+'/'+job.sceneId+'.webp';
 const target=path.join(ROOT,file),meta=target+'.review.json';
 assert(!fs.existsSync(target)&&!fs.existsSync(meta),'test refuses to overwrite a real candidate');
 assert(fs.existsSync(fixture),'need existing verified WebP fixture');
 const original=fs.readFileSync(statePath);
 const fixtureData=fs.readFileSync(fixture),hash=crypto.createHash('sha256').update(fixtureData).digest('hex');
 const prior=process.env.OPENAI_API_KEY;
 let calls=0;
 const fakeTransport=async(url,options)=>{
  calls++;
  assert.match(url,/^https:\/\/api\.openai\.com\/v1\/images\/generations$/);
  assert.equal(options.method,'POST');
  const request=JSON.parse(options.body);
  assert.equal(request.n,1);
  assert.ok(request.prompt.includes(job.sourceExcerpt),'provider did not receive exact source scene');
  assert.ok(request.prompt.includes(job.description),'provider did not receive scene specification');
  return {ok:true,status:200,json:async()=>({data:[{b64_json:fixtureData.toString('base64')}],usage:null})};
 };
 try{
  process.env.OPENAI_API_KEY='FAKE_OFFLINE_TEST_CREDENTIAL_NOT_USED';
  await generate(['--queue-scenes','--scene',job.sceneId,'--execute','--confirm-paid'],fakeTransport);
  assert.equal(calls,1);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'),hash);
  const metaDoc=JSON.parse(fs.readFileSync(meta,'utf8'));
  assert.equal(metaDoc.outputSha256,hash);
  assert.equal(metaDoc.releaseApproved,false);
  const registered=record(v,job.queueId,file);
  assert.equal(registered.status,'generated_candidate');
  assert.equal(registered.sha256,hash);
  const state=JSON.parse(fs.readFileSync(statePath,'utf8'));
  assert.ok(state.candidates.some(c=>c.queueId===job.queueId&&c.sha256===hash));
  assert.ok(state.candidates.every(c=>!c.releaseApproved));
  console.log('PASS MOCK ONLY: one WebP + source-matched descriptor + SHA + candidate state persisted and protected; no actual image generated, no API invoked, no publication.');
 }finally{
  fs.writeFileSync(statePath,original);
  if(fs.existsSync(meta))fs.unlinkSync(meta);
  if(fs.existsSync(target))fs.unlinkSync(target);
  if(prior===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=prior;
 }
}
run().catch(e=>{console.error('FAIL offline mock: '+e.message);process.exitCode=1;});
