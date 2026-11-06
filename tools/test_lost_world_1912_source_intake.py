#!/usr/bin/env python3
"""Strict original 1912 Conan Doyle Lost World plate archive provenance test."""
import ast
import re
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / "tools/intake_lost_world_original_1912_plate_gallery.py"

def constants():
    tree = ast.parse(FILE.read_text("utf-8"))
    got = {}
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        for target in node.targets:
            if isinstance(target, ast.Attribute) and target.attr in (
                "SOURCE_CATEGORY", "ORIGINAL_YEAR", "OUTPUT_PREFIX", "PERIOD_NAME"):
                got[target.attr] = (ast.literal_eval(node.value.args[0])
                                    if target.attr == "PERIOD_NAME"
                                    else ast.literal_eval(node.value))
    return got


class LostWorldOriginal1912PlateTests(unittest.TestCase):
    def test_whitelist_real_ten_original_1912_illustrations_only(self):
        info = constants()
        self.assertEqual(info["SOURCE_CATEGORY"], "Category:The Lost World")
        self.assertEqual(info["ORIGINAL_YEAR"], 1912)
        pattern = re.compile(info["PERIOD_NAME"], re.IGNORECASE)
        approved_source_names = (
            "Page 55 (The Lost World, 1912)", "Page 59 (The Lost World. 1912)",
            "Page 142 (The Lost World, 1912)", "Page 161 (The Lost World, 1912)",
            "Page 187 (The Lost World, 1912)", "Page 195 (The Lost World, 1912)",
            "Page 222 (The Lost World, 1912)", "Page 311 (The Lost World, 1912)",
            "General view of plateau from top of gingho tree, page 225 (The Lost World, 1912)",
            "The Celestial Lake, page 299 (The Lost World, 1912)")
        self.assertEqual(len(approved_source_names), 10)
        for image in approved_source_names:
            with self.subTest(illustration=image):
                self.assertTrue(pattern.fullmatch("File:" + image + ".jpg"))
        for other in ("Cover (The Lost World, 1912)", "Frontispiece (The Lost World, 1912)",
                      "The Lost World map Swedish 1924", "Page 333 (The Lost World, 1912)",
                      "The Lost World (2024 film)", "Lost world", "Page 55 (The Lost World, 2021)"):
            self.assertFalse(pattern.fullmatch("File:" + other + ".jpg"))

    def test_actual_binary_hash_and_per_file_rights_are_strictly_required(self):
        original = FILE.read_text("utf-8")
        for token in ("engine.run(max_new)", "finally:", "maintain_provenance()",
                      'image["editoriallyApproved"] = False',
                      'image["rightsStatus"] = "PENDING_',
                      'image["altAr"] = None', 'image["altEn"] = None'):
            self.assertIn(token, original)
        engine = (ROOT / "tools/intake_verne_commons_period_gallery.py").read_text("utf-8")
        for key in ("downloadedResourceSha256", "webpSha256", "individualCommonsLicense",
                    "sourceProofStatus", "PERIOD_NAME.match(name)", "ImageOps.exif_transpose"):
            self.assertIn(key, engine)

    def test_independent_source_writer_does_not_auto_approve_chapter_cards(self):
        flow = (ROOT / ".github/workflows/lost-world-1912-original-plates.yml").read_text("utf-8")
        self.assertIn("cancel-in-progress: false", flow)
        self.assertIn("gh workflow run chapter-art-progress.yml --ref main", flow)
        self.assertIn("git add -f docs/literature/staging/lost-world-original-", flow)
        self.assertNotIn("chapter-image-map.json", flow)
        report = (ROOT / "tools/report_chapter_art_progress.py").read_text("utf-8")
        self.assertIn("unassignedOriginal1912LostWorldImageFiles", report)
        self.assertIn("check_binary(", report)


if __name__ == "__main__":
    unittest.main()
