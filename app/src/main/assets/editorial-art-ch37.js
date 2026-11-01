/* Lingua Tales — original offline illustration for the final Towle chapter. */
(function(global){
'use strict';
const base=global.StoryLensMakeEditorialArt;
if(typeof base!=='function')throw Error('editorial-art.js and Chapter XXXVI art must load before Chapter XXXVII art');
global.StoryLensMakeEditorialArt=function(stories){
 const assets=base(stories);
 const story=(stories||[]).find(s=>s.id==='around-the-world-in-eighty-days-towle');
 if(story&&story.chapters.length>=37){
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="A copper compass and a route circling a globe, marking the end of the journey"><defs><linearGradient id="me-night" x2="0" y2="1"><stop stop-color="#102f2c"/><stop offset="1" stop-color="#071b1a"/></linearGradient><radialGradient id="me-globe"><stop stop-color="#e7d7b8"/><stop offset="1" stop-color="#9baf91"/></radialGradient><linearGradient id="me-copper" x2="1" y2="1"><stop stop-color="#f2c58b"/><stop offset="1" stop-color="#a95f3a"/></linearGradient></defs><rect width="1000" height="620" fill="url(#me-night)"/><g fill="none" stroke="#b5c8b5" stroke-opacity=".18"><path d="M0 80H1000M0 160H1000M0 240H1000M0 320H1000M0 400H1000M0 480H1000M0 560H1000"/><path d="M100 0V620M200 0V620M300 0V620M400 0V620M500 0V620M600 0V620M700 0V620M800 0V620M900 0V620"/></g><circle cx="505" cy="305" r="220" fill="url(#me-globe)" stroke="url(#me-copper)" stroke-width="9"/><g fill="none" stroke="#416b5c" stroke-width="4" opacity=".8"><ellipse cx="505" cy="305" rx="220" ry="74"/><ellipse cx="505" cy="305" rx="105" ry="220"/><ellipse cx="505" cy="305" rx="172" ry="220" transform="rotate(35 505 305)"/><ellipse cx="505" cy="305" rx="172" ry="220" transform="rotate(-35 505 305)"/><path d="M285 305H725M505 85V525"/></g><path d="M338 402C390 155 600 148 668 262S625 448 518 428 408 320 470 245 605 224 650 288" fill="none" stroke="#a95f3a" stroke-width="10" stroke-linecap="round" stroke-dasharray="15 10"/><g transform="translate(765 145)"><circle r="82" fill="#0a211f" stroke="#d39a64" stroke-width="5"/><circle r="63" fill="none" stroke="#f2c58b" stroke-width="2"/><path d="M0-55L12-8 0 0-12-8Z" fill="#f2c58b"/><path d="M0 55L-12 8 0 0 12 8Z" fill="#a95f3a"/><path d="M-55 0L-8-12 0 0-8 12ZM55 0L8 12 0 0 8-12Z" fill="#c5d5b9"/></g><rect x="190" y="535" width="620" height="54" rx="27" fill="#0a211f" stroke="#d39a64" stroke-width="2"/><text x="500" y="570" text-anchor="middle" font-family="Georgia,serif" font-size="25" font-weight="700" letter-spacing="5" fill="#f3e8d2">THE LAST MERIDIAN</text></svg>';
  assets[story.id+'_36']='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 }
 return assets;
};
})(window);
