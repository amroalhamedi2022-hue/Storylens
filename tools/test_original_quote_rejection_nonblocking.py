#!/usr/bin/env python3
"""Prevent one hallucinated image-to-prose quote stalling all scheduled source art."""
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from gemini_suggest_verne_plate_scenes import supported_exact_source_selection


class ExactQuoteNonBlockingValidation(unittest.TestCase):
    def setUp(self):
        self.rows = [{"chapterOneBased": 1, "paragraphIndexZeroBased": 5,
                      "englishSource": "The observatory held a telescope and a dimly glowing lamp."},
                     {"chapterOneBased": 2, "paragraphIndexZeroBased": 1,
                      "englishSource": "He travelled in a train through the snowy hills."}]
        self.truthful = {"imageSceneMatchesSource": True,
                         "chapterOneBased": 1, "paragraphIndexZeroBased": 5,
                         "exactSourceQuotation": "observatory held a telescope",
                         "confidence": .85, "rationale": "Observed scene",
                         "suggestedAltAr": ""}

    def test_real_original_contiguous_quotation_is_accepted_as_suggestion_only(self):
        selected = supported_exact_source_selection(self.truthful, self.rows)
        self.assertEqual(selected, {"chapterOneBased": 1, "paragraphIndexZeroBased": 5,
                                    "exactSourceQuotation": "observatory held a telescope"})
        self.assertNotIn("editoriallyApproved", selected)

    def test_hallucinated_words_are_rejected_without_crash(self):
        for bad in ("observatory held a train", "unrelated scene",
                    "The invisible man", "An original quote that is not in prose", ""):
            with self.subTest(quote=bad):
                self.assertIsNone(supported_exact_source_selection(
                    {**self.truthful, "exactSourceQuotation": bad}, self.rows))

    def test_wrong_chapter_paragraph_and_fake_confidence_are_rejected(self):
        for changes in ({"chapterOneBased": 2}, {"paragraphIndexZeroBased": 999},
                        {"chapterOneBased": True}, {"paragraphIndexZeroBased": "5"},
                        {"confidence": -1}, {"confidence": 1.1},
                        {"confidence": True}, {"confidence": "0.95"},
                        {"exactSourceQuotation": None},
                        {"imageSceneMatchesSource": False}):
            with self.subTest(changes=changes):
                self.assertIsNone(supported_exact_source_selection(
                    {**self.truthful, **changes}, self.rows))

    def test_missing_model_values_fail_closed(self):
        for key in ("chapterOneBased", "paragraphIndexZeroBased", "exactSourceQuotation",
                    "confidence", "imageSceneMatchesSource"):
            value = dict(self.truthful)
            value.pop(key)
            self.assertIsNone(supported_exact_source_selection(value, self.rows))

    def test_unsafe_art_can_never_be_published(self):
        src = (ROOT / "tools/gemini_suggest_verne_plate_scenes.py").read_text("utf-8")
        self.assertIn('"modelOriginalQuotationRejected"] = True', src)
        self.assertIn("INVALID_MODEL_SOURCE_QUOTE_REJECTED_NONPUBLISHABLE", src)
        self.assertNotIn('raise ValueError("Gemini match lacks a verified exact original excerpt', src)
        self.assertIn('"rightsVerifiedForTerritories": False', src)
        self.assertIn('"sceneMatchHumanApproved": False', src)
        self.assertIn('"publicationApproved": False', src)
        self.assertIn("visual_crosscheck(", src)


if __name__ == "__main__":
    unittest.main()
