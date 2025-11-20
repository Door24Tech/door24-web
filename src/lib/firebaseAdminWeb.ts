import admin from "firebase-admin";

type ServiceAccountConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

let webAdminApp: admin.app.App | null = null;
let cachedAuth: admin.auth.Auth | null = null;

const getEnvConfig = (): ServiceAccountConfig | null => {
  const projectId = process.env.APP_WEB_FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.APP_WEB_FIREBASE_CLIENT_EMAIL ?? "";
  const privateKeyRaw = process.env.APP_WEB_FIREBASE_PRIVATE_KEY ?? "";
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Firebase Admin SDK (web) not initialized: missing APP_WEB_FIREBASE_* environment variables."
      );
    }
    return null;
  }

  return { projectId, clientEmail, privateKey };
};

const ensureInitialized = (): boolean => {
  if (cachedAuth) {
    return true;
  }

  const config = getEnvConfig();
  if (!config) {
    return false;
  }

  try {
    webAdminApp =
      admin.apps.find((app) => app.name === "web-admin") ??
      admin.initializeApp(
        {
          credential: admin.credential.cert(config),
        },
        "web-admin"
      );

    cachedAuth = webAdminApp.auth();
    return true;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK (web):", error);
    return false;
  }
};

export const getWebAdminAuth = (): admin.auth.Auth | null => {
  if (!ensureInitialized()) {
    return null;
  }
  return cachedAuth;
};


