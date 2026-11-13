"""Regression tests for the visual QA gate, using synthetic images only."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from PIL import Image, ImageDraw

from visual_qa import check, render_pair, validate_name


class VisualQaTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root = Path(self.tmp.name)
        self.actual, self.reference, self.output = root / "actual", root / "references", root / "report"
        for folder in (self.actual, self.reference, self.output):
            folder.mkdir()
        self.name = "gallery/360x760.png"
        for folder in (self.actual, self.reference):
            (folder / "gallery").mkdir()
        self.make_image(self.reference / self.name)
        self.make_image(self.actual / self.name)
        self.config({})

    @staticmethod
    def make_image(path, change=False, size=(100, 100)):
        im = Image.new("RGB", size, "#F2E7D8")
        if change:
            ImageDraw.Draw(im).rectangle((1, 1, 36, 36), fill="#101010")
        im.save(path)

    def config(self, rules):
        (self.reference / "approved.json").write_text(json.dumps({"schema_version": 1, "approved_references": rules}))

    def approval(self, **options):
        digest = hashlib.sha256((self.reference / self.name).read_bytes()).hexdigest()
        self.config({self.name: {"sha256": digest, **options}})

    def test_absence_of_reference_never_means_pass(self):
        report, code = check(self.actual, self.reference, self.output)
        self.assertEqual(code, 0)
        self.assertEqual(report["overall"], "PENDING_REFERENCE")
        self.assertEqual(report["counts"]["PASS"], 0)

    def test_identical_approved_reference_passes_and_writes_evidence(self):
        self.approval()
        report, code = check(self.actual, self.reference, self.output)
        self.assertEqual(code, 0)
        self.assertEqual(report["overall"], "PASS")
        for suffix in ("overlay.png", "diff.png", "side-by-side.png"):
            self.assertTrue((self.output / "gallery" / f"360x760.{suffix}").is_file())

    def test_detects_obvious_visual_change(self):
        self.approval()
        self.make_image(self.actual / self.name, change=True)
        report, code = check(self.actual, self.reference, self.output)
        self.assertEqual(code, 1)
        self.assertEqual(report["overall"], "FAIL")
        self.assertGreater(report["screens"][self.name]["changed_fraction"], .1)

    def test_ignored_region_is_explicit_and_bounded(self):
        self.approval(ignore_rectangles=[[0, 0, 40, 40]])
        self.make_image(self.actual / self.name, change=True)
        report, code = check(self.actual, self.reference, self.output)
        self.assertEqual(code, 0)
        self.assertEqual(report["overall"], "PASS")

    def test_reference_hash_tamper_is_failure(self):
        self.approval()
        self.make_image(self.reference / self.name, change=True)
        report, code = check(self.actual, self.reference, self.output)
        self.assertEqual(code, 1)
        self.assertEqual(report["screens"][self.name]["error"], "Approved reference hash mismatch")

    def test_mismatch_dimensions_fails(self):
        self.make_image(self.actual / self.name, size=(120, 100))
        self.approval()
        report, code = check(self.actual, self.reference, self.output)
        self.assertEqual(code, 1)
        self.assertEqual(report["screens"][self.name]["error"], "image_dimensions_mismatch")

    def test_missing_capture_is_failure_if_approved(self):
        self.approval()
        (self.actual / self.name).unlink()
        self.make_image(self.actual / "another.png")
        report, code = check(self.actual, self.reference, self.output)
        self.assertEqual(code, 1)
        self.assertEqual(report["screens"][self.name]["status"], "FAIL")

    def test_missing_all_captures_is_error(self):
        (self.actual / self.name).unlink()
        with self.assertRaises(ValueError):
            check(self.actual, self.reference, self.output)

    def test_directory_escape_is_rejected(self):
        for name in ("../secret.png", "/tmp/secret.png", "gallery/../secret.png", "bad.jpg"):
            with self.assertRaises(ValueError):
                validate_name(name)

    def test_ignoring_entire_image_cannot_pass(self):
        with self.assertRaises(ValueError):
            render_pair(self.reference / self.name, self.actual / self.name,
                        self.output / "test", {"ignore_rectangles": [[0, 0, 100, 100]]})


if __name__ == "__main__":
    unittest.main()
