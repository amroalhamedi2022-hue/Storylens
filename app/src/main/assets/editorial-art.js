/* Cinematic SVG chapter scenes — no third-party images and fully offline.
 * Deliberately restrained adult editorial art; substitute approved paintings later.
 */
(function(global){
'use strict';
const colors={
 mystery:['#061629','#144f71','#65d7f4','#ffcf92'],
 sci_fi:['#071735','#235a8b','#a9eff8','#ab84ff'],
 psychological:['#161324','#4a375e','#c394d8','#9de0e8'],
 historical:['#221a21','#826247','#ebc992','#d0aa72'],
 contemporary:['#111d2b','#426c77','#ffc18c','#98d6cf'],
 horror:['#121523','#303c56','#7894b9','#c9d7e6']
};
function scene(story,chapter){
 const p=colors[story.genre]||colors.mystery, key=story.genre, v=chapter%4;
 const skyline='<path d="M0 420 L60 400 L108 415 L150 340 L210 370 L260 320 L300 332 L360 270 L420 315 L470 284 L530 353 L590 312 L635 370 L700 335 L760 410 L850 390 L920 350 L1000 402 V620 H0Z" fill="#060e20" opacity=".55"/>';
 const floors='<path d="M0 475 Q120 405 240 458 T470 450 T720 452 T1000 440 V620 H0Z" fill="#091324" opacity=".55"/>';
 const frame='<rect x="100" y="70" width="800" height="460" rx="20" stroke="'+p[2]+'" stroke-width="2" opacity=".22" fill="none"/>';
 let subject='';
 if(key==='mystery'){
  subject='<rect x="443" y="145" width="118" height="340" fill="#061429" opacity=".8"/>'+
  '<path d="M430 155L501 90L575 155Z" fill="'+p[1]+'"/>'+
  '<circle cx="501" cy="230" r="51" fill="#e6f4ee" opacity=".83"/>'+
  '<circle cx="501" cy="230" r="43" fill="none" stroke="'+p[0]+'" stroke-width="5"/>'+
  '<path d="M501 195V231L530 247" stroke="'+p[0]+'" stroke-width="5" fill="none" stroke-linecap="round"/>';
 }else if(key==='sci_fi'){
  subject='<ellipse cx="540" cy="314" rx="252" ry="145" fill="'+p[1]+'" opacity=".53"/>'+
  '<ellipse cx="520" cy="335" rx="360" ry="55" fill="'+p[2]+'" opacity=".25"/>'+
  '<path d="M0 465Q175 400 310 444T630 433T1000 450V620H0Z" fill="#a5d6ed" opacity=".38"/>'+
  '<circle cx="742" cy="122" r="87" fill="'+p[3]+'" opacity=".7"/>';
 }else if(key==='psychological'){
  subject='<rect x="325" y="148" width="338" height="310" rx="15" fill="#090e25" opacity=".83" transform="rotate(-7 490 305)"/>'+
  '<rect x="355" y="137" width="304" height="306" rx="10" fill="'+p[2]+'" opacity=".23" transform="rotate(5 490 305)"/>'+
  '<path d="M405 215H602M397 245H588M397 275H557M399 310H600M402 342H570" stroke="'+p[2]+'" stroke-width="4" opacity=".7"/>';
 }else if(key==='historical'){
  subject='<path d="M230 149L400 118L575 170L765 121L760 460L565 487L403 437L225 480Z" fill="'+p[2]+'" opacity=".73"/>'+
  '<path d="M400 118L403 437M575 170L565 487" stroke="'+p[0]+'" stroke-width="5" opacity=".38"/>'+
  '<path d="M270 398Q420 215 670 365M276 222Q490 412 714 240" stroke="'+p[1]+'" stroke-width="6" stroke-dasharray="13 9" fill="none" opacity=".7"/>'+
  '<circle cx="514" cy="328" r="18" fill="'+p[0]+'"/>';
 }else if(key==='contemporary'){
  subject='<rect x="270" y="125" width="462" height="344" rx="10" fill="#102b3c" opacity=".7"/>'+
  '<rect x="292" y="143" width="420" height="265" rx="6" fill="'+p[2]+'" opacity=".37"/>'+
  '<path d="M505 143V408M293 281H711" stroke="#071b34" stroke-width="16"/>'+
  '<path d="M365 468V393M650 468V393M345 390H676" stroke="'+p[3]+'" stroke-width="10"/>'+
  '<path d="M440 386Q430 322 470 322Q510 322 505 386M544 386Q530 322 578 322Q618 322 610 386" stroke="'+p[0]+'" stroke-width="9" fill="none"/>';
 }else{
  subject='<path d="M322 466L344 238L490 130L664 240L676 475Z" fill="#080c18" opacity=".93"/>'+
  '<path d="M310 240L490 112L692 245" stroke="'+p[2]+'" stroke-width="16" opacity=".62" fill="none"/>'+
  '<rect x="468" y="316" width="65" height="159" fill="'+p[1]+'"/>'+
  '<rect x="379" y="277" width="55" height="70" fill="'+p[2]+'" opacity=".5"/>'+
  '<rect x="553" y="275" width="55" height="70" fill="'+p[2]+'" opacity=".5"/>';
 }
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img">'+
 '<defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="'+p[0]+'"/><stop offset=".66" stop-color="'+p[1]+'"/><stop offset="1" stop-color="'+p[0]+'"/></linearGradient>'+
 '<radialGradient id="light"><stop stop-color="'+p[2]+'" stop-opacity=".5"/><stop offset="1" stop-color="'+p[2]+'" stop-opacity="0"/></radialGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#sky)"/>'+
 '<circle cx="'+(680+v*21)+'" cy="'+(164+v*12)+'" r="330" fill="url(#light)"/>'+
 '<g opacity=".42"><circle cx="103" cy="80" r="3" fill="#fff"/><circle cx="771" cy="94" r="2.5" fill="#fff"/><circle cx="889" cy="209" r="3" fill="#fff"/></g>'+
 skyline+subject+floors+frame+
 '<path d="M0 530Q210 480 415 535T1000 500" stroke="'+p[2]+'" stroke-width="3" fill="none" opacity=".4"/>'+
 '</svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
global.StoryLensMakeEditorialArt=function(stories){
 const assets={};
 for(const s of stories)for(let c=0;c<s.chapters.length;c++)assets[s.id+'_'+c]=scene(s,c);
 return assets;
};
})(window);
