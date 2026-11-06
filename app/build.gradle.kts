import java.io.File

plugins { id("com.android.application") }

val ltSigningStore = System.getenv("LT_SIGNING_KEYSTORE")
val ltSigningStorePassword = System.getenv("LT_SIGNING_STORE_PASSWORD")
val ltSigningAlias = System.getenv("LT_SIGNING_KEY_ALIAS")
val ltSigningKeyPassword = System.getenv("LT_SIGNING_KEY_PASSWORD")
// GitHub Actions generates a new run number for each build. Keep this
// monotonically increasing for sideloaded updates (versionCode regression
// would cause INSTALL_FAILED_VERSION_DOWNGRADE even with a matching signer).
// Local developers without GitHub metadata retain the compatible v1 baseline code.
val ltCiRun = System.getenv("GITHUB_RUN_NUMBER")?.toIntOrNull()?.takeIf { it in 1..1_000_000 }
val ltVersionCode = if (ltCiRun != null) 100_000 + ltCiRun else 6

val hasLtStableSigning = !ltSigningStore.isNullOrBlank() &&
    !ltSigningStorePassword.isNullOrBlank() &&
    !ltSigningAlias.isNullOrBlank() &&
    !ltSigningKeyPassword.isNullOrBlank() &&
    File(ltSigningStore ?: "").isFile
android {
    namespace = "com.storylens.reader"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.storylens.reader"
        minSdk = 26
        targetSdk = 35
        versionCode = ltVersionCode
        versionName = "1.0.0"
        manifestPlaceholders["ltAppLabel"] = "Lingua Tales"
    }
    signingConfigs {
        if (hasLtStableSigning) {
            create("stableRelease") {
                storeFile = file(ltSigningStore!!)
                storePassword = ltSigningStorePassword
                keyAlias = ltSigningAlias
                keyPassword = ltSigningKeyPassword
            }
        }
    }
    buildTypes {
        debug {
            // Runner debug keys change; isolate test installs from user data.
            applicationIdSuffix = ".preview"
            versionNameSuffix = "-preview"
            manifestPlaceholders["ltAppLabel"] = "Lingua Tales"
            // A configured private, retained signing key makes Preview updates
            // compatible across CI runs too. Without it, Gradle's ephemeral
            // Debug signing remains only a disposable side-by-side preview.
            if (hasLtStableSigning) signingConfig = signingConfigs.getByName("stableRelease")
        }
        release {
            manifestPlaceholders["ltAppLabel"] = "Lingua Tales"
            isMinifyEnabled = false
            if (hasLtStableSigning) signingConfig = signingConfigs.getByName("stableRelease")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures { buildConfig = true }
}
dependencies {
    implementation("androidx.activity:activity:1.13.0")
    implementation("androidx.core:core-ktx:1.17.0")
    implementation("androidx.webkit:webkit:1.18.0")
    testImplementation("junit:junit:4.13.2")
}

 
// Generate the approved word-free 3D launcher from its retained historical reference.
// This is a build-time resource only: it does not touch signing, application ID or user data.
// Java source mode avoids an extra image library/download dependency.
val generateTextlessLauncher = tasks.register<Exec>("generateTextlessLauncher") {
    workingDir(rootProject.projectDir)
    commandLine("java", "-Djava.awt.headless=true", "tools/GenerateTextlessLauncher.java")
    inputs.file(rootProject.file("app/src/main/res/drawable-nodpi/lingua_tales_approved.png"))
    inputs.file(rootProject.file("tools/GenerateTextlessLauncher.java"))
    outputs.file(rootProject.file("app/src/main/res/drawable-nodpi/lingua_tales_textless.png"))
}
tasks.matching { it.name == "preBuild" || (it.name.startsWith("merge") && it.name.endsWith("Resources")) }
    .configureEach { dependsOn(generateTextlessLauncher) }
