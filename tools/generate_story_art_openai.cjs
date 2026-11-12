#!/usr/bin/env node
/* Lingua Tales • opt-in ONE-IMAGE generation against real source-verified scene.
 * DRY RUN BY DEFAULT. No automatic paid calls, no API key in repo/logs.
 * No image is ever approved for publishing just because it was generated.
 *
 * node tools/generate_story_art_openai.cjs --scene verne-ch01-new-servant
 * node tools/generate_story_art_openai.cjs --scene verne-ch01-new-servant --execute --confirm-paid
 * Optional: --references docs/art-generation/visual-bibles/reference-manifest.json
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {run:loadQueue}=require('./story_art_pilot.cjs');
const {run:loadColorQueue}=require('./prepare_color_scene_queue.cjs');
const {verified:loadProductionQueue}=require('./story_art_queue_60.cjs');
const ROOT=path.resolve(__dirname,'..');
const MODEL_FLARE='gpt-image-2.6-flare',MODEL_DETAIL='gpt-image-2.6-sunburst';
const REVIEW=path.join(ROOT,'docs/art-generation/review');
const REFS=path.join(ROOT,'docs/art-generation/visual-bibles');
const BOOK='around-the-world-in-eighty-days-towle';
function digest(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function inside(base,where){
 const rel=path.relative(base,where);
 return !rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel);
}
function signature(bytes,ext){
 return ext==='.webp'&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'?'image/webp':
   ext==='.png'&&bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'))?'image/png':
   (ext==='.jpg'||ext==='.jpeg')&&bytes.subarray(0,3).equals(Buffer.from('ffd8ff','hex'))?'image/jpeg':null;
}
function readReferences(file){
 if(!file)return [];
 const resolved=path.resolve(ROOT,file);
 if(!inside(REFS,resolved)||path.isAbsolute(file)||!resolved.endsWith('.json'))
  throw Error('Reference manifest must be a local JSON file inside docs/art-generation/visual-bibles');
 const doc=JSON.parse(fs.readFileSync(resolved,'utf8'));
 if(!Array.isArray(doc.references)||doc.references.length<1||doc.references.length>4)
  throw Error('Reference list requires 1–4 distinct licensed image files');
 const hashes=new Set();
 return doc.references.map(item=>{
  if(item.approvedForAIReference!==true||item.imageRightsReviewed!==true||
     typeof item.sourceCredit!=='string'||item.sourceCredit.length<6)
   throw Error('Reference use has no explicit image rights/attribution review');
  if(typeof item.path!=='string'||item.path.startsWith('/')||item.path.includes('\\'))
   throw Error('Invalid local reference path');
  const full=path.resolve(REFS,item.path);
  if(!inside(REFS,full)||fs.lstatSync(full).isSymbolicLink())
   throw Error('Unsafe reference image path');
  const data=fs.readFileSync(full),mime=signature(data,path.extname(full).toLowerCase());
  if(!mime||data.length>3_000_000||data.length<300)
   throw Error('Invalid/unbounded image reference');
  const hash=digest(data);
  if(hash!==item.sha256||hashes.has(hash))throw Error('Reference SHA mismatch or duplicate');
  hashes.add(hash);
  return {data,mime,hash,credit:item.sourceCredit};
 });
}
function buildRequest(scene,model,refs){
 if(!scene||typeof scene.prompt!=='string'||scene.status!=='PROMPT_READY_NOT_GENERATED')
  throw Error('Only currently verified, ungenerated scene briefs can be submitted');
 if(model!==MODEL_FLARE&&model!==MODEL_DETAIL)throw Error('Model must be approved GPT Image 2.6');
 if(!Array.isArray(refs)||refs.length>4)throw Error('Too many reference inputs');
 const shared={
  model,prompt:scene.prompt,n:1,size:'1536x1024',quality:'medium',
  complexity:'medium',background:'opaque',output_format:'webp',
  output_compression:88
 };
 const body=refs.length?{...shared,images:refs.map(x=>({
  image_url:'data:'+x.mime+';base64,'+x.data.toString('base64')
 }))}:shared;
 return {endpoint:refs.length?'/v1/images/edits':'/v1/images/generations',body};
}
function parseResult(payload){
 const b64=payload?.data?.[0]?.b64_json;
 if(typeof b64!=='string'||b64.length<500||b64.length>16_000_000||!/^[A-Za-z0-9+/=\r\n]+$/.test(b64))
  throw Error('Missing/invalid base64 image in API response');
 const image=Buffer.from(b64,'base64');
 if(image.length<300||image.length>10_000_000||!signature(image,'.webp'))
  throw Error('API response is not a valid-sized WebP signature');
 return image;
}
function parseArgs(argv){
 const opts={model:MODEL_FLARE,execute:false,confirm:false,references:null,scene:null,colorScenes:false,queueScenes:false};
 for(let i=0;i<argv.length;i++){
  const k=argv[i];
  if(k==='--scene')opts.scene=argv[++i];
  else if(k==='--model')opts.model=argv[++i];
  else if(k==='--references')opts.references=argv[++i];
  else if(k==='--color-scenes')opts.colorScenes=true;
  else if(k==='--queue-scenes')opts.queueScenes=true;
  else if(k==='--execute')opts.execute=true;
  else if(k==='--confirm-paid')opts.confirm=true;
  else throw Error('Unknown argument '+k);
 }
 if(opts.colorScenes&&opts.queueScenes)throw Error('Use one scene queue, not both');
 const verifiedPattern=opts.queueScenes?/^verne-ch(?:0[5-9]|[12][0-9]|3[0-7])-color-[a-z0-9-]+$/:opts.colorScenes?/^verne-ch0[1-4]-color-[a-z0-9-]+$/:/^verne-ch0[12]-[a-z0-9-]+$/;
 if(typeof opts.scene!=='string'||!verifiedPattern.test(opts.scene))throw Error('Select one real --scene ID');
 if(opts.execute!==opts.confirm)throw Error('Paid execution requires BOTH --execute and --confirm-paid');
 return opts;
}
async function main(argv,transport=fetch){
 const opts=parseArgs(argv);
 const queue=opts.queueScenes?{queue:[...loadProductionQueue().colorMap.values()]}:opts.colorScenes?loadColorQueue(['--check']):loadQueue(['--check']);
 const scene=queue.queue.find(x=>x.sceneId===opts.scene);
 if(!scene)throw Error('Scene ID does not exist in the verified actual prose queue');
 const refs=readReferences(opts.references);
 const job=buildRequest(scene,opts.model,refs);
 const output=path.join(REVIEW,BOOK,scene.sceneId+'.webp');
 const descriptor=output+'.review.json';
 if(fs.existsSync(output)||fs.existsSync(descriptor))throw Error('Review candidate already exists; refuse overwrite');
 if(!opts.execute){
  console.log(JSON.stringify({mode:'DRY_RUN_NO_API_CALL',sceneId:scene.sceneId,
   endpoint:job.endpoint,model:opts.model,referenceCount:refs.length,
   anchor:scene.sourceExcerpt,sourceParagraphSha256:scene.sourceParagraphSha256,
   savedOnExecution:output,cost:'not estimated; API billed separately'},null,2));
  return;
 }
 if(!process.env.OPENAI_API_KEY)throw Error('OPENAI_API_KEY missing; no request made');
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),180000);
 let response;
 try{
  response=await transport('https://api.openai.com'+job.endpoint,{
   method:'POST',
   headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,
    'Content-Type':'application/json'},
   body:JSON.stringify(job.body),signal:controller.signal
  });
 }finally{clearTimeout(timeout);}
 if(!response.ok)throw Error('Image provider request failed with HTTP '+response.status+'; no image saved');
 const data=await response.json(),image=parseResult(data);
 fs.mkdirSync(path.dirname(output),{recursive:true});
 // Never treat a real generated picture as an approved image automatically.
 fs.writeFileSync(output,image,{flag:'wx'});
 const record={
  sceneId:scene.sceneId,bookId:BOOK,sourceFile:scene.sourceFile,
  chapterOneBased:scene.chapterOneBased,afterParagraph:scene.afterParagraph,
  sourceParagraphSha256:scene.sourceParagraphSha256,sourceExcerpt:scene.sourceExcerpt,
  promptSha256:digest(scene.prompt),
  outputSha256:digest(image),model:opts.model,outputFile:path.relative(ROOT,output),
  sourceType:'AI_GENERATED_MODERN_COMPANION',generated:true,referenceSha256:refs.map(x=>x.hash),
  promptSource:'verified actual Lingua Tales original prose',
  ownerImageApproved:false,editoriallyApproved:false,
  distributionReviewApproved:false,imageRightsReviewed:false,releaseApproved:false,
  usage:data.usage||null
 };
 fs.writeFileSync(descriptor,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
 console.log('SAVED UNAPPROVED REVIEW CANDIDATE '+scene.sceneId+' '+record.outputSha256);
}
if(require.main===module)main(process.argv.slice(2)).catch(e=>{
 console.error('FAIL: '+e.message);process.exitCode=1;
});
module.exports={digest,signature,inside,readReferences,buildRequest,parseResult,parseArgs,main};
