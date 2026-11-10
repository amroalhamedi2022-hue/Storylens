#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {serialise,main}=require('./export_story_art_briefs.cjs');
const {run}=require('./story_art_pilot.cjs');
const queue=run(['--check']);
const files=serialise(queue);
assert.equal(Object.keys(files).length,5);
for(const file of ['midjourney-manual.txt','canva-image-prompt.txt','chatgpt-image-prompt.txt']){
 const content=files[file];
 assert.equal((content.match(/=== verne-ch0/g)||[]).length,5);
 assert.ok(content.includes('ONE independent illustration'));
 assert.ok(content.includes('ALL images are MODERN AI ART'));
 assert.ok(content.includes('source')||content.includes('Source'));
 assert.ok(content.includes(queue.queue[0].sourceParagraphSha256));
 assert.ok(content.includes(queue.queue[3].sourceExcerpt));
}
assert.match(files['midjourney-manual.txt'],/ --ar 3:2/);
assert.doesNotMatch(files['canva-image-prompt.txt'],/ --ar 3:2/);
assert.match(files['source-verified-queue.json'],/"releaseApproved": false/);
assert.throws(()=>serialise({...queue,releaseApproved:true}),/Refusing/);
assert.throws(()=>serialise({...queue,queueCount:7}),/Refusing/);
assert.throws(()=>serialise({...queue,queue:[...queue.queue,{status:'IMAGINARY'}]}),/Refusing/);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lt-art-export-'));
try{
 main(['--output-dir',temp]);
 for(const [name,contents] of Object.entries(files)){
  assert.equal(fs.readFileSync(path.join(temp,name),'utf8'),contents);
 }
 main(['--output-dir',temp]); // deterministic, idempotent exact rerun
 const p=path.join(temp,'midjourney-manual.txt');
 fs.writeFileSync(p,'corrupted-review');
 assert.throws(()=>main(['--output-dir',temp]),/Refuse overwrite/);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log('PASS: five source-pinned engine prompts, no guessed scenes, deterministic text export, no paid calls, fail-on-overwrite');
