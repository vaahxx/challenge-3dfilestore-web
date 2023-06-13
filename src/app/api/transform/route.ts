import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { NextResponse } from 'next/server';
import { iteratorToStream, makeIterator } from '@/app/utils/stream-utils';
import { randomUUID } from 'crypto';
import { createVector, generateWriteableTextFromBuffer } from './utils';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  let tempFilePath;
  const url = new URL(request.url);
  const scaleX = Number(url.searchParams.get('scale_x'));
  const scaleY = Number(url.searchParams.get('scale_y'));
  const scaleZ = Number(url.searchParams.get('scale_z'));
  const offsetX = Number(url.searchParams.get('offset_x'));
  const offsetY = Number(url.searchParams.get('offset_y'));
  const offsetZ = Number(url.searchParams.get('offset_z'));

  if (!scaleX && !scaleY && !scaleZ && !offsetX && !offsetY && !offsetZ) {
    return NextResponse.json(
      {
        message: 'Either scale or offset is required.',
      },
      {
        status: 400,
      },
    );
  }

  const scale = createVector(scaleX, scaleY, scaleZ);
  const offset = createVector(offsetX, offsetY, offsetZ);

  try {
    const id = url.searchParams.get('id') ?? undefined;
    const savedFile = await prisma.file_storage.findUnique({
      where: { id },
    });

    if (!savedFile) {
      return NextResponse.json(
        {
          message: 'File not found.',
        },
        {
          status: 400,
        },
      );
    }

    const readRawFileStream = fs.createReadStream(savedFile.url, 'utf-8');
    const randomId = randomUUID();

    let buffer = '';
    tempFilePath = `${savedFile.id}_${randomId}_transformed.obj`;

    const tempFileStream = fs.createWriteStream(tempFilePath, {
      highWaterMark: 1024 * 1024,
    });

    await processTempFile(readRawFileStream, buffer, tempFileStream);

    const iterator = makeIterator(tempFilePath);
    const responseStream = iteratorToStream(iterator);

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${savedFile.name}_transformed.obj"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Unable to process request',
      },
      {
        status: 500,
      },
    );
  } finally {
    await prisma.$disconnect();

    if (tempFilePath) {
      fs.unlinkSync(tempFilePath);
    }
  }

  async function processTempFile(readRawFileStream: fs.ReadStream, buffer: string, tempFileStream: fs.WriteStream) {
    return new Promise(resolve => {
      readRawFileStream
        .on('data', chunk => {
          const data = buffer + chunk.toString();

          tempFileStream.write(generateWriteableTextFromBuffer(buffer, data, scale, offset));
        })
        .on('end', () => {
          readRawFileStream.destroy();
          const data = buffer;

          tempFileStream.write(generateWriteableTextFromBuffer(buffer, data, scale, offset));
          tempFileStream.end();
          resolve('done');
        });
    });
  }
}
