'use strict';
/* Source-bound chronology regression for the authentic Towle Chapter IV.
 * The English source is authoritative; these checks catch time shifts in
 * the aligned Arabic editorial draft. They do not certify literary quality. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../app/src/main/assets/classic-verne-towle-ch04.js'),'utf8');
const story={id:'around-the-world-in-eighty-days-towle',chapters:[{},{},{}],terms:[],provenance:''};
const sandbox={window:{StoryLensEditorialStories:[story]}};
vm.runInNewContext(source,sandbox,{filename:'classic-verne-towle-ch04.js'});
assert.equal(story.chapters.length,4);
const paragraphs=story.chapters[3].paragraphs;
assert.equal(paragraphs.length,43);
const verify=(english,arabic,wrong)=>{
 const matches=paragraphs.filter(p=>p.en.includes(english));
 assert.equal(matches.length,1,'Expected one source passage for: '+english);
 assert.ok(matches[0].ar.includes(arabic),'Arabic time differs from Towle: '+english);
 if(wrong)assert.ok(!matches[0].ar.includes(wrong),'Outdated erroneous time: '+wrong);
};
verify('at twenty-five minutes past seven','السابعة وخمس وعشرين دقيقة','السابعة وخمس وثلاثين');
verify('station at twenty minutes past eight','الثامنة وعشرين دقيقة');
verify('at twenty minutes before nine','الثامنة وأربعين دقيقة');
verify('five minutes later the whistle','بعد خمس دقائق');
console.log('PASS Towle IV chronology: 19:25, 20:20, 20:40, 20:45; 43 bilingual paragraphs');
