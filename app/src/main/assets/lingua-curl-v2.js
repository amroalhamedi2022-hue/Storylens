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
const VERTEX_SHADER=[
 '#version 300 es',
 'layout(location=0) in vec2 aUv;',
 'uniform vec2 uResolution;',
 'uniform float uProgress;',
 'uniform float uGrabY;',
 'uniform float uRadius;',
 'uniform float uEdge;',
 'out vec2 vUv;',
 'out vec3 vNormal;',
 'out float vCurlAngle;',
 'void main(){',
 ' vUv=aUv;',
 ' vec2 pos=aUv*uResolution;',
 ' float angle=(uGrabY-0.5)*0.5;',
 ' vec2 dir=vec2(cos(angle),sin(angle));',
 ' vec2 oriented=vec2(uEdge>0.0?pos.x:uResolution.x-pos.x,pos.y);',
 ' float curlCenter=uResolution.x*(1.0-clamp(uProgress,0.0,1.0));',
 ' float dist=dot(oriented,dir)-curlCenter;',
 ' vec3 p=vec3(oriented,0.0);',
 ' vec3 normal=vec3(0.0,0.0,1.0);',
 ' float theta=0.0;',
 ' float r=max(uRadius,1.0);',
 ' if(dist>0.0){',
 '  theta=min(dist/r,3.14159265);',
 '  if(dist<r*3.14159265){',
 '   p=vec3(oriented-dir*dist+dir*r*sin(theta),r*(1.0-cos(theta)));',
 '   normal=vec3(-sin(theta)*dir,cos(theta));',
 '  }else{',
 '   float over=dist-r*3.14159265;',
 '   p=vec3(oriented-dir*(dist+over),r*2.0);',
 '   normal=vec3(0.0,0.0,-1.0);',
 '  }',
 ' }',
 ' if(uEdge<0.0){p.x=uResolution.x-p.x;normal.x=-normal.x;}',
 ' float perspective=1.0+p.z/2400.0;',
 ' vec2 ndc=((p.xy/uResolution)*2.0-1.0)/perspective;',
 ' gl_Position=vec4(ndc*vec2(1.0,-1.0),-p.z/1200.0,1.0);',
 ' vNormal=normal;vCurlAngle=theta;',
 '}'
].join('\n');
const FRAGMENT_SHADER=[
 '#version 300 es',
 'precision highp float;',
 'in vec2 vUv;',
 'in vec3 vNormal;',
 'in float vCurlAngle;',
 'uniform sampler2D uFrontTex;',
 'uniform sampler2D uBackTex;',
 'out vec4 fragColor;',
 'void main(){',
 ' vec3 lightDir=normalize(vec3(-0.5,-0.5,1.0));',
 ' vec3 n=normalize(gl_FrontFacing?vNormal:-vNormal);',
 ' vec2 boundary=min(vUv,1.0-vUv);',
 ' float edgePx=min(boundary.x,boundary.y);',
 ' float aa=smoothstep(0.0,max(fwidth(edgePx)*1.3,0.0005),edgePx);',
 ' vec4 pigment=gl_FrontFacing?texture(uFrontTex,vUv):texture(uBackTex,vec2(1.0-vUv.x,vUv.y));',
 ' float diff=max(dot(n,lightDir),0.0);',
 ' float spec=pow(max(dot(n,normalize(lightDir+vec3(0.0,0.0,1.0))),0.0),30.0)*0.18;',
 ' float ao=1.0-0.20*sin(clamp(vCurlAngle,0.0,3.14159265));',
 ' vec3 ink=pigment.rgb*(0.66+0.34*diff)*ao+vec3(spec);',
 ' fragColor=vec4(ink,pigment.a*aa);',
 '}'
].join('\n');
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
const MAX_CACHED_PAGES=4;
function rasterScale(win,width,height,max=2048){
 return clamp(Math.min(win.devicePixelRatio||1,1.8,
  max/width,max/height,Math.sqrt(3500000/(width*height))),.5,1.8);
}
async function cachedPage(win,host,source,width,height,scale,dead){
 const found=snapshotCache.get(source);
 if(found&&found.width===width&&found.height===height&&
    Math.abs(found.scale-scale)<.0001){
  snapshotCache.delete(source);snapshotCache.set(source,found);
  const canvas=await found.promise;
  if(dead())throw new Error('Curl cancelled');
  return canvas;
 }
 const row={width,height,scale,promise:null};
 row.promise=capturePage(win,host,source,width,height,scale,
  ()=>!host.isConnected).catch(error=>{
   if(snapshotCache.get(source)===row)snapshotCache.delete(source);
   throw error;
 });
 snapshotCache.set(source,row);
 while(snapshotCache.size>MAX_CACHED_PAGES)
  snapshotCache.delete(snapshotCache.keys().next().value);
 const canvas=await row.promise;
 if(dead())throw new Error('Curl cancelled');
 return canvas;
}
function prime({win,host,page,back,width,height}){
 if(!snapAllowed(win)||!page||!back||!host.isConnected)return;
 const scale=rasterScale(win,width,height);
 // Run off the input path. Failed snapshots do not affect reading.
 Promise.resolve().then(()=>cachedPage(win,host,page,width,height,scale,()=>false))
  .then(()=>cachedPage(win,host,back,width,height,scale,()=>false))
  .catch(error=>{root.LinguaCurlV2.lastFailure=String(error);});
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
 stage.querySelectorAll('.tok').forEach(node=>node.replaceWith(doc.createTextNode(node.textContent)));
 stage.setAttribute('aria-hidden','true');stage.inert=true;
 const original=win.getComputedStyle(source);
 for(const key of ['padding','font','color','direction','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat']){
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
   imageTimeout:3500,removeContainer:true,scrollX:0,scrollY:0,
   windowWidth:Math.max(doc.documentElement.clientWidth,Math.ceil(width)),
   windowHeight:Math.max(doc.documentElement.clientHeight,Math.ceil(height)),
   onclone(clone){
    const item=clone.getElementById(marker);
    if(!item)throw new Error('Missing snapshot page in cloned document');
    item.style.setProperty('visibility','visible','important');
    item.style.setProperty('display','block','important');
   }
  });
  if(disposed())throw new Error('Curl cancelled during rasterization');
  if(canvas.width<2||canvas.height<2)throw new Error('Empty paper texture');
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
 const canvas=win.document.createElement('canvas');
 canvas.className='lt-curl-webgl';
 canvas.style.width=width+'px';canvas.style.height=height+'px';
 stage.appendChild(canvas);
 const gl=canvas.getContext('webgl2',{
  alpha:true,antialias:true,depth:true,premultipliedAlpha:true,
  preserveDrawingBuffer:false,powerPreference:'high-performance'
 });
 if(!gl){canvas.remove();throw new Error('WebGL2 unavailable');}
 const max=gl.getParameter(gl.MAX_TEXTURE_SIZE)||2048;
 const scale=rasterScale(win,width,height,Math.min(max,2048));
 canvas.width=Math.max(2,Math.round(width*scale));
 canvas.height=Math.max(2,Math.round(height*scale));
 const program=makeProgram(gl),mesh=createMesh(),vao=gl.createVertexArray(),
  uv=gl.createBuffer(),idx=gl.createBuffer();
 gl.bindVertexArray(vao);
 gl.bindBuffer(gl.ARRAY_BUFFER,uv);gl.bufferData(gl.ARRAY_BUFFER,mesh.uv,gl.STATIC_DRAW);
 gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idx);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
 gl.bindVertexArray(null);
 gl.useProgram(program);
 const uniform=name=>gl.getUniformLocation(program,name);
 const uniforms={resolution:uniform('uResolution'),progress:uniform('uProgress'),
  grabY:uniform('uGrabY'),radius:uniform('uRadius'),edge:uniform('uEdge'),
  front:uniform('uFrontTex'),back:uniform('uBackTex')};
 const textures=[];
 function upload(source){
  const t=gl.createTexture();textures.push(t);gl.bindTexture(gl.TEXTURE_2D,t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
  if(gl.getError()!==gl.NO_ERROR)throw new Error('Paper texture upload failed');
  return t;
 }
 let front=null,back=null,dead=false;
 return {
  scale,
  install(frontCanvas,backCanvas){
   if(dead)return false;
   front=upload(frontCanvas);back=upload(backCanvas);return true;
  },
  draw(progress,grabY,edge){
   if(dead||!front||!back)return;
   gl.viewport(0,0,canvas.width,canvas.height);
   gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
   gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
   gl.useProgram(program);gl.bindVertexArray(vao);
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,front);
   gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,back);
   gl.uniform1i(uniforms.front,0);gl.uniform1i(uniforms.back,1);
   gl.uniform2f(uniforms.resolution,width,height);
   gl.uniform1f(uniforms.progress,clamp(progress,0,1));
   gl.uniform1f(uniforms.grabY,clamp(grabY,0,1));
   gl.uniform1f(uniforms.radius,Math.max(5,Math.min(width*.11,32+width*.045)));
   gl.uniform1f(uniforms.edge,edge==='left'?-1:1);
   gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_SHORT,0);
   gl.bindVertexArray(null);
  },
  destroy(){
   if(dead)return;dead=true;
   for(const t of textures)gl.deleteTexture(t);
   gl.deleteBuffer(uv);gl.deleteBuffer(idx);gl.deleteVertexArray(vao);
   gl.deleteProgram(program);canvas.remove();
  },
  get canvas(){return canvas;}
 };
}
function createSession({win,host,stage,page,back,width,height,onReady,onFailed}){
 if(!snapAllowed(win))return null;
 let disposed=false,renderer;
 try{renderer=makeRenderer(win,stage,width,height);}
 catch(e){root.LinguaCurlV2.lastFailure=String(e);return null;}
 renderer.canvas.hidden=true;
 renderer.canvas.addEventListener('webglcontextlost',event=>{
  event.preventDefault();
  if(disposed)return;
  disposed=true;root.LinguaCurlV2.lastFailure='WebGL2 context lost';
  renderer.destroy();onFailed?.(new Error('WebGL2 context lost'));
 },{once:true});
 const dead=()=>disposed;
 const startup=(async()=>{
  try{
   const scale=renderer.scale;
   const front=await cachedPage(win,host,page,width,height,scale,dead);
   const reverse=back
    ?await cachedPage(win,host,back,width,height,scale,dead)
    :blankBack(win,width,height,scale,win.getComputedStyle(page).backgroundColor);
   if(disposed)return;
   renderer.install(front,reverse);
   if(disposed)return;
   renderer.canvas.hidden=false;
   onReady?.();
  }catch(e){
   if(!disposed){
    root.LinguaCurlV2.lastFailure=String(e);
    renderer.destroy();onFailed?.(e);
   }
  }
 })();
 return {
  get ready(){return !disposed&&!renderer.canvas.hidden;},
  draw(progress,grabY,edge){if(!disposed&&!renderer.canvas.hidden)renderer.draw(progress,grabY,edge);},
  destroy(){disposed=true;renderer.destroy();},
  startup
 };
}
root.LinguaCurlV2={CurlSpringPhysics,createMesh,VERTEX_SHADER,FRAGMENT_SHADER,
 snapAllowed,createSession,prime,lastFailure:null};
if(typeof module==='object'&&module.exports)
 module.exports={CurlSpringPhysics,createMesh,VERTEX_SHADER,FRAGMENT_SHADER};
})(typeof window==='object'?window:globalThis);
