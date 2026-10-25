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
function savilleRowScene(){
 // Bespoke offline vector scene: Victorian Saville Row, clock and two figures.
 // No external illustration or remotely loaded asset.
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Victorian London street, townhouse, clock and two figures">'+
 '<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#24334a"/><stop offset="1" stop-color="#b38a69"/></linearGradient><linearGradient id="stone" x2="0" y2="1"><stop stop-color="#d5b995"/><stop offset="1" stop-color="#876b58"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#sky)"/><circle cx="790" cy="115" r="72" fill="#ffdb9d" opacity=".55"/>'+
 '<path d="M0 460V170H210V128H480V182H730V145H1000V460Z" fill="#2b3040"/>'+
 '<rect x="155" y="155" width="690" height="340" fill="url(#stone)" stroke="#473d40" stroke-width="12"/>'+
 '<path d="M132 155L500 65L867 155Z" fill="#393a45"/><rect x="466" y="93" width="68" height="62" fill="#302f3b"/>'+
 '<circle cx="500" cy="123" r="24" fill="#f3dfb8" stroke="#463b40" stroke-width="5"/>'+
 '<path d="M500 123L500 107M500 123L512 130" stroke="#342e32" stroke-width="3" fill="none"/>'+
 '<g fill="#2c3645" stroke="#f0d4a8" stroke-width="9"><rect x="218" y="210" width="110" height="105"/><rect x="672" y="210" width="110" height="105"/><rect x="218" y="344" width="110" height="105"/><rect x="672" y="344" width="110" height="105"/></g>'+
 '<rect x="430" y="270" width="140" height="225" fill="#3c2e30" stroke="#dfc69c" stroke-width="9"/>'+
 '<rect x="495" y="270" width="7" height="225" fill="#c8a875"/><circle cx="520" cy="380" r="5" fill="#e6bd74"/>'+
 '<rect x="450" y="185" width="100" height="44" rx="4" fill="#2c313b" stroke="#d8c39c" stroke-width="4"/>'+
 '<text x="500" y="214" text-anchor="middle" font-family="Georgia,serif" font-size="25" fill="#f5e7c6">7</text>'+
 '<path d="M0 495H1000V620H0Z" fill="#3e4049"/><path d="M0 533H1000" stroke="#c9ae85" stroke-width="5"/>'+
 '<g fill="#191f2c"><path d="M375 490L392 382L420 382L439 490Z"/><circle cx="406" cy="363" r="25"/>'+
 '<path d="M366 340H444V354H366Z"/><path d="M385 309H426L435 342H376Z"/>'+
 '<path d="M607 490L619 404L645 404L660 490Z"/><circle cx="631" cy="384" r="22"/>'+
 '<path d="M610 361H654V369H610Z"/></g>'+
 '<path d="M90 492V220M70 220H110" stroke="#252d37" stroke-width="13"/>'+
 '<path d="M69 214Q89 176 110 214Z" fill="#ffdf9b" stroke="#303441" stroke-width="6"/>'+
 '<rect x="0" y="570" width="1000" height="50" fill="#222a34" opacity=".5"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function savilleRowInterior(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Victorian Saville Row interior with matching clocks and numbered wardrobe">'+
 '<defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#374858"/><stop offset="1" stop-color="#8c7261"/></linearGradient><linearGradient id="wood" x2="1" y2="1"><stop stop-color="#382f36"/><stop offset="1" stop-color="#795444"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#wall)"/><path d="M0 530H1000V620H0Z" fill="#352e33"/>'+
 '<path d="M0 530L1000 530M120 0V530M880 0V530" stroke="#d1ae78" stroke-width="8" opacity=".55"/>'+
 '<rect x="150" y="110" width="700" height="415" rx="8" fill="url(#wood)" stroke="#cba779" stroke-width="13"/>'+
 '<rect x="180" y="142" width="310" height="348" fill="#443945" stroke="#ad886c" stroke-width="5"/>'+
 '<rect x="515" y="142" width="302" height="348" fill="#443945" stroke="#ad886c" stroke-width="5"/>'+
 '<path d="M335 142V490M666 142V490" stroke="#a98668" stroke-width="5"/>'+
 '<g fill="#e5d2aa" font-family="Georgia,serif" font-size="48" text-anchor="middle"><text x="270" y="250">1</text><text x="405" y="250">2</text><text x="600" y="250">3</text><text x="730" y="250">4</text></g>'+
 '<rect x="378" y="38" width="245" height="145" rx="14" fill="#222c38" stroke="#e3c58e" stroke-width="11"/>'+
 '<circle cx="500" cy="111" r="53" fill="#f2e2c4" stroke="#ba8c5b" stroke-width="7"/>'+
 '<path d="M500 111V72M500 111L529 128" stroke="#343c44" stroke-width="7" stroke-linecap="round"/>'+
 '<path d="M270 360H405M590 360H725" stroke="#d7b47b" stroke-width="5"/>'+
 '<path d="M240 530L200 620M760 530L800 620" stroke="#bb986b" stroke-width="10"/>'+
 '<path d="M0 560H1000" stroke="#ba9364" stroke-width="5"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function reformClubScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Victorian Reform Club card table, route map and brass clock">'+
 '<defs><linearGradient id="room" x2="1" y2="1"><stop stop-color="#18343a"/><stop offset="1" stop-color="#76523d"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#room)"/><path d="M0 490H1000V620H0Z" fill="#2b2527"/>'+
 '<rect x="72" y="76" width="300" height="345" rx="12" fill="#e6d1a1" stroke="#bc9054" stroke-width="16"/>'+
 '<path d="M117 167Q195 103 283 186T332 308M120 280Q210 340 315 240" fill="none" stroke="#987d58" stroke-width="6" stroke-dasharray="14 10"/>'+
 '<circle cx="155" cy="179" r="12" fill="#a14c32"/><circle cx="312" cy="309" r="12" fill="#a14c32"/>'+
 '<text x="222" y="381" text-anchor="middle" fill="#493a2e" font-family="Georgia,serif" font-size="44">80 DAYS</text>'+
 '<circle cx="792" cy="160" r="112" fill="#d8bd80" stroke="#342b29" stroke-width="18"/>'+
 '<circle cx="792" cy="160" r="89" fill="#f5e5c2" stroke="#7c5735" stroke-width="5"/>'+
 '<path d="M792 160V95M792 160L843 184" stroke="#30383c" stroke-width="10" fill="none" stroke-linecap="round"/>'+
 '<ellipse cx="651" cy="487" rx="325" ry="105" fill="#2d5849" stroke="#b99254" stroke-width="25"/>'+
 '<g transform="rotate(-14 600 450)"><rect x="555" y="415" width="75" height="112" rx="7" fill="#f5e5c6" stroke="#a47b48" stroke-width="5"/>'+
 '<path d="M592 436V503M565 469H619" stroke="#a0443b" stroke-width="8"/></g>'+
 '<g transform="rotate(18 718 452)"><rect x="680" y="420" width="75" height="112" rx="7" fill="#f5e5c6" stroke="#a47b48" stroke-width="5"/>'+
 '<path d="M718 438V506M691 472H745" stroke="#253b45" stroke-width="8"/></g>'+
 '<circle cx="510" cy="466" r="18" fill="#c4a56c"/><circle cx="818" cy="478" r="18" fill="#c4a56c"/>'+
 '</svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function charingCrossDeparture(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Rainy Victorian Charing Cross railway platform, steam locomotive and travellers">'+
 '<defs><linearGradient id="night" x2="0" y2="1"><stop stop-color="#182f37"/><stop offset="1" stop-color="#61716e"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#night)"/><path d="M0 170L500 42L1000 170M0 238L500 78L1000 238" stroke="#b9a27a" stroke-width="18" fill="none"/>'+
 '<path d="M140 0V490M500 0V490M850 0V490" stroke="#344a4b" stroke-width="28"/>'+
 '<path d="M0 480H1000V620H0Z" fill="#303e40"/><path d="M0 600L380 430M1000 600L630 430" stroke="#c9a879" stroke-width="16"/>'+
 '<path d="M0 615L400 430M1000 615L610 430" stroke="#77847c" stroke-width="8"/>'+
 '<rect x="450" y="215" width="360" height="205" rx="48" fill="#1f363b" stroke="#bd9e67" stroke-width="13"/>'+
 '<rect x="505" y="170" width="220" height="115" rx="18" fill="#30474a" stroke="#c7b080" stroke-width="12"/>'+
 '<circle cx="510" cy="428" r="59" fill="#182a2c" stroke="#bba273" stroke-width="14"/>'+
 '<circle cx="755" cy="428" r="59" fill="#182a2c" stroke="#bba273" stroke-width="14"/>'+
 '<circle cx="785" cy="297" r="28" fill="#ffe4a0"/><path d="M440 165Q385 85 425 35M500 155Q455 70 505 20" fill="none" stroke="#d3e0d0" stroke-width="34" opacity=".28"/>'+
 '<path d="M210 500L225 376L255 376L276 500Z" fill="#171f26"/><circle cx="239" cy="356" r="25" fill="#171f26"/>'+
 '<path d="M175 333H300V347H175Z" fill="#171f26"/><path d="M220 300H264L283 336H198Z" fill="#171f26"/>'+
 '<path d="M325 510L338 402L370 402L390 510Z" fill="#242a31"/><circle cx="352" cy="379" r="23" fill="#242a31"/>'+
 '<rect x="375" y="458" width="58" height="42" rx="8" fill="#80583f" stroke="#d3b47e" stroke-width="5"/>'+
 '<path d="M0 560Q220 525 400 555T1000 555" stroke="#f1dcb4" stroke-width="7" opacity=".3" fill="none"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function exchangeGazetteScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Victorian London exchange hall, folded gazette and brass telegraph">'+
 '<defs><linearGradient id="gazette-wall" x2="0" y2="1"><stop stop-color="#34443d"/><stop offset="1" stop-color="#8d6645"/></linearGradient><linearGradient id="gazette-paper" x2="1" y2="1"><stop stop-color="#fff3d4"/><stop offset="1" stop-color="#d6bd8e"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#gazette-wall)"/><path d="M0 500H1000V620H0Z" fill="#2d302b"/>'+
 '<path d="M70 0V500M930 0V500" stroke="#c9a36d" stroke-width="18" opacity=".7"/>'+
 '<rect x="112" y="75" width="340" height="370" rx="5" fill="url(#gazette-paper)" stroke="#5c4430" stroke-width="12"/>'+
 '<text x="282" y="125" text-anchor="middle" font-family="Georgia,serif" font-size="27" fill="#2c3830">THE GAZETTE</text>'+
 '<path d="M145 150H420M145 170H420M145 190H420" stroke="#5a5a49" stroke-width="5"/>'+
 '<rect x="145" y="215" width="110" height="95" fill="#8c9a80"/><path d="M145 300L195 245L255 300Z" fill="#3c5547"/>'+
 '<path d="M275 220H420M275 240H420M275 260H420M275 280H420M145 330H420M145 350H420M145 370H420M145 390H420" stroke="#8b8068" stroke-width="5"/>'+
 '<path d="M540 470L565 260H865L890 470Z" fill="#342f2a" stroke="#d1ad70" stroke-width="12"/>'+
 '<rect x="595" y="290" width="240" height="135" fill="#192c2b" stroke="#b58a50" stroke-width="7"/>'+
 '<path d="M615 390L660 365L702 380L747 330L790 350L815 315" fill="none" stroke="#e4bd72" stroke-width="8"/>'+
 '<circle cx="792" cy="145" r="84" fill="#e6cf9e" stroke="#47382d" stroke-width="17"/><circle cx="792" cy="145" r="65" fill="#f8edcf" stroke="#b18a55" stroke-width="5"/>'+
 '<path d="M792 145V95M792 145L829 166" stroke="#39443a" stroke-width="9" stroke-linecap="round"/>'+
 '<path d="M0 535H1000" stroke="#d0ad75" stroke-width="5" opacity=".65"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
// Original locally generated vector illustration: the Mongolia at Suez, 1872.
function suezQuaysScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Steamship Mongolia arriving at Suez, with detective on the quay">'+
 '<defs><linearGradient id="suez-sky" x2="0" y2="1"><stop stop-color="#143b50"/><stop offset="1" stop-color="#e5b985"/></linearGradient><linearGradient id="suez-sea" x2="0" y2="1"><stop stop-color="#347b87"/><stop offset="1" stop-color="#143f55"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#suez-sky)"/><circle cx="835" cy="115" r="70" fill="#f7d59e" opacity=".78"/>'+
 '<path d="M0 320L110 292L195 308L270 284L360 314L455 300L545 330H1000V400H0Z" fill="#b99b75"/>'+
 '<path d="M0 345H1000V620H0Z" fill="url(#suez-sea)"/>'+
 '<path d="M100 330V220H125V330M130 330V254H148V330M158 330V204H182V330" stroke="#665e55" stroke-width="6" fill="#d9c39b"/>'+
 '<path d="M258 375H860L810 462H333Z" fill="#263e48" stroke="#d6ba8c" stroke-width="8"/>'+
 '<path d="M335 365V275H730V365Z" fill="#e2d4b5" stroke="#364a4b" stroke-width="8"/>'+
 '<path d="M410 275V208H482V275M565 275V208H637V275" fill="#a65b43" stroke="#2f4347" stroke-width="7"/>'+
 '<path d="M450 205Q425 162 467 125Q510 98 526 60M604 205Q585 158 620 121" fill="none" stroke="#b7b0a4" stroke-width="22" opacity=".48"/>'+
 '<path d="M355 318H708" stroke="#3e585d" stroke-width="10" stroke-dasharray="26 22"/>'+
 '<path d="M0 470L260 446L260 620H0Z" fill="#a17d5d"/><path d="M0 490L260 464" stroke="#e2c69c" stroke-width="8"/>'+
 '<path d="M100 468L113 373L133 373L147 467Z" fill="#182f3a"/><circle cx="124" cy="353" r="23" fill="#263642"/>'+
 '<path d="M89 333H159V344H89Z" fill="#263642"/><path d="M107 310H144L151 333H99Z" fill="#263642"/>'+
 '<path d="M0 560Q230 540 470 566T1000 551" stroke="#a8d1c4" stroke-width="5" fill="none" opacity=".45"/>'+
 '<text x="600" y="345" font-family="Georgia,serif" font-size="31" fill="#273d45" text-anchor="middle">MONGOLIA</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function scene(story,chapter){
 if(story.id==='around-the-world-in-eighty-days-towle') return chapter===0?savilleRowScene():chapter===1?savilleRowInterior():chapter===2?reformClubScene():chapter===3?charingCrossDeparture():chapter===4?exchangeGazetteScene():chapter===5?suezQuaysScene():charingCrossDeparture();
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
