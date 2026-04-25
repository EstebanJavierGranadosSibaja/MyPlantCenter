import * as FileSystem from 'expo-file-system';

const IMAGE_DIR = (FileSystem as any).cacheDirectory + 'images/';

const generateFileId = (): string => {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const fileStorageService = {
  async saveImage(base64: string): Promise<string> {
    const fileId = generateFileId();
    const fileUri = `${IMAGE_DIR}${fileId}.jpeg`;

    await (FileSystem as any).makeDirectoryAsync(IMAGE_DIR, {
      intermediates: true,
    });

    await (FileSystem as any).writeAsStringAsync(fileUri, base64, {
      encoding: 'base64' as any,
    });

    return fileUri;
  },

  async readImage(fileUri: string): Promise<string | null> {
    const fileInfo = await (FileSystem as any).getInfoAsync(fileUri);

    if (!fileInfo.exists) return null;

    return await (FileSystem as any).readAsStringAsync(fileUri, {
      encoding: 'base64' as any,
    });
  },

  async deleteImage(fileUri: string): Promise<void> {
    const fileInfo = await (FileSystem as any).getInfoAsync(fileUri);

    if (fileInfo.exists) {
      await (FileSystem as any).deleteAsync(fileUri);
    }
  },
};