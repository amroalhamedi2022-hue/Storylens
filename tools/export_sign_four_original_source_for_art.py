#!/usr/bin/env python3
"""Read all 12 complete ORIGINAL English Sign of Four chapters for image QA.

The 1903 Townsend illustrated edition is different from this 1890-text edition.
This extractor does not translate prose, publish an image, clear rights or
equate 1903 printed caption and source-edition wording.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = ROOT / "docs/literature/staging/the-sign-of-the-four"
ART = ROOT / "docs/literature/staging/sign-four-townsend-1903-period-plates"
NS = "{http://www.w3.org/1999/xhtml}"


def git_blob_hash(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def collect() -> dict:
    source = json.loads((ORIGINAL / "manifest.json").read_text("utf-8"))
    cards = json.loads((ORIGINAL / "chapter-image-map.json").read_text("utf-8"))
    art = json.loads((ART / "manifest.json").read_text("utf-8"))
    items = source["originalChapters"]
    if (len(items) != 12 or source.get("completeOriginalSource") is not True
            or cards["chapterCount"] != 12 or cards["releaseApproved"] is not False
            or art["status"] != "STAGED_ORIGINAL_HISTORICAL_PLATES__NO_CHAPTER_MAP_OR_RIGHTS_APPROVAL"
            or len(art["images"]) != 8 or art["publicationApproved"] is not False):
        raise ValueError("Original text or 1903 art archive changed from review-only provenance")
    chapters = []
    original_sha_parts = []
    for number, item in enumerate(items, 1):
        name = f"chapter-{number}.xhtml"
        if item["number"] != number or item["file"] != name:
            raise ValueError("Unabridged original Doyle chapter sequence changed")
        raw = (ORIGINAL / name).read_bytes()
        claimed = item["upstreamGitBlobSha"]
        if (len(raw) != item["bytes"] or git_blob_hash(raw) != claimed
                or cards["chapters"][number-1]["sourceGitBlobSha"] != claimed
                or cards["chapters"][number-1]["chapterOneBased"] != number):
            raise ValueError("Actual original English chapter differs from pinned upstream")
        root = ET.fromstring(raw)
        t = root.find(f"{NS}head/{NS}title")
        title = "".join(t.itertext()).strip() if t is not None else ""
        if not title or title != cards["chapters"][number-1]["sourceOriginalTitle"]:
            raise ValueError("Exact original chapter title changed")
        section = root.find(f".//{NS}section")
        if section is None or section.attrib.get("id") != f"chapter-{number}":
            raise ValueError("Source chapter structural identity changed")
        paragraphs = []
        for elem in section.findall(f"{NS}p"):
            prose = " ".join("".join(elem.itertext()).split())
            if len(prose) >= 15:
                paragraphs.append(prose)
        if len(paragraphs) < 5 or sum(len(p) for p in paragraphs) < 1000:
            raise ValueError("Authentic original source chapter prose missing")
        chapters.append({"chapterOneBased": number, "titleEn": title,
                         "sourceGitBlobSha": claimed, "paragraphs": paragraphs})
        original_sha_parts.append(claimed)
    return {
        "workId": "the-sign-of-the-four",
        "sourceEdition": source["source"]["editionURL"],
        "sourceEditionUpstreamCommit": source["source"]["upstreamCommit"],
        "originalChapterBlobSha256": hashlib.sha256(
            "\n".join(original_sha_parts).encode("ascii")).hexdigest(),
        "illustrationSourceEdition": art["sourceEdition"],
        "chapterCount": 12,
        "humanSceneApproved": False,
        "rightsApproved": False,
        "chapters": chapters,
    }


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    data = collect()
    if args.check:
        print("PASS: 12 genuinely complete SHA-pinned original Doyle chapters;",
              sum(len(c["paragraphs"]) for c in data["chapters"]),
              "unaltered English source paragraphs for safe real-image model comparison")
    else:
        print(json.dumps(data, ensure_ascii=False))
