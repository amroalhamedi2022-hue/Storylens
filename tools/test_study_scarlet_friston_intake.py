#!/usr/bin/env python3
"""Offline proof that only real sourced 1887 Friston plates enter research staging."""
import ast
import re
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools/intake_study_scarlet_friston_1887.py"


def assignments():
    tree = ast.parse(SCRIPT.read_text("utf-8"))
    values = {}
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        for t in node.targets:
            if isinstance(t, ast.Attribute) and t.attr in (
                "SOURCE_CATEGORY", "ORIGINAL_YEAR", "PERIOD_NAME", "OUTPUT_PREFIX"):
                v = node.value
                values[t.attr] = ast.literal_eval(v.args[0]) if t.attr == "PERIOD_NAME" else ast.literal_eval(v)
    return values


class StudyScarletFristonOriginalArtTest(unittest.TestCase):
    def test_original_edition_restricts_artist_and_four_1887_plates(self):
        v = assignments()
        self.assertEqual(v["SOURCE_CATEGORY"], "Category:A Study in Scarlet illustrated by D. H. Friston")
        self.assertEqual(v["ORIGINAL_YEAR"], 1887)
        pattern = re.compile(v["PERIOD_NAME"], re.IGNORECASE)
        for n in range(1, 5):
            self.assertIsNotNone(pattern.fullmatch(f"File:A Study in Scarlet Friston 0{n}.jpg"))
        for bad in ("File:FristonStudyinScarlet1.jpg", "File:A Study in Scarlet Friston 00.jpg",
                    "File:A Study in Scarlet - Frontispiece.png", "File:Sherlock movie 2023.jpg",
                    "File:A Study in Scarlet Friston 05.jpg", "File:Friston-holmes.gif"):
            self.assertIsNone(pattern.fullmatch(bad))

    def test_content_provenance_and_publication_hold(self):
        text = SCRIPT.read_text("utf-8")
        for value in ('image["editoriallyApproved"] = False', 'image["rightsStatus"] = "PENDING_',
                      'image["altAr"] = None', 'image["altEn"] = None',
                      'engine.PERIOD_NAME.fullmatch(image["wikiFile"])',
                      "finally:", "maintain_evidence()"):
            self.assertIn(value, text)
        engine = (ROOT / "tools/intake_verne_commons_period_gallery.py").read_text("utf-8")
        for value in ("originalCommonsSHA1MetadataOnly", "downloadedResourceSha256",
                      "webpSha256", "individualCommonsLicense", "PERIOD_NAME.match(name)"):
            self.assertIn(value, engine)

    def test_source_intake_is_separate_from_chapter_release_and_dispatches_report(self):
        flow = (ROOT / ".github/workflows/study-scarlet-friston-1887-intake.yml").read_text("utf-8")
        self.assertIn('gh workflow run chapter-art-progress.yml --ref main', flow)
        self.assertIn('git add -f docs/literature/staging/study-in-scarlet-friston-', flow)
        self.assertIn("cancel-in-progress: false", flow)
        self.assertNotIn("chapter-image-map.json", flow)
        report = (ROOT / "tools/report_chapter_art_progress.py").read_text("utf-8")
        self.assertIn("unassignedHistorical1887FristonImageFiles", report)
        self.assertIn("check_binary(", report)


if __name__ == "__main__":
    unittest.main()
