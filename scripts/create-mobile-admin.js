#!/usr/bin/env node

/**
 * Creates (or updates) a user record in the door-24-dev Firebase project so you can
 * attach custom claims without giving that user the ability to sign in.
 *
 * Usage:
 *   APP_DEV_FIREBASE_PROJECT_ID=...
 *   APP_DEV_FIREBASE_CLIENT_EMAIL=...
 *   APP_DEV_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *   npm run mobile:create-admin -- --uid <uid> --email crew@example.com --displayName "Crew" [--disabled true]
 */

const admin = require("firebase-admin");

const args = process.argv.slice(2);

const parseArgs = () => {
  const result = {
    uid: "",
    email: "",
    displayName: "",
    disabled: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    const value = args[i + 1];

    if (!value) continue;

    switch (key) {
      case "--uid":
        result.uid = value;
        i += 1;
        break;
      case "--email":
        result.email = value;
        i += 1;
        break;
      case "--displayName":
        result.displayName = value;
        i += 1;
        break;
      case "--disabled":
        result.disabled = value === "true";
        i += 1;
        break;
      default:
        break;
    }
  }

  return result;
};

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
};

const initAdmin = () => {
  if (admin.apps.length) {
    return;
  }

  const projectId = requireEnv("APP_DEV_FIREBASE_PROJECT_ID");
  const clientEmail = requireEnv("APP_DEV_FIREBASE_CLIENT_EMAIL");
  const privateKey = requireEnv("APP_DEV_FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
};

const run = async () => {
  initAdmin();
  const { uid, email, displayName, disabled } = parseArgs();

  if (!uid || !email) {
    console.error("Both --uid and --email are required.");
    process.exit(1);
  }

  try {
    const existing = await admin.auth().getUser(uid).catch(() => null);

    if (existing) {
      await admin.auth().updateUser(uid, {
        email,
        displayName: displayName || existing.displayName || undefined,
        disabled,
      });
      console.log(`Updated existing door-24-dev user ${uid}`);
    } else {
      await admin.auth().createUser({
        uid,
        email,
        emailVerified: true,
        displayName: displayName || undefined,
        disabled,
      });
      console.log(`Created new door-24-dev user ${uid}`);
    }

    console.log(
      "User is ready for claim provisioning (they still can't sign in unless you enable credentials)."
    );
  } catch (error) {
    console.error("Failed to create/update mobile admin user:", error);
    process.exit(1);
  }
};

run();


