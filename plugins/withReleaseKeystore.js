import { withAppBuildGradle, withGradleProperties } from '@expo/config-plugins';

const withReleaseKeystore = (config) => {
  // 1. Inject gradle.properties values
  config = withGradleProperties(config, (config) => {
    const props = config.modResults;

    const setProp = (key, value) => {
      const existing = props.find((p) => p.key === key);
      if (existing) {
        existing.value = value;
      } else {
        props.push({ type: 'property', key, value });
      }
    };

    setProp('MYAPP_RELEASE_STORE_FILE', '../../keystores/my-release-key-keystore');
    setProp('MYAPP_RELEASE_KEY_ALIAS', process.env.RELEASE_KEY_ALIAS || '');
    setProp('MYAPP_RELEASE_STORE_PASSWORD', process.env.RELEASE_STORE_PASSWORD || '');
    setProp('MYAPP_RELEASE_KEY_PASSWORD', process.env.RELEASE_KEY_PASSWORD || '');

    return config;
  });

  // 2. Inject signingConfigs + buildTypes into build.gradle
  config = withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('MYAPP_RELEASE_STORE_FILE')) {
      contents = contents.replace(
        /signingConfigs\s*{/,
        `signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }`
      );

      contents = contents.replace(
        /release\s*{\s*signingConfig signingConfigs\.debug/,
        `release {
            signingConfig signingConfigs.release`
      );
    }

    config.modResults.contents = contents;
    return config;
  });

  return config;
};

module.exports = withReleaseKeystore;