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

// Offline means an explicit deny for non-APK requests, not a null response
// that lets WebView try the network if permissions ever change.
assert.match(activity,/val bundled = url\.scheme == "https"/);
assert.match(activity,/url\.path\.orEmpty\(\)\.startsWith\("\/assets\/"\)/);
assert.match(activity,/return local \?: WebResourceResponse\(/);
assert.match(activity,/403, "Forbidden"/);
assert.match(activity,/!uri\.path\.orEmpty\(\)\.startsWith\("\/assets\/"\)/);

assert.match(activity,/reader\.loadUrl\("https:\/\/appassets\.androidplatform\.net\/assets\/index\.html"\)/);
const manifest=fs.readFileSync(path.join(root,'app/src/main/AndroidManifest.xml'),'utf8');
assert.ok(!manifest.includes('android.permission.RECORD_AUDIO'),'no microphone permission');
assert.ok(!manifest.includes('android.permission.INTERNET'),'offline app no network permission');
assert.match(manifest,/android:label="Lingua Tales"/,'launcher label uses the approved brand');
assert.match(manifest,/android:icon="@mipmap\/ic_launcher"/,'adaptive launcher icon is configured');
assert.match(manifest,/android:roundIcon="@mipmap\/ic_launcher"/,'round launcher mask is configured');
const launcher=fs.readFileSync(path.join(root,'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml'),'utf8');
assert.match(launcher,/<background android:drawable="@drawable\/lingua_icon_background"\/>/);
assert.match(launcher,/<foreground android:drawable="@drawable\/lingua_icon_foreground"\/>/);
assert.match(launcher,/<monochrome android:drawable="@drawable\/lingua_icon_monochrome"\/>/);
const iconBackground=fs.readFileSync(path.join(root,'app/src/main/res/drawable/lingua_icon_background.xml'),'utf8');
assert.match(iconBackground,/android:startColor="#242058"/,'launcher background uses the approved gradient rather than a white surround');
assert.match(iconBackground,/android:endColor="#EE82B5"/);
const iconResources=['lingua_icon_foreground.xml','lingua_icon_monochrome.xml'];
for(const resource of iconResources){
 assert.ok(fs.existsSync(path.join(root,'app/src/main/res/drawable',resource)),'adaptive icon resource exists: '+resource);
}
assert.match(html,/<title>Lingua Tales —/,'WebView title uses the approved brand');
assert.doesNotMatch(activity,/TextToSpeech|SpeechRecognizer/,'no speech synthesis or recognition integration');
assert.doesNotMatch(html,/speechSynthesis|SpeechRecognition|TextToSpeech/,'no TTS or microphone workflow in WebView assets');
console.log(JSON.stringify({result:'PASS',bundledCSSJS:unique,offlineAssetLoader:true,noAudio:true,noInternetPermission:true,brand:'Lingua Tales',adaptiveIcon:true,noTts:true},null,2));
