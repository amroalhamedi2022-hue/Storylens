#!/usr/bin/env python3
"""Export all 27 SHA-pinned original Wells chapters for nonpublishable art review.

This reads the existing unmodified Standard Ebooks source. It does not translate,
abridge, invent passages, alter the reader or approve distribution rights.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/literature/staging/the-war-of-the-worlds"
NS = "{http://www.w3.org/1999/xhtml}"


def git_blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()


def extract() -> dict:
    manifest = json.loads((SOURCE / "manifest.json").read_text(encoding="utf-8"))
    if (manifest.get("id") != "wells-war-of-the-worlds-1898"
            or manifest.get("completeOriginalSource") is not True):
        raise ValueError("Wrong source or incomplete historical English text")
    source_chapters = manifest["originalChapters"]
    if len(source_chapters) != 27:
        raise ValueError("The pinned original must have 17 + 10 = 27 chapters")
    chapters = []
    for index, item in enumerate(source_chapters, 1):
        expected_book = 1 if index <= 17 else 2
        expected_number = index if expected_book == 1 else index - 17
        expected_file = f"chapter-{expected_book}-{expected_number}.xhtml"
        if (item["book"], item["number"], item["file"]) != (expected_book, expected_number, expected_file):
            raise ValueError(f"Lost Wells's two-book chapter order at {index}")
        path = SOURCE / expected_file
        raw = path.read_bytes()
        if len(raw) != item["bytes"] or git_blob_sha(raw) != item["upstreamGitBlobSha"]:
            raise ValueError(f"Original source bytes/SHA-1 changed: {expected_file}")
        root = ET.fromstring(raw)
        section = root.find(f".//{NS}section")
        if section is None or section.get("id") != expected_file[:-6]:
            raise ValueError(f"Original chapter section identity changed: {expected_file}")
        headings = [p for p in section.iter(f"{NS}p")
                    if p.get("{http://www.idpf.org/2007/ops}type") == "title"]
        title = " ".join("".join(p.itertext()).split()) if False else (
            " ".join("".join(headings[0].itertext()).split()) if headings else ""
        )
        paragraphs = []
        for p in section.iter(f"{NS}p"):
            if p in headings:
                continue
            text = " ".join("".join(p.itertext()).split())
            if text:
                paragraphs.append(text)
        if not title or len(paragraphs) < 2 or sum(map(len, paragraphs)) < 800:
            raise ValueError(f"Chapter lacks genuine text or title: {expected_file}")
        chapters.append({
            "chapterOneBased": index,
            "bookOneBased": expected_book,
            "chapterWithinBookOneBased": expected_number,
            "titleEn": title,
            "sourceFile": str(path.relative_to(ROOT)),
            "sourceGitBlobSha": item["upstreamGitBlobSha"],
            "paragraphs": paragraphs,
        })
    return {
        "workId": "wells-war-of-the-worlds-1898",
        "sourceEdition": manifest["source"]["editionURL"],
        "originalPublicationYear": 1898,
        "historicIllustrationEditionYear": 1906,
        "chapterCount": 27,
        "rightsApproved": False,
        "chapters": chapters,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    book = extract()
    if args.check:
        print("PASS: 27 exact upstream Git-blob-verified Wells chapters and original text paragraphs",
              sum(len(c["paragraphs"]) for c in book["chapters"]))
    else:
        print(json.dumps(book, ensure_ascii=False))
