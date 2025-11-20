import { NextRequest, NextResponse } from "next/server";
import type { Firestore } from "firebase-admin/firestore";
import {
  getMobileAdminAuth,
  getMobileAdminDb,
  getMobileAdminFieldValue,
} from "@/lib/firebaseAdminMobile";

type FieldValueCtor = NonNullable<
  ReturnType<typeof getMobileAdminFieldValue>
>;

type AdminRequestContext = {
  db: Firestore;
  FieldValue: FieldValueCtor;
  user: {
    uid: string;
    email: string | null;
  };
};

type AdminContextResult =
  | { ok: true; context: AdminRequestContext }
  | { ok: false; response: NextResponse };

export async function getAdminRequestContext(
  request: NextRequest
): Promise<AdminContextResult> {
  const auth = getMobileAdminAuth();
  const db = getMobileAdminDb();
  const FieldValue = getMobileAdminFieldValue();

  if (!auth || !db || !FieldValue) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Firebase Admin SDK is not configured. Please set APP_DEV_FIREBASE_* secrets.",
        },
        { status: 500 }
      ),
    };
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = await auth.verifyIdToken(token, true);
    const hasAdminAccess =
      decoded.admin === true || decoded.prototypeAdmin === true;

    if (!hasAdminAccess) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    return {
      ok: true,
      context: {
        db,
        FieldValue,
        user: {
          uid: decoded.uid,
          email: decoded.email ?? null,
        },
      },
    };
  } catch (error) {
    console.error("Failed to verify admin token:", error);
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}


