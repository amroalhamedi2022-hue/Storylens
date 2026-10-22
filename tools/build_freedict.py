#!/usr/bin/env python3
"""Deterministic FreeDict 0.6.3 English→Arabic offline-pack builder.

FreeDict data by Arabeyes.org and contributors, GPL-2.0-or-later.
Separate dictionary data is compiled as a distinct JS asset. Do not claim
the dictionary matches the sense in any story without editorial annotation.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import tarfile
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

SOURCE = "https://download.freedict.org/dictionaries/eng-ara/0.6.3/freedict-eng-ara-0.6.3.src.tar.xz"
EXPECTED_SHA512 = "2604f6ce902e719c61fcf391bef02cdbf5eb60f5acd4f601b243933081689c0cfc4e169400f84bdda95a77110d545ddba444739d9d05b6d5d2a12b7aeab1bbd1"
ARABIC = re.compile(r"[\u0600-\u06ff]")
ENGLISH = re.compile(r"^[a-z][a-z' -]{0,75}$")
MAX_GLOSSES = 6

def local(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]

def clean(value: str) -> str:
    return " ".join(value.split())

def extract_dictionary(payload: bytes) -> dict[str,list[str]]:
    root = ET.fromstring(payload)
    results: dict[str,list[str]] = {}
    for entry in root.iter():
        if local(entry.tag) != "entry":
            continue
        forms = [clean("".join(n.itertext())).lower() for n in entry.iter() if local(n.tag) == "orth"]
        forms = [f for f in forms if ENGLISH.fullmatch(f)]
        if not forms:
            continue
        translations: list[str] = []
        for cit in entry.iter():
            if local(cit.tag) != "cit" or cit.attrib.get("type") != "trans":
                continue
            for q in cit.iter():
                if local(q.tag) != "quote":
                    continue
                gloss = clean("".join(q.itertext()))
                if ARABIC.search(gloss) and len(gloss) <= 130 and gloss not in translations:
                    translations.append(gloss)
        # Imported FreeDict datasets occasionally place Arabic equivalents in
        # <def> or direct <quote> without cit. Only use those when no trans found.
        if not translations:
            for n in entry.iter():
                if local(n.tag) not in ("quote", "def"):
                    continue
                gloss = clean("".join(n.itertext()))
                if ARABIC.search(gloss) and len(gloss) <= 130 and gloss not in translations:
                    translations.append(gloss)
        if not translations:
            continue
        for form in forms[:3]:
            current = results.setdefault(form, [])
            for gloss in translations:
                if gloss not in current:
                    current.append(gloss)
                    if len(current) >= MAX_GLOSSES:
                        break
    return results

def render_js(lexicon: dict[str,list[str]]) -> str:
    content = json.dumps(lexicon, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    return ("""/* FreeDict eng-ara v0.6.3 (Arabeyes.org); GPL-2.0-or-later.
 * Data is an independent dictionary pack, NOT story-specific meaning.
 * Sources: https://freedict.org/downloads/ and bundled LICENSE_FREEDICT.txt
 */
(function(global) {
'use strict';
const data = """ + content + """;
const irregular = {was:'be',were:'be',been:'be',is:'be',are:'be',had:'have',has:'have',did:'do',done:'do',went:'go',gone:'go',felt:'feel',found:'find',saw:'see',seen:'see',told:'tell',took:'take',taken:'take',wrote:'write',written:'write',said:'say',made:'make',brought:'bring',caught:'catch',spoke:'speak',spoken:'speak',thought:'think',knew:'know',known:'know',left:'leave',heard:'hear',stood:'stand',built:'build',ran:'run',began:'begin',begun:'begin',lay:'lie'};
function candidates(value) {
 const w=String(value||'').trim().toLowerCase().replace(/\\u2019/g,"'");
 const a=[w,irregular[w]];
 if(w.endsWith("'s")) a.push(w.slice(0,-2));
 if(w.endsWith('ies')) a.push(w.slice(0,-3)+'y');
 if(w.endsWith('ied')) a.push(w.slice(0,-3)+'y');
 if(w.endsWith('es')) a.push(w.slice(0,-2),w.slice(0,-1));
 if(w.endsWith('s')) a.push(w.slice(0,-1));
 for(const suffix of ['ing','ed']){
  if(w.endsWith(suffix)&&w.length>suffix.length+2){
   const stem=w.slice(0,-suffix.length);
   a.push(stem,stem+'e');
   if(stem.length>2 && stem.at(-1)===stem.at(-2)) a.push(stem.slice(0,-1));
  }
 }
 return [...new Set(a.filter(Boolean))];
}
global.FreeDictEnglishArabic = {
 size: Object.keys(data).length,
 resolve: function(surface) {
  for(const key of candidates(surface)) {
   const meanings=data[key];
   if(!meanings)continue;
   return {term:key,literal:meanings.join(' / '),context:meanings.slice(0,3).join(' / '),
    type:'dictionary',note:'معانٍ من FreeDict. اختَر المعنى المناسب للجملة؛ الترجمة السياقية أسفل البطاقة ليست كلمة بكلمة.'};
  }
  return null;
 }
};
})(window);
""")

def build(archive: Path, output: Path, license_out: Path | None) -> dict:
    blob = archive.read_bytes()
    actual = hashlib.sha512(blob).hexdigest()
    if actual != EXPECTED_SHA512:
        raise RuntimeError(f"Source integrity check failed for {archive}: {actual}")
    with tarfile.open(fileobj=__import__('io').BytesIO(blob), mode="r:xz") as tar:
        tei = next((x for x in tar.getmembers() if x.isfile() and x.name.endswith(".tei")), None)
        if tei is None:
            raise RuntimeError("TEI dictionary missing from verified FreeDict source")
        lexicon = extract_dictionary(tar.extractfile(tei).read())
        if len(lexicon) < 15000:
            raise RuntimeError(f"Parser returned only {len(lexicon)} headwords; TEI import is suspect")
        if license_out:
            copying = next((x for x in tar.getmembers() if x.isfile() and x.name.split("/")[-1].upper() in ("COPYING","LICENSE")), None)
            official = tar.extractfile(copying).read().decode("utf8", "replace") if copying else ""
            license_out.parent.mkdir(parents=True,exist_ok=True)
            license_out.write_text(
                "FreeDict English–Arabic dictionary 0.6.3\n"
                "Copyright (C) Arabeyes.org contributors and other authors.\n"
                "Licensed GPL-2.0-or-later; source: " + SOURCE + "\n"
                "SHA-512: " + EXPECTED_SHA512 + "\n"
                "This resource is bundled as independent dictionary data.\n"
                "See full upstream license terms below.\n\n" + official,
                encoding="utf-8"
            )
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(render_js(lexicon),encoding="utf-8")
    return {"headwords":len(lexicon),"bytes":output.stat().st_size,"source":SOURCE,"sha512":actual}

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--archive",default="/tmp/freedict-eng-ara-0.6.3.src.tar.xz")
    p.add_argument("--output",default="app/src/main/assets/freedict-en-ar.js")
    p.add_argument("--license",default="app/src/main/assets/LICENSE_FREEDICT.txt")
    p.add_argument("--fetch",action="store_true")
    args=p.parse_args()
    archive=Path(args.archive)
    if args.fetch and not archive.exists():
        with urllib.request.urlopen(SOURCE,timeout=40) as r:
            data=r.read(10_000_000)
        archive.write_bytes(data)
    print(json.dumps(build(archive,Path(args.output),Path(args.license)),ensure_ascii=False))

if __name__=="__main__":
    main()
