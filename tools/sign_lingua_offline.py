#!/usr/bin/env python3
"""Sign CI-proven unsigned release with the privately retained Lingua Tales key.

Usage:
  python sign_lingua_offline.py <GitHub-unsigned-artifact.zip> \
      <private-key.p12> <recovery-password-file> <output-dir>

Never write private keys or passwords to GitHub's public repo.
"""
from __future__ import annotations
import hashlib
import os
import re
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from tempfile import TemporaryDirectory
from cryptography import x509
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.serialization import pkcs12

EXPECTED_SHA = '55a48790eb769d7ab663874ca3bd4b25d7a2c85d'
EXPECTED_PKG = 'com.storylens.reader'
REQUIRED = ['assets/index.html','assets/reader-experience.js','assets/data-backup.js',
            'assets/lingua-lookup.js','assets/lingua-shell.js','assets/licensed-audio/manifest.json']


def h(path: Path) -> str:
    obj=hashlib.sha256()
    with path.open('rb') as f:
        while chunk := f.read(1024*1024): obj.update(chunk)
    return obj.hexdigest()


def one(zip_file: zipfile.ZipFile, suffix: str) -> str:
    choices=[name for name in zip_file.namelist() if name == suffix or name.endswith('/'+suffix)]
    if len(choices) != 1:
        raise ValueError(f'expected exactly one {suffix}, got {choices}')
    return choices[0]


def sign(archive: Path, keystore: Path, recovery: Path, output: Path):
    text = recovery.read_text('utf8')
    m=re.search(r'Store password and key password: (\S+)',text)
    if not m: raise ValueError('private recovery password unavailable')
    password=m.group(1)
    pwd=password.encode()
    private, cert, others=pkcs12.load_key_and_certificates(keystore.read_bytes(),pwd)
    if not private or not cert: raise ValueError('private key or cert missing')
    fingerprint=cert.fingerprint(hashes.SHA256()).hex()
    output.mkdir(parents=True,exist_ok=True)
    with TemporaryDirectory() as td:
        d=Path(td)
        with zipfile.ZipFile(archive) as z:
            sources={s:one(z,s) for s in ('APK_SHA256.txt','UNSIGNED_APK_IDENTITY.txt','apksigner.jar')}
            apks=[n for n in z.namelist() if n.endswith('.apk')]
            if len(apks)!=1: raise ValueError(f'exactly one production APK required: {apks}')
            for key,name in sources.items():
                (d/key).write_bytes(z.read(name))
            (d/'unsigned.apk').write_bytes(z.read(apks[0]))
        ident=(d/'UNSIGNED_APK_IDENTITY.txt').read_text('utf8')
        for marker in ('variant=unsigned-production','signing=NONE',
                       'artifact_is_NOT_installable=TRUE',
                       f'commit={EXPECTED_SHA}',f"name='{EXPECTED_PKG}'"):
            if marker not in ident: raise ValueError('unsigned source identity mismatch: '+marker)
        code_match=re.search(r"versionCode='(\d+)'",ident)
        if not code_match: raise ValueError('missing unsigned release versionCode')
        code=code_match.group(1)
        sourcehash=(d/'APK_SHA256.txt').read_text('utf8').split()[0]
        if sourcehash != h(d/'unsigned.apk'): raise ValueError('unsigned CI artifact SHA mismatch')
        java=['java','-jar',str(d/'apksigner.jar')]
        v=subprocess.run(java+['verify','--verbose',str(d/'unsigned.apk')],capture_output=True,text=True)
        if v.returncode==0: raise ValueError('unexpectedly signed source APK')
        dest=output/'Lingua-Tales-1.0.0-Official-SIGNED.apk'
        env=os.environ.copy()
        env['LINGUA_LOCAL_SIGNING_PASSWORD']=password
        result=subprocess.run(java+[
            'sign','--min-sdk-version','26',
            '--ks',str(keystore),'--ks-key-alias','lingua-tales-permanent',
            '--ks-pass','env:LINGUA_LOCAL_SIGNING_PASSWORD',
            '--key-pass','env:LINGUA_LOCAL_SIGNING_PASSWORD',
            '--out',str(dest),str(d/'unsigned.apk')],capture_output=True,text=True,env=env)
        if result.returncode: raise RuntimeError(f'apksigner sign failed: {result.stderr[-2000:]}')
        verify=subprocess.run(java+['verify','--verbose','--print-certs',str(dest)],capture_output=True,text=True)
        if verify.returncode: raise RuntimeError(f'apksigner verification failed: {verify.stderr[-2000:]}')
        digest=re.search(r'Signer #1 certificate SHA-256 digest: ([0-9a-fA-F:]+)',verify.stdout)
        if not digest or digest.group(1).replace(':','').lower()!=fingerprint:
            raise ValueError('signed APK certificate does not match permanent private key')
        with zipfile.ZipFile(dest) as z,zipfile.ZipFile(d/'unsigned.apk') as orig:
            for name in REQUIRED:
                if name not in z.namelist() or name not in orig.namelist():
                    raise ValueError('missing critical reader file '+name)
                if z.read(name)!=orig.read(name):
                    raise ValueError('signing altered offline source file: '+name)
        metadata=output/'Lingua-Tales-1.0.0-APK-VERIFICATION.txt'
        metadata.write_text('\n'.join([
            'Lingua Tales first independently signed Android production APK',
            f'source_commit={EXPECTED_SHA}',
            'source_ci_run=41642200812',
            f'package={EXPECTED_PKG}',
            f'version_name=1.0.0',
            f'version_code={code}',
            'signing=RSA3072-PKCS12-permanent-new-first-install',
            f'signing_cert_sha256={fingerprint}',
            f'apk_sha256={h(dest)}',
            f'apk_bytes={dest.stat().st_size}',
            f'signed_at_utc={datetime.now(timezone.utc).isoformat()}',
            f'updatable_with_same_private_signer=true',
            'installation_on_real_device=NOT_TESTED',
            'content_rights_and_bilingual_editorial_review=NOT_COMPLETE',
            'private_key_saved_separately=ChatGPT_Library/Lingua_Tales/Private_Signing',
            '',
            verify.stdout,
        ]),'utf8')
        print('SIGNED APK VERIFIED',dest,'sha256=',h(dest),'cert=',fingerprint,'versionCode=',code)
        return dest,metadata

if __name__=='__main__':
    if len(sys.argv)!=5: raise SystemExit(__doc__)
    sign(*map(Path,sys.argv[1:]))