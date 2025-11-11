import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  setDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  published: boolean;
  publishedAt: Timestamp | null;
  scheduledDate: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  author: string;
  tags?: string[];
  category?: string;
  featuredImage?: string;
  // SEO Metadata
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoAuthor?: string;
  seoImage?: string;
  // Draft tracking
  draftId?: string;
  lastSavedAt?: Timestamp | null;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Timestamp | null;
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  // Remove undefined values to avoid Firestore errors
  const postData: any = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    description: post.description,
    published: post.published,
    author: post.author,
    tags: post.tags || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: post.published && !post.scheduledDate ? serverTimestamp() : null,
    scheduledDate: post.scheduledDate || null,
  };

  // Only include optional fields if they have values
  if (post.category) {
    postData.category = post.category;
  }
  if (post.featuredImage) {
    postData.featuredImage = post.featuredImage;
  }
  if (post.seoTitle) {
    postData.seoTitle = post.seoTitle;
  }
  if (post.seoDescription) {
    postData.seoDescription = post.seoDescription;
  }
  if (post.seoKeywords) {
    postData.seoKeywords = post.seoKeywords;
  }
  if (post.seoAuthor) {
    postData.seoAuthor = post.seoAuthor;
  }
  if (post.seoImage) {
    postData.seoImage = post.seoImage;
  }

  const docRef = await addDoc(collection(db, "blogPosts"), postData);
  return docRef.id;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  // Remove undefined values to avoid Firestore errors
  const postData: any = {
    updatedAt: serverTimestamp(),
  };

  // Only include fields that are explicitly provided (not undefined)
  if (post.title !== undefined) {
    postData.title = post.title;
  }
  if (post.slug !== undefined) {
    postData.slug = post.slug;
  }
  if (post.content !== undefined) {
    postData.content = post.content;
  }
  if (post.description !== undefined) {
    postData.description = post.description;
  }
  if (post.published !== undefined) {
    postData.published = post.published;
  }
  if (post.author !== undefined) {
    postData.author = post.author;
  }
  if (post.tags !== undefined) {
    postData.tags = post.tags;
  }
  if (post.category !== undefined) {
    postData.category = post.category || null;
  }
  if (post.featuredImage !== undefined) {
    postData.featuredImage = post.featuredImage || null;
  }
  if (post.seoTitle !== undefined) {
    postData.seoTitle = post.seoTitle || null;
  }
  if (post.seoDescription !== undefined) {
    postData.seoDescription = post.seoDescription || null;
  }
  if (post.seoKeywords !== undefined) {
    postData.seoKeywords = post.seoKeywords || null;
  }
  if (post.seoAuthor !== undefined) {
    postData.seoAuthor = post.seoAuthor || null;
  }
  if (post.seoImage !== undefined) {
    postData.seoImage = post.seoImage || null;
  }

  // Handle publishing logic
  if (post.published && !post.scheduledDate) {
    // Publish immediately
    postData.publishedAt = post.publishedAt || serverTimestamp();
    postData.scheduledDate = null;
  } else if (post.scheduledDate !== undefined) {
    if (post.scheduledDate) {
      // Scheduled - don't publish yet
      postData.published = false;
      postData.publishedAt = null;
      postData.scheduledDate = post.scheduledDate;
    } else {
      postData.scheduledDate = null;
    }
  }

  await updateDoc(doc(db, "blogPosts", id), postData);
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  await deleteDoc(doc(db, "blogPosts", id));
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const docSnap = await getDoc(doc(db, "blogPosts", id));
  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as BlogPost;
}

export async function getAllBlogPosts(publishedOnly: boolean = false, category?: string): Promise<BlogPost[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  let q = query(collection(db, "blogPosts"), orderBy("publishedAt", "desc"));

  const querySnapshot = await getDocs(q);
  const posts: BlogPost[] = [];
  const now = new Date();

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const post = {
      id: doc.id,
      ...data,
    } as BlogPost;

    // Filter out unpublished posts if requested
    if (publishedOnly) {
      // Must be published
      if (!post.published) {
        return;
      }
      
      // If scheduled, check if it's time to publish
      if (post.scheduledDate) {
        const scheduledTime = post.scheduledDate instanceof Date
          ? post.scheduledDate.getTime()
          : (post.scheduledDate as any).toMillis?.() || post.scheduledDate.seconds * 1000;
        
        // Only include if scheduled time has passed
        if (scheduledTime > now.getTime()) {
          return;
        }
      }
    }

    // Filter by category if specified
    if (category && post.category !== category) {
      return;
    }

    posts.push(post);
  });

  return posts;
}

export async function getCategories(): Promise<Category[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const querySnapshot = await getDocs(collection(db, "categories"));
  const categories: Category[] = [];

  querySnapshot.forEach((doc) => {
    categories.push({
      id: doc.id,
      ...doc.data(),
    } as Category);
  });

  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createCategory(category: Omit<Category, "id" | "createdAt">): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  // Remove undefined values to avoid Firestore errors
  const categoryData: any = {
    name: category.name,
    slug: category.slug,
    createdAt: serverTimestamp(),
  };
  
  // Only include description if it exists and is not empty
  if (category.description && category.description.trim()) {
    categoryData.description = category.description.trim();
  }

  const docRef = await addDoc(collection(db, "categories"), categoryData);
  return docRef.id;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  // Remove undefined values to avoid Firestore errors
  const updateData: any = {};
  
  if (category.name !== undefined) {
    updateData.name = category.name;
  }
  if (category.slug !== undefined) {
    updateData.slug = category.slug;
  }
  // Only include description if it's explicitly provided (even if empty string)
  if (category.description !== undefined) {
    if (category.description.trim()) {
      updateData.description = category.description.trim();
    } else {
      // If empty string, delete the field
      updateData.description = null;
    }
  }

  await updateDoc(doc(db, "categories", id), updateData);
}

export async function deleteCategory(id: string): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  await deleteDoc(doc(db, "categories", id));
}

export async function getScheduledPosts(): Promise<BlogPost[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const allPosts = await getAllBlogPosts(false);
  const now = new Date();
  
  return allPosts.filter((post) => {
    if (!post.scheduledDate || post.published) {
      return false;
    }
    
    const scheduledTime = post.scheduledDate instanceof Date
      ? post.scheduledDate.getTime()
      : (post.scheduledDate as any).toMillis?.() || post.scheduledDate.seconds * 1000;
    
    return scheduledTime > now.getTime();
  }).sort((a, b) => {
    const aTime = a.scheduledDate instanceof Date
      ? a.scheduledDate.getTime()
      : (a.scheduledDate as any).toMillis?.() || a.scheduledDate!.seconds * 1000;
    const bTime = b.scheduledDate instanceof Date
      ? b.scheduledDate.getTime()
      : (b.scheduledDate as any).toMillis?.() || b.scheduledDate!.seconds * 1000;
    return aTime - bTime;
  });
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Draft management functions
export async function saveDraft(draftData: Partial<BlogPost> & { author: string }): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  // Generate a draft ID if not provided
  const draftId = draftData.draftId || `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Build draft data, removing undefined values
  const draft: any = {
    draftId: draftId,
    title: draftData.title || "",
    slug: draftData.slug || generateSlug(draftData.title || "untitled"),
    content: draftData.content || "",
    description: draftData.description || "",
    published: false,
    author: draftData.author,
    tags: draftData.tags || [],
    lastSavedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Only include optional fields if they have values
  if (draftData.category) {
    draft.category = draftData.category;
  }
  if (draftData.featuredImage) {
    draft.featuredImage = draftData.featuredImage;
  }
  if (draftData.seoTitle) {
    draft.seoTitle = draftData.seoTitle;
  }
  if (draftData.seoDescription) {
    draft.seoDescription = draftData.seoDescription;
  }
  if (draftData.seoKeywords) {
    draft.seoKeywords = draftData.seoKeywords;
  }
  if (draftData.seoAuthor) {
    draft.seoAuthor = draftData.seoAuthor;
  }
  if (draftData.seoImage) {
    draft.seoImage = draftData.seoImage;
  }

  try {
    // Use draftId as document ID for easier management
    const draftRef = doc(db, "blogDrafts", draftId);
    const draftSnap = await getDoc(draftRef);

    if (draftSnap.exists()) {
      // Update existing draft - don't overwrite createdAt
      await updateDoc(draftRef, draft);
      return draftId;
    } else {
      // Create new draft with the draftId as document ID
      draft.createdAt = serverTimestamp();
      await setDoc(draftRef, draft);
      return draftId;
    }
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please ensure:\n1. You are logged in\n2. Firestore security rules have been deployed (run: firebase deploy --only firestore:rules)\n3. The blogDrafts collection rules allow authenticated writes");
    }
    throw error;
  }
}

export async function getDraft(draftId: string): Promise<BlogPost | null> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const draftSnap = await getDoc(doc(db, "blogDrafts", draftId));
  if (!draftSnap.exists()) {
    return null;
  }

  return {
    id: draftSnap.id,
    ...draftSnap.data(),
  } as BlogPost;
}

export async function getAllDrafts(): Promise<BlogPost[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    const querySnapshot = await getDocs(
      query(collection(db, "blogDrafts"), orderBy("lastSavedAt", "desc"))
    );
    
    const drafts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      drafts.push({
        id: doc.id,
        ...doc.data(),
      } as BlogPost);
    });

    return drafts;
  } catch (error: any) {
    // If orderBy fails due to missing index, try without ordering
    if (error.code === 'failed-precondition') {
      console.warn("Index missing for orderBy, fetching without order:", error);
      const querySnapshot = await getDocs(collection(db, "blogDrafts"));
      const drafts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        drafts.push({
          id: doc.id,
          ...doc.data(),
        } as BlogPost);
      });
      // Sort manually
      drafts.sort((a, b) => {
        const aTime = a.lastSavedAt instanceof Date
          ? a.lastSavedAt.getTime()
          : (a.lastSavedAt as any)?.toMillis?.() || (a.lastSavedAt as any)?.seconds * 1000 || 0;
        const bTime = b.lastSavedAt instanceof Date
          ? b.lastSavedAt.getTime()
          : (b.lastSavedAt as any)?.toMillis?.() || (b.lastSavedAt as any)?.seconds * 1000 || 0;
        return bTime - aTime;
      });
      return drafts;
    }
    throw error;
  }
}

export async function deleteDraft(draftId: string): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  await deleteDoc(doc(db, "blogDrafts", draftId));
}

export async function publishDraft(draftId: string, publishData: Partial<BlogPost>): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  // Get draft
  const draft = await getDraft(draftId);
  if (!draft) {
    throw new Error("Draft not found");
  }

  // Create post from draft
  const postId = await createBlogPost({
    title: publishData.title || draft.title,
    slug: publishData.slug || draft.slug,
    content: publishData.content || draft.content,
    description: publishData.description || draft.description,
    published: publishData.published ?? true,
    publishedAt: publishData.publishedAt || null,
    scheduledDate: publishData.scheduledDate || null,
    author: publishData.author || draft.author,
    tags: publishData.tags || draft.tags || [],
    category: publishData.category || draft.category,
    featuredImage: publishData.featuredImage || draft.featuredImage,
    seoTitle: publishData.seoTitle || draft.seoTitle,
    seoDescription: publishData.seoDescription || draft.seoDescription,
    seoKeywords: publishData.seoKeywords || draft.seoKeywords,
    seoAuthor: publishData.seoAuthor || draft.seoAuthor,
    seoImage: publishData.seoImage || draft.seoImage,
  });

  // Delete draft after publishing
  await deleteDraft(draftId);

  return postId;
}

