#!/usr/bin/env python3
"""Audit the full original Arabic Kalila transcription, preserving all narrative bytes."""
from __future__ import annotations
import copy
import hashlib
import json
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/literature/staging/kalila-arabic-wikisource"


def verify_kalila_sections(data=None):
    manifest = json.loads((FOLDER / "manifest.json").read_text(encoding="utf-8"))
    if data is None:
        data = json.loads((FOLDER / "arabic-source-section-index.json").read_text("utf-8"))
    origin = (FOLDER / "kalila.md").read_bytes()
    source = manifest["sourceEdition"]
    original_blob = hashlib.sha1(b"blob " + str(len(origin)).encode() + b"\0" + origin).hexdigest()
    if (len(origin) != source["bytes"] or original_blob != source["upstreamGitBlobSha"]
            or data["provenance"]["sourceGitBlobSha"] != original_blob
            or data["provenance"]["sourceBytes"] != len(origin)
            or data["bookId"] != "kalila-arabic-wikisource"
            or not data["provenance"]["sourceLicense"].startswith("Wikisource-derived CC BY-SA")
            or data["releaseApproved"] is not False
            or data["allChapterArtMapped"] is not False
            or data["fullContextualEnglishTranslationVerified"] is not False
            or data["originalColourMiniaturesIndividuallySceneMatched"] is not False
            or data["territorialRightsReviewed"] is not False
            or data["sourceSectionUnitNotReleaseChapterCount"] is not True):
        raise ValueError("Original Arabic edition checksum, provenance or release restrictions violated")
    headings = list(re.finditer(rb"(?m)^## [^\r\n]+$", origin))
    if len(headings) != data["originalMarkdownHeadingCount"] or len(headings) != 20:
        raise ValueError("Unexpected original chapter heading count")
    alias, substantive = headings[12], headings[13]
    if (origin[alias.end():substantive.start()].strip() != b"" or
            not substantive.group()[3:].decode("utf-8").startswith(alias.group()[3:].decode("utf-8"))
            or data["duplicateEmptyHeadingCount"] != 1):
        raise ValueError("One empty duplicate title must be preserved and not counted twice")
    effective = [x for i, x in enumerate(headings) if i != 13]
    sections = data["sections"]
    if (len(sections) != len(effective) or len(sections) != 19
            or data["distinctNonEmptySourceSections"] != 19
            or data["introductorySections"] != 4
            or data["storyOrAllegorySections"] != 15
            or data["initialFrontMatterEndByteExclusive"] != effective[0].start()):
        raise ValueError("Incomplete or inflated Arabic source segmentation")
    for i, (row, opening) in enumerate(zip(sections, effective)):
        begin = opening.start()
        end = effective[i + 1].start() if i < 18 else len(origin)
        canonical = substantive if i == 12 else opening
        exact_title = canonical.group()[3:].decode("utf-8")
        if (row["sectionOneBased"] != i + 1
                or row["sourceStartByte"] != begin
                or row["sourceEndByteExclusive"] != end
                or row["titleAr"] != exact_title
                or row["sourceFilePath"] != data["provenance"]["sourceFilePath"]
                or row["sectionRole"] != (
                    "INTRODUCTORY_FRAME_OR_EDITORIAL_CONTEXT" if i < 4
                    else "ORIGINAL_ARABIC_NARRATIVE_SECTION")
                or (row["primaryImage"] is not None if i not in (4, 6, 7) else row["primaryImage"] is None)
                or row["completeContextualEnglishTranslationVerified"] is not False
                or row["chapterSceneImageHumanApproved"] is not False):
            raise ValueError(f"Arabic chapter boundary, title or approval altered: {i + 1}")
        if i == 12:
            duplicate = row["duplicateHeadingWithinSection"]
            if (duplicate is None or duplicate["recordedAsDistinctSection"] is not False
                    or duplicate["canonicalHeading"] != exact_title):
                raise ValueError("The original short empty duplicate heading was lost")
        elif row["duplicateHeadingWithinSection"] is not None:
            raise ValueError("Fictitious duplicate or extra Arabic section")
        if not origin[begin:end].strip():
            raise ValueError("Empty canonical narrative unit")
    # Real manuscript-specific visual scene matches, not duplicate pictures,
    # not editorial approval or identical textual editions.
    folio_manifest = json.loads((ROOT / "docs/literature/staging/kalila-original-colour-miniatures-20261105/manifest.json").read_text("utf-8"))
    approved_original_indices = {4: (1, "67r"), 6: (10, "86r"), 7: (11, "95v")}
    image_hashes = set()
    for section_zero_based, (folio_zero_based, manuscript_folio) in approved_original_indices.items():
        row = sections[section_zero_based]
        folio = folio_manifest["plates"][folio_zero_based]
        picture = row["primaryImage"]
        photo_path = "docs/literature/staging/kalila-original-colour-miniatures-20261105/" + folio["localPath"]
        raw_photo = (ROOT / photo_path).read_bytes()
        source_prose = origin[row["sourceStartByte"]:row["sourceEndByteExclusive"]].decode("utf-8")
        if (not isinstance(picture.get("sourcePassageAr"), str)
                or picture["sourcePassageAr"] not in source_prose
                or picture.get("imagePath") != photo_path
                or picture.get("sha256") != folio["webpSha256"]
                or picture.get("sourceURL") != folio["sourceCommonsFilePage"]
                or picture.get("sourceUrl") != folio["sourceCommonsFilePage"]
                or picture.get("originalCommonsFile") != folio["sourceCommonsFile"]
                or len(raw_photo) != folio["webpBytes"]
                or hashlib.sha256(raw_photo).hexdigest() != folio["webpSha256"]
                or raw_photo[:4] != b"RIFF" or raw_photo[8:12] != b"WEBP"
                or picture.get("sceneAnchor") != picture["sourcePassageAr"]
                or picture.get("sourceWorkNarrativeSectionOneBased") != section_zero_based + 1
                or picture.get("sourceManuscriptFolio") != manuscript_folio
                or picture.get("imageOriginalColourUnmodified") is not True
                or picture.get("sourceArabicEditionDifferentFromIllustratedManuscript") is not True
                or folio["individualCommonsLicenseShortName"] != "Public domain"
                or picture.get("rightsStatus") != "PENDING_TERRITORIAL_AND_EDITORIAL_REVIEW"
                or picture.get("humanEditorApproved") is not False
                or picture.get("editoriallyApproved") is not False
                or picture.get("chapterArtPublished") is not False
                or picture.get("publicationStatus") != "STAGING_ONLY_NOT_PUBLISHED"
                or not picture.get("altAr") or not picture.get("altEn")
                or picture.get("sha256") in image_hashes):
            raise ValueError("Kalila medieval miniature source, scene, rights or uniqueness mismatch")
        image_hashes.add(picture["sha256"])
    if (data.get("sourceMatchedHistoricFolioCandidatesNotApproved") != 3
            or data.get("imageHumanApprovedCount") != 0
            or len(image_hashes) != 3):
        raise ValueError("Kalila source-scenic miniatures miscounted or falsely approved")
    return len(sections)


class AuthenticKalilaSections(unittest.TestCase):
    def test_source_bytes_and_all_19_distinct_sections(self):
        self.assertEqual(verify_kalila_sections(), 19)

    def test_false_release_and_omission_are_rejected(self):
        original = json.loads((FOLDER / "arabic-source-section-index.json").read_text("utf-8"))
        for name, change in (
            ("missing-section", lambda d: d["sections"].pop()),
            ("false-picture", lambda d: d["sections"][4].__setitem__("primaryImage", {"fake": True})),
            ("new-heading", lambda d: d["sections"][12].__setitem__("titleAr", "قصة مختلقة")),
            ("wrong-byte-offset", lambda d: d["sections"][9].__setitem__("sourceStartByte", 2)),
            ("fictitious-rights", lambda d: d.__setitem__("territorialRightsReviewed", True)),
            ("duplicate-counted", lambda d: d.__setitem__("distinctNonEmptySourceSections", 20)),
            ("translation-falsified", lambda d: d.__setitem__("fullContextualEnglishTranslationVerified", True)),
        ):
            with self.subTest(name=name):
                test_data = copy.deepcopy(original)
                change(test_data)
                with self.assertRaises(ValueError):
                    verify_kalila_sections(test_data)


if __name__ == "__main__":
    unittest.main()
