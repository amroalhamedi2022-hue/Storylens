/* Lingua Tales: lightweight liquid bubble feedback for real pointer taps.
 * Respects keyboard focus and prefers-reduced-motion; one bubble per gesture.
 */
(function(global){
 'use strict';
 const doc=global.document;
 if(!doc||typeof doc.addEventListener!=='function')return;
 function bubble(target,x,y){
  if(!target||global.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
  if(global.matchMedia?.('(prefers-reduced-transparency: reduce)')?.matches)return;
  if(target.disabled||target.matches?.('[aria-disabled="true"]'))return;
  if(!target.isConnected&&target.isConnected!==undefined)return;
  const rect=target.getBoundingClientRect?.();
  if(!rect||!Number.isFinite(rect.width)||!Number.isFinite(rect.height)||rect.width<=0||rect.height<=0)return;
  target.querySelectorAll?.(':scope > .lt-tap-bubble').forEach(node=>node.remove());
  const node=doc.createElement('span');node.className='lt-tap-bubble';
  node.setAttribute('aria-hidden','true');
  node.style.setProperty('--lt-tap-x',Math.max(0,Math.min(rect.width,x-rect.left))+'px');
  node.style.setProperty('--lt-tap-y',Math.max(0,Math.min(rect.height,y-rect.top))+'px');
  node.style.setProperty('--lt-bubble-size',Math.min(260,Math.ceil(Math.hypot(rect.width,rect.height)*1.2))+'px');
   target.appendChild(node);
  node.addEventListener('animationend',()=>node.remove(),{once:true});
 }
 const heldPointers=new Map();
 function releaseWaterPress(event){
  const key=event?.pointerId;
  const target=heldPointers.get(key);
  if(!target)return;
  heldPointers.delete(key);
  if(!Array.from(heldPointers.values()).includes(target))target.classList?.remove('lt-water-pressed');
 }
 doc.addEventListener('pointerup',releaseWaterPress,{passive:true,capture:true});
 doc.addEventListener('pointercancel',releaseWaterPress,{passive:true,capture:true});
 global.addEventListener?.('blur',()=>{
  for(const target of heldPointers.values())target.classList?.remove('lt-water-pressed');
  heldPointers.clear();
 });
 doc.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.pointerType==='mouse'&&event.button!==0)return;
  const target=event.target?.closest?.('button,.lt-theme-choice,.library .card,.lt-genre');
  if(!target||target.closest?.('[disabled],[aria-disabled="true"],fieldset[disabled]'))return;
  // Holding the book/button keeps the liquid-glass depression until release.
  if(event.pointerId!==undefined){
   releaseWaterPress(event);
   heldPointers.set(event.pointerId,target);
   target.classList?.add('lt-water-pressed');
  }
  bubble(target,event.clientX,event.clientY);
 },{passive:true,capture:true});
 doc.addEventListener('keyup',event=>{
  if(event.key==='Enter'||event.key===' ')
   doc.querySelectorAll?.('.lt-water-pressed').forEach(node=>node.classList?.remove('lt-water-pressed'));
 },true);
 doc.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  if(event.altKey||event.ctrlKey||event.metaKey||event.isComposing)return;
  const target=event.target?.closest?.('button,.lt-theme-choice,.library .card,.lt-genre');
  if(!target||event.repeat||target.closest?.('[disabled],[aria-disabled="true"],fieldset[disabled]'))return;
  const rect=target.getBoundingClientRect();
  target.classList?.add('lt-water-pressed');
  bubble(target,rect.left+rect.width/2,rect.top+rect.height/2);
 },true);
 let lastY=0,lastHeader=null,scheduled=false,scrollTrend=0;
 function scrollHeader(){
  const header=doc.querySelector?.('.library .header');
  const y=Math.max(0,Number(global.scrollY)||0);
  if(header!==lastHeader){lastHeader=header;lastY=y;scrollTrend=0;return;}
  if(!header)return;
  const dy=y-lastY;
  lastY=y;
  if(y<80||global.LinguaShell?.isDrawerOpen?.()){
   header.classList.remove('lt-header-concealed');scrollTrend=0;return;
  }
  // Slow WebView scroll events are often under 7px each. Accumulate genuine
  // travel while resetting the direction on reversal to avoid flicker.
  if(dy===0)return;
  if((scrollTrend>0&&dy<0)||(scrollTrend<0&&dy>0))scrollTrend=0;
  scrollTrend=Math.max(-60,Math.min(60,scrollTrend+dy));
  if(scrollTrend>=12){header.classList.add('lt-header-concealed');scrollTrend=0;}
  else if(scrollTrend<=-12){header.classList.remove('lt-header-concealed');scrollTrend=0;}
 }
 global.addEventListener?.('scroll',()=>{
  if(scheduled)return;scheduled=true;
  const finish=()=>{scheduled=false;scrollHeader();};
  if(typeof global.requestAnimationFrame==='function')global.requestAnimationFrame(finish);
  else finish();
 },{passive:true});
 global.LinguaTapFeedback={bubble};
})(window);
