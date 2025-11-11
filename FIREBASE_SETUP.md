# Firebase Setup Guide

This guide will help you set up Firebase Authentication and Firestore for the blog feature.

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `door-24-website`
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

## Step 2: Create Admin User

1. In Firebase Console, go to **Authentication** > **Users**
2. Click **Add user**
3. Enter an email and password for your admin account
4. Click **Add user**

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. If you don't have a web app, click **Add app** > **Web** (</> icon)
4. Register your app (you can name it "Door 24 Web")
5. Copy the Firebase configuration values

## Step 4: Set Environment Variables

Create a `.env.local` file in the root of your project with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=door-24-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=door-24-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=door-24-website.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
```

Replace the placeholder values with your actual Firebase config values.

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for now, you can secure it later)
4. Select a location (choose closest to your users)
5. Click **Enable**

## Step 6: Create Firestore Collection

1. In Firestore Database, click **Start collection**
2. Collection ID: `blogPosts`
3. Click **Next**
4. Add a test document (you can delete it later):
   - Field: `title` (string) - "Test Post"
   - Field: `slug` (string) - "test-post"
   - Field: `content` (string) - "Test content"
   - Field: `published` (boolean) - `true`
   - Field: `publishedAt` (timestamp) - current timestamp
   - Field: `author` (string) - "Door 24"
   - Field: `description` (string) - "Test description"
5. Click **Save**

## Step 7: Secure Firestore (Optional but Recommended)

1. Go to **Firestore Database** > **Rules**
2. Update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts - public read, authenticated write
    match /blogPosts/{postId} {
      allow read: if true; // Anyone can read published posts
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

3. Click **Publish**

## Step 8: Test the Setup

1. Start your dev server: `npm run dev`
2. Navigate to `/blog/login`
3. Sign in with the admin credentials you created
4. You should be redirected to `/blog/admin`

## Troubleshooting

- **"Firebase: Error (auth/configuration-not-found)"**: Make sure your `.env.local` file exists and has all the required variables
- **"Firebase: Error (auth/user-not-found)"**: Make sure you created the user in Firebase Console
- **Can't access Firestore**: Make sure Firestore is enabled and the collection exists

## Next Steps

Once authentication is working, you can:
1. Build the blog post editor UI in `/blog/admin`
2. Set up automated blog post generation scripts
3. Create the blog listing and individual post pages

