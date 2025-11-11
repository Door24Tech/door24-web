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

