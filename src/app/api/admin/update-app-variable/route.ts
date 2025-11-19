import { NextRequest, NextResponse } from 'next/server';
import { mobileAdminDb } from '@/lib/firebaseAdminMobile';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, data } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { error: 'Invalid path. Must be a non-empty string.' },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data. Must be an object.' },
        { status: 400 }
      );
    }

    await mobileAdminDb.doc(path).set(data, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating app variable:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update app variable' },
      { status: 500 }
    );
  }
}


