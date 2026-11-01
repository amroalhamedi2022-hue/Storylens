'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const a=source.indexOf('function ltMeasuredParagraphHeights(');
const b=source.indexOf('function ltPageForParagraph(',a);
assert.ok(a>=0&&b>a,'real layout measurement helpers are in production');
const context={LT_PAGE_PARAGRAPHS:4,window:{getComputedStyle:node=>node.computedStyle}};
vm.runInNewContext(source.slice(a,b)+
 '\nglobalThis.measure=ltMeasuredParagraphHeights;globalThis.paginate=ltMeasuredPageStarts;',context);
const asArray=v=>v===null?null:Array.from(v);
const {measure,paginate}=context;
function element(height,margins={},name='sentence'){
 return {classList:{contains:key=>key===name},
   getBoundingClientRect(){return {height};},
   computedStyle:{marginTop:String(margins.top??0)+'px',marginBottom:String(margins.bottom??0)+'px'},
   nextElementSibling:null};
}
const p1=element(110,{bottom:15});
const tr=element(75,{bottom:10},'inline-en');
const art=element(195,{bottom:12},'lt-inline-illustration');
const p2=element(110,{bottom:12});
const p3=element(100,{bottom:8});
p1.nextElementSibling=tr;tr.nextElementSibling=art;art.nextElementSibling=p2;p2.nextElementSibling=p3;
const measured=measure([p1,p2,p3]);
assert.deepEqual(asArray(measured),[407,122,108],'bilingual pair and adjacent scene are one unbreakable block');
assert.deepEqual(asArray(paginate(measured,700)),[0,1],'art-heavy first paragraph gets its own page');
assert.deepEqual(asArray(paginate([60,60,60,60,60],900)),[0,4],'four-paragraph cap remains');
assert.deepEqual(asArray(paginate([1200,90,90],700)),[0,1],
 'oversized passage is scrollable alone, not cut or discarded');
assert.equal(paginate([80,NaN],700),null,'corrupt heights fall back safely');
const unmeasured=element(0);assert.equal(measure([unmeasured]),null,'invalid WebView bounds use legacy estimator');
assert.match(source,/ltMeasuredParagraphHeights\(sentences\)/,'real DOM measurements actually drive the page boundaries');
assert.match(source,/ltPageStarts\(paragraphLengths/,'length-based compatibility fallback preserved');
assert.match(source,/const starts=\(measured&&ltMeasuredPageStarts/,'measured pages preferred');
assert.match(source,/const paragraphLengths=sentences\.map/,'both Arabic and English companion content counted');
console.log('PASS: measured paper pages keep bilingual paragraphs with offline art, handle tall content and safely fall back');
