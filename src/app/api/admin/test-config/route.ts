import { getMobileAdminAuth } from "@/lib/firebaseAdminMobile";
import { getWebAdminAuth } from "@/lib/firebaseAdminWeb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mobile = getMobileAdminAuth();
    const web = getWebAdminAuth();

    return NextResponse.json({
      mobileAdminInitialized: !!mobile,
      webAdminInitialized: !!web,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        mobileAdminInitialized: false,
        webAdminInitialized: false,
      },
      { status: 500 }
    );
  }
}
