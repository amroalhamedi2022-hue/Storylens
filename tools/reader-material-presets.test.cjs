'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const shell=fs.readFileSync('app/src/main/assets/lingua-shell.js','utf8');
const css=fs.readFileSync('app/src/main/assets/lt-device-acceptance.css','utf8');
const backup=fs.readFileSync('app/src/main/assets/data-backup.js','utf8');
const names=['book','fibre','white','cream','comfort','night'];
const saved=new Map(),dataset={};
const document={documentElement:{dataset,lang:'ar',dir:'rtl'},
 body:{classList:{add(){},remove(){}},style:{removeProperty(){},setProperty(){}}},
 querySelectorAll(){return []},querySelector(){return null},getElementById(){return null},addEventListener(){}};
const window={addEventListener(){},innerWidth:1000,scrollY:0,matchMedia(){return {matches:false}}};
const state={page:'library',uiTheme:'aurora'};
vm.runInNewContext(shell,{window,document,state,library(){},openStory(){},libraryBack(){},
 get:(k,f)=>saved.has(k)?saved.get(k):f,put:(k,v)=>saved.set(k,v),
 closeSheet(){},Date,console},{timeout:5000});
a.deepEqual(Array.from(window.LinguaShell.readerMaterialChoices),names);
a.equal(dataset.ltReaderMaterial,'book');
for(const name of names){
 a.equal(window.LinguaShell.applyReaderMaterial(name),true);
 a.equal(dataset.ltReaderMaterial,name);
 a.equal(saved.get('ltReaderMaterial'),name);
 a.ok(css.includes('data-lt-reader-material="'+name+'"')||name==='book');
}
a.equal(window.LinguaShell.applyReaderMaterial('javascript:alert(1)'),false);
a.equal(saved.get('ltReaderMaterial'),'night');
a.match(shell,/lt-reader-material-select/);
a.match(backup,/'ltReaderMaterial'/);
a.match(backup,/if\(tail==='ltReaderMaterial'\)/);
a.match(backup,/applyReaderMaterial\?\.\(get\('ltReaderMaterial'/);
a.match(css,/mix-blend-mode:normal!important;opacity:1!important/);
console.log('PASS six independent paper presets, live preferences, backup and original artwork');
