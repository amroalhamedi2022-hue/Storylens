import java.io.File

plugins { id("com.android.application") }

val ltSigningStore = System.getenv("LT_SIGNING_KEYSTORE")
val ltSigningStorePassword = System.getenv("LT_SIGNING_STORE_PASSWORD")
val ltSigningAlias = System.getenv("LT_SIGNING_KEY_ALIAS")
val ltSigningKeyPassword = System.getenv("LT_SIGNING_KEY_PASSWORD")
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
        versionCode = 6
        versionName = "0.6.0"
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
        release {
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
