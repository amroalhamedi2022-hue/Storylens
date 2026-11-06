#!/usr/bin/env python3
"""Source-authentic chapter indexes for four complete, SHA-pinned Doyle classics.

No artificial images, fake translations, DRM/reader modifications or rights
approvals. Section titles are read from *actual* original English XHTML.
The original archived bytes must match upstream git blob SHA plus size.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/literature/staging"
X = "{http://www.w3.org/1999/xhtml}"
CONFIG = {
    "a-study-in-scarlet": ("doyle-a-study-in-scarlet-1887", 14),
    "the-lost-world": ("doyle-the-lost-world-1912", 16),
    "the-hound-of-the-baskervilles": ("doyle-hound-of-the-baskervilles-1902", 15),
    "the-sign-of-the-four": ("doyle-sign-of-the-four-1890", 12),
}
ROMAN = ((100, "C"), (90, "XC"), (50, "L"), (40, "XL"), (10, "X"),
         (9, "IX"), (5, "V"), (4, "IV"), (1, "I"))


def roman(n: int) -> str:
    parts = []
    for amount, symbol in ROMAN:
        times, n = divmod(n, amount)
        parts.append(symbol * times)
    return "".join(parts)


def git_blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()


def original_filename(slug: str, global_n: int) -> tuple[str, int | None, int]:
    if slug == "a-study-in-scarlet":
        part = 1 if global_n <= 7 else 2
        within = global_n if part == 1 else global_n - 7
        return f"chapter-{part}-{within}.xhtml", part, within
    return f"chapter-{global_n}.xhtml", None, global_n


def generate(slug: str) -> dict:
    if slug not in CONFIG:
        raise ValueError("Not an allowed original Doyle work: " + slug)
    expected_id, chapter_count = CONFIG[slug]
    folder = STAGING / slug
    manifest = json.loads((folder / "manifest.json").read_text("utf-8"))
    if (manifest.get("id") != expected_id or
            manifest.get("completeOriginalSource", manifest.get("originalSourceComplete")) is not True or
            len(manifest.get("originalChapters", [])) != chapter_count):
        raise ValueError("Incomplete source manifest or wrong novel ID: " + slug)
    by_sha, indexed = set(), []
    for global_n, chapter in enumerate(manifest["originalChapters"], 1):
        filename, part, within = original_filename(slug, global_n)
        if chapter.get("file") != filename or chapter.get("number") != global_n:
            raise ValueError(f"Source chapter {global_n} missing/out of original order: {slug}")
        if slug == "a-study-in-scarlet" and chapter.get("part") != part:
            raise ValueError("Original Study in Scarlet Part I/II chapter grouping corrupted")
        file = folder / filename
        raw = file.read_bytes()
        hash_value = git_blob_sha(raw)
        if (len(raw) != chapter["bytes"] or hash_value != chapter["upstreamGitBlobSha"]
                or hash_value in by_sha):
            raise ValueError("Source bytes/upstream git blob SHA changed or duplicated: " + filename)
        by_sha.add(hash_value)
        root = ET.fromstring(raw)
        title_node = root.find(f"./{X}head/{X}title")
        if title_node is None:
            raise ValueError("Original chapter English title missing: " + filename)
        chapter_title = " ".join("".join(title_node.itertext()).split())
        if not chapter_title.startswith(roman(within) + ": "):
            raise ValueError("Canonical chapter ordinal/title mismatch: " + filename)
        section_id = filename.removesuffix(".xhtml")
        target = root.find(f".//{X}section[@id='{section_id}']")
        if target is None:
            raise ValueError("Original EPUB chapter identity missing: " + filename)
        paragraphs = [" ".join("".join(p.itertext()).split()) for p in target.findall(f".//{X}p")]
        if not paragraphs or sum(map(len, paragraphs)) < 500:
            raise ValueError("Original chapter unexpectedly empty/abridged: " + filename)
        indexed.append({
            "chapterOneBased": global_n,
            "titleEn": ("Part " + roman(part) + " · " if part else "") + chapter_title,
            "titleAr": "",
            "sourceOriginalTitle": chapter_title,
            "bookPartOneBased": part,
            "chapterWithinBookPart": within,
            "sourceFile": file.relative_to(ROOT).as_posix(),
            "sourceGitBlobSha": hash_value,
            "primaryImage": None,
            "imageStatus": "ORIGINAL_SOURCE_CHAPTER_VERIFIED__NO_SCENE_MAPPED_LOCAL_IMAGE",
        })
    if len(indexed) != chapter_count or [r["chapterOneBased"] for r in indexed] != list(range(1, chapter_count + 1)):
        raise ValueError("Missing authentic chapter index rows")
    return {
        "schemaVersion": 1,
        "bookId": slug,
        "sourceEdition": manifest["source"]["editionURL"],
        "sourceEditionCommit": manifest["source"]["upstreamCommit"],
        "chapterCount": chapter_count,
        "countSemantics": "AUTHENTIC_UNABRIDGED_ORIGINAL_ENGLISH_CHAPTERS",
        "releaseApproved": False,
        "localCandidateChapters": 0,
        "missingCandidateChapters": chapter_count,
        "readyForUICards": 0,
        "chapters": indexed,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--verify", action="store_true")
    parser.add_argument("--book", choices=CONFIG)
    args = parser.parse_args()
    books = [args.book] if args.book else list(CONFIG)
    for slug in books:
        actual = generate(slug)
        target = STAGING / slug / "chapter-image-map.json"
        if args.write:
            target.write_text(json.dumps(actual, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if args.verify and json.loads(target.read_text("utf-8")) != actual:
            raise SystemExit("FAIL: " + slug + " original source map drift")
        print("PASS: full original", slug, "chapters", actual["chapterCount"], "approved images 0")


if __name__ == "__main__":
    main()
