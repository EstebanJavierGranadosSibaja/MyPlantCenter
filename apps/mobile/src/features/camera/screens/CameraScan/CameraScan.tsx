import { Feather } from '@expo/vector-icons';
import { useCamera } from '@features/camera/hooks/useCamara';
import NetInfo from '@react-native-community/netinfo';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useAuth } from 'src/core/contexts/AuthContext';
import {
    PlantDetectionResult,
    plantDetectionService
} from 'src/features/camera/services/plantDetection.service';
import { plantJobService } from 'src/features/plants/services/plantJob.service';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { useCameraScanTheme } from './CameraScan.styles';

const CONNECTIVITY_ERROR_REGEX = /network|timed?\s*out|timeout|conex|fetch|enotfound|econn/i;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo completar la operación.';
}

function isIgnoredWarning(error: unknown): boolean {
  const message = String(error?.message || error);
  return message.toLowerCase().includes('deprecated');
}

async function checkRealConnectivity(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return Boolean(state.isConnected);
  } catch {
    return true;
  }
}

async function handleServiceError(error: unknown, fallbackMessage: string): Promise<{ isOffline: boolean; shouldShowError: boolean; message: string }> {
  const message = getErrorMessage(error);
  const looksLikeNetwork = CONNECTIVITY_ERROR_REGEX.test(message);
  const isReallyOffline = !(await checkRealConnectivity());

  if (isIgnoredWarning(error)) {
    console.warn('[IGNORED WARNING]', message);
    return { isOffline: false, shouldShowError: false, message };
  }

  const isOffline = isReallyOffline && looksLikeNetwork;
  return { isOffline, shouldShowError: true, message: looksLikeNetwork ? message : fallbackMessage };
}

export const CameraScan: React.FC = () => {
  const { theme, styles } = useCameraScanTheme();
  const { user } = useAuth();

  const [isCapturing, setIsCapturing] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [captureSource, setCaptureSource] = React.useState<'camera' | 'gallery'>('camera');
  const [analysisResult, setAnalysisResult] = React.useState<PlantDetectionResult | null>(null);
  const [pendingDetectionsCount, setPendingDetectionsCount] = React.useState(0);
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null);

  const {
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
  } = useCamera();

  const currentUserId = user?.id ?? null;

  const refreshPendingCount = React.useCallback(async () => {
    const pending = await plantJobService.getPendingAndFailedJobs();

    if (!currentUserId) {
      setPendingDetectionsCount(pending.length);
      return;
    }

    setPendingDetectionsCount(pending.length);
  }, [currentUserId]);

  React.useEffect(() => {
    void refreshPendingCount();
  }, [refreshPendingCount]);

  React.useEffect(() => {
    if (!error) {
      return;
    }

    showToast({
      type: 'error',
      title: error,
    });
  }, [error]);

  const syncPendingDetections = React.useCallback(async () => {
    if (!currentUserId || isSyncing) {
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    const pending = await plantJobService.getPendingAndFailedJobs();

    if (pending.length === 0) {
      setIsSyncing(false);
      setSyncMessage('No hay análisis pendientes de sincronización.');
      return;
    }

    let synced = 0;

    for (const job of pending) {
      try {
        const userId = job.userId ?? currentUserId;
        if (!userId) {
          await plantJobService.updateJobStatus(job.id, 'failed', 'Usuario no asociado al trabajo');
          continue;
        }

        if (!job.userId) {
          await plantJobService.assignJobUser(job.id, userId);
        }

        await plantDetectionService.analyze(userId, {
          imageUri: job.imageUri,
          imageBase64: undefined,
          source: 'camera-manual-sync',
        });
        await plantJobService.removeJob(job.id);
        synced += 1;
      } catch (error) {
        console.warn('[CameraScan] Sync pending item failed:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        const skipAttempt = error === OFFLINE_QUEUE_ERROR
          || (error instanceof Error && error.message === OFFLINE_QUEUE_ERROR.message);
        await plantJobService.updateJobStatus(job.id, 'failed', message, { skipAttempt });
      }
    }

    await refreshPendingCount();
    const remaining = await plantJobService.getPendingAndFailedJobs();

    if (synced > 0) {
      showToast({
        type: 'success',
        title: 'Sincronización completada',
        subtitle: `Se sincronizaron ${synced} análisis pendientes.`,
      });
    }

    if (remaining.length > 0) {
      setSyncMessage(`Quedan ${remaining.length} análisis pendientes.`);
      showToast({
        type: 'warning',
        title: 'Sincronización parcial',
        subtitle: 'Algunos análisis siguen pendientes. Intenta de nuevo.',
      });
    } else {
      setSyncMessage('Sincronización al día.');
    }

    setIsSyncing(false);
  }, [currentUserId, isSyncing, refreshPendingCount]);

const onCapture = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    setCaptureSource('camera');
    setAnalysisResult(null);
    setSyncMessage(null);

    const photo = await takePhoto({ quality: 0.7, base64: true });

    setIsCapturing(false);

    if (!photo) return;

    try {
      await plantJobService.createJob(photo.uri, currentUserId ?? undefined);
      await refreshPendingCount();
      showToast({ type: 'info', title: 'Foto capturada', subtitle: 'Visible en historial' });
    } catch {
      console.warn('[CameraScan] Failed to save to local history');
    }

    try {
      await saveToGallery(photo.uri);
    } catch (error) {
      console.warn('[CameraScan] Failed to save to gallery:', error);
    }
  };

  const onPickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled) return;

    const selected = result.assets[0];

    setCaptureSource('gallery');
    setAnalysisResult(null);
    setSyncMessage(null);

    setExternalPhoto({
      uri: selected.uri,
      width: selected.width,
      height: selected.height,
      base64: selected.base64 ?? undefined,
      mimeType: selected.mimeType ?? 'image/jpeg',
    });

    try {
      await plantJobService.createJob(selected.uri, currentUserId ?? undefined);
      showToast({ type: 'info', title: 'Imagen seleccionada', subtitle: 'Visible en historial' });
    } catch {
      console.warn('[CameraScan] Failed to save gallery selection to history');
    }
  };

  const onAnalyzeWithAI = async () => {
    console.log('[CameraScan] onAnalyzeWithAI called, isAnalyzing:', isAnalyzing, 'lastPhoto:', !!lastPhoto);

    if (isAnalyzing || !lastPhoto) {
      console.log('[CameraScan] Early return: isAnalyzing or no lastPhoto');
      return;
    }

    if (!currentUserId) {
      console.log('[CameraScan] Early return: no userId');
      showToast({
        type: 'error',
        title: 'Sesión inválida',
        subtitle: 'Inicia sesión otra vez para usar el análisis IA.',
      });
      return;
    }

    if (!lastPhoto.base64) {
      console.log('[CameraScan] Early return: no base64');
      showToast({
        type: 'warning',
        title: 'Imagen no compatible',
        subtitle: 'Toma otra foto o elige una imagen válida desde galería.',
      });
      return;
    }

    const payload = {
      imageUri: lastPhoto.uri,
      imageBase64: lastPhoto.base64,
      imageMimeType: lastPhoto.mimeType ?? 'image/jpeg',
      source: captureSource,
    };

    console.log('[CameraScan] Payload prepared:', JSON.stringify(payload).slice(0, 100));

    setIsAnalyzing(true);
    setSyncMessage(null);

    try {
      console.log('[CameraScan] Calling plantDetectionService.analyze...');
      const result = await plantDetectionService.analyze(currentUserId, payload);
      console.log('[CameraScan] Analysis result received:', result);
      setAnalysisResult(result);

      showToast({
        type: 'success',
        title: 'Análisis IA completado',
        subtitle: 'La detección se guardó en la base de datos.',
      });
    } catch (error) {
      console.log('[CameraScan] Catch error:', error);
      const isOfflineQueueError =
        error === OFFLINE_QUEUE_ERROR
        || (error instanceof Error && error.message === OFFLINE_QUEUE_ERROR.message);

      if (isOfflineQueueError) {
        await refreshPendingCount();
        setSyncMessage('Sin conexión. Guardamos este análisis para sincronizarlo luego.');
        showToast({
          type: 'warning',
          title: 'Sin conexión',
          subtitle: 'Tu análisis quedó en cola y se puede reintentar.',
        });
        return;
      }

      const { isOffline, shouldShowError, message } = await handleServiceError(error, 'No se pudo analizar la planta');
      console.log('[CameraScan] Error handling result:', { isOffline, shouldShowError, message });

      if (!shouldShowError) {
        setIsAnalyzing(false);
        return;
      }

      if (isOffline) {
        await refreshPendingCount();
        setSyncMessage('Sin conexión. Guardamos este análisis para sincronizarlo luego.');
        showToast({
          type: 'warning',
          title: 'Sin conexión',
          subtitle: 'Tu análisis quedó en cola y se puede reintentar.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'No se pudo analizar la planta',
          subtitle: message,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

   if (isLoadingPermissions) {
     const { styles } = useCameraScanTheme();
     return <Text style={styles.loadingPermissionsText}>Cargando permisos...</Text>;
   }

  if (!isPermissionGranted) {
    return (
      <CustomSafeArea>
        <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />

        <View style={styles.permissionContainer}>
          <View style={styles.permissionBox}>
            <Text style={styles.title}>Permisos requeridos</Text>

            <Text style={styles.subtitle}>
              Necesitamos cámara y galería para análisis automático. Puedes
              habilitarlas ahora o usar modo limitado sin escaneo.
            </Text>

            {!isPermanentlyDenied ? (
              <TouchableOpacity style={styles.actionButton} onPress={requestPermissions}>
                <Text style={styles.actionText}>Conceder permisos</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Linking.openSettings()}
              >
                <Text style={styles.actionText}>Ir a ajustes</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CustomSafeArea>
    );
  }

  if (lastPhoto) {
    return (
      <CustomSafeArea>
        <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />

        <ScrollView
          style={styles.previewContainer}
          contentContainerStyle={styles.previewContent}
          showsVerticalScrollIndicator={false}
        >
          <Image source={{ uri: lastPhoto.uri }} style={styles.previewImage} />

          {pendingDetectionsCount > 0 ? (
            <View style={styles.syncCard}>
              <Text style={styles.syncTitle}>Sincronización pendiente</Text>
              <Text style={styles.syncSubtitle}>
                Tienes {pendingDetectionsCount} análisis en cola por falta de conexión.
              </Text>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={syncPendingDetections}
                disabled={isSyncing}
              >
                <Text style={styles.secondaryText}>
                  {isSyncing ? 'Sincronizando...' : 'Reintentar sincronización'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {syncMessage ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{syncMessage}</Text>
            </View>
          ) : null}

          {analysisResult ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Resultado IA</Text>
              <Text style={styles.resultName}>{analysisResult.scientificName}</Text>
              {analysisResult.commonName ? (
                <Text style={styles.resultSubtitle}>{analysisResult.commonName}</Text>
              ) : null}

              <Text style={styles.resultMeta}>
                Confianza: {Math.round(analysisResult.confidence * 100)}% ·
                Proveedor: {analysisResult.provider}
              </Text>

              <Text style={styles.summaryText}>{analysisResult.summary}</Text>

              <View style={styles.careList}>
                <Text style={styles.careItem}>Riego: {analysisResult.care.watering}</Text>
                <Text style={styles.careItem}>Luz: {analysisResult.care.light}</Text>
                <Text style={styles.careItem}>Suelo: {analysisResult.care.soil}</Text>
                <Text style={styles.careItem}>Temperatura: {analysisResult.care.temperature}</Text>
                <Text style={styles.careItem}>Humedad: {analysisResult.care.humidity}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={clearPhoto}>
              <Text style={styles.secondaryText}>Reintentar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.previewPrimaryButton}
              onPress={onAnalyzeWithAI}
              disabled={isAnalyzing}
            >
              <Text style={styles.actionText}>
                {isAnalyzing ? 'Analizando...' : 'Usar para IA'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </CustomSafeArea>
    );
  }

  return (
    <CustomSafeArea>
      <View style={styles.root}>
        <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />

        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flashMode}
          />

          <View style={styles.overlayBottom}>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.sideButton} onPress={toggleFacing}>
                <Feather name="refresh-ccw" size={20} color={theme.colors.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.captureButton} onPress={onCapture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.sideButton} onPress={toggleFlash}>
                <Text style={styles.flashText}>{flashMode.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onPickFromGallery}
            >
              <Text style={styles.secondaryText}>Abrir galería</Text>
            </TouchableOpacity>

            {pendingDetectionsCount > 0 ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={syncPendingDetections}
                disabled={isSyncing}
              >
                <Text style={styles.secondaryText}>
                  {isSyncing
                    ? 'Sincronizando análisis pendientes...'
                    : `Reintentar pendientes (${pendingDetectionsCount})`}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};
