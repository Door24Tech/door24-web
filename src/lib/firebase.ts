import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase config with safe defaults for build time
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "door-24-website";
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? `${projectId}.appspot.com`;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined" && firebaseConfig.apiKey) {
  // Only initialize on client side and if config is valid
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize Storage
    try {
      storage = getStorage(app);
      console.log("Firebase Storage initialized with bucket:", storageBucket);
    } catch (storageError) {
      console.error("Firebase Storage initialization error:", storageError);
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else if (typeof window !== "undefined") {
  console.warn("Firebase not initialized: Missing API key or running on server side");
}

export { auth, db, storage };
export default app;

