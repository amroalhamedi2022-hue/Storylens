/* Lingua Tales — Wen Glass cross-runtime optical interaction layer.
 * Ported from Wen-sarafet/glass-engine (GlassMotion, WenNavigationLensDrawable,
 * WenLiquidRuntimeOptics, WenGlassBackdropDrawable) into WebView-safe DOM/CSS.
 * Source design values: 0.60 gesture follow, 265ms release, 0.24 overshoot.
 * The Android API 33 AGSL RuntimeShader cannot run directly in WebView.
 * This composited CSS fallback uses finite effects, no screen capture,
 * no recurring animation and does not replace application click handlers.
 */
(function(global){
 'use strict';
 const doc=global.document;
 if(!doc||typeof doc.addEventListener!=='function')return;
 const FOLLOW=.60, RELEASE_MS=265, SLOP=8, SCROLL_SLOP=14;
 const ACTION='button,.lt-theme-choice,.library .card,.lt-genre,.stl-choice,.stl-favorite,.stl-sense-button,.reader .lt-chapter-button';
 const TRACK='.lt-genre-list,.stl-discovery-controls,.lt-theme-gallery';
 const state=new Map();
 let frame=0, lens=null, track=null, move=null;
 const media=q=>!!global.matchMedia?.(q)?.matches;
 const reduced=()=>media('(prefers-reduced-motion: reduce)')||media('(prefers-reduced-transparency: reduce)');
 const cap=(n,min,max)=>Math.max(min,Math.min(max,n));
 const set=(el,k,v)=>el?.style?.setProperty?.(k,v);
 const root=()=>doc.body;
 function validTarget(node){
  const el=node?.closest?.(ACTION);
  if(!el||el.disabled||el.matches?.('[aria-disabled="true"],[inert]')||
     el.closest?.('[inert],[aria-hidden="true"],fieldset[disabled]'))return null;
  // Historic art zoom, individual dictionary tokens and actual book ink must
  // keep their own touch/selection handlers and quiet opaque reading surface.
  if(el.closest?.('.lt-art-viewer,.lt-inline-image-viewer,.lt-illustration-viewer'))return null;
  if(el.closest?.('#sentences')&&!el.matches?.('.lt-chapter-button'))return null;
  return el;
 }
 function resetLens(){
  if(lens){
   lens.classList.remove('lt-wen-lens-live','lt-wen-lens-moving');
   set(lens,'--lt-wen-stretch-x','1');
   set(lens,'--lt-wen-stretch-y','1');
  }
  track=null;
 }
 // The focus travels only within its original tray. This is optical ONLY:
 // never synthesize clicks or change native theme hold, reading or selection.
 function opticTarget(g,x,y){
  if(!g.material||!g.container||typeof doc.elementFromPoint!=='function')return g.el;
  const hit=validTarget(doc.elementFromPoint(x,y));
  return hit?.closest?.(TRACK)===g.container?hit:g.el;
 }
 function clearForPointer(id){
  const g=state.get(id);
  if(!g)return false;
  state.delete(id);
  g.el?.classList?.remove('lt-wen-pressed','lt-wen-moving');
  g.el?.style?.removeProperty?.('--lt-wen-touch-x');
  g.el?.style?.removeProperty?.('--lt-wen-touch-y');
  if(!state.size){if(frame){global.cancelAnimationFrame?.(frame);frame=0;}move=null;resetLens();}
  return true;
 }
 function ensureLens(container){
  if(!container||reduced())return null;
  if(track!==container){
   resetLens();
   track=container;
   lens=container.querySelector?.(':scope > .lt-wen-follow-lens')||null;
   if(!lens){
    lens=doc.createElement('span');
    lens.className='lt-wen-follow-lens';
    lens.setAttribute('aria-hidden','true');
    container.appendChild(lens);
   }
  }
  return lens;
 }
 function positionLens(el,dx,dy,instant){
  const box=track?.getBoundingClientRect?.(), r=el?.getBoundingClientRect?.();
  if(!box||!r||!lens)return;
  const x=r.left-box.left+dx, y=r.top-box.top+dy;
  // Relative physical pixel coordinates are independent from RTL ordering.
  set(lens,'--lt-wen-lens-x',Math.round(x)+'px');
  set(lens,'--lt-wen-lens-y',Math.round(y)+'px');
  set(lens,'--lt-wen-lens-w',Math.max(24,Math.round(r.width))+'px');
  set(lens,'--lt-wen-lens-h',Math.max(24,Math.round(r.height))+'px');
  lens.classList.toggle('lt-wen-lens-moving',!instant);
  lens.classList.add('lt-wen-lens-live');
 }
 function begin(e){
  // A second finger must cancel the decorative held lens immediately.
  // Let Android/WebView retain native pinch, scrolling and text selection.
  if(e.isPrimary===false||state.size&&!state.has(e.pointerId)){
   if(state.size)allGone();
   return;
  }
  if(e.pointerType==='mouse'&&e.button!==0||state.has(e.pointerId))return;
  const el=validTarget(e.target);
  if(!el)return;
  const rect=el.getBoundingClientRect?.();
  if(!rect||!rect.width||!rect.height)return;
  root()?.classList?.add('lt-wen-optics');
  let localX=cap(e.clientX-rect.left,0,rect.width);
  let localY=cap(e.clientY-rect.top,0,rect.height);
  set(el,'--lt-wen-touch-x',Math.round(localX)+'px');
  set(el,'--lt-wen-touch-y',Math.round(localY)+'px');
  el.classList.add('lt-wen-pressed');
  const parent=el.closest?.(TRACK);
  const material=parent&&ensureLens(parent);
  if(material)positionLens(el,0,0,true);
  const now=global.performance?.now?.()||0;
  state.set(e.pointerId,{el,container:material?parent:null,startX:e.clientX,startY:e.clientY,
    lastX:e.clientX,lastY:e.clientY,lastTime:now,startTime:now,
    moving:false,material:!!material});
 }
 function moveTo(){
  frame=0;
  const p=move;move=null;
  if(!p)return;
  const g=state.get(p.id);
  if(!g||!g.el?.isConnected)return;
  const rect=g.el.getBoundingClientRect();
  set(g.el,'--lt-wen-touch-x',Math.round(cap(p.x-rect.left,0,rect.width))+'px');
  set(g.el,'--lt-wen-touch-y',Math.round(cap(p.y-rect.top,0,rect.height))+'px');
  if(g.material&&track===g.container&&!reduced()){
   const focus=opticTarget(g,p.x,p.y),r=focus.getBoundingClientRect();
   // Smooth adjacent-chip optical morph; actual actions remain native.
   const sibling=focus!==g.el;
   const dx=sibling?cap((p.x-r.left-r.width/2)*.15,-r.width*.18,r.width*.18)
                   :cap((p.x-g.startX)*FOLLOW,-r.width*.25,r.width*.25);
   const dy=sibling?cap((p.y-r.top-r.height/2)*.13,-r.height*.16,r.height*.16)
                   :cap((p.y-g.startY)*FOLLOW,-r.height*.20,r.height*.20);
   const elapsed=Math.max(8,p.time-g.lastTime);
   const velocity=cap(Math.hypot(p.x-g.lastX,p.y-g.lastY)/elapsed,0,2.5);
   const stretch=cap(velocity*.055,0,.14);
   set(lens,'--lt-wen-stretch-x',(1+stretch).toFixed(3));
   set(lens,'--lt-wen-stretch-y',(1-stretch*.32).toFixed(3));
   positionLens(focus,dx,dy,false);
  }
  g.lastX=p.x;g.lastY=p.y;g.lastTime=p.time;
 }
 function onMove(e){
  const g=state.get(e.pointerId);
  if(!g)return;
  const dx=e.clientX-g.startX,dy=e.clientY-g.startY;
  // Vertical scroll wins; decorative optics must not chase scrolling cards.
  if(Math.abs(dy)>SCROLL_SLOP&&Math.abs(dy)>Math.abs(dx)*1.18){
   clearForPointer(e.pointerId);return;
  }
  if(Math.hypot(dx,dy)>SLOP){
   g.moving=true;
   // Do not consume touch scroll, paper gestures or dictionary selection.
   g.el.classList.add('lt-wen-moving');
  }
  if(!g.moving||reduced())return;
  move={id:e.pointerId,x:e.clientX,y:e.clientY,time:global.performance?.now?.()||g.lastTime+16};
  if(frame)return;
  if(typeof global.requestAnimationFrame==='function')frame=global.requestAnimationFrame(moveTo);
  else moveTo();
 }
 function end(e){
  // Android WebView emits lostpointercapture after pointerup; the second
  // event must not erase another gesture's touch feedback or double tap.
  clearForPointer(e.pointerId);
 }
 function clearKeyboard(){
  doc.querySelectorAll?.('.lt-wen-keyboard')?.forEach(el=>
   el.classList.remove('lt-wen-keyboard'));
 }
 function allGone(){
  for(const id of Array.from(state.keys()))clearForPointer(id);
  resetLens();
  clearKeyboard();
 }
 doc.addEventListener('pointerdown',begin,{capture:true,passive:true});
 doc.addEventListener('pointermove',onMove,{capture:true,passive:true});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])doc.addEventListener(type,end,{capture:true,passive:true});
 global.addEventListener?.('blur',allGone);
 doc.addEventListener('focusout',e=>{
  e.target?.classList?.remove('lt-wen-keyboard');
 },true);
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)allGone();});
 doc.addEventListener('keydown',e=>{
  if(e.key==='Escape')allGone();
  if(e.key!=='Enter'&&e.key!==' ')return;
  const el=validTarget(e.target);
  if(!el||e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;
  root()?.classList?.add('lt-wen-optics');
  el.classList.add('lt-wen-keyboard');
 });
 doc.addEventListener('keyup',e=>{
  if(e.key==='Enter'||e.key===' ')doc.querySelectorAll?.('.lt-wen-keyboard')
   .forEach(el=>el.classList.remove('lt-wen-keyboard'));
 });
 // Enable on load so fresh dynamic reader/modal elements get CSS immediately.
 root()?.classList?.add('lt-wen-optics');
 global.LinguaWenGlass={version:'1.1-tablet-optics',follow:FOLLOW,releaseMs:RELEASE_MS,
  get activePointers(){return state.size;},clear:allGone, reduced};
})(window);
