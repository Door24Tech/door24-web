import admin from "firebase-admin";

type ServiceAccountConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

let mobileAdminApp: admin.app.App | null = null;
let cachedDb: admin.firestore.Firestore | null = null;
let cachedAuth: admin.auth.Auth | null = null;

const getEnvConfig = (): ServiceAccountConfig | null => {
  const projectId = process.env.APP_DEV_FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.APP_DEV_FIREBASE_CLIENT_EMAIL ?? "";
  const privateKeyRaw = process.env.APP_DEV_FIREBASE_PRIVATE_KEY ?? "";
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Firebase Admin SDK not initialized: missing APP_DEV_FIREBASE_* environment variables."
      );
    }
    return null;
  }

  return { projectId, clientEmail, privateKey };
};

const ensureInitialized = (): boolean => {
  if (mobileAdminApp) {
    return true;
  }

  const config = getEnvConfig();
  if (!config) {
    return false;
  }

  try {
    mobileAdminApp =
      admin.apps.find((app) => app.name === "mobile-admin") ??
      admin.initializeApp(
        {
          credential: admin.credential.cert(config),
        },
        "mobile-admin"
      );
    cachedDb = mobileAdminApp.firestore();
    cachedAuth = mobileAdminApp.auth();
    return true;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    return false;
  }
};

export const getMobileAdminDb = (): admin.firestore.Firestore | null => {
  if (!ensureInitialized()) {
    return null;
  }
  return cachedDb;
};

export const getMobileAdminAuth = (): admin.auth.Auth | null => {
  if (!ensureInitialized()) {
    return null;
  }
  return cachedAuth;
};

export const getMobileAdminFieldValue = ():
  | typeof admin.firestore.FieldValue
  | null => {
  if (!ensureInitialized()) {
    return null;
  }
  return admin.firestore.FieldValue;
};

