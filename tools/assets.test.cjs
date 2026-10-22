'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');
const refs=[...html.matchAll(/<(?:script|link)\s+[^>]*(?:src|href)="([^"]+\.(?:js|css))"/g)].map(m=>m[1]);
const unique=[...new Set(refs)];
assert.ok(unique.length>=8,'all external app modules and styles referenced');
for(const asset of unique){
 assert.ok(!asset.startsWith('/')&&!asset.includes('..'),'safe relative asset: '+asset);
 const file=path.join(assets,asset);
 assert.ok(fs.existsSync(file),'APK asset missing: '+asset);
 if(asset.endsWith('.js'))execFileSync(process.execPath,['--check',file],{stdio:'pipe',timeout:8000});
}
const activity=fs.readFileSync(path.join(root,'app/src/main/java/com/storylens/reader/MainActivity.kt'),'utf8');
assert.match(activity,/WebViewAssetLoader\.Builder\(\)/,'real offline https asset loader used');
assert.match(activity,/shouldInterceptRequest\(/,'external assets resolved from APK, not network');
assert.match(activity,/reader\.loadUrl\("https:\/\/appassets\.androidplatform\.net\/assets\/index\.html"\)/);
const manifest=fs.readFileSync(path.join(root,'app/src/main/AndroidManifest.xml'),'utf8');
assert.ok(!manifest.includes('android.permission.RECORD_AUDIO'),'no microphone permission');
assert.ok(!manifest.includes('android.permission.INTERNET'),'offline app no network permission');
console.log(JSON.stringify({result:'PASS',bundledCSSJS:unique,offlineAssetLoader:true,noAudio:true,noInternetPermission:true},null,2));
