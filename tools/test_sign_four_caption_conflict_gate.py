#!/usr/bin/env python3
"""Detect Gemini overconfidence where the original image caption points elsewhere."""
from __future__ import annotations
import copy
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from reconcile_sign_four_historic_caption_conflict import (
    load_caption_leads, downgraded_record, reconcile, CONFLICT, REVIEWS
)


class TownsendHistoricalCaptionConflict(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lead = load_caption_leads()[0]
        cls.record_path = REVIEWS / "8ecadcc05008471d2e.json"
        cls.record = json.loads(cls.record_path.read_text("utf-8"))

    def test_actual_caption_six_overrules_model_five_without_publishing(self):
        lead, rec = self.lead, self.record
        self.assertEqual(lead["sourceFileName"], "File:Sign-t1.jpg")
        self.assertEqual(lead["candidateChapterOneBased"], 6)
        self.assertEqual(rec["suggestedMatch"]["chapterOneBased"], 5)
        self.assertIn("HISTORICAL_CAPTION", lead["evidenceCategory"])
        self.assertEqual(rec["evidenceStatus"], CONFLICT)
        self.assertFalse(rec["visualCrosscheck"]["passesConservativeModelComparison"])
        self.assertTrue(rec["visualCrosscheck"]["historicCaptionDisagreementBlocksSceneSupport"])
        self.assertFalse(rec["publicationApproved"])
        self.assertFalse(rec["sceneMatchHumanApproved"])
        self.assertFalse(rec["rightsVerifiedForTerritories"])
        item = rec["historicalCaptionConflictReview"]
        self.assertEqual(item["captionTextMatchesOriginalChapterOneBased"], 6)
        self.assertEqual(item["geminiSuggestedChapterOneBased"], 5)
        self.assertTrue(item["candidateChapterConflict"])
        self.assertTrue(item["modelOriginallySupportedWithoutCaption"])
        self.assertFalse(item["original1903PrintedCaptionIndependentlyVerified"])
        self.assertFalse(item["humanEditorialReconciliationComplete"])
        self.assertFalse(item["approvedForChapterCard"])
        self.assertEqual(downgraded_record(rec, lead), rec)
        self.assertEqual(reconcile(write=False)["newOrChangedRecords"], 0)

    def test_conflict_handler_corrects_old_overconfident_source_only_record(self):
        old = copy.deepcopy(self.record)
        old.pop("historicalCaptionConflictReview")
        old["evidenceStatus"] = "EXACT_ORIGINAL_QUOTE_AND_SECOND_IMAGE_MODEL_SUPPORT__NOT_HUMAN_APPROVED"
        old["visualCrosscheck"]["passesConservativeModelComparison"] = True
        old["visualCrosscheck"].pop("historicCaptionDisagreementBlocksSceneSupport")
        corrected = downgraded_record(old, self.lead)
        self.assertEqual(corrected, self.record)
        self.assertEqual(old["suggestedMatch"], corrected["suggestedMatch"])
        self.assertFalse(corrected["rightsVerifiedForTerritories"])

    def test_no_fake_common_caption_and_no_approval_on_matching_lead(self):
        rec = copy.deepcopy(self.record)
        rec["suggestedMatch"]["chapterOneBased"] = 6
        rec.pop("historicalCaptionConflictReview")
        rec["visualCrosscheck"].pop("historicCaptionDisagreementBlocksSceneSupport")
        output = downgraded_record(rec, self.lead)
        self.assertFalse(output["historicalCaptionConflictReview"]["candidateChapterConflict"])
        self.assertFalse(output["historicalCaptionConflictReview"]["approvedForChapterCard"])
        self.assertFalse(output["historicalCaptionConflictReview"]["original1903PrintedCaptionIndependentlyVerified"])
        for name, change in (
            ("claimed-image-rights", lambda x: x.__setitem__("rightsVerifiedForTerritories", True)),
            ("claimed-editorial-approval", lambda x: x.__setitem__("sceneMatchHumanApproved", True)),
            ("mismatched-file", lambda x: x.__setitem__("imageSha256", "0"*64)),
        ):
            with self.subTest(name=name):
                bad = copy.deepcopy(rec)
                change(bad)
                with self.assertRaises(ValueError):
                    downgraded_record(bad, self.lead)


if __name__ == "__main__":
    unittest.main()
