#!/usr/bin/env python3
"""Extract all 33 original Cooper chapters, byte-verified from the archived source.

Research-only. Do not convert English prose into unreviewed translation or
guess French-edition page order from a separate 1919 illustrated HTML edition.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re

from bs4 import BeautifulSoup, Tag

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "docs/literature/staging/illustrated-five-20261105/the-last-of-the-mohicans"
CHAPTER_RE = re.compile(r"^CHAPTER\s+([IVXLCDM]+)\.?$", re.IGNORECASE)
ROMAN = {"I":1, "V":5, "X":10, "L":50, "C":100, "D":500, "M":1000}


def roman_number(value: str) -> int:
    total = previous = 0
    for char in reversed(value.upper()):
        digit = ROMAN[char]
        total += -digit if digit < previous else digit
        previous = max(digit, previous)
    return total


def collect() -> dict:
    manifest = json.loads((DIR / "manifest.json").read_text("utf-8"))
    raw = (DIR / "original-full-edition.html").read_bytes()
    original_hash = hashlib.sha256(raw).hexdigest()
    if original_hash != manifest["source"]["sha256"]:
        raise ValueError("Mohicans canonical complete HTML source differs from pinned SHA256")
    soup = BeautifulSoup(raw, "html.parser")
    heads = []
    for tag in soup.find_all(re.compile("^h[1-6]$")):
        name = " ".join(tag.get_text(" ", strip=True).split())
        match = CHAPTER_RE.fullmatch(name)
        if match:
            heads.append((roman_number(match.group(1)), tag, name))
    if len(heads) != 33 or [n for n, _, _ in heads] != list(range(1, 34)):
        raise ValueError("Not the exact 33 Cooper original chapters; no guessed headings")
    chapter_map = json.loads((DIR / "chapter-image-map.json").read_text("utf-8"))
    if chapter_map["chapterCount"] != 33 or chapter_map["sourceTextSha256"] != original_hash:
        raise ValueError("Mohicans chapter map and original source bytes differ")
    result = []
    for number, head, title in heads:
        paragraphs = []
        for item in head.next_elements:
            if not isinstance(item, Tag):
                continue
            if item is not head and item.name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
                if CHAPTER_RE.fullmatch(" ".join(item.get_text(" ", strip=True).split())):
                    break
            if item.name in {"div", "section"} and item.get("id") in {"pg-footer", "pg-end-separator"}:
                break
            if item.name != "p":
                continue
            words = " ".join(item.get_text(" ", strip=True).split())
            if len(words) >= 25 and not words.startswith(("Project Gutenberg", "*** END OF")):
                paragraphs.append(words)
        if len(paragraphs) < 5 or sum(len(p) for p in paragraphs) < 1200:
            raise ValueError(f"English prose missing from authentic Mohicans chapter {number}")
        if chapter_map["chapters"][number - 1]["chapterOneBased"] != number:
            raise ValueError("Historical chapter map changed its order")
        result.append({
            "chapterOneBased": number,
            "titleEn": title,
            "originalSourceHeading": title,
            "paragraphs": paragraphs,
        })
    return {
        "workId": "the-last-of-the-mohicans",
        "sourceEdition": manifest["source"]["originalFullHTMLUrl"],
        "sourceCorpusSha256": original_hash,
        "illustrationSourceEdition": "Le dernier des Mohicans, Andriolli/Huyot, nineteenth-century French edition",
        "chapterCount": 33,
        "humanSceneApproved": False,
        "rightsApproved": False,
        "chapters": result,
    }


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    doc = collect()
    if args.check:
        print("PASS: genuine 33 original Cooper chapters, SHA-pinned HTML and exact original prose",
              sum(len(c["paragraphs"]) for c in doc["chapters"]))
    else:
        print(json.dumps(doc, ensure_ascii=False))
