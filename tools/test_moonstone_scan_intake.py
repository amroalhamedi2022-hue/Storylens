#!/usr/bin/env python3
"""No network/dependency-required Moonstone archive and old-image regression."""
import ast
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


def assignments(path):
    tree = ast.parse(path.read_text(encoding="utf-8"))
    items = {}
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for name in node.targets:
                if isinstance(name, ast.Attribute) and name.value.id == "engine":
                    val = node.value
                    if isinstance(val, ast.Call) and name.attr == "PERIOD_NAME":
                        items[name.attr] = ast.literal_eval(val.args[0])
                    elif isinstance(val, ast.Constant):
                        items[name.attr] = val.value
    return items


class MoonstoneHistoricPrintAudit(unittest.TestCase):
    def test_period_folio_only_and_png_magic(self):
        script = ROOT / "tools/intake_moonstone_1874_period_gallery.py"
        s = assignments(script)
        self.assertEqual(s["SOURCE_CATEGORY"], "Category:The Moonstone (1874)")
        self.assertEqual(s["PERIOD_MIME"], "image/png")
        self.assertEqual(s["PERIOD_MAGIC"], b"\x89PNG\r\n\x1a\n")
        self.assertEqual(s["ORIGINAL_YEAR"], 1874)
        allow = re.compile(s["PERIOD_NAME"], re.IGNORECASE)
        self.assertTrue(allow.fullmatch("File:Moonstone novel - pg 470.png"))
        for bad in ("File:The Moonstone cover.jpg", "File:Moonstone novel - pg 0.png",
                    "File:Moonstone novel - pg 470a.png", "File:Random photo.png"):
            self.assertIsNone(allow.fullmatch(bad))

    def test_original_jpeg_engines_unchanged_and_disclaimer(self):
        importer = (ROOT / "tools/intake_verne_commons_period_gallery.py").read_text()
        self.assertIn('PERIOD_MIME = "image/jpeg"', importer)
        self.assertIn("PERIOD_MAGIC = b", importer)
        self.assertIn('if info.get("mime") != PERIOD_MIME:', importer)
        self.assertIn('not raw.startswith(PERIOD_MAGIC)', importer)
        for text in ("downloadedResourceSha256", "webpSha256", "individualCommonsLicense",
                     'image["editoriallyApproved"] = False',
                     "PRINT_SCAN_UNCLASSIFIED_MAY_INCLUDE_TEXT"):
            combined = importer + (ROOT / "tools/intake_moonstone_1874_period_gallery.py").read_text()
            self.assertIn(text, combined)

    def test_workflow_no_automatic_chapter_map_or_signed_app(self):
        flow = (ROOT / ".github/workflows/moonstone-1874-original-scan-intake.yml").read_text()
        self.assertIn("--max-new 12", flow)
        self.assertIn("cancel-in-progress: false", flow)
        self.assertIn("gh workflow run chapter-art-progress.yml", flow)
        self.assertNotIn("chapter-image-map.json", flow)
        self.assertNotIn("app/src/main", flow)


if __name__ == "__main__":
    unittest.main()
