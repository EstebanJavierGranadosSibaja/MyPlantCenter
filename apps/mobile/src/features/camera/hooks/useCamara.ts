import { CameraType, CameraView, FlashMode } from 'expo-camera';
import { useCallback, useEffect, useRef, useState } from 'react';

import PermissionService, {
    AppPermissions,
} from 'src/shared/services/permission.service';

import CameraService, {
    CaptureOptions,
    PhotoResult,
} from '../services/camara.service';

export function useCamera() {
    const cameraRef = useRef<CameraView>(null);

    const [permissions, setPermissions] =
        useState<AppPermissions | null>(null);
    const [isLoadingPermissions, setIsLoadingPermissions] =
        useState(false);

    const [facing, setFacing] = useState<CameraType>('back');
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const [lastPhoto, setLastPhoto] =
        useState<PhotoResult | null>(null);

    const [error, setError] = useState<string | null>(null);

    const isPermissionGranted =
        !!permissions &&
        PermissionService.isGranted(permissions.camera) &&
        PermissionService.isGranted(permissions.mediaLibrary);

    const isPermanentlyDenied =
        permissions &&
        permissions.camera === 'denied' &&
        permissions.mediaLibrary === 'denied';

    const requestPermissions = useCallback(async () => {
        setIsLoadingPermissions(true);
        setError(null);
        try {
            const result =
                await PermissionService.requestAllPermissions();
            setPermissions(result);
        } catch {
            setError('Error al solicitar permisos');
        } finally {
            setIsLoadingPermissions(false);
        }
    }, []);

    useEffect(() => {
        requestPermissions();
    }, [requestPermissions]);

    const takePhoto = useCallback(async (options?: CaptureOptions) => {
        try {
            const photo = await CameraService.takePhoto(
                cameraRef,
                options
            );
            setLastPhoto(photo);
            return photo;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Error al capturar'
            );
            return null;
        }
    }, []);

    const toggleFacing = () =>
        setFacing((p) => CameraService.toggleFacing(p));

    const toggleFlash = () =>
        setFlashMode((p) => CameraService.cycleFlashMode(p));

    const saveToGallery = async (uri: string) => {
        try {
            await CameraService.saveToGallery(uri);
        } catch {
            setError('Error al guardar en galería');
        }
    };

    const setExternalPhoto = (photo: PhotoResult) =>
        setLastPhoto(photo);

    const clearPhoto = () => setLastPhoto(null);

    return {
        cameraRef,
        isPermissionGranted,
        isPermanentlyDenied,
        isLoadingPermissions,
        requestPermissions,
        takePhoto,
        toggleFacing,
        toggleFlash,
        saveToGallery,
        lastPhoto,
        setExternalPhoto,
        clearPhoto,
        error,
        facing,
        flashMode,
    };
}