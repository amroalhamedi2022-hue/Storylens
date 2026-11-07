#!/usr/bin/env python3
"""Prevent silently dropping Woman in White narrators, three epochs, chapter I,
or short original statements. This audits the ORIGINAL SHA-pinned HTML bytes;
no inference from image ordering or synthetic translations.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from map_woman_white_original_narratives import generate

STAGED = ROOT / "docs/literature/staging/user-requested-classics-20261105/the-woman-in-white"


class AuthenticNarrativeSections(unittest.TestCase):
    def test_whole_original_source_and_narrative_splits_are_pinned(self):
        doc = generate()
        saved = json.loads((STAGED / "chapter-image-map.json").read_text("utf-8"))
        self.assertEqual(doc, saved)
        self.assertEqual(doc["chapterCount"], 62)
        self.assertEqual(doc["sourceMarkedH3Narratives"], 59)
        self.assertEqual(doc["sourceSubstantiveH2Narratives"], 3)
        self.assertIn("not 62 conventional numbered chapters", doc["chapterCountUnitLabel"])
        self.assertEqual(doc["countSemantics"],
                         "UNABRIDGED_SOURCE_NARRATIVE_UNITS__EPOCHS_AND_NARRATORS_PRESERVED")
        self.assertEqual(doc["localCandidateChapters"], 8)
        self.assertEqual(doc["missingCandidateChapters"], 54)
        self.assertEqual(doc["readyForUICards"], 0)
        self.assertFalse(doc["releaseApproved"])
        self.assertEqual([u["chapterOneBased"] for u in doc["chapters"]],
                         list(range(1, 63)))
        self.assertTrue(all(u["primaryImage"] is None for u in doc["chapters"] if u["chapterOneBased"] not in {4, 8, 19, 25, 31, 35, 49, 58}))
        self.assertTrue(all(not u["titleAr"] for u in doc["chapters"]))
        image = doc["chapters"][3]["primaryImage"]
        self.assertIsNotNone(image)
        self.assertEqual(image["sourcePrintedCaption"], "Is that the road to London?")
        self.assertFalse(image["editoriallyApproved"])
        self.assertFalse(image["publishedToApp"])
        self.assertEqual(image["rightsStatus"], "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW")
        self.assertTrue(image["imagePath"].endswith(".webp"))
        self.assertEqual(len(image["sha256"]), 64)

    def test_actual_utf8_original_text_spans_rehash_and_preserve_all_three_epochs(self):
        doc = generate()
        full = (ROOT / doc["sourceFullOriginalPath"]).read_bytes()
        self.assertEqual(len(full), doc["sourceFullOriginalBytes"])
        self.assertEqual(hashlib.sha256(full).hexdigest(), doc["sourceFullOriginalSha256"])
        self.assertEqual(set(x["sourceEpochOneBased"] for x in doc["chapters"]), {1, 2, 3})
        self.assertEqual(len([u for u in doc["chapters"] if u["sourceUnitType"].startswith(
            "ORIGINAL_SOURCE_H2")]), 3)
        self.assertEqual(len([u for u in doc["chapters"] if u["sourceUnitType"].startswith(
            "ORIGINAL_SOURCE_H3")]), 59)
        for row in doc["chapters"]:
            with self.subTest(section=row["chapterOneBased"]):
                start, end = row["sourceHtmlStartByte"], row["sourceHtmlEndByteExclusive"]
                self.assertGreater(end, start)
                self.assertEqual(end - start, row["sourceHtmlByteCount"])
                self.assertEqual(hashlib.sha256(full[start:end]).hexdigest(),
                                 row["sourceHtmlSliceSha256"])
                self.assertGreater(len(row["sourcePassageLead"]), 100)
                if row["chapterOneBased"] in {4, 8, 19, 25, 31, 35, 49, 58}:
                    self.assertEqual(row["imageStatus"],
                                     "REAL_PERIOD_CAPTION_AND_SOURCE_SCENE_CANDIDATE__NOT_APPROVED_FOR_APP")
                else:
                    self.assertIn("EXACT_ORIGINAL_NARRATIVE_UNIT",
                                  row["imageStatus"])
        for a, b in zip(doc["chapters"], doc["chapters"][1:]):
            self.assertLessEqual(a["sourceHtmlEndByteExclusive"],
                                 b["sourceHtmlStartByte"])
        self.assertEqual(doc["chapters"][0]["sourceOriginalHeading"],
                         "THE STORY BEGUN BY WALTER HARTRIGHT")
        self.assertEqual(doc["chapters"][-1]["sourceOriginalHeading"], "III")
        self.assertTrue(any("FREDERICK FAIRLIE" in x["sourceOriginalHeading"]
                            for x in doc["chapters"]))
        self.assertTrue(any("MRS. CATHERICK" in x["sourceOriginalHeading"]
                            for x in doc["chapters"]))
        self.assertTrue(any("THE COUNT’S NARRATIVE" in x["sourceOriginalHeading"]
                            for x in doc["chapters"]))
        self.assertTrue(any("THE NARRATIVE OF THE TOMBSTONE" in x["sourceOriginalHeading"]
                            for x in doc["chapters"]))

    def test_real_caption_is_unique_and_pinned_to_original_section_four(self):
        doc = generate()
        art = doc["chapters"][3]["primaryImage"]
        full = (ROOT / doc["sourceFullOriginalPath"]).read_bytes()
        original = b"Is that the road to London?"
        self.assertEqual(full.count(original), 1)
        self.assertEqual(full.find(original), art["sourceTextByteOffset"])
        self.assertEqual(hashlib.sha256(full).hexdigest(), art["sourceTextOriginalSha256"])
        self.assertLess(doc["chapters"][3]["sourceHtmlStartByte"], art["sourceTextByteOffset"])
        self.assertGreater(doc["chapters"][3]["sourceHtmlEndByteExclusive"], art["sourceTextByteOffset"])
        self.assertIn("HUMAN_APPROVAL_PENDING", art["sceneVerificationStatus"])
        self.assertEqual(doc["chapters"][3]["sourceOriginalHeading"], "IV")
        self.assertTrue(all(not x.get("primaryImage", {}).get("editoriallyApproved", False)
                            for x in doc["chapters"] if x.get("primaryImage")))

    def test_all_eight_period_captions_match_unique_source_narrative_units(self):
        doc = generate()
        pairs = {
            1: 4, 2: 31, 3: 8, 4: 49,
            5: 58, 6: 19, 7: 35, 8: 25,
        }
        mapped = [r for r in doc["chapters"] if r["primaryImage"] is not None]
        self.assertEqual(len(mapped), 8)
        self.assertEqual({r["chapterOneBased"] for r in mapped}, set(pairs.values()))
        self.assertEqual(len({r["primaryImage"]["sha256"] for r in mapped}), 8)
        self.assertEqual(len({r["primaryImage"]["imagePath"] for r in mapped}), 8)
        original = (ROOT / doc["sourceFullOriginalPath"]).read_bytes()
        for illustration, unit in pairs.items():
            with self.subTest(plate=illustration, unit=unit):
                row = doc["chapters"][unit - 1]
                art = row["primaryImage"]
                self.assertIsNotNone(art)
                self.assertEqual(art["sourceArtworkYear"], 1903)
                self.assertIn(f"({illustration}).jpg", art["sourceUrl"])
                self.assertFalse(art["editoriallyApproved"])
                self.assertFalse(art["publishedToApp"])
                self.assertEqual(art["rightsStatus"], "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW")
                self.assertEqual(art["sourceNarrativeUnitSliceSha256"], row["sourceHtmlSliceSha256"])
                self.assertEqual(art["sourceTextOriginalSha256"], doc["sourceFullOriginalSha256"])
                self.assertGreaterEqual(art["sourceNormalizedCharOffsetInUnit"], 0)
                self.assertEqual(len(art["sha256"]), 64)
                picture = ROOT / art["imagePath"]
                self.assertEqual(hashlib.sha256(picture.read_bytes()).hexdigest(), art["sha256"])
        self.assertEqual(original.count(b"Is that the road to London?"), 1)
        self.assertEqual(doc["readyForUICards"], 0)

    def test_archive_original_novel_still_has_no_guessed_bilingual_publication(self):
        manifest = json.loads((STAGED / "manifest.json").read_text("utf-8"))
        self.assertEqual(manifest["sourceLanguage"], "en")
        self.assertFalse(manifest["acceptance"]["fullNaturalArabicTranslation"])
        self.assertFalse(manifest["acceptance"]["appIntegrated"])
        self.assertFalse(manifest["acceptance"]["illustrationRightsApproved"])
        self.assertTrue(manifest["source"]["originalFullEditionPreservedVerbatim"])
        self.assertTrue(manifest["source"]["completeGutenbergMarkers"])


if __name__ == "__main__":
    unittest.main()
