#!/usr/bin/env python3
"""Regression: chapter cards must not reuse the same binary under renamed paths."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from tools import report_chapter_art_progress as report


class PrimaryImageBinaryUniquenessTest(unittest.TestCase):
    def test_rejects_identical_bytes_with_different_filenames(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "images").mkdir()
            payload = b"historical-source-image-test-fixture"
            digest = hashlib.sha256(payload).hexdigest()
            for name in ("first.webp", "renamed.webp"):
                (root / "images" / name).write_bytes(payload)
            chapters = []
            for index, name in enumerate(("first.webp", "renamed.webp"), 1):
                chapters.append({
                    "chapterOneBased": index,
                    "primaryImage": {
                        "imagePath": "images/" + name,
                        "sha256": digest.upper() if index == 2 else digest,
                        "sourceUrl": "https://example.org/archival-plate",
                        "sceneAnchor": "Source passage, chapter " + str(index),
                        "editoriallyApproved": False,
                        "rightsStatus": "PENDING_TERRITORIAL_REVIEW",
                    },
                })
            map_path = root / "chapter-image-map.json"
            map_path.write_text(json.dumps({
                "schemaVersion": 1,
                "chapterCount": 2,
                "chapters": chapters,
            }), encoding="utf-8")
            with patch.object(report, "ROOT", root):
                with self.assertRaisesRegex(ValueError, "binary was reused"):
                    report.map_coverage(map_path, 2)


if __name__ == "__main__":
    unittest.main()
