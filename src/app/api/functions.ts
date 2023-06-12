import axios from 'axios';

//-----------------------------------------------------------------------------
export type ObjFile = {
  id: string;
  name: string;
  creation_date: Date;
  size: number;
};

//-----------------------------------------------------------------------------
export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

const apiClient = axios.create({ baseURL: 'http://localhost:3000' });

//-----------------------------------------------------------------------------
export async function listFiles(): Promise<ObjFile[]> {
  const res = await apiClient.request<ObjFile[]>({
    method: 'GET',
    url: '/api/files',
  });
  return res.data;
}

//-----------------------------------------------------------------------------
export async function getFile(fileId: string): Promise<ObjFile> {
  const res = await apiClient.request<ObjFile>({
    method: 'GET',
    url: `/api/file?id=${fileId}`,
  });
  return res.data;
}

//-----------------------------------------------------------------------------
export async function renameFile(fileId: string, newName: string): Promise<ObjFile> {
  // TODO: Replace theses arguments with the correct ones
  const res = await apiClient.request<ObjFile>({
    method: 'PATCH',
    url: `/api/file?id=${fileId}&name=${newName}`,
  });
  return res.data;
}

//-----------------------------------------------------------------------------
export async function deleteFile(fileId: string): Promise<void> {
  await apiClient.request<ObjFile>({
    method: 'DELETE',
    url: `/api/file?id=${fileId}`,
  });
}

//-----------------------------------------------------------------------------
export function downloadFile(fileId: string): void {
  const downloadUrl = `/api/download?id=${fileId}`;
  window.open(downloadUrl, '_blank');
}

//-----------------------------------------------------------------------------
export async function uploadFile(data: FormData): Promise<ObjFile> {
  const res = await apiClient.request<ObjFile>({
    method: 'POST',
    url: '/api/file',
    data,
    onUploadProgress: progressEvent => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    },
  });
  return res.data;
}

//-----------------------------------------------------------------------------
export function transformFile(fileId: string, scale: Vector3, offset: Vector3): void {
  const transformUrl = `/api/transform?id=${fileId}&scale_x=${scale.x}&scale_y=${scale.y}&scale_z=${scale.z}&offset_x=${offset.x}&offset_y=${offset.y}&offset_z=${offset.z}`;

  window.open(transformUrl, '_blank');
}
