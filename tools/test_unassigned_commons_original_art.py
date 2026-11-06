#!/usr/bin/env python3
"""Adversarial offline Commons source-art integrity checks (never reader approval)."""
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from audit_unassigned_commons_original_art import audit, check_archive, is_trusted_https


class OriginalArchiveAudit(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.folder = self.root / "docs/literature/staging/test-original-archive"
        (self.folder / "plates").mkdir(parents=True)
        self.raw = b"RIFF" + (4).to_bytes(4, "little") + b"WEBP" + b"VP8 " + b"fake_fixture_bytes"
        (self.folder / "plates/real.webp").write_bytes(self.raw)
        self.manifest = {
            "category": "Category:Historic original plates",
            "categoryURL": "https://commons.wikimedia.org/wiki/Category:Historic_original_plates",
            "publicationApproved": False, "chapterSceneMatchingComplete": False,
            "images": [{
                "wikiFile": "File:Original period illustration.jpg",
                "localPath": "plates/real.webp",
                "webpSha256": hashlib.sha256(self.raw).hexdigest(),
                "webpBytes": len(self.raw),
                "originalCommonsSHA1MetadataOnly": "a"*40,
                "commonsPage": "https://commons.wikimedia.org/wiki/File:Original_period_illustration.jpg",
                "commonsOriginalImageURL": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Original.jpg",
                "downloadURL": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Original.jpg",
                "individualCommonsLicense": "Public domain",
                "sourceProofStatus": "INDIVIDUAL_COMMONS_METADATA_AND_HASH_RECORDED",
                "recolouring": False, "cropped": False, "publishedToApp": False,
                "editoriallyApproved": False,
            }]
        }
        self.write()

    def write(self):
        (self.folder / "manifest.json").write_text(json.dumps(self.manifest), "utf-8")

    def test_real_sha_original_source_and_no_publication_pass(self):
        self.assertEqual(len(check_archive(self.folder / "manifest.json", self.root)), 1)
        result = audit(self.root)
        self.assertEqual(result["verifiedOriginalImageFiles"], 1)
        self.assertEqual(result["approvedImagesByThisAudit"], 0)

    def test_tampered_original_webp_is_rejected(self):
        (self.folder / "plates/real.webp").write_bytes(self.raw + b"tampered")
        with self.assertRaisesRegex(ValueError, "hash"):
            audit(self.root)

    def test_source_provenance_must_be_real_commons_not_phishing(self):
        for field, bad in (("commonsPage", "https://commons.wikimedia.org.evil.test/File"),
                           ("commonsOriginalImageURL", "http://upload.wikimedia.org/unsafe"),
                           ("downloadURL", "https://user@upload.wikimedia.org/file"),
                           ("individualCommonsLicense", "")):
            with self.subTest(field=field):
                orig = self.manifest["images"][0][field]
                self.manifest["images"][0][field] = bad
                self.write()
                with self.assertRaises(ValueError):
                    audit(self.root)
                self.manifest["images"][0][field] = orig
                self.write()

    def test_path_escape_and_unauthorised_publication_rejected(self):
        for field, value in (("localPath", "../outside.webp"),
                             ("publishedToApp", True), ("recolouring", True),
                             ("cropped", True), ("editoriallyApproved", True),
                             ("sourceProofStatus", "UNVERIFIED")):
            with self.subTest(field=field):
                old = self.manifest["images"][0][field]
                self.manifest["images"][0][field] = value
                self.write()
                with self.assertRaises(ValueError):
                    audit(self.root)
                self.manifest["images"][0][field] = old
                self.write()

    def test_duplicate_original_image_not_counted_twice(self):
        self.manifest["images"].append(dict(self.manifest["images"][0]))
        self.write()
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            audit(self.root)

    def test_url_validation_and_missing_category_fail_closed(self):
        self.assertFalse(is_trusted_https("https://commons.wikimedia.org.evil.org/foo", "commons.wikimedia.org"))
        self.assertFalse(is_trusted_https("http://commons.wikimedia.org/wiki/File:foo", "commons.wikimedia.org"))
        self.assertTrue(is_trusted_https("https://commons.wikimedia.org/wiki/File:foo", "commons.wikimedia.org"))
        self.manifest["publicationApproved"] = True
        self.write()
        with self.assertRaisesRegex(ValueError, "rights"):
            audit(self.root)


if __name__ == "__main__":
    unittest.main()
