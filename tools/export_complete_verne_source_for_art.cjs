#!/usr/bin/env node
'use strict';
/** Export the exact locally committed source edition ONCE for isolated art QA.
 * No changes to the runtime app, translation, data or UI. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../app/src/main/assets');
const sandbox={ StoryLensEditorialStories:[] };
const context=vm.createContext({window:sandbox});
const fileHashes=[];
for(let n=1;n<=37;n++){
  if(n===32)continue; // the chapter 31 file contains both chapters 31 & 32
  const name='classic-verne-towle-ch'+String(n).padStart(2,'0')+'.js';
  const contents=fs.readFileSync(path.join(root,name));
  const hash=crypto.createHash('sha256').update(contents).digest('hex');
  fileHashes.push({file:name,sha256:hash});
  vm.runInContext(contents.toString('utf8'),context,{filename:name,timeout:4000});
}
const work=sandbox.StoryLensEditorialStories.find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!work||work.chapters?.length!==37)throw Error('Expected all 37 original Towle chapters');
const chapters=work.chapters.map((chapter,i)=>{
  if(!Array.isArray(chapter.paragraphs)||chapter.paragraphs.length<8)
    throw Error('Missing original narrative paragraphs in chapter '+(i+1));
  const paragraphs=chapter.paragraphs.map((p,j)=>{
    if(typeof p.en!=='string'||p.en.trim().length<2)throw Error('Empty English paragraph '+(i+1)+':'+j);
    return p.en;
  });
  return {chapterOneBased:i+1,titleEn:chapter.title,paragraphs};
});
const result={
  workId:work.id,sourceEdition:'Jules Verne, George Makepeace Towle (1873)',
  sourceFileHashes:fileHashes,chapters
};
if(process.argv.includes('--check')){
  process.stdout.write('PASS original exact source: 37 chapters, '+
    chapters.reduce((n,c)=>n+c.paragraphs.length,0)+' English paragraphs; source hash pinned\n');
}else{
  process.stdout.write(JSON.stringify(result)+'\n');
}
