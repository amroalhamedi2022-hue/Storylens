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
function consularLedgerScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Victorian consulate desk with passport, official seal and detective magnifying glass">'+
 '<defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#d8d0bb"/><stop offset="1" stop-color="#8f9c96"/></linearGradient><linearGradient id="desk" x2="0" y2="1"><stop stop-color="#7b4d3b"/><stop offset="1" stop-color="#3c3032"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#wall)"/><path d="M0 0H1000V72H0Z" fill="#243b45"/><path d="M105 72V360M895 72V360" stroke="#a18a61" stroke-width="12"/><rect x="130" y="105" width="740" height="250" fill="#e7e0ca" stroke="#43555a" stroke-width="12"/><path d="M165 145H835M165 180H835M165 215H835" stroke="#b9b39f" stroke-width="4"/>'+
 '<path d="M0 385L1000 355V620H0Z" fill="url(#desk)"/><path d="M0 432L1000 402M0 487L1000 457M0 542L1000 512" stroke="#c28b60" stroke-width="5" opacity=".5"/>'+
 '<g transform="translate(250 270) rotate(-8)"><rect x="0" y="0" width="300" height="188" rx="8" fill="#263f4a" stroke="#d6bd82" stroke-width="8"/><rect x="22" y="20" width="256" height="148" rx="4" fill="#e8ddbd"/><path d="M42 50H255M42 75H230M42 100H250M42 125H180" stroke="#61716c" stroke-width="5"/><circle cx="226" cy="127" r="24" fill="none" stroke="#9b4b3c" stroke-width="5"/><path d="M212 127L222 137L241 113" fill="none" stroke="#9b4b3c" stroke-width="5"/></g>'+
 '<g transform="translate(690 240) rotate(14)"><circle cx="0" cy="0" r="84" fill="#c6d9d4" fill-opacity=".42" stroke="#293e49" stroke-width="20"/><circle cx="0" cy="0" r="65" fill="none" stroke="#e9c88a" stroke-width="5"/><path d="M58 60L132 135" stroke="#293e49" stroke-width="27" stroke-linecap="round"/><path d="M58 60L132 135" stroke="#9e7147" stroke-width="11" stroke-linecap="round"/></g>'+
 '<g transform="translate(600 445)"><rect x="-36" y="-24" width="72" height="52" rx="8" fill="#b34d43" stroke="#ead6aa" stroke-width="5"/><circle r="18" fill="#f0d7a1"/><path d="M-11 0H11M0 -11V11" stroke="#87403a" stroke-width="4"/></g><path d="M0 590H1000" stroke="#e0bd7e" stroke-width="5"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function redSeaDispatchScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Victorian telegraph dispatch desk beside a Red Sea steamship">'+
 '<defs><linearGradient id="dispatch-sky" x2="0" y2="1"><stop stop-color="#123747"/><stop offset="1" stop-color="#d49a62"/></linearGradient><linearGradient id="dispatch-paper" x2="1" y2="1"><stop stop-color="#fff4d8"/><stop offset="1" stop-color="#d5bb8b"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#dispatch-sky)"/><circle cx="810" cy="118" r="62" fill="#f7d49a" opacity=".82"/>'+
 '<path d="M0 340L120 306L235 328L340 296L470 326L590 301L710 330L830 302L1000 328V420H0Z" fill="#bd9b72"/>'+
 '<rect x="0" y="420" width="1000" height="200" fill="#174a58"/><path d="M0 470Q160 450 320 475T650 470T1000 478M0 525Q210 500 410 530T790 522T1000 530" stroke="#8ec2c0" stroke-width="4" opacity=".42" fill="none"/>'+
 '<path d="M510 342L610 342L660 382L455 382Z" fill="#152b35"/><rect x="535" y="280" width="18" height="62" fill="#263b43"/><path d="M544 282L544 208L630 278Z" fill="#f0dfb9" stroke="#203740" stroke-width="5"/><path d="M544 209L544 282L475 282Z" fill="#a33b31"/><rect x="565" y="300" width="24" height="16" fill="#f0d29a"/><path d="M485 342L455 382M610 342L660 382" stroke="#c99b61" stroke-width="6"/>'+
 '<path d="M80 420V370H245V420M105 370V338H220V370" stroke="#f2dfbd" stroke-width="8" fill="none" opacity=".7"/><path d="M80 425L80 445L245 445L245 425" fill="#6b4937" stroke="#2c3535" stroke-width="5"/><path d="M145 445V475M200 445V475" stroke="#d4ae75" stroke-width="7"/>'+
 '<path d="M245 438C320 400 340 360 410 345S510 300 535 286" stroke="#b84035" stroke-width="4" stroke-dasharray="8 8" fill="none"/>'+
 '<rect x="290" y="388" width="190" height="125" rx="4" fill="url(#dispatch-paper)" stroke="#4b4b3e" stroke-width="7" transform="rotate(-7 385 450)"/><path d="M315 420L438 405M320 442L432 428M324 465L408 453" stroke="#52615c" stroke-width="5" opacity=".7"/><circle cx="443" cy="478" r="17" fill="#a33b31"/><path d="M430 478L443 465L456 478L443 491Z" fill="#f0d2a0"/>'+
 '<rect x="98" y="492" width="210" height="24" rx="6" fill="#263b43" stroke="#d6b57a" stroke-width="5"/><circle cx="145" cy="504" r="12" fill="#a33b31"/><path d="M145 504L175 485L210 504" stroke="#d8b77e" stroke-width="6" fill="none"/><path d="M0 572H1000" stroke="#d5bb8b" stroke-width="4" opacity=".55"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


function monsoonMeridianScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="The steamship Mongolia crossing the Indian Ocean toward Bombay beneath a monsoon sky">'+
 '<defs><linearGradient id="monsoon-sky" x2="0" y2="1"><stop stop-color="#142b4a"/><stop offset=".55" stop-color="#557f88"/><stop offset="1" stop-color="#e2b36d"/></linearGradient><linearGradient id="monsoon-sea" x2="0" y2="1"><stop stop-color="#176b75"/><stop offset="1" stop-color="#102d49"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#monsoon-sky)"/><circle cx="780" cy="150" r="68" fill="#f5d99c" opacity=".9"/>'+
 '<path d="M0 320Q150 280 280 320T550 315T820 310T1000 326V620H0Z" fill="url(#monsoon-sea)"/>'+
 '<g fill="none" stroke="#9bd0c7" stroke-width="4" opacity=".55"><path d="M0 390Q130 365 260 392T520 390T780 391T1000 387"/><path d="M0 450Q150 422 300 452T600 449T900 451"/><path d="M0 515Q170 490 340 518T680 516T1000 513"/></g>'+
 '<path d="M0 310L70 284L132 301L200 274L270 304L340 279L420 310L505 292L600 315L680 288L770 309L870 282L1000 312" fill="none" stroke="#f2d5a1" stroke-width="4" opacity=".6"/>'+
 '<path d="M350 360L700 360L770 420L285 420Z" fill="#162b3c" stroke="#d8b16b" stroke-width="7"/><path d="M390 356L420 303L650 303L680 356Z" fill="#d9e2d4" stroke="#17374a" stroke-width="6"/>'+
 '<rect x="465" y="270" width="125" height="33" rx="5" fill="#a74335" stroke="#f1d49a" stroke-width="5"/><rect x="510" y="220" width="18" height="50" fill="#263d4b"/><path d="M519 222L519 165L592 221Z" fill="#f1d9a5" stroke="#263d4b" stroke-width="4"/><path d="M519 165L519 221L465 221Z" fill="#c05a40"/>'+
 '<path d="M312 420L280 448H740L700 420Z" fill="#0e263a"/><path d="M365 445L350 470M660 445L677 470" stroke="#d6b36e" stroke-width="8"/>'+
 '<g transform="translate(145 125)" fill="none" stroke="#f0d7a0" stroke-width="5" opacity=".85"><circle r="64"/><circle r="42"/><path d="M0 -82V82M-82 0H82M-58 -58L58 58M58 -58L-58 58"/></g><path d="M145 43L158 125L145 207L132 125Z" fill="#f0d7a0"/>'+
 '<path d="M0 575Q190 548 370 578T730 575T1000 570" fill="none" stroke="#e0bd7a" stroke-width="5" opacity=".6"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function deccanTimetableScene(){const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Bombay railway platform at eight o’clock, steam locomotive, timetable board and a lost shoe"><defs><linearGradient id="deccan-sky" x2="0" y2="1"><stop stop-color="#d4d6c5"/><stop offset="1" stop-color="#f0d7a4"/></linearGradient><linearGradient id="deccan-engine" x2="0" y2="1"><stop stop-color="#2d6866"/><stop offset="1" stop-color="#173d42"/></linearGradient></defs><rect width="1000" height="620" fill="url(#deccan-sky)"/><path d="M0 390H1000V620H0Z" fill="#b6a17c"/><path d="M0 485H1000M0 510H1000M0 560H1000M0 585H1000" stroke="#4b5d58" stroke-width="5"/><path d="M0 470L1000 530M0 530L1000 470" stroke="#efe1bf" stroke-width="12"/><rect x="66" y="68" width="300" height="180" rx="4" fill="#fbf1d8" stroke="#315b5a" stroke-width="12"/><rect x="85" y="87" width="262" height="142" fill="#e4d4b5" stroke="#b94f38" stroke-width="4"/><text x="216" y="122" text-anchor="middle" font-family="Georgia,serif" font-size="23" fill="#1e4144">BOMBAY</text><path d="M104 137H328" stroke="#b94f38" stroke-width="3"/><text x="216" y="168" text-anchor="middle" font-family="Georgia,serif" font-size="19" fill="#1e4144">CALCUTTA • 08:00</text><text x="216" y="203" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#315b5a">GREAT INDIAN PENINSULA RAILWAY</text><path d="M475 286H810L850 326V452H460V326Z" fill="url(#deccan-engine)" stroke="#172f35" stroke-width="9"/><rect x="530" y="235" width="176" height="65" rx="7" fill="#b94f38" stroke="#f1d8a6" stroke-width="7"/><circle cx="558" cy="455" r="54" fill="#1d3437" stroke="#e5c990" stroke-width="12"/><circle cx="752" cy="455" r="54" fill="#1d3437" stroke="#e5c990" stroke-width="12"/><circle cx="558" cy="455" r="17" fill="#b94f38"/><circle cx="752" cy="455" r="17" fill="#b94f38"/><rect x="588" y="325" width="100" height="66" fill="#e8d7b0" stroke="#b94f38" stroke-width="5"/><path d="M610 325V391M638 325V391M666 325V391" stroke="#315b5a" stroke-width="4"/><path d="M497 265Q450 230 486 197Q516 173 494 147" stroke="#fff7e6" stroke-width="20" opacity=".7" fill="none" stroke-linecap="round"/><path d="M510 257Q555 223 533 194" stroke="#fff7e6" stroke-width="13" opacity=".55" fill="none" stroke-linecap="round"/><path d="M120 382H400V398H120Z" fill="#315b5a"/><path d="M143 382V315M376 382V315" stroke="#315b5a" stroke-width="12"/><circle cx="260" cy="312" r="54" fill="#fbf1d8" stroke="#b94f38" stroke-width="9"/><path d="M260 312V274M260 312L290 327" stroke="#1e4144" stroke-width="7" stroke-linecap="round"/><path d="M828 493Q870 475 901 493L917 520Q886 538 849 522Z" fill="#5b3b30" stroke="#e9d2a2" stroke-width="6"/><path d="M848 490Q850 466 874 470L895 487" fill="none" stroke="#5b3b30" stroke-width="13"/><path d="M0 606H1000" stroke="#b94f38" stroke-width="8"/></svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function kholbyCrossingScene(){const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Kholby forest clearing, unfinished railway, elephant and travel howdahs"><defs><linearGradient id="kholby-canopy" x2="0" y2="1"><stop stop-color="#173c34"/><stop offset="1" stop-color="#6e7c4d"/></linearGradient><linearGradient id="kholby-hide" x2="0" y2="1"><stop stop-color="#b8a078"/><stop offset="1" stop-color="#71684e"/></linearGradient></defs><rect width="1000" height="620" fill="#132c28"/><path d="M0 0H1000V245Q850 185 720 242T420 230T0 250Z" fill="url(#kholby-canopy)"/><g fill="#0b201d" opacity=".8"><path d="M0 0H100L74 300H30Z"/><path d="M140 0H205L180 325H150Z"/><path d="M790 0H850L890 315H830Z"/><path d="M930 0H1000V330L965 290Z"/></g><g stroke="#b8c28b" stroke-width="3" opacity=".28" fill="none"><path d="M0 90Q240 10 440 95T1000 70"/><path d="M0 130Q250 45 500 145T1000 120"/><path d="M0 175Q260 80 520 190T1000 170"/></g><path d="M0 360Q250 305 500 360T1000 330V620H0Z" fill="#7c8153"/><path d="M0 470H360M0 495H360M0 525H360" stroke="#d3b16d" stroke-width="7"/><path d="M40 452L110 520M145 452L215 520M250 452L320 520" stroke="#342f27" stroke-width="9"/><path d="M340 0V360M390 0V335M340 70L390 70M340 130L390 130M340 190L390 190" stroke="#243e34" stroke-width="13"/><rect x="58" y="65" width="245" height="125" rx="3" fill="#efe4c7" stroke="#d29a48" stroke-width="9"/><text x="180" y="105" text-anchor="middle" font-family="Georgia,serif" font-size="25" fill="#1b3931">KHOLBY</text><path d="M86 122H274" stroke="#b66f32" stroke-width="4"/><text x="180" y="151" text-anchor="middle" font-family="Georgia,serif" font-size="17" fill="#25483c">RAIL ENDS HERE</text><g transform="translate(430 275)"><ellipse cx="215" cy="155" rx="178" ry="115" fill="url(#kholby-hide)" stroke="#453f31" stroke-width="9"/><path d="M350 125Q405 110 430 150Q445 188 412 225L397 260Q386 282 367 268Q358 255 370 235L379 202Q355 190 337 180Z" fill="#8d8061" stroke="#453f31" stroke-width="9"/><ellipse cx="395" cy="154" rx="43" ry="48" fill="#b8a078" stroke="#453f31" stroke-width="8"/><path d="M410 182Q426 219 407 252" fill="none" stroke="#453f31" stroke-width="13" stroke-linecap="round"/><circle cx="410" cy="146" r="6" fill="#111f1b"/><path d="M374 119Q337 65 307 109Q320 147 365 151" fill="#c5b28c" stroke="#453f31" stroke-width="7"/><path d="M90 210L73 300M190 220L177 302M292 218L305 300" stroke="#453f31" stroke-width="25" stroke-linecap="round"/><path d="M130 48L165 8H260L300 48V88H130Z" fill="#d29a48" stroke="#342e25" stroke-width="8"/><path d="M145 48V86M185 48V86M225 48V86M265 48V86" stroke="#6a4b2f" stroke-width="5"/><path d="M165 8L184 -18H241L260 8" fill="#e7d5a7" stroke="#6a4b2f" stroke-width="7"/></g><path d="M650 550Q760 500 1000 540" stroke="#d29a48" stroke-width="4" fill="none"/><text x="830" y="586" text-anchor="middle" font-family="Georgia,serif" font-size="20" fill="#f0e4c4">THE DECCAN FOREST ROUTE</text></svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function vindhyaPassageScene(){const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Elephant path through the Vindhya forest with distant procession silhouettes">'+
'<defs><linearGradient id="vpSky" x2="0" y2="1"><stop stop-color="#d9c58f"/><stop offset="1" stop-color="#6c8060"/></linearGradient><linearGradient id="vpEarth" x2="1" y2="1"><stop stop-color="#b77a43"/><stop offset="1" stop-color="#4d5e42"/></linearGradient></defs><rect width="1000" height="620" fill="url(#vpSky)"/><circle cx="790" cy="110" r="64" fill="#f3dfaa" opacity=".72"/><path d="M0 355Q120 170 260 310T510 280T760 300T1000 240V620H0Z" fill="#4c664d"/><path d="M0 405Q140 270 300 390T610 350T1000 370V620H0Z" fill="#344d3d"/><path d="M0 620L150 480L290 510L420 430L560 500L690 410L850 475L1000 430V620Z" fill="url(#vpEarth)"/><path d="M0 550Q210 480 340 560T640 540T1000 510" fill="none" stroke="#e9ce8c" stroke-width="18" opacity=".9"/><path d="M0 585Q230 520 360 590T680 565T1000 545" fill="none" stroke="#6a4b35" stroke-width="5"/><g fill="#243a2e" stroke="#d5b16b" stroke-width="6"><path d="M75 355L125 160L175 355Z"/><path d="M190 370L245 125L300 370Z"/><path d="M720 345L775 130L830 345Z"/><path d="M850 355L905 170L960 355Z"/></g><g fill="#d8c18b" opacity=".95"><circle cx="125" cy="160" r="16"/><circle cx="245" cy="125" r="16"/><circle cx="775" cy="130" r="16"/><circle cx="905" cy="170" r="16"/></g><g transform="translate(345 335)"><ellipse cx="135" cy="92" rx="142" ry="82" fill="#554a37" stroke="#2b342d" stroke-width="10"/><ellipse cx="242" cy="57" rx="58" ry="62" fill="#6d6045" stroke="#2b342d" stroke-width="9"/><path d="M273 77Q298 130 279 167Q264 186 251 164L250 127" fill="#c0ac7b" stroke="#2b342d" stroke-width="10" stroke-linecap="round"/><ellipse cx="222" cy="50" rx="34" ry="39" fill="#b39d6d" stroke="#2b342d" stroke-width="8"/><circle cx="250" cy="44" r="6" fill="#17251d"/><path d="M203 74L170 95L200 106" fill="#f0d9a2" stroke="#2b342d" stroke-width="6"/><path d="M50 146L43 232L81 232L96 159M165 156L160 232L200 232L207 150" fill="#403a2c" stroke="#2b342d" stroke-width="8"/><path d="M70 35Q132 -5 198 31L205 64H65Z" fill="#a34f32" stroke="#2b342d" stroke-width="7"/><path d="M85 33L112 61L139 31L166 60L191 31" fill="none" stroke="#e7cc86" stroke-width="6"/></g><g fill="#293b30"><path d="M660 420L680 335L700 420Z"/><path d="M710 420L730 330L750 420Z"/><path d="M760 420L780 340L800 420Z"/></g><path d="M655 337H807" stroke="#e8d7aa" stroke-width="5"/><text x="800" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="23" letter-spacing="4" fill="#f4e7c5">VINDHYA PASSAGE</text></svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function dawnEscapeScene(){const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Four travelers escaping through a forest at dawn, with the Pillaji temple in the distance">'+
'<defs><linearGradient id="deSky" x2="0" y2="1"><stop stop-color="#171c35"/><stop offset=".62" stop-color="#5c4255"/><stop offset="1" stop-color="#f2b66b"/></linearGradient><linearGradient id="deGround" x2="0" y2="1"><stop stop-color="#29344a"/><stop offset="1" stop-color="#151a2c"/></linearGradient></defs>'+
'<rect width="1000" height="620" fill="url(#deSky)"/><circle cx="795" cy="205" r="76" fill="#ffe0a2" opacity=".78"/><path d="M0 335L90 245L170 325L260 215L355 340L465 225L560 330L670 215L760 325L865 235L1000 330V620H0Z" fill="#292a43"/>'+
'<path d="M0 405Q160 340 330 415T660 405T1000 390V620H0Z" fill="#1f2b3c"/><path d="M0 510Q170 440 330 520T690 500T1000 485V620H0Z" fill="url(#deGround)"/>'+
'<g fill="#171b2e" stroke="#d49a55" stroke-width="5"><path d="M350 315V245H385V315M342 245L367 205L392 245Z"/><path d="M405 315V255H430V315M398 255L417 222L437 255Z"/><path d="M340 270H440M355 287H425"/></g>'+
'<path d="M0 445L65 230L130 445M95 450L170 180L245 450M780 445L850 195L920 445M860 455L945 235L1000 420" fill="#141a2d" stroke="#242c42" stroke-width="12"/>'+
'<path d="M0 550Q200 490 360 560T690 535T1000 515" fill="none" stroke="#f2b66b" stroke-width="9" opacity=".9"/>'+
'<g fill="#101728" stroke="#f2b66b" stroke-width="4"><ellipse cx="560" cy="490" rx="84" ry="44"/><path d="M615 468Q642 440 665 461L677 488L654 501L630 485Z"/><path d="M646 485Q660 508 649 526M680 489Q699 506 691 523M514 518L503 559M584 520L589 559M530 460Q510 430 531 413L555 430L565 462Z"/><circle cx="548" cy="411" r="14"/><path d="M548 427L544 466L520 487M545 445L573 463"/><circle cx="705" cy="453" r="12"/><path d="M705 466L702 505L686 531M702 483L726 497"/><circle cx="742" cy="461" r="11"/><path d="M742 472L740 508L756 530M740 486L720 501"/></g>'+
'<path d="M0 590H1000" stroke="#f2b66b" stroke-width="3" opacity=".55"/><text x="800" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="22" letter-spacing="4" fill="#ffe8c3">DAWN ESCAPE</text></svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function gangesPanoramaScene(){const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Ganges river valley and railway panorama"><defs><linearGradient id="gpSky" x2="0" y2="1"><stop stop-color="#d8e7d9"/><stop offset=".55" stop-color="#9dc8bd"/><stop offset="1" stop-color="#e8c88b"/></linearGradient><linearGradient id="gpRiver" x2="1" y2="0"><stop stop-color="#176a78"/><stop offset=".5" stop-color="#49a3a0"/><stop offset="1" stop-color="#165567"/></linearGradient></defs><rect width="1000" height="620" fill="url(#gpSky)"/><circle cx="795" cy="120" r="58" fill="#f7e2a5" opacity=".88"/><path d="M0 300L105 170L205 275L335 125L455 280L580 155L700 280L835 145L1000 295V620H0Z" fill="#557b69" opacity=".78"/><path d="M0 360Q155 310 300 370T600 350T1000 365V620H0Z" fill="#8a9c71"/><path d="M-40 425C140 355 230 500 400 432S680 385 790 454S950 480 1040 410V620H-40Z" fill="url(#gpRiver)" stroke="#d8e7c9" stroke-width="8"/><path d="M-20 463C150 393 240 535 405 466S690 420 800 486S960 512 1030 445M-20 510C140 445 245 575 420 510S700 462 810 530S960 555 1030 490" fill="none" stroke="#b9e2d3" stroke-width="5" opacity=".75"/><g fill="#e8d9ad" stroke="#496b60" stroke-width="5"><path d="M100 360V300H170V360M90 300L135 260L180 300Z"/><path d="M205 365V320H260V365M198 320L232 285L267 320Z"/><path d="M760 350V282H825V350M750 282L792 238L835 282Z"/></g><g fill="#203c3c" stroke="#e6c37c" stroke-width="5"><path d="M100 240H510V320H100Z"/><path d="M130 240V205H170V240M205 240V205H245V240M280 240V205H320V240M355 240V205H395V240M430 240V205H470V240"/><path d="M95 320H520M120 335H500" fill="none" stroke-width="7"/><rect x="135" y="270" width="50" height="28" fill="#d9e7d4"/><rect x="215" y="270" width="50" height="28" fill="#d9e7d4"/><rect x="295" y="270" width="50" height="28" fill="#d9e7d4"/><rect x="375" y="270" width="50" height="28" fill="#d9e7d4"/></g><path d="M0 575Q200 545 390 575T780 570T1000 565" fill="none" stroke="#f6e1ad" stroke-width="4"/><text x="760" y="592" text-anchor="middle" font-family="Georgia,serif" font-size="23" letter-spacing="4" fill="#f8f0d5">GANGES PANORAMA</text></svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}

function calcuttaCourtScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Calcutta courtroom with judge, evidence shoes, banknotes and a steamer">'+
 '<defs><linearGradient id="court-wall" x2="0" y2="1"><stop stop-color="#392a39"/><stop offset="1" stop-color="#171d2c"/></linearGradient><linearGradient id="court-paper" x2="1" y2="1"><stop stop-color="#fff1d4"/><stop offset="1" stop-color="#d9bd86"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#court-wall)"/><path d="M0 72H1000M0 100H1000" stroke="#c7a76b" stroke-width="5"/>'+
 '<g fill="#5b3a4b" stroke="#d8b77a" stroke-width="8"><path d="M82 100H150V390H82Z"/><path d="M850 100H918V390H850Z"/><path d="M185 100H235V390H185Z"/><path d="M765 100H815V390H765Z"/></g>'+
 '<rect x="255" y="122" width="490" height="198" rx="4" fill="#f0dfbd" stroke="#c9a66b" stroke-width="9"/><path d="M285 157H715M285 187H715M285 217H715M285 247H715" stroke="#b5a080" stroke-width="4"/>'+
 '<path d="M0 392H1000V620H0Z" fill="#3b2935"/><path d="M0 435H1000M0 520H1000" stroke="#b9895b" stroke-width="6" opacity=".55"/>'+
 '<path d="M345 300H655V370H345Z" fill="#211d2b" stroke="#d9b77a" stroke-width="8"/><path d="M375 300V260H625V300" fill="#503344" stroke="#d9b77a" stroke-width="7"/>'+
 '<path d="M410 260Q420 218 470 230Q500 205 530 230Q580 218 590 260L570 276H430Z" fill="#1a1d29" stroke="#d8b77a" stroke-width="6"/><path d="M448 247Q500 222 552 247" fill="none" stroke="#f1dfb8" stroke-width="5"/>'+
 '<rect x="90" y="430" width="245" height="118" rx="4" fill="url(#court-paper)" stroke="#c9a66b" stroke-width="7" transform="rotate(-5 212 489)"/><path d="M118 463L295 448M122 488L290 473M128 513L262 501" stroke="#7d6a5a" stroke-width="5"/><circle cx="282" cy="510" r="18" fill="#9b4b4c"/><path d="M271 510L282 499L293 510L282 521Z" fill="#f7e6c3"/>'+
 '<g transform="translate(620 452) rotate(9)"><path d="M0 42Q40 20 84 38L105 66Q70 86 18 70Z" fill="#533b35" stroke="#d7b67a" stroke-width="6"/><path d="M17 37Q18 12 43 15L76 34" fill="none" stroke="#533b35" stroke-width="12"/><path d="M125 54Q165 34 210 53L230 82Q194 102 143 85Z" fill="#69463b" stroke="#d7b67a" stroke-width="6"/><path d="M143 48Q145 23 170 27L201 45" fill="none" stroke="#69463b" stroke-width="12"/></g>'+
 '<g transform="translate(820 300)"><circle cx="0" cy="0" r="65" fill="#f2dfb7" stroke="#c9a66b" stroke-width="9"/><circle cx="0" cy="0" r="48" fill="none" stroke="#9b4b4c" stroke-width="4"/><path d="M0 0V-31M0 0L26 15" stroke="#302330" stroke-width="6" stroke-linecap="round"/></g>'+
 '<path d="M720 588H965L930 562H780Z" fill="#111e2a" stroke="#d9b77a" stroke-width="5"/><path d="M824 560V500H866V560M844 500V474H852V500" fill="#9b4b4c" stroke="#d9b77a" stroke-width="4"/><path d="M835 470Q820 448 842 428Q862 412 867 390" stroke="#e7d8c4" stroke-width="12" opacity=".45" fill="none"/>'+
 '<text x="500" y="580" text-anchor="middle" font-family="Georgia,serif" font-size="26" letter-spacing="5" fill="#f7e8c8">CALCUTTA COURT</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function rangoonPassageScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="The Rangoon steamer crossing jade water toward the Straits of Malacca">'+
 '<defs><linearGradient id="rangoon-sky" x2="0" y2="1"><stop stop-color="#d5c99f"/><stop offset=".58" stop-color="#7db3a7"/><stop offset="1" stop-color="#205b63"/></linearGradient><linearGradient id="rangoon-sea" x2="0" y2="1"><stop stop-color="#347f80"/><stop offset="1" stop-color="#0c3545"/></linearGradient><linearGradient id="rangoon-hull" x2="0" y2="1"><stop stop-color="#233d43"/><stop offset="1" stop-color="#0b202b"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#rangoon-sky)"/><circle cx="775" cy="125" r="70" fill="#f2d99b" opacity=".75"/>'+
 '<path d="M0 310Q145 270 270 310T520 296T780 306T1000 280V620H0Z" fill="#427f78" opacity=".52"/>'+
 '<path d="M0 360Q170 315 330 360T650 350T1000 352V620H0Z" fill="url(#rangoon-sea)"/>'+
 '<path d="M0 420Q160 395 310 420T610 416T1000 420M0 482Q130 460 285 482T580 477T1000 484M0 548Q180 526 350 548T680 544T1000 550" fill="none" stroke="#a8d2bc" stroke-width="4" opacity=".7"/>'+
 '<path d="M0 332L90 260L170 302L250 240L320 310L320 375H0Z" fill="#204e51" opacity=".78"/><path d="M80 296L90 260L110 278M236 270L250 240L273 264" fill="none" stroke="#d2c18e" stroke-width="5"/>'+
 '<g transform="translate(180 0)"><path d="M60 382L670 382L590 470L155 470Z" fill="url(#rangoon-hull)" stroke="#d3b879" stroke-width="7"/><path d="M132 405H600" stroke="#e0c98d" stroke-width="4"/><g fill="#c3a66b"><circle cx="210" cy="435" r="7"/><circle cx="280" cy="435" r="7"/><circle cx="350" cy="435" r="7"/><circle cx="420" cy="435" r="7"/><circle cx="490" cy="435" r="7"/></g>'+
 '<rect x="235" y="305" width="245" height="78" rx="5" fill="#f0e5c8" stroke="#b28b4d" stroke-width="7"/><rect x="265" y="322" width="45" height="31" fill="#1b5861"/><rect x="331" y="322" width="45" height="31" fill="#1b5861"/><rect x="397" y="322" width="45" height="31" fill="#1b5861"/>'+
 '<rect x="345" y="238" width="35" height="67" fill="#293f43" stroke="#d3b879" stroke-width="5"/><path d="M360 238Q330 208 357 180Q386 205 360 238Z" fill="#f1dfb7" opacity=".75"/><path d="M360 238Q405 211 388 190" stroke="#f1dfb7" stroke-width="12" fill="none" opacity=".45"/>'+
 '<path d="M250 305V170M470 305V190" stroke="#d3b879" stroke-width="7"/><path d="M252 180L252 278L330 278Z" fill="#f4edda" stroke="#b28b4d" stroke-width="4"/><path d="M468 198L468 276L405 276Z" fill="#f4edda" stroke="#b28b4d" stroke-width="4"/><path d="M252 180L252 278M468 198L468 276" stroke="#22565c" stroke-width="4"/>'+
 '<path d="M85 386L155 470L60 470Z" fill="#17343d" stroke="#d3b879" stroke-width="5"/></g>'+
 '<path d="M695 245Q760 190 815 225T930 210" fill="none" stroke="#f5e7bf" stroke-width="3" stroke-dasharray="8 11" opacity=".8"/><circle cx="815" cy="225" r="9" fill="#c9a35b"/>'+
 '<rect x="36" y="36" width="928" height="548" rx="28" fill="none" stroke="#f0dfb2" stroke-width="3" opacity=".7"/><text x="500" y="575" text-anchor="middle" font-family="Georgia,serif" font-size="27" letter-spacing="7" fill="#f5ecd4">RANGOON PASSAGE</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function singaporeLanternScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A steamship leaving Singapore beneath a glowing amber lantern and tropical night sky">'+
 '<defs><linearGradient id="sg-night" x2="0" y2="1"><stop stop-color="#16152e"/><stop offset=".55" stop-color="#423052"/><stop offset="1" stop-color="#111b35"/></linearGradient><linearGradient id="sg-water" x2="0" y2="1"><stop stop-color="#6a526d"/><stop offset="1" stop-color="#172b43"/></linearGradient><radialGradient id="sg-lantern"><stop stop-color="#ffd28a" stop-opacity=".95"/><stop offset=".25" stop-color="#f5a04a" stop-opacity=".45"/><stop offset="1" stop-color="#f5a04a" stop-opacity="0"/></radialGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#sg-night)"/><circle cx="730" cy="160" r="260" fill="url(#sg-lantern)"/><path d="M0 350L85 312L122 330L155 270L188 327L230 300L270 350L270 440H0Z" fill="#101c31"/><path d="M735 345L770 268L804 345L830 300L866 345L900 278L940 345V440H735Z" fill="#101c31"/>'+
 '<path d="M0 380Q180 350 360 385T700 375T1000 380V620H0Z" fill="url(#sg-water)"/><path d="M0 435Q180 410 360 438T710 430T1000 438M0 500Q160 475 340 505T700 497T1000 503M0 565Q200 540 410 567T760 560T1000 565" stroke="#e9b66b" stroke-width="3" fill="none" opacity=".45"/>'+
 '<g fill="#10162b" stroke="#e8b36a" stroke-width="5"><path d="M175 390H745L674 470H260Z"/><path d="M305 390V300H570V390Z"/><path d="M350 300V245H390V300M455 300V225H495V300M530 300V260H555V300"/><path d="M380 245Q360 218 386 194Q414 220 390 245Z" fill="#f6a44f" stroke="none"/><path d="M475 225Q455 198 480 174Q506 198 485 225Z" fill="#f6a44f" stroke="none"/><path d="M285 390V205M615 390V245" fill="none"/><path d="M287 212L287 345L375 345Z" fill="#f0d8ac"/><path d="M613 252L613 345L545 345Z" fill="#f0d8ac"/></g>'+
 '<g stroke="#e3b56e" stroke-width="8" fill="none"><path d="M70 420Q62 300 88 200M88 200Q45 180 35 148M88 200Q130 180 144 145M88 235Q55 230 38 205M88 235Q126 218 151 190"/><path d="M925 420Q930 310 900 230M900 230Q860 200 850 172M900 230Q942 202 960 174"/></g>'+
 '<circle cx="730" cy="160" r="34" fill="#ffd58d" stroke="#f2a24e" stroke-width="8"/><path d="M730 126V194M696 160H764M706 136L754 184M754 136L706 184" stroke="#a95043" stroke-width="4"/>'+
 '<rect x="30" y="30" width="940" height="560" rx="8" fill="none" stroke="#e8b36a" stroke-width="2" stroke-dasharray="5 10" opacity=".65"/><text x="500" y="570" text-anchor="middle" font-family="Georgia,serif" font-size="28" letter-spacing="7" fill="#ffe1a8">SINGAPORE LANTERN · XVII</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function typhoonTimetableScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="The Rangoon crossing storm waves toward Hong Kong with a brass route chart and warning beacon">'+
 '<defs><linearGradient id="typhoon-sky" x2="0" y2="1"><stop stop-color="#182635"/><stop offset=".62" stop-color="#52616c"/><stop offset="1" stop-color="#d2b985"/></linearGradient><linearGradient id="typhoon-sea" x2="0" y2="1"><stop stop-color="#526d7c"/><stop offset="1" stop-color="#142b3b"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#typhoon-sky)"/><path d="M0 110L190 0M170 170L420 0M480 155L710 0M700 190L940 0" stroke="#e6edf0" stroke-width="9" opacity=".22"/>'+
 '<path d="M0 285Q100 230 205 285T415 270T630 280T850 250T1000 275V620H0Z" fill="#536d7a"/><path d="M0 350Q100 285 205 350T415 332T630 350T850 315T1000 345V620H0Z" fill="url(#typhoon-sea)"/>'+
 '<path d="M0 390Q110 350 230 390T455 382T680 392T1000 375M0 460Q130 418 260 460T520 452T770 462T1000 447M0 530Q160 492 320 530T630 520T1000 515" fill="none" stroke="#d5dfe0" stroke-width="5" opacity=".6"/>'+
 '<g transform="translate(115 0)"><path d="M110 365H670L600 445H185Z" fill="#142532" stroke="#e4c77b" stroke-width="8"/><path d="M190 365V285H525V365Z" fill="#283f4c" stroke="#e4c77b" stroke-width="6"/><path d="M250 285V205M455 285V220" stroke="#e4c77b" stroke-width="7"/><path d="M252 210L252 274L330 274Z" fill="#e8e5d8"/><path d="M453 225L453 274L400 274Z" fill="#e8e5d8"/><rect x="318" y="230" width="40" height="55" fill="#bd554d" stroke="#e4c77b" stroke-width="4"/><circle cx="245" cy="420" r="7" fill="#e4c77b"/><circle cx="330" cy="420" r="7" fill="#e4c77b"/><circle cx="415" cy="420" r="7" fill="#e4c77b"/><circle cx="500" cy="420" r="7" fill="#e4c77b"/></g>'+
 '<path d="M85 92Q260 30 430 112T750 95T930 130" fill="none" stroke="#e6c56f" stroke-width="5" stroke-dasharray="12 12"/><circle cx="430" cy="112" r="13" fill="#c75b4d" stroke="#f4d98c" stroke-width="5"/><circle cx="750" cy="95" r="13" fill="#c75b4d" stroke="#f4d98c" stroke-width="5"/>'+
 '<g transform="translate(820 180)"><circle r="76" fill="#172b3b" stroke="#e4c77b" stroke-width="6"/><circle r="54" fill="none" stroke="#e4c77b" stroke-width="3"/><path d="M0 -48V48M-48 0H48M-34 -34L34 34M34 -34L-34 34" stroke="#e4c77b" stroke-width="3"/><path d="M0 0L22 -27" stroke="#c75b4d" stroke-width="8" stroke-linecap="round"/></g>'+
 '<rect x="28" y="28" width="944" height="564" rx="2" fill="none" stroke="#e4c77b" stroke-width="3" stroke-dasharray="14 8"/><text x="500" y="565" text-anchor="middle" font-family="monospace" font-size="27" letter-spacing="5" fill="#f5eddb">TYPHOON TIMETABLE · XVIII</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


function victoriaHarbourDispatchScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Historic Victoria Harbour at dusk with anchored steamships, hillside lights and a nautical dispatch chart">'+
 '<defs><linearGradient id="vh-sky" x2="0" y2="1"><stop stop-color="#122a48"/><stop offset=".56" stop-color="#3d6d91"/><stop offset="1" stop-color="#d9a47d"/></linearGradient><linearGradient id="vh-water" x2="0" y2="1"><stop stop-color="#4c7b99"/><stop offset="1" stop-color="#102a47"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#vh-sky)"/><circle cx="770" cy="132" r="70" fill="#f4d18a" opacity=".8"/>'+
 '<path d="M0 335L85 280L135 302L205 220L260 270L320 185L385 250L450 205L505 300L575 255L650 322L720 285L785 330L860 250L920 292L1000 240V440H0Z" fill="#17334f"/>'+
 '<g fill="#f4d18a" opacity=".88"><circle cx="122" cy="310" r="4"/><circle cx="216" cy="268" r="4"/><circle cx="322" cy="230" r="4"/><circle cx="385" cy="276" r="4"/><circle cx="503" cy="320" r="4"/><circle cx="651" cy="344" r="4"/><circle cx="806" cy="309" r="4"/><circle cx="899" cy="285" r="4"/></g>'+
 '<path d="M0 365Q120 344 245 370T500 365T755 372T1000 360V620H0Z" fill="url(#vh-water)"/><path d="M0 435Q160 415 320 438T640 430T1000 437M0 505Q160 486 320 509T640 501T1000 508M0 570Q180 553 360 575T720 566T1000 571" fill="none" stroke="#b9d2dc" stroke-width="4" opacity=".45"/>'+
 '<g transform="translate(95 0)" stroke="#f2d18a" stroke-width="5"><path d="M65 370H310L278 414H105Z" fill="#102744"/><rect x="115" y="325" width="125" height="45" fill="#244f78"/><path d="M150 325V245M212 325V265" fill="none"/><path d="M151 250L151 312L198 312Z" fill="#f4efe3" stroke="none"/><path d="M212 269L212 312L180 312Z" fill="#d85e4b" stroke="none"/></g>'+
 '<g transform="translate(505 0)" stroke="#f2d18a" stroke-width="5"><path d="M20 380H320L285 425H62Z" fill="#102744"/><rect x="95" y="333" width="142" height="47" fill="#244f78"/><path d="M135 333V248M208 333V273" fill="none"/><path d="M136 252L136 320L188 320Z" fill="#f4efe3" stroke="none"/><path d="M208 276L208 320L175 320Z" fill="#d85e4b" stroke="none"/><rect x="157" y="292" width="26" height="41" fill="#d85e4b"/></g>'+
 '<path d="M65 115Q250 58 425 112T770 105T935 128" fill="none" stroke="#f1d58e" stroke-width="4" stroke-dasharray="12 10"/><circle cx="425" cy="112" r="12" fill="#d85e4b" stroke="#f4efe3" stroke-width="4"/><circle cx="770" cy="105" r="12" fill="#d85e4b" stroke="#f4efe3" stroke-width="4"/>'+
 '<g transform="translate(835 185)"><circle r="70" fill="#f4efe3" stroke="#d85e4b" stroke-width="7"/><circle r="52" fill="none" stroke="#244f78" stroke-width="3"/><path d="M0 -45V45M-45 0H45M-32 -32L32 32M32 -32L-32 32" stroke="#244f78" stroke-width="3"/><path d="M0 0L23 -24" stroke="#d85e4b" stroke-width="8" stroke-linecap="round"/></g>'+
 '<rect x="26" y="26" width="948" height="568" rx="3" fill="none" stroke="#f1d58e" stroke-width="3" stroke-dasharray="16 7"/><text x="500" y="568" text-anchor="middle" font-family="Georgia,serif" font-size="27" letter-spacing="5" fill="#fff6df">VICTORIA HARBOUR · XIX</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function shanghaiWindLedgerScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="The pilot boat Tankadere crossing toward Shanghai">'+
 '<defs><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#d6e9df"/><stop offset=".55" stop-color="#8bb8b0"/><stop offset="1" stop-color="#315e68"/></linearGradient><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#f8f0d9"/><stop offset="1" stop-color="#d5c79e"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#paper)"/><path d="M0 285Q130 260 260 288T520 284T780 290T1000 278V620H0Z" fill="url(#sea)"/>'+
 '<g fill="none" stroke="#f4e8c7" stroke-width="3" opacity=".65"><path d="M0 354Q160 330 320 356T640 356T1000 347"/><path d="M0 412Q180 389 360 413T720 410T1000 407"/><path d="M0 484Q190 461 380 485T760 483T1000 478"/></g>'+
 '<path d="M140 225Q245 204 338 225T520 223T700 225T865 214" stroke="#b17a4d" stroke-width="4" stroke-dasharray="10 12" fill="none"/>'+
 '<g transform="translate(472 252)"><path d="M-170 76L-130 126L142 126L194 76Z" fill="#1e3d48" stroke="#f8f0d9" stroke-width="7"/><path d="M-12 76V-145M85 76V-112" stroke="#1e3d48" stroke-width="9"/><path d="M-2 -132L-2 55L-124 55Z" fill="#fff7df" stroke="#b17a4d" stroke-width="5"/><path d="M10 -112L10 46L104 46Z" fill="#e9b86e" stroke="#b17a4d" stroke-width="5"/><path d="M93 -98L93 42L168 42Z" fill="#f5e8c8" stroke="#b17a4d" stroke-width="5"/><path d="M-180 76Q-40 108 180 76" fill="none" stroke="#c77b4e" stroke-width="6"/></g>'+
 '<g transform="translate(825 170)"><circle r="70" fill="#f8f0d9" stroke="#1e3d48" stroke-width="6"/><circle r="52" fill="none" stroke="#b17a4d" stroke-width="3"/><path d="M0 -43V43M-43 0H43M-30 -30L30 30M30 -30L-30 30" stroke="#1e3d48" stroke-width="3"/><path d="M0 0L24 -27" stroke="#c77b4e" stroke-width="8" stroke-linecap="round"/><text x="0" y="-82" text-anchor="middle" font-family="Georgia,serif" font-size="17" fill="#1e3d48">N</text></g>'+
 '<path d="M55 55H945V565H55Z" fill="none" stroke="#b17a4d" stroke-width="3" stroke-dasharray="13 8"/>'+
 '<text x="500" y="548" text-anchor="middle" font-family="Georgia,serif" font-size="28" letter-spacing="4" fill="#f8f0d9">TANKADERE · SHANGHAI · XX</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


function typhoonSignalScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="The Tankadere in a typhoon, with a distress flag and signal cannon toward Shanghai">'+
 '<defs><linearGradient id="ts-sky" x2="0" y2="1"><stop stop-color="#101b2a"/><stop offset=".55" stop-color="#526b7b"/><stop offset="1" stop-color="#d6bd7b"/></linearGradient><linearGradient id="ts-sea" x2="0" y2="1"><stop stop-color="#526b7b"/><stop offset="1" stop-color="#101b2a"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#ts-sky)"/><path d="M0 80L180 0M120 170L390 0M390 155L620 0M610 175L850 0M790 200L1000 45" stroke="#e8edf0" stroke-width="8" opacity=".22"/>'+
 '<path d="M0 285Q100 235 210 285T430 275T650 282T850 250T1000 275V620H0Z" fill="#526b7b"/><path d="M0 360Q120 300 240 360T480 350T720 360T1000 345V620H0Z" fill="url(#ts-sea)"/>'+
 '<g fill="none" stroke="#e8edf0" stroke-width="4" opacity=".52"><path d="M0 405Q130 360 260 405T520 400T780 405T1000 394"/><path d="M0 480Q150 435 300 480T600 472T900 480T1000 474"/><path d="M0 548Q170 510 340 548T680 540T1000 543"/></g>'+
 '<g transform="translate(130 0)"><path d="M80 365H640L575 438H160Z" fill="#101f30" stroke="#e2c47b" stroke-width="7"/><path d="M230 365V210M430 365V245" stroke="#e2c47b" stroke-width="7"/><path d="M235 216L235 335L355 335Z" fill="#f4efe4"/><path d="M435 250L435 335L365 335Z" fill="#d65f55"/><path d="M220 210L290 190L305 218L235 236Z" fill="#d65f55" stroke="#e2c47b" stroke-width="4"/><path d="M420 245L490 226L505 254L435 273Z" fill="#f4efe4" stroke="#e2c47b" stroke-width="4"/><rect x="495" y="340" width="78" height="24" rx="8" fill="#d6bd7b" stroke="#101f30" stroke-width="5"/><circle cx="510" cy="352" r="9" fill="#101f30"/></g>'+
 '<path d="M80 105Q240 50 405 112T735 95T930 128" fill="none" stroke="#e2c47b" stroke-width="4" stroke-dasharray="10 12"/><circle cx="405" cy="112" r="12" fill="#d65f55" stroke="#f4efe4" stroke-width="4"/><circle cx="735" cy="95" r="12" fill="#d65f55" stroke="#f4efe4" stroke-width="4"/>'+
 '<g transform="translate(835 185)"><circle r="72" fill="#101f30" stroke="#e2c47b" stroke-width="6"/><circle r="52" fill="none" stroke="#e2c47b" stroke-width="3"/><path d="M0 -44V44M-44 0H44M-31 -31L31 31M31 -31L-31 31" stroke="#e2c47b" stroke-width="3"/><path d="M0 0L22 -27" stroke="#d65f55" stroke-width="8" stroke-linecap="round"/></g>'+
 '<rect x="28" y="28" width="944" height="564" fill="none" stroke="#e2c47b" stroke-width="3" stroke-dasharray="14 8"/><text x="500" y="565" text-anchor="middle" font-family="monospace" font-size="27" letter-spacing="5" fill="#f4efe4">TYPHOON SIGNAL · XXI</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


function yokohamaLanternScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="Yokohama harbour at dusk, a Japanese junk, lantern-lit street and cedar silhouettes">'+
 '<defs><linearGradient id="yl-sky" x2="0" y2="1"><stop stop-color="#18242b"/><stop offset=".55" stop-color="#7e4a42"/><stop offset="1" stop-color="#e2a46a"/></linearGradient><linearGradient id="yl-water" x2="0" y2="1"><stop stop-color="#326d68"/><stop offset="1" stop-color="#102b31"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#yl-sky)"/><circle cx="740" cy="132" r="78" fill="#f1d79c" opacity=".78"/>'+
 '<path d="M0 305L80 240L135 285L200 220L280 290L350 232L430 292L510 250L590 298L660 230L735 292L820 240L900 286L1000 225V420H0Z" fill="#172d32" opacity=".85"/>'+
 '<path d="M0 395Q170 360 320 397T640 388T1000 380V620H0Z" fill="url(#yl-water)"/>'+
 '<path d="M0 455Q160 428 310 457T620 449T1000 440M0 520Q190 493 380 522T760 511T1000 507" fill="none" stroke="#a8d0b5" stroke-width="3" opacity=".45"/>'+
 '<path d="M345 385L365 280L515 280L555 385Z" fill="#17272c" stroke="#d8a76b" stroke-width="6"/><path d="M435 280V185M435 190L355 300H435L500 300Z" fill="#f3d8a1" opacity=".82"/><path d="M442 210L515 300H442Z" fill="#c95c43"/>'+
 '<path d="M300 385H590L548 425H345Z" fill="#241f26" stroke="#d8a76b" stroke-width="6"/><path d="M445 185L445 135" stroke="#f5e5c3" stroke-width="5"/>'+
 '<g stroke="#2a2329" stroke-width="8"><path d="M90 410V235M60 250H120M850 410V220M820 235H880"/></g>'+
 '<g><path d="M54 240Q90 192 126 240Z" fill="#d64e3f" stroke="#f1d79c" stroke-width="5"/><rect x="62" y="240" width="56" height="78" rx="17" fill="#d64e3f" stroke="#f1d79c" stroke-width="5"/><path d="M90 245V312" stroke="#f8e7bf" stroke-width="3"/>'+
 '<path d="M814 225Q850 177 886 225Z" fill="#d64e3f" stroke="#f1d79c" stroke-width="5"/><rect x="822" y="225" width="56" height="84" rx="17" fill="#d64e3f" stroke="#f1d79c" stroke-width="5"/><path d="M850 230V302" stroke="#f8e7bf" stroke-width="3"/></g>'+
 '<g fill="#172d32"><path d="M0 445L55 325L112 445Z"/><path d="M75 445L150 300L220 445Z"/><path d="M780 445L850 295L920 445Z"/><path d="M880 445L940 330L1000 445Z"/></g>'+
 '<path d="M0 565H1000" stroke="#d64e3f" stroke-width="7"/><text x="500" y="594" text-anchor="middle" font-family="Georgia,serif" font-size="27" letter-spacing="5" fill="#f8e7bf">YOKOHAMA LANTERN · XXII</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function paperLanternCircusScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A Japanese travelling circus stage with paper lanterns, acrobats and a stacked human pyramid">'+
 '<defs><linearGradient id="plc-backdrop" x2="0" y2="1"><stop stop-color="#171b3d"/><stop offset=".6" stop-color="#4a1f43"/><stop offset="1" stop-color="#b9483f"/></linearGradient><linearGradient id="plc-floor" x2="0" y2="1"><stop stop-color="#e9bd68"/><stop offset="1" stop-color="#7b2c3e"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#plc-backdrop)"/><path d="M0 0H1000V100Q820 170 670 95T330 95T0 105Z" fill="#b9483f" stroke="#efcf83" stroke-width="7"/>'+
 '<path d="M0 110Q130 175 250 110T500 110T750 110T1000 110" fill="none" stroke="#efcf83" stroke-width="7"/>'+
 '<g stroke="#f0cf85" stroke-width="4"><path d="M125 0V150M290 0V130M710 0V130M875 0V150"/></g>'+
 '<g fill="#efcf85" stroke="#fff0bd" stroke-width="5"><path d="M88 145Q125 100 162 145L153 215H97Z" fill="#e65b4f"/><path d="M253 125Q290 80 327 125L318 195H262Z" fill="#e6a44e"/><path d="M673 125Q710 80 747 125L738 195H682Z" fill="#e65b4f"/><path d="M838 145Q875 100 912 145L903 215H847Z" fill="#e6a44e"/></g>'+
 '<g fill="#f6df9d" opacity=".8"><circle cx="205" cy="75" r="5"/><circle cx="390" cy="55" r="4"/><circle cx="615" cy="65" r="5"/><circle cx="795" cy="70" r="4"/></g>'+
 '<path d="M90 510L180 250H820L910 510Z" fill="#241a39" stroke="#e9bd68" stroke-width="8"/><path d="M155 500L245 300H755L845 500Z" fill="#2d2448" stroke="#c95a4d" stroke-width="7"/>'+
 '<path d="M100 520H900L1000 620H0Z" fill="url(#plc-floor)"/>'+
 '<g fill="#171b3d" stroke="#f0cf85" stroke-width="5"><circle cx="500" cy="285" r="27"/><path d="M476 314L524 314L544 365L456 365Z"/><path d="M458 330L415 295L400 310L455 355M542 330L585 295L600 310L545 355"/><circle cx="430" cy="375" r="22"/><path d="M410 397L450 397L465 438L395 438Z"/><circle cx="570" cy="375" r="22"/><path d="M550 397L590 397L605 438L535 438Z"/></g>'+
 '<g stroke="#f0cf85" stroke-width="5" fill="none"><path d="M350 270Q500 170 650 270"/><path d="M350 270L390 310M650 270L610 310"/></g>'+
 '<g fill="#efcf83"><path d="M368 300L380 332L347 322Z"/><path d="M632 300L620 332L653 322Z"/><path d="M470 435L500 485L530 435Z"/></g>'+
 '<rect x="25" y="25" width="950" height="570" rx="18" fill="none" stroke="#efcf83" stroke-width="3" stroke-dasharray="12 10"/>'+
 '<text x="500" y="578" text-anchor="middle" font-family="Georgia,serif" font-size="28" letter-spacing="4" fill="#fff0bd">PAPER LANTERN CIRCUS · XXIII</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


function pacificMeridianScene(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A nineteenth-century paddle steamer crossing the Pacific toward the Golden Gate headlands">'+
 '<defs><linearGradient id="pm-sky" x2="0" y2="1"><stop stop-color="#d9e6df"/><stop offset=".68" stop-color="#e9d5ad"/><stop offset="1" stop-color="#c58b58"/></linearGradient><linearGradient id="pm-sea" x2="0" y2="1"><stop stop-color="#3b7781"/><stop offset="1" stop-color="#102f42"/></linearGradient></defs>'+
 '<rect width="1000" height="620" fill="url(#pm-sky)"/><circle cx="730" cy="165" r="86" fill="#f6f0d9" opacity=".8"/>'+
 '<path d="M0 330Q115 285 225 333T450 325T690 333T1000 310V620H0Z" fill="url(#pm-sea)"/>'+
 '<path d="M0 365Q120 330 235 369T470 361T710 370T1000 350M0 420Q150 390 290 425T570 418T850 427T1000 414M0 490Q140 465 285 495T570 486T820 497T1000 480" fill="none" stroke="#b7d8cf" stroke-width="5" opacity=".55"/>'+
 '<path d="M0 326L110 245L205 278L290 225L380 319Z" fill="#8b8d77"/><path d="M650 320L735 245L810 270L892 205L1000 300V350Z" fill="#647a72"/>'+
 '<path d="M0 326L110 245L205 278L290 225L380 319M650 320L735 245L810 270L892 205L1000 300" fill="none" stroke="#e9d5ad" stroke-width="6"/>'+
 '<g stroke="#183a4b" stroke-width="7" fill="none"><path d="M425 330V112M510 322V135M590 325V166"/><path d="M425 130L355 245H425ZM425 155L485 244H425ZM510 152L458 260H510ZM510 176L567 260H510ZM590 184L548 275H590Z" fill="#f5ead1" stroke="#9b754b" stroke-width="4"/></g>'+
 '<path d="M300 345L690 345L635 412L370 412Z" fill="#1b3442" stroke="#d3ae75" stroke-width="7"/>'+
 '<rect x="405" y="300" width="178" height="45" rx="5" fill="#f0d7a5" stroke="#9d7446" stroke-width="5"/><rect x="465" y="263" width="58" height="38" fill="#a95f42" stroke="#f0d7a5" stroke-width="4"/>'+
 '<path d="M355 355Q320 380 355 405Q390 380 355 355M645 355Q610 380 645 405Q680 380 645 355" fill="#d8b06e" stroke="#183a4b" stroke-width="7"/>'+
 '<path d="M375 430Q500 455 630 430" fill="none" stroke="#f0d7a5" stroke-width="5" stroke-dasharray="10 12"/>'+
 '<g transform="translate(825 82)"><circle cx="0" cy="0" r="52" fill="#f7f0dc" stroke="#a86b42" stroke-width="5"/><circle cx="0" cy="0" r="37" fill="none" stroke="#2f6570" stroke-width="2"/><path d="M0 -45L7 -7L0 0L-7 -7Z" fill="#a64f39"/><path d="M0 45L7 7L0 0L-7 7Z" fill="#2f6570"/><path d="M-45 0H45M0 -45V45" stroke="#2f6570" stroke-width="2" opacity=".65"/></g>'+
 '<path d="M35 36H270M35 49H230M35 62H190" stroke="#315e66" stroke-width="3" opacity=".5"/>'+
 '<text x="500" y="570" text-anchor="middle" font-family="Georgia,serif" font-size="27" letter-spacing="4" fill="#f5ead1">PACIFIC MERIDIAN · XXIV</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function civicPanoramaScene(){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A nineteenth-century San Francisco waterfront and crowded civic election platform">
 <defs><linearGradient id="cp-paper" x2="0" y2="1"><stop stop-color="#f5e9d1"/><stop offset="1" stop-color="#d7c3a1"/></linearGradient></defs><rect width="1000" height="620" fill="url(#cp-paper)"/><rect x="25" y="25" width="950" height="570" fill="none" stroke="#1d3047" stroke-width="4"/><rect x="38" y="38" width="924" height="544" fill="none" stroke="#b6473d" stroke-width="2"/>
 <path d="M40 390L160 330L230 350L310 280L375 326L455 292L520 350L600 310L690 365L780 300L960 360V500H40Z" fill="#667f87" opacity=".65"/><path d="M40 420L130 395L205 415L275 385L355 420L430 390L500 430L580 400L670 425L770 390L870 420L960 395V520H40Z" fill="#2c5665"/>
 <g fill="#f5e9d1" stroke="#1d3047" stroke-width="5"><path d="M110 335V235H215V335Z"/><path d="M92 235L162 185L232 235Z"/><path d="M260 365V260H350V365Z"/><path d="M245 260L305 218L365 260Z"/><path d="M710 350V238H810V350Z"/><path d="M692 238L760 190L828 238Z"/><path d="M830 380V270H915V380Z"/><path d="M815 270L872 230L930 270Z"/></g>
 <g fill="#1d3047"><rect x="145" y="255" width="18" height="32"/><rect x="180" y="255" width="18" height="32"/><rect x="290" y="282" width="16" height="28"/><rect x="320" y="282" width="16" height="28"/><rect x="740" y="260" width="18" height="30"/><rect x="772" y="260" width="18" height="30"/><rect x="850" y="292" width="16" height="26"/><rect x="878" y="292" width="16" height="26"/></g>
 <g stroke="#1d3047" stroke-width="7" fill="none"><path d="M505 150V405M590 160V405M675 174V405"/><path d="M505 168L450 255H505ZM505 185L560 265H505ZM590 178L540 262H590ZM590 195L645 278H590ZM675 190L625 282H675ZM675 207L730 290H675Z"/></g>
 <path d="M435 400H745L715 438H460Z" fill="#b6473d" stroke="#1d3047" stroke-width="6"/><path d="M460 438H715L695 466H480Z" fill="#1d3047"/><rect x="520" y="330" width="130" height="70" fill="#f5e9d1" stroke="#b6473d" stroke-width="5"/><path d="M535 345H635M535 360H625M535 375H610" stroke="#1d3047" stroke-width="4"/>
 <g stroke="#1d3047" stroke-width="5"><path d="M85 280V400M915 280V400M145 300L195 330M195 300L145 330M860 302L910 332M910 302L860 332"/></g><path d="M85 280L110 292L85 305Z" fill="#b6473d"/><path d="M915 280L940 292L915 305Z" fill="#b6473d"/>
 <g fill="#1d3047"><circle cx="110" cy="470" r="12"/><circle cx="145" cy="455" r="12"/><circle cx="180" cy="474" r="12"/><circle cx="220" cy="458" r="12"/><circle cx="260" cy="475" r="12"/><circle cx="305" cy="457" r="12"/><circle cx="350" cy="474" r="12"/><circle cx="395" cy="456" r="12"/><circle cx="440" cy="474" r="12"/><circle cx="485" cy="456" r="12"/><circle cx="530" cy="474" r="12"/><circle cx="575" cy="456" r="12"/><circle cx="620" cy="474" r="12"/><circle cx="665" cy="456" r="12"/><circle cx="710" cy="474" r="12"/><circle cx="755" cy="456" r="12"/><circle cx="800" cy="474" r="12"/><circle cx="845" cy="456" r="12"/><circle cx="890" cy="474" r="12"/></g>
 <g stroke="#1d3047" stroke-width="4"><path d="M110 482V525M145 467V525M180 486V525M220 470V525M260 487V525M305 469V525M350 486V525M395 468V525M440 486V525M485 468V525M530 486V525M575 468V525M620 486V525M665 468V525M710 486V525M755 468V525M800 486V525M845 468V525M890 486V525"/></g><text x="500" y="552" text-anchor="middle" font-family="Georgia,serif" font-size="27" font-weight="700" letter-spacing="4" fill="#1d3047">CIVIC PANORAMA · XXV</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


function prairieSignalScene(){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A nineteenth-century steam locomotive crossing the Sierra Nevada with buffalo on the prairie">
 <defs><linearGradient id="prairie-sky" x2="0" y2="1"><stop stop-color="#15283a"/><stop offset=".6" stop-color="#536d78"/><stop offset="1" stop-color="#d7b47a"/></linearGradient><linearGradient id="prairie-engine" x2="0" y2="1"><stop stop-color="#324c55"/><stop offset="1" stop-color="#17242c"/></linearGradient><radialGradient id="prairie-lamp"><stop stop-color="#ffe5a4"/><stop offset="1" stop-color="#d66b37" stop-opacity="0"/></radialGradient></defs>
 <rect width="1000" height="620" fill="url(#prairie-sky)"/><circle cx="792" cy="128" r="74" fill="#f2d7a0" opacity=".9"/><circle cx="792" cy="128" r="118" fill="url(#prairie-lamp)" opacity=".55"/>
 <path d="M0 342L105 235L184 294L294 170L378 281L487 198L598 295L700 216L817 310L906 239L1000 324V620H0Z" fill="#314c58"/><path d="M0 391L130 300L235 363L340 259L441 357L560 277L660 369L770 292L900 372L1000 333V620H0Z" fill="#203640"/>
 <path d="M0 424Q200 391 355 431T690 424T1000 410V620H0Z" fill="#7f8c73"/><path d="M0 476L1000 445" stroke="#b7b19a" stroke-width="7"/><path d="M0 496L1000 465" stroke="#25343a" stroke-width="9"/>
 <g stroke="#4b4b43" stroke-width="8"><path d="M60 478l-3 28M140 475l-3 28M220 472l-3 28M300 469l-3 28M380 466l-3 28M460 463l-3 28M540 460l-3 28M620 457l-3 28M700 454l-3 28M780 451l-3 28M860 448l-3 28M940 445l-3 28"/></g>
 <g transform="translate(305 326)"><rect x="0" y="55" width="325" height="77" rx="10" fill="url(#prairie-engine)" stroke="#15232b" stroke-width="5"/><rect x="38" y="10" width="114" height="82" rx="8" fill="#233b44" stroke="#17252d" stroke-width="5"/><rect x="63" y="-8" width="58" height="24" rx="4" fill="#b65e2e"/><rect x="198" y="32" width="70" height="25" fill="#d5b66f" stroke="#1c2a31" stroke-width="4"/><path d="M210 32V-4H251V32" fill="#2d4650" stroke="#17252d" stroke-width="5"/><path d="M20 56H300" stroke="#8aa59b" stroke-width="5"/><circle cx="60" cy="135" r="28" fill="#1b2830" stroke="#d1c2a2" stroke-width="7"/><circle cx="60" cy="135" r="9" fill="#b65e2e"/><circle cx="148" cy="135" r="28" fill="#1b2830" stroke="#d1c2a2" stroke-width="7"/><circle cx="148" cy="135" r="9" fill="#b65e2e"/><circle cx="276" cy="135" r="28" fill="#1b2830" stroke="#d1c2a2" stroke-width="7"/><circle cx="276" cy="135" r="9" fill="#b65e2e"/><path d="M22 45L-2 16L22 10L42 45" fill="#cf6b3a"/><path d="M85 -8Q45 -42 87 -64Q131 -88 98 -122" stroke="#dce3d7" stroke-width="16" fill="none" opacity=".45"/><path d="M95 -12Q74 -45 112 -65" stroke="#dce3d7" stroke-width="9" fill="none" opacity=".3"/></g>
 <g fill="#18282c" stroke="#18282c" stroke-width="5"><path d="M75 424q-18 -35 2 -51l15 5 14 19 14 -2 13 12 -8 17Z"/><path d="M135 420q-13 -28 4 -41l13 4 11 17 13 -1 11 12 -7 12Z"/><path d="M197 416q-14 -30 5 -44l14 5 10 17 13 -1 12 12 -7 12Z"/><path d="M845 411q-18 -35 2 -51l15 5 14 19 14 -2 13 12 -8 17Z"/><path d="M905 407q-13 -28 4 -41l13 4 11 17 13 -1 11 12 -7 12Z"/></g>
 <g fill="#fff0cb" opacity=".9"><circle cx="70" cy="70" r="3"/><circle cx="160" cy="113" r="2"/><circle cx="918" cy="92" r="3"/><circle cx="665" cy="116" r="2"/></g>
 <text x="500" y="562" text-anchor="middle" font-family="Georgia,serif" font-size="27" font-weight="700" letter-spacing="4" fill="#fff3d6">PRAIRIE SIGNAL · XXVI</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


function saltLakeDispatchScene(){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A nineteenth-century train beside the Great Salt Lake and white salt cliffs">
 <defs><linearGradient id="sld-sky" x2="0" y2="1"><stop stop-color="#263b56"/><stop offset=".55" stop-color="#7e9ba7"/><stop offset="1" stop-color="#e7d8b7"/></linearGradient><linearGradient id="sld-lake" x2="0" y2="1"><stop stop-color="#6e9ba5"/><stop offset="1" stop-color="#d4e3dd"/></linearGradient></defs>
 <rect width="1000" height="620" fill="url(#sld-sky)"/><circle cx="790" cy="122" r="67" fill="#f2d79a"/><circle cx="790" cy="122" r="94" fill="none" stroke="#f2d79a" stroke-width="3" opacity=".65"/>
 <path d="M0 330L110 240L190 285L295 205L390 298L485 220L570 306L685 228L790 296L900 214L1000 282V620H0Z" fill="#536b79"/><path d="M0 365L125 315L225 338L335 286L440 352L550 306L665 358L770 300L900 350L1000 318V620H0Z" fill="#344b5d"/>
 <path d="M0 388Q180 356 350 392T690 384T1000 370V620H0Z" fill="url(#sld-lake)"/><path d="M0 425Q170 405 335 429T680 420T1000 405M0 465Q170 447 350 470T700 460T1000 448" stroke="#f4f1e4" stroke-width="4" fill="none" opacity=".7"/>
 <path d="M0 372L110 330L190 347L295 296L390 355L485 310L570 365L685 318L790 354L900 300L1000 336" stroke="#f5efe1" stroke-width="12" fill="none" opacity=".75"/>
 <g transform="translate(170 354)"><path d="M0 100H530L505 130H20Z" fill="#26313d"/><path d="M25 35H370L420 70V100H25Z" fill="#263b4c" stroke="#f1d7a1" stroke-width="5"/><rect x="50" y="0" width="145" height="55" rx="6" fill="#344c5d" stroke="#f1d7a1" stroke-width="5"/><rect x="80" y="12" width="30" height="24" fill="#f3d79b"/><rect x="125" y="12" width="30" height="24" fill="#f3d79b"/><rect x="222" y="48" width="95" height="18" fill="#a96c45"/><circle cx="90" cy="108" r="29" fill="#17232e" stroke="#d8d1c1" stroke-width="7"/><circle cx="90" cy="108" r="9" fill="#b96e43"/><circle cx="210" cy="108" r="29" fill="#17232e" stroke="#d8d1c1" stroke-width="7"/><circle cx="210" cy="108" r="9" fill="#b96e43"/><circle cx="345" cy="108" r="29" fill="#17232e" stroke="#d8d1c1" stroke-width="7"/><circle cx="345" cy="108" r="9" fill="#b96e43"/><path d="M24 35L8 0L36 0L50 35Z" fill="#b96e43"/><path d="M125 -2Q100 -35 135 -65Q162 -87 145 -112" stroke="#e7e6df" stroke-width="13" fill="none" opacity=".45"/></g>
 <path d="M0 532L1000 500" stroke="#263b4c" stroke-width="8"/><path d="M0 550L1000 518" stroke="#f1d7a1" stroke-width="3"/><rect x="28" y="28" width="944" height="564" rx="5" fill="none" stroke="#f1d7a1" stroke-width="3"/><text x="500" y="578" text-anchor="middle" font-family="Georgia,serif" font-size="27" font-weight="700" letter-spacing="4" fill="#263b4c">SALT LAKE DISPATCH · XXVII</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function scene(story,chapter){
 if(story.id==='around-the-world-in-eighty-days-towle') return chapter===0?savilleRowScene():chapter===1?savilleRowInterior():chapter===2?reformClubScene():chapter===3?charingCrossDeparture():chapter===4?exchangeGazetteScene():chapter===5?suezQuaysScene():chapter===6?consularLedgerScene():chapter===7?redSeaDispatchScene():chapter===8?monsoonMeridianScene():chapter===9?deccanTimetableScene():chapter===10?kholbyCrossingScene():chapter===11?vindhyaPassageScene():chapter===12?dawnEscapeScene():chapter===13?gangesPanoramaScene():chapter===14?calcuttaCourtScene():chapter===15?rangoonPassageScene():chapter===16?singaporeLanternScene():chapter===17?typhoonTimetableScene():chapter===18?victoriaHarbourDispatchScene():chapter===19?shanghaiWindLedgerScene():chapter===20?typhoonSignalScene():chapter===21?yokohamaLanternScene():chapter===22?paperLanternCircusScene():chapter===23?pacificMeridianScene():chapter===24?civicPanoramaScene():chapter===25?prairieSignalScene():chapter===27?medicineBowCrossingScene():chapter===26?saltLakeDispatchScene():charingCrossDeparture();
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

function medicineBowCrossingScene(){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A steam train crossing a damaged suspension bridge above a snowy river">
 <defs><linearGradient id="mbc-sky" x2="0" y2="1"><stop stop-color="#273645"/><stop offset=".58" stop-color="#93a8b5"/><stop offset="1" stop-color="#edf2f4"/></linearGradient><linearGradient id="mbc-water" x2="0" y2="1"><stop stop-color="#6c8798"/><stop offset="1" stop-color="#dbe5ea"/></linearGradient></defs>
 <rect width="1000" height="620" fill="url(#mbc-sky)"/><circle cx="780" cy="110" r="48" fill="#e4c77e" opacity=".9"/>
 <path d="M0 245L115 150L205 218L335 105L438 220L555 130L675 223L810 115L930 220L1000 174V620H0Z" fill="#647a89"/>
 <path d="M0 310L160 238L278 282L400 226L520 286L670 220L800 278L910 235L1000 268V620H0Z" fill="#344858"/>
 <path d="M0 438Q170 402 340 435T670 426T1000 410V620H0Z" fill="url(#mbc-water)"/>
 <path d="M0 490Q150 462 310 488T650 478T1000 465M0 530Q160 510 320 531T690 520T1000 512" stroke="#f8fbfc" stroke-width="4" opacity=".7" fill="none"/>
 <path d="M115 312L885 312M150 290L150 382M850 290L850 382M150 290Q500 62 850 290" stroke="#d8b56b" stroke-width="5" fill="none"/>
 <path d="M150 290L230 312L310 330L390 342L470 348L550 347L630 337L710 322L790 305L850 290" stroke="#273645" stroke-width="4" fill="none"/>
 <path d="M150 312V395M230 312V400M310 330V405M390 342V409M470 348V412M550 347V410M630 337V407M710 322V402M790 305V396M850 312V388" stroke="#d8b56b" stroke-width="2"/>
 <path d="M150 395L850 388" stroke="#273645" stroke-width="9"/><path d="M150 409L850 402" stroke="#c64235" stroke-width="4"/>
 <g transform="translate(355 315)"><rect x="0" y="0" width="250" height="72" rx="5" fill="#233342" stroke="#e7edf0" stroke-width="3"/><rect x="22" y="-34" width="78" height="36" fill="#c64235" stroke="#233342" stroke-width="3"/><rect x="36" y="-26" width="22" height="18" fill="#e8edf0"/><rect x="66" y="-26" width="22" height="18" fill="#e8edf0"/><rect x="112" y="15" width="30" height="26" fill="#e4c77e"/><rect x="155" y="15" width="30" height="26" fill="#e4c77e"/><rect x="198" y="15" width="30" height="26" fill="#e4c77e"/><circle cx="48" cy="78" r="18" fill="#273645" stroke="#e7edf0" stroke-width="4"/><circle cx="205" cy="78" r="18" fill="#273645" stroke="#e7edf0" stroke-width="4"/><path d="M10 8L-18 -18M-18 -18L-34 -8" stroke="#f9fbfc" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>
 <path d="M74 255V330" stroke="#273645" stroke-width="10"/><rect x="52" y="240" width="44" height="40" rx="3" fill="#c64235" stroke="#f9fbfc" stroke-width="3"/><circle cx="74" cy="260" r="9" fill="#f9fbfc"/>
 <path d="M75 338L92 355M90 339L74 357" stroke="#c64235" stroke-width="5"/><path d="M640 160L672 188M672 160L640 188" stroke="#f9fbfc" stroke-width="3" opacity=".8"/>
 <text x="500" y="575" text-anchor="middle" font-family="ui-monospace,monospace" font-size="25" font-weight="700" letter-spacing="3" fill="#f9fbfc">MEDICINE BOW CROSSING · XXVIII</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

global.StoryLensMakeEditorialArt=function(stories){
 const assets={};
 for(const s of stories)for(let c=0;c<s.chapters.length;c++)assets[s.id+'_'+c]=scene(s,c);
 return assets;
};
})(window);
