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
assert.deepEqual(asArray(measured),[417,122,108],'bilingual pair and adjacent scene are one unbreakable block');
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

// Audit-49: a multi-line chapter heading lives on the first page and must
// reserve vertical space without changing existing page/paragraph anchors.
assert.deepEqual(asArray(paginate([100,100,100],700)),[0]);
assert.deepEqual(asArray(paginate([100,100,100],700,165)),[0,2],
 'the physical chapter intro reserves real first-sheet height');
const estimateStart=source.indexOf('function ltPageStarts(');
const estimateEnd=source.indexOf('function ltMeasuredParagraphHeights(',estimateStart);
assert.ok(estimateStart>=0&&estimateEnd>estimateStart);
const fallbackEnv={LT_PAGE_PARAGRAPHS:4};
vm.runInNewContext(source.slice(estimateStart,estimateEnd)+
 '\nglobalThis.estimate=ltPageStarts;',fallbackEnv);
assert.ok(Array.from(fallbackEnv.estimate([100,100,100],700,420,20,[],170)).length>=1,
 'estimated fallback also accepts first-page inset');
assert.match(source,/pages\[0\]\.prepend\(caption,heading\)/,
 'original semantic heading and chapter number actually move onto first physical page');
assert.match(source,/ltMeasuredPageStarts\(measured,window\.innerHeight,firstPaperInset\)/);
assert.match(source,/spread===2\s*\?uiText\('الصفحتان /,
 'a two-page spread announces both visible page numbers');

// Exercise the production getTurn() method: the reverse MUST NOT reuse the
// same next-page DOM as the exposed underlay, which doubled visible words.
const curlStart=source.indexOf('   getTurn(delta){');
const curlEnd=source.indexOf('\n   commit(delta,source)',curlStart);
assert.ok(curlStart>=0&&curlEnd>curlStart,'production physical curl delegate exists');
const getTurnBody=source.slice(curlStart,curlEnd)
 .replace('   getTurn(delta){','function getTurn(delta){')
 .replace(/\},\s*$/,'\n}');
const simulated={pages:Array.from({length:5},(_,i)=>({id:i})),
 current:0,spread:1,state:{chapter:0,story:{chapters:[{},{},{}]}},
 boundaryPage:()=>({id:'boundary'}),blankUnderPage:()=>({id:'blank-under'}),curlStory:{id:'book'},curlChapter:0};
vm.runInNewContext(getTurnBody+'\nglobalThis.getTurn=getTurn;',simulated);
const portrait=simulated.getTurn(1);
assert.equal(portrait.under,simulated.pages[2],
 'beneath the turned leaf is the subsequent paper side');
assert.equal(portrait.back,simulated.pages[1],
 'portrait fold rear shows the actual next page, not a blank ghost');
assert.notEqual(portrait.under,portrait.back,
 'moving verso and underlying sheet cannot duplicate visible text');
simulated.spread=2;simulated.current=0;
const landscape=simulated.getTurn(1);
assert.equal(landscape.under,simulated.pages[3]);
assert.equal(landscape.back,simulated.pages[2],
 'facing spread keeps distinct physical reverse and under sheets');
simulated.current=2;
const reverse=simulated.getTurn(-1);
assert.notEqual(reverse.back,reverse.under,'reverse curl never doubles under-page ink');
simulated.pages=simulated.pages.slice(0,3);
simulated.current=0;
simulated.spread=2;
const lastOdd=simulated.getTurn(1);
assert.equal(lastOdd.back,simulated.pages[2],
 'last odd RTL/LTR spread retains the genuine next page ink on verso');
assert.equal(lastOdd.under.id,'blank-under',
 'a short final spread supplies actual blank paper rather than missing underlay');
assert.notEqual(lastOdd.back,lastOdd.under,'short spread never doubles last-page text');
const css=fs.readFileSync('app/src/main/assets/lt-device-acceptance.css','utf8');
const physical=fs.readFileSync('app/src/main/assets/physical-page-curl.css','utf8');
const gallery=fs.readFileSync('app/src/main/assets/lt-chapter-gallery.css','utf8');
assert.match(css,/lt-chapter-paper-heading/,'real chapter heading has physical paper styling');
assert.match(css,/lt-reader-controls-visible/,'landscape blank-paper tap reveals accessible controls');
assert.match(css,/\.reader\.lt-reader-controls-visible>\.toolbar/,
 'immersive landscape reveals real Back and Settings, not only paging');
assert.match(css,/\.toolbar:focus-within/,
 'keyboard focus retains Back and Settings despite hidden immersive chrome');
assert.match(physical,/lt-curl-blank-under:not\(\.lt-curl-under\)/,
 'blank physical underlay is hidden until actual curl, no extra grid row');
assert.match(physical,/\.lt-curl-ghost\{opacity:0!important\}/,
 'ghost text is never duplicated on the next page');
assert.match(css,/\.lt-settings-sheet \.lt-font-setting>select/,
 'mobile settings controls respect available row width');
assert.match(css,/overflow-y:auto!important;overflow-x:hidden!important/,
 'settings preserve scroll and prevent clipping of later controls');
assert.match(gallery,/dialog\.lt-chapter-gallery \.lt-chapter-gallery-sheet\{[\s\S]*?overflow:visible!important/,
 'chapter gallery sheet can expand vertically beyond a compact viewport');
assert.match(gallery,/min-height:max-content!important/,
 'horizontal chapter rail must never clip its cards below its own height');
assert.match(gallery,/dialog\.lt-chapter-gallery \.lt-chapter-tile \*/,
 'nonselectable chapter tiles preserve separate editable search');
console.log('PASS: audit-49 title-space budget, real chapter sheet, distinct curl ink, spread and gallery guards');

console.log('PASS: measured paper pages keep bilingual paragraphs with offline art, handle tall content and safely fall back');
