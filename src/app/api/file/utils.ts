import { promisify } from 'util';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const writeFileAsync = promisify(fs.writeFile);

type CreateFileDataModelParams = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDir: string;
};

//-----------------------------------------------------------------------------

/**
 * Create file data model. Ideally, this would be a representation of the file in the database
 *
 * @param {CreateFileDataModelParams} param
 * @returns
 */
export function createFileDataModel({ id, fileName, fileSize, uploadDir }: CreateFileDataModelParams) {
  return {
    id,
    name: fileName,
    creation_date: new Date(),
    size: fileSize,
    url: `${uploadDir}/${id}.obj`,
  };
}

//-----------------------------------------------------------------------------

type RetrieveUploadedFileFromFormDataParams = {
  formData: FormData;
  id: string;
  uploadDir: string;
  prisma: PrismaClient;
};

/**
 * Retrieves the uploaded file from the form data, stores it in the database and returns the result
 * @param {RetrieveUploadedFileFromFormDataParams} param
 * @returns
 */

export async function retrieveUploadedFileFromFormData({
  formData,
  id,
  uploadDir,
  prisma,
}: RetrieveUploadedFileFromFormDataParams) {
  const file = formData.get('file') as File;
  const fileName = file.name;
  const fileSize = file.size;
  const fileData = createFileDataModel({ id, fileName, fileSize, uploadDir });
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

//-----------------------------------------------------------------------------

/**
 * Parses the body of the request without the need of using native bodyParser
 *
 * @param {Request} request
 * @returns
 */

export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    let body = '';
    const reader = request.body?.getReader();

    if (reader) {
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        body += Buffer.from(value).toString();
      }
    }

    return JSON.parse(body);
  } catch (e) {
    return null;
  }
}
