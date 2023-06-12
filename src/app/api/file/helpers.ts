import { promisify } from 'util';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const writeFileAsync = promisify(fs.writeFile);

export function createFileDataModel({
  id,
  filename,
  fileSize,
  uploadDir,
}: {
  id: string;
  filename: string;
  fileSize: number;
  uploadDir: string;
}) {
  return {
    id,
    name: filename,
    creation_date: new Date(),
    size: fileSize,
    url: `${uploadDir}/${id}.obj`,
  };
}

export async function retrieveUploadedFileFromFormData({
  formData,
  id,
  uploadDir,
  prisma,
}: {
  formData: FormData;
  id: string;
  uploadDir: string;
  prisma: PrismaClient;
}) {
  const file = formData.get('file') as File;
  const filename = file.name;
  const fileSize = file.size;
  const fileData = createFileDataModel({ id, filename, fileSize, uploadDir });
  const fileBuffer = await file.arrayBuffer();

  await writeFileAsync(`${uploadDir}/${id}.obj`, Buffer.from(fileBuffer));

  return await prisma.file_storage.create({
    data: {
      id,
      name: fileData.name.split('.')[0],
      creation_date: fileData.creation_date,
      size: fileData.size,
      url: fileData.url,
    },
  });
}
