#!/usr/bin/env node
/*
 * Lingua Tales: verified color illustration briefs for chapters I-IV.
 * Reads real source JS and DOES NOT generate, approve, or publish any image.
 * No API, no network, no browser, no credentials.
 * node tools/prepare_color_scene_queue.cjs --check
 * node tools/prepare_color_scene_queue.cjs --export /tmp/lt-color-queue.json
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {sourceChapters}=require('./story_art_pilot.cjs');
const ROOT=path.resolve(__dirname,'..');
const INPUT=path.join(ROOT,'docs/art-generation/visual-bibles/colored-victorian/next-scene-briefs.json');
const BOOK='around-the-world-in-eighty-days-towle';
function digest(s){return crypto.createHash('sha256').update(s,'utf8').digest('hex');}
function verify(input){
 if(!input||input.schemaVersion!==1||input.bookId!==BOOK||!Array.isArray(input.scenes)||input.scenes.length!==6)
  throw Error('Expected EXACT 6 color scenes from the original bilingual Verne book');
 if(typeof input.style!=='string'||input.style.length<70||typeof input.negative!=='string'||input.negative.length<35||
    !input.characters||!String(input.characters.phileasFogg||'').includes('BEARDED')||
    !String(input.characters.phileasFogg||'').includes('LIGHT')||
    !String(input.characters.passepartout||'').includes('French'))
  throw Error('Missing/broken historical art style or character continuity');
 const chapters=sourceChapters(4).chapters;
 const anchors=new Set(),ids=new Set(),queue=[];
 for(const scene of input.scenes){
  if(!scene||typeof scene.id!=='string'||!/^ch0[1-4]-[a-z0-9-]{3,60}$/.test(scene.id)||ids.has(scene.id))
   throw Error('Invalid or duplicated style scene ID');
  if(scene.generated!==false||scene.editoriallyApproved!==false||scene.releaseApproved!==false)
   throw Error('Color scenes must be UNGENERATED and UNAPPROVED');
  ids.add(scene.id);
  const chapter=scene.chapterOneBased,paraIndex=scene.afterParagraph;
  if(!Number.isInteger(chapter)||chapter<1||chapter>4||!scene.id.startsWith('ch0'+chapter+'-')||
     !Number.isInteger(paraIndex)||paraIndex<0)throw Error('Wrong chapter or index');
  const paragraph=chapters[chapter-1]?.paragraphs?.[paraIndex];
  if(!paragraph||typeof paragraph.en!=='string'||typeof paragraph.ar!=='string'||paragraph.ar.length<15)
   throw Error('Original bilingual paragraph missing');
  if(typeof scene.sourceExcerpt!=='string'||scene.sourceExcerpt.length<30||
     !paragraph.en.includes(scene.sourceExcerpt))throw Error('Scene anchor NOT found in original exact English paragraph');
  if(typeof scene.description!=='string'||scene.description.length<55)
   throw Error('Scene-specific story description missing');
  if(typeof scene.altAr!=='string'||scene.altAr.trim().length<15||scene.altAr.length>240||
     typeof scene.altEn!=='string'||scene.altEn.trim().length<15||scene.altEn.length>240)
   throw Error('Missing bilingual scene caption; NEVER publish without Arabic and English alt');
  const anchor=chapter+':'+paraIndex;
  if(anchors.has(anchor))throw Error('Duplicate paragraph anchor');
  anchors.add(anchor);
  const sceneId='verne-ch0'+chapter+'-color-'+scene.id.slice(5);
  // Explicit casting, never infer from incidental possessives such as 'Fogg's house'.
  const castById={
   'ch01-saville-street':[],
   'ch01-new-servant':['fogg','passepartout'],
   'ch02-clock-schedule':['passepartout'],
   'ch03-wager':['fogg'],
   'ch04-packing':['passepartout'],
   'ch04-guide':['fogg']
  };
  const roles=castById[scene.id];
  if(!roles)throw Error('Scene casting must be editorially explicit');
  const cast=roles.map(x=>x==='fogg'?input.characters.phileasFogg:input.characters.passepartout);
  const prompt=[
   'SINGLE-FRAME BOOK ILLUSTRATION: ONE scene from one ORIGINAL Verne paragraph, no collage or multi-panel poster, no book cover or labels.',
   'SCENE — '+scene.description,
   'VISUAL TREATMENT — '+input.style,
   'CHARACTER CONTINUITY — '+(cast.join(' ')||'No known named character; do not invent foreground people.'),
   'PERIOD — 1872, historically plausible Victorian material culture and light; strictly no modern objects.',
   'ORIGINAL TEXT GROUNDING — Chapter '+chapter+', original English paragraph '+(paraIndex+1)+': '+paragraph.en,
   'NEGATIVE PROMPT — '+input.negative,
   'AUTHENTICITY — Contemporary AI illustration only; never claim antique/original historical engraving.'
  ].join('\n');
  queue.push({sceneId,bookId:BOOK,chapterOneBased:chapter,afterParagraph:paraIndex,
   sourceFile:'app/src/main/assets/classic-verne-towle-ch0'+chapter+'.js',
   sourceParagraphSha256:digest(paragraph.en),sourceExcerpt:scene.sourceExcerpt,
   status:'PROMPT_READY_NOT_GENERATED',generated:false,
   sourceType:'AI_GENERATED_MODERN_COMPANION',editoriallyApproved:false,
   ownerImageApproved:false,releaseApproved:false,
   altAr:scene.altAr,altEn:scene.altEn,prompt,sourceTextAr:paragraph.ar});
 }
 return {schemaVersion:1,bookId:BOOK,releaseApproved:false,queueCount:queue.length,
  source:'verified real original bilingual chapters I-IV; contemporary AI color art',queue};
}
function run(argv=[]){
 let file=INPUT,output=null;
 for(let i=0;i<argv.length;i++){
  if(argv[i]==='--manifest')file=path.resolve(argv[++i]||'');
  else if(argv[i]==='--export')output=path.resolve(argv[++i]||'');
  else if(argv[i]!=='--check')throw Error('Unknown argument '+argv[i]);
 }
 const result=verify(JSON.parse(fs.readFileSync(file,'utf8')));
 if(output){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');}
 console.log('PASS: '+result.queueCount+' exact source-grounded color prompts, 0 image outputs, 0 approvals');
 return result;
}
if(require.main===module){try{run(process.argv.slice(2));}catch(e){console.error('FAIL '+e.message);process.exitCode=1;}}
module.exports={run,verify};