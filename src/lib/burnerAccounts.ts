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

export interface BurnerAccount {
  id?: string;
  email: string;
  password: string;
  phoneId: string;
  notes?: string;
  status?: "active" | "paused" | "retired";
  createdAt?: Timestamp | null;
  lastUpdated?: Timestamp | null;
}

/**
 * Get all burner accounts
 */
export async function getAllBurnerAccounts(): Promise<BurnerAccount[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const querySnapshot = await getDocs(
    query(collection(db, "burnerAccounts"), orderBy("createdAt", "desc"))
  );
  const accounts: BurnerAccount[] = [];

  querySnapshot.forEach((doc) => {
    accounts.push({
      id: doc.id,
      ...doc.data(),
    } as BurnerAccount);
  });

  return accounts;
}

/**
 * Get burner accounts by platform
 */
export async function getBurnerAccountsByPlatform(
  platform: string
): Promise<BurnerAccount[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const q = query(
    collection(db, "burnerAccounts"),
    where("platform", "==", platform),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const accounts: BurnerAccount[] = [];

  querySnapshot.forEach((doc) => {
    accounts.push({
      id: doc.id,
      ...doc.data(),
    } as BurnerAccount);
  });

  return accounts;
}

/**
 * Get burner accounts by phone ID
 */
export async function getBurnerAccountsByPhoneId(
  phoneId: string
): Promise<BurnerAccount[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const q = query(
    collection(db, "burnerAccounts"),
    where("phoneId", "==", phoneId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const accounts: BurnerAccount[] = [];

  querySnapshot.forEach((doc) => {
    accounts.push({
      id: doc.id,
      ...doc.data(),
    } as BurnerAccount);
  });

  return accounts;
}

/**
 * Get a single burner account by ID
 */
export async function getBurnerAccountById(id: string): Promise<BurnerAccount | null> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const docRef = doc(db, "burnerAccounts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as BurnerAccount;
}

/**
 * Add a burner account
 */
export async function addBurnerAccount(data: Omit<BurnerAccount, "id" | "createdAt" | "lastUpdated">): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const accountData: any = {
    ...data,
    status: data.status || "active",
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "burnerAccounts"), accountData);
  return docRef.id;
}

/**
 * Update a burner account
 */
export async function updateBurnerAccount(
  id: string,
  data: Partial<Omit<BurnerAccount, "id" | "createdAt">>
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const updateData: any = {
    ...data,
    lastUpdated: serverTimestamp(),
  };

  const docRef = doc(db, "burnerAccounts", id);
  await updateDoc(docRef, updateData);
}

/**
 * Delete a burner account
 */
export async function deleteBurnerAccount(id: string): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const docRef = doc(db, "burnerAccounts", id);
  await deleteDoc(docRef);
}

