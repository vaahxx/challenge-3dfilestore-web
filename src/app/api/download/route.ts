import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { iteratorToStream, makeIterator } from '@/app/utils/stream-utils';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') ?? undefined;
  const file = await prisma.file_storage.findUnique({
    where: { id },
  });

  if (!file) {
    return NextResponse.json(
      {
        message: 'File not found.',
      },
      {
        status: 404,
      },
    );
  }

  const filePath = path.join(process.cwd(), `obj_files/${id}.obj`);
  const iterator = makeIterator(filePath);
  const stream = iteratorToStream(iterator);

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.name}.obj"`,
    },
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
