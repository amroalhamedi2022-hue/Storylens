#!/usr/bin/env python3
"""Regression: all original-source report regex references must resolve at runtime."""
import ast
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "tools/report_chapter_art_progress.py"

class ReporterRegexRegression(unittest.TestCase):
    def test_regex_is_imported_before_wells_source_verification(self):
        tree = ast.parse(REPORT.read_text(encoding="utf-8"))
        imports = [n for n in tree.body if isinstance(n, ast.Import)]
        self.assertIn("re", [alias.name for node in imports for alias in node.names])
        refs = [n for n in ast.walk(tree) if isinstance(n, ast.Attribute)
                and isinstance(n.value, ast.Name) and n.value.id == "re"]
        self.assertGreaterEqual(len(refs), 2)

    def test_real_wells_narrative_file_whitelist(self):
        pattern = r"(?:chapter-[12]-[0-9]+|book-[12]|dedication|epigraph)\.xhtml"
        for good in ("chapter-1-1.xhtml", "chapter-2-9.xhtml", "book-1.xhtml", "epigraph.xhtml"):
            self.assertIsNotNone(re.fullmatch(pattern, good))
        for bad in ("../../private", "chapter-1-1.xhtml.jpg", "chapter-3-1.xhtml"):
            self.assertIsNone(re.fullmatch(pattern, bad))

if __name__ == "__main__":
    unittest.main()
