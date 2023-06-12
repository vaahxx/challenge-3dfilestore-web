import fs from 'fs';

export function iteratorToStream(iterator: AsyncGenerator<Uint8Array, void, unknown>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

const encoder = new TextEncoder();

export async function* makeIterator(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  for await (const chunk of fileStream) {
    yield encoder.encode(chunk);
  }
}
