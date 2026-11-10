#!/usr/bin/env node
/* Prepare scene-accurate image briefs from REAL Lingua Tales chapter paragraphs.
 * NO image is generated or distributed by this tool.
 * Usage: node tools/story_art_pilot.cjs [--check] [--export PATH] [--manifest PATH]
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const DEFAULT=path.join(ROOT,'docs/art-generation/verne-pilot-scenes.json');
function hash(text){return crypto.createHash('sha256').update(text,'utf8').digest('hex');}
function sourceChapters(limit){
 const window={StoryLensEditorialStories:[]};
 const context=vm.createContext({window});
 for(let i=1;i<=limit;i++){
  const file=path.join(ROOT,'app/src/main/assets/classic-verne-towle-ch'+String(i).padStart(2,'0')+'.js');
  if(!fs.existsSync(file))throw Error('Missing original source chapter '+i);
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{timeout:1500,filename:path.basename(file)});
 }
 const story=window.StoryLensEditorialStories.find(s=>s.id==='around-the-world-in-eighty-days-towle');
 if(!story||story.chapters.length!==limit)throw Error('Book/chapter loader order mismatch');
 return story;
}
function verifyAndBuild(input){
 if(input.schemaVersion!==1||input.bookId!=='around-the-world-in-eighty-days-towle'||!Array.isArray(input.scenes))
  throw Error('Unsupported book or pilot manifest');
 if(input.releaseApproved!==false||!Array.isArray(input.images)||input.images.length)
  throw Error('Pilot must remain UNAPPROVED; separately review generated image binaries');
 if(!input.illustrationStyle||typeof input.illustrationStyle.prompt!=='string'||!input.characters)
  throw Error('Missing stable style and character bible');
 if(input.scenes.length<1||input.scenes.length>16)throw Error('Unbounded scene batch');
 const max=Math.max(...input.scenes.map(s=>s.chapterOneBased));
 if(!Number.isInteger(max)||max>2||max<1)throw Error('Pilot only covers actual chapters I and II');
 const book=sourceChapters(max),keys=new Set(),anchors=new Set(),queue=[];
 for(const scene of input.scenes){
  if(!scene||!/^verne-ch0[12]-[a-z0-9-]+$/.test(scene.id)||keys.has(scene.id))
   throw Error('Invalid/duplicate stable scene ID');
  keys.add(scene.id);
  const chapter=book.chapters[scene.chapterOneBased-1];
  const idx=scene.paragraphZeroBased;
  if(!chapter||!Number.isInteger(idx)||idx<0||idx>=chapter.paragraphs.length)
   throw Error('Missing real original paragraph for '+scene.id);
  const para=chapter.paragraphs[idx];
  if(typeof para.en!=='string'||typeof para.ar!=='string'||para.en.length<30||para.ar.length<10)
   throw Error('Invalid aligned bilingual paragraph for '+scene.id);
  if(typeof scene.anchorExcerpt!=='string'||scene.anchorExcerpt.length<30||!para.en.includes(scene.anchorExcerpt))
   throw Error('Anchor excerpt is not in the cited exact paragraph: '+scene.id);
  const key=scene.chapterOneBased+':'+idx;
  if(anchors.has(key))throw Error('Two scene images claim the same primary paragraph: '+key);
  anchors.add(key);
  if(typeof scene.description!=='string'||scene.description.length<60||
     typeof scene.altEn!=='string'||!scene.altEn.trim()||
     typeof scene.altAr!=='string'||!scene.altAr.trim()||
     !Array.isArray(scene.people)||scene.people.some(name=>typeof input.characters[name]!=='string'))
   throw Error('Missing scene details, accessibility, or character identity: '+scene.id);
  if(scene.people.length!==new Set(scene.people).size)throw Error('Duplicate actor: '+scene.id);
  const actorBible=scene.people.map(name=>name+': '+input.characters[name]).join('\n');
  const sourceFile='app/src/main/assets/classic-verne-towle-ch'+String(scene.chapterOneBased).padStart(2,'0')+'.js';
  const exact=hash(para.en);
  queue.push({
   sceneId:scene.id,bookId:input.bookId,chapterOneBased:scene.chapterOneBased,
   afterParagraph:idx,sourceFile,sourceParagraphSha256:exact,sourceExcerpt:scene.anchorExcerpt,
   status:'PROMPT_READY_NOT_GENERATED',editoriallyApproved:false,
   generated:true,sourceType:'AI_GENERATED_MODERN_COMPANION',
   altEn:scene.altEn,altAr:scene.altAr,
   prompt:[
    'Create ONE independent illustration, NOT a storyboard, grid, infographic or cover.',
    'STORY-SPECIFIC SCENE: '+scene.description,
    'ILLUSTRATION STYLE: '+input.illustrationStyle.prompt,
    'CHARACTER CONTINUITY: '+(actorBible||'No identified character from the book in this scene.'),
    'SOURCE CONSTRAINT: Depict only what the exact cited paragraph supports. '+scene.anchorExcerpt,
    'NEGATIVE CONSTRAINTS: '+input.illustrationStyle.negative,
    'Honest output classification: modern AI-created art inspired by period illustrations, not an original historic plate.'
   ].join('\n')
  });
 }
 return {schemaVersion:1,bookId:input.bookId,source:'verified actual bilingual Lingua Tales chapters',
  queueCount:queue.length,releaseApproved:false,generatedAt:'deterministic-no-clock',queue};
}
function run(argv){
 let file=DEFAULT,output=null;
 for(let i=0;i<argv.length;i++){
  if(argv[i]==='--manifest')file=path.resolve(argv[++i]||'');
  else if(argv[i]==='--export')output=path.resolve(argv[++i]||'');
  else if(argv[i]!=='--check')throw Error('Unknown argument: '+argv[i]);
 }
 const result=verifyAndBuild(JSON.parse(fs.readFileSync(file,'utf8')));
 if(output){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');}
 process.stdout.write('PASS: '+result.queueCount+' anchored modern-art briefs across verified original chapters; 0 generated images, 0 release approvals\n');
 return result;
}
if(require.main===module){try{run(process.argv.slice(2));}catch(e){console.error('FAIL: '+e.message);process.exitCode=1;}}
module.exports={verifyAndBuild,sourceChapters,run};
