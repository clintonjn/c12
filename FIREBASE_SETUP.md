# Firebase Setup Guide

## Prerequisites

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication and Firestore Database

## Android Setup

### 1. Download google-services.json

- In Firebase Console, go to Project Settings
- Download `google-services.json` for Android
- Place it in `android/app/google-services.json`

### 2. Update android/build.gradle

Add to dependencies:

```gradle
classpath 'com.google.gms:google-services:4.3.15'
```

### 3. Update android/app/build.gradle

Add at the top:

```gradle
apply plugin: 'com.google.gms.google-services'
```

## iOS Setup

### 1. Download GoogleService-Info.plist

- In Firebase Console, download `GoogleService-Info.plist` for iOS
- Place it in `ios/YourAppName/GoogleService-Info.plist`

### 2. Update ios/Podfile

Ensure minimum iOS version:

```ruby
platform :ios, '11.0'
```

## Firebase Configuration

### Update src/config/firebase.ts

Replace with your actual Firebase config:

```typescript
export const firebaseConfig = {
  apiKey: 'your-actual-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-actual-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'your-sender-id',
  appId: 'your-app-id',
};
```

## Enable Authentication Methods

In Firebase Console:

1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google (optional)

## Enable Firestore

In Firebase Console:

1. Go to Firestore Database
2. Create database in test mode
3. Set up security rules as needed

## Build Commands

After setup:

```bash
# Clean and rebuild
npm run prebuild:dev
npm run run:dev
```

## Testing

- Register a new user
- Login with existing user
- Check Firestore for user data
- Verify authentication state persistence
