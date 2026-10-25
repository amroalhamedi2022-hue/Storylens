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
 "word":"""openStory('last-passenger');document.querySelector('.reader .tok')?.click();document.body.setAttribute('data-stl-screenshot','word');""",
 "backup":"""StoryLensBackup.open();document.body.setAttribute('data-stl-screenshot','backup');""",
 "flow":r"""
(function(){
 const passes=[],errors=[];
 function check(name,fn){try{if(!fn())throw Error('false');passes.push(name)}catch(err){errors.push(name+': '+err.message)}}
 check('catalog',()=>catalog.stories.length>=38&&document.querySelectorAll('.card').length===catalog.stories.length);
 check('hero',()=>!!document.querySelector('.storylens-hero'));
 check('dictionary',()=>FreeDictEnglishArabic.size>=80000&&FreeDictEnglishArabic.resolve('dog')?.literal.includes('كلب'));
 check('story art',()=>!!art['eleven-minute-alibi_0']);
 check('novella catalog',()=>catalog.stories.some(s=>s.id==='the-salt-meridian'&&s.chapters.length===5));
 check('novella art',()=>!!art['the-salt-meridian_4']);
 check('Verne authentic chapter',()=>catalog.stories.some(s=>s.id==='around-the-world-in-eighty-days-towle'&&s.chapters.length===2&&s.chapters[0].paragraphs.length===29&&s.chapters[1].paragraphs.length===11));
 check('Verne chapter scenes',()=>!!art['around-the-world-in-eighty-days-towle_0']&&!!art['around-the-world-in-eighty-days-towle_1']&&art['around-the-world-in-eighty-days-towle_0']!==art['around-the-world-in-eighty-days-towle_1']);
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
 try{backToReader();libraryBack();cycleVisualTheme()}catch(e){errors.push('theme: '+e.message)}
 check('switch theme',()=>state.uiTheme==='aqua'&&document.body.classList.contains('theme-aqua'));
 check('library retained',()=>document.querySelectorAll('.card').length===catalog.stories.length);

 check('discover controls',()=>!!document.querySelector('.stl-discovery')&&!!document.querySelector('.stl-select select'));
 check('favorite persistence',()=>{const x=StoryLensExtras.toggleFavorite('eleven-minute-alibi');return x===true&&StoryLensExtras.favorites().includes('eleven-minute-alibi')});
 check('favorite removal',()=>{const x=StoryLensExtras.toggleFavorite('eleven-minute-alibi');return x===false&&!StoryLensExtras.favorites().includes('eleven-minute-alibi')});
 check('reading preferences',()=>{StoryLensExtras.preference('spacing','airy');openStory('eleven-minute-alibi');return document.querySelector('.reader')?.dataset.spacing==='airy'});
 check('reading focus',()=>{StoryLensExtras.preference('illustrations',false);return document.querySelector('.reader')?.classList.contains('stl-hide-illustrations')});
 check('reader tool settings',()=>{settings();return !!document.querySelector('.stl-reading-custom')});
 check('offline backup',()=>{const data=StoryLensBackup.exportObject();return StoryLensBackup.preview(data).stats.keys>=0&&JSON.parse(data).format==='storylens.backup'});
 check('backup modal',()=>{StoryLensBackup.open();return !!document.querySelector('.stl-backup-sheet')&&!!document.querySelector('#stl-backup-import')});

 document.body.setAttribute('data-storylens-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-storylens-qa-count',String(passes.length));
 document.body.setAttribute('data-storylens-qa-errors',errors.join(' | '));
})();
"""
}
for name,script in tests.items():
 result=source.replace("</body>","<script>\n"+script+"\n</script>\n</body>")
 target=assets/("qa-"+name+".html")
 target.write_text(result,encoding="utf-8")
 print(target)
