'use strict';
/* Source-bound regression for the authentic 1873 George Makepeace Towle Chapters XXXI–XXXII.
 * English text is checked against the pinned Standard Ebooks XHTML digest.
 * Arabic is an authored draft; this verifies alignment, not literary quality. */
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),assets=path.join(root,'app/src/main/assets'),read=n=>fs.readFileSync(path.join(assets,n),'utf8');
const html=read('index.html');
assert.ok(html.includes('src="classic-verne-towle-ch30.js"')&&html.includes('src="classic-verne-towle-ch31.js"'));
assert.ok(html.indexOf('classic-verne-towle-ch30.js')<html.indexOf('classic-verne-towle-ch31.js'));
assert.ok(html.indexOf('classic-verne-towle-ch31.js')<html.indexOf('editorial-art.js'));
const source=read('classic-verne-towle-ch31.js');
assert.ok(source.includes('src/epub/text/chapter-31.xhtml')&&source.includes('3f96f87cf359251196f1a935314eaedce8d676fd')&&source.includes('src/epub/text/chapter-32.xhtml')&&source.includes('e218533192364ce19436fcc65e9cd2d93842c8d5')&&source.includes('56c82e97ff5d4f8950afca05b71af72688a8da34'));
const story={id:'around-the-world-in-eighty-days-towle',chapters:Array.from({length:30},()=>({paragraphs:[]})),terms:[],totalChapters:37,provenance:'Jules Verne / George Makepeace Towle 1873',editorialStatus:'30 of 37'};
vm.runInNewContext(source,{window:{StoryLensEditorialStories:[story]}},{filename:'classic-verne-towle-ch31.js',timeout:5000});
assert.equal(story.chapters.length,32);
const chapter=story.chapters[30];assert.equal(chapter.paragraphs.length,37);
const normalize=s=>s.replace(/[\u00a0\u2007\u202f]/g,' ').replace(/[\u2060\u00ad\ufeff]/g,'').replace(/\s+/g,' ').trim();
const normalized=chapter.paragraphs.map(p=>normalize(p.en)).join('\n');
assert.equal(crypto.createHash('sha256').update(normalized,'utf8').digest('hex'),'155822a6e00d078984230cc6d8183e399b8f87333270ab530024b909de83c5a7');
const body=chapter.paragraphs.map(p=>p.en).join(' '),words=(body.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)||[]).length;
assert.equal(words,1843);
assert.ok(body.startsWith('Phileas Fogg found himself twenty hours behind time.'));
assert.ok(body.endsWith('The China, for Liverpool, had started three-quarters of an hour before!'));
assert.ok(chapter.paragraphs.every(p=>p.en.trim().length>5&&p.ar.trim().length>5&&/[\u0621-\u064A]/.test(p.ar)));
assert.equal(story.totalChapters,37);assert.match(story.editorialStatus,/32 of 37/);assert.equal(story.terms.length,68);
for(const t of story.terms){assert.ok(body.toLowerCase().includes(t.term.toLowerCase()),'term absent from source: '+t.term);assert.ok(t.literal&&t.context&&t.note);}

const chapter32=story.chapters[31];assert.equal(chapter32.paragraphs.length,50);
const normalized32=chapter32.paragraphs.map(p=>normalize(p.en)).join('\\n');
assert.equal(crypto.createHash('sha256').update(normalized32,'utf8').digest('hex'),'992fcb13f472c5638ec7bfe89569351bc64c17a40d2b671b598df4679d4f5877');
const body32=chapter32.paragraphs.map(p=>p.en).join(' '),words32=(body32.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)||[]).length;
assert.equal(words32,1051);
assert.ok(body32.startsWith('The China, in leaving, seemed to have carried off Phileas Fogg’s last hope.'));
assert.ok(body32.endsWith('more than seven thousand pounds would have been spent!'));
assert.ok(chapter32.paragraphs.every(p=>p.en.trim().length>2&&p.ar.trim().length>2&&/[ء-ي]/.test(p.ar)));
for(const t of story.terms.slice(34)){assert.ok(body32.toLowerCase().includes(t.term.toLowerCase()),'Chapter XXXII term absent from source: '+t.term);assert.ok(t.literal&&t.context&&t.note);}

const artSandbox={window:{}};vm.runInNewContext(read('editorial-art.js'),artSandbox,{filename:'editorial-art.js',timeout:5000});
const art=artSandbox.window.StoryLensMakeEditorialArt([story]);
assert.ok(art[story.id+'_30']);assert.notEqual(art[story.id+'_29'],art[story.id+'_30']);
assert.match(decodeURIComponent(art[story.id+'_30']),/PRAIRIE SAILS · OMAHA EXPRESS/);
assert.ok(art[story.id+'_31']);assert.notEqual(art[story.id+'_30'],art[story.id+'_31']);
assert.match(decodeURIComponent(art[story.id+'_31']),/HENRIETTA · HUDSON DEPARTURE/);
const shell=read('lingua-shell.js'),css=read('lingua-shell.css'),backup=read('data-backup.js');
assert.ok(shell.includes("'prairie-sails':'Prairie Sails'"));assert.ok(css.includes('body.theme-prairie-sails'));
assert.ok(shell.includes("'hudson-ledger':'Hudson Ledger'"));assert.ok(css.includes('body.theme-hudson-ledger'));
assert.ok(css.includes('.lt-theme-hudson-ledger .lt-theme-swatch'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce){.theme-hudson-ledger'));
assert.ok(backup.includes("val==='hudson-ledger'"));
assert.ok(css.includes('.lt-theme-prairie-sails .lt-theme-swatch'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce){.theme-prairie-sails'));
assert.ok(backup.includes("val==='prairie-sails'"));assert.ok(html.includes('<style id="theme-prairie-sails">'));
assert.ok(html.includes('body.theme-prairie-sails'));
console.log(JSON.stringify({result:'PASS',chapters:[{chapter:31,paragraphs:37,englishWords:words,normalizedEnglishSha256:'155822a6e00d078984230cc6d8183e399b8f87333270ab530024b909de83c5a7',arabicDrafts:37,contextualTerms:34},{chapter:32,paragraphs:50,englishWords:words32,normalizedEnglishSha256:'992fcb13f472c5638ec7bfe89569351bc64c17a40d2b671b598df4679d4f5877',arabicDrafts:50,contextualTerms:34}],totalAvailableChapters:32,uniqueOfflineArt:true,newTheme:'Hudson Ledger',editorialReview:'NOT TESTED',device:'NOT TESTED'},null,2));
