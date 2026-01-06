const IS_STAGING = process.env.ENVIRONMENT === 'staging';

export default {
  expo: {
    name: IS_STAGING ? 'C12 Dev' : 'C12',
    slug: 'c12',
    version: '1.0.0',
    android: {
      package: IS_STAGING ? 'com.c12.staging' : 'com.c12',
      adaptiveIcon: {
        backgroundColor: IS_STAGING ? '#ff6b35' : '#ffffff',
      },
    },
    ios: {
      bundleIdentifier: IS_STAGING ? 'com.c12.staging' : 'com.c12',
    },
  },
};
