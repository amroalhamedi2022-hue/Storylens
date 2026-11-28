/* Lingua Tales Curl v2: offline WebGL2 single-mesh renderer; DOM active while idle.
 * html2canvas (MIT, bundled) is used solely for temporary, inert page snapshots.
 * No CSS facets appear once the WebGL textures are ready; v1 remains a fallback.
 */
(function(root){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,Number.isFinite(x)?x:a));
class CurlSpringPhysics {
 constructor(){
  this.stiffness=260;this.damping=28;
  this.progress=0;this.velocity=0;this.target=0;
  this.grabY=.5;this.isDragging=false;
 }
 drag(progress,grabY,velocity=0){
  this.isDragging=true;this.progress=clamp(progress,0,1);
  this.grabY=clamp(grabY,0,1);this.velocity=clamp(velocity,-4,4);
 }
 release(target){
  this.isDragging=false;this.target=target>=.5?1:0;
 }
 update(dt){
  if(this.isDragging)return false;
  let remaining=clamp(dt,0,.05);
  while(remaining>0){
   const step=Math.min(remaining,.008);
   const force=-this.stiffness*(this.progress-this.target)-this.damping*this.velocity;
   this.velocity+=force*step;
   this.progress=clamp(this.progress+this.velocity*step,0,1);
   remaining-=step;
  }
  if(Math.abs(this.progress-this.target)<.001&&Math.abs(this.velocity)<.01){
   this.progress=this.target;this.velocity=0;return true;
  }
  return false;
 }
}
function createMesh(columns=96,rows=48){
 const uv=new Float32Array((columns+1)*(rows+1)*2);
 let at=0;
 for(let y=0;y<=rows;y++)for(let x=0;x<=columns;x++){
  uv[at++]=x/columns;uv[at++]=y/rows;
 }
 const indices=new Uint16Array(columns*rows*6);at=0;
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
  const a=y*(columns+1)+x,b=a+1,c=a+columns+1,d=c+1;
  indices.set([a,c,b,b,c,d],at);at+=6;
 }
 return {uv,indices,columns,rows};
}
// A developable cylinder: arc length is conserved and the binding stays fixed.
// Clip in MATERIAL space at exact curve boundaries instead of sampling a UV grid
// across a sub-pixel radius (the latter bridged folds and produced stray triangles).
function sheetGeometry(width,height,progress,grabY=.5,pullY=0,edge='right',segments=64,storage){
 const w=Math.max(1,width),h=Math.max(1,height),p=clamp(progress,0,1);
 const travel=2*w*p, gy=clamp(grabY-pullY,0,1)*h;
 let angle=Math.atan2(-clamp(pullY,-1,1)*h,Math.max(travel,1));
 angle=clamp(angle,-.85,.85)*Math.sin(Math.PI*p);
 const radius=Math.min(w*.12*Math.sin(Math.PI*p),travel/Math.PI*.42,w*(1-p)/Math.PI*.85);
 const parameters=a=>{
  const nx=Math.cos(a),ny=Math.sin(a);
  const length=travel/Math.max(.1,nx);
  const crease=nx*w+ny*gy-(length+Math.PI*radius)/2;
  return {nx,ny,crease};
 };
 // A requested diagonal pull that would detach the binding is projected onto
 // the feasible sheet. Both binding corners remain stationary for every p.
 let q=parameters(angle);
 if(q.crease<Math.max(0,q.ny*h)){
  let lo=0,hi=1;
  for(let i=0;i<20;i++){
   const t=(lo+hi)/2,z=parameters(angle*t);
   if(z.crease>=Math.max(0,z.ny*h))lo=t;else hi=t;
  }
  angle*=lo;q=parameters(angle);
 }
 const {nx,ny,crease}=q,r=Math.max(radius,1e-7);
 const vertices=storage||new Float32Array((segments+2)*12*8);
 let used=0;
 function deform(x,y){
  const d=nx*x+ny*y-crease;
  let xx=x,yy=y,z=0,sin=0,cos=1;
  if(p>=1){xx=-x;z=0;cos=-1;}
  else if(p>0&&d>0){
   const t=Math.min(Math.PI,d/r);sin=Math.sin(t);cos=Math.cos(t);
   const f=d<Math.PI*r?r*sin:-(d-Math.PI*r);
   xx+=nx*(f-d);yy+=ny*(f-d);z=r*(1-cos);
  }
  return [edge==='left'?w-xx:xx,yy,z,
   edge==='left'?sin*nx:-sin*nx,-sin*ny,cos,
   edge==='left'?1-x/w:x/w,y/h];
 }
 function clip(poly,limit,greater){
  const out=[];
  for(let i=0;i<poly.length;i++){
   const a=poly[i],b=poly[(i+1)%poly.length];
   const da=nx*a[0]+ny*a[1]-limit,db=nx*b[0]+ny*b[1]-limit;
   const ia=greater?da>=0:da<=0,ib=greater?db>=0:db<=0;
   if(ia)out.push(a);
   if(ia!==ib){const t=da/(da-db);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);}
  }return out;
 }
 const cuts=[-Infinity,crease];
 for(let i=1;i<=segments;i++)cuts.push(crease+Math.PI*r*i/segments);
 cuts.push(Infinity);
 // Flat endpoints get one exact rectangle, avoiding a near-zero fold singularity.
 if(p===0||p===1)cuts.splice(0,cuts.length,-Infinity,Infinity);
 for(let i=0;i<cuts.length-1;i++){
  let poly=[[0,0],[w,0],[w,h],[0,h]];
  if(Number.isFinite(cuts[i]))poly=clip(poly,cuts[i],true);
  if(poly.length&&Number.isFinite(cuts[i+1]))poly=clip(poly,cuts[i+1],false);
  if(poly.length<3)continue;
  const corners=poly.map(([x,y])=>deform(x,y));
  for(let j=1;j<poly.length-1;j++){
   // y grows down; CCW in clip space is reversed. Mirroring the left leaf
   // reverses MATERIAL coordinates as well, keeping front-side semantics.
   vertices.set(corners[0],used);
   vertices.set(corners[edge==='left'?j:j+1],used+8);
   vertices.set(corners[edge==='left'?j+1:j],used+16);
   used+=24;
  }
 }
 return {vertices:vertices.subarray(0,used),radius,crease,normal:[nx,ny],deform};
}
// In portrait the viewport pans with the leaf. Invert that camera motion
// so the held point still moves one screen pixel per finger pixel.
function portraitProgress(screenProgress){
 const q=clamp(screenProgress,0,1);if(q===0||q===1)return q;
 let lo=0,hi=1;
 for(let i=0;i<24;i++){
  const p=(lo+hi)/2,screen=2*p-p*p*(3-2*p);
  if(screen<q)lo=p;else hi=p;
 }
 return (lo+hi)/2;
}
const VERTEX_SHADER=`#version 300 es
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;
uniform vec2 uViewport;
uniform vec2 uOffset;
uniform float uShadow;
out vec2 vUv;
out vec3 vNormal;
out float vHeight;
void main(){
 vec3 p=aPosition;
 if(uShadow>0.0){p.xy+=vec2(0.23,0.15)*p.z;p.z=0.0;}
 gl_Position=vec4(((p.xy+uOffset)/uViewport*2.0-1.0)*vec2(1.0,-1.0),-p.z/4096.0,1.0);
 vUv=aUv;vNormal=aNormal;vHeight=aPosition.z;
}`;
const FRAGMENT_SHADER=`#version 300 es
precision highp float;
in vec2 vUv;
in vec3 vNormal;
in float vHeight;
uniform sampler2D uFrontTex;
uniform sampler2D uBackTex;
uniform float uShadow;
out vec4 fragColor;
void main(){
 if(uShadow>0.0){fragColor=vec4(0.10,0.075,0.045,0.13*min(1.0,vHeight/10.0));return;}
 vec3 n=normalize(gl_FrontFacing?vNormal:-vNormal);
 vec4 ink=gl_FrontFacing?texture(uFrontTex,vUv):texture(uBackTex,vec2(1.0-vUv.x,vUv.y));
 // Flat paper is EXACTLY the DOM color: no brightness pop on hand-off.
 // Matte paper has no plastic specular highlight and never washes out its ink.
 float shade=1.0-0.22*(1.0-abs(n.z))-0.10*max(0.0,n.x);
 vec2 edge=min(vUv,1.0-vUv);
 float rim=1.0-smoothstep(0.0,max(fwidth(edge.x),fwidth(edge.y))*0.7,min(edge.x,edge.y));
 fragColor=vec4(ink.rgb*shade*(1.0-0.08*rim),ink.a);
}`;
function compile(gl,type,source){
 const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
  const log=gl.getShaderInfoLog(s);gl.deleteShader(s);
  throw new Error('Curl shader failed: '+log);
 }
 return s;
}
function makeProgram(gl){
 const vertex=compile(gl,gl.VERTEX_SHADER,VERTEX_SHADER);
 const fragment=compile(gl,gl.FRAGMENT_SHADER,FRAGMENT_SHADER);
 const p=gl.createProgram();gl.attachShader(p,vertex);gl.attachShader(p,fragment);
 gl.linkProgram(p);gl.deleteShader(vertex);gl.deleteShader(fragment);
 if(!gl.getProgramParameter(p,gl.LINK_STATUS)){
  const log=gl.getProgramInfoLog(p);gl.deleteProgram(p);
  throw new Error('Curl program failed: '+log);
 }
 return p;
}
function snapAllowed(win){
 try{
  if(typeof win.html2canvas!=='function')return false;
  // Only our packaged Android origin is automatically enabled. Browser QA
  // explicitly opts in; ordinary browser preview retains the proven v1 path.
  const trusted=win.location.hostname==='appassets.androidplatform.net'&&
    typeof win.StoryLensNative?.saveBackup==='function';
  return trusted||win.__LT_CURL_V2_TEST__===true;
 }catch(_){return false;}
}
let snapshotSerial=0;
// Bounded idle warm-cache: a reader spends far longer viewing a page than
// turning it. Prepare the current and immediately adjacent real paper sides
// while idle, so fast touch turns need only upload GPU textures.
const snapshotCache=new Map();
const MAX_CACHED_PAGES=6;
const MAX_CACHE_BYTES=48*1024*1024;
let snapshotBuilds=0;
function snapshotSignature(win,source){
 const doc=source.ownerDocument,style=win.getComputedStyle(source);
 const reader=source.closest?.('.reader');
 const media=Array.from(source.querySelectorAll?.('img,canvas,video')||[],node=>{
  if(node.tagName==='IMG')return [node.currentSrc||node.src,
   node.complete?'ready':'loading',node.naturalWidth,node.naturalHeight].join(':');
  // Canvas/video frames change without DOM mutations; never cache their ink.
  return 'dynamic:'+node.tagName;
 });
 return [
  source.innerHTML||source.textContent||'',
   // is-active/under only alter live visibility, not the normalized cloned sheet.
   String(source.className||'').replace(/\b(?:is-active|lt-curl-under|lt-pagination-probe)\b/g,'').replace(/\s+/g,' ').trim(),
  doc.documentElement.className||'',doc.body?.className||'',
  String(reader?.className||'').replace(/\blt-reader-controls-visible\b/g,'').trim(),
  style.font,style.padding,style.color,style.lineHeight,style.textAlign,
  style.backgroundColor,style.backgroundImage,style.backgroundSize,
  style.direction,style.letterSpacing,media.join('|')
 ].join('\u001f');
}
function cacheBytes(row){
 return Math.ceil(row.width*row.scale)*Math.ceil(row.height*row.scale)*4;
}
function trimCache(){
 let used=0;
 for(const row of snapshotCache.values())used+=cacheBytes(row);
 while(snapshotCache.size>MAX_CACHED_PAGES||
   (snapshotCache.size>1&&used>MAX_CACHE_BYTES)){
  const first=snapshotCache.keys().next().value;
  used-=cacheBytes(snapshotCache.get(first));
  snapshotCache.delete(first);
 }
}
function clearCache(){
 const count=snapshotCache.size;
 root.LinguaReaderCurl?.cancel?.('memory-pressure');
 snapshotCache.clear();
 for(const entry of gpuBooks.values())entry.renderer.destroy();
 gpuBooks.clear();return count;
}

function rasterScale(win,width,height,max=2048){
 return clamp(Math.min(win.devicePixelRatio||1,1.8,
  max/width,max/height,Math.sqrt(2400000/(width*height))),.5,1.8);
}
async function cachedPage(win,host,source,width,height,scale,dead){
 const signature=snapshotSignature(win,source);
 const dynamic=signature.includes('dynamic:');
 const found=snapshotCache.get(source);
 if(!dynamic&&found&&found.signature===signature&&found.width===width&&
    found.height===height&&Math.abs(found.scale-scale)<.0001){
  snapshotCache.delete(source);snapshotCache.set(source,found);
  const canvas=await found.promise;
  if(dead())throw new Error('Curl cancelled');
  return canvas;
 }
 snapshotCache.delete(source);
 const row={width,height,scale,signature,promise:null,canvas:null};
 snapshotBuilds++;
 row.promise=capturePage(win,host,source,width,height,scale,
  ()=>!host.isConnected).then(canvas=>{
   if(snapshotSignature(win,source)!==signature){
    if(snapshotCache.get(source)===row)snapshotCache.delete(source);
    throw new Error('Paper content or theme changed during texture capture');
   }
   row.canvas=canvas;
   return canvas;
  }).catch(error=>{
   if(snapshotCache.get(source)===row)snapshotCache.delete(source);
   throw error;
  });
 if(!dynamic){snapshotCache.set(source,row);trimCache();}
 const canvas=await row.promise;
 if(dead())throw new Error('Curl cancelled');
 return canvas;
}
// A gesture must never begin a new html2canvas rasterization.
// Only an already completed, content-identical idle snapshot qualifies.
function snapshotSources(page,back){
 // An actual blank boundary has no source. Duplicate references share one
 // idle capture; normal portrait leaves now have a distinct printed reverse.
 return back&&back!==page?[page,back]:[page];
}
// One context per live reader; programs, buffers AND textures are prepared idle.
// A turn only binds resident textures. No shader compile, upload or async wait.
const gpuBooks=new Map();
let gpuUploads=0,gpuContexts=0;
function release(host){
 const entry=gpuBooks.get(host);
 if(entry){entry.renderer.destroy();gpuBooks.delete(host);}
 for(const [source] of snapshotCache)if(!source.isConnected)snapshotCache.delete(source);
}
function collectSources(o){return [...new Set([o.page,o.back,o.under,o.stationary].filter(Boolean))];}
function sourceReady(win,source,width,height,scale){
 const row=snapshotCache.get(source);
 return row?.canvas&&row.width===width&&row.height===height&&
  Math.abs(row.scale-scale)<.0001&&row.signature===snapshotSignature(win,source)?row:null;
}
function isReady(o){
 const {win,host,page,width,height}=o;
 if(!snapAllowed(win)||!page||!width||!height)return false;
 const entry=gpuBooks.get(host);
 if(!entry||entry.width!==width||entry.height!==height||entry.renderer.lost)return false;
 return collectSources(o).every(source=>{
  const row=sourceReady(win,source,width,height,entry.renderer.scale);
  return row&&entry.renderer.has(source,row.canvas);
 });
}
async function prime(o){
 const {win,host,page,width,height}=o;
 if(!snapAllowed(win)||!page||!host.isConnected||!width||!height)return false;
 try{
  for(const [old,entry] of gpuBooks)if(!old.isConnected){entry.renderer.destroy();gpuBooks.delete(old);}
  let entry=gpuBooks.get(host);
  if(entry&&(entry.width!==width||entry.height!==height||entry.renderer.lost)){
   entry.renderer.destroy();gpuBooks.delete(host);entry=null;
  }
  if(!entry){
   const parking=win.document.createElement('div');
   const renderer=makeRenderer(win,parking,width,height);
   renderer.canvas.hidden=true;gpuContexts++;
   entry={renderer,width,height};gpuBooks.set(host,entry);
   const rect=host.getBoundingClientRect();renderer.viewport(rect.width,rect.height);
  }
  for(const source of collectSources(o)){
   if(root.LinguaReaderCurl?.active)return false;
   const canvas=await cachedPage(win,host,source,width,height,entry.renderer.scale,()=>!host.isConnected);
   if(!host.isConnected||gpuBooks.get(host)!==entry||entry.renderer.lost||root.LinguaReaderCurl?.active)return false;
   entry.renderer.prepare(source,canvas);
  }
  return isReady(o);
 }catch(error){root.LinguaCurlV2.lastWarmupWarning=String(error);return false;}
}
async function capturePage(win,host,source,width,height,scale,disposed){
 if(!source)throw new Error('No paper face to rasterize');
 const doc=host.ownerDocument;
 // Snapshot only a single physical sheet. The original word spans and listeners
 // remain in the live DOM; CSS is resolved in html2canvas's disposable iframe.
 const stage=source.cloneNode(true);
 const marker='lt-curl-snapshot-'+(++snapshotSerial);
 stage.id=marker;stage.classList.add('lt-curl-snapshot-page');
 stage.classList.remove('is-active','lt-curl-under','lt-pagination-probe');
 stage.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
 // Keep the original token spans: removing them changes wrapping, bidi and
 // measured glyph positions, which looks like a jump when the page lifts.
 // The copy is inert and never receives the live dictionary event listeners.
 stage.querySelectorAll('[tabindex],[onclick],[onpointerdown]').forEach(node=>{
  node.removeAttribute('tabindex');node.removeAttribute('onclick');
  node.removeAttribute('onpointerdown');
 });
 stage.setAttribute('aria-hidden','true');stage.inert=true;
 const original=win.getComputedStyle(source);
 const nativePaper=original.backgroundImage.includes('lt-antique-paper-light.svg');
 for(const key of ['padding','border','borderRadius','font','color','direction','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat']){
  const value=original[key];if(value)stage.style[key]=value;
 }
 stage.style.setProperty('box-sizing','border-box','important');
 stage.style.setProperty('position','absolute','important');
 stage.style.setProperty('left','0px','important');
 stage.style.setProperty('top','0px','important');
 stage.style.setProperty('display','block','important');
 stage.style.setProperty('width',width+'px','important');
 stage.style.setProperty('height',height+'px','important');
 stage.style.setProperty('min-height',height+'px','important');
 stage.style.setProperty('max-height',height+'px','important');
 stage.style.setProperty('visibility','hidden','important');
 stage.style.setProperty('pointer-events','none','important');
 host.appendChild(stage);
 try{
  if(disposed())throw new Error('Curl cancelled before rasterization');
  const canvas=await win.html2canvas(stage,{
   backgroundColor:null,scale,logging:false,useCORS:false,allowTaint:false,
   // All other paginated leaves may hold thousands of token spans. They
   // cannot contribute pixels to this fixed-position capture.
   ignoreElements:element=>element!==stage&&element.parentElement===host&&
    element.classList.contains('lt-book-page'),
   imageTimeout:3500,removeContainer:true,scrollX:0,scrollY:0,
   windowWidth:Math.max(doc.documentElement.clientWidth,Math.ceil(width)),
   windowHeight:Math.max(doc.documentElement.clientHeight,Math.ceil(height)),
   async onclone(clone){
    const item=clone.getElementById(marker);
    if(!item)throw new Error('Missing snapshot page in cloned document');
    // html2canvas clips image backgrounds at its iframe viewport when a
    // scrolled reader starts below y=0. Normalize ONLY the disposable clone.
    for(let parent=item.parentElement;parent;parent=parent.parentElement){
     for(const key of ['transform','perspective','filter','contain'])parent.style.setProperty(key,'none','important');
     parent.style.setProperty('overflow','visible','important');
    }
    item.style.setProperty('position','fixed','important');
    item.style.setProperty('left','0px','important');
    item.style.setProperty('top','0px','important');
    item.style.setProperty('visibility','visible','important');
    item.style.setProperty('display','block','important');
    if(nativePaper){
     // Paint this layered background with the browser's SVG/image rasterizer,
     // not html2canvas's partial CSS background implementation.
     item.style.setProperty('background','transparent','important');
     item.style.setProperty('box-shadow','none','important');
     const rule=clone.createElement('style');
     rule.textContent='#'+marker+'::before,#'+marker+'::after{display:none!important}';
     clone.head.appendChild(rule);
    }
    // html2canvas ignores object-fit. Bake only image boxes with the native
    // decoder at their exact CSS size; text and original DOM stay untouched.
    for(const img of item.querySelectorAll('img')){
     if(!img.complete)try{await img.decode();}catch(_){}
     if(!img.naturalWidth)continue;
     const style=clone.defaultView.getComputedStyle(img);
     if(style.objectFit!=='contain')continue;
     const r=img.getBoundingClientRect(),box=clone.createElement('canvas');
     if(!r.width||!r.height)continue;
     box.width=Math.ceil(r.width*scale);box.height=Math.ceil(r.height*scale);
     for(const key of style)box.style.setProperty(key,style.getPropertyValue(key),'important');
     box.style.setProperty('width',r.width+'px','important');box.style.setProperty('height',r.height+'px','important');
     const ctx=box.getContext('2d'),ratio=Math.min(box.width/img.naturalWidth,box.height/img.naturalHeight);
     const w=img.naturalWidth*ratio,h=img.naturalHeight*ratio;
     ctx.drawImage(img,(box.width-w)/2,(box.height-h)/2,w,h);img.replaceWith(box);
    }
   }
  });
  if(disposed())throw new Error('Curl cancelled during rasterization');
  if(canvas.width<2||canvas.height<2)throw new Error('Empty paper texture');
  if(nativePaper){
   const image=async name=>{const img=new win.Image();img.src=new URL(name,doc.baseURI).href;await img.decode();return img;};
   const [light,grain]=await Promise.all([image('lt-antique-paper-light.svg'),image('lt-antique-paper-grain.svg')]);
   const paper=doc.createElement('canvas');paper.width=canvas.width;paper.height=canvas.height;
   const ctx=paper.getContext('2d');ctx.drawImage(light,0,0,paper.width,paper.height);
   const tile=192*scale;
   for(let y=0;y<paper.height;y+=tile)for(let x=0;x<paper.width;x+=tile)ctx.drawImage(grain,x,y,tile,tile);
   ctx.drawImage(canvas,0,0);return paper;
  }
  return canvas;
 }finally{stage.remove();}
}
function blankBack(win,width,height,scale,color){
 const canvas=win.document.createElement('canvas');
 canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);
 const ctx=canvas.getContext('2d');
 ctx.fillStyle=color||'#f4eee0';ctx.fillRect(0,0,canvas.width,canvas.height);
 return canvas;
}
function makeRenderer(win,stage,width,height){
 const canvas=win.document.createElement('canvas');canvas.className='lt-curl-webgl';
 stage.appendChild(canvas);
 const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,depth:true,
  premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 if(!gl){canvas.remove();throw new Error('WebGL2 unavailable');}
 const scale=rasterScale(win,width,height,Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE)||2048,2048));
 const program=makeProgram(gl),vao=gl.createVertexArray(),buffer=gl.createBuffer();
 gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,65536,gl.DYNAMIC_DRAW);
 for(const [index,size,offset] of [[0,3,0],[1,3,12],[2,2,24]]){
  gl.enableVertexAttribArray(index);gl.vertexAttribPointer(index,size,gl.FLOAT,false,32,offset);
 }
 gl.bindVertexArray(null);
 const uniforms=Object.fromEntries(['uViewport','uOffset','uShadow','uFrontTex','uBackTex']
  .map(name=>[name,gl.getUniformLocation(program,name)]));
 const resident=new Map();let dead=false,lost=false,faces=null,viewWidth=width,viewHeight=height,offsetX=0,offsetY=0;
 const flat=sheetGeometry(width,height,0).vertices;
 const movingVertices=new Float32Array(66*12*8);
 gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,flat);
 const blank=blankBack(win,width,height,scale,'#f4eee0');
 function upload(source){
  const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
  for(const axis of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,axis,gl.CLAMP_TO_EDGE);
  for(const kind of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,kind,gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);gpuUploads++;
  if(gl.getError()!==gl.NO_ERROR){gl.deleteTexture(t);throw new Error('Paper texture upload failed');}
  return t;
 }
 const blankTexture=upload(blank);
 function prepare(key,source){
  if(dead||lost)return;
  const hit=resident.get(key);
  if(hit?.source===source){resident.delete(key);resident.set(key,hit);return;}
  const previous=resident.get(key);if(previous)gl.deleteTexture(previous.texture);
  resident.delete(key);resident.set(key,{source,texture:upload(source)});
  while(resident.size>6){const key=resident.keys().next().value;gl.deleteTexture(resident.get(key).texture);resident.delete(key);}
 }
 function viewport(w,h,x=0,y=0){
  viewWidth=w;viewHeight=h;offsetX=x;offsetY=y;
  const cw=Math.max(2,Math.round(w*scale)),ch=Math.max(2,Math.round(h*scale));
  if(canvas.width!==cw)canvas.width=cw;if(canvas.height!==ch)canvas.height=ch;
  canvas.style.width=w+'px';canvas.style.height=h+'px';
 }
 viewport(width,height);
 function paint(vertices,front,back,x,y,shadow=0){
  gl.uniform2f(uniforms.uOffset,x,y);gl.uniform1f(uniforms.uShadow,shadow);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,front||blankTexture);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,back||front||blankTexture);
  gl.drawArrays(gl.TRIANGLES,vertices===flat?0:flat.length/8,vertices.length/8);
 }
 const api={scale,
  prepare,has:(key,source)=>!dead&&!lost&&resident.get(key)?.source===source,
  install(front,back){prepare('probeFront',front);prepare('probeBack',back);faces={front:resident.get('probeFront').texture,back:resident.get('probeBack').texture};},
  use(o){
   const tex=key=>key?resident.get(key)?.texture:blankTexture;
   faces={front:tex(o.page),back:tex(o.back),under:tex(o.under),stationary:tex(o.stationary),book:true,portrait:o.portrait};
  },
  viewport,
  draw(progress,grabY,edge,pullY=0){
   if(dead||lost||!faces)return;
   const p=faces.portrait?portraitProgress(progress):clamp(progress,0,1),g=sheetGeometry(width,height,p,grabY,pullY,edge,64,movingVertices);
   // A portrait camera follows the turning physical leaf to its other side.
   // At p=1 the correct verso fills the viewport; N+2 stays underneath N+1.
   const camera=faces.portrait?(edge==='right'?1:-1)*width*(p*p*(3-2*p)):0;
   const x=offsetX+camera,y=offsetY;
   gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);
   gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
   gl.disable(gl.DEPTH_TEST);gl.useProgram(program);gl.bindVertexArray(vao);
   gl.uniform2f(uniforms.uViewport,viewWidth,viewHeight);
   gl.uniform1i(uniforms.uFrontTex,0);gl.uniform1i(uniforms.uBackTex,1);
   gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,flat.byteLength,g.vertices);
   if(faces.book){
    // The portrait camera exposes only this leaf, recto and verso. Painting
    // its neighbours here would slide two unrelated paragraphs into view.
    if(!faces.portrait){
     paint(flat,faces.under,faces.under,x,y);
     paint(flat,faces.stationary,faces.stationary,x+(edge==='right'?-width:width),y);
    }
    // Soft contact shadow projected from the ACTUAL deformed sheet, five
    // bounded taps instead of a rectangular CSS shadow across unrelated ink.
    for(const blur of [-2,-1,0,1,2])paint(g.vertices,null,null,x+blur,y+Math.abs(blur),1);
   }
   gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
   paint(g.vertices,faces.front,faces.back,x,y);
   gl.bindVertexArray(null);
  },
  destroy(){if(dead)return;dead=true;for(const row of resident.values())gl.deleteTexture(row.texture);
   resident.clear();gl.deleteTexture(blankTexture);gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(program);canvas.remove();},
  get canvas(){return canvas;},get lost(){return lost||dead;}
 };
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;root.LinguaReaderCurl?.cancel('context-lost');});
 return api;
}
function createSession(o){
 if(!isReady(o))return null;
 const {win,host,stage,width,height,onReady}=o,entry=gpuBooks.get(host),renderer=entry.renderer;
 const hr=host.getBoundingClientRect(),pr=o.page.getBoundingClientRect();
 renderer.use({...o,portrait:host.dataset.spread!=='2'});
 renderer.viewport(hr.width,hr.height,pr.left-hr.left,pr.top-hr.top);
 // CSS stage remains at page origin for fallback compatibility. The GPU
 // framebuffer covers BOTH book pages instead of clipping at the binding.
 renderer.canvas.style.setProperty('left',(hr.left-pr.left)+'px','important');
 renderer.canvas.style.setProperty('top',(hr.top-pr.top)+'px','important');
 stage.appendChild(renderer.canvas);renderer.canvas.hidden=false;
 let disposed=false;
 const session={get ready(){return !disposed&&!renderer.lost;},
  draw(...args){if(!disposed)renderer.draw(...args);},
  destroy(){disposed=true;renderer.canvas.hidden=true;renderer.canvas.remove();},startup:Promise.resolve()};
 // Callback is synchronous: shaders and all texture bytes already live on GPU.
 onReady?.();return session;
}
root.LinguaCurlV2={CurlSpringPhysics,createMesh,sheetGeometry,portraitProgress,VERTEX_SHADER,FRAGMENT_SHADER,
 snapAllowed,createSession,createRenderer:makeRenderer,prime,isReady,clearCache,release,
 snapshotSignature,snapshotSources,cacheStats:()=>({
  pages:snapshotCache.size,
  snapshots:snapshotBuilds,uploads:gpuUploads,contexts:gpuContexts,residentBooks:gpuBooks.size,
  estimatedBytes:Array.from(snapshotCache.values()).reduce((n,row)=>n+cacheBytes(row),0)
 }),lastFailure:null,lastWarmupWarning:null};
if(typeof module==='object'&&module.exports)
 module.exports={CurlSpringPhysics,createMesh,sheetGeometry,portraitProgress,VERTEX_SHADER,FRAGMENT_SHADER,snapshotSources};
})(typeof window==='object'?window:globalThis);
