import { NextRequest, NextResponse } from "next/server";
import { getWebAdminAuth } from "@/lib/firebaseAdminWeb";
import { getMobileAdminAuth } from "@/lib/firebaseAdminMobile";

const missingAuthResponse = NextResponse.json(
  {
    error:
      "Firebase Admin SDK is not configured. Please set APP_WEB_FIREBASE_* and APP_DEV_FIREBASE_* secrets.",
  },
  { status: 500 }
);

export async function POST(request: NextRequest) {
  const webAuth = getWebAdminAuth();
  const mobileAuth = getMobileAdminAuth();

  if (!webAuth || !mobileAuth) {
    return missingAuthResponse;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  const webIdToken = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = await webAuth.verifyIdToken(webIdToken, true);

    try {
      const customToken = await mobileAuth.createCustomToken(decoded.uid);

      return NextResponse.json({ token: customToken });
    } catch (error) {
      console.error("Failed to create mobile custom token:", error);
      return NextResponse.json(
        { error: "Failed to create mobile token." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to verify web ID token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}


