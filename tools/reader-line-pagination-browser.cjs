/* Real Chromium acceptance for measured, line-aware physical paper pages.
 * Run with NODE_PATH=<playwright>/node_modules node tools/reader-line-pagination-browser.cjs */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assets=path.resolve('app/src/main/assets');
const out=process.env.PAGINATION_SCREENSHOTS||'qa-screenshots/pagination';
fs.mkdirSync(out,{recursive:true});
const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(assets,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(assets+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
const viewports=[
 ['phone-compact',360,760],['phone-standard',460,860],['tablet-portrait',700,1000],
 ['landscape-compact',760,390],['tablet-landscape',1280,840]
].filter(item=>!process.env.PAGINATION_VIEWPORT||item[0]===process.env.PAGINATION_VIEWPORT);
const evidence=[];
const english=Array.from({length:95},(_,i)=>
 `Measured paper line ${i+1} keeps every careful reader's word, punctuation, and context intact.`).join(' ');
const arabic=Array.from({length:90},(_,i)=>
 `السَّطْرُ المُقَاسُ ${i+1} يَحْفَظُ كُلَّ كَلِمَةٍ، وَعَلَامَةِ تَرْقِيمٍ، وَسِيَاقٍ بِدُونِ نُقْصَانٍ.`).join(' ');
function fixture(id,sourceLanguage,text,translation){
 return {id,title:id,author:'QA',genre:'mystery',level:'B1',description:'pagination fixture',sourceLanguage,
  terms:[{term:'paper',type:'noun',meanings:['ورق'],literal:'ورق',context:'ورق الصفحة',note:''}],totalChapters:1,
  chapters:[{title:sourceLanguage==='ar'?'فصل القياس الطويل':'The measured long chapter',paragraphs:[
   {en:sourceLanguage==='ar'?translation:text,ar:sourceLanguage==='ar'?text:translation}
  ]}]};
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/chromium',headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage']});
 const url='http://127.0.0.1:'+server.address().port+'/index.html';
 try{
  for(const [name,width,height] of viewports){
   for(const rtl of [false,true]){
    const page=await browser.newPage({viewport:{width,height},hasTouch:true});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
    await page.goto(url);
    const text=rtl?arabic:english,translation=rtl?english:arabic,id='pagination-'+(rtl?'ar':'en');
    const paginationMs=await page.evaluate(({story})=>{
     const started=performance.now();
     const old=catalog.stories.findIndex(item=>item.id===story.id);
     if(old>=0)catalog.stories.splice(old,1);catalog.stories.push(story);
     state.inline=false;put('chapter_'+story.id,0);put('readpage_'+story.id+'_0',0);
     put('readpage_anchor_'+story.id+'_0',0);openStory(story.id);return performance.now()-started;
    },{story:fixture(id,rtl?'ar':'en',text,translation)});
    await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);
    const result=await page.evaluate(source=>{
     const pages=Array.from(document.querySelectorAll('#sentences>.lt-book-page'));
     const fragments=Array.from(document.querySelectorAll('#sentences .sentence[data-i="0"]'));
     const exact=fragments.map(node=>node.textContent).join('');
     const offsets=fragments.map(node=>[Number(node.dataset.ltFragmentStart),Number(node.dataset.ltFragmentEnd)]);
     const fallback=pages.filter(node=>node.classList.contains('lt-page-scroll-fallback')).length;
     const overflow=pages.map(node=>{
      const active=node.classList.contains('is-active');
      if(!active){
       node.style.setProperty('display','block','important');node.style.setProperty('grid-column','1','important');
       node.style.setProperty('grid-row','1','important');node.style.setProperty('visibility','hidden','important');
      }
      const box=node.getBoundingClientRect(),style=getComputedStyle(node);
      const contentBottom=box.bottom-(parseFloat(style.borderBottomWidth)||0)-(parseFloat(style.paddingBottom)||0);
      const ink=Array.from(node.querySelectorAll('.sentence,.inline-ar,.inline-en,.stl-sentence-translation,.lt-inline-illustration,.lt-chapter-paper-heading'));
      const result={bad:ink.some(item=>item.getBoundingClientRect().bottom>contentBottom+1),
       scroll:node.scrollHeight,client:node.clientHeight,contentBottom,
       inkBottom:ink.length?Math.max(...ink.map(item=>item.getBoundingClientRect().bottom)):box.top,
       width:box.width,inkWidth:ink[0]?.getBoundingClientRect().width||0};
      if(!active){for(const property of ['display','grid-column','grid-row','visibility'])node.style.removeProperty(property);}
      return result;
     });
     return {count:pages.length,fragmentCount:fragments.length,exact,offsets,fallback,overflow,
      heading:!!pages[0]?.querySelector('.lt-chapter-paper-heading'),
      spread:document.querySelector('#sentences')?.dataset.spread,
      duplicateIds:document.querySelectorAll('#sentences [id]').length,
      nodeCount:document.querySelectorAll('#sentences *').length,sourceLength:source.length};
    },text);
    assert.ok(result.count>=3,`${name} ${rtl?'AR':'EN'} long paragraph spans physical sheets`);
    assert.ok(result.fragmentCount>=3,'one paragraph has independently measured fragments');
    assert.equal(result.exact,text,'fragment concatenation preserves every authored character');
    assert.deepEqual(result.offsets[0][0],0);assert.equal(result.offsets.at(-1)[1],text.length);
    result.offsets.forEach((pair,index)=>{
     if(index)assert.equal(pair[0],result.offsets[index-1][1],'no repeated or missing boundary text');
     if(pair[0]>0)assert.doesNotMatch(text[pair[0]]||'',/[\u0300-\u036f\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/i,
      'a page never starts on a detached combining mark');
    });
    assert.equal(result.fallback,0,'supported Chromium never needs scroll fallback');
    if(result.overflow.some(item=>item.bad))console.error('ink overflow',name,rtl?'AR':'EN',result.overflow.filter(item=>item.bad));
    assert.equal(result.overflow.some(item=>item.bad),false,'all text stays inside the paper content box');
    assert.equal(result.heading,true,'the real heading remains on the first paper');
    assert.equal(result.spread,width>=700&&width>height?'2':'1');
    assert.equal(result.duplicateIds,0,'fragmenting creates no duplicate DOM identity');
    assert.ok(result.nodeCount<1600,'DOM allocation stays bounded for a very long paragraph');
    assert.ok(paginationMs<5000,'one adversarial long paragraph paginates without an unbounded main-thread stall');
    evidence.push({viewport:name,width,height,language:rtl?'ar':'en',paginationMs:Number(paginationMs.toFixed(2)),
     pageCount:result.count,fragmentCount:result.fragmentCount,nodeCount:result.nodeCount,overflowPages:0});
    if(!rtl){
     await page.evaluate(()=>document.querySelector('#sentences')?.scrollIntoView({block:'start',behavior:'instant'}));
     await page.screenshot({path:path.join(out,name+'-en-first.png'),fullPage:false});
    }
    if(!rtl){
     await page.evaluate(()=>{window.paginationDictionaryCalls=0;const base=wordSheet;
      wordSheet=function(args){paginationDictionaryCalls++;return base(args)}});
     const boundaryToken=page.locator('#sentences>.is-active .sentence.lt-fragment-continues .tok')
      .filter({hasText:/^paper$/i}).last();
     await boundaryToken.click();
     assert.equal(await page.evaluate(()=>paginationDictionaryCalls),1,'boundary token opens exactly one dictionary sheet');
     await page.evaluate(()=>saveTerm('paper'));
     assert.equal(await page.evaluate(()=>state.saved.includes('paper')&&state.cards.some(card=>card.term.toLowerCase()==='paper')),true,
      'a boundary dictionary word remains saveable for vocabulary review');
    }
    const activeOffset=await page.evaluate(()=>{
     const pages=Array.from(document.querySelectorAll('#sentences>.lt-book-page'));
     const target=Math.min(pages.length-1,document.querySelector('#sentences').dataset.spread==='2'?2:1);
     put('readpage_'+state.story.id+'_'+state.chapter,target);
     put('readpage_anchor_'+state.story.id+'_'+state.chapter,0);
     const node=pages[target].querySelector('.sentence');
     const offset=Number(node?.dataset.ltFragmentStart)||0;
     put('readpage_offset_'+state.story.id+'_'+state.chapter,offset);renderReader();
     return offset;
    });
    await page.waitForTimeout(100);
    if(!rtl){
     await page.evaluate(()=>document.querySelector('#sentences')?.scrollIntoView({block:'start',behavior:'instant'}));
     await page.screenshot({path:path.join(out,name+'-en-continuation.png'),fullPage:false});
    }
    const rotated=width>height?{width:700,height:1000}:{width:1280,height:840};
    await page.setViewportSize(rotated);await page.waitForTimeout(650);
    assert.equal(await page.evaluate(offset=>Array.from(document.querySelectorAll('#sentences>.is-active .sentence')).some(node=>{
     const start=Number(node.dataset.ltFragmentStart)||0,end=Number(node.dataset.ltFragmentEnd)||0;
     return start<=offset&&offset<end;
    }),activeOffset),true,'rotation restores the same location inside the split paragraph');
    const reopened=await page.evaluate(offset=>{
     put('readpage_offset_'+state.story.id+'_'+state.chapter,offset);
     // Simulate a page index computed on a differently sized screen.
     put('readpage_'+state.story.id+'_'+state.chapter,0);
     renderReader();
     return [...document.querySelectorAll('#sentences>.is-active .sentence')].some(node=>
      Number(node.dataset.ltFragmentStart)<=offset&&offset<Number(node.dataset.ltFragmentEnd));
    },activeOffset);
    assert.ok(reopened,'reopening uses the persisted character offset despite a stale page index');
    assert.equal(await page.evaluate(offset=>{put('readingSizeEnglish','large');
     LinguaReflowReader({paragraph:0,textOffset:offset,viewportOffset:80});
     return Array.from(document.querySelectorAll('#sentences>.is-active .sentence')).some(node=>{
      const start=Number(node.dataset.ltFragmentStart)||0,end=Number(node.dataset.ltFragmentEnd)||0;
      return start<=offset&&offset<end;
     });},activeOffset),true,'font reflow restores the exact character anchor');
    assert.deepEqual(errors,[]);await page.close();
   }
   console.log('PASS line pagination',name);
  }
  // A long inline companion is measured independently and remains adjacent in
  // semantic order; it is never dropped merely because the source spans pages.
  const bilingual=await browser.newPage({viewport:{width:700,height:1000}});
  await bilingual.goto(url);
  const bilingualStory=fixture('pagination-bilingual','en',english.slice(0,3600),arabic.slice(0,4200));
  await bilingual.evaluate(story=>{
   catalog.stories.push(story);state.inline=true;put('chapter_'+story.id,0);
   put('readpage_'+story.id+'_0',0);put('readpage_anchor_'+story.id+'_0',0);openStory(story.id);
  },bilingualStory);
  await bilingual.evaluate(()=>document.fonts.ready);await bilingual.waitForTimeout(350);
  assert.equal(await bilingual.evaluate(()=>Array.from(document.querySelectorAll('#sentences .sentence[data-i="0"]')).map(n=>n.textContent).join('')),
   bilingualStory.chapters[0].paragraphs[0].en);
  assert.equal(await bilingual.evaluate(()=>Array.from(document.querySelectorAll('#sentences .inline-ar')).map(n=>n.textContent).join('')),
   bilingualStory.chapters[0].paragraphs[0].ar);
  assert.ok(await bilingual.locator('#sentences .inline-ar').count()>1,'long bilingual companion spans measured paper pages');
  await bilingual.close();

  // Use the packaged historical engraving, including its real caption and
  // inspection handler. It occurs once, remains contained and is never cloned.
  const artPage=await browser.newPage({viewport:{width:700,height:1000},hasTouch:true});
  await artPage.goto(url);
  await artPage.evaluate(()=>{const id='around-the-world-in-eighty-days-towle';state.inline=true;
   put('chapter_'+id,10);put('readpage_'+id+'_10',0);put('readpage_anchor_'+id+'_10',43);openStory(id)});
  await artPage.waitForSelector('#sentences .lt-inline-illustration img[src="art/verne-kiouni-1873.webp"]',{timeout:10000});
  const art=await artPage.evaluate(()=>{
   const images=Array.from(document.querySelectorAll('#sentences img[src="art/verne-kiouni-1873.webp"]'));
   const image=images[0],figure=image?.closest('.lt-inline-illustration'),paper=figure?.closest('.lt-book-page');
   if(paper&&!paper.classList.contains('is-active')){
    paper.style.setProperty('display','block','important');paper.style.setProperty('visibility','hidden','important');
   }
   const imageBox=image?.getBoundingClientRect(),paperBox=paper?.getBoundingClientRect();
   return {count:images.length,caption:figure?.querySelector('figcaption')?.textContent||'',
    objectFit:getComputedStyle(image).objectFit,complete:image?.complete,
    contained:!!imageBox&&!!paperBox&&imageBox.top>=paperBox.top&&imageBox.bottom<=paperBox.bottom+1,
    fragmentFallback:paper?.classList.contains('lt-page-scroll-fallback')||false};
  });
  assert.equal(art.count,1);assert.match(art.caption,/1873|١٨٧٣/);assert.equal(art.objectFit,'contain');
  assert.equal(art.complete,true);assert.equal(art.contained,true);assert.equal(art.fragmentFallback,false);
  await artPage.close();console.log('PASS bilingual continuation and uncropped historical illustration');
  fs.writeFileSync(path.join(out,'metrics.json'),JSON.stringify(evidence,null,2)+'\n');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1});
