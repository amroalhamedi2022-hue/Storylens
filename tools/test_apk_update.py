#!/usr/bin/env python3
"""Unit cases for actual Android APK install compatibility rules."""
import unittest
from check_apk_update import ApkIdentity, diagnose, parse_badging, parse_signer


class UpdateContractTests(unittest.TestCase):
    def test_parse_aapt_identity(self):
        self.assertEqual(parse_badging("package: name='com.storylens.reader' versionCode='100600' versionName='0.6.0'"),
                         ("com.storylens.reader", 100600))
        with self.assertRaises(ValueError):
            parse_badging("nothing valid")

    def test_certificate_fingerprint(self):
        cert = "f3" * 32
        self.assertEqual(parse_signer("Signer #1 certificate SHA-256 digest: " + cert.upper() +
                                      "\nSigner #1 certificate SHA-1 digest: abcd"), cert)
        with self.assertRaises(ValueError):
            parse_signer("Signer #1 certificate SHA-256 digest: 0123")
        with self.assertRaises(ValueError):
            parse_signer("")

    def test_same_package_and_signing_key_is_updatable(self):
        old = ApkIdentity("com.storylens.reader", 6, "aa" * 32)
        for version in (6, 7, 100001):
            ok, reason = diagnose(old, ApkIdentity("com.storylens.reader", version, old.signer_sha256))
            self.assertTrue(ok, reason)
            self.assertIn("METADATA_COMPATIBLE", reason)

    def test_signer_mismatch_requires_backup_not_silent_reinstall(self):
        old = ApkIdentity("com.storylens.reader", 6, "aa" * 32)
        ok, reason = diagnose(old, ApkIdentity("com.storylens.reader", 100010, "bb" * 32))
        self.assertFalse(ok)
        self.assertIn("SIGNATURE_MISMATCH", reason)
        self.assertIn("BEFORE any uninstall", reason)

    def test_downgrade_and_distinct_package(self):
        old = ApkIdentity("com.storylens.reader", 100010, "aa" * 32)
        ok, reason = diagnose(old, ApkIdentity("com.storylens.reader", 6, old.signer_sha256))
        self.assertFalse(ok)
        self.assertIn("VERSION_DOWNGRADE", reason)
        ok, reason = diagnose(old, ApkIdentity("com.storylens.reader.preview", 100020, old.signer_sha256))
        self.assertFalse(ok)
        self.assertIn("DIFFERENT_PACKAGE", reason)


if __name__ == "__main__":
    unittest.main(verbosity=2)
