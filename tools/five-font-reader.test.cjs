'use strict';const a=require('node:assert/strict'),fs=require('node:fs');
const read=f=>fs.readFileSync(f,'utf8');
const shell=read('app/src/main/assets/lingua-shell.js'),reader=read('app/src/main/assets/reader-experience.js');
a.match(shell,/fontChoices=\{ar:\['sans','naskh','ruqaa','kufi','hand','lateef','katibeh'\]/);
a.match(shell,/en:\['serif','sans','humanist','mono','hand','caveat','kalam'\]/);
a.match(reader,/get\('fontArabic','sans'\)/);
a.match(reader,/get\('fontEnglish','serif'\)/);
a.match(reader,/node\.matches\('\.inline-ar'\)/);
console.log('PASS: seven independent font choices per language and reader application');
