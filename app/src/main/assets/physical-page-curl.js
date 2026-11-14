/* Lingua Tales physical HTML curl. Original implementation; no runtime dependencies. */
(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const edgeDelta=(edge,rtl)=>(edge==='right')!==rtl?1:-1;
const CURL_SEGMENTS=20;
const spreadStart=(page,count)=>Math.floor(Math.max(0,page)/count)*count;
function clip(poly,n,limit,above){
 const out=[];
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  const da=a.x*n.x+a.y*n.y-limit,db=b.x*n.x+b.y*n.y-limit;
  const ina=above?da>=0:da<=0,inb=above?db>=0:db<=0;
  if(ina)out.push(a);
  if(ina!==inb){const t=da/(da-db);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});}
 }
 return out;
}
// Ruled tapered sheet approximation. The unfolded portion and reversed tail
// are planar; the belly consists of joined tangent facets, tapering at the
// opposite edge. This is a geometric model, not a finite-element paper solver.
function geometry(width,height,distance,vertical,grabY,edge='right',segments=CURL_SEGMENTS){
 const w=Math.max(1,Number.isFinite(width)?width:1),h=Math.max(1,Number.isFinite(height)?height:1),d=clamp(distance,0,2*w);
 const p=d/(2*w),dy=clamp(vertical,-d*.65,d*.65)*(1-p*p);
 const length=Math.hypot(d,dy)||1,n={x:d/length||1,y:-dy/length};
 const radius=Math.min(w*.085, d/(Math.PI+2))*Math.sin(Math.PI*p)**.55;
 const r=Math.max(.001,radius),tip=w*n.x+clamp(grabY,0,h)*n.y;
 const tangent={x:-n.y,y:n.x};
 const vGrab=-n.y*w+n.x*clamp(grabY,0,h);
 const extremes=[0,-n.y*w,n.x*h,-n.y*w+n.x*h];
 const far=grabY<h/2?Math.max(...extremes):Math.min(...extremes);
 const span=far-vGrab||h;
 // A ruled, tapered belly: the opposite edge lags behind the held corner.
 // As the sheet crosses the binding the taper relaxes into a complete turn.
 // All bands meet on the same surface; no separate rotating card or rolled tube.
 // Keep a broad physical leaf throughout the gesture.  The previous .88
 // taper pinned almost the whole far edge and collapsed the visible paper
 // into a long triangular spike.  Real paper still twists toward the held
 // corner, but the opposite edge follows it instead of becoming a hinge.
 const taper=.34*Math.max(0,1-p/.86);
 const slopeR=-r*taper/span,baseR=r-slopeR*vGrab;
 const slopeD=-length*taper/span,baseD=length-slopeD*vGrab;
 const crease=tip-baseD/2-Math.PI*baseR/2;
 const slopeC=-slopeD/2-Math.PI*slopeR/2;
 const corners=[{x:0,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}];
 const boundary=angle=>({normal:{x:n.x-(slopeC+slopeR*angle)*tangent.x,
  y:n.y-(slopeC+slopeR*angle)*tangent.y},limit:crease+baseR*angle});
 const ranges=[[-Infinity,0]];
 for(let i=0;i<segments;i++)ranges.push([i*Math.PI/segments,(i+1)*Math.PI/segments]);
 ranges.push([Math.PI,Infinity]);
 const facets=ranges.map(([a,b],i)=>{
  let poly=corners.map(q=>({...q}));
  if(Number.isFinite(a)){const line=boundary(a);poly=clip(poly,line.normal,line.limit,true);}
  if(Number.isFinite(b)){const line=boundary(b);poly=clip(poly,line.normal,line.limit,false);}
  const angle=i===0?0:i===ranges.length-1?Math.PI:(a+b)/2;
  const c=Math.cos(angle),s=Math.sin(angle);
  const A=(1-c)*slopeC+slopeR*(s-angle*c);
  const B=(1-c)*crease+baseR*(s-angle*c);
  const C=-s*slopeC+slopeR*(1-c-angle*s);
  const E=-s*crease+baseR*(1-c-angle*s);
  // Affine tangent of the conical band in the crease-normal/tangent basis.
  const fx=c*n.x+A*tangent.x,fy=c*n.y+A*tangent.y;
  let m=[n.x*fx+tangent.x*tangent.x,n.y*fx+tangent.y*tangent.x,s*n.x+C*tangent.x,0,
   n.x*fy+tangent.x*tangent.y,n.y*fy+tangent.y*tangent.y,s*n.y+C*tangent.y,0,
   -s*n.x,-s*n.y,c,0,n.x*B,n.y*B,E,1];
  const tx=m[12],ty=m[13],tz=m[14];
  if(edge==='left'){
   // Conjugate by x'=w-x. No mirrored text in the original HTML.
   m=[m[0],-m[1],-m[2],0,-m[4],m[5],m[6],0,-m[8],m[9],m[10],0,w-w*m[0]-tx,w*m[1]+ty,w*m[2]+tz,1];
   poly.forEach(q=>q.x=w-q.x);
  }
  const shadeAt=t=>clamp(.07+.36*Math.sin(t)-.06*Math.cos(t),0,.48);
  const shade=shadeAt(angle);
  let light='rgba(35,29,20,'+shade.toFixed(3)+')';
  if(i>0&&i<ranges.length-1){
   const midV=tangent.x*w/2+tangent.y*h/2;
   const offset=edge==='left'?n.x*w:0;
   const minProjection=Math.min(0,(edge==='left'?-1:1)*n.x*w)+Math.min(0,n.y*h);
   const position=t=>crease+slopeC*midV+(baseR+slopeR*midV)*t-offset-minProjection;
   const degrees=90+Math.atan2(n.y,edge==='left'?-n.x:n.x)*180/Math.PI;
   light='linear-gradient('+degrees+'deg,rgba(35,29,20,'+shadeAt(a).toFixed(3)+') '+position(a).toFixed(2)+'px,rgba(35,29,20,'+shadeAt(b).toFixed(3)+') '+position(b).toFixed(2)+'px)';
  }
  return {polygon:poly,matrix:m,angle,shade,light};
 });
 return {facets,progress:p,radius,crease,normal:n};
}
function shouldCommit(distance,width,velocity){
 return distance>width*.48&&velocity>-.35 || distance>width*.12&&velocity>.55;
}
let turnSerial=0;
function mount(options){
 const {host,rtl,getTurn,commit,allowed,tapAllowed=allowed}=options;
 const win=host.ownerDocument.defaultView,doc=host.ownerDocument;
 const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
 let hold=null,frame=0,dead=false,suppressUntil=0;
 const listeners=[];
 const on=(node,type,fn,opts)=>{node.addEventListener(type,fn,opts);listeners.push(()=>node.removeEventListener(type,fn,opts));};
 const emit=(name,h,extra={})=>(host.isConnected?host:doc).dispatchEvent(new win.CustomEvent('lingua:turn'+name,{bubbles:true,detail:{id:h.id,delta:h.delta,source:h.source,progress:h.distance/(2*h.width),...h.info,...extra}}));
 function inertCopy(page){
  const copy=page.cloneNode(true);
  copy.querySelectorAll('.tok').forEach(node=>node.replaceWith(doc.createTextNode(node.textContent)));
  [copy,...copy.querySelectorAll('*')].forEach(node=>{
   node.removeAttribute('id');node.removeAttribute('tabindex');
   for(const attr of [...node.attributes])if(attr.name.startsWith('on'))node.removeAttribute(attr.name);
  });
  copy.className='lt-book-page lt-curl-ink';copy.inert=true;copy.setAttribute('aria-hidden','true');
  return copy;
 }
 function makeVisual(h){
  const rect=h.page.getBoundingClientRect(),hostRect=host.getBoundingClientRect();
  h.width=rect.width;h.height=rect.height;h.left=rect.left;h.top=rect.top;
  const stage=doc.createElement('div');stage.className='lt-curl-stage';stage.inert=true;stage.setAttribute('aria-hidden','true');
  Object.assign(stage.style,{left:rect.left-hostRect.left+'px',top:rect.top-hostRect.top+'px',width:rect.width+'px',height:rect.height+'px'});
  const style=win.getComputedStyle(h.page);
  stage.style.setProperty('--lt-curl-paper',style.backgroundColor==='rgba(0, 0, 0, 0)'?'#f7f1e3':style.backgroundColor);
  const inset=['Top','Right','Bottom','Left'].map(side=>(parseFloat(style['padding'+side])+parseFloat(style['border'+side+'Width']))+'px').join(' ');
  stage.style.setProperty('--lt-curl-padding',inset);
  stage.style.setProperty('--lt-curl-paper-image',style.backgroundImage);
  const front=inertCopy(h.page),back=h.back?inertCopy(h.back):null;
  // Match computed paper padding/font; the copies inherit all reader language styles.
  for(const ink of [front,back].filter(Boolean))Object.assign(ink.style,{padding:style.padding,font:style.font,color:style.color,width:rect.width+'px',height:rect.height+'px'});
  // Cloning an illustrated HTML page 22 times at pointer-lock stalled older
  // Android WebViews before the first drawn frame. Allocate only the lightweight
  // facet shells now; materialise each face once, when the crease exposes it.
  // The live, interactive source DOM never gets cloned back into the reader.
  h.frontTemplate=front;h.backTemplate=back;h.facets=[];
  for(let i=0;i<CURL_SEGMENTS+2;i++){
   const facet=doc.createElement('div');facet.className='lt-curl-facet';
   stage.append(facet);h.facets.push(facet);
  }
  const shadow=doc.createElement('div');shadow.className='lt-curl-contact';stage.prepend(shadow);h.shadow=shadow;
  h.stage=stage;host.append(stage);h.page.style.visibility='hidden';
  if(h.under){h.under.classList.add('lt-curl-under');h.under.style.setProperty('--lt-under-left',rect.left-hostRect.left+'px');h.under.style.setProperty('--lt-under-width',rect.width+'px');}
  host.classList.add('lt-curl-active');host.dataset.ltFoldEdge=h.edge;
  // Preserve existing facets until WebGL textures upload. Capture failures
  // must never strand a user on an invisible or unturnable page.
  const v2=win.LinguaCurlV2;
  if(v2?.createSession){
   h.webgl=v2.createSession({win,host,stage,page:h.page,back:h.back||h.under,
    width:h.width,height:h.height,
    onReady(){
     if(hold!==h||!h.stage?.isConnected)return;
     h.stage.classList.add('lt-curl-webgl-ready');paint(h);
    },
    onFailed(){h.stage?.classList.remove('lt-curl-webgl-ready');}
   });
   if(h.webgl&&v2.CurlSpringPhysics)h.physics=new v2.CurlSpringPhysics();
  }
 }
 function paint(h){
  if(!h.stage)return;
  if(h.webgl?.ready){
   h.webgl.draw(h.distance/(2*h.width),h.grabY/h.height,h.edge);
   if(h.shadow)h.shadow.style.opacity='0';
   emit('progress',h);return;
  }
  const g=geometry(h.width,h.height,h.distance,h.vertical,h.grabY,h.edge);
  g.facets.forEach((g,i)=>{
   const node=h.facets[i];
   if(g.polygon.length<3){node.style.display='none';return;}
   if(!node.firstElementChild){
    const reverse=i>Math.ceil(CURL_SEGMENTS/2);
    const face=doc.createElement('div');
    face.className=reverse?'lt-curl-back':'lt-curl-front';
    const ink=(reverse?(h.backTemplate||h.frontTemplate):h.frontTemplate).cloneNode(true);
    if(reverse&&!h.backTemplate)ink.classList.add('lt-curl-ghost');
    face.append(ink);node.append(face);
   }
   node.style.display='block';
   node.style.clipPath='polygon('+g.polygon.map(p=>p.x.toFixed(2)+'px '+p.y.toFixed(2)+'px').join(',')+')';
   node.style.transform='matrix3d('+g.matrix.map(x=>x.toFixed(6)).join(',')+')';
   node.style.setProperty('--lt-curl-shade',g.shade.toFixed(3));
   node.style.setProperty('--lt-curl-light',g.light);
  });
  // Do not let the long contact shadow escape the physical paper boundary
  // when diagonal pulls make the geometric crease pass outside the sheet.
  const creaseX=h.edge==='right'?g.crease:h.width-g.crease;
  const x=clamp(creaseX,0,h.width);
  const contactOpacity=(creaseX<0||creaseX>h.width||g.progress<.015)
   ?0:Math.min(.30,g.progress*1.25);
  h.shadow.style.cssText='left:'+x+'px;width:'+Math.max(4,g.radius*1.6)+'px;opacity:'+contactOpacity+';transform:translateX(-50%) rotate('+(-Math.atan2(g.normal.y,g.normal.x))+'rad)';
  emit('progress',h);
 }
 function clean(h){
  if(frame)win.cancelAnimationFrame(frame);frame=0;
  h.webgl?.destroy();
  h.stage?.remove();h.page.style.visibility='';
  if(h.under){h.under.classList.remove('lt-curl-under');h.under.style.removeProperty('--lt-under-left');h.under.style.removeProperty('--lt-under-width');}
  host.classList.remove('lt-curl-active');delete host.dataset.ltFoldEdge;
  if(h.pointer!==undefined)try{host.releasePointerCapture(h.pointer);}catch(_){}
  h.dispose?.();
 }
 function finish(success,reason){
  const h=hold;if(!h)return;
  hold=null;clean(h);
  if(h.started){
   if(success){
    // Commit is synchronous and returns false if its installed chapter is stale.
    if(commit(h.delta,h.source)!==false)emit('commit',h,{progress:1});
    else emit('cancel',h,{reason:'stale'});
   }else emit('cancel',h,{reason});
  }
 }
 function cancel(reason='cancel'){finish(false,reason);}
 function settle(success){
  const h=hold;if(!h)return;
  if(!h.started){cancel('no-fold');return;}
  h.settling=true;h.target=success?2*h.width:0;h.success=success;
  if(h.physics){
   h.physics.progress=clamp(h.distance/(2*h.width),0,1);
   h.physics.velocity=clamp(h.velocity*1000/(2*h.width),-4,4);
   h.physics.grabY=clamp(h.grabY/h.height,0,1);
   h.physics.release(success?1:0);
  }
  h.velocity=clamp(h.velocity*1000,-h.width*4,h.width*4);h.time=0;h.startedAt=0;h.elapsed=0;
  if(reduced.matches){finish(success,'release');return;}
  request();
 }
 function tick(time){
  frame=0;const h=hold;if(!h)return;
  if(!host.isConnected||dead){cancel('detached');return;}
  if(h.settling){
   const dt=h.time?clamp((time-h.time)/1000,0,.032):1/60;h.time=time;if(!h.startedAt)h.startedAt=time;h.elapsed=(time-h.startedAt)/1000;
   // Stable semi-implicit integration in <=8ms steps, independent of refresh rate.
   if(h.physics){
    const done=h.physics.update(dt);
    h.distance=clamp(h.physics.progress*2*h.width,0,2*h.width);
    h.velocity=h.physics.velocity*2*h.width;
    h.vertical*=Math.exp(-dt*12);
    if(done||h.elapsed>1.1){finish(h.success,'release');return;}
   }else{
    const steps=Math.ceil(dt/.008),step=dt/steps;
    for(let i=0;i<steps;i++){h.velocity+=((h.target-h.distance)*210-h.velocity*29)*step;h.distance=clamp(h.distance+h.velocity*step,0,2*h.width);}
    h.vertical*=Math.exp(-dt*12);
    if((Math.abs(h.target-h.distance)<.35&&Math.abs(h.velocity)<3)||h.elapsed>1.1){finish(h.success,'release');return;}
   }
  }
  paint(h);if(h.settling)request();
 }
 function request(){if(!frame)frame=win.requestAnimationFrame(tick);}
 function begin(delta,edge,source){
  const turn=getTurn(delta);if(!turn?.page)return null;
  const rect=turn.page.getBoundingClientRect();
  hold={...turn,id:++turnSerial,delta,edge,source,width:rect.width,height:rect.height,left:rect.left,top:rect.top,distance:0,vertical:0,velocity:0,started:false};
  return hold;
 }
 function start(h){h.started=true;if(!reduced.matches)makeVisual(h);emit('start',h);}
 function turn(delta,source='control'){
  if(dead||!host.isConnected||(delta!==1&&delta!==-1))return false;
  if(hold)cancel('superseded');
  const h=begin(delta,(delta>0)!==rtl?'right':'left',source);if(!h)return false;
  h.grabY=h.height*.84;start(h);settle(true);return true;
 }
 on(host,'pointerdown',e=>{
  if(hold&&!hold.settling&&e.pointerId!==hold.pointer){cancel('second-pointer');return;}
  if(dead||e.isPrimary===false||e.button!==0||!allowed(e.target)||win.getSelection()?.toString().trim())return;
  if(hold?.settling){
   const h=hold;h.settling=false;h.pointer=e.pointerId;h.velocity=0;
   h.startX=e.clientX+(h.edge==='right'?h.distance:-h.distance);
   h.startY=e.clientY-h.vertical;h.lastAt=e.timeStamp;
   if(frame)win.cancelAnimationFrame(frame);frame=0;
   try{host.setPointerCapture(e.pointerId);}catch(_){}
   return; // catch the moving sheet without starting a second transaction
  }
  if(hold)cancel('interrupted');
  const rect=host.getBoundingClientRect(),x=e.clientX-rect.left;
  // A full page has a forgiving outer margin, not a hidden 56 px sliver.
  // Cap the zone so the middle remains available for vertical reading and
  // dictionary interaction on both phones and wide two-page spreads.
  const edgeZone=Math.min(112,Math.max(64,rect.width*.17));
  const edge=x<0||x>rect.width?null:x<=edgeZone?'left':rect.width-x<=edgeZone?'right':null;
  if(!edge)return;
  const h=begin(edgeDelta(edge,rtl),edge,'gesture');if(!h)return;
  h.pointer=e.pointerId;h.startX=e.clientX;h.startY=e.clientY;h.grabY=clamp(e.clientY-h.top,0,h.height);h.lastAt=e.timeStamp;
  h.downAt=e.timeStamp;h.tapEligible=!!tapAllowed(e.target);
 });
 // A second finger elsewhere (e.g. over an illustration) cancels as well.
 on(doc,'pointerdown',e=>{if(hold&&(e.isPrimary===false||(!hold.settling&&hold.pointer!==undefined&&e.pointerId!==hold.pointer)))cancel('second-pointer');},true);
 on(host,'pointermove',e=>{
  const h=hold;if(!h||h.pointer!==e.pointerId||h.settling)return;
  let first=false;
  const d=(h.edge==='right'?-1:1)*(e.clientX-h.startX),dy=e.clientY-h.startY;
  if(!h.started){
   if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(d)*1.1){cancel('scroll');return;}
   if(d<8)return;
   start(h);first=true;try{host.setPointerCapture(e.pointerId);}catch(_){}
  }
  const dt=Math.max(1,e.timeStamp-h.lastAt);
  h.velocity=.65*(d-h.distance)/dt+.35*h.velocity;h.lastAt=e.timeStamp;
  h.distance=clamp(d,0,2*h.width);h.vertical=dy;suppressUntil=Date.now()+450;
  h.physics?.drag(h.distance/(2*h.width),h.grabY/h.height,
   h.velocity*1000/(2*h.width));
  if(first)paint(h);else request();if(e.cancelable)e.preventDefault();
 },{passive:false});
 on(doc,'pointerup',e=>{if(hold?.pointer===e.pointerId){
  const h=hold;
  // A short stationary tap in the outer paper margin is an intentional page
  // turn.  Taps on dictionary words, controls and selections are excluded by
  // tapAllowed, so first-party lookup keeps its normal single-tap behaviour.
  if(!h.started&&h.tapEligible&&e.timeStamp-h.downAt<=320){
   start(h);suppressUntil=Date.now()+450;settle(true);return;
  }
  if(h.started)suppressUntil=Date.now()+450;
  const v=e.timeStamp-h.lastAt>100?0:h.velocity;
  settle(shouldCommit(h.distance,h.width,v));
 }},true);
 on(doc,'pointercancel',e=>{if(hold?.pointer===e.pointerId)cancel('pointercancel');},true);
 // Touch implicitly captures on the original child. Its bubbling loss during
 // transfer to host is expected; only a loss on our actual owner cancels.
 on(host,'lostpointercapture',e=>{if(e.target===host&&hold?.pointer===e.pointerId&&!hold.settling)cancel('capture-lost');});
 on(host,'pointerleave',e=>{if(hold?.pointer===e.pointerId&&!hold.started)cancel('leave');});
 on(host,'click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 on(doc,'keydown',e=>{if(e.key==='Escape'&&hold){cancel('escape');e.preventDefault();e.stopImmediatePropagation();}},true);
 on(win,'blur',()=>cancel('blur'));
 on(win,'resize',()=>cancel('resize'));
 on(doc,'visibilitychange',()=>{if(doc.hidden)cancel('hidden');});
 const preference=()=>cancel('motion-preference');reduced.addEventListener?.('change',preference);
 const observer=new win.MutationObserver(()=>{if(!host.isConnected)api.destroy();else if(doc.querySelector('#modals .sheet,.lt-art-inspection-backdrop'))cancel('modal');});
 observer.observe(doc.body,{childList:true,subtree:true});
 const api={turn,cancel,cancelIfActive(){if(!hold)return false;cancel('back');return true;},get active(){return !!hold?.started;},destroy(){if(dead)return;cancel('destroy');dead=true;listeners.forEach(off=>off());observer.disconnect();reduced.removeEventListener?.('change',preference);}};
 return api;
}
const api={geometry,shouldCommit,edgeDelta,spreadStart,mount};
if(typeof module==='object'&&module.exports)module.exports=api;
else root.LinguaPageCurl=api;
})(typeof window==='object'?window:globalThis);
