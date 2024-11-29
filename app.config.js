import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default {
  expo: {
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
    },
    name: "SmartApp",
    slug: "SmartApp",
    scheme: "smartapp",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    newArchEnabled: true,
    ios: {
      newArchEnabled: true,
      supportsTablet: true,
    },
    android: {
      newArchEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.malex3334.SmartApp",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
          ios: {
            flipper: true,
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "3c04875b-d592-439c-833f-19606e6ea8e5",
      },
      // Add your environment variables here if needed
      USER_NAME: process.env.USER_NAME,
      USER_PASSWORD: process.env.USER_PASSWORD,
      WEATHERAPI_KEY: process.env.WEATHERAPI_KEY,
      FIREBASE_KEY: process.env.FIREBASE_KEY,
      AUTHDOMAIN: process.env.AUTHDOMAIN,
      DATABASE_URL: process.env.DATABASE_URL,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    },
  },
};
