import { NextRequest, NextResponse } from 'next/server';
import { getLinkByCode, incrementClickCount } from '../../lib/db';

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { code } = await context.params;
    const link = await getLinkByCode(code);

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    await incrementClickCount(code);

    return NextResponse.redirect(link.target_url, 302);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Redirect failed' },
      { status: 500 }
    );
  }
}