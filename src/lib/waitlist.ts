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
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface WaitlistEntry {
  id?: string;
  email: string;
  source: "homepage" | "modal";
  createdAt: Timestamp | null;
  status: "active" | "unsubscribed";
}

/**
 * Check if an email already exists in the waitlist
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const q = query(
    collection(db, "waitlist"),
    where("email", "==", normalizedEmail)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

/**
 * Add an email to the waitlist
 * @param email - The email address to add
 * @param source - Where the submission came from ("homepage" or "modal")
 * @returns The document ID of the created entry
 * @throws Error if email already exists or Firestore is not initialized
 */
export async function addToWaitlist(
  email: string,
  source: "homepage" | "modal"
): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already exists
  const exists = await checkEmailExists(normalizedEmail);
  if (exists) {
    throw new Error("This email is already on the waitlist.");
  }

  // Type the variable as any BEFORE creating the object literal
  // This prevents TypeScript from checking the object literal structure
  let entryData: any;
  entryData = {
    email: normalizedEmail,
    source,
    status: "active",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "waitlist"), entryData);
  return docRef.id;
}

/**
 * Get all waitlist entries (admin only)
 */
export async function getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const querySnapshot = await getDocs(collection(db, "waitlist"));
  const entries: WaitlistEntry[] = [];

  querySnapshot.forEach((doc) => {
    entries.push({
      id: doc.id,
      ...doc.data(),
    } as WaitlistEntry);
  });

  return entries.sort((a, b) => {
    const aTime = a.createdAt instanceof Date
      ? a.createdAt.getTime()
      : (a.createdAt as any)?.toMillis?.() || (a.createdAt as any)?.seconds * 1000 || 0;
    const bTime = b.createdAt instanceof Date
      ? b.createdAt.getTime()
      : (b.createdAt as any)?.toMillis?.() || (b.createdAt as any)?.seconds * 1000 || 0;
    return bTime - aTime; // Most recent first
  });
}

/**
 * Get a single waitlist entry by ID (admin only)
 */
export async function getWaitlistEntryById(id: string): Promise<WaitlistEntry | null> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const docRef = doc(db, "waitlist", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as WaitlistEntry;
}

/**
 * Update a waitlist entry (admin only)
 * @param id - The document ID of the entry to update
 * @param data - Partial data to update (email, source, or status)
 * @throws Error if email already exists (when changing email) or Firestore is not initialized
 */
export async function updateWaitlistEntry(
  id: string,
  data: Partial<Pick<WaitlistEntry, "email" | "source" | "status">>
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const updateData: any = {};

  // If email is being updated, validate and check for duplicates
  if (data.email !== undefined) {
    const normalizedEmail = data.email.toLowerCase().trim();
    
    // Validate email format
    if (!/.+@.+\..+/.test(normalizedEmail)) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists (but not for the current entry)
    const existingEntry = await getWaitlistEntryById(id);
    if (existingEntry && existingEntry.email !== normalizedEmail) {
      const exists = await checkEmailExists(normalizedEmail);
      if (exists) {
        throw new Error("This email is already on the waitlist.");
      }
    }

    updateData.email = normalizedEmail;
  }

  // Update source if provided
  if (data.source !== undefined) {
    updateData.source = data.source;
  }

  // Update status if provided
  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  // Update the document
  const docRef = doc(db, "waitlist", id);
  await updateDoc(docRef, updateData);
}

/**
 * Delete a waitlist entry (admin only)
 * @param id - The document ID of the entry to delete
 * @throws Error if Firestore is not initialized
 */
export async function deleteWaitlistEntry(id: string): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const docRef = doc(db, "waitlist", id);
  await deleteDoc(docRef);
}

