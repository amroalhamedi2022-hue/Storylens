'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const js = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/reader-experience.js'), 'utf8');
const added = [];
const chapter = {title: 'Chapter', paragraphs: [
 {en: 'A station.', ar: 'محطة.'}, {en: 'A train.', ar: 'قطار.'}, {en: 'A map.', ar: 'خريطة.'}
], inlineArt: [
 // Invalid entries must not crowd out later valid editorial art.
 ...Array.from({length: 14}, (_, i) => ({afterParagraph: i, src: 'https://example.org/blocked.png', alt: 'Blocked'})),
 {afterParagraph: 0, src: 'art/verne/station.webp', alt: 'Railway station', credit: 'CC0 illustration', position: 'edge-start', aspectRatio: 1.5, crop: 'cover', focalX: 35, focalY: 60},
 {afterParagraph: 1, src: 'https://example.org/remote.png', alt: 'Remote asset'},
 {afterParagraph: 1, src: 'art/../traversal.png', alt: 'Traversal asset'},
 {afterParagraph: 2, src: 'art/verne/map.png', alt: 'Historic map', position: 'wide', aspectRatio: -2, crop: 'cover', focalX: 500, focalY: 50},
 {afterParagraph: 0, src: 'art/verne/duplicate.png', alt: 'Duplicate anchor'},
 {afterParagraph: 1, src: 'art/verne/empty.png', alt: ''}
]};
const story = {id: 'book', chapters: [chapter]};
const sentences = [0, 1, 2].map(i => ({
 dataset: {i: String(i)}, setAttribute() {}, addEventListener() {},
 insertAdjacentElement(where, figure) {assert.equal(where, 'afterend'); added.push({i, figure});}
}));
const document = {
 documentElement: {lang: 'en'},
 querySelector() {return null;},
 querySelectorAll(selector) {return selector === '.reader .sentence' ? sentences : [];},
 createElement(tag) {return {tag, style: {}, children: [], removed: false,
  handlers:{},attributes:{},
  appendChild(child) {this.children.push(child);child.parent=this;},
  closest(selector){return selector==='figure'&&this.parent?.tag==='figure'?this.parent:null;},
  querySelector(selector){return this.children.find(child=>child.tag===selector)||null;},
  setAttribute(k,v) {this.attributes[k]=v;},
  addEventListener(k,fn){this.handlers[k]=fn;},focus(){this.focused=true;},
  remove() {this.removed=true;}};}
};
const state = {story, page: 'reader', chapter: 0};
const sandbox = {
 window: {scrollY: 0}, document, state, catalog: {stories: [story]},
 get: (_, fallback) => fallback, put() {}, esc: String, closeSheet() {},
 // The production reader decorates the base word-sheet function. This isolated
 // illustration test supplies the documented host-script dependency explicitly.
 wordSheet() {},
 library() {}, openStory() {}, renderReader() {}, settings() {}, theme() {}, inlineTranslate() {},
 Date
};
vm.runInNewContext(js, sandbox, {timeout: 5000});
sandbox.renderReader();
assert.equal(added.length, 2, 'only two safe, distinct anchored illustrations render');
assert.deepEqual(added.map(x => x.i), [0, 2]);
assert.equal(added[0].figure.children[0].src, 'art/verne/station.webp');
assert.equal(added[0].figure.children[0].alt, 'Railway station');
assert.equal(added[0].figure.children[0].loading, 'lazy');
assert.equal(added[0].figure.children[0].attributes.role,'button','real offline image is interactive');
assert.equal(added[0].figure.children[0].attributes.tabindex,'0','historical plate is keyboard reachable');
assert.equal(typeof added[0].figure.children[0].handlers.click,'function');
const gallery=[];
document.body={style:{overflow:'auto'},classList:{add(){},remove(){}},
 appendChild(el){gallery.push(el);}};
// Native hardware Back is dispatched before the reader's legacy sheet/drawer
// navigation, so inspecting an engraving cannot accidentally exit the story.
const native = fs.readFileSync(path.join(__dirname,
 '../app/src/main/java/com/storylens/reader/MainActivity.kt'),'utf8');
const back = native.slice(native.indexOf('override fun handleOnBackPressed()'),
 native.indexOf('override fun onPause()'));
assert.ok(back.indexOf('LinguaTalesArtInspection?.closeIfOpen?.()')>=0,
 'Android hardware Back must support the historic art inspection');
assert.ok(back.indexOf('LinguaTalesArtInspection')<back.indexOf("document.getElementById('modals')"),
 'close historic engraving before legacy lookup sheets');
assert.ok(back.indexOf("document.getElementById('modals')")<back.indexOf('window.LinguaShell.isDrawerOpen()'),
 'do not change existing lookup-sheet and drawer priority');
assert.equal(sandbox.window.LinguaTalesArtInspection.closeIfOpen(),false,
 'without photo inspection Android Back is not consumed');
added[0].figure.children[0].handlers.click({stopPropagation(){}});
assert.equal(gallery.length,1,'one native-size on-demand viewer');
assert.equal(document.body.style.overflow,'hidden','prevent background page turn while inspecting');
assert.equal(sandbox.window.LinguaTalesArtInspection.closeIfOpen(),true,
 'first Android Back is consumed by enlarged original engraving');
assert.equal(gallery[0].removed,true,'Android Back closes photo without leaving reader');
assert.equal(document.body.style.overflow,'auto','Back restores reading scroll lock');
assert.equal(state.page,'reader','Back does not navigate out of current chapter');
assert.equal(sandbox.window.LinguaTalesArtInspection.closeIfOpen(),false,
 'second Back is handed to existing reader navigation');
added[0].figure.children[0].handlers.click({stopPropagation(){}});
const inspection=gallery[1];
assert.equal(inspection.children[0].children[2].children[0].children[0].src,'art/verne/station.webp',
 'enlargement reuses only the packaged image path');
assert.equal(inspection.children[0].children[2].children[1].textContent,'CC0 illustration',
 'source credit remains beside enlarged engraving');
const controls=inspection.children[0].children[3];
const original=inspection.children[0].children[2].children[0].children[0];
assert.equal(controls.children.length,3,'offline original zoom controls');
assert.equal(original.draggable,false,'not an HTML image drag');
controls.children[1].handlers.click();
assert.match(original.style.transform,/scale\(1\.500\)/,'zoom in');
controls.children[0].handlers.click();
assert.match(original.style.transform,/scale\(1\.000\)/,'zoom out');
controls.children[1].handlers.click();
controls.children[2].handlers.click();
assert.match(original.style.transform,/scale\(1\.000\)/,'reset original scale');
// Verify the real two-pointer handlers: historical zoom now tracks the actual
// finger midpoint, with bounded scale; it never jumps back to viewport centre.
const sourceStart=js.indexOf('function ltArtPinchFrame(');
const sourceStop=js.indexOf('function ltOpenArtInspection(',sourceStart);
assert.ok(sourceStart>=0&&sourceStop>sourceStart,'pure anchored pinch geometry');
const pinchMath={};
vm.runInNewContext(js.slice(sourceStart,sourceStop)+
 '\nglobalThis.compute=ltArtPinchFrame;',pinchMath);
const aroundFinger=pinchMath.compute(
 {zoom:1,distance:100,x:50,y:0,panX:0,panY:0},
 {distance:200,x:50,y:0},400,600);
assert.equal(aroundFinger.zoom,2);
assert.equal(aroundFinger.panX,-50,'pixel under off-centre fingertip stays anchored');
assert.equal(pinchMath.compute(
 {zoom:1,distance:100,x:90,y:0,panX:0,panY:0},
 {distance:200,x:90,y:0},400,600,170,560).panX,0,
 'narrow portrait art stays centred until its scaled raster fills the viewport');
assert.equal(pinchMath.compute(
 {zoom:1,distance:100,x:90,y:0,panX:0,panY:0},
 {distance:400,x:90,y:0},400,600,170,560).panX,-140,
 'once magnified, portrait image pans only to its actual content edge');
assert.equal(pinchMath.compute(
 {zoom:1,distance:100,x:0,y:140,panX:0,panY:0},
 {distance:200,x:0,y:140},400,600,170,300).panY,0,
 'short manuscript folio cannot pan into blank vertical margins');
assert.equal(pinchMath.compute(
 {zoom:1,distance:100,x:0,y:140,panX:0,panY:0},
 {distance:400,x:0,y:140},400,600,170,300).panY,-300,
 'tall zoom may pan only up to its rendered image boundary');
assert.equal(pinchMath.compute(
 {zoom:1,distance:100,x:0,y:0,panX:0,panY:0},
 {distance:100,x:0,y:0},400,600,170,300).zoom,1);
assert.equal(pinchMath.compute(
 {zoom:1,distance:100,x:0,y:0,panX:0,panY:0},
 {distance:100,x:0,y:0},400,600,170,300).panX,0,
 'returning to 1x always resets side-to-side translation');

assert.equal(pinchMath.compute(
 {zoom:2,distance:100,x:0,y:0,panX:0,panY:0},
 {distance:900,x:0,y:0},400,600).zoom,4,'4x upper limit');
const viewport=inspection.children[0].children[2].children[0];
viewport.clientWidth=400;viewport.clientHeight=600;
viewport.getBoundingClientRect=()=>({left:0,top:0,width:400,height:600});
const evt=(id,x,y)=>({pointerId:id,pointerType:'touch',button:0,
 clientX:x,clientY:y,cancelable:true,preventDefault(){}});
viewport.handlers.pointerdown(evt(1,160,300));
viewport.handlers.pointerdown(evt(2,260,300));
viewport.handlers.pointermove(evt(2,290,300));
assert.match(original.style.transform,/scale\(1\.300\)/,
 'real two-finger spread enlarges the original offline photo');
assert.match(original.style.transform,/translate3d\(12\.00px/,
 'anchored pinch shifts image around finger midpoint, rather than resetting centre');
viewport.handlers.pointerup(evt(2,290,300));
viewport.handlers.pointerup(evt(1,160,300));
inspection.handlers.keydown({key:'0',preventDefault(){}});
assert.match(original.style.transform,/scale\(1\.000\)/,
 'accessible keyboard 0 resets the original image after touch');
original.clientWidth=170;original.clientHeight=500;
viewport.handlers.pointerdown(evt(3,160,300));
viewport.handlers.pointerdown(evt(4,260,300));
viewport.handlers.pointermove(evt(4,290,300));
assert.match(original.style.transform,/translate3d\(0\.00px/,
 'real portrait image cannot be pulled sideways into empty margins');
viewport.handlers.pointercancel(evt(4,290,300));
viewport.handlers.pointerup(evt(3,160,300));
inspection.handlers.keydown({key:'0',preventDefault(){}});

assert.equal(inspection.children[0].children[2].children[1].textContent,
 'CC0 illustration','caption is unchanged after zoom');
inspection.handlers.keydown({key:'Escape',preventDefault(){},stopPropagation(){}});
assert.equal(inspection.removed,true,'Escape closes inspection');
assert.equal(document.body.style.overflow,'auto','reading scroll state restored');
const css=fs.readFileSync(path.join(__dirname,'../app/src/main/assets/lt-device-acceptance.css'),'utf8');
assert.match(css,/\.lt-art-inspection-dialog figure img\{[^}]*object-fit:contain/,
 'historical portrait cannot be cropped in enlarged view');
assert.equal(added[0].figure.children[0].decoding, 'async');
assert.equal(added[0].figure.children[1].textContent, 'CC0 illustration');
assert.equal(added[0].figure.children[0].style.aspectRatio, '1.5', 'layout space reserved');
assert.equal(added[0].figure.children[0].style.objectFit, 'cover', 'opt-in crop');
assert.equal(added[0].figure.children[0].style.objectPosition, '35% 60%', 'bounded focal point');
assert.equal(added[1].figure.children[0].style.aspectRatio, undefined, 'invalid ratio ignored');
assert.equal(added[1].figure.children[0].style.objectPosition, undefined, 'unsafe focal point ignored');
assert.equal(added[0].figure.removed, false);
added[0].figure.children[0].onerror();
assert.equal(added[0].figure.removed, true, 'missing offline image removed without remote fallback');
assert.equal(added[1].figure.children[0].src, 'art/verne/map.png');
assert.equal(added[1].figure.children.length, 1);
assert.equal(chapter.paragraphs[0].ar, 'محطة.', 'Arabic learning text unchanged');
// Authentic old full-colour folios are allowed ONLY with local path +
// provenance credit; reserve original shape and ignore explicit crop=cover.
chapter.inlineArt=[{afterParagraph:0,src:'art/kalila/fox-drum.webp',
 alt:'16th-century coloured fox and drum manuscript',credit:'The Met · 16th century',
 visualTreatment:'original-colour',aspectRatio:760/1045,crop:'cover'}];
added.length=0;
sandbox.renderReader();
assert.equal(added.length,1,'stage-aware colour image can be placed in source prose');
const colourFigure=added[0].figure,colourImg=colourFigure.children[0];
assert.match(colourFigure.className,/lt-archive-colour-original/,'original pigment mode marked');
assert.equal(colourImg.style.objectFit,'contain','full original manuscript cannot crop');
assert.equal(colourImg.style.aspectRatio,String(760/1045),'original folio aspect');
assert.equal(colourFigure.children[1].textContent,'The Met · 16th century','source credit retained');
colourImg.handlers.click({stopPropagation(){}});
assert.match(gallery.at(-1).children[0].className,/lt-archive-colour-original/,
 'zoom inspection preserves colour mode from the verified book figure');
sandbox.window.LinguaTalesArtInspection.closeIfOpen();
assert.equal(document.body.style.overflow,'auto','colour folio zoom returns reader');
chapter.inlineArt=[{afterParagraph:0,src:'art/kalila/not-proven.webp',
 alt:'Uncredited art',visualTreatment:'original-colour',crop:'cover'}];
added.length=0;sandbox.renderReader();
assert.equal(added.length,1,'ordinary safe local art remains available');
assert.ok(!added[0].figure.className.includes('lt-archive-colour-original'),
 'uncredited colours cannot falsely signal authenticated original pigments');
assert.equal(added[0].figure.children[0].style.objectFit,'cover',
 'uncredited item does not inherit archive-colour visual authority');
const cssColour=fs.readFileSync(path.join(__dirname,
 '../app/src/main/assets/lt-device-acceptance.css'),'utf8');
assert.match(cssColour,/\.lt-archive-colour-original img[,\s]/,
 'historical manuscript colour must have explicit CSS preservation');
assert.match(cssColour,/filter:none!important/,'original pigments cannot be graded by CSS');
assert.match(cssColour,/object-fit:contain!important/,'original folio edges cannot be cropped');
// Existing offline chapter art should appear even when no inlineArt is authored.
chapter.inlineArt=[];
added.length=0;
sandbox.art={'book_0':'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E'};
sandbox.renderReader();
assert.equal(added.length,1,'packaged story scene inserted in actual reading flow');
assert.equal(added[0].i,2,'illustration is anchored after the opening prose');
assert.match(added[0].figure.className,/lt-inline-chapter-scene/);
assert.match(added[0].figure.children[0].src,/^data:image\/svg\+xml/);
assert.match(added[0].figure.children[0].alt,/Story — Chapter/);
assert.equal(added[0].figure.children[0].style.aspectRatio,String(1000/620));
// Bilingual text always stays adjacent; no illustration splits EN from AR.
const afterTranslation=[];
sentences[2].nextElementSibling={
 classList:{contains:name=>name==='inline-ar'},
 insertAdjacentElement(where,figure){afterTranslation.push({where,figure})}
};
added.length=0;
sandbox.renderReader();
assert.equal(added.length,0,'do not insert art between English and Arabic');
assert.equal(afterTranslation.length,1,'art is inserted after the Arabic paragraph');
assert.equal(afterTranslation[0].where,'afterend');
delete sentences[2].nextElementSibling;
added.length=0;
sandbox.art.book_0='https://example.org/remote.svg';
sandbox.renderReader();
assert.equal(added.length,0,'untrusted remote image is never fetched');
added.length=0;delete sandbox.art.book_0;
sandbox.renderReader();
assert.equal(added.length,0,'missing chapter art does not insert a broken image');
console.log('PASS: inline art anchors, chapter-specific offline scenes, safe fallback and translations');
