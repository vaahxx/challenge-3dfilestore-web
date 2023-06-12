import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.method !== 'PATCH') {
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id') ?? undefined;
  const newName = url.searchParams.get('name') ?? undefined;

  if (!newName || !id) {
    return NextResponse.json(
      {
        message: 'Missing file id or name.',
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/file/:function*',
};
