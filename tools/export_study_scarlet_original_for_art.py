#!/usr/bin/env python3
"""Exact complete 1887 Doyle novel source for real-engraving visual QA only.

Read all fourteen unabridged English source XHTML files already pinned to
Standard Ebooks git blob SHA. No abridgement, source modifications, artificial
image matching, translation, edition-rights or UI publication.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/literature/staging/a-study-in-scarlet"
X = "{http://www.w3.org/1999/xhtml}"


def git_blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()


def extract() -> dict:
    manifest = json.loads((SOURCE / "manifest.json").read_text("utf-8"))
    if (manifest.get("id") != "doyle-a-study-in-scarlet-1887"
            or manifest.get("originalSourceComplete") is not True
            or len(manifest["originalChapters"]) != 14):
        raise ValueError("Expected the exact complete original Doyle 1887 edition")
    rows = []
    for index, entry in enumerate(manifest["originalChapters"], 1):
        part, local = (1, index) if index <= 7 else (2, index - 7)
        filename = f"chapter-{part}-{local}.xhtml"
        if (entry.get("file") != filename or entry.get("number") != index
                or entry.get("part") != part):
            raise ValueError("Authentic original chapter order or Part I/II corrupted")
        path = SOURCE / filename
        raw = path.read_bytes()
        if len(raw) != entry["bytes"] or git_blob_sha(raw) != entry["upstreamGitBlobSha"]:
            raise ValueError("Original Doyle chapter raw bytes or git SHA mismatch")
        root = ET.fromstring(raw)
        title = root.find(f"./{X}head/{X}title")
        section = root.find(f".//{X}section[@id='chapter-{part}-{local}']")
        if title is None or section is None:
            raise ValueError("Original source title or part/chapter section missing")
        text_title = " ".join("".join(title.itertext()).split())
        paragraphs = [" ".join("".join(p.itertext()).split())
                      for p in section.findall(f".//{X}p")]
        paragraphs = [p for p in paragraphs if p]
        if len(paragraphs) < 3 or sum(map(len, paragraphs)) < 1500:
            raise ValueError("Full original Sherlock Holmes prose mysteriously truncated")
        rows.append({
            "chapterOneBased": index,
            "partOneBased": part,
            "chapterWithinPart": local,
            "titleEn": ("Part I · " if part == 1 else "Part II · ") + text_title,
            "originalSourceGitBlobSha": entry["upstreamGitBlobSha"],
            "paragraphs": paragraphs,
        })
    return {
        "workId": "a-study-in-scarlet",
        "sourceEdition": manifest["source"]["editionURL"],
        "originalPublicationYear": 1887,
        "historicalIllustrator": "David Henry Friston",
        "chapterCount": 14,
        "rightsApproved": False,
        "chapters": rows,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    doc = extract()
    if args.check:
        print("PASS: 14 complete SHA-pinned original Scarlet chapters with original source paragraphs",
              sum(len(ch["paragraphs"]) for ch in doc["chapters"]))
    else:
        print(json.dumps(doc, ensure_ascii=False))
