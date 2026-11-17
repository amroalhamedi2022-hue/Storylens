/* Isolated experiment: not imported by production HTML or Android code. */
(function () {
"use strict";
const params=new URLSearchParams(location.search);
const engine=params.get("engine")==="st"?"st":"open";
const rtl=params.get("rtl")==="1";
const grab=params.get("grab")==="anywhere"?"anywhere":"edges";
const host=document.getElementById("book");
const status=document.getElementById("status");
const details=document.getElementById("details");
const sheet=document.getElementById("word-sheet");
const events=[];
let wordClicks=0, book;
try {
 const original=(window.StoryLensEditorialStories||[]).find(x=>x.id==="around-the-world-in-eighty-days-towle");
 if(!original||!original.chapters[0]||original.chapters[0].paragraphs.length<8)
  throw Error("Authentic offline Verne source missing from project assets");
 const chapter=original.chapters[0];
 for(let i=0;i<8;i++){
  const item=chapter.paragraphs[i];
  const node=document.createElement("article");
  node.className="paper";node.dataset.page=String(i);
  node.dir=rtl?"rtl":"ltr";node.lang=rtl?"ar":"en";
  const heading=document.createElement("h2");
  heading.textContent=(rtl?chapter.titleAr:chapter.title)+" • "+(i+1)+"/8";
  const paragraph=document.createElement("p");
  paragraph.className="source-text";
  paragraph.textContent=rtl?item.ar:item.en;
  const marker=document.createElement("button");
  marker.type="button";marker.className="token";marker.dataset.opfNoFlip="";
  marker.textContent=rtl?"عرض المعنى":"Dictionary word";
  marker.addEventListener("click",event=>{
   event.stopPropagation();wordClicks++;
   sheet.textContent=(rtl?"المعنى السياقي: ":"Contextual dictionary: ")+
    (rtl?"تفاعل النص ما زال يعمل":"interaction preserved");
  });
  const footer=document.createElement("footer");footer.textContent="Original app literary paragraph "+(i+1);
  node.append(heading,paragraph,marker,footer);host.appendChild(node);
 }
 if(engine==="st"){
  if(!window.St||typeof window.St.PageFlip!=="function")throw Error("StPageFlip bundle not loaded");
  book=new window.St.PageFlip(host,{
   width:330,height:505,size:"stretch",minWidth:290,maxWidth:420,
   minHeight:430,maxHeight:645,usePortrait:true,autoSize:false,
   flippingTime:650,showCover:false,drawShadow:true,
   maxShadowOpacity:.4,disableFlipByClick:true,clickEventForward:true
  });
  book.on("flip",ev=>events.push({kind:"flip",page:ev.data}));
  book.on("changeState",ev=>events.push({kind:"state",state:ev.data}));
  book.loadFromHTML(host.querySelectorAll(".paper"));
 }else{
  if(!window.OpenPageFlip||typeof window.OpenPageFlip.createBook!=="function")
   throw Error("OpenPageFlip IIFE bundle not loaded");
  book=window.OpenPageFlip.createBook(host,{
   width:330,height:505,size:"stretch",minWidth:290,maxWidth:420,
   layout:"auto",binding:rtl?"right":"left",cover:false,
   flipDuration:650,shadowOpacity:.35,shadows:true,click:grab,
   drag:true,swipe:true,swipeDistance:30,ignoreDragOn:"button,a,[data-opf-no-flip]"
  });
  book.on("flip",ev=>events.push({kind:"flip",page:ev.page}));
  book.on("changeState",ev=>events.push({kind:"state",state:ev.state}));
  book.on("flipProgress",ev=>{if(events.length<250)events.push({kind:"progress",value:ev.progress});});
 }
 window.evalBook={
  engine,rtl,grab,book,events,
  get wordClicks(){return wordClicks;},
  currentPage(){return engine==="st"?book.getCurrentPageIndex():book.page;},
  orientation(){return engine==="st"?book.getOrientation():book.orientation;},
  next(){return engine==="st"?book.flipNext("bottom"):book.flipNext("bottom");},
  previous(){return engine==="st"?book.flipPrev("bottom"):book.flipPrev("bottom");},
  destroy(){return book.destroy();}
 };
 status.textContent=engine+" • "+(rtl?"RTL":"LTR")+" • "+grab+" • "+window.evalBook.orientation()+
  " • original offline Chapter I • NO production integration";
 details.textContent="Source: app/src/main/assets/classic-verne-towle-ch01.js\n"+
   "Package: "+(engine==="st"?"page-flip@2.0.7":"@openpageflip/core@0.7.0")+
   "\nRTL native support: "+(engine==="open"?"yes":"NO (test not eligible)");
 document.body.dataset.ready="yes";
}catch(error){
 status.textContent="Experiment failed: "+error.message;
 document.body.dataset.ready="failed";
 window.evalError=String(error&&error.stack||error);
 console.error(error);
}
})();