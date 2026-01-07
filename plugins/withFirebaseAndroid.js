const {
  withAppBuildGradle,
  withProjectBuildGradle,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFirebaseAndroid(config) {
  // 1️⃣ Copy google-services.json
  config = withDangerousMod(config, [
    'android',
    async config => {
      const src = path.resolve(
        config.modRequest.projectRoot,
        'google-services.json'
      );
      const dest = path.resolve(
        config.modRequest.platformProjectRoot,
        'app/google-services.json'
      );

      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log('✅ Copied google-services.json');
      } else {
        console.warn('⚠️ google-services.json not found in project root');
      }

      return config;
    },
  ]);

  // 2️⃣ Add classpath
  config = withProjectBuildGradle(config, config => {
    if (!config.modResults.contents.includes('google-services')) {
      config.modResults.contents = config.modResults.contents.replace(
        /dependencies\s*{/,
        `dependencies {
        classpath 'com.google.gms:google-services:4.3.15'`
      );
      console.log('✅ Added Google Services classpath');
    }
    return config;
  });

  // 3️⃣ Apply plugin
  config = withAppBuildGradle(config, config => {
    if (
      !config.modResults.contents.includes('com.google.gms.google-services')
    ) {
      config.modResults.contents += `\napply plugin: 'com.google.gms.google-services'`;
      console.log('✅ Added Google Services plugin');
    }
    return config;
  });

  return config;
};
