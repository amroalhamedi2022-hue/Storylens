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
        self.assertEqual(doc["localCandidateChapters"], 0)
        self.assertEqual(doc["missingCandidateChapters"], 62)
        self.assertEqual(doc["readyForUICards"], 0)
        self.assertFalse(doc["releaseApproved"])
        self.assertEqual([u["chapterOneBased"] for u in doc["chapters"]],
                         list(range(1, 63)))
        self.assertTrue(all(u["primaryImage"] is None and u["titleAr"] == ""
                            for u in doc["chapters"]))

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
