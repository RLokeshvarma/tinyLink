import { NextRequest, NextResponse } from 'next/server';
import { getAllLinks, createLink, getLinkByCode } from '../../../lib/db';
import { isValidUrl, isValidCode, generateRandomCode } from '../../../lib/validation';

export async function GET() {
  try {
    const links = await getAllLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target_url, custom_code } = body;

    if (!target_url) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(target_url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let code = custom_code;

    if (code) {
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: 'Custom code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      const existing = await getLinkByCode(code);
      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      let attempts = 0;
      while (attempts < 10) {
        code = generateRandomCode();
        const existing = await getLinkByCode(code);
        if (!existing) break;
        attempts++;
      }

      if (attempts === 10) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    }

    const link = await createLink(code!, target_url);
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}