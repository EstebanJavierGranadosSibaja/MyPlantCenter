import { CameraType, CameraView, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { RefObject } from 'react';

export interface PhotoResult {
    uri: string;
    width: number;
    height: number;
    base64?: string;
    mimeType?: string;
}

export interface CaptureOptions {
    quality?: number;
    base64?: boolean;
    skipProcessing?: boolean;
}

const CameraService = {
    async takePhoto(
        cameraRef: RefObject<CameraView | null>,
        options: CaptureOptions = {}
    ): Promise<PhotoResult> {
        if (!cameraRef.current) {
            throw new Error('La cámara no está disponible');
        }

        const photo = await cameraRef.current.takePictureAsync({
            quality: options.quality ?? 0.8,
            base64: options.base64 ?? false,
            skipProcessing: options.skipProcessing ?? false,
        });

        if (!photo) throw new Error('No se pudo capturar la foto');

        return {
            uri: photo.uri,
            width: photo.width,
            height: photo.height,
            base64: photo.base64,
            mimeType: 'image/jpeg',
        };
    },

    async saveToGallery(uri: string) {
        const { granted } = await MediaLibrary.getPermissionsAsync();
        if (!granted) {
            const { granted: newGranted } = await MediaLibrary.requestPermissionsAsync();
            if (!newGranted) throw new Error('Permiso de galería denegado.');
        }
        return await MediaLibrary.createAssetAsync(uri);
    },

    toggleFacing(current: CameraType): CameraType {
        return current === 'back' ? 'front' : 'back';
    },

    cycleFlashMode(current: FlashMode): FlashMode {
        const modes: FlashMode[] = ['off', 'on', 'auto'];
        const index = modes.indexOf(current);
        return modes[(index + 1) % modes.length];
    },
};

export default CameraService;