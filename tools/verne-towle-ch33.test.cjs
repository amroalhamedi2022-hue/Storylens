'use strict';
/* Source-bound regression for authentic Towle Chapters XXXIII–XXXIV and contextual learning. */
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),assets=path.join(root,'app/src/main/assets'),read=n=>fs.readFileSync(path.join(assets,n),'utf8');
const html=read('index.html');
assert.ok(html.includes('src="classic-verne-towle-ch31.js"')&&html.includes('src="classic-verne-towle-ch33.js"')&&html.includes('src="classic-verne-towle-ch34.js"'));
assert.ok(html.indexOf('classic-verne-towle-ch31.js')<html.indexOf('classic-verne-towle-ch33.js'));
assert.ok(html.indexOf('classic-verne-towle-ch33.js')<html.indexOf('classic-verne-towle-ch34.js'));
assert.ok(html.indexOf('classic-verne-towle-ch34.js')<html.indexOf('editorial-art.js'));
const source=read('classic-verne-towle-ch33.js');
assert.ok(source.includes('src/epub/text/chapter-33.xhtml')&&source.includes('22da80571dce2d37f9bfb1612f1c96ab9331c3c9')&&source.includes('56c82e97ff5d4f8950afca05b71af72688a8da34'));
const story={id:'around-the-world-in-eighty-days-towle',chapters:Array.from({length:32},()=>({paragraphs:[]})),terms:[],totalChapters:37,provenance:'Jules Verne / George Makepeace Towle 1873',editorialStatus:'32 of 37'};
vm.runInNewContext(source,{window:{StoryLensEditorialStories:[story]}},{filename:'classic-verne-towle-ch33.js',timeout:5000});
assert.equal(story.chapters.length,33);
const chapter=story.chapters[32];assert.equal(chapter.paragraphs.length,67);
const normalize=s=>s.replace(/[\u00a0\u2007\u202f]/g,' ').replace(/[\u2060\u00ad\ufeff]/g,'').replace(/\s+/g,' ').trim();
const normalized=chapter.paragraphs.map(p=>normalize(p.en)).join('\n');
assert.equal(crypto.createHash('sha256').update(normalized,'utf8').digest('hex'),'baebea11a8d79e4458973a88d541efe432a4f1723718ce6cd4d53234601db441');
const body=chapter.paragraphs.map(p=>p.en).join(' '),words=(body.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)||[]).length;
assert.equal(words,2482);
assert.ok(body.startsWith('An hour after, the Henrietta passed the lighthouse'));
assert.ok(body.endsWith('I arrest you in the Queen’s name!”'));
assert.ok(chapter.paragraphs.every(p=>p.en.trim().length>4&&p.ar.trim().length>4&&/[\u0621-\u064A]/.test(p.ar)));
assert.equal(story.totalChapters,37);assert.match(story.editorialStatus,/33 of 37/);assert.equal(story.terms.length,35);
for(const t of story.terms){assert.ok(body.toLowerCase().includes(t.term.toLowerCase()),'Chapter XXXIII term absent from source: '+t.term);assert.ok(t.literal&&t.context&&t.note);}

const chapter34Source=read('classic-verne-towle-ch34.js');
assert.ok(chapter34Source.includes('src/epub/text/chapter-34.xhtml')&&chapter34Source.includes('d78ec1d3014c2bb027c60645be33e0c0331ea7d3'));
vm.runInNewContext(chapter34Source,{window:{StoryLensEditorialStories:[story]}},{filename:'classic-verne-towle-ch34.js',timeout:5000});
assert.equal(story.chapters.length,34);
const chapter34=story.chapters[33];assert.equal(chapter34.paragraphs.length,22);
const normalize34=s=>s.replace(/[\u00a0\u2007\u202f]/g,' ').replace(/[\u2060\u00ad\ufeff]/g,'').replace(/\s+/g,' ').trim();
const normalized34=chapter34.paragraphs.map(p=>normalize34(p.en)).join('\n');
assert.equal(crypto.createHash('sha256').update(normalized34,'utf8').digest('hex'),'b99d773a896ea121836a443ffc1290e67041718ccbb59f5341a19bc78246e6d9');
const body34=chapter34.paragraphs.map(p=>p.en).join(' '),words34=(body34.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)||[]).length;
assert.equal(words34,972);assert.ok(body34.startsWith('Phileas Fogg was in prison.'));assert.ok(body34.endsWith('He had lost the wager!'));
assert.ok(chapter34.paragraphs.every(p=>p.en.trim().length>4&&p.ar.trim().length>4&&/[ء-ي]/.test(p.ar)));
assert.equal(story.totalChapters,37);assert.match(story.editorialStatus,/34 of 37/);assert.equal(story.terms.length,55);
for(const t of story.terms.slice(-20)){assert.ok(body34.toLowerCase().includes(t.term.toLowerCase()),'Chapter XXXIV term absent from source: '+t.term);assert.ok(t.literal&&t.context&&t.note);}
const fatalGloss=story.terms.slice(-20).find(t=>t.term==='fatal');
assert.ok(fatalGloss,'Chapter XXXIV fatal entry must remain in the contextual glossary');
assert.equal(fatalGloss.literal,'كارثيّ / ضربة قاصمة','fatal describes a disastrous setback here, not an Arabic judge');

const artSandbox={window:{}};vm.runInNewContext(read('editorial-art.js'),artSandbox,{filename:'editorial-art.js',timeout:5000});
const art=artSandbox.window.StoryLensMakeEditorialArt([story]);
assert.ok(art[story.id+'_32']);assert.notEqual(art[story.id+'_31'],art[story.id+'_32']);
assert.match(decodeURIComponent(art[story.id+'_32']),/ATLANTIC PASSAGE · QUEENSTOWN/);
const shell=read('lingua-shell.js'),css=read('lingua-shell.css'),backup=read('data-backup.js');
assert.ok(shell.includes("'last-five-minutes':'The Last Five Minutes'"));
assert.ok(css.includes('body.theme-last-five-minutes')&&css.includes('.lt-theme-last-five-minutes .lt-theme-swatch'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce){.theme-last-five-minutes'));
assert.ok(backup.includes("val==='last-five-minutes'"));
assert.ok(shell.includes("'atlantic-passage':'Atlantic Passage'")&&shell.includes("'atlantic-passage'"));
assert.ok(css.includes('body.theme-atlantic-passage')&&css.includes('.lt-theme-atlantic-passage .lt-theme-swatch'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce){.theme-atlantic-passage'));
assert.ok(backup.includes("val==='atlantic-passage'"));
console.log(JSON.stringify({result:'PASS',chapter:33,paragraphs:67,englishWords:words,normalizedEnglishSha256:'baebea11a8d79e4458973a88d541efe432a4f1723718ce6cd4d53234601db441',arabicDrafts:67,contextualTerms:35,illustration:'ATLANTIC PASSAGE · QUEENSTOWN',theme:'Atlantic Passage',editorialReview:'NOT TESTED',device:'NOT TESTED'},null,2));
