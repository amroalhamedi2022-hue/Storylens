#!/usr/bin/env python3
"""Strict normalisation of negative visual contradictions; never auto-approve art."""
import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from gemini_suggest_verne_plate_scenes import explicitly_no_visual_contradictions


class IndependentVisualEvidenceParsing(unittest.TestCase):
    def test_explicit_none_answers_mean_no_reported_visual_conflict(self):
        for answer in ("", " ", "None", "none.", "None detected.",
                       "none observed", "No contradictions", "No visual contradictions",
                       "no visible contradictions detected"):
            with self.subTest(answer=answer):
                self.assertTrue(explicitly_no_visual_contradictions(answer))

    def test_mixed_or_ambiguous_language_cannot_pass_review(self):
        for answer in (None, False, 1, "None detected; however the roof is wrong",
                       "None, but the train is a different shape",
                       "No contradictions except absent characters",
                       "Different setting", "There might be none",
                       "No contradictions claimed, but unsure",
                       "No visual contradiction was visible despite swapped people"):
            with self.subTest(answer=answer):
                self.assertFalse(explicitly_no_visual_contradictions(answer))

    def test_false_positive_fix_never_removes_human_and_rights_release_gates(self):
        source = (ROOT / "tools/gemini_suggest_verne_plate_scenes.py").read_text("utf-8")
        self.assertIn('and score >= 0.80', source)
        self.assertIn('and len(cross["specificVisibleEvidence"].strip()) >= 14', source)
        self.assertIn('and explicitly_no_visual_contradictions(cross["visualContradictions"])', source)
        self.assertIn('"publicationApproved": False', source)
        self.assertIn('"rightsVerifiedForTerritories": False', source)
        self.assertIn('"sceneMatchHumanApproved": False', source)
        self.assertIn('if "visualCrosscheck" in record:', source)


if __name__ == "__main__":
    unittest.main()
