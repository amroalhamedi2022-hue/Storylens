/* Portable Quran-only integrity gate for a future GPU visual adapter.
 * NOT loaded by Lingua Tales. No sacred text, source images or OCR here.
 * For the Compose Quran app, port this trust contract to Kotlin instead.
 */
(function(root){
'use strict';
function checkedPageNumber(value){
 if(!Number.isSafeInteger(value)||value<1||value>604)
  throw new Error('SECURITY HALT: invalid Quran page index');
 return value;
}
function expectedHash(provider,page){
 if(provider.manifestTrusted!==true)
  throw new Error('SECURITY HALT: Quran manifest not approved');
 const hash=provider.getExpectedHash(page);
 if(typeof hash!=='string'||!/^[a-f0-9]{64}$/i.test(hash))
  throw new Error('SECURITY HALT: missing trusted page digest');
 return hash.toLowerCase();
}
function bytesOf(page){
 const data=page?.encodedBytes;
 if(data instanceof ArrayBuffer)return new Uint8Array(data);
 if(ArrayBuffer.isView(data))return new Uint8Array(data.buffer,data.byteOffset,data.byteLength);
 throw new Error('SECURITY HALT: no original encoded Quran page bytes');
}
function sameDigest(a,b){
 if(a.length!==b.length)return false;
 let diff=0;
 for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);
 return diff===0;
}
class QuranSafeCurlAdapter {
 constructor(webglEngine,quranContentProvider,environment=root){
  if(!webglEngine?.setTextures||!webglEngine?.startTurn)
   throw new Error('Missing Quran GPU visual renderer');
  this.engine=webglEngine;this.provider=quranContentProvider;this.env=environment;
  this.pending=0;
 }
 async verifyIntegrity(pageAsset,pageIndex){
  const index=checkedPageNumber(pageIndex);
  const bytes=bytesOf(pageAsset);
  const actual=await this.env.crypto.subtle.digest('SHA-256',bytes);
  const hash=Array.from(new Uint8Array(actual),byte=>byte.toString(16).padStart(2,'0')).join('');
  if(!sameDigest(hash,expectedHash(this.provider,index)))
   throw new Error('SECURITY HALT: Quran page SHA-256 mismatch: '+index);
  return bytes;
 }
 async initiateTurn(verseRange,direction){
  if(direction!==1&&direction!==-1)throw new Error('Invalid paper direction');
  const current=checkedPageNumber(verseRange?.current);
  const next=checkedPageNumber(verseRange?.next);
  const transaction=++this.pending;
  let front=null,back=null;
  try{
   // The provider supplies ORIGINAL PNG bytes from the verified immutable pack.
   const a=await this.provider.getVerifiedPageBitmap(current);
   const b=await this.provider.getVerifiedPageBitmap(next);
   const [aBytes,bBytes]=await Promise.all([
    this.verifyIntegrity(a,current),this.verifyIntegrity(b,next)
   ]);
   if(transaction!==this.pending)return false;
   // Decode ONLY bytes whose trusted file digests matched, not a bitmap
   // supplied alongside them without a cryptographic connection.
   front=await this.env.createImageBitmap(new Blob([aBytes],{type:'image/png'}));
   back=await this.env.createImageBitmap(new Blob([bBytes],{type:'image/png'}));
   if(transaction!==this.pending)return false;
   this.engine.setTextures(front,back);
   this.engine.startTurn(direction);
   return true;
  }finally{
   front?.close?.();back?.close?.();
  }
 }
 cancel(){this.pending++;this.engine.cancel?.();}
}
root.QuranSafeCurlAdapter=QuranSafeCurlAdapter;
if(typeof module==='object'&&module.exports)
 module.exports={QuranSafeCurlAdapter,checkedPageNumber,sameDigest};
})(typeof window==='object'?window:globalThis);
