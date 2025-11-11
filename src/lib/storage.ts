import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(file: File, path: string): Promise<string> {
  if (!storage) {
    const errorMsg = "Firebase Storage is not initialized. Please check your Firebase configuration and ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set in your environment variables.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    // Sanitize filename to remove any path separators or special characters
    const sanitizedPath = path.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `blog-images/${sanitizedPath}`);
    
    console.log("Uploading image to:", `blog-images/${sanitizedPath}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log("Image uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error: any) {
    console.error("Upload error details:", error);
    
    // Provide more specific error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error("You don't have permission to upload images. Please check Firebase Storage security rules.");
    } else if (error.code === 'storage/quota-exceeded') {
      throw new Error("Storage quota exceeded. Please contact support.");
    } else if (error.code === 'storage/unauthenticated') {
      throw new Error("You must be logged in to upload images. Please log in and try again.");
    } else if (error.message) {
      throw new Error(`Upload failed: ${error.message}`);
    } else {
      throw new Error(`Upload failed: ${error.code || 'Unknown error'}`);
    }
  }
}

export async function deleteImage(url: string): Promise<void> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized");
  }

  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const path = decodeURIComponent(urlObj.pathname.split('/o/')[1]?.split('?')[0] || '');
    if (path) {
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

