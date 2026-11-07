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



def attach_original_macklin_scene_candidates(indexed: list[dict], source: bytes) -> int:
    """Source-corroborate eight distinct real 1903 Macklin plate captions.

    Every caption was inspected on a REAL period lithograph, not inferred
    from its ordinal. Anchor phrase is matched uniquely in the complete
    1860 original and in one SHA-pinned narrative unit; punctuation and
    excerpt differences between editions are recorded rather than hidden.
    These eight candidates are emphatically NOT human editor/territory
    approved, and neither frontispiece nor original cover is substituted.
    """
    archive_folder = ROOT / "docs/literature/staging/woman-white-original-1860-1903-plates"
    archive_path = archive_folder / "manifest.json"
    if not archive_path.exists():
        return 0
    archive = json.loads(archive_path.read_text("utf-8"))
    if (archive.get("publicationApproved") is not False
            or archive.get("chapterSceneMatchingComplete") is not False
            or archive.get("humanSceneReviewComplete") is not False
            or archive.get("allOriginalTenSourceFilesArchived") is not True):
        raise ValueError("Original Macklin plate archive not complete or incorrectly rights-approved")
    picture_by_name = {x["wikiFile"]: x for x in archive.get("images", [])}
    if len(picture_by_name) != 10:
        raise ValueError("Duplicate or missing independent period plate file")
    def match_text(raw: bytes) -> str:
        return text(raw).replace("’", "'").replace("‘", "'").casefold()

    exact_original = match_text(source)
    # Plate captions are faithfully transcribed from text PRINTED on original
    # historical 1903 images. Source anchors remove terminal punctuation or,
    # for plate 5, the caption's editorial 'I' absent from adjacent 1860 prose.
    # (plate, period caption, authentic 1860 phrase, verified source unit,
    #  original printed 1903 page, descriptive bilingual draft)
    research = [
        (1, "Is that the road to London?", "Is that the road to London?", 4, 19,
         "Walter Hartright and the woman in white on a road; she points toward London.",
         "والتر هارترايت يقف مع المرأة ذات الثياب البيضاء على الطريق وهي تشير نحو لندن."),
        (2, "Why do I sit here still?", "Why do I sit here still?", 31, 276,
         "A woman sits at a writing desk with a pen, papers and a nearby window.",
         "امرأة تجلس قرب نافذة إلى مكتب للكتابة وبيدها قلم وأمامها أوراق."),
        (3, "I started up from the ottoman.", "I started up from the ottoman", 8, 51,
         "One woman reads a paper while a man rises beside her; another woman stands nearby.",
         "امرأة تقرأ ورقة بينما ينهض رجل بجانبها وتقف امرأة أخرى بالقرب منهما."),
        (4, "Drop your hold of my arms.", "Drop your hold of my arms", 49, 415,
         "Two men hold a third man by the arms outdoors beside a fence.",
         "رجلان يمسكان بذراعي رجل ثالث في الخارج بالقرب من سياج."),
        (5, "I handed it to him at arm’s length.", "handed it to him at arm’s length", 58, 455,
         "A standing man extends a written paper toward a seated man in a room.",
         "رجل واقف يمد ورقة مكتوبة نحو رجل جالس داخل غرفة."),
        (6, "What can you possibly mean?", "What can you possibly mean", 19, 130,
         "Men converse in a formal room as an open illustrated volume is displayed.",
         "رجال يتحدثون داخل غرفة رسمية وأمامهم مجلد مفتوح يحوي صورًا."),
        (7, "We saw the lady laid on the sofa.", "We saw the lady laid on the sofa", 35, 329,
         "Several adults gather around a woman lying on a sofa.",
         "مجموعة من الأشخاص تحيط بامرأة مستلقية على أريكة."),
        (8, "Sign your name there.", "Sign your name there", 25, 200,
         "A man points to a document on a table while women and another man look on.",
         "رجل يشير إلى مستند على طاولة بينما تنظر إليه امرأتان ورجل آخر."),
    ]
    used_art, used_units = set(), set()
    for plate, caption, fragment, expected_unit, page, alt_en, alt_ar in research:
        name = (f"File:Illustration by Thomas Eyre Macklin for The Woman in White ({plate}).jpg")
        art = picture_by_name.get(name)
        if art is None:
            raise ValueError("Missing unique authentic 1903 Macklin illustration: " + str(plate))
        picture = (archive_folder / art["localPath"]).resolve()
        actual = picture.read_bytes()
        if (not picture.is_relative_to(archive_folder.resolve())
                or actual[:4] != b"RIFF" or actual[8:12] != b"WEBP"
                or hashlib.sha256(actual).hexdigest() != art.get("webpSha256")
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
            raise ValueError("Macklin plate bytes, source artist or rights invalid: " + name)
        wanted = match_text(fragment.encode("utf-8"))
        if exact_original.count(wanted) != 1:
            raise ValueError("Historical caption did not uniquely match the original: " + caption)
        destinations = [r for r in indexed if wanted in match_text(
            source[r["sourceHtmlStartByte"]:r["sourceHtmlEndByteExclusive"]])]
        if (len(destinations) != 1
                or destinations[0]["chapterOneBased"] != expected_unit
                or expected_unit in used_units
                or art["webpSha256"] in used_art):
            raise ValueError("Original illustration assigned to wrong or duplicate original unit")
        unit = destinations[0]
        unit_text = match_text(source[unit["sourceHtmlStartByte"]:unit["sourceHtmlEndByteExclusive"]])
        unit_offset = unit_text.index(wanted)
        photo = {
            "imagePath": picture.relative_to(ROOT).as_posix(),
            "sha256": art["webpSha256"],
            "sourceUrl": art["commonsPage"],
            "sourceEdition": art["sourceEdition"],
            "sourceBookEditionURL": archive["categoryURL"],
            "sourceArtworkYear": 1903,
            "sourcePrintedCaption": caption,
            "sourcePrintedPageNumber": page,
            "sourceMatchFragment": fragment,
            "sourceNormalizedCharOffsetInUnit": unit_offset,
            "sourceNarrativeUnitSliceSha256": unit["sourceHtmlSliceSha256"],
            "sourceTextOriginalSha256": hashlib.sha256(source).hexdigest(),
            "sceneAnchor": f"Original Wilkie Collins section {expected_unit}: {fragment}",
            "sceneVerificationStatus":
                "PRINTED_1903_CAPTION_AND_UNIQUE_1860_NARRATIVE_FRAGMENT_MATCH__HUMAN_APPROVAL_PENDING",
            "editionTextDifference":
                "Original scene words match; period plate punctuation / quotation "
                "boundary may differ from Gutenberg's original narrative prose.",
            "credit": art["originalCreator"],
            "license": art["individualCommonsLicense"],
            "rightsStatus": "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW",
            "altEn": alt_en + " Historical illustration; editorial review pending.",
            "altAr": alt_ar + " رسم تاريخي يحتاج إلى مراجعة تحريرية.",
            "editoriallyApproved": False,
            "publishedToApp": False,
        }
        if plate == 1:
            direct = b"Is that the road to London?"
            if source.count(direct) != 1:
                raise ValueError("Opening scene's byte-precise original caption has drifted")
            photo["sourceTextByteOffset"] = source.index(direct)
        unit["primaryImage"] = photo
        unit["imageStatus"] = "REAL_PERIOD_CAPTION_AND_SOURCE_SCENE_CANDIDATE__NOT_APPROVED_FOR_APP"
        used_art.add(art["webpSha256"])
        used_units.add(expected_unit)
    if len(used_art) != 8 or len(used_units) != 8:
        raise ValueError("Incomplete unique original Macklin image caption coverage")
    return len(used_units)


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
    mapped_original_illustrations = attach_original_macklin_scene_candidates(indexed, raw)
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
