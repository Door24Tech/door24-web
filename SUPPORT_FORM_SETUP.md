# Support Form Setup Instructions

The support form now uses a **hybrid approach** (industry standard):
1. **Saves submissions to Firestore** (primary storage)
2. **Sends email notification via Resend** (immediate alert)

## Setup Steps

### 1. Firestore Collection
✅ **Already configured** - The `support` collection will be created automatically when the first submission is made.

### 2. Email Notifications (Optional but Recommended)

To enable email notifications, you need to set up Resend:

#### Option A: Using Resend (Recommended)
1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Add the same key to GitHub Secrets for production:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add `NEXT_PUBLIC_RESEND_API_KEY` with your Resend API key

#### Option B: Skip Email (Form Still Works)
If you don't add the Resend API key, the form will:
- ✅ Still save all submissions to Firestore
- ⚠️ Skip email notifications (you'll see a console warning)

You can view submissions in Firebase Console → Firestore → `support` collection.

### 3. Domain Setup (Resend)
1. In Resend dashboard, add your domain `door24.app`
2. Add the DNS records Resend provides
3. Verify domain ownership
4. Update the `from` email in `src/lib/support.ts` if needed

### 4. Viewing Submissions

**Option 1: Firebase Console**
- Go to Firebase Console → Firestore Database
- View the `support` collection
- Each submission has: name, email, inquiryType, message, status, createdAt

**Option 2: Future Admin Panel** (to be built)
- Could add a support submissions viewer in `/blog/admin`

## Security Notes

- ✅ Firestore rules: Public can create, only authenticated admins can read
- ⚠️ Resend API key is public (NEXT_PUBLIC_*) - Set up domain restrictions in Resend dashboard to prevent abuse
- ✅ All form data is validated and sanitized
- ✅ HTML escaping prevents XSS attacks

## Testing

1. Fill out the support form at `/support`
2. Check Firebase Console → Firestore → `support` collection
3. Check your email inbox (if Resend is configured)
4. Verify the submission was saved correctly

## Troubleshooting

**Email not sending?**
- Check browser console for errors
- Verify `NEXT_PUBLIC_RESEND_API_KEY` is set correctly
- Check Resend dashboard for delivery logs
- Form still saves to Firestore even if email fails

**Submission not saving?**
- Check Firebase Console for errors
- Verify Firestore rules are deployed
- Check browser console for error messages

