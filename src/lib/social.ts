import { 
  collection, 
  addDoc, 
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

export interface SocialAccount {
  id?: string;
  category: "clipping" | "official";
  platform: string;
  handle: string;
  channelName?: string;
  url?: string;
  type?: string; // For clipping pages
  role?: string; // For official channels
  status?: "active" | "paused" | "testing" | "retired";
  priority?: string | number;
  ownerEditor?: string;
  contentFocus?: string;
  postingCadenceTarget?: string;
  phoneId?: string; // Phone ID # for clipping pages
  linkInBio?: string; // Link in Bio for clipping pages (ROI tracking)
  notes?: string;
  followers?: number;
  views30Day?: number;
  postsPerWeek?: number;
  lastUpdated?: Timestamp | null;
  createdAt?: Timestamp | null;
}

/**
 * Get all social accounts
 */
export async function getAllSocialAccounts(): Promise<SocialAccount[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const querySnapshot = await getDocs(
    query(collection(db, "socialAccounts"), orderBy("createdAt", "desc"))
  );
  const accounts: SocialAccount[] = [];

  querySnapshot.forEach((doc) => {
    accounts.push({
      id: doc.id,
      ...doc.data(),
    } as SocialAccount);
  });

  return accounts;
}

/**
 * Get social accounts by category
 */
export async function getSocialAccountsByCategory(
  category: "clipping" | "official"
): Promise<SocialAccount[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const q = query(
    collection(db, "socialAccounts"),
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const accounts: SocialAccount[] = [];

  querySnapshot.forEach((doc) => {
    accounts.push({
      id: doc.id,
      ...doc.data(),
    } as SocialAccount);
  });

  return accounts;
}

/**
 * Get a single social account by ID
 */
export async function getSocialAccountById(id: string): Promise<SocialAccount | null> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const docRef = doc(db, "socialAccounts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as SocialAccount;
}

/**
 * Add a social account
 */
export async function addSocialAccount(data: Omit<SocialAccount, "id" | "createdAt">): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const accountData: any = {
    ...data,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "socialAccounts"), accountData);
  return docRef.id;
}

/**
 * Update a social account
 */
export async function updateSocialAccount(
  id: string,
  data: Partial<Omit<SocialAccount, "id" | "createdAt">>
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const updateData: any = {
    ...data,
    lastUpdated: serverTimestamp(),
  };

  const docRef = doc(db, "socialAccounts", id);
  await updateDoc(docRef, updateData);
}

/**
 * Delete a social account
 */
export async function deleteSocialAccount(id: string): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const docRef = doc(db, "socialAccounts", id);
  await deleteDoc(docRef);
}

