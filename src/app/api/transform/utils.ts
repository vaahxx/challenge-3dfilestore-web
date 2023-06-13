import { Vector3 } from '../functions';

export type CustomVector3 = Vector3 & { n: string };

export function transformVertices(vertices: CustomVector3[], scale: Vector3, offset: Vector3): CustomVector3[] {
  const newVertices = [];

  for (let i = 0; i < vertices.length; i += 1) {
    const transformedX = vertices[i].x * (scale.x ? scale.x : 1) + offset.x;
    const transformedY = vertices[i].y * (scale.y ? scale.y : 1) + offset.y;
    const transformedZ = vertices[i].z * (scale.z ? scale.z : 1) + offset.z;

    newVertices.push({
      n: vertices[i].n,
      x: transformedX,
      y: transformedY,
      z: transformedZ,
    });
  }

  return newVertices;
}

export function generateWriteableTextFromBuffer(buffer: string, data: string, scale: Vector3, offset: Vector3) {
  let vectors: CustomVector3[] | undefined;
  ({ vectors, buffer } = processBuffer(data, buffer));

  const vertices = transformVertices(vectors, scale, offset)
    .map(vector => {
      if (vector.n === '' || vector.n.length > 1) {
        return `${vector.n}\r`;
      }
      return `${vector.n} ${vector.x} ${vector.y} ${vector.z}\r`;
    })
    .join('');
  return vertices;
}

export function processBuffer(data: string, buffer: string) {
  const lines = data.split(/\r?\n|\r/);
  const vectors: CustomVector3[] = [];

  for (let i = 0; i < lines.length - 1; i++) {
    const row = lines[i].trim();
    const vectorLineRegex = /^([a-z]{1,2})\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)$/;

    if (!vectorLineRegex.test(row)) {
      vectors.push({ n: row, x: 0, y: 0, z: 0 });

      continue;
    }

    const [n, x, y, z] = row.trim().split(' ');

    vectors.push({ n, x: +x, y: +y, z: +z });

    buffer = '';
  }

  buffer = lines[lines.length - 1];
  return { vectors, buffer };
}

export function createVector(scaleX: number, scaleY: number, scaleZ: number) {
  return {
    x: scaleX,
    y: scaleY,
    z: scaleZ,
  };
}
