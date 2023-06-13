import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { parseBody, retrieveUploadedFileFromFormData } from './utils';

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'obj_files');

//-----------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const id = uuidv4();
    const formData = await request.formData();
    const uploadedFile = await retrieveUploadedFileFromFormData({ formData, id, uploadDir, prisma });

    return NextResponse.json(uploadedFile, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to upload file.',
      },
      {
        status: 500,
      },
    );
  } finally {
    await prisma.$disconnect();
  }
}

//-----------------------------------------------------------------------------

export async function PATCH(request: Request) {
  const parsedBody = await parseBody<{ id: string; name: string }>(request);

  if (!parsedBody) {
    return NextResponse.json(
      {
        message: 'Invalid request body.',
      },
      {
        status: 400,
      },
    );
  }

  const { id, name } = parsedBody;

  try {
    const updatedFile = await prisma.file_storage.update({
      where: { id },
      data: { name },
    });

    if (!updatedFile) {
      return NextResponse.json(
        {
          message: 'File not found.',
        },
        {
          status: 400,
        },
      );
    }
    return NextResponse.json(updatedFile, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to rename file.',
      },
      {
        status: 500,
      },
    );
  } finally {
    await prisma.$disconnect();
  }
}

//-----------------------------------------------------------------------------

const deleteFile = promisify(fs.unlink);

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') ?? undefined;

  const deletedFile = await prisma.file_storage.delete({
    where: { id },
  });

  if (deletedFile) {
    try {
      await deleteFile(deletedFile.url);
      return NextResponse.json(deletedFile, {
        status: 200,
      });
    } catch (error) {
      return NextResponse.json(
        {
          message: 'Failed to delete file.',
        },
        {
          status: 500,
        },
      );
    }
  }

  return NextResponse.json(
    {
      message: 'Failed to delete file - file not found.',
    },
    {
      status: 500,
    },
  );
}

//-----------------------------------------------------------------------------

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') ?? undefined;

  try {
    const foundFile = await prisma.file_storage.findUnique({
      where: { id },
    });

    if (!foundFile) {
      return NextResponse.json(
        {
          message: 'File not found.',
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(foundFile, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to retrieve file.',
      },
      {
        status: 500,
      },
    );
  } finally {
    await prisma.$disconnect();
  }
}
