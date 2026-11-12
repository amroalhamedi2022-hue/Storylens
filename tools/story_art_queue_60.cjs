#!/usr/bin/env node
/* Lingua Tales: bounded, fail-closed 60-scene queue runner.
 * Usage: node tools/story_art_queue_60.cjs --check | --next | --produce | --record <queueId> <relative-WebP> | --reject <queueId> <REASON>
 * --produce is PAID and impossible without explicit opt-in, API key AND approved, hashed visual references.
 * Only review candidates may be recorded, never release approval or app assets.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),child=require('node:child_process');
const {run:readVerifiedColorQueue}=require('./prepare_color_scene_queue.cjs');
const {sourceChapters}=require('./story_art_pilot.cjs');
const ROOT=path.resolve(__dirname,'..');
const QPATH=path.join(ROOT,'docs/art-generation/production-queue-60.json');
const SPATH=path.join(ROOT,'docs/art-generation/production-run-state.json');
const BPATH=path.join(ROOT,'docs/art-generation/character-bibles/verne-main-cast-v1.json');
const REVIEW=path.join(ROOT,'docs/art-generation/review');
const ALLOWED=new Set(['existing_candidate_review','ready_for_generation','needs_source_verification','needs_chapter_segmentation']);
const HASH=/^[0-9a-f]{64}$/i;
function json(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function assert(value,message){if(!value)throw Error(message);}
function sha(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function safeRel(file){assert(typeof file==='string'&&!path.isAbsolute(file)&&!file.includes('\\'),'unsafe relative path');const full=path.resolve(ROOT,file);assert(full.startsWith(ROOT+path.sep),'path escapes repository');return full;}
function writeAtomic(file,data){const t=file+'.'+process.pid+'.tmp';fs.writeFileSync(t,JSON.stringify(data,null,2)+'\n',{flag:'wx'});fs.renameSync(t,file);}
function verifyExtraScene(item,b){
 assert(item.bookId==='around-the-world-in-eighty-days-towle','new original scenes require a book-specific source verifier');
 const ch=item.chapterOneBased,idx=item.paragraphZeroBased;
 assert(Number.isInteger(ch)&&ch>=5&&ch<=37&&Number.isInteger(idx)&&idx>=0,'unverifiable chapter/paragraph');
 assert(typeof item.sceneId==='string'&&new RegExp('^verne-ch'+String(ch).padStart(2,'0')+'-color-[a-z0-9-]+
 const q=json(QPATH),s=json(SPATH),b=json(BPATH);
 assert(q.schemaVersion===1&&q.queueVersion===s.queueVersion,'queue/state version mismatch');
 assert(Array.isArray(q.items)&&q.items.length===60,'queue must contain exactly 60 slots');
 assert(s.schemaVersion===1&&typeof s.attempts==='object'&&Array.isArray(s.candidates),'invalid state');
 assert(b.schemaVersion===1&&b.bibleId==='verne-main-cast-v1','character bible missing/version mismatch');
 const checked=readVerifiedColorQueue(['--check']).queue;
 const colorMap=new Map(checked.map(x=>[x.sceneId,x]));
 const ids=new Set(),scenes=new Set(),anchors=new Set();
 for(const [index,i] of q.items.entries()){
  assert(i&&typeof i.queueId==='string'&&/^[a-z]+-\d{3}$/.test(i.queueId)&&!ids.has(i.queueId),'invalid/duplicated queue id');
  ids.add(i.queueId);
  assert(ALLOWED.has(i.status),'unknown queue status '+i.queueId);
  assert(typeof i.bookId==='string'&&i.bookId.length>8,'missing genuine book id');
  assert(i.releaseApproved!==true&&i.editoriallyApproved!==true,'queue cannot auto-approve art');
  if(index<6){
   const color=colorMap.get(i.sceneId);
   assert(color&&!scenes.has(i.sceneId),'missing/duplicated source-checked color scene');
   scenes.add(i.sceneId);
   assert(i.sourceExcerpt===color.sourceExcerpt&&i.chapterOneBased===color.chapterOneBased&&i.paragraphZeroBased===color.afterParagraph,'source anchor drift '+i.queueId);
   assert(typeof i.altAr==='string'&&i.altAr.length>15&&typeof i.altEn==='string'&&i.altEn.length>15,'missing bilingual alt');
   assert(Array.isArray(i.charactersPresent),'cast must be explicit');
   assert(i.referenceBible==='docs/art-generation/character-bibles/verne-main-cast-v1.json','wrong bible');
   const anchor=i.chapterOneBased+':'+i.paragraphZeroBased;
   assert(!anchors.has(anchor),'duplicate source paragraph in production queue');
   anchors.add(anchor);
  }else if(i.status==='ready_for_generation'){
   assert(i.referenceBible==='docs/art-generation/character-bibles/verne-main-cast-v1.json','wrong bible');
   const extended=verifyExtraScene(i,b);
   assert(!scenes.has(i.sceneId),'duplicate verified scene ID');
   scenes.add(i.sceneId);
   const anchor=i.chapterOneBased+':'+i.paragraphZeroBased;
   assert(!anchors.has(anchor),'duplicate source paragraph in production queue');
   anchors.add(anchor);
   colorMap.set(i.sceneId,extended);
  }else{
   assert(i.sceneId===null&&i.sourceExcerpt===null&&i.paragraphZeroBased===null,'unverified slots cannot claim invented passage/scene');
   assert(i.status==='needs_source_verification'||i.status==='needs_chapter_segmentation','unverified scene promoted without evidence');
  }
 }
 assert(s.candidates.every(x=>x&&HASH.test(x.sha256)&&x.status==='generated_candidate'),'state contains noncandidate/invalid hashes');
 return {q,s,b,colorMap};
}
function status(v){
 const c={total:60,sourceVerified:v.colorMap.size,needsSource:0,needsSegmentation:0,ready:0,existingReview:0,generatedCandidate:v.s.candidates.length,rejected:v.s.rejections?.length||0,readerIntegrated:0};
 for(const it of v.q.items){
  const st=v.s.attempts[it.queueId]?.status||it.status;
  if(st==='ready_for_generation')c.ready++;
  if(st==='existing_candidate_review')c.existingReview++;
  if(st==='needs_source_verification')c.needsSource++;
  if(st==='needs_chapter_segmentation')c.needsSegmentation++;
 }
 return c;
}
function next(v){
 const blocks=[];
 for(const i of v.q.items){
  const current=v.s.attempts[i.queueId]?.status||i.status;
  if(current!=='ready_for_generation')continue;
  if((v.s.attempts[i.queueId]?.count||0)>=2){blocks.push({queueId:i.queueId,reason:'RETRY_BUDGET_EXHAUSTED'});continue;}
  if(v.s.candidates.some(c=>c.queueId===i.queueId)){blocks.push({queueId:i.queueId,reason:'ALREADY_GENERATED'});continue;}
  const source=v.colorMap.get(i.sceneId);
  if(!source){blocks.push({queueId:i.queueId,reason:'SOURCE_NOT_VERIFIED'});continue;}
  if((v.s.priorFailures||[]).some(f=>f.sceneId===i.sceneId&&f.reason==='SCENE_PROMPT_NOT_BOUND')){blocks.push({queueId:i.queueId,reason:'SCENE_PROMPT_NOT_BOUND'});continue;}
  if(i.charactersPresent.length>0){
   const ref=v.b.references;
   if(ref?.ownerApproved!==true||!ref.manifestPath){
    blocks.push({queueId:i.queueId,reason:'CHARACTER_REFERENCE_NOT_APPROVED'});
    continue;
   }
  }
  return {ready:true,queueId:i.queueId,sceneId:i.sceneId,chapter:i.chapterOneBased,paragraphZeroBased:i.paragraphZeroBased,bookId:i.bookId,sourceExcerpt:i.sourceExcerpt,charactersPresent:i.charactersPresent,forbiddenElements:i.forbiddenElements,prompt:source.prompt,referenceManifest:v.b.references?.manifestPath||null,counts:status(v)};
 }
 return {ready:false,reason:blocks.length?'PRECONDITIONS_NOT_MET':'NO_VERIFIED_PENDING_WORK',blocks,counts:status(v)};
}
function imageSize(bytes){
 assert(bytes.length>100000&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP','not substantial WebP data');
 assert(bytes.readUInt32LE(4)+8===bytes.length,'RIFF length mismatch');
 const kind=bytes.toString('ascii',12,16);
 let w,h;
 if(kind==='VP8X'){
  w=bytes.readUIntLE(24,3)+1;h=bytes.readUIntLE(27,3)+1;
 } else if(kind==='VP8 '){
  assert(bytes[23]===0x9d&&bytes[24]===0x01&&bytes[25]===0x2a,'VP8 sync code missing');
  w=bytes.readUInt16LE(26)&0x3fff;h=bytes.readUInt16LE(28)&0x3fff;
 } else if(kind==='VP8L'){
  assert(bytes[20]===0x2f,'VP8L signature missing');
  const bits=bytes.readUInt32LE(21);w=(bits&0x3fff)+1;h=((bits>>>14)&0x3fff)+1;
 } else throw Error('unknown WebP bitstream type');
 assert(Math.min(w,h)>=640&&w*h>=614400&&w/h>=0.55&&w/h<=2.5,'image below acceptance dimensions or invalid aspect');
 return {width:w,height:h};
}
function record(v,id,file){
 const item=v.q.items.find(x=>x.queueId===id);
 assert(item&&v.colorMap.has(item.sceneId),'unverified/unknown queue item');
 assert(!v.s.attempts[id]||v.s.attempts[id].status!=='rejected','rejected scene cannot silently be accepted as a new candidate');
 assert(!v.s.candidates.some(x=>x.queueId===id),'this scene was already recorded');
 assert(!v.s.candidates.some(x=>x.sceneId===item.sceneId),'duplicate scene already recorded');
 assert((v.s.attempts[id]?.status||item.status)==='ready_for_generation','not currently queued for generation');
 const full=safeRel(file);
 assert(full.startsWith(REVIEW+path.sep)&&full.endsWith('.webp'),'review WebP only; never Android assets');
 const expected='docs/art-generation/review/'+item.bookId+'/'+item.sceneId+'.webp';
 assert(file===expected,'image not saved at canonical scene path');
 assert(fs.realpathSync(full)===full,'review image path has symlink or alias');
 const bytes=fs.readFileSync(full),dim=imageSize(bytes),hash=sha(bytes);
 const descriptor=json(full+'.review.json');
 assert(descriptor.sceneId===item.sceneId&&descriptor.bookId===item.bookId,'generator descriptor scene mismatch');
 assert(descriptor.outputSha256===hash&&HASH.test(hash),'file/descriptor SHA mismatch');
 assert(descriptor.sourceExcerpt===item.sourceExcerpt,'original quote mismatch');
 const verifiedScene=v.colorMap.get(item.sceneId);
 assert(descriptor.sourceParagraphSha256===verifiedScene.sourceParagraphSha256,'original source paragraph hash mismatch');
 assert(descriptor.promptSha256===sha(Buffer.from(verifiedScene.prompt,'utf8')),'generated prompt hash mismatch');
 assert(descriptor.outputFile===file,'descriptor image path mismatch');
 assert(descriptor.generated===true&&descriptor.sourceType==='AI_GENERATED_MODERN_COMPANION','descriptor is not a real generated image candidate');
 assert(descriptor.ownerImageApproved===false&&descriptor.editoriallyApproved===false&&
  descriptor.distributionReviewApproved===false&&descriptor.releaseApproved===false,'auto-approval forbidden');
 assert(!v.s.candidates.some(x=>x.sha256===hash),'duplicate candidate image bytes');
 v.s.candidates.push({queueId:id,sceneId:item.sceneId,status:'generated_candidate',file:path.relative(ROOT,full).replaceAll(path.sep,'/'),sha256:hash,...dim,recordedAt:new Date().toISOString(),editoriallyApproved:false,ownerImageApproved:false,releaseApproved:false});
 v.s.attempts[id]={status:'generated_candidate',count:(v.s.attempts[id]?.count||0)+1,updatedAt:new Date().toISOString()};
 v.s.lastProcessedQueueId=id;
 v.s.lastSuccessfulImageAt=new Date().toISOString();
 writeAtomic(SPATH,v.s);
 return {recorded:true,queueId:id,status:'generated_candidate',sha256:hash,...dim};
}
function reject(v,id,reason){
 const item=v.q.items.find(x=>x.queueId===id);
 assert(item&&v.colorMap.has(item.sceneId),'unverified/unknown queue item');
 assert(/^[A-Z][A-Z0-9_]{4,96}$/.test(reason),'use explicit UPPERCASE_FAILURE_REASON');
 assert(!v.s.candidates.some(x=>x.queueId===id),'cannot reject a recorded candidate without editorial review');
 const old=v.s.attempts[id];
 const count=(old?.count||0)+1;
 assert(count<=2,'retry budget exhausted for '+id);
 const event={queueId:id,sceneId:item.sceneId,reason,status:'rejected',attemptCount:count,recordedAt:new Date().toISOString()};
 if(!Array.isArray(v.s.rejections))v.s.rejections=[];
 v.s.rejections.push(event);
 v.s.attempts[id]={status:'rejected',count,reason,updatedAt:event.recordedAt};
 v.s.lastProcessedQueueId=id;
 writeAtomic(SPATH,v.s);
 return event;
}
function retry(v,id){
 const i=v.q.items.find(x=>x.queueId===id);
 assert(i&&v.colorMap.has(i.sceneId),'unverified/unknown queue item');
 const old=v.s.attempts[id];
 assert(old&&old.status==='rejected','scene must be explicitly rejected before retry');
 assert(old.count===1,'one retry maximum; attempt budget exhausted');
 assert(!v.s.candidates.some(x=>x.queueId===id),'cannot retry a generated candidate');
 assert(!(v.s.priorFailures||[]).some(f=>f.sceneId===i.sceneId&&f.reason==='SCENE_PROMPT_NOT_BOUND'),'known-unbound prompt cannot be retried unchanged');
 const ref=v.b.references;
 if(i.charactersPresent.length&&(!ref?.ownerApproved||!ref?.manifestPath)) throw Error('CHARACTER_REFERENCE_NOT_APPROVED');
 v.s.attempts[id]={...old,status:'ready_for_generation',updatedAt:new Date().toISOString(),retryPending:true};
 writeAtomic(SPATH,v.s);
 return {queueId:id,status:'ready_for_generation',retriesRemaining:0};
}
function produce(v){
 assert(process.env.STORY_ART_AUTOGEN_APPROVED==='yes','paid autonomous generation not explicitly authorized: no API call');
 assert(process.env.OPENAI_API_KEY&&process.env.STORY_ART_PAID_IMAGE_LIMIT==='1','missing scoped API key or per-run ONE-IMAGE payment limit');
 const task=next(v);
 if(!task.ready)return task;
 assert(!task.charactersPresent.length||(task.referenceManifest&&task.charactersPresent.every(id=>v.b.continuity[id]?.approvedForCrossSceneReference===true)),'unapproved named-character image references');
 const args=[path.join(ROOT,'tools/generate_story_art_openai.cjs'),task.chapter<=4?'--color-scenes':'--queue-scenes','--scene',task.sceneId];
 if(task.referenceManifest)args.push('--references',task.referenceManifest);
 args.push('--execute','--confirm-paid');
 const result=child.spawnSync(process.execPath,args,{cwd:ROOT,stdio:'inherit',timeout:200000,env:process.env});
 if(result.status!==0){
  // Persist failure so the next hourly run does not repeat the same paid request indefinitely.
  return reject(v,task.queueId,result.error?.code==='ETIMEDOUT'?'GENERATION_TIMEOUT':'IMAGE_ADAPTER_FAILED');
 }
 const file='docs/art-generation/review/'+task.bookId+'/'+task.sceneId+'.webp';
 return record(v,task.queueId,file);
}
function main(args){
 const op=args[0]||'--check';const v=verified();
 let out;
 if(op==='--check')out={ok:true,counts:status(v),releaseApproved:false};
 else if(op==='--next')out=next(v);
 else if(op==='--record'){assert(args.length===3,'use --record <queueId> <file>');out=record(v,args[1],args[2]);}
 else if(op==='--reject'){assert(args.length===3,'use --reject <queueId> <UPPERCASE_REASON>');out=reject(v,args[1],args[2]);}
 else if(op==='--retry'){assert(args.length===2,'use --retry <queueId>');out=retry(v,args[1]);}
 else if(op==='--produce')out=produce(v);
 else throw Error('unknown action '+op);
 console.log(JSON.stringify(out,null,2));
 return out;
}
if(require.main===module){try{main(process.argv.slice(2));}catch(e){console.error('QUEUE_BLOCKED: '+e.message);process.exitCode=1;}}
module.exports={verified,next,status,imageSize,record,reject,retry,main};
).test(item.sceneId),'new scene ID not anchored to chapter');
 const para=sourceChapters(ch).chapters[ch-1]?.paragraphs?.[idx];
 assert(para&&typeof para.en==='string'&&typeof para.ar==='string'&&para.ar.length>=15,'authentic bilingual source paragraph missing');
 assert(typeof item.sourceExcerpt==='string'&&item.sourceExcerpt.length>=35&&para.en.includes(item.sourceExcerpt),'source excerpt does not appear in exact original paragraph');
 assert(typeof item.description==='string'&&item.description.length>=75,'scene-specific description missing');
 assert(typeof item.altEn==='string'&&item.altEn.length>=20&&typeof item.altAr==='string'&&item.altAr.length>=20,'bilingual image alt missing');
 assert(Array.isArray(item.charactersPresent)&&item.charactersPresent.every(c=>typeof b.continuity[c]?.sourceAppearance==='string'),'recurring cast requires verified bible');
 assert(Array.isArray(item.forbiddenElements)&&item.forbiddenElements.length>=3,'scene exclusion list missing');
 const cast=item.charactersPresent.length?item.charactersPresent.map(c=>c+': '+b.continuity[c].sourceAppearance).join(' | '):'No recurring named main characters; do not add Fogg or Passepartout without the source scene.';
 const prompt=[
  'SINGLE-SCENE Victorian book illustration, not a collage, not an actual antique engraving. Story Around the World in Eighty Days.',
  'SPECIFIC SOURCE SCENE — '+item.description,
  'EXACT SOURCE PARAGRAPH — Chapter '+ch+', paragraph '+(idx+1)+': '+para.en,
  'CHARACTERS PRESENT — '+cast,
  'VISUAL STYLE — '+b.style,
  'FORBIDDEN elements — '+item.forbiddenElements.join('; '),
  'SCOPE — Depict this single event and period, not travel montage, other chapters, unrelated scenery, or captions.'
 ].join('\n');
 return {sceneId:item.sceneId,bookId:item.bookId,chapterOneBased:ch,afterParagraph:idx,
  sourceFile:'app/src/main/assets/classic-verne-towle-ch'+String(ch).padStart(2,'0')+'.js',
  sourceParagraphSha256:sha(Buffer.from(para.en,'utf8')),sourceExcerpt:item.sourceExcerpt,
  prompt,altAr:item.altAr,altEn:item.altEn,status:'PROMPT_READY_NOT_GENERATED',
  sourceType:'AI_GENERATED_MODERN_COMPANION',generated:false,releaseApproved:false,
  editorialApproved:false,ownerImageApproved:false};
}
function verified(){
 const q=json(QPATH),s=json(SPATH),b=json(BPATH);
 assert(q.schemaVersion===1&&q.queueVersion===s.queueVersion,'queue/state version mismatch');
 assert(Array.isArray(q.items)&&q.items.length===60,'queue must contain exactly 60 slots');
 assert(s.schemaVersion===1&&typeof s.attempts==='object'&&Array.isArray(s.candidates),'invalid state');
 assert(b.schemaVersion===1&&b.bibleId==='verne-main-cast-v1','character bible missing/version mismatch');
 const checked=readVerifiedColorQueue(['--check']).queue;
 const colorMap=new Map(checked.map(x=>[x.sceneId,x]));
 const ids=new Set(),scenes=new Set();
 for(const [index,i] of q.items.entries()){
  assert(i&&typeof i.queueId==='string'&&/^[a-z]+-\d{3}$/.test(i.queueId)&&!ids.has(i.queueId),'invalid/duplicated queue id');
  ids.add(i.queueId);
  assert(ALLOWED.has(i.status),'unknown queue status '+i.queueId);
  assert(typeof i.bookId==='string'&&i.bookId.length>8,'missing genuine book id');
  assert(i.releaseApproved!==true&&i.editoriallyApproved!==true,'queue cannot auto-approve art');
  if(index<6){
   const color=colorMap.get(i.sceneId);
   assert(color&&!scenes.has(i.sceneId),'missing/duplicated source-checked color scene');
   scenes.add(i.sceneId);
   assert(i.sourceExcerpt===color.sourceExcerpt&&i.chapterOneBased===color.chapterOneBased&&i.paragraphZeroBased===color.afterParagraph,'source anchor drift '+i.queueId);
   assert(typeof i.altAr==='string'&&i.altAr.length>15&&typeof i.altEn==='string'&&i.altEn.length>15,'missing bilingual alt');
   assert(Array.isArray(i.charactersPresent),'cast must be explicit');
   assert(i.referenceBible==='docs/art-generation/character-bibles/verne-main-cast-v1.json','wrong bible');
  }else{
   assert(i.sceneId===null&&i.sourceExcerpt===null&&i.paragraphZeroBased===null,'unverified slots cannot claim invented passage/scene');
   assert(i.status==='needs_source_verification'||i.status==='needs_chapter_segmentation','unverified scene promoted without evidence');
  }
 }
 assert(s.candidates.every(x=>x&&HASH.test(x.sha256)&&x.status==='generated_candidate'),'state contains noncandidate/invalid hashes');
 return {q,s,b,colorMap};
}
function status(v){
 const c={total:60,sourceVerified:6,needsSource:0,needsSegmentation:0,ready:0,existingReview:0,generatedCandidate:v.s.candidates.length,rejected:v.s.rejections?.length||0,readerIntegrated:0};
 for(const it of v.q.items){
  const st=v.s.attempts[it.queueId]?.status||it.status;
  if(st==='ready_for_generation')c.ready++;
  if(st==='existing_candidate_review')c.existingReview++;
  if(st==='needs_source_verification')c.needsSource++;
  if(st==='needs_chapter_segmentation')c.needsSegmentation++;
 }
 return c;
}
function next(v){
 const blocks=[];
 for(const i of v.q.items){
  const current=v.s.attempts[i.queueId]?.status||i.status;
  if(current!=='ready_for_generation')continue;
  if((v.s.attempts[i.queueId]?.count||0)>=2){blocks.push({queueId:i.queueId,reason:'RETRY_BUDGET_EXHAUSTED'});continue;}
  if(v.s.candidates.some(c=>c.queueId===i.queueId)){blocks.push({queueId:i.queueId,reason:'ALREADY_GENERATED'});continue;}
  const source=v.colorMap.get(i.sceneId);
  if(!source){blocks.push({queueId:i.queueId,reason:'SOURCE_NOT_VERIFIED'});continue;}
  if((v.s.priorFailures||[]).some(f=>f.sceneId===i.sceneId&&f.reason==='SCENE_PROMPT_NOT_BOUND')){blocks.push({queueId:i.queueId,reason:'SCENE_PROMPT_NOT_BOUND'});continue;}
  if(i.charactersPresent.length>0){
   const ref=v.b.references;
   if(ref?.ownerApproved!==true||!ref.manifestPath){
    blocks.push({queueId:i.queueId,reason:'CHARACTER_REFERENCE_NOT_APPROVED'});
    continue;
   }
  }
  return {ready:true,queueId:i.queueId,sceneId:i.sceneId,chapter:i.chapterOneBased,paragraphZeroBased:i.paragraphZeroBased,bookId:i.bookId,sourceExcerpt:i.sourceExcerpt,charactersPresent:i.charactersPresent,forbiddenElements:i.forbiddenElements,prompt:source.prompt,referenceManifest:v.b.references?.manifestPath||null,counts:status(v)};
 }
 return {ready:false,reason:blocks.length?'PRECONDITIONS_NOT_MET':'NO_VERIFIED_PENDING_WORK',blocks,counts:status(v)};
}
function imageSize(bytes){
 assert(bytes.length>100000&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP','not substantial WebP data');
 assert(bytes.readUInt32LE(4)+8===bytes.length,'RIFF length mismatch');
 const kind=bytes.toString('ascii',12,16);
 let w,h;
 if(kind==='VP8X'){
  w=bytes.readUIntLE(24,3)+1;h=bytes.readUIntLE(27,3)+1;
 } else if(kind==='VP8 '){
  assert(bytes[23]===0x9d&&bytes[24]===0x01&&bytes[25]===0x2a,'VP8 sync code missing');
  w=bytes.readUInt16LE(26)&0x3fff;h=bytes.readUInt16LE(28)&0x3fff;
 } else if(kind==='VP8L'){
  assert(bytes[20]===0x2f,'VP8L signature missing');
  const bits=bytes.readUInt32LE(21);w=(bits&0x3fff)+1;h=((bits>>>14)&0x3fff)+1;
 } else throw Error('unknown WebP bitstream type');
 assert(Math.min(w,h)>=640&&w*h>=614400&&w/h>=0.55&&w/h<=2.5,'image below acceptance dimensions or invalid aspect');
 return {width:w,height:h};
}
function record(v,id,file){
 const item=v.q.items.find(x=>x.queueId===id);
 assert(item&&v.colorMap.has(item.sceneId),'unverified/unknown queue item');
 assert(!v.s.attempts[id]||v.s.attempts[id].status!=='rejected','rejected scene cannot silently be accepted as a new candidate');
 assert(!v.s.candidates.some(x=>x.queueId===id),'this scene was already recorded');
 assert(!v.s.candidates.some(x=>x.sceneId===item.sceneId),'duplicate scene already recorded');
 assert((v.s.attempts[id]?.status||item.status)==='ready_for_generation','not currently queued for generation');
 const full=safeRel(file);
 assert(full.startsWith(REVIEW+path.sep)&&full.endsWith('.webp'),'review WebP only; never Android assets');
 const expected='docs/art-generation/review/'+item.bookId+'/'+item.sceneId+'.webp';
 assert(file===expected,'image not saved at canonical scene path');
 assert(fs.realpathSync(full)===full,'review image path has symlink or alias');
 const bytes=fs.readFileSync(full),dim=imageSize(bytes),hash=sha(bytes);
 const descriptor=json(full+'.review.json');
 assert(descriptor.sceneId===item.sceneId&&descriptor.bookId===item.bookId,'generator descriptor scene mismatch');
 assert(descriptor.outputSha256===hash&&HASH.test(hash),'file/descriptor SHA mismatch');
 assert(descriptor.sourceExcerpt===item.sourceExcerpt,'original quote mismatch');
 const verifiedScene=v.colorMap.get(item.sceneId);
 assert(descriptor.sourceParagraphSha256===verifiedScene.sourceParagraphSha256,'original source paragraph hash mismatch');
 assert(descriptor.promptSha256===sha(Buffer.from(verifiedScene.prompt,'utf8')),'generated prompt hash mismatch');
 assert(descriptor.outputFile===file,'descriptor image path mismatch');
 assert(descriptor.generated===true&&descriptor.sourceType==='AI_GENERATED_MODERN_COMPANION','descriptor is not a real generated image candidate');
 assert(descriptor.ownerImageApproved===false&&descriptor.editoriallyApproved===false&&
  descriptor.distributionReviewApproved===false&&descriptor.releaseApproved===false,'auto-approval forbidden');
 assert(!v.s.candidates.some(x=>x.sha256===hash),'duplicate candidate image bytes');
 v.s.candidates.push({queueId:id,sceneId:item.sceneId,status:'generated_candidate',file:path.relative(ROOT,full).replaceAll(path.sep,'/'),sha256:hash,...dim,recordedAt:new Date().toISOString(),editoriallyApproved:false,ownerImageApproved:false,releaseApproved:false});
 v.s.attempts[id]={status:'generated_candidate',count:(v.s.attempts[id]?.count||0)+1,updatedAt:new Date().toISOString()};
 v.s.lastProcessedQueueId=id;
 v.s.lastSuccessfulImageAt=new Date().toISOString();
 writeAtomic(SPATH,v.s);
 return {recorded:true,queueId:id,status:'generated_candidate',sha256:hash,...dim};
}
function reject(v,id,reason){
 const item=v.q.items.find(x=>x.queueId===id);
 assert(item&&v.colorMap.has(item.sceneId),'unverified/unknown queue item');
 assert(/^[A-Z][A-Z0-9_]{4,96}$/.test(reason),'use explicit UPPERCASE_FAILURE_REASON');
 assert(!v.s.candidates.some(x=>x.queueId===id),'cannot reject a recorded candidate without editorial review');
 const old=v.s.attempts[id];
 const count=(old?.count||0)+1;
 assert(count<=2,'retry budget exhausted for '+id);
 const event={queueId:id,sceneId:item.sceneId,reason,status:'rejected',attemptCount:count,recordedAt:new Date().toISOString()};
 if(!Array.isArray(v.s.rejections))v.s.rejections=[];
 v.s.rejections.push(event);
 v.s.attempts[id]={status:'rejected',count,reason,updatedAt:event.recordedAt};
 v.s.lastProcessedQueueId=id;
 writeAtomic(SPATH,v.s);
 return event;
}
function retry(v,id){
 const i=v.q.items.find(x=>x.queueId===id);
 assert(i&&v.colorMap.has(i.sceneId),'unverified/unknown queue item');
 const old=v.s.attempts[id];
 assert(old&&old.status==='rejected','scene must be explicitly rejected before retry');
 assert(old.count===1,'one retry maximum; attempt budget exhausted');
 assert(!v.s.candidates.some(x=>x.queueId===id),'cannot retry a generated candidate');
 assert(!(v.s.priorFailures||[]).some(f=>f.sceneId===i.sceneId&&f.reason==='SCENE_PROMPT_NOT_BOUND'),'known-unbound prompt cannot be retried unchanged');
 const ref=v.b.references;
 if(i.charactersPresent.length&&(!ref?.ownerApproved||!ref?.manifestPath)) throw Error('CHARACTER_REFERENCE_NOT_APPROVED');
 v.s.attempts[id]={...old,status:'ready_for_generation',updatedAt:new Date().toISOString(),retryPending:true};
 writeAtomic(SPATH,v.s);
 return {queueId:id,status:'ready_for_generation',retriesRemaining:0};
}
function produce(v){
 assert(process.env.STORY_ART_AUTOGEN_APPROVED==='yes','paid autonomous generation not explicitly authorized: no API call');
 assert(process.env.OPENAI_API_KEY&&process.env.STORY_ART_PAID_IMAGE_LIMIT==='1','missing scoped API key or per-run ONE-IMAGE payment limit');
 const task=next(v);
 if(!task.ready)return task;
 assert(task.referenceManifest&&task.charactersPresent.every(id=>v.b.continuity[id]?.approvedForCrossSceneReference===true),'unapproved named-character image references');
 const args=[path.join(ROOT,'tools/generate_story_art_openai.cjs'),'--color-scenes','--scene',task.sceneId];
 if(task.referenceManifest)args.push('--references',task.referenceManifest);
 args.push('--execute','--confirm-paid');
 const result=child.spawnSync(process.execPath,args,{cwd:ROOT,stdio:'inherit',timeout:200000,env:process.env});
 if(result.status!==0){
  // Persist failure so the next hourly run does not repeat the same paid request indefinitely.
  return reject(v,task.queueId,result.error?.code==='ETIMEDOUT'?'GENERATION_TIMEOUT':'IMAGE_ADAPTER_FAILED');
 }
 const file='docs/art-generation/review/'+task.bookId+'/'+task.sceneId+'.webp';
 return record(v,task.queueId,file);
}
function main(args){
 const op=args[0]||'--check';const v=verified();
 let out;
 if(op==='--check')out={ok:true,counts:status(v),releaseApproved:false};
 else if(op==='--next')out=next(v);
 else if(op==='--record'){assert(args.length===3,'use --record <queueId> <file>');out=record(v,args[1],args[2]);}
 else if(op==='--reject'){assert(args.length===3,'use --reject <queueId> <UPPERCASE_REASON>');out=reject(v,args[1],args[2]);}
 else if(op==='--retry'){assert(args.length===2,'use --retry <queueId>');out=retry(v,args[1]);}
 else if(op==='--produce')out=produce(v);
 else throw Error('unknown action '+op);
 console.log(JSON.stringify(out,null,2));
 return out;
}
if(require.main===module){try{main(process.argv.slice(2));}catch(e){console.error('QUEUE_BLOCKED: '+e.message);process.exitCode=1;}}
module.exports={verified,next,status,imageSize,record,reject,retry,main};
