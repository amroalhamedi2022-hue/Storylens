#!/usr/bin/env python3
"""Regression: archive candidate intake must fail closed before network access."""
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("verne_intake", ROOT / "tools/prepare_verne_plate_intake.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class IntakeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.queue = json.loads(module.QUEUE.read_text(encoding="utf-8"))
        cls.shipped = json.loads(module.EXISTING.read_text(encoding="utf-8"))
        cls.good = {
            "id": cls.queue["queue"][0]["id"],
            "chapterOneBased": cls.queue["queue"][0]["chapterOneBased"],
            "directImageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ab/verified.jpg",
            "independentSourceSha256": "a" * 64,
            "rightsStatus": "PENDING"
        }
    def test_candidate_record(self):
        self.assertEqual(len(module.check_submission([self.good], self.queue, self.shipped)), 4)
    def test_webpage_not_binary(self):
        with self.assertRaises(AssertionError):
            module.check_submission([dict(self.good, directImageUrl=self.queue["queue"][0]["sourcePage"])], self.queue, self.shipped)
    def test_missing_hash(self):
        with self.assertRaises(AssertionError):
            module.check_submission([dict(self.good, independentSourceSha256="")], self.queue, self.shipped)
    def test_no_false_rights_approval(self):
        with self.assertRaises(AssertionError):
            module.check_submission([dict(self.good, rightsStatus="APPROVED")], self.queue, self.shipped)
    def test_no_repeated_candidate(self):
        with self.assertRaises(AssertionError):
            module.check_submission([self.good, self.good], self.queue, self.shipped)
    def test_no_shipped_reimport(self):
        with self.assertRaises(AssertionError):
            module.check_submission([dict(self.good, id=self.shipped[0]["id"])], self.queue, self.shipped)

if __name__ == "__main__":
    unittest.main()
