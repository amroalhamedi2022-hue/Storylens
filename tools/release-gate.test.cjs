'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');

const gradle = fs.readFileSync('app/build.gradle.kts','utf8');
const workflow = fs.readFileSync('.github/workflows/android.yml','utf8');
const manifest = fs.readFileSync('app/src/main/AndroidManifest.xml','utf8');
const signingDocs = fs.readFileSync('docs/ANDROID_UPDATE_SIGNING.md','utf8');

assert.match(gradle,/applicationId = "com\.storylens\.reader"/,
 'Final update retains the original Android identity');
assert.match(gradle,/versionName = "1\.0\.0"/,'stable baseline is version 1.0.0');
assert.match(gradle,/100_000 \+ ltCiRun/,'future updates retain monotonic GitHub versionCode');
assert.match(gradle,/applicationIdSuffix = "\.preview"/,
 'disposable QA builds must stay separate from the real app');
assert.match(gradle,/if \(hasLtStableSigning\) signingConfig = signingConfigs\.getByName\("stableRelease"\)/,
 'stable release uses retained private key, never an ephemeral CI key');
assert.match(gradle,/manifestPlaceholders\["ltAppLabel"\] = "Lingua Tales"/,
 'user-visible name remains Lingua Tales');
assert.match(manifest,/android:label="\$\{ltAppLabel\}"/,
 'manifest label remains derived from official brand');
assert.match(workflow,/workflow_dispatch:\s+inputs:\s+release_channel:/,
 'manual, intentional signed release request required');
assert.match(workflow,/\s+- stable-release\s/,
 'stable-release must be an explicit workflow input choice');
assert.match(workflow,/LT_RELEASE_REQUESTED: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\.release_channel == 'stable-release' \}\}/,
 'stable signing uses the exact manual workflow input');
assert.match(workflow,/LT_SIGNING_CERT_SHA256: \$\{\{ secrets\.LT_SIGNING_CERT_SHA256 \}\}/,
 'signer pin cannot be silently removed');
assert.match(workflow,/\[ "\$LT_RELEASE_REQUESTED" = "true" \] && \[ -z "\$LT_SIGNING_CERT_SHA256" \]/,
 'a final release must fail if its certificate pin is absent');
assert.match(workflow,/\[ "\$LT_RELEASE_REQUESTED" = "true" \] && \[ "\$configured" -ne 4 \]/,
 'a final release must fail without all four private signing secrets');
assert.match(workflow,/\[ "\$fingerprint" = "\$expected" \]/,
 'actual APK signer must match the pinned certificate');
assert.match(workflow,/expected_code=\$\(\(100000 \+ GITHUB_RUN_NUMBER\)\)/,
 'actual Android package must have CI monotonic versionCode');
assert.match(workflow,/name: Verify signed release contains the same complete offline reader/,
 'only signed release containing identical tested book assets can ship');
assert.match(workflow,/test "\$\(unzip -p "\$PREVIEW" "assets\/\$file" \| sha256sum/,
 'release parity checks actual packaged bytes rather than source-only files');
assert.match(workflow,/if: success\(\) && env\.LT_SIGNING_KEYSTORE != '' && github\.event_name == 'workflow_dispatch' && inputs\.release_channel == 'stable-release'/,
 'production APK artifact may be uploaded only on a signed manual stable release');
assert.match(workflow,/if: success\(\) && !\(github\.event_name == 'workflow_dispatch' && inputs\.release_channel == 'stable-release'\)/,
 'final user-facing workflow must not offer Preview as the release');
assert.match(signingDocs,/DO NOT uninstall|Do NOT uninstall|NEVER remove production/,
 'existing user data must never be discarded for a signing conflict');
console.log('PASS: v1.0 production identity, explicit stable signing gate, package and SHA parity, separate Preview, no destructive update');
