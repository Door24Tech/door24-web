import admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.MOBILE_FIREBASE_PROJECT_ID || 'door-24-prod';
  const clientEmail = process.env.MOBILE_FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@door-24-prod.iam.gserviceaccount.com';
  const privateKey = process.env.MOBILE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey) {
    throw new Error('Missing MOBILE_FIREBASE_PRIVATE_KEY environment variable');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const mobileAdminDb = admin.firestore();


