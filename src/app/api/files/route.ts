import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const files = await prisma.file_storage.findMany();
    return NextResponse.json(files, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Unable to retrieve files.',
      },
      {
        status: 500,
      },
    );
  } finally {
    await prisma.$disconnect();
  }
}
