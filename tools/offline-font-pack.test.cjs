'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../app/src/main/assets'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const files=[
 ['ar-modern','tajawal','LT Arabic Modern'],['ar-naskh','notonaskharabic','LT Arabic Naskh'],
 ['ar-ruqaa','arefruqaa','LT Arabic Ruqaa'],['ar-kufi','reemkufi','LT Arabic Kufi'],
 ['ar-hand','reemkufiink','LT Arabic Hand'],['en-serif','lora','LT English Serif'],
 ['en-sans','outfit','LT English Sans'],['en-humanist','manrope','LT English Humanist'],
 ['en-mono','ibmplexmono','LT English Mono'],['en-hand','patrickhand','LT English Hand']
];
const css=read('lt-offline-fonts.css'),reader=read('reader-experience.js');
assert.match(read('index.html'),/href="lt-offline-fonts\.css"/);
for(const [file,license,name] of files){
 const bytes=fs.readFileSync(path.join(root,'fonts',file+'.ttf'));
 assert.ok(bytes.length>35000,'real font '+file);
 assert.ok(bytes.readUInt32BE(0)===65536||bytes.subarray(0,4).toString()==='OTTO','valid TTF '+file);
 assert.ok(css.includes('fonts/'+file+'.ttf')&&css.includes(name),'registered face '+file);
 assert.match(read('fonts/'+license+'-OFL.txt'),/SIL OPEN FONT LICENSE/i);
 assert.ok(reader.includes(name),'actual reading font chosen: '+name);
}
assert.match(reader,/document\.fonts\.load\('20px '/);
assert.match(reader,/LinguaReflowReader\(captureParagraphAnchor\(\)\)/);
console.log('PASS: ten distinct offline OFL font assets, notices, selection and reflow');