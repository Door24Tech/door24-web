import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const mobileFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_DEV_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_APP_DEV_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_APP_DEV_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_APP_DEV_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId:
    process.env.NEXT_PUBLIC_APP_DEV_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_APP_DEV_FIREBASE_APP_ID ?? "",
};

let mobileApp: FirebaseApp | null = null;
let mobileAuth: Auth | null = null;

export const getMobileClientAuth = (): Auth | null => {
  if (!mobileFirebaseConfig.apiKey) {
    if (typeof window !== "undefined") {
      console.warn(
        "Mobile Firebase client not initialized: missing NEXT_PUBLIC_APP_DEV_FIREBASE_* environment variables."
      );
    }
    return null;
  }

  if (!mobileApp) {
    const existingApp = getApps().find((app) => app.name === "mobile-client");
    mobileApp = existingApp ?? initializeApp(mobileFirebaseConfig, "mobile-client");
  }

  if (!mobileAuth) {
    mobileAuth = getAuth(mobileApp);
  }

  return mobileAuth;
};


