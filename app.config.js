const ENV = process.env.ENVIRONMENT;

const getAppName = () => {
  switch (ENV) {
    case 'dev':
      return 'C12 Dev';
    case 'staging':
      return 'C12 Staging';
    case 'preproduction':
      return 'C12 PreProd';
    case 'production':
      return 'C12';
    default:
      return 'C12 Dev';
  }
};

const getPackageId = () => {
  switch (ENV) {
    case 'dev':
      return 'com.c12.dev';
    case 'staging':
      return 'com.c12.staging';
    case 'preproduction':
      return 'com.c12.preprod';
    case 'production':
      return 'com.c12';
    default:
      return 'com.c12.dev';
  }
};

// Option 1: Same icon with different background colors (current approach)
const getIconColor = () => {
  switch (ENV) {
    case 'dev':
      return '#ff6b35'; // Orange
    case 'staging':
      return '#4ecdc4'; // Teal
    case 'preproduction':
      return '#d145beff'; // Purple
    case 'production':
      return '#ffffff'; // White
    default:
      return '#ff6b35';
  }
};

// Option 2: Completely different icons for each environment (alternative approach)
// Uncomment this function and update the export below to use different icons
// const getIcon = () => {
//   switch (ENV) {
//     case 'dev': return './assets/icon-dev.png';
//     case 'staging': return './assets/icon-staging.png';
//     case 'preproduction': return './assets/icon-preprod.png';
//     case 'production': return './assets/icon-prod.png';
//     default: return './assets/icon-dev.png';
//   }
// };

export default {
  expo: {
    name: getAppName(),
    slug: 'c12',
    version: '1.0.0',

    // Current: Same icon with colored backgrounds
    icon: './assets/mobile-development.png',
    // Alternative: Different icons per environment
    // icon: getIcon(),

    android: {
      package: getPackageId(),

      // Current: Adaptive icon with colored background
      adaptiveIcon: {
        foregroundImage: './assets/mobile-development.png',
        backgroundColor: getIconColor(),
      },
      // Alternative: Different icons per environment
      // icon: getIcon(),
    },
    ios: {
      bundleIdentifier: getPackageId(),

      // Current: Same icon for iOS
      icon: './assets/mobile-development.png',
      // Alternative: Different icons per environment
      // icon: getIcon(),
    },
  },
};
