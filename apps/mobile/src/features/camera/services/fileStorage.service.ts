import * as FileSystem from 'expo-file-system/legacy';

const IMAGE_DIR = FileSystem.cacheDirectory + 'images/';

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

    await FileSystem.makeDirectoryAsync(IMAGE_DIR, {
      intermediates: true,
    });

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  },

  async readImage(fileUri: string): Promise<string | null> {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) return null;

    return await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  },

  async deleteImage(fileUri: string): Promise<void> {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }
  },
};