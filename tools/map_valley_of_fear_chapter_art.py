#!/usr/bin/env python3
"""Map 7 REAL, SHA256-pinned illustrated-edition images to exact Doyle sections.

The 1915 novel contains 7 chapters in Part I, 7 in Part II and an Epilogue.
A repeated heading such as "Chapter V" MUST be located in its correct part.
This map proves placement in the archived original HTML only. It grants no
human scene identification, copyright clearance or reader publication.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/literature/staging/user-requested-classics-20261105/the-valley-of-fear"
MAP = FOLDER / "chapter-image-map.json"
ROMAN = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
HEADING = re.compile(r"^Chapter\s+([IVXLCDM]+)\s+(.+)$", re.I)
IMAGE = re.compile(r"^images/img(\d+)\.jpg$", re.I)


def normalize(value: str) -> str:
    return " ".join(str(value).split())


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def roman(value: str) -> int:
    total = previous = 0
    for ch in reversed(value.upper()):
        n = ROMAN[ch]
        total += -n if n < previous else n
        previous = max(n, previous)
    return total


def chapter_sections(soup: BeautifulSoup) -> tuple[list[dict], dict[int, int]]:
    sections, heading_node_ids = [], {}
    current_part, seen = 0, {1: set(), 2: set()}
    for tag in soup.find_all("h2"):
        title = normalize(tag.get_text(" ", strip=True))
        if title == "PART I The Tragedy of Birlstone":
            if current_part != 0:
                raise ValueError("Repeated or misplaced Part I")
            current_part = 1
        elif title == "PART II The Scowrers":
            if current_part != 1 or len(seen[1]) != 7:
                raise ValueError("Part II appears before the 7 Part I chapters")
            current_part = 2
        else:
            match = HEADING.fullmatch(title)
            if match:
                n = roman(match.group(1))
                if current_part not in (1, 2) or n in seen[current_part] or n != len(seen[current_part]) + 1:
                    raise ValueError("Missing/duplicate/out-of-order chapter in source HTML")
                seen[current_part].add(n)
                sections.append({
                    "chapterOneBased": len(sections) + 1,
                    "bookPartOneBased": current_part,
                    "chapterWithinBookPart": n,
                    "titleEn": title,
                    "titleAr": "",
                    "sourceOriginalHeading": title,
                    "primaryImage": None,
                    "imageStatus": "NO_LOCALLY_ARCHIVED_PRIMARY_FOR_THIS_SECTION",
                })
                heading_node_ids[id(tag)] = len(sections) - 1
            elif title == "Epilogue":
                if current_part != 2 or len(seen[2]) != 7:
                    raise ValueError("Epilogue misplaced in authentic novel")
                sections.append({
                    "chapterOneBased": 15,
                    "bookPartOneBased": 2,
                    "chapterWithinBookPart": None,
                    "narrativeSectionKind": "epilogue",
                    "titleEn": "Epilogue",
                    "titleAr": "",
                    "sourceOriginalHeading": "Epilogue",
                    "primaryImage": None,
                    "imageStatus": "NO_LOCALLY_ARCHIVED_PRIMARY_FOR_THIS_SECTION",
                })
                heading_node_ids[id(tag)] = len(sections) - 1
    if len(sections) != 15 or any(seen[p] != set(range(1, 8)) for p in (1, 2)):
        raise ValueError("Source not 14 exact chapters plus Epilogue")
    if [r["chapterOneBased"] for r in sections] != list(range(1, 16)):
        raise ValueError("Global narrative section numbering drift")
    return sections, heading_node_ids


def generate() -> dict:
    manifest = json.loads((FOLDER / "manifest.json").read_text("utf-8"))
    if manifest.get("workId") != "the-valley-of-fear":
        raise ValueError("Wrong original book ID")
    source = (FOLDER / "original-edition.html").read_bytes()
    if sha(source) != manifest["source"]["sha256"] or len(source) != manifest["source"]["bytes"]:
        raise ValueError("Complete authentic Gutenberg edition source hash changed")
    soup = BeautifulSoup(source, "html.parser")
    rows, heading_ids = chapter_sections(soup)
    art = manifest["sourceImages"]
    if len(art) != 7 or manifest.get("historicalArtworkCandidates") != 7:
        raise ValueError("Expected exactly the 7 archived original plates")
    by_num = {item["number"]: item for item in art}
    if set(by_num) != set(range(1, 8)):
        raise ValueError("Source image numbering is missing/duplicated")

    seen_paths, seen_binary_hashes, assigned = set(), set(), set()
    for img in soup.find_all("img"):
        src = img.get("src", "")
        match = IMAGE.fullmatch(src)
        if not match:
            continue
        num = int(match.group(1))
        if num in assigned or num not in by_num:
            raise ValueError("Source plate image duplicated or unknown")
        assigned.add(num)
        h = img.find_previous("h2")
        if h is None or id(h) not in heading_ids:
            raise ValueError("Original plate appears outside exact narrative section")
        row = rows[heading_ids[id(h)]]
        item = by_num[num]
        if (normalize(item.get("nearestPreviousHeading", "")) != row["sourceOriginalHeading"]
                or item.get("historicalArtworkCandidate") is not True
                or item.get("placementStatus") != "SOURCE_DOM_EXACT; STORY_SCENE_EDITORIAL_CHECK_PENDING"
                or item.get("rightsStatus") != "INDIVIDUAL_IMAGE_AND_TERRITORY_REVIEW_PENDING"):
            raise ValueError("Plate provenance/position/rights fails exact original evidence")
        path = (FOLDER / item["localPath"]).resolve()
        if not path.is_relative_to(ROOT) or not path.is_file():
            raise ValueError("Local chapter picture missing/outside repository")
        raw = path.read_bytes()
        if len(raw) != item["bytes"] or sha(raw) != item["sha256"] or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
            raise ValueError("Source chapter art bytes or SHA256 mismatch")
        if item["sha256"] in seen_binary_hashes or path in seen_paths or row["primaryImage"]:
            raise ValueError("Duplicate chapter image binary or multiple chapter primaries")
        seen_paths.add(path)
        seen_binary_hashes.add(item["sha256"])
        context = normalize(item.get("previousParagraphContext", ""))
        if len(context) < 15:
            raise ValueError("Original chapter illustration lacks an anchored passage")
        row["primaryImage"] = {
            "imagePath": path.relative_to(ROOT).as_posix(),
            "sha256": item["sha256"],
            "originalSourceSha256": item["originalSha256"],
            "sourceUrl": item["originalUrl"],
            "sourceBookEditionURL": manifest["source"]["url"],
            "sourceEdition": "Original illustrated English Project Gutenberg transcription; specific illustration artist pending",
            "sourceChapterHeading": row["sourceOriginalHeading"],
            "sourceOriginalImageOrdinal": num,
            "sceneAnchor": "Plate is within the original source chapter " + row["sourceOriginalHeading"]
                           + "; preceding original prose: " + context[:140],
            "sceneVerificationStatus": "SOURCE_HTML_CHAPTER_POSITION_ONLY__IMAGE_SUBJECT_PENDING_HUMAN_REVIEW",
            "originalCaption": item.get("originalAltOrCaption", ""),
            "credit": "Historical illustrated book source; artist/individual plate attribution pending",
            "license": item["rightsStatus"],
            "rightsStatus": "PENDING_PER_SCAN_AND_TERRITORY_REVIEW",
            "altEn": "Illustration printed within " + row["sourceOriginalHeading"] + "; exact pictured action unverified",
            "altAr": "رسم تاريخي من " + row["sourceOriginalHeading"] + "؛ تفاصيل المشهد بانتظار المراجعة",
            "editoriallyApproved": False,
        }
        row["imageStatus"] = "ORIGINAL_SOURCE_POSITIONED_LOCAL_ART_PENDING_SCENE_AND_RIGHTS"
    if assigned != set(range(1, 8)):
        raise ValueError("A genuine period image is missing from source HTML")
    mapped = sum(bool(row["primaryImage"]) for row in rows)
    if mapped != 7:
        raise ValueError("Expected exactly seven genuine unique chapter image candidates")
    return {
        "schemaVersion": 1,
        "bookId": "the-valley-of-fear",
        "source": manifest["source"]["url"],
        "sourceTextSha256": manifest["source"]["sha256"],
        "sourceStructure": "Part I (7 chapters), Part II (7 chapters), Epilogue (one narrative section)",
        "chapterCount": 15,
        "novelChapterCountExcludingEpilogue": 14,
        "releaseApproved": False,
        "localCandidateChapters": mapped,
        "missingCandidateChapters": 15 - mapped,
        "readyForUICards": 0,
        "chapters": rows,
    }


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--write", action="store_true")
    p.add_argument("--verify", action="store_true")
    args = p.parse_args()
    document = generate()
    if args.write:
        MAP.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", "utf-8")
    if args.verify:
        if json.loads(MAP.read_text("utf-8")) != document:
            raise SystemExit("FAIL: committed Valley of Fear chapter image map drift")
    print("PASS: original 14 chapters + epilogue / 7 SHA256-verified unique illustrated source slots / 0 approved")
