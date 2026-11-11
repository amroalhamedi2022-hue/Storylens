#!/usr/bin/env python3
"""Build temporary HTML fixtures for real Chromium screenshots and E2E DOM QA.

Fixtures are generated AFTER APK assembly so QA code is never shipped in the app.
"""
from pathlib import Path
assets=Path(__file__).resolve().parents[1]/"app/src/main/assets"
source=(assets/"index.html").read_text(encoding="utf-8")
assert source.count("</body>")==1
tests={
 "reader":"""openStory('last-passenger');document.body.setAttribute('data-stl-screenshot','reader');""",
 "word":"""(async function(){await window.LinguaContentLoader.ensureDictionary();openStory('last-passenger');document.querySelector('.reader .tok')?.click();document.body.setAttribute('data-stl-screenshot','word')})();""",
 "backup":"""StoryLensBackup.open();document.body.setAttribute('data-stl-screenshot','backup');""",
 "verne14":r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(13)}catch(e){errors.push(e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');const ok=state.page==='reader'&&state.chapter===13&&state.story?.id==='around-the-world-in-eighty-days-towle'&&!!reader&&reader.textContent.includes('Calcutta');document.body.setAttribute('data-storylens-qa',ok?'PASS':'FAIL');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne14')})();""",
 "flow":r"""
(async function(){
 const passes=[],errors=[];
 function check(name,fn){try{if(!fn())throw Error('false');passes.push(name)}catch(err){errors.push(name+': '+err.message)}}
 // Underlying source catalog stays complete, but only long novels are discoverable.
  const isLongBook=s=>Math.max(s.chapters?.length||0,s.totalChapters||0)>=12;
  const novelCards=()=>Array.from(document.querySelectorAll('.shelf .card'));
  check('catalog',()=>catalog.stories.length>=38&&novelCards().length===catalog.stories.filter(isLongBook).length&&novelCards().every(card=>{const id=card.querySelector('[data-lt-cover-story]')?.getAttribute('data-lt-cover-story');return catalog.stories.some(s=>s.id===id&&isLongBook(s));}));
  check('title ON book cover',()=>novelCards().length>0&&novelCards().every(card=>{const cover=card.querySelector('.lt-book-cover');const id=cover?.getAttribute('data-lt-cover-story');const title=catalog.stories.find(s=>s.id===id)?.title;return !!title&&cover.querySelector('.lt-book-cover-title')?.textContent===title;}));
 check('hero',()=>!!document.querySelector('.storylens-hero'));
 check('dictionary',()=>FreeDictEnglishArabic.size>=80000&&FreeDictEnglishArabic.resolve('dog')?.literal.includes('كلب'));
 check('story art',()=>!!art['eleven-minute-alibi_0']);
 check('novella catalog',()=>catalog.stories.some(s=>s.id==='the-salt-meridian'&&s.chapters.length===5));
 check('novella art',()=>!!art['the-salt-meridian_4']);
 check('Verne catalog publishes verified book after deferred load',()=>catalog.stories.some(s=>s.id==='around-the-world-in-eighty-days-towle'&&s.lazyBook===false&&s.totalChapters===37&&s.chapters.length===37));
 check('original archived Verne cover is visible without synthetic final-chapter art',()=>{
  const cover=document.querySelector('.library .lt-book-cover[data-lt-cover-story="around-the-world-in-eighty-days-towle"]');
  return !!cover&&getComputedStyle(cover).backgroundImage.includes('art/verne-kiouni-1873.webp')&&
   !art['around-the-world-in-eighty-days-towle_36'];
 });
 check('in-book search entry',()=>!!document.querySelector('.lt-chapter-search-open'));
 check('offline chapter search',()=>{const hits=LinguaShell.searchChapters('harbor authority');return hits.some(x=>x.storyId==='the-salt-meridian'&&x.en.includes('harbor authority'))});
 check('Arabic source search',()=>LinguaShell.searchChapters('المنارة').some(x=>x.storyId==='the-salt-meridian'));
 check('search modal inert background',()=>{LinguaShell.openChapterSearch();return !!document.querySelector('.lt-chapter-search')&&document.getElementById('root').inert});
 check('search modal escape cleanup',()=>{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return !document.getElementById('root').inert&&!document.querySelector('.lt-chapter-search')});
 try{openStory('eleven-minute-alibi')}catch(e){errors.push('open: '+e.message)}
 check('reader',()=>state.page==='reader'&&!!document.querySelector('.reader .tok'));
 try{document.querySelector('.reader .tok').click()}catch(e){errors.push('tap: '+e.message)}
 check('word',()=>!!document.querySelector('.sheet')&&!document.querySelector('.sheet').textContent.includes('لم نضف المعنى المعجمي'));
 try{closeSheet();settings()}catch(e){errors.push('settings: '+e.message)}
 check('chapters',()=>!!document.querySelector('.chapter-picker'));
 try{stlBookmark()}catch(e){errors.push('bookmark: '+e.message)}
 check('bookmark saved',()=>!!get('bookmarks',{})['eleven-minute-alibi']);
 try{stlChapter(1)}catch(e){errors.push('chapter navigation: '+e.message)}
 check('chapter navigation',()=>state.chapter===1);
 try{stlJumpBookmark()}catch(e){errors.push('jump bookmark: '+e.message)}
 check('bookmark restored',()=>state.chapter===0);
 try{fullTranslation()}catch(e){errors.push('translation: '+e.message)}
 check('full translation',()=>state.page==='translation'&&document.querySelector('.arabic-page')?.textContent.includes('التحقيق'));
 // The real reader exits asynchronously: history popstate or 480ms fallback,
 // then up to 190ms closing motion. Await the library before theme assertions.
 try{
  backToReader();libraryBack();
  await new Promise((resolve,reject)=>{
   const deadline=Date.now()+1450;
   const poll=()=>{
    if(state.page==='library'&&document.querySelector('.library .shelf'))return resolve();
    if(Date.now()>deadline)return reject(Error('reader exit timed out: '+JSON.stringify({page:state.page,closing:window.LinguaStoryNavigation?.isClosing?.(),waiting:window.LinguaStoryNavigation?.isWaitingForHistory?.()})));
    setTimeout(poll,35);
   };poll();
  });
  cycleVisualTheme();
 }catch(e){errors.push('theme: '+e.message)}
 check('switch theme',()=>state.uiTheme==='aqua'&&document.body.classList.contains('theme-aqua'));
 // Theme navigation rebuilds the shelf; check actual visible book cards,
  // not a fragile equality to the whole source catalog (including hidden shorts).
  check('library retained',()=>{
    const shelf=document.querySelector('.library .shelf.lt-novel-shelf');
    const cards=novelCards();
    const legacy=catalog.stories.find(s=>s.id==='the-salt-meridian');
    const valid=!!shelf&&cards.length>0&&cards.every(card=>{
      const id=card.querySelector('[data-lt-cover-story]')?.getAttribute('data-lt-cover-story');
      return catalog.stories.some(story=>story.id===id&&isLongBook(story));
    })&&legacy?.chapters?.length===5;
    if(!valid)throw Error(JSON.stringify({shelf:!!shelf,cards:cards.length,allLong:catalog.stories.filter(isLongBook).length,legacy:legacy?.chapters?.length,page:state.page}));
    return true;
  });

 check('discover controls',()=>!!document.querySelector('.stl-discovery')&&!!document.querySelector('.stl-select select'));
 check('favorite persistence',()=>{const x=StoryLensExtras.toggleFavorite('eleven-minute-alibi');return x===true&&StoryLensExtras.favorites().includes('eleven-minute-alibi')});
 check('favorite removal',()=>{const x=StoryLensExtras.toggleFavorite('eleven-minute-alibi');return x===false&&!StoryLensExtras.favorites().includes('eleven-minute-alibi')});
 check('reading preferences',()=>{StoryLensExtras.preference('spacing','airy');openStory('eleven-minute-alibi');return document.querySelector('.reader')?.dataset.spacing==='airy'});
 check('reading focus',()=>{StoryLensExtras.preference('illustrations',false);return document.querySelector('.reader')?.classList.contains('stl-hide-illustrations')});
 check('reader tool settings',()=>{settings();return !!document.querySelector('.stl-reading-custom')});
 check('offline backup',()=>{const data=StoryLensBackup.exportObject();return StoryLensBackup.preview(data).stats.keys>=0&&JSON.parse(data).format==='storylens.backup'});
 check('backup modal',()=>{StoryLensBackup.open();return !!document.querySelector('.stl-backup-sheet')&&!!document.querySelector('#stl-backup-import')});

 try{openStory('around-the-world-in-eighty-days-towle');stlChapter(13)}catch(e){errors.push('Verne Chapter XIV open: '+e.message)}
 check('Verne Chapter XIV reader opens the new source',()=>state.page==='reader'&&state.chapter===13&&!!document.querySelector('.reader')&&document.querySelector('.reader').textContent.includes('Calcutta'));
 try{openStory('around-the-world-in-eighty-days-towle');stlChapter(14)}catch(e){errors.push('Verne Chapter XV open: '+e.message)}
 check('Verne Chapter XV reader opens the new source',()=>state.page==='reader'&&state.chapter===14&&!!document.querySelector('.reader')&&document.querySelector('.reader').textContent.includes('Judge Obadiah')&&document.querySelector('.reader').textContent.includes('15 من 37')&&document.querySelector('.reader').textContent.includes('نهاية الفصل 15')&&!document.querySelector('.reader').textContent.includes('The End'));
 try{openStory('around-the-world-in-eighty-days-towle');stlChapter(15)}catch(e){errors.push('Verne Chapter XVI open: '+e.message)}
 check('Verne Chapter XVI reader opens the new source',()=>state.page==='reader'&&state.chapter===15&&!!document.querySelector('.reader')&&document.querySelector('.reader').textContent.includes('Straits of Malacca')&&document.querySelector('.reader').textContent.includes('16 من 37')&&document.querySelector('.reader').textContent.includes('نهاية الفصل 16')&&!document.querySelector('.reader').textContent.includes('The End'));
  try{openStory('around-the-world-in-eighty-days-towle');stlChapter(16)}catch(e){errors.push('Verne Chapter XVII open: '+e.message)}
  check('Verne Chapter XVII reader opens the new source',()=>state.page==='reader'&&state.chapter===16&&!!document.querySelector('.reader')&&document.querySelector('.reader').textContent.includes('Singapore')&&document.querySelector('.reader').textContent.includes('17 من 37')&&document.querySelector('.reader').textContent.includes('نهاية الفصل 17')&&!document.querySelector('.reader').textContent.includes('The End'));
  try{openStory('around-the-world-in-eighty-days-towle');stlChapter(17)}catch(e){errors.push('Verne Chapter XVIII open: '+e.message)}
  check('Verne Chapter XVIII reader opens the new source',()=>{const reader=document.querySelector('.reader'),primary=reader?.querySelector('.chapter-end > button.primary'),navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];return state.page==='reader'&&state.chapter===17&&state.story?.id==='around-the-world-in-eighty-days-towle'&&!!reader&&reader.textContent.includes('Carnatic')&&reader.textContent.includes('18 من 37')&&reader.textContent.includes('نهاية الفصل 18')&&String(primary?.getAttribute('onclick')).includes('nextChapter')&&!!navNext&&!navNext.disabled&&!reader.textContent.includes('The End')});
 document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-storylens-qa-count',String(passes.length));
 document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));
})();
"""
}
tests["verne15"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(14)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==14)errors.push('chapter='+state.chapter);if(state.story?.id!=='around-the-world-in-eighty-days-towle')errors.push('story='+state.story?.id);if(!reader)errors.push('reader missing');if(reader&&!reader.textContent.includes('Judge Obadiah'))errors.push('judge text missing');if(reader&&!reader.textContent.includes('15 من 37'))errors.push('full novel progress missing');if(reader&&!reader.textContent.includes('نهاية الفصل 15'))errors.push('chapter-end label missing; current='+state.chapter+'; available='+state.story?.chapters?.length+'; total='+state.story?.totalChapters+'; end='+reader.querySelector('.chapter-end div')?.textContent);if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne15')})();"""
tests["verne16"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(15)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==15)errors.push('chapter='+state.chapter);if(state.story?.id!=='around-the-world-in-eighty-days-towle')errors.push('story='+state.story?.id);if(!reader)errors.push('reader missing');if(reader&&!reader.textContent.includes('Straits of Malacca'))errors.push('Malacca passage text missing');if(reader&&!reader.textContent.includes('16 من 37'))errors.push('full novel progress missing');if(reader&&!reader.textContent.includes('نهاية الفصل 16'))errors.push('chapter-end label missing');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne16')})();"""
tests["verne17"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(16)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==16)errors.push('chapter='+state.chapter);if(state.story?.id!=='around-the-world-in-eighty-days-towle')errors.push('story='+state.story?.id);if(!reader)errors.push('reader missing');if(reader&&!reader.textContent.includes('Singapore'))errors.push('Singapore passage text missing');if(reader&&!reader.textContent.includes('17 من 37'))errors.push('full novel progress missing');if(reader&&!reader.textContent.includes('نهاية الفصل 17'))errors.push('chapter-end label missing; current='+reader.querySelector('.chapter-end > div')?.textContent);const nextAction=reader?.querySelector('.chapter-end > button.primary');if(reader&&(!nextAction||!String(nextAction.getAttribute('onclick')).includes('nextChapter')))errors.push('primary next-chapter action missing');const navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];if(reader&&(!navNext||navNext.disabled||!navNext.textContent.includes('الفصل التالي')))errors.push('accessible chapter-navigation next control missing or disabled');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne17')})();"""
tests["verne18"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(17)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==17)errors.push('chapter='+state.chapter);if(state.story?.id!=='around-the-world-in-eighty-days-towle')errors.push('story='+state.story?.id);if(!reader)errors.push('reader missing');if(reader&&!reader.textContent.includes('Carnatic'))errors.push('Hong Kong/Carnatic source passage missing');if(reader&&!reader.textContent.includes('18 من 37'))errors.push('full novel progress missing');if(reader&&!reader.textContent.includes('نهاية الفصل 18'))errors.push('normal Chapter XVIII end label missing');const primary=reader?.querySelector('.chapter-end > button.primary');if(reader&&(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter')))errors.push('primary next-chapter action missing');const navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];if(reader&&(!navNext||navNext.disabled||!navNext.textContent.includes('الفصل التالي')))errors.push('accessible next chapter should be enabled');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne18')})();"""
 
tests["verne18-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(17)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const button=reader?.querySelector('.chapter-end > button.primary');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==17)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('18 of 37'))errors.push('novel progress missing');if(!reader||!reader.textContent.includes('Carnatic'))errors.push('source passage missing');if(!end||end.textContent.trim()==='The End'||end.textContent.includes('To be continued'))errors.push('Chapter XVIII should be a normal chapter, not a terminal state: '+end?.textContent);if(!button||!String(button.getAttribute('onclick')).includes('nextChapter'))errors.push('primary next-chapter action missing');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(!nav||nav.length<2||nav[0].textContent.trim()!=='← Previous chapter'||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English chapter navigation labels/state incorrect');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne18-en')})();"""


tests["verne19"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(18)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==18)errors.push('chapter='+state.chapter);if(state.story?.id!=='around-the-world-in-eighty-days-towle')errors.push('story='+state.story?.id);if(!reader)errors.push('reader missing');if(reader&&!reader.textContent.includes('Hong Kong'))errors.push('Hong Kong source passage missing');if(reader&&!reader.textContent.includes('19 من 37'))errors.push('novel progress missing');if(reader&&reader.textContent.includes('يتبع — لم تكتمل الرواية بعد'))errors.push('Chapter XIX incorrectly treated as the last available chapter');const primary=reader?.querySelector('.chapter-end > button.primary');if(reader&&(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter')))errors.push('Arabic next-chapter action missing');const navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];if(reader&&(!navNext||navNext.disabled))errors.push('Chapter XX navigation should be enabled');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne19')})();"""
tests["verne19-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(18)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const button=reader?.querySelector('.chapter-end > button.primary');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==18)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('19 of 37'))errors.push('novel progress missing');if(!reader||!reader.textContent.includes('Hong Kong'))errors.push('source passage missing');if(!end||end.textContent.trim()==='To be continued — more chapters are coming'||end.textContent.trim()==='The End')errors.push('Chapter XIX should remain a normal chapter: '+end?.textContent);if(!button||!String(button.getAttribute('onclick')).includes('nextChapter'))errors.push('English next-chapter action missing');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(!nav||nav.length<2||nav[0].textContent.trim()!=='← Previous chapter'||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English chapter navigation labels/state incorrect');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne19-en')})();"""
tests["verne20"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(19)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==19)errors.push('chapter='+state.chapter);if(state.story?.id!=='around-the-world-in-eighty-days-towle')errors.push('story='+state.story?.id);if(!reader)errors.push('reader missing');if(reader&&!reader.textContent.includes('Shanghai'))errors.push('Chapter XX Shanghai passage missing');if(reader&&!reader.textContent.includes('20 من 37'))errors.push('novel progress missing');if(reader&&!reader.textContent.includes('نهاية الفصل 20'))errors.push('normal chapter-end label missing');const primary=reader?.querySelector('.chapter-end > button.primary');if(reader&&(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter')))errors.push('Chapter XXI primary action missing');const navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];if(reader&&(!navNext||navNext.disabled))errors.push('Chapter XXI navigation should be enabled');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne20')})();"""
tests["verne20-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(19)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const button=reader?.querySelector('.chapter-end > button.primary');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==19)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('20 of 37'))errors.push('novel progress missing');if(!reader||!reader.textContent.includes('Shanghai'))errors.push('Chapter XX source passage missing');if(!end||end.textContent.trim()==='The End'||end.textContent.includes('To be continued'))errors.push('Chapter XX should be a normal chapter: '+end?.textContent);if(!button||!String(button.getAttribute('onclick')).includes('nextChapter'))errors.push('English next-chapter action missing');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(!nav||nav.length<2||nav[0].textContent.trim()!=='← Previous chapter'||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English chapter navigation labels/state incorrect');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne20-en')})();"""
tests["verne21"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(20)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==20)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('Shanghai'))errors.push('Chapter XXI Shanghai passage missing');if(!reader||!reader.textContent.includes('21 من 37'))errors.push('novel progress missing');if(reader&&reader.textContent.includes('يتبع — لم تكتمل الرواية بعد'))errors.push('Chapter XXI incorrectly treated as last available');const primary=reader?.querySelector('.chapter-end > button.primary');if(reader&&(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter')))errors.push('Arabic next-chapter action missing');const navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];if(reader&&(!navNext||navNext.disabled))errors.push('Chapter XXII navigation should be enabled');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne21')})();"""
tests["verne21-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(20)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const button=reader?.querySelector('.chapter-end > button.primary');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==20)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('21 of 37'))errors.push('novel progress missing');if(!reader||!reader.textContent.includes('Shanghai'))errors.push('Chapter XXI source passage missing');if(end&&(end.textContent.trim()==='To be continued — more chapters are coming'||end.textContent.trim()==='The End'))errors.push('Chapter XXI should remain a normal chapter: '+end.textContent);if(!button||!String(button.getAttribute('onclick')).includes('nextChapter'))errors.push('English next-chapter action missing');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(!nav||nav.length<2||nav[0].textContent.trim()!=='← Previous chapter'||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English chapter navigation labels/state incorrect');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne21-en')})();"""
tests["verne22"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(21)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==21)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('Yokohama'))errors.push('Chapter XXII Yokohama passage missing');if(!reader||!reader.textContent.includes('22 من 37'))errors.push('current chapter progress missing');const navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];if(reader&&(!navNext||navNext.disabled))errors.push('Chapter XXIII must be available from Chapter XXII');if(reader&&reader.textContent.includes('يتبع — لم تكتمل الرواية بعد'))errors.push('premature terminal label present');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne22')})();""";
tests["verne22-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(21)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==21)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('22 of 37'))errors.push('current chapter progress missing');if(!reader||!reader.textContent.includes('Yokohama'))errors.push('Chapter XXII source passage missing');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(!nav||nav.length<2||nav[1].disabled||nav[1].textContent.trim()!=='Next chapter →')errors.push('English next-chapter state incorrect');if(reader&&reader.textContent.includes('To be continued — more chapters are coming'))errors.push('premature terminal label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne22-en')})();""";
tests["verne23"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(22)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==22)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('Long Noses'))errors.push('Chapter XXIII Arabic passage missing');if(!reader||!reader.textContent.includes('23 من 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()==='The End'||end.textContent.includes('يتبع — لم تكتمل الرواية بعد'))errors.push('Chapter XXIII should remain a normal chapter: '+end?.textContent);if(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter'))errors.push('Arabic next-chapter action missing');const navNext=reader?.querySelectorAll('.lt-chapter-nav button')[1];if(reader&&(!navNext||navNext.disabled))errors.push('Chapter XXIV navigation should be enabled');if(reader&&reader.textContent.includes('The End'))errors.push('false ending label present');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne23')})();""";
tests["verne23-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(22)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==22)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('Long Noses'))errors.push('Chapter XXIII English passage missing');if(!reader||!reader.textContent.includes('23 of 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()==='The End'||end.textContent.includes('To be continued — more chapters are coming'))errors.push('Chapter XXIII should remain a normal chapter: '+end?.textContent);if(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter'))errors.push('English next-chapter action missing');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(!nav||nav.length<2||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English Chapter XXIV navigation incorrect');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne23-en')})();""";
tests["verne24"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(23)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==23)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('San Francisco'))errors.push('Chapter XXIV source passage missing');if(!reader||!reader.textContent.includes('24 من 37'))errors.push('current chapter progress missing');if(end&&(end.textContent.trim()==='يتبع — لم تكتمل الرواية بعد'||end.textContent.trim()==='انتهت الرواية'))errors.push('Chapter XXIV must remain a normal chapter');if(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter'))errors.push('Arabic next-chapter action missing');if(!nav||nav.length<2||nav[1].disabled)errors.push('Arabic Chapter XXV navigation must be enabled');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne24')})();"""
tests["verne24-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(23)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==23)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('San Francisco'))errors.push('Chapter XXIV source passage missing');if(!reader||!reader.textContent.includes('24 of 37'))errors.push('current chapter progress missing');if(end&&(end.textContent.trim()==='To be continued — more chapters are coming'||end.textContent.trim()==='The End'))errors.push('Chapter XXIV must remain a normal chapter');if(!primary||!String(primary.getAttribute('onclick')).includes('nextChapter'))errors.push('English next-chapter action missing');if(!nav||nav.length<2||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English Chapter XXV navigation incorrect');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne24-en')})();"""
tests["verne25"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(24)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==24)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('San Francisco'))errors.push('Chapter XXV source passage missing');if(!reader||!reader.textContent.includes('25 من 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()!=='نهاية الفصل 25')errors.push('Arabic Chapter XXV end label incorrect: '+end?.textContent);if(!primary||primary.textContent.trim()!=='الفصل التالي ←')errors.push('Arabic Chapter XXV primary action incorrect');if(!nav||nav.length<2||nav[1].disabled)errors.push('Arabic Chapter XXV must navigate forward to XXVI');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne25')})();"""
tests["verne25-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(24)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==24)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('San Francisco'))errors.push('Chapter XXV source passage missing');if(!reader||!reader.textContent.includes('25 of 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()!=='End of Chapter 25')errors.push('English Chapter XXV end label incorrect: '+end?.textContent);if(!primary||primary.textContent.trim()!=='Next chapter →')errors.push('English Chapter XXV primary action incorrect');if(!nav||nav.length<2||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English Chapter XXV must navigate forward to XXVI');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne25-en')})();"""

tests["verne26"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(25)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');const label=reader?.querySelector('.reader-label');const progress=label?.querySelector('bdi[dir="rtl"]');if(!label||getComputedStyle(label).direction!=='ltr'||!progress||getComputedStyle(progress).whiteSpace!=='nowrap')errors.push('mixed-script progress label must keep LTR container and unbroken RTL progress');const availability=reader?.querySelector('.chapter-end .lt-serial-progress');if(label?.querySelector('.lt-serial-progress')||availability)errors.push('completed book must not show an incomplete-book availability note');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==25)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('Utah'))errors.push('Chapter XXVI source passage missing');if(!reader||!reader.textContent.includes('26 من 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()!=='نهاية الفصل 26')errors.push('Arabic incomplete-book label incorrect: '+end?.textContent);if(!primary||primary.textContent.trim()!=='الفصل التالي ←')errors.push('Arabic last-available action incorrect');if(!nav||nav.length<2||nav[1].disabled)errors.push('future chapter navigation to XXVII should be enabled');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne26')})();"""
tests["verne26-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(25)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const label=reader?.querySelector('.reader-label');const progress=label?.querySelector('bdi:last-of-type');if(!label||getComputedStyle(label).direction!=='ltr'||!progress||getComputedStyle(progress).whiteSpace!=='nowrap')errors.push('mixed-script progress label must keep LTR container and unbroken progress');const availability=reader?.querySelector('.chapter-end .lt-serial-progress');if(label?.querySelector('.lt-serial-progress')||availability)errors.push('completed book must not show an incomplete-book availability note');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(state.page!=='reader')errors.push('page='+state.page);if(state.chapter!==25)errors.push('chapter='+state.chapter);if(!reader||!reader.textContent.includes('Utah'))errors.push('Chapter XXVI source passage missing');if(!reader||!reader.textContent.includes('26 of 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()!=='End of Chapter 26')errors.push('English incomplete-book label incorrect: '+end?.textContent);if(!primary||primary.textContent.trim()!=='Next chapter →')errors.push('English last-available action incorrect');if(!nav||nav.length<2||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English future-chapter navigation incorrect');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne26-en')})();"""


# A logical inline translation may span physical sheets. Count its first fragment;
# dedicated pagination QA also compares the concatenated fragment text byte-for-byte.
tests["verne27"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(26);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&(!reader.querySelector('.reader-label bdi[dir="ltr"]')||!reader.querySelector('.reader-label bdi[dir="rtl"]')))errors.push('Arabic reader label direction isolation missing');const label=reader?.querySelector('.reader-label');const progress=label?.querySelector('bdi[dir="rtl"]');if(!label||getComputedStyle(label).direction!=='ltr'||!progress||getComputedStyle(progress).whiteSpace!=='nowrap')errors.push('mixed-script progress label must keep LTR container and unbroken RTL progress');const availability=reader?.querySelector('.chapter-end .lt-serial-progress');if(label?.querySelector('.lt-serial-progress')||availability)errors.push('completed book must not show an incomplete-book availability note');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');const inlineArabic=reader?[...reader.querySelectorAll('.inline-ar')]:[];const expectedArabic=state.story?.chapters?.[26]?.paragraphs?.map(p=>p.ar).join('');if(state.page!=='reader'||state.chapter!==26||state.story?.chapters?.length!==37)errors.push('reader/chapter/catalog state incorrect');if(!reader||!reader.textContent.includes('Great Salt Lake'))errors.push('Chapter XXVII source passage missing');if(!reader||reader.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==25||inlineArabic.map(node=>node.textContent).join('')!==expectedArabic||!reader.textContent.includes('في ليلة الخامس من ديسمبر'))errors.push('all 25 inline Arabic translations must render under the English source');if(!reader||!reader.textContent.includes('27 من 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()!=='نهاية الفصل 27')errors.push('Arabic incomplete-book label incorrect: '+end?.textContent);if(!primary||primary.textContent.trim()!=='الفصل التالي ←')errors.push('Arabic last-available action incorrect');if(!nav||nav.length<2||nav[1].disabled)errors.push('future chapter navigation to XXVIII should be enabled');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne27')})();"""
tests["verne27-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(26)}catch(e){errors.push('navigation: '+e.message)}const reader=document.querySelector('.reader');if(reader&&reader.querySelectorAll('.reader-label bdi[dir="ltr"]').length!==2)errors.push('English reader label direction isolation missing');const label=reader?.querySelector('.reader-label');const progress=label?.querySelector('bdi:last-of-type');if(!label||getComputedStyle(label).direction!=='ltr'||!progress||getComputedStyle(progress).whiteSpace!=='nowrap')errors.push('mixed-script progress label must keep LTR container and unbroken progress');const availability=reader?.querySelector('.chapter-end .lt-serial-progress');if(label?.querySelector('.lt-serial-progress')||availability)errors.push('completed book must not show an incomplete-book availability note');const end=reader?.querySelector('.chapter-end > div');const primary=reader?.querySelector('.chapter-end > button.primary');const nav=reader?.querySelectorAll('.lt-chapter-nav button');if(state.page!=='reader'||state.chapter!==26||state.story?.chapters?.length!==37)errors.push('reader/chapter/catalog state incorrect');if(!reader||!reader.textContent.includes('Great Salt Lake'))errors.push('Chapter XXVII source passage missing');if(!reader||!reader.textContent.includes('27 of 37'))errors.push('current chapter progress missing');if(!end||end.textContent.trim()!=='End of Chapter 27')errors.push('English incomplete-book label incorrect: '+end?.textContent);if(!primary||primary.textContent.trim()!=='Next chapter →')errors.push('English last-available action incorrect');if(!nav||nav.length<2||nav[1].textContent.trim()!=='Next chapter →'||nav[1].disabled)errors.push('English navigation to Chapter XXVIII should be enabled');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne27-en')})();"""


tests["verne28"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(27);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==27||state.story?.chapters?.length!==37)errors.push('chapter 28 catalog state');if(!r||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==75||!r.textContent.includes('Medicine Bow'))errors.push('chapter 28 bilingual passages');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 28'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('chapter 29 navigation must be enabled');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne28')})();"""
tests["verne28-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(27)}catch(e){errors.push('navigation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==27||state.story?.chapters?.length!==37)errors.push('chapter 28 catalog state');if(!r||!r.textContent.includes('Medicine Bow'))errors.push('chapter 28 source');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 28'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('chapter 29 navigation must be enabled');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne28-en')})();"""



tests["verne29"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(28);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==28||state.story?.chapters?.length!==37)errors.push('chapter 29 catalog state');if(!r||!r.textContent.includes('Plum Creek')||!r.textContent.includes('السيو')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==68||!r.textContent.includes('بتفانيه'))errors.push('chapter 29 bilingual passages');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 29'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('available chapter boundary');const archival=r?.querySelector('.lt-inline-illustration img[src="art/verne-passepartout-train-1873.webp"]');
const historicHero=r?.querySelector('.reader-hero.lt-historic-hero');
if(!archival||!archival.alt||!archival.closest('figure')?.querySelector('figcaption')?.textContent.trim()||
 !historicHero?.style.backgroundImage.includes('art/verne-passepartout-train-1873.webp')||
 r?.querySelector('.lt-inline-chapter-scene'))
 errors.push('the original 1873 train engraving must replace synthetic art in Chapter XXIX');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne29')})();"""
tests["verne29-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(28);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==28||state.story?.chapters?.length!==37)errors.push('chapter 29 catalog state');if(!r||!r.textContent.includes('Plum Creek')||!r.textContent.includes('Sioux')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==68||!r.textContent.includes('بتفانيه'))errors.push('chapter 29 bilingual passages');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 29'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('available chapter boundary');const archival=r?.querySelector('.lt-inline-illustration img[src="art/verne-passepartout-train-1873.webp"]');
const historicHero=r?.querySelector('.reader-hero.lt-historic-hero');
if(!archival||!archival.alt||!archival.closest('figure')?.querySelector('figcaption')?.textContent.trim()||
 !historicHero?.style.backgroundImage.includes('art/verne-passepartout-train-1873.webp')||
 r?.querySelector('.lt-inline-chapter-scene'))
 errors.push('the original 1873 train engraving must replace synthetic art in Chapter XXIX');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne29-en')})();""";

tests["verne30"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(29);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==29||state.story?.chapters?.length!==37)errors.push('chapter 30 catalog state');if(!r||!r.textContent.includes('Fort Kearney')||!r.textContent.includes('حصن كيرني')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==67)errors.push('chapter 30 bilingual passages');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()==='يتبع — لم تكتمل الرواية بعد'||!btn||!String(btn.getAttribute('onclick')).includes('nextChapter')||!nav||nav[1].disabled)errors.push('Chapter XXXI must be available from Chapter XXX');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne30')})();""";
tests["verne30-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(29);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==29||state.story?.chapters?.length!==37)errors.push('chapter 30 catalog state');if(!r||!r.textContent.includes('Fort Kearney')||!r.textContent.includes('Three passengers including Passepartout')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==67)errors.push('chapter 30 source and translation');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()==='To be continued — more chapters are coming'||!btn||!String(btn.getAttribute('onclick')).includes('nextChapter')||!nav||nav[1].disabled)errors.push('Chapter XXXI must be available from Chapter XXX');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne30-en')})();""";
tests["verne30-theme"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(29);state.inline=false;inlineTranslate();closeSheet();document.body.classList.add('theme-snowbound-telegraph')}catch(e){errors.push('theme reader setup: '+e.message)}const r=document.querySelector('.reader'),progress=r?.querySelector('.chapter-end .lt-serial-progress');if(!document.body.classList.contains('theme-snowbound-telegraph')||!r||getComputedStyle(r).borderTopWidth!=='7px')errors.push('Snowbound Telegraph theme did not style the reader');if(!r?.textContent.includes('Fort Kearney')||!r?.textContent.includes('حصن كيرني')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==67)errors.push('themed bilingual chapter content');if(progress)errors.push('completed book should not show an incomplete-book availability note');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne30-theme')})();""";

tests["verne31"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(30);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==30||state.story?.chapters?.length!==37)errors.push('chapter 31 catalog state');if(!r||!r.textContent.includes('أوماها')||!r.textContent.includes('تشاينا')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==37)errors.push('chapter 31 bilingual passages');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 31'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('Chapter XXXII should be available from Chapter XXXI');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne31')})();""";
tests["verne31-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(30);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==30||state.story?.chapters?.length!==37)errors.push('chapter 31 catalog state');if(!r||!r.textContent.includes('The China')||!r.textContent.includes('sledge')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==37)errors.push('chapter 31 source and translations');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 31'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('Chapter XXXII should be available from Chapter XXXI');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne31-en')})();""";
tests["verne31-theme"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(30);state.inline=false;inlineTranslate();closeSheet();document.body.classList.add('theme-prairie-sails')}catch(e){errors.push('theme reader setup: '+e.message)}const r=document.querySelector('.reader'),progress=r?.querySelector('.chapter-end .lt-serial-progress');if(!document.body.classList.contains('theme-prairie-sails')||!r||getComputedStyle(r).borderTopWidth!=='8px')errors.push('Prairie Sails theme did not style the reader');if(!r?.textContent.includes('أوماها')||!r?.textContent.includes('تشاينا')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==37)errors.push('themed bilingual chapter content');if(progress)errors.push('completed book should not show an incomplete-book availability note');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne31-theme')})();""";


tests["verne32"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(31);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==31||state.story?.chapters?.length!==37)errors.push('chapter 32 catalog state');if(!r||!r.textContent.includes('The China')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==50)errors.push('chapter 32 bilingual passages');if(!r||!r.textContent.includes('32 من 37'))errors.push('chapter 32 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 32'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('Chapter XXXIII should be enabled from Chapter XXXII');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne32')})();""";
tests["verne32-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(31);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==31||state.story?.chapters?.length!==37)errors.push('chapter 32 catalog state');if(!r||!r.textContent.includes('The China')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==50)errors.push('chapter 32 source and translations');if(!r||!r.textContent.includes('32 of 37'))errors.push('chapter 32 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 32'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('Chapter XXXIII should be enabled from Chapter XXXII');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne32-en')})();""";
tests["verne33"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(32);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==32||state.story?.chapters?.length!==37)errors.push('chapter 33 catalog state');if(!r||!r.textContent.includes('Henrietta')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==67)errors.push('chapter 33 bilingual passages');if(!r||!r.textContent.includes('33 من 37'))errors.push('chapter 33 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 33'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('Chapter XXXIV should be available from Chapter XXXIII');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne33')})();""";
tests["verne33-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(32);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==32||state.story?.chapters?.length!==37)errors.push('chapter 33 catalog state');if(!r||!r.textContent.includes('Henrietta')||!r.textContent.includes('Queen')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==67)errors.push('chapter 33 source and translations');if(!r||!r.textContent.includes('33 of 37'))errors.push('chapter 33 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 33'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('Chapter XXXIV should be available from Chapter XXXIII');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne33-en')})();""";
tests["verne33-theme"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(32);state.inline=false;inlineTranslate();closeSheet();document.body.classList.add('theme-atlantic-passage')}catch(e){errors.push('theme reader setup: '+e.message)}const r=document.querySelector('.reader'),progress=r?.querySelector('.chapter-end .lt-serial-progress');if(!document.body.classList.contains('theme-atlantic-passage')||!r||getComputedStyle(r).borderTopWidth!=='6px')errors.push('Atlantic Passage theme did not style the reader');if(!r?.textContent.includes('Henrietta')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==67)errors.push('themed Chapter XXXIII bilingual content');if(progress)errors.push('completed book should not show an incomplete-book availability note');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne33-theme')})();""";


tests["verne34"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(33);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==33||state.story?.chapters?.length!==37)errors.push('chapter 34 catalog state');if(!r||!r.textContent.includes('Custom House')||!r.textContent.includes('دار الجمارك')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==22)errors.push('chapter 34 bilingual passages');if(!r||!r.textContent.includes('34 من 37'))errors.push('chapter 34 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 34'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('Chapter XXXIV must lead into newly available Chapter XXXV');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne34')})();""";
tests["verne34-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(33);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==33||state.story?.chapters?.length!==37)errors.push('chapter 34 catalog state');if(!r||!r.textContent.includes('Custom House')||!r.textContent.includes('He had lost the wager!')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==22)errors.push('chapter 34 source and translations');if(!r||!r.textContent.includes('34 of 37'))errors.push('chapter 34 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 34'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('Chapter XXXIV must lead into newly available Chapter XXXV');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne34-en')})();""";
tests["verne34-theme"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(33);state.inline=false;inlineTranslate();closeSheet();document.body.classList.add('theme-last-five-minutes')}catch(e){errors.push('theme reader setup: '+e.message)}const r=document.querySelector('.reader'),progress=r?.querySelector('.chapter-end .lt-serial-progress');if(!document.body.classList.contains('theme-last-five-minutes')||!r||getComputedStyle(r).borderTopWidth!=='8px')errors.push('The Last Five Minutes theme did not style the reader');if(!r?.textContent.includes('دار الجمارك')||!r?.textContent.includes('خسر الرهان')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==22)errors.push('themed Chapter XXXIV bilingual content');if(progress)errors.push('completed book should not show an incomplete-book availability note');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne34-theme')})();""";



tests["verne35"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(34);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==34||state.story?.chapters?.length!==37)errors.push('chapter 35 catalog state');if(!r||!r.textContent.includes('Saville Row')||!r.textContent.includes('سافيل رو')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==52)errors.push('chapter 35 aligned bilingual paragraphs');if(!r||!r.textContent.includes('35 من 37'))errors.push('chapter 35 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 35'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('Chapter XXXV must lead into newly available Chapter XXXVI');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne35')})();""";
tests["verne35-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(34);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==34||state.story?.chapters?.length!==37)errors.push('chapter 35 catalog state');if(!r||!r.textContent.includes('Saville Row')||!r.textContent.includes('Aouda')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==52)errors.push('chapter 35 source and bilingual alignment');if(!r||!r.textContent.includes('35 of 37'))errors.push('chapter 35 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 35'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('Chapter XXXV must lead into newly available Chapter XXXVI');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne35-en')})();""";
tests["verne35-theme"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(34);state.inline=false;inlineTranslate();closeSheet();document.body.classList.add('theme-westminster-vows')}catch(e){errors.push('theme reader setup: '+e.message)}const r=document.querySelector('.reader'),progress=r?.querySelector('.chapter-end .lt-serial-progress');if(!document.body.classList.contains('theme-westminster-vows')||!r||getComputedStyle(r).borderTopWidth!=='7px')errors.push('Westminster Vows theme did not style the reader');if(!r?.textContent.includes('سافيل رو')||!r?.textContent.includes('أحبك')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==52)errors.push('themed Chapter XXXV bilingual content');if(progress)errors.push('completed book should not show an incomplete-book availability note');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne35-theme')})();""";

tests["verne36"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(35);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==35||state.story?.chapters?.length!==37)errors.push('chapter 36 catalog state');if(!r||!r.textContent.includes('البورصة')||!r.textContent.includes('ها أنا ذا')||!r?.querySelector('h2')?.textContent.includes('In which Phileas Fogg’s name is once more at a premium')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==30)errors.push('chapter 36 English heading and Arabic bilingual passages');if(!r||!r.textContent.includes('36 من 37'))errors.push('chapter 36 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='نهاية الفصل 36'||!btn||btn.textContent.trim()!=='الفصل التالي ←'||!nav||nav[1].disabled)errors.push('Chapter XXXVII should be available from Chapter XXXVI');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne36')})();""";
tests["verne36-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(35);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==35||state.story?.chapters?.length!==37)errors.push('chapter 36 catalog state');if(!r||!r.textContent.includes('at a premium')||!r.textContent.includes('Here I am, gentlemen!')||!r?.querySelector('h2')?.textContent.includes('In which Phileas Fogg’s name is once more at a premium')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==30)errors.push('chapter 36 English title, source and translations');if(!r||!r.textContent.includes('36 of 37'))errors.push('chapter 36 current progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='End of Chapter 36'||!btn||btn.textContent.trim()!=='Next chapter →'||!nav||nav[1].disabled)errors.push('Chapter XXXVII should be available from Chapter XXXVI');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne36-en')})();""";
tests["verne36-theme"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(35);state.inline=false;inlineTranslate();closeSheet();document.body.classList.add('theme-reform-club-countdown')}catch(e){errors.push('theme reader setup: '+e.message)}const r=document.querySelector('.reader'),progress=r?.querySelector('.chapter-end .lt-serial-progress');if(!document.body.classList.contains('theme-reform-club-countdown')||!r||getComputedStyle(r).borderTopWidth!=='9px')errors.push('Reform Club Countdown did not style the reader');if(!r?.textContent.includes('البورصة')||!r?.textContent.includes('ها أنا ذا')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==30)errors.push('themed Chapter XXXVI bilingual content');if(progress)errors.push('completed book should not show an incomplete-book availability note');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne36-theme')})();""";


tests["verne37"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(36);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==36||state.story?.chapters?.length!==37)errors.push('chapter 37 catalog state');if(!r||!r.querySelector('h2')?.textContent.includes('In which it is shown that Phileas Fogg gained nothing by his tour around the world')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==41||!r.textContent.includes('أسعد الرجال'))errors.push('chapter 37 English heading and Arabic bilingual ending');if(!r?.textContent.includes('37 من 37'))errors.push('chapter 37 progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='النهاية'||!btn||btn.textContent.trim()!=='العودة إلى المكتبة'||!nav||!nav[1].disabled)errors.push('Chapter XXXVII must be the honest final 37-of-37 chapter');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne37')})();""";
tests["verne37-en"] = r"""(function(){document.documentElement.lang='en';document.documentElement.dir='ltr';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(36);state.inline=false;inlineTranslate();closeSheet()}catch(e){errors.push('navigation/translation: '+e.message)}const r=document.querySelector('.reader'),a=r?.querySelector('.chapter-end .lt-serial-progress'),end=r?.querySelector('.chapter-end > div'),btn=r?.querySelector('.chapter-end > button.primary'),nav=r?.querySelectorAll('.lt-chapter-nav button');if(state.chapter!==36||state.story?.chapters?.length!==37)errors.push('chapter 37 catalog state');if(!r||!r.querySelector('h2')?.textContent.includes('In which it is shown that Phileas Fogg gained nothing by his tour around the world')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==41||!r.textContent.includes('happiest of men'))errors.push('chapter 37 English title, source and aligned translation');if(!r?.textContent.includes('37 of 37'))errors.push('chapter 37 progress');if(a)errors.push('completed book should not show an incomplete-book availability note');if(!end||end.textContent.trim()!=='The End')errors.push('final English heading: '+JSON.stringify(end?.textContent.trim()));if(!btn||btn.textContent.trim()!=='Back to library')errors.push('final English action: '+JSON.stringify(btn?.textContent.trim()));if(!nav||!nav[1]?.disabled)errors.push('final English next-chapter button must be disabled');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne37-en')})();""";
tests["verne37-theme"] = r"""(function(){document.documentElement.lang='ar';document.documentElement.dir='rtl';const errors=[];try{openStory('around-the-world-in-eighty-days-towle');stlChapter(36);state.inline=false;inlineTranslate();closeSheet();document.body.classList.add('theme-meridian-epilogue')}catch(e){errors.push('theme reader setup: '+e.message)}const r=document.querySelector('.reader'),progress=r?.querySelector('.chapter-end .lt-serial-progress');if(!document.body.classList.contains('theme-meridian-epilogue')||!r||getComputedStyle(r).borderTopWidth!=='10px')errors.push('Meridian Epilogue did not style the reader');if(!r?.querySelector('h2')?.textContent.includes('In which it is shown that Phileas Fogg')||r.querySelectorAll('.inline-ar:not(.lt-fragment-continuation)').length!==41)errors.push('themed Chapter XXXVII bilingual content');if(progress)errors.push('completed book should not show an incomplete-book availability note');if(!r?.querySelector('.reader-hero')?.classList.contains('lt-no-period-hero')||getComputedStyle(r.querySelector('.reader-hero')).display!=='none')errors.push('unsourced classic must not show artificial chapter art');const rgb=v=>{const m=v.match(/\d+/g);return m?m.slice(0,3).map(Number):null};const lum=v=>{const f=v.map(n=>{n/=255;return n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)});return .2126*f[0]+.7152*f[1]+.0722*f[2]};const contrast=(a,b)=>{if(!a)return 0;const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};const worstBg=[16,46,43],en=r?.querySelector('.sentence'),ar=r?.querySelector('.inline-ar');if(!en||contrast(rgb(getComputedStyle(en).color),worstBg)<7)errors.push('English paragraph contrast below 7:1');if(!ar||contrast(rgb(getComputedStyle(ar).color),worstBg)<4.5)errors.push('Arabic inline translation contrast below 4.5:1');document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));document.body.setAttribute('data-stl-screenshot','verne37-theme')})();""";


# Long literature and the FreeDict pack are intentionally absent from startup.
# Chromium verifies that each stays unloaded until its own user-facing path asks for it.
tests["lazy-content"] = r"""(async function(){
 const errors=[];
 try{
  const id='around-the-world-in-eighty-days-towle';
  const story=catalog.stories.find(s=>s.id===id);
  const loadedAssets=()=>Array.from(document.querySelectorAll('script[data-lt-lazy-loaded]')).map(node=>node.dataset?.ltLazyLoaded||node.getAttribute('data-lt-lazy-loaded')||'');
  const loadedBookFiles=()=>loadedAssets().filter(name=>/^classic-verne-towle-ch\d+\.js$/.test(name));
  const loadedArtFiles=()=>loadedAssets().filter(name=>/^editorial-art(?:-ch(?:35|36|37))?\.js$/.test(name));
  if(!story||story.chapters.length!==0)errors.push('long book should start with chapter metadata only');
  if(!art[id+'_0'])errors.push('library cover art should remain available before chapter loading');
  if(window.FreeDictEnglishArabic)errors.push('FreeDict should not be evaluated during startup');
  if(loadedBookFiles().length||loadedAssets().includes('freedict-en-ar.js'))
   errors.push('novel or dictionary requested before user action: '+loadedAssets().join(','));
  // A single illustration script may load during idle to hydrate missing
  // covers; it must never trigger the 37-chapter novel or the dictionary.
  await window.LinguaContentLoader.ensureDictionary();
  if(!window.FreeDictEnglishArabic?.resolve('dog'))errors.push('on-demand FreeDict lookup failed');
  if(story.chapters.length!==0)errors.push('dictionary load must not load the book');
  if(loadedAssets().filter(x=>x==='freedict-en-ar.js').length!==1||
     loadedAssets().some(x=>x!=='freedict-en-ar.js'&&x!=='editorial-art.js'))
   errors.push('dictionary must stay independent of novel payload; only idle covers may load: '+loadedAssets().join(','));
  if(loadedBookFiles().length)errors.push('dictionary request loaded book chapters');
  await window.LinguaContentLoader.ensureStory(id);
  if(story.chapters.length!==37)errors.push('book loader did not produce all 37 chapters');
  if(art[id+'_36'])errors.push('unsourced synthetic final-chapter vector must not be generated');
  if(loadedBookFiles().length!==36)errors.push('expected all 36 ordered chapter scripts after opening the book; got '+loadedBookFiles().length);
  if(loadedArtFiles().length!==1||loadedArtFiles()[0]!=='editorial-art.js')errors.push('expected only the shared legacy art engine; got '+loadedArtFiles().join(','));
  if(loadedAssets().length!==38)errors.push('expected one dictionary plus 37 offline book/art assets; got '+loadedAssets().length);
 }catch(e){errors.push('loader exception: '+e.message)}
 document.body.setAttribute('data-lt-lazy-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-lt-lazy-qa-errors',errors.join(' | '));
})();""";


# Real browser acceptance for native Arabic prose + contextual English.
tests["arabic-first"] = r"""(async function(){
 const errors=[];
 const check=(label,fn)=>{try{if(!fn())errors.push(label)}catch(e){errors.push(label+': '+e.message)}};
 try{
  filterGenre('arabic-originals');
  check('Arabic category visible',()=>state.genre==='arabic-originals'&&document.querySelector('.library .lt-location-title')?.textContent==='كتب أصلها عربي');
  // Keep original Arabic reading accessible to legacy bookmarks but OUT of the novel shelf.
  check('short Arabic original excluded from novel shelf',()=>!document.querySelector('.library [data-lt-cover-story="thirteenth-bell-arabic"]'));
  check('Arabic legacy data retained',()=>catalog.stories.some(s=>s.id==='thirteenth-bell-arabic'&&s.sourceLanguage==='ar'&&s.chapters.length===6));
  openStory('thirteenth-bell-arabic');
  await new Promise(resolve=>setTimeout(resolve,650));
  check('story is Arabic source',()=>state.story?.sourceLanguage==='ar'&&state.page==='reader');
  check('Arabic passage is native RTL',()=>{
   const p=document.querySelector('.reader .sentence');
   return p?.getAttribute('lang')==='ar'&&p.getAttribute('dir')==='rtl'&&p.textContent.includes('المحققة مريم');
  });
  check('English is not falsely used as source',()=>!document.querySelector('.reader .sentence')?.textContent.includes('investigator Maryam'));
  check('illustration stays inside the prose',()=>!!document.querySelector('.reader .lt-inline-illustration img[src^="data:image/svg+xml"]'));
  state.inline=true;renderReader();
  check('inline English contextual translation',()=>{
   const p=document.querySelector('.reader .inline-en');
   return p?.getAttribute('lang')==='en'&&p.getAttribute('dir')==='ltr'&&p.textContent.includes('investigator Maryam');
  });
  fullTranslation();
  check('full English companion opens',()=>state.page==='translation'&&!!document.querySelector('.lt-english-companion .arabic-inner p[lang="en"]'));
  check('English complete text',()=>document.querySelector('.lt-english-companion')?.textContent.includes('clock tower'));
  backToReader();
  check('back to Arabic original',()=>state.page==='reader'&&document.querySelector('.reader .sentence')?.getAttribute('lang')==='ar');
 }catch(e){errors.push('runtime: '+e.message)}
 document.body.setAttribute('data-lt-arabic-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-lt-arabic-errors',errors.join(' | '));
})();""";

tests["translation-37"] = r"""(async function(){
 const errors=[];
 const check=(label,fn)=>{try{if(!fn())errors.push(label)}catch(e){errors.push(label+': '+e.message)}};
 try{
  const id='around-the-world-in-eighty-days-towle';
  await window.LinguaContentLoader.ensureStory(id);
  const book=catalog.stories.find(s=>s.id===id);
  check('37 chapters available',()=>book?.chapters.length===37);
  put('chapter_'+id,13);
  openStory(id);
  check('chapter 14 source open',()=>state.page==='reader'&&state.chapter===13);
  fullTranslation();
  check('Arabic companion rendered',()=>state.page==='translation'&&!!document.querySelector('.lt-arabic-companion'));
  check('initial chapter heading accessible',()=>document.activeElement?.id==='lt-translation-chapter-title');
  const panel=document.querySelector('.lt-arabic-companion');
  check('English intermediary and Arabic draft correctly identified',
    ()=>panel?.querySelector('.lt-literary-disclosure')?.textContent.includes('مسودة'));
  check('correct title',()=>panel.querySelector('h2').textContent===(book.chapters[13].titleAr||book.chapters[13].title));
  check('only source-aligned chapter 14 paragraphs',()=>panel.querySelectorAll('p[lang="ar"][dir="rtl"]').length===book.chapters[13].paragraphs.length&&
    panel.querySelector('p[lang="ar"]').textContent===book.chapters[13].paragraphs[0].ar);
  check('all chapter options',()=>panel.querySelectorAll('#lt-translation-chapter option').length===37);
  check('bottom page navigation',()=>!!panel.querySelector('.lt-translation-bottom button.primary:not([disabled])'));
  const previous=panel.querySelector('p[lang="ar"]').textContent;
  window.ltTranslationChapter('36');
  const last=document.querySelector('.lt-arabic-companion');
  check('last chapter replaced text',()=>last.querySelector('p[lang="ar"]').textContent===book.chapters[36].paragraphs[0].ar&&last.querySelector('p[lang="ar"]').textContent!==previous);
  check('last chapter bounded',()=>last.querySelector('.lt-translation-bottom button.primary').disabled===true);
  check('changed chapter announces via focused heading',()=>document.activeElement?.id==='lt-translation-chapter-title'&&
    document.activeElement?.textContent===(book.chapters[36].titleAr||book.chapters[36].title));
  check('reading progress untouched',()=>state.chapter===13&&get('chapter_'+id,-1)===13);
  backToReader();
  check('return to source chapter',()=>state.page==='reader'&&state.story?.id===id&&state.chapter===13);
 }catch(e){errors.push('runtime: '+e.message)}
 document.body.setAttribute('data-lt-translation-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-lt-translation-errors',errors.join(' | '));
})();""";

# These fixtures exercise the production mesh and leave genuine held HTML for screenshots.
_curl_fixture = r"""(async function(){
 const errors=[],dir='__DIRECTION__',held=__HELD__;
 try{
  const id=dir==='rtl'?'thirteenth-bell-arabic':'last-passenger';
  put('chapter_'+id,0);put('readpage_anchor_'+id+'_0',0);openStory(id);
  await new Promise(r=>setTimeout(r,100));
  const box=document.querySelector('#sentences');box.scrollIntoView({block:'start',behavior:'instant'});
  const rect=box.getBoundingClientRect(),page=box.querySelector(':scope > .is-active');
  const w=page.getBoundingClientRect().width,x=dir==='rtl'?rect.left+12:rect.right-12,y=rect.top+60;
  const send=(type,xx,yy,id=61)=>box.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,isPrimary:id===61,pointerType:'touch',button:0,clientX:xx,clientY:yy}));
  const events=[];box.addEventListener('lingua:turncommit',e=>events.push(e.detail));
  send('pointerdown',x,y);send('pointermove',x+(dir==='rtl'?1:-1)*w*.75,y+80);
  await new Promise(r=>setTimeout(r,100));
  if(!LinguaReaderCurl.active||box.querySelectorAll('.lt-curl-facet').length!==22||!box.querySelector('.lt-curl-under'))throw Error('mesh or real underlying paper missing');
  if(box.querySelector('.lt-curl-stage .tok,.lt-curl-stage [id]'))throw Error('visual copy contains interactive identity');
  if(!held){
   send('pointercancel',x,y);
   if(LinguaReaderCurl.active||events.length||box.querySelector('.lt-curl-stage'))throw Error('cancellation did not clean up without commit');
  }
 }catch(e){errors.push(e.message)}
 document.body.setAttribute(held?'data-lt-held-fold-qa':'data-lt-paper-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute(held?'data-lt-held-fold-errors':'data-lt-paper-errors',errors.join(' | '));
 document.body.setAttribute('data-lt-paper-stage','complete');
})();"""
tests["paper-fold-browser"]=_curl_fixture.replace('__DIRECTION__','ltr').replace('__HELD__','false')
for _direction in ('rtl','ltr'):
 tests['paper-fold-held-'+_direction]=_curl_fixture.replace('__DIRECTION__',_direction).replace('__HELD__','true')

tests["shelf-centered"] = r"""(function(){
 const errors=[];
 const check=(name,fn)=>{try{if(!fn())errors.push(name)}catch(e){errors.push(name+': '+e.message)}};
 try{
  const shelf=document.querySelector('.library .shelf.lt-novel-shelf');
  const books=[...document.querySelectorAll('.library .lt-novel-card')].filter(n=>!n.hidden);
  check('novel shelf exists',()=>!!shelf&&books.length>0);
  if(shelf&&books.length===1){
   const a=shelf.getBoundingClientRect(),b=books[0].getBoundingClientRect();
   check('single book centered',()=>Math.abs((a.left+a.right)/2-(b.left+b.right)/2)<8);
  }
  const cover=books[0]?.querySelector('.lt-book-cover');
  const title=cover?.querySelector('.lt-book-cover-title');
  check('cover title stays inside book',()=>!!title&&!!cover&&title.textContent.trim()!==''&&
    title.getBoundingClientRect().left>=cover.getBoundingClientRect().left&&
    title.getBoundingClientRect().right<=cover.getBoundingClientRect().right&&
    title.scrollHeight<=title.clientHeight+2);
  check('original cover still has local art',()=>cover?.classList.contains('art')===true);
  check('cover ink mask is ACTUALLY painted',()=>{
   const mask=cover&&getComputedStyle(cover,'::before');
   return mask?.display!=='none'&&mask?.content!=='none'&&
      mask?.backgroundImage.includes('linear-gradient')&&mask?.zIndex==='1'&&
      Math.abs(parseFloat(mask.width)-cover.clientWidth)<3&&
      Math.abs(parseFloat(mask.height)-cover.clientHeight)<3&&
      mask.borderRadius==='0px'&&mask.boxShadow==='none';
  });
  check('cover archival frame is painted',()=>{
   const frame=cover&&getComputedStyle(cover,'::after');
   return frame?.display!=='none'&&frame?.zIndex==='3'&&
      parseFloat(frame.height)>=cover.clientHeight-14&&
      frame.backgroundImage==='none'&&frame.clipPath==='none'&&frame.boxShadow==='none';
  });
 }catch(e){errors.push('runtime: '+e.message)}
 document.body.setAttribute('data-lt-shelf-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-lt-shelf-errors',errors.join(' | '));
})();""";

tests["historic-verne-plates"] = r"""(async function(){
 const errors=[];
 const check=(label,condition)=>{if(!condition)errors.push(label)};
 try{
  const id='around-the-world-in-eighty-days-towle';
  await window.LinguaContentLoader.ensureStory(id);
  put('chapter_'+id,2);
  openStory(id);
  const items=[
   {index:2,src:'art/verne-route-map-1872.webp',anchor:27},
   {index:10,src:'art/verne-kiouni-1873.webp',anchor:43},
   {index:20,src:'art/verne-tankadere-1872.webp',anchor:34},
   {index:4,src:'art/verne-news-readers-1873.webp',anchor:1},
   {index:19,src:'art/verne-tankadere-cabin-1873.webp',anchor:66},
   {index:14,src:'art/verne-calcutta-court-1873.webp',anchor:19},
   {index:16,src:'art/verne-singapore-carriage-1873.webp',anchor:7},
   {index:5,src:'art/verne-fix-watch-1873.webp',anchor:25},
   {index:28,src:'art/verne-passepartout-train-1873.webp',anchor:64}
  ];
  for(const item of items){
   state.chapter=item.index;
   renderReader();
   const figures=[...document.querySelectorAll('.reader figure.lt-inline-illustration')];
   const figure=figures.find(f=>f.querySelector('img')?.getAttribute('src')===item.src);
   const picture=figure?.querySelector('img');
   check('chapter '+item.index+' original period plate exists',!!figure);
   check('chapter '+item.index+' is offline',picture?.getAttribute('src')===item.src);
   check('chapter '+item.index+' contextual alt text',!!picture?.alt?.trim());
   check('chapter '+item.index+' historical caption',!!figure?.querySelector('figcaption')?.textContent.trim());
   check('chapter '+item.index+' image preserves reserved aspect ratio',!!picture?.style?.aspectRatio);
   const source=document.querySelector('.reader [data-i="'+item.anchor+'"]');
   check('chapter '+item.index+' paragraph anchor',!!source);
   // The heavy bitmap remains intentionally lazy when offscreen.
   // SHA-256, byte integrity and RIFF/WebP decoding contracts are checked
   // separately by tools/historic-verne-art.test.cjs; this browser fixture
   // owns the real paragraph placement and local-only DOM wiring.
   check('chapter '+item.index+' image remains lazy',picture?.loading==='lazy'&&
     picture?.decoding==='async');
   // Real Chromium must show the actual ARCHIVED local plate, not just have a
   // passing JS stub: the image viewer must preserve its artwork and citation.
   const scrollBefore=document.body.style.overflow;
   picture?.click();
   const viewer=document.querySelector('.lt-art-inspection-backdrop');
   check('chapter '+item.index+' historic inspection opens',!!viewer);
   check('chapter '+item.index+' inspection stays offline',
    viewer?.querySelector('figure img')?.getAttribute('src')===item.src);
   check('chapter '+item.index+' inspection retains image credit',
    viewer?.querySelector('figcaption')?.textContent.trim()===
      figure?.querySelector('figcaption')?.textContent.trim());
   const zoomed=viewer?.querySelector('figure img');
   const zoomButtons=[...(viewer?.querySelectorAll('.lt-art-zoom-controls button')||[])];
   const zoomOut=zoomButtons[0],zoomIn=zoomButtons[1],zoomReset=zoomButtons[2];
   check('chapter '+item.index+' zoom controls mounted and localized',
    zoomButtons.length===3&&zoomButtons.every(b=>!!b.getAttribute('aria-label')));
   // Browser locale is independent from the companion's source language.
   // Stable DOM order is defined by production zoomButton calls; do not
   // infer visible controls from exact translated labels in this fixture.
   // Chromium canonicalizes numeric CSS: scale(2.250) serializes as
   // scale(2.25), so compare numeric CSS values, never raw string precision.
   const actualScale=()=>{
    const match=zoomed?.style.transform.match(/scale\(([0-9.]+)\)/);
    return match?Number(match[1]):NaN;
   };
   zoomIn?.click();zoomIn?.click();
   check('chapter '+item.index+' zoom in',Math.abs(actualScale()-2.25)<.005);
   zoomOut?.click();
   check('chapter '+item.index+' zoom out',Math.abs(actualScale()-1.5)<.005);
   zoomReset?.click();
   check('chapter '+item.index+' zoom reset',Math.abs(actualScale()-1)<.005);
   if(item.index===10){
    // Real archival portrait, real DOM and native image decode. The pan math
    // is intentionally private to reader-experience.js; test its BEHAVIOUR,
    // not a missing global function in the QA fixture.
    const viewport=viewer?.querySelector('.lt-art-inspection-viewport');
    try{await zoomed?.decode?.()}catch(_){}
    const rect=viewport?.getBoundingClientRect();
    const imageWidth=zoomed?.clientWidth||0;
    check('historic portrait decoded and viewport has width',
      imageWidth>0&&rect?.width>0);
    if(imageWidth>0&&rect?.width>0){
     zoomIn?.click();
     const zoomFactor=actualScale();
     const allowed=Math.max(0,(imageWidth*zoomFactor-rect.width)/2);
     const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
     const gesture=(type,pos)=>viewport.dispatchEvent(new PointerEvent(type,{
      bubbles:true,cancelable:true,pointerId:85,pointerType:'touch',
      isPrimary:true,button:0,
      buttons:type==='pointerup'?0:1,clientX:pos,clientY:y
     }));
     gesture('pointerdown',x);
     gesture('pointermove',x+220);
     const match=zoomed.style.transform.match(/translate3d\(([-0-9.]+)px/);
     const shifted=match?Number(match[1]):NaN;
     check('historic portrait cannot slide past actual bitmap edge',
       Number.isFinite(shifted)&&Math.abs(shifted)<=allowed+1);
     if(imageWidth*zoomFactor<=rect.width)
      check('short-width historical portrait remains centered at 1.5x',
       Math.abs(shifted)<.01);
     gesture('pointerup',x+220);
     zoomReset?.click();
    }
   }

   if(item.index===2){
    // Real browser pointer events, not mocked geometry: asymmetric fingers
    // must grow the original and translate it under the moving midpoint.
    const vp=viewer?.querySelector('.lt-art-inspection-viewport');
    const r=vp?.getBoundingClientRect();
    if(vp&&r){
     const cx=r.left+r.width/2,cy=r.top+r.height/2;
     const spread=Math.min(44,r.width*.14);
     const finger=(type,id,x)=>vp.dispatchEvent(new PointerEvent(type,{
      bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',
      isPrimary:id===71,button:0,buttons:type==='pointerup'?0:1,
      clientX:x,clientY:cy
     }));
     finger('pointerdown',71,cx-spread);
     finger('pointerdown',72,cx+spread);
     finger('pointermove',72,cx+spread*1.75);
     check('anchored gesture really pinches the original scan',actualScale()>1.25);
     check('two-finger midpoint pans original as it zooms',
       /translate3d\(-?[1-9]/.test(zoomed?.style.transform||''));
     finger('pointerup',72,cx+spread*1.75);
     finger('pointerup',71,cx-spread);
     viewer?.dispatchEvent(new KeyboardEvent('keydown',{key:'0',bubbles:true,cancelable:true}));
     check('keyboard reset works after touch pinch',Math.abs(actualScale()-1)<.005);
     // ART03c: REAL Chromium PointerEvents through the existing viewer.
     // The native touch pair must enlarge, suppress a synthetic browser
     // dblclick, then return the complete uncropped historical image to 1x.
     finger('pointerdown',73,cx+22);
     finger('pointerup',73,cx+22);
     finger('pointerdown',74,cx+22);
     finger('pointerup',74,cx+22);
     check('real Chromium touch double-tap enlarges archive plate',
       Math.abs(actualScale()-2)<.005);
     vp.dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true}));
     check('synthetic double-click does not undo touch zoom',
       Math.abs(actualScale()-2)<.005);
     finger('pointerdown',75,cx+22);
     finger('pointerup',75,cx+22);
     finger('pointerdown',76,cx+22);
     finger('pointerup',76,cx+22);
     check('second live touch double-tap resets original picture',
       Math.abs(actualScale()-1)<.005);
    }
   }
   check('chapter '+item.index+' inspection disables background scroll',
    document.body.style.overflow==='hidden');
   // Invoke the SAME no-argument bridge as Android's actual Back dispatcher,
   // not just the close button. Repeat for each of the 7 independently placed
   // scans to ensure text, caption, state and scroll are never discarded.
   const consumedBack=window.LinguaTalesArtInspection?.closeIfOpen?.();
   check('chapter '+item.index+' Android Back dismisses only the plate',
    consumedBack===true&&!document.querySelector('.lt-art-inspection-backdrop')&&
      state.page==='reader'&&document.body.style.overflow===scrollBefore);
   check('chapter '+item.index+' next Android Back remains available',
    window.LinguaTalesArtInspection?.closeIfOpen?.()===false);
   picture?.click();
   const reopened=document.querySelector('.lt-art-inspection-backdrop');
   check('chapter '+item.index+' reopens after Android Back',!!reopened);
   reopened?.querySelector('.lt-art-inspection-close')?.click();
   check('chapter '+item.index+' closes inspection without losing reader',
    !document.querySelector('.lt-art-inspection-backdrop')&&
      state.page==='reader'&&document.body.style.overflow===scrollBefore);
   const realHero=document.querySelector('.reader .reader-hero');
   check('chapter '+item.index+' top banner uses the same historic scan',
    realHero?.classList.contains('lt-historic-hero')&&realHero.style.backgroundImage.includes(item.src));
   check('chapter '+item.index+' original image ratio is retained',
    realHero?.style?.aspectRatio&&parseFloat(realHero.style.aspectRatio)>0&&
      Math.abs((realHero.getBoundingClientRect().width/
        realHero.getBoundingClientRect().height)-parseFloat(realHero.style.aspectRatio))<0.045);
   check('chapter '+item.index+' portrait no longer spans whole reader width',
    realHero?.getBoundingClientRect().width<=Math.max(430,window.innerWidth*.86));
   check('chapter '+item.index+' duplicated hero stays silent in TalkBack',
    realHero?.getAttribute('aria-hidden')==='true');
   fullTranslation();
   const companion=document.querySelector('.lt-arabic-companion .lt-companion-plate');
   const companionImage=companion?.querySelector('img');
   check('chapter '+item.index+' translated page includes same historic plate',
    companionImage?.getAttribute('src')===item.src&&!!companionImage?.alt);
   check('chapter '+item.index+' translated plate keeps lazy decoding',
    companionImage?.loading==='lazy'&&companionImage?.decoding==='async');
   companionImage?.click();
   const companionViewer=document.querySelector('.lt-art-inspection-backdrop');
   check('chapter '+item.index+' companion can inspect original plate',
    companionViewer?.querySelector('figure img')?.getAttribute('src')===item.src);
   companionViewer?.dispatchEvent(new KeyboardEvent('keydown',{
    key:'Escape',bubbles:true,cancelable:true}));
   check('chapter '+item.index+' Escape returns to translated chapter',
    !document.querySelector('.lt-art-inspection-backdrop')&&
      state.page==='translation');
   check('chapter '+item.index+' companion retains full prose',
    document.querySelectorAll('.lt-arabic-companion p[lang="ar"]').length===
      catalog.stories.find(s=>s.id===id).chapters[item.index].paragraphs.length);
   backToReader();
  }
  state.chapter=13;renderReader();
  const emptyHero=document.querySelector('.reader .reader-hero');
  check('unsourced novel chapter never shows the synthetic SVG banner',
    emptyHero?.classList.contains('lt-no-period-hero')&&
    getComputedStyle(emptyHero).display==='none');
 }catch(e){errors.push('runtime: '+e.message)}
 document.body.setAttribute('data-lt-historic-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-lt-historic-errors',errors.join(' | '));
})();""";

tests["historic-preview-news"] = r"""(async function(){
 try{
  await window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');
  put('chapter_around-the-world-in-eighty-days-towle',4);
  openStory('around-the-world-in-eighty-days-towle');
  state.chapter=4;renderReader();
  const picture=document.querySelector('.reader img[src="art/verne-news-readers-1873.webp"]');
  if(!picture)throw Error('Historic chapter image not in rendered reader');
  picture.loading='eager';
  picture.scrollIntoView({block:'center',behavior:'instant'});
  await new Promise(resolve=>setTimeout(resolve,500));
  document.body.setAttribute('data-lt-historic-preview','PASS');
 }catch(e){document.body.setAttribute('data-lt-historic-preview','FAIL');
           document.body.setAttribute('data-lt-historic-preview-errors',e.message)}
})();""";

tests["historic-preview-cabin"] = r"""(async function(){
 try{
  await window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');
  put('chapter_around-the-world-in-eighty-days-towle',19);
  openStory('around-the-world-in-eighty-days-towle');
  state.chapter=19;renderReader();
  const picture=document.querySelector('.reader img[src="art/verne-tankadere-cabin-1873.webp"]');
  if(!picture)throw Error('Historic chapter image not in rendered reader');
  picture.loading='eager';
  picture.scrollIntoView({block:'center',behavior:'instant'});
  await new Promise(resolve=>setTimeout(resolve,500));
  document.body.setAttribute('data-lt-historic-preview','PASS');
 }catch(e){document.body.setAttribute('data-lt-historic-preview','FAIL');
           document.body.setAttribute('data-lt-historic-preview-errors',e.message)}
})();""";

tests["historic-preview-calcutta"] = r"""(async function(){
 try{
  const id='around-the-world-in-eighty-days-towle';
  await window.LinguaContentLoader.ensureStory(id);
  put('chapter_'+id,14);
  openStory(id);
  state.chapter=14;renderReader();
  const picture=document.querySelector('.reader img[src="art/verne-calcutta-court-1873.webp"]');
  if(!picture)throw Error('Original chapter plate not mounted');
  picture.loading='eager';
  picture.scrollIntoView({block:'center',behavior:'instant'});
  await new Promise(resolve=>setTimeout(resolve,450));
  document.body.setAttribute('data-lt-historic-preview','PASS');
 }catch(e){
  document.body.setAttribute('data-lt-historic-preview','FAIL');
  document.body.setAttribute('data-lt-historic-preview-errors',e.message);
 }
})();""";

tests["historic-preview-singapore"] = r"""(async function(){
 try{
  const id='around-the-world-in-eighty-days-towle';
  await window.LinguaContentLoader.ensureStory(id);
  put('chapter_'+id,16);
  openStory(id);
  state.chapter=16;renderReader();
  const picture=document.querySelector('.reader img[src="art/verne-singapore-carriage-1873.webp"]');
  if(!picture)throw Error('Original chapter plate not mounted');
  picture.loading='eager';
  picture.scrollIntoView({block:'center',behavior:'instant'});
  await new Promise(resolve=>setTimeout(resolve,450));
  document.body.setAttribute('data-lt-historic-preview','PASS');
 }catch(e){
  document.body.setAttribute('data-lt-historic-preview','FAIL');
  document.body.setAttribute('data-lt-historic-preview-errors',e.message);
 }
})();""";

# CHG-02: exercise a genuine click on the library card, the real 37-chapter
# deferred original, ordered search, selected source chapter and Android Back.
# Keep this distinct from existing programmatic openStory tests, which MUST
# continue to bypass the gallery for deep links and translation tools.
tests["chapter-gallery-journey"] = r"""(async function(){
 const errors=[];
 const check=(label,test)=>{try{if(!test())errors.push(label)}
  catch(e){errors.push(label+': '+e.message)}};
 try{
  const id='around-the-world-in-eighty-days-towle';
  document.documentElement.lang='ar';
  document.documentElement.dir='rtl';
  await window.LinguaContentLoader.ensureStory(id);
  put('chapter_'+id,13);
  const card=Array.from(document.querySelectorAll('.library .card'))
   .find(el=>el.getAttribute('onclick')==="openStory('"+id+"')");
  check('library card exists',()=>!!card);
  if(!card)throw Error('book card missing');
  card.click();
  await new Promise(resolve=>setTimeout(resolve,160));
  const gallery=document.querySelector('dialog.lt-chapter-gallery');
  check('library tap presents chapter gallery',()=>gallery?.open===true&&
    window.LinguaChapterGallery?.isOpen===true);
  check('book tap must not jump to reader',()=>state.page==='library');
  const title=gallery?.querySelector('.lt-chapter-gallery-title');
  check('correct source book selected',()=>title?.textContent.includes('Around the World'));
  const search=gallery?.querySelector('.lt-chapter-gallery-search');
  check('search entire available chapter index',()=>!!search&&!search.disabled);
  const cards=gallery?.querySelectorAll('.lt-chapter-tile')||[];
  check('bounded initial DOM',()=>cards.length===36);
  check('explicit load-more for 37th chapter',()=>!!gallery?.querySelector('.lt-chapter-gallery-more'));
  const track=gallery?.querySelector('.lt-chapter-gallery-track');
  check('horizontal scrolling enabled',()=>track&&getComputedStyle(track).overflowX==='auto');
  check('RT/LT visual orientation',()=>gallery?.dir==='rtl');
  const count=gallery?.querySelector('.lt-chapter-gallery-subtitle')?.textContent||'';
  check('37 real chapters displayed as available',()=>count.includes('37'));
  check('no unapproved historical image falsely published',()=>cards.length&&
    Array.from(cards).every(c=>c.dataset.thumbnailState==='missing-or-pending-approval'));
  const resume=gallery?.querySelector('.lt-chapter-gallery-continue');
  check('resume recognises actual saved chapter',()=>resume?.textContent.includes('14'));
  search.value='34';search.dispatchEvent(new Event('input',{bubbles:true}));
  check('search chapter 34 from unrendered range',()=>track.querySelectorAll('.lt-chapter-tile').length===1&&
    track.querySelector('.lt-chapter-tile').dataset.chapterIndex==='33');
  check('search never writes chapter progress',()=>get('chapter_'+id,-1)===13);
  const target=track.querySelector('.lt-chapter-tile');
  target.click();
  check('selected real chapter 34 opened',()=>state.page==='reader'&&state.story?.id===id&&state.chapter===33);
  check('reader has genuine source chapter body',()=>!!document.querySelector('.reader .sentence'));
  check('reader progress stores the selected chapter only',()=>get('chapter_'+id,-1)===33);
  check('gallery closed on chapter selection',()=>!document.querySelector('.lt-chapter-gallery'));
  // Choosing a chapter from inside the open book must use stlChapter (no
  // second reader history entry); dismissing it must NOT close the reader.
  const insideButton=document.querySelector('.reader .lt-open-chapter-gallery');
  check('chapter chooser accessible inside the real reader',()=>!!insideButton);
  insideButton?.click();
  check('in-reader chooser opens',()=>!!document.querySelector('dialog.lt-chapter-gallery'));
  check('in-reader chooser does not change history',()=>history.state?.page==='reader');
  const inner=document.querySelector('dialog.lt-chapter-gallery');
  const innerSearch=inner?.querySelector('.lt-chapter-gallery-search');
  if(innerSearch){
   innerSearch.value='2';
   innerSearch.dispatchEvent(new Event('input',{bubbles:true}));
   check('in-reader chapter 2 search works',()=>inner.querySelectorAll('.lt-chapter-tile').length===1);
   inner.querySelector('.lt-chapter-tile')?.click();
   check('reader chapter changes without reopening app',()=>state.page==='reader'&&state.chapter===1);
   check('in-reader stlChapter stores actual new progress',()=>get('chapter_'+id,-1)===1);
   check('no duplicate reader history after in-reader chapter jump',()=>history.state?.page==='reader');
   document.querySelector('.reader .lt-open-chapter-gallery')?.click();
   document.querySelector('dialog.lt-chapter-gallery .lt-chapter-gallery-close')?.click();
   check('dismiss in-reader chooser keeps reader open',()=>state.page==='reader');
   check('dismiss does not pop reader history',()=>history.state?.page==='reader');
  }
  history.back();
  await new Promise(resolve=>setTimeout(resolve,950));
  check('system Back restores chapter gallery',()=>window.LinguaChapterGallery?.isOpen===true);
  check('reader closed safely on Back',()=>state.page==='library');
  const reopened=document.querySelector('.lt-chapter-gallery');
  check('reopened gallery contains available chapters',()=>!!reopened?.querySelector('.lt-chapter-tile'));
  document.body.setAttribute('data-lt-gallery-preview','READY');
 }catch(e){errors.push('runtime: '+e.message)}
 document.body.setAttribute('data-lt-chapter-gallery-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-lt-chapter-gallery-errors',errors.join(' | '));
})();""";

for name,script in list(tests.items()):
 if "openStory('around-the-world-in-eighty-days-towle')" not in script:
  continue
 if "(async function(){" not in script:
  script=script.replace("(function(){","(async function(){",1)
 marker="(async function(){"
 if "await window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');" not in script:
  script=script.replace(marker,marker+"await window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');",1)
 if name=="flow":
  script=script.replace("await window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');",
                        "await window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');await window.LinguaContentLoader.ensureDictionary();",1)
 tests[name]=script

for name,script in tests.items():
 result=source.replace("</body>","<script>\n"+script+"\n</script>\n</body>")
 target=assets/("qa-"+name+".html")
 target.write_text(result,encoding="utf-8")
 print(target)

