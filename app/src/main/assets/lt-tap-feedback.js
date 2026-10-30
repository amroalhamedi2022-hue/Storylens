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
  const rect=target.getBoundingClientRect?.();
  if(!rect||!Number.isFinite(rect.width)||!rect.width)return;
  target.querySelectorAll?.(':scope > .lt-tap-bubble').forEach(node=>node.remove());
  const node=doc.createElement('span');node.className='lt-tap-bubble';
  node.setAttribute('aria-hidden','true');
  node.style.setProperty('--lt-tap-x',Math.max(0,Math.min(rect.width,x-rect.left))+'px');
  node.style.setProperty('--lt-tap-y',Math.max(0,Math.min(rect.height,y-rect.top))+'px');
  target.appendChild(node);
  node.addEventListener('animationend',()=>node.remove(),{once:true});
 }
 doc.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.pointerType==='mouse'&&event.button!==0)return;
  const target=event.target?.closest?.('button,.lt-theme-choice');
  if(!target||target.closest?.('[disabled],[aria-disabled="true"],fieldset[disabled]'))return;
  bubble(target,event.clientX,event.clientY);
 },{passive:true,capture:true});
 doc.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  const target=event.target?.closest?.('button,.lt-theme-choice');
  if(!target||event.repeat||target.closest?.('[disabled],[aria-disabled="true"],fieldset[disabled]'))return;
  const rect=target.getBoundingClientRect();
  bubble(target,rect.left+rect.width/2,rect.top+rect.height/2);
 },true);
 global.LinguaTapFeedback={bubble};
})(window);
