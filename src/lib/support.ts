import { 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface SupportSubmission {
  id?: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  createdAt: Timestamp | null;
}

/**
 * Save a support submission to Firestore
 */
export async function saveSupportSubmission(
  name: string,
  email: string,
  inquiryType: string,
  message: string
): Promise<string> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const submissionData: Omit<SupportSubmission, "id"> = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    inquiryType: inquiryType.trim(),
    message: message.trim(),
    status: "new",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "support"), submissionData);
  return docRef.id;
}

/**
 * Send email notification via Resend API
 */
export async function sendSupportEmailNotification(
  name: string,
  email: string,
  inquiryType: string,
  message: string
): Promise<void> {
  const resendApiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;
  
  // If Resend API key is not configured, skip email notification
  // The submission will still be saved to Firestore
  if (!resendApiKey) {
    console.warn("Resend API key not configured. Skipping email notification.");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Door 24 Support <support@door24.app>",
        to: ["support@door24.app"],
        replyTo: email,
        subject: `New Support Inquiry: ${inquiryType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6b46c2;">New Support Inquiry</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Inquiry Type:</strong> ${escapeHtml(inquiryType)}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              This is an automated notification from the Door 24 support form.
            </p>
          </div>
        `,
        text: `
New Support Inquiry

Name: ${name}
Email: ${email}
Inquiry Type: ${inquiryType}

Message:
${message}

---
This is an automated notification from the Door 24 support form.
        `.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Resend API error: ${response.status}`);
    }
  } catch (error: any) {
    // Log error but don't throw - we still want to save to Firestore
    console.error("Error sending email notification:", error);
    // Don't throw - saving to Firestore is more important than email
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

