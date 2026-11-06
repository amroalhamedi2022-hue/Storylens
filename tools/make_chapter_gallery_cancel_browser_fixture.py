#!/usr/bin/env python3
"""Independent real-Chromium offline long-book cancellation smoke fixture.

This is deliberately a QA-only HTML file generated from the actual app; it
never ships inside the signed APK. The test does not download or invent books.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app/src/main/assets"
src = (APP / "index.html").read_text(encoding="utf-8")
if "</body>" not in src:
    raise ValueError("Real Android index.html body missing")

script = r"""(async function(){
 const errors=[];
 const check=(label, condition)=>{
  try{
   if(!condition())errors.push(label);
  }catch(error){errors.push(label+': '+error.message)}
 };
 const wait=duration=>new Promise(resolve=>setTimeout(resolve,duration));
 const id='around-the-world-in-eighty-days-towle';
 try{
  document.documentElement.lang='ar';
  document.documentElement.dir='rtl';
  const catalog=window.LinguaCatalog?.stories||[];
  const book=catalog.find(item=>item.id===id);
  check('real original lazy book exists',()=>!!book&&book.lazyBook===true);
  check('local sequenced book loader available',()=>typeof window.LinguaContentLoader?.ensureStory==='function');
  check('real loader cancellation available',()=>typeof window.LinguaContentLoader?.cancel==='function');
  const cover=Array.from(document.querySelectorAll('.library .card[onclick]'))
    .find(element=>element.getAttribute('onclick')==="openStory('"+id+"')");
  check('real original cover card exists',()=>!!cover);
  if(!cover)throw new Error('cannot start source book cover');
  put('chapter_'+id,17);
  cover.click();
  const first=document.querySelector('dialog.lt-chapter-gallery');
  check('first modal opens synchronously',()=>!!first?.open);
  check('first chapter not prematurely available',()=>
    first?.querySelector('.lt-chapter-gallery-loading')!==null);
  first?.querySelector('.lt-chapter-gallery-close')?.click();
  check('dismissing pending book closes modal immediately',()=>
    !document.querySelector('dialog.lt-chapter-gallery'));
  await wait(130);
  check('late load does not resurrect gallery',()=>window.LinguaChapterGallery?.isOpen===false);
  check('close does not open a reader',()=>state.page==='library');
  check('close releases library focus/inert lock',()=>document.getElementById('root')?.inert!==true);
  check('dismissal never overwrites saved chapter',()=>get('chapter_'+id,-1)===17);
  check('future book resume remains possible',()=>typeof window.LinguaContentLoader?.ensureStory==='function');

  cover.click();
  const reopened=document.querySelector('dialog.lt-chapter-gallery');
  check('user can reopen book after cancelling prior batch',()=>!!reopened?.open);
  let loaded=false;
  for(let attempt=0;attempt<40;attempt++){
   if(reopened?.querySelectorAll('.lt-chapter-tile').length===36&&
      catalog.find(item=>item.id===id)?.lazyBook===false){
     loaded=true;break;
   }
   await wait(100);
  }
  check('cancelled source loader safely resumes all real 37 source chapters',()=>
    loaded&&catalog.find(item=>item.id===id)?.chapters.length===37);
  check('no invented or duplicate chapter cards',()=>
    reopened?.querySelectorAll('.lt-chapter-tile').length===36&&
    !!reopened?.querySelector('.lt-chapter-gallery-more'));
  check('source chapters preserve true 37-episode order',()=>
    reopened?.querySelector('.lt-chapter-tile[data-chapter-index="5"]')?.dataset.chapterIndex==='5');
  check('resumed loader did not alter prior chapter checkpoint',()=>get('chapter_'+id,-1)===17);
  reopened?.querySelector('.lt-chapter-tile[data-chapter-index="5"]')?.click();
  check('reader can open an actual chapter after abort/reopen',()=>
    state.page==='reader'&&state.story?.id===id&&state.chapter===5);
  check('selected chapter has original text',()=>!!document.querySelector('.reader .sentence'));
  check('chapter progress changes ONLY when the reader selects new chapter',()=>
    get('chapter_'+id,-1)===5);
  document.body.setAttribute('data-lt-lazy-cancel-demo','READY');
 }catch(error){
  errors.push('runtime: '+error.message);
 }
 document.body.setAttribute('data-lt-lazy-cancel-qa',errors.length?'FAIL':'PASS');
 document.body.setAttribute('data-lt-lazy-cancel-errors',errors.join(' | '));
})();"""
dest = APP / "qa-chapter-gallery-lazy-cancel.html"
dest.write_text(src.replace("</body>", "<script>\n" + script + "\n</script>\n</body>"), encoding="utf-8")
print("Generated original-app Chromium lazy-book cancellation fixture:", dest)
