#!/usr/bin/env python3
"""Recover original 1870s historical plate candidates from Monte Cristo chapters.

Source is the already downloaded and hash-pinned original historical English
translation in staging. Never changes app/reader, rewrites book text, approves
regional rights, claims French original, or invents art.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/literature/staging/user-requested-classics-20261105/the-count-of-monte-cristo"
MAP_PATH = FOLDER / "chapter-image-map.json"
CHAPTER_COUNT = 117
CHAPTER_PATTERN = re.compile(r"^Chapter\s+(\d+)\.\s+(.+)$", re.I)
GENERIC_CAPTION = re.compile(r"^(?:[a-z]?\d+[a-z]?m?|image[-_\d]*|frontispiece|cover|title.*|contents.*)$", re.I)


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def chapter_headings(html: bytes) -> dict[int, str]:
    soup = BeautifulSoup(html, "html.parser")
    found = {}
    for h in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        text = " ".join(h.get_text(" ", strip=True).split())
        m = CHAPTER_PATTERN.match(text)
        if m is None:
            continue
        number = int(m.group(1))
        if number < 1 or number > CHAPTER_COUNT:
            continue
        if number in found:
            # TOC heading duplicates may occur; identical title is acceptable.
            if found[number] != text:
                raise ValueError(f"Contradictory original heading for chapter {number}")
            continue
        found[number] = text
    missing = set(range(1, CHAPTER_COUNT + 1)) - set(found)
    if missing:
        raise ValueError(f"Not all 117 original historical chapter headings were found: {sorted(missing)}")
    return found


def meaningful_caption(value: str) -> str | None:
    text = " ".join(str(value).split())
    if len(text) < 16 or GENERIC_CAPTION.match(text) or ".jpg" in text.lower():
        return None
    return text


def image_score(image: dict) -> tuple:
    caption = meaningful_caption(image.get("originalAltOrCaption", ""))
    w, h = image.get("originalImageDimensions", [0, 0])
    return (bool(caption), int(w) * int(h), int(image.get("bytes", 0)))


def generate() -> dict:
    manifest = json.loads((FOLDER / "manifest.json").read_text(encoding="utf-8"))
    if manifest["workId"] != "the-count-of-monte-cristo":
        raise ValueError("Wrong underlying historical source")
    original = (FOLDER / "original-edition.html").read_bytes()
    if digest(original) != manifest["source"]["sha256"]:
        raise ValueError("Historical original complete source hash mismatch")
    heads = chapter_headings(original)
    choices = {}
    for art in manifest["sourceImages"]:
        if art.get("historicalArtworkCandidate") is not True:
            continue
        heading = " ".join(str(art.get("nearestPreviousHeading", "")).split())
        m = CHAPTER_PATTERN.match(heading)
        if not m:
            continue
        number = int(m.group(1))
        if number not in heads or heads[number] != heading:
            raise ValueError(f"Image attached to mismatched historical heading {heading}")
        if art.get("rightsStatus") != "INDIVIDUAL_IMAGE_AND_TERRITORY_REVIEW_PENDING":
            raise ValueError("Unexpected original archive's rights status")
        file = FOLDER / art["localPath"]
        data = file.read_bytes()
        if digest(data) != art["sha256"] or len(data) != art["bytes"]:
            raise ValueError("Original historical image binary failed SHA-256: " + art["localPath"])
        if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
            raise ValueError("Local historical file is not WebP: " + art["localPath"])
        if number not in choices or image_score(art) > image_score(choices[number]):
            choices[number] = art

    used = set()
    chapters = []
    for number in range(1, CHAPTER_COUNT + 1):
        row = {"chapterOneBased": number, "titleEn": heads[number], "titleAr": ""}
        art = choices.get(number)
        if art is None:
            row.update(primaryImage=None, imageStatus="MISSING_ORIGINAL_PERIOD_ART_CANDIDATE")
        else:
            image_path = (FOLDER / art["localPath"]).relative_to(ROOT).as_posix()
            if image_path in used:
                raise ValueError("Different Monte chapters have same primary image")
            used.add(image_path)
            original_caption = meaningful_caption(art.get("originalAltOrCaption", ""))
            row["primaryImage"] = {
                "imagePath": image_path,
                "sha256": art["sha256"],
                "originalSourceSha256": art["originalSha256"],
                "sourceUrl": art["originalUrl"],
                "sourceBookEditionURL": manifest["source"]["url"],
                "sourceEdition": "Historical full English Gutenberg edition of Alexandre Dumas, translation attribution still pending",
                "sourceOriginalImageOrdinal": art["number"],
                "sourceChapterHeading": heads[number],
                "sceneAnchor": heads[number] + (
                    "; original image caption: " + original_caption if original_caption else ""
                ) + (
                    "; preceding source prose: " + art["previousParagraphContext"][:140]
                    if art.get("previousParagraphContext") else ""
                ),
                "sceneVerificationStatus": "SOURCE_CHAPTER_POSITION_GROUNDED__VISUAL_SCENE_REVIEW_PENDING",
                "originalCaption": art.get("originalAltOrCaption", ""),
                "credit": "Historic illustrated Dumas edition; individual artist attribution pending",
                "license": art["rightsStatus"],
                "rightsStatus": "PENDING_PER_SCAN_AND_TERRITORY_REVIEW",
                "altEn": original_caption or (
                    f"Period illustration from Chapter {number}; exact scene subject needs visual verification."
                ),
                "altAr": f"رسم من الطبعة التاريخية للفصل {number}؛ وصف المشهد يحتاج مراجعة قبل النشر.",
                "editoriallyApproved": False
            }
            row["imageStatus"] = "REAL_LOCAL_CHAPTER_CANDIDATE_PENDING_RIGHTS_AND_EDITORIAL"
        chapters.append(row)

    return {
        "schemaVersion": 1,
        "bookId": "the-count-of-monte-cristo",
        "source": manifest["source"]["url"],
        "sourceTextSha256": manifest["source"]["sha256"],
        "sourceLanguage": "en",
        "originalLanguage": "fr",
        "translationEditionStatus": "Historical complete English edition; translator and French source need bibliographical matching",
        "chapterCount": CHAPTER_COUNT,
        "localCandidateChapters": len(choices),
        "missingCandidateChapters": CHAPTER_COUNT - len(choices),
        "readyForUICards": 0,
        "releaseApproved": False,
        "rightsStatus": "PENDING_INDIVIDUAL_IMAGE_TERRITORY_AND_TRANSLATION_EDITION",
        "mappingMethod": "REAL_SOURCE_HTML_CHAPTER_HEADING_AND_INLINE_IMAGE_ORDER_WITH_BINARY_SHA256",
        "originalArchiveManifest": "docs/literature/staging/user-requested-classics-20261105/the-count-of-monte-cristo/manifest.json",
        "chapters": chapters
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--verify", action="store_true")
    opts = ap.parse_args()
    data = generate()
    body = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    if opts.verify and MAP_PATH.is_file() and MAP_PATH.read_text(encoding="utf-8") != body:
        raise ValueError("Monte Cristo mapped chapters changed unexpectedly")
    if opts.write and (not MAP_PATH.is_file() or MAP_PATH.read_text(encoding="utf-8") != body):
        MAP_PATH.write_text(body, encoding="utf-8")
    print("PASS Count of Monte Cristo: original 117 chapters, "
          f"{data['localCandidateChapters']} verified distinct historical chapter images, "
          f"{data['missingCandidateChapters']} missing, 0 approved for publication", flush=True)


if __name__ == "__main__":
    main()
