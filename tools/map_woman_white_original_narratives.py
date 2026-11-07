#!/usr/bin/env python3
"""Faithfully index Wilkie Collins's entire 1860 The Woman in White in original order.

Unlike a simple numbered novel, this complete classic has THREE epochs,
multiple narrators, an implicit opening I, prose under some h2 headings,
roman-numbered h3 chapters and five short separately labelled statements.
DO NOT flatten the HTML into a guessed 60-chapter adaptation: preserve source
byte offsets, source-SHA256 and all 62 real narrative *units*.
No translation, picture assignment, chapter-card approval or source rewrite.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/literature/staging/user-requested-classics-20261105/the-woman-in-white"
SOURCE = FOLDER / "original-edition.html"
MANIFEST = FOLDER / "manifest.json"
MAP = FOLDER / "chapter-image-map.json"
HEADING = re.compile(rb"<h([23])\b([^>]*)>(.*?)</h\1>", re.IGNORECASE | re.DOTALL)
TAG = re.compile(r"<[^>]*>")
SPACES = re.compile(r"\s+")


def text(raw: bytes) -> str:
    return SPACES.sub(" ", html.unescape(TAG.sub(" ", raw.decode("utf-8")))).strip()



def attach_exact_original_lithograph_candidate(indexed: list[dict], source: bytes) -> int:
    """Only a REAL original plate with a caption also present once in the
    checked original English scene may be a pending chapter image *candidate*.
    All other original scans remain unassigned archival evidence.
    """
    manifest_path = ROOT / "docs/literature/staging/woman-white-original-1860-1903-plates/manifest.json"
    if not manifest_path.exists():
        return 0
    archive = json.loads(manifest_path.read_text("utf-8"))
    if archive.get("publicationApproved") is not False:
        raise ValueError("Original art archive must never imply release")
    source_name = "File:Illustration by Thomas Eyre Macklin for The Woman in White (1).jpg"
    matching = [x for x in archive.get("images", []) if x.get("wikiFile") == source_name]
    if len(matching) != 1:
        raise ValueError("1860 novel caption candidate has no uniquely pinned 1903 real art")
    art = matching[0]
    picture = ROOT / "docs/literature/staging/woman-white-original-1860-1903-plates" / art["localPath"]
    binary = picture.read_bytes()
    expected_hash = art["webpSha256"]
    if (not picture.is_relative_to(ROOT)
            or binary[:4] != b"RIFF" or binary[8:12] != b"WEBP"
            or hashlib.sha256(binary).hexdigest() != expected_hash
            or art.get("originalCreator") != "Thomas Eyre Macklin (1867–1943)"
            or art.get("sourceArtworkYear") != 1903
            or art.get("artworkClassificationStatus") !=
                "ORIGINAL_1903_NOVEL_LITHOGRAPH__NO_VERIFIED_CHAPTER_SCENE"
            or art.get("sceneChapterMatchStatus") != "UNREVIEWED__NO_CHAPTER_CARD"
            or art.get("editoriallyApproved") is not False
            or art.get("rightsStatus") != "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW"
            or art.get("publishedToApp") is not False
            or not art.get("individualCommonsLicense")
            or not str(art.get("commonsPage", "")).startswith("https://commons.wikimedia.org/wiki/File:")):
        raise ValueError("Macklin original plate source, checksum or rights evidence invalid")
    source_caption = b"Is that the road to London?"
    if source.count(source_caption) != 1:
        raise ValueError("Caption does not match one actual source scene")
    original_byte_offset = source.index(source_caption)
    rows = [r for r in indexed if
            r["sourceHtmlStartByte"] <= original_byte_offset < r["sourceHtmlEndByteExclusive"]]
    if len(rows) != 1 or rows[0]["sourceOriginalHeading"] != "IV" or rows[0]["chapterOneBased"] != 4:
        raise ValueError("Historic Macklin scene anchor not in source-authentic opening section IV")
    chapter = rows[0]
    chapter["primaryImage"] = {
        "imagePath": picture.relative_to(ROOT).as_posix(),
        "sha256": expected_hash,
        "sourceUrl": art["commonsPage"],
        "sourceEdition": art["sourceEdition"],
        "sourceBookEditionURL": archive["categoryURL"],
        "sourceCaption": "Is that the road to London?",
        "sourceTextOriginalSha256": hashlib.sha256(source).hexdigest(),
        "sourceTextByteOffset": original_byte_offset,
        "sceneAnchor": "Original 1860 English section IV: Is that the road to London?",
        "sceneVerificationStatus":
            "ORIGINAL_1903_PRINTED_CAPTION_AND_ACTUAL_1860_SOURCE_PROSE_MATCHED__HUMAN_SCENE_REVIEW_PENDING",
        "credit": art["originalCreator"],
        "license": art["individualCommonsLicense"],
        "rightsStatus": "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW",
        "altEn": "Historical lithograph of Walter Hartright meeting the woman in white on the road; she points toward London. Editorial review pending.",
        "altAr": "رسم تاريخي للقاء والتر هارترايت بالمرأة ذات الثياب البيضاء على الطريق وهي تشير باتجاه لندن. الوصف قيد المراجعة.",
        "editoriallyApproved": False,
        "publishedToApp": False,
    }
    chapter["imageStatus"] = "REAL_ORIGINAL_SCENE_MATCHED_CANDIDATE__NOT_APPROVED_FOR_APP"
    return 1


def generate() -> dict:
    manifest = json.loads(MANIFEST.read_text("utf-8"))
    source = manifest["source"]
    raw = SOURCE.read_bytes()
    if (manifest.get("workId") != "the-woman-in-white"
            or manifest.get("originalLanguage") != "en"
            or manifest.get("originalPublicationYear") != 1860
            or source.get("completeGutenbergMarkers") is not True
            or source.get("originalFullEditionPreservedVerbatim") is not True
            or len(raw) != source["bytes"]
            or hashlib.sha256(raw).hexdigest() != source["sha256"]):
        raise ValueError("Original 1860 Woman in White content SHA/edition drift")
    matches = list(HEADING.finditer(raw))
    chosen = []
    started = False
    for h in matches:
        title = text(h.group(3))
        if title == "THE STORY BEGUN BY WALTER HARTRIGHT":
            started = True
        if h.group(2).find(b"pg-footer") != -1:
            break
        if started:
            chosen.append((h, title))
    if (not chosen or chosen[0][1] != "THE STORY BEGUN BY WALTER HARTRIGHT"
            or chosen[-1][1] != "III"):
        raise ValueError("Woman in White complete epoch/narrator boundaries not found")
    last_end = raw.find(b'<h2 id="pg-footer-heading"')
    if last_end < 0:
        raise ValueError("Original Gutenberg license footer missing; never index legal text as a chapter")
    narrator = ""
    epoch = 1
    indexed = []
    h2_count = 0
    h3_count = 0
    for i, (m, original_heading) in enumerate(chosen):
        end = chosen[i + 1][0].start() if i + 1 < len(chosen) else last_end
        if end <= m.end():
            raise ValueError("Overlapping authentic narrative headings")
        body = text(raw[m.end():end])
        is_h2 = m.group(1) == b"2"
        if original_heading == "THE SECOND EPOCH":
            epoch = 2
        elif original_heading == "THE THIRD EPOCH":
            epoch = 3
        if is_h2 and "THE STORY" in original_heading:
            narrator = original_heading
        # H2 context headers followed directly by numbered H3 text are NOT
        # independent chapters. The three H2 headings that actually contain
        # substantial original prose ARE real distinct narrative sections.
        if is_h2 and len(body) < 500:
            continue
        if not is_h2 and len(body) < 150:
            raise ValueError("Unexpected empty source-marked narrative section: " + original_heading)
        segment = raw[m.start():end]
        marker = ("IMPLICIT_I__INITIAL_WALTER_NARRATIVE" if is_h2 and i == 0
                  else ("UNNUMBERED_SUBSTANTIVE_NARRATOR_STATEMENT" if is_h2
                        else original_heading))
        unit_type = ("ORIGINAL_SOURCE_H2_SUBSTANTIVE_NARRATIVE" if is_h2
                     else "ORIGINAL_SOURCE_H3_NUMBERED_OR_NAMED_NARRATIVE")
        indexed.append({
            "chapterOneBased": len(indexed) + 1,
            "titleEn": (narrator + " / " if narrator else "") + marker,
            "titleAr": "",
            "sourceOriginalHeading": original_heading,
            "sourceEpochOneBased": epoch,
            "sourceNarratorHeading": narrator,
            "sourceUnitType": unit_type,
            "sourceHtmlStartByte": m.start(),
            "sourceHtmlEndByteExclusive": end,
            "sourceHtmlByteCount": len(segment),
            "sourceHtmlSliceSha256": hashlib.sha256(segment).hexdigest(),
            "sourcePassageLead": body[:160],
            "primaryImage": None,
            "imageStatus": "EXACT_ORIGINAL_NARRATIVE_UNIT__NO_SCENE_VERIFIED_LOCAL_IMAGE",
        })
        if is_h2:
            h2_count += 1
        else:
            h3_count += 1
    if (len(indexed) != 62 or h2_count != 3 or h3_count != 59
            or [r["chapterOneBased"] for r in indexed] != list(range(1, 63))
            or [r["sourceEpochOneBased"] for r in indexed].count(1) < 20
            or [r["sourceEpochOneBased"] for r in indexed].count(3) < 15):
        raise ValueError("Original source structural chapter segmentation changed")
    for before, after in zip(indexed, indexed[1:]):
        if before["sourceHtmlEndByteExclusive"] > after["sourceHtmlStartByte"]:
            raise ValueError("Source narrative byte ranges overlap")
    mapped_original_illustrations = attach_exact_original_lithograph_candidate(indexed, raw)
    return {
        "schemaVersion": 1,
        "bookId": "the-woman-in-white",
        "sourceFullOriginalPath": str(SOURCE.relative_to(ROOT)),
        "sourceFullOriginalSha256": source["sha256"],
        "sourceFullOriginalBytes": source["bytes"],
        "sourceOriginalPublicationYear": 1860,
        "sourceEdition": source["url"],
        "chapterCount": 62,
        "chapterCountUnitLabel": "62 authentic narrative units (59 h3 sections + 3 standalone h2 narratives), not 62 conventional numbered chapters",
        "countSemantics": "UNABRIDGED_SOURCE_NARRATIVE_UNITS__EPOCHS_AND_NARRATORS_PRESERVED",
        "sourceMarkedH3Narratives": h3_count,
        "sourceSubstantiveH2Narratives": h2_count,
        "releaseApproved": False,
        "localCandidateChapters": mapped_original_illustrations,
        "missingCandidateChapters": 62 - mapped_original_illustrations,
        "readyForUICards": 0,
        "chapters": indexed,
    }


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--write", action="store_true")
    p.add_argument("--verify", action="store_true")
    args = p.parse_args()
    doc = generate()
    if args.write:
        MAP.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", "utf-8")
    if args.verify and json.loads(MAP.read_text("utf-8")) != doc:
        raise SystemExit("FAIL: saved Woman in White original 62 source units mismatch")
    print("PASS: 62 original woman-in-white narrative units, 0 fake images, 0 approved cards")


if __name__ == "__main__":
    main()
