# Lingua Tales — first stable signed APK (one-time clean installation)

**Approved 2026-11-02:** This ONE installation may be new. There is **no requirement** to match an older disposable Preview/test signer. The first stable install establishes the permanent Android signer used for every future update.

## Output and security

- Production package: com.storylens.reader, visible app label **Lingua Tales**, version **1.0.0**.
- APK source, CI, tests, checksum and owner-only draft Release live on GitHub.
- The private signing key must NEVER be committed, posted to issues or chats, or uploaded as a public artifact. It is generated once locally on the owner's computer and encrypted in GitHub Actions Secrets. Keep a separate protected backup of the keystore/password; GitHub Secrets cannot be downloaded later.
- The release is kept as a **DRAFT** until separate original art/translation/rights/editorial and physical device checks pass. Do not claim a complete literary library before its full translation and review.

## One-time Windows setup

Install [PowerShell 7](https://learn.microsoft.com/powershell/), [GitHub CLI](https://cli.github.com/) and a JDK 17+ providing keytool, then open a new PowerShell 7 terminal.

If not already logged in:

    gh auth login

In the checked-out repository:

    pwsh -File tools/bootstrap_first_release.ps1

Or if the GitHub source is not on this computer yet:

    gh repo clone amroalhamedi2022-hue/Storylens
    Set-Location Storylens
    pwsh -File tools/bootstrap_first_release.ps1

The script automatically:
1. Checks GitHub, keytool and PowerShell 7 availability/authentication.
2. Generates a new permanent RSA-3072 PKCS12 keystore at $HOME/LinguaTales-Private-Signing/lingua-tales-v1.p12, OUTSIDE the repo. It refuses to overwrite an existing signing key.
3. Requests a strong password only in local keytool prompts. In the following helper prompts, enter the same password for store and key (PKCS12).
4. Invokes the existing secure helper to register five secrets via encrypted GitHub Actions Secrets: LT_SIGNING_KEYSTORE_BASE64, LT_SIGNING_STORE_PASSWORD, LT_SIGNING_KEY_ALIAS, LT_SIGNING_KEY_PASSWORD, and pinned public LT_SIGNING_CERT_SHA256. The secrets are transmitted via stdin, never Git or CLI arguments.
5. Dispatches the signed GitHub workflow release_channel=stable-release against main.

If interrupted AFTER the keystore is created, DO NOT run bootstrap again or create a new key. Configure the EXISTING key and trigger manually:

    pwsh -File tools/configure_stable_signing.ps1 -KeystorePath "$HOME/LinguaTales-Private-Signing/lingua-tales-v1.p12" -KeyAlias "lingua-tales-permanent"
    gh workflow run android.yml --repo amroalhamedi2022-hue/Storylens --ref main -f release_channel=stable-release

Securely back up the .p12 file and password outside the repo; this same signing identity is essential for future updates.

## Download the real APK from GitHub

Open [Android workflow](https://github.com/amroalhamedi2022-hue/Storylens/actions/workflows/android.yml) and select the green MANUAL stable-release run, not an ordinary push. Download the **Lingua-Tales-Stable-Signed-Release** artifact and extract its .apk.

The same signed candidate and two metadata files APK_SHA256.txt and APK_INSTALL_IDENTITY.txt are retained in an owner-visible **DRAFT GitHub Release** at [GitHub Releases](https://github.com/amroalhamedi2022-hue/Storylens/releases); drafts are not publicly downloadable.

The pipeline validates the production package, monotonic versionCode, pinned release certificate, Gradle/unit tests, chapter/story/art assets, browser/RTL E2E and the SHA-256 of the downloaded APK. Never treat a disposable Preview QA artifact as the first permanent production app.

## Install once, then update forever with the same signer

1. If the old installation contains saved reading data, vocabulary, chapter progress or bookmarks, export and verify a JSON backup FIRST. Only then uninstall an old com.storylens.reader with a different signer. The scripts never uninstall anything.
2. Install the new signed APK. Verify title, offline reader/dictionary, bilingual text, real historical illustrations, Back, pinch/pan, default silent sound, and saved state. Import the backup only if desired/compatible. A separate com.storylens.reader.preview can remain installed; it is a different app.
3. For ALL future versions, reuse the same five GitHub Secrets and private keystore and keep applicationId com.storylens.reader. GitHub run numbers increment versionCode; the APKs can then be installed as updates on this stable baseline with no uninstall.
4. Physical Pad 5/phone, real 120Hz/thermal performance, source-specific art copyright, natural complete translations and human editorial reviews still require separate acceptance.

Never post signing secrets or a private keystore in ChatGPT, GitHub issues or commits.
