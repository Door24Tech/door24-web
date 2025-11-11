import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
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

  const postData = {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: post.published && !post.scheduledDate ? serverTimestamp() : null,
    scheduledDate: post.scheduledDate || null,
  };

  const docRef = await addDoc(collection(db, "blogPosts"), postData);
  return docRef.id;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const postData: any = {
    ...post,
    updatedAt: serverTimestamp(),
  };

  // Handle publishing logic
  if (post.published && !post.scheduledDate) {
    // Publish immediately
    postData.publishedAt = post.publishedAt || serverTimestamp();
    postData.scheduledDate = null;
  } else if (post.scheduledDate) {
    // Scheduled - don't publish yet
    postData.published = false;
    postData.publishedAt = null;
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

  const categoryData = {
    ...category,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "categories"), categoryData);
  return docRef.id;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  await updateDoc(doc(db, "categories", id), category);
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

