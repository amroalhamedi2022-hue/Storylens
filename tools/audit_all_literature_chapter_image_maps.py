#!/usr/bin/env python3
"""Fail-closed, read-only audit of every original literature chapter-image map."""
import argparse,hashlib,json,re
from pathlib import Path,PurePosixPath
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]
def audit(root):
    maps=sorted((root/"docs/literature/staging").rglob("chapter-image-map.json"))
    if not maps: raise ValueError("No literature maps")
    seen_paths,seen_hashes={},{}
    chapters=images=pending=0
    for file in maps:
        doc=json.loads(file.read_text("utf-8"))
        rows=doc.get("chapters")
        count=doc.get("chapterCount")
        if type(count)!=int or count<1 or not isinstance(rows,list) or len(rows)!=count:
            raise ValueError("Invalid original chapter count: "+str(file))
        if [r.get("chapterOneBased") for r in rows]!=list(range(1,count+1)):
            raise ValueError("Missing/duplicated original chapter: "+str(file))
        chapters+=count
        for row in rows:
            art=row.get("primaryImage")
            if art is None: continue
            if not isinstance(art,dict): raise ValueError("Invalid art object")
            name,digest=art.get("imagePath"),art.get("sha256")
            if not isinstance(name,str) or not name or chr(92) in name:
                raise ValueError("Invalid artwork path")
            path=PurePosixPath(name)
            if path.is_absolute() or any(p in (".","..") for p in name.split("/")):
                raise ValueError("Path traversal")
            resolved=(root/name).resolve(strict=True)
            if not resolved.is_relative_to(root.resolve()) or not resolved.is_file():
                raise ValueError("Artwork escapes repository")
            if not isinstance(digest,str) or re.fullmatch("[0-9a-fA-F]{64}",digest) is None:
                raise ValueError("Invalid original image SHA")
            if not 0<resolved.stat().st_size<=35*1024*1024:
                raise ValueError("Empty/oversized original art")
            with resolved.open("rb") as stream:
                actual=hashlib.file_digest(stream,"sha256").hexdigest()
            if actual!=digest.lower(): raise ValueError("Original image SHA mismatch")
            url=art.get("sourceUrl")
            if not isinstance(url,str): raise ValueError("Missing provenance URL")
            parts=urlsplit(url)
            if parts.scheme!="https" or not parts.hostname or parts.username or parts.password:
                raise ValueError("Untrusted source URL")
            if not isinstance(art.get("sceneAnchor"),str) or not art["sceneAnchor"].strip():
                raise ValueError("Missing original scene evidence")
            ref=str(file.relative_to(root))+":"+str(row["chapterOneBased"])
            if str(resolved) in seen_paths or digest.lower() in seen_hashes:
                raise ValueError("Same art reused across books: "+ref)
            seen_paths[str(resolved)]=ref
            seen_hashes[digest.lower()]=ref
            if art.get("editoriallyApproved") is True:
                if art.get("rightsStatus") not in ("APPROVED","PUBLIC_DOMAIN_VERIFIED","CC0_VERIFIED") or not all(art.get(k) for k in ("license","altAr","altEn")):
                    raise ValueError("Uncleared original image falsely approved")
            else: pending+=1
            images+=1
    return {"mapsAudited":len(maps),"chaptersAudited":chapters,"uniqueSourceHashedPrimaryArt":images,"pendingEditorialReview":pending}

if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--root",type=Path,default=ROOT)
    args=p.parse_args()
    print(json.dumps(audit(args.root.resolve()),sort_keys=True))
