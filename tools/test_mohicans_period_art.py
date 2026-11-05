#!/usr/bin/env python3
"""Offline, dependency-free regression of genuine Andriolli art source intake."""
import ast
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tools/intake_mohicans_andriolli_period_gallery.py"


def declared_value(name):
    tree = ast.parse(SOURCE.read_text(encoding="utf-8"))
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        if any(isinstance(t, ast.Attribute) and t.attr == name for t in node.targets):
            value = node.value
            if name == "PERIOD_NAME":
                return ast.literal_eval(value.args[0])
            return ast.literal_eval(value)
    raise AssertionError("Missing period-art source declaration: " + name)


class MohicansPeriodIntakeTest(unittest.TestCase):
    def test_category_and_unique_nineteenth_century_plate_whitelist(self):
        self.assertIn("Michał Elwiro Andriolli", declared_value("SOURCE_CATEGORY"))
        name = re.compile(declared_value("PERIOD_NAME"), re.IGNORECASE)
        self.assertTrue(name.fullmatch(
            "File:Le dernier des Mohicans - Cooper James - Andriolli - Huyot - p141 2.jpg"))
        for invalid in ("File:Mohicans film 2025.jpg", "File:Le dernier des Mohicans - p0.jpg",
                        "File:modern remake.jpg", "File:Le dernier des Mohicans - cover.jpg"):
            self.assertIsNone(name.fullmatch(invalid))
        self.assertIsNone(declared_value("ORIGINAL_YEAR"))

    def test_no_approval_and_genuine_archival_hashing_only(self):
        source = SOURCE.read_text(encoding="utf-8")
        self.assertIn('image["editoriallyApproved"] = False', source)
        self.assertIn('image["altEn"] = None', source)
        self.assertIn('image["rightsStatus"] = "PENDING_', source)
        engine = (ROOT / "tools/intake_verne_commons_period_gallery.py").read_text()
        for name in ("originalCommonsSHA1MetadataOnly", "downloadedResourceSha256",
                     "individualCommonsLicense", "PERIOD_NAME.match(name)"):
            self.assertIn(name, engine)

    def test_own_queue_and_provenance_auditor(self):
        workflow = (ROOT / ".github/workflows/mohicans-andriolli-original-art.yml").read_text()
        self.assertIn('gh workflow run chapter-art-progress.yml --ref main', workflow)
        self.assertIn("cancel-in-progress: false", workflow)
        self.assertIn("git add -f docs/literature/staging/mohicans-", workflow)
        self.assertNotIn("chapter-image-map.json", workflow)
        report = (ROOT / "tools/report_chapter_art_progress.py").read_text()
        self.assertIn("unassignedHistoricalAndriolliImageFiles", report)
        self.assertIn('check_binary(', report)


if __name__ == "__main__":
    unittest.main()
