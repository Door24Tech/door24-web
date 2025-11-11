import { ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTask } from "firebase/storage";
import { storage } from "./firebase";

let currentUploadTask: UploadTask | null = null;

export async function uploadImage(
  file: File, 
  path: string, 
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!storage) {
    const errorMsg = "Firebase Storage is not initialized. This usually means Storage is not enabled.\n\nPlease:\n1. Go to: https://console.firebase.google.com/project/door-24-website/storage\n2. Click 'Get Started' to enable Storage\n3. Choose a location for your storage bucket (recommended: us-central1)\n4. Check your environment variables include NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    // Sanitize filename to remove any path separators or special characters
    const sanitizedPath = path.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `blog-images/${sanitizedPath}`);
    
    console.log("Uploading image to:", `blog-images/${sanitizedPath}`, "File size:", file.size, "bytes");
    console.log("Storage instance:", storage ? "Initialized" : "NOT INITIALIZED");
    console.log("Storage bucket:", storageRef.bucket);
    console.log("Storage full path:", storageRef.fullPath);
    
    // Use uploadBytesResumable for progress tracking
    console.log("Creating upload task...");
    const uploadTask = uploadBytesResumable(storageRef, file);
    currentUploadTask = uploadTask;
    
    console.log("Upload task created:", uploadTask);
    console.log("Initial task state:", uploadTask.snapshot.state);
    console.log("Initial bytes transferred:", uploadTask.snapshot.bytesTransferred);
    console.log("Total bytes:", uploadTask.snapshot.totalBytes);
    
    // Set initial progress to 0%
    if (onProgress) {
      console.log("Setting initial progress to 0%");
      onProgress(0);
    }
    
    console.log("Upload task created, setting up listeners...");
    
    // Set up progress tracking
    let startTimeout: NodeJS.Timeout | null = null;
    
    return new Promise<string>((resolve, reject) => {
      // Set a timeout to detect if upload never starts
      startTimeout = setTimeout(() => {
        const state = uploadTask.snapshot.state;
        console.log("Upload task state after 2s:", state);
        if (state === 'running') {
          console.log("Upload is running");
        } else if (state === 'paused') {
          console.warn("Upload is paused");
        } else if (state === 'success') {
          console.log("Upload completed");
        } else if (state === 'error') {
          console.error("Upload has error state");
        } else {
          console.warn("Upload may not have started. State:", state);
          console.warn("Check Firebase Storage configuration and ensure Storage is enabled.");
        }
      }, 2000);
      
      console.log("Attaching state_changed listener...");
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log("=== STATE CHANGED EVENT FIRED ===");
          console.log("State:", snapshot.state);
          console.log("Bytes transferred:", snapshot.bytesTransferred);
          console.log("Total bytes:", snapshot.totalBytes);
          console.log("Metadata:", snapshot.metadata);
          
          if (startTimeout) {
            clearTimeout(startTimeout);
            startTimeout = null;
          }
          
          // Calculate progress percentage
          const progress = snapshot.totalBytes > 0 
            ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100 
            : 0;
          console.log(`Upload progress: ${progress.toFixed(1)}%`);
          
          if (onProgress) {
            console.log("Calling onProgress callback with:", progress);
            onProgress(progress);
          } else {
            console.warn("onProgress callback is not defined!");
          }
        },
        (error) => {
          if (startTimeout) {
            clearTimeout(startTimeout);
            startTimeout = null;
          }
          currentUploadTask = null;
          
          // Reset progress on error
          if (onProgress) {
            onProgress(0);
          }
          
          // Don't reject if upload was cancelled
          if (error.code === 'storage/canceled') {
            console.log("Upload cancelled by user");
            return; // Don't reject, just return
          }
          
          console.error("Upload error details:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          console.error("Full error object:", JSON.stringify(error, null, 2));
          
          // Provide more specific error messages
          if (error.code === 'storage/unauthorized' || error.code === 'permission-denied') {
            reject(new Error("Permission denied. Please ensure:\n1. You are logged in\n2. Firebase Storage security rules allow authenticated uploads\n3. Storage rules have been deployed (run: firebase deploy --only storage:rules)\n\nTo deploy rules, run: firebase deploy --only storage:rules"));
          } else if (error.code === 'storage/quota-exceeded') {
            reject(new Error("Storage quota exceeded. Please contact support."));
          } else if (error.code === 'storage/unauthenticated') {
            reject(new Error("You must be logged in to upload images. Please log in and try again."));
          } else if (error.code === 'storage/unknown' || error.message?.includes('not been set up') || error.code === 'storage/object-not-found' || error.message?.includes('Storage has not been set up')) {
            reject(new Error("Firebase Storage is not enabled. This is why your upload is timing out.\n\nTo fix:\n1. Go to: https://console.firebase.google.com/project/door-24-website/storage\n2. Click 'Get Started' to enable Storage\n3. Choose a location for your storage bucket (recommended: us-central1)\n4. After enabling, deploy storage rules:\n   firebase deploy --only storage:rules\n\nOnce Storage is enabled, uploads will work!"));
          } else if (error.message) {
            reject(new Error(`Upload failed: ${error.message} (Code: ${error.code || 'unknown'})`));
          } else {
            reject(new Error(`Upload failed: ${error.code || 'Unknown error'}. Please check the browser console for details.`));
          }
        },
        async () => {
          // Upload completed successfully
          console.log("Getting download URL...");
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Image uploaded successfully:", downloadURL);
            currentUploadTask = null;
            resolve(downloadURL);
          } catch (error: any) {
            currentUploadTask = null;
            reject(error);
          }
        }
      );
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    currentUploadTask = null;
    throw error;
  }
}

export function cancelUpload(): void {
  if (currentUploadTask) {
    currentUploadTask.cancel();
    currentUploadTask = null;
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

