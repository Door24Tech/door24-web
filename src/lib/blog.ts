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
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  author: string;
  tags?: string[];
  category?: string;
  featuredImage?: string;
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const postData = {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: post.published ? serverTimestamp() : null,
  };

  const docRef = await addDoc(collection(db, "blogPosts"), postData);
  return docRef.id;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const postData = {
    ...post,
    updatedAt: serverTimestamp(),
    ...(post.published && !post.publishedAt && { publishedAt: serverTimestamp() }),
  };

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

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const post = {
      id: doc.id,
      ...data,
    } as BlogPost;

    // Filter out unpublished posts if requested
    if (publishedOnly && !post.published) {
      return;
    }

    // Filter by category if specified
    if (category && post.category !== category) {
      return;
    }

    posts.push(post);
  });

  return posts;
}

export async function getCategories(): Promise<string[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const posts = await getAllBlogPosts(true);
  const categories = new Set<string>();
  
  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });

  return Array.from(categories).sort();
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

