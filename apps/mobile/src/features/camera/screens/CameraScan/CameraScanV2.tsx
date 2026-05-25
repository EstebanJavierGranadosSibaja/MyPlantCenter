import { Feather } from '@expo/vector-icons';
import { useCamera } from '@features/camera/hooks/useCamara';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import {
  OFFLINE_QUEUE_ERROR,
  PlantDetectionResult,
  plantDetectionService,
} from 'src/features/camera/services/plantDetection.service';
import { plantJobService } from 'src/features/plants/services/plantJob.service';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { Button, Screen, Surface, Text, useUITheme } from 'src/ui';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

// ─────────────────────────────────────────────────────────────────────────────

const CONNECTIVITY_REGEX = /network|timed?\s*out|timeout|conex|fetch|enotfound|econn/i;

function extractMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar la operación.';
}

async function checkConnectivity(): Promise<boolean> {
  try {
    return Boolean((await NetInfo.fetch()).isConnected);
  } catch {
    return true;
  }
}

async function resolveServiceError(error: unknown, fallback: string) {
  const message      = extractMessage(error);
  const looksOffline = CONNECTIVITY_REGEX.test(message);
  const isOffline    = looksOffline && !(await checkConnectivity());
  return { isOffline, message: looksOffline ? message : fallback };
}

// ─────────────────────────────────────────────────────────────────────────────

export function CameraScanV2() {
  const theme      = useUITheme();
  const { user }   = useAuth();
  const navigation = useNavigation<RootNav>();

  const [isCapturing,           setIsCapturing]           = React.useState(false);
  const [isAnalyzing,           setIsAnalyzing]           = React.useState(false);
  const [isSyncing,             setIsSyncing]             = React.useState(false);
  const [captureSource,         setCaptureSource]         = React.useState<'camera' | 'gallery'>('camera');
  const [analysisResult,        setAnalysisResult]        = React.useState<PlantDetectionResult | null>(null);
  const [pendingCount,          setPendingCount]          = React.useState(0);
  const [syncMessage,           setSyncMessage]           = React.useState<string | null>(null);

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
    error: cameraError,
    facing,
    flashMode,
  } = useCamera();

  const userId = user?.id ?? null;

  // ── Side effects ─────────────────────────────────────────────────────────

  const refreshPending = React.useCallback(async () => {
    const jobs = await plantJobService.getPendingAndFailedJobs();
    setPendingCount(jobs.length);
  }, []);

  React.useEffect(() => { void refreshPending(); }, [refreshPending]);

  React.useEffect(() => {
    if (!cameraError) return;
    showToast({ type: 'error', title: cameraError });
  }, [cameraError]);

  // ── Handlers ─────────────────────────────────────────────────────────────

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
      await plantJobService.createJob(photo.uri, userId ?? undefined);
      await refreshPending();
      showToast({ type: 'info', title: 'Foto capturada', subtitle: 'Visible en historial' });
    } catch { /* local history failure is non-critical */ }

    try { await saveToGallery(photo.uri); } catch { /* gallery save is non-critical */ }
  };

  const onPickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setCaptureSource('gallery');
    setAnalysisResult(null);
    setSyncMessage(null);

    setExternalPhoto({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      base64: asset.base64 ?? undefined,
      mimeType: asset.mimeType ?? 'image/jpeg',
    });

    try {
      await plantJobService.createJob(asset.uri, userId ?? undefined);
      showToast({ type: 'info', title: 'Imagen seleccionada', subtitle: 'Visible en historial' });
    } catch { /* non-critical */ }
  };

  const onAnalyzeWithAI = async () => {
    if (isAnalyzing || !lastPhoto || !userId) {
      if (!userId) showToast({ type: 'error', title: 'Sesión inválida', subtitle: 'Inicia sesión otra vez.' });
      return;
    }
    if (!lastPhoto.base64) {
      showToast({ type: 'warning', title: 'Imagen no compatible', subtitle: 'Toma otra foto o elige una imagen válida.' });
      return;
    }

    setIsAnalyzing(true);
    setSyncMessage(null);

    try {
      const result = await plantDetectionService.analyze(userId, {
        imageUri:      lastPhoto.uri,
        imageBase64:   lastPhoto.base64,
        imageMimeType: lastPhoto.mimeType ?? 'image/jpeg',
        source:        captureSource,
      });
      setAnalysisResult(result);
      showToast({ type: 'success', title: 'Análisis IA completado', subtitle: 'La detección se guardó.' });
    } catch (err) {
      const isOfflineQueue =
        err === OFFLINE_QUEUE_ERROR ||
        (err instanceof Error && err.message === OFFLINE_QUEUE_ERROR.message);

      if (isOfflineQueue) {
        await refreshPending();
        setSyncMessage('Sin conexión. Guardamos este análisis para sincronizarlo luego.');
        showToast({ type: 'warning', title: 'Sin conexión', subtitle: 'Tu análisis quedó en cola.' });
        return;
      }

      const { isOffline, message } = await resolveServiceError(err, 'No se pudo analizar la planta');
      if (isOffline) {
        await refreshPending();
        setSyncMessage('Sin conexión. Guardamos este análisis para sincronizarlo luego.');
        showToast({ type: 'warning', title: 'Sin conexión', subtitle: 'Tu análisis quedó en cola.' });
      } else {
        showToast({ type: 'error', title: 'No se pudo analizar la planta', subtitle: message });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSyncPending = React.useCallback(async () => {
    if (!userId || isSyncing) return;
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
        const jobUserId = job.userId ?? userId;
        if (!jobUserId) {
          await plantJobService.updateJobStatus(job.id, 'failed', 'Usuario no asociado al trabajo');
          continue;
        }
        if (!job.userId) await plantJobService.assignJobUser(job.id, jobUserId);
        await plantDetectionService.analyze(jobUserId, { imageUri: job.imageUri, imageBase64: undefined, source: 'camera-manual-sync' });
        await plantJobService.removeJob(job.id);
        synced += 1;
      } catch (err) {
        const message      = extractMessage(err);
        const skipAttempt  = err === OFFLINE_QUEUE_ERROR || (err instanceof Error && err.message === OFFLINE_QUEUE_ERROR.message);
        await plantJobService.updateJobStatus(job.id, 'failed', message, { skipAttempt });
      }
    }

    await refreshPending();
    const remaining = (await plantJobService.getPendingAndFailedJobs()).length;

    if (synced > 0) {
      showToast({ type: 'success', title: 'Sincronización completada', subtitle: `Se sincronizaron ${synced} análisis.` });
    }
    if (remaining > 0) {
      setSyncMessage(`Quedan ${remaining} análisis pendientes.`);
      showToast({ type: 'warning', title: 'Sincronización parcial', subtitle: 'Algunos análisis siguen pendientes.' });
    } else {
      setSyncMessage('Sincronización al día.');
    }

    setIsSyncing(false);
  }, [userId, isSyncing, refreshPending]);

  // ── States ───────────────────────────────────────────────────────────────

  if (isLoadingPermissions) {
    return (
      <View style={[styles.loadingWrap, { backgroundColor: theme.colors.bg }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text variant="bodyMd" color="textSecondary">Cargando permisos...</Text>
      </View>
    );
  }

  if (!isPermissionGranted) {
    return (
      <Screen edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.navBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Feather name="arrow-left" size={theme.layout.iconMd} color={theme.colors.textPrimary} />
          </Pressable>
          <Text variant="h2">Escáner IA</Text>
        </View>

        <View style={styles.permissionCenter}>
          <Surface elevation="sm" radius="lg" border="subtle" style={styles.permissionCard}>
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.accentSoft }]}>
              <Feather name="camera" size={32} color={theme.colors.accent} />
            </View>
            <Text variant="title" align="center">Permisos requeridos</Text>
            <Text variant="bodyMd" color="textSecondary" align="center">
              Necesitamos acceso a la cámara y galería para el análisis automático de plantas.
            </Text>
            <Button
              label={isPermanentlyDenied ? 'Abrir ajustes' : 'Conceder permisos'}
              onPress={isPermanentlyDenied ? () => Linking.openSettings() : requestPermissions}
              leftSlot={<Feather name={isPermanentlyDenied ? 'settings' : 'check-circle'} size={theme.layout.iconSm} color={theme.colors.textInverse} />}
              fullWidth
            />
          </Surface>
        </View>
      </Screen>
    );
  }

  if (lastPhoto) {
    return (
      <Screen scroll edges={['top', 'left', 'right']} contentStyle={styles.previewContent}>

        {/* Nav bar */}
        <View style={styles.navBar}>
          <Pressable onPress={clearPhoto} hitSlop={8}>
            <Feather name="arrow-left" size={theme.layout.iconMd} color={theme.colors.textPrimary} />
          </Pressable>
          <Text variant="h2">Vista previa</Text>
        </View>

        {/* Photo */}
        <Image source={{ uri: lastPhoto.uri }} style={[styles.previewImage, { backgroundColor: theme.colors.bgSubtle }]} resizeMode="cover" />

        {/* Pending sync */}
        {pendingCount > 0 && (
          <Surface elevation="xs" radius="lg" border="subtle" style={styles.infoCard}>
            <Text variant="title">Sincronización pendiente</Text>
            <Text variant="bodyMd" color="textSecondary">
              Tienes {pendingCount} análisis en cola por falta de conexión.
            </Text>
            <Button
              label={isSyncing ? 'Sincronizando...' : 'Reintentar sincronización'}
              onPress={onSyncPending}
              loading={isSyncing}
              disabled={isSyncing}
              variant="secondary"
              fullWidth
            />
          </Surface>
        )}

        {/* Sync message */}
        {syncMessage && (
          <Surface elevation="xs" radius="lg" border="subtle" style={[styles.infoCard, styles.messageCard]}>
            <Text variant="bodyMd" color="textSecondary" align="center">{syncMessage}</Text>
          </Surface>
        )}

        {/* AI result */}
        {analysisResult && (
          <Surface elevation="xs" radius="lg" border="subtle" style={styles.resultCard}>
            <Text variant="overline" color="textTertiary">Resultado IA</Text>
            <Text variant="h3" color="accentForeground">{analysisResult.scientificName}</Text>
            {analysisResult.commonName ? (
              <Text variant="bodyMd" color="textSecondary">{analysisResult.commonName}</Text>
            ) : null}

            <Text variant="caption" color="textTertiary">
              Confianza: {Math.round(analysisResult.confidence * 100)}% · Proveedor: {analysisResult.provider}
            </Text>

            <Text variant="bodyMd" color="textSecondary">{analysisResult.summary}</Text>

            <View style={styles.careList}>
              {[
                { label: 'Riego',        value: analysisResult.care.watering },
                { label: 'Luz',          value: analysisResult.care.light },
                { label: 'Suelo',        value: analysisResult.care.soil },
                { label: 'Temperatura',  value: analysisResult.care.temperature },
                { label: 'Humedad',      value: analysisResult.care.humidity },
              ].map(({ label, value }) => (
                <Text key={label} variant="caption" color="textSecondary">{label}: {value}</Text>
              ))}
            </View>

            <Button
              label="Agregar a mis plantas"
              onPress={() => navigation.navigate('AddPlant', {
                prefill: {
                  name:    analysisResult.commonName ?? analysisResult.scientificName,
                  species: analysisResult.scientificName,
                  notes:   analysisResult.summary,
                },
              })}
              fullWidth
              leftSlot={<Feather name="plus" size={theme.layout.iconSm} color={theme.colors.textOnAccent} />}
            />
          </Surface>
        )}

        {/* Actions */}
        <View style={styles.previewActions}>
          <View style={styles.actionWrap}>
            <Button label="Reintentar" onPress={clearPhoto} variant="secondary" fullWidth />
          </View>
          <View style={styles.actionWrap}>
            <Button
              label={isAnalyzing ? 'Analizando...' : 'Usar para IA'}
              onPress={onAnalyzeWithAI}
              loading={isAnalyzing}
              disabled={isAnalyzing}
              fullWidth
            />
          </View>
        </View>

      </Screen>
    );
  }

  // ── Camera view ───────────────────────────────────────────────────────────
  return (
    <View style={[styles.cameraRoot, { backgroundColor: '#000' }]}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing={facing} flash={flashMode} />

      {/* Top overlay — back button */}
      <View style={styles.overlayTop}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.overlayBackButton}>
          <Feather name="arrow-left" size={theme.layout.iconMd} color="#fff" />
        </Pressable>
      </View>

      {/* Bottom overlay — controls */}
      <View style={styles.overlayBottom}>

        {/* Capture row: flip | shutter | flash */}
        <View style={styles.captureRow}>
          <Pressable onPress={toggleFacing} style={styles.sideButton}>
            <Feather name="refresh-ccw" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={onCapture} disabled={isCapturing} style={styles.captureButton}>
            <View style={styles.captureInner} />
          </Pressable>
          <Pressable onPress={toggleFlash} style={styles.sideButton}>
            <Text variant="label" style={styles.flashLabel}>{flashMode.toUpperCase()}</Text>
          </Pressable>
        </View>

        {/* Gallery */}
        <Pressable onPress={onPickFromGallery} style={styles.overlayTextButton}>
          <Text variant="label" style={styles.overlayTextLabel}>Abrir galería</Text>
        </Pressable>

        {/* Pending sync */}
        {pendingCount > 0 && (
          <Pressable onPress={onSyncPending} disabled={isSyncing} style={styles.overlayTextButton}>
            <Text variant="label" style={styles.overlayTextLabel}>
              {isSyncing
                ? 'Sincronizando análisis pendientes...'
                : `Reintentar pendientes (${pendingCount})`}
            </Text>
          </Pressable>
        )}

      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Loading ──────────────────────────────────────────────────────────────
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  // ── Permission ───────────────────────────────────────────────────────────
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  permissionCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  permissionCard: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Preview ──────────────────────────────────────────────────────────────
  previewContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 18,
  },
  infoCard: {
    padding: 16,
    gap: 8,
  },
  messageCard: {
    alignItems: 'center',
  },
  resultCard: {
    padding: 16,
    gap: 8,
  },
  careList: {
    gap: 4,
    marginTop: 4,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionWrap: {
    flex: 1,
  },

  // ── Camera view ──────────────────────────────────────────────────────────
  cameraRoot: {
    flex: 1,
  },
  overlayTop: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  sideButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  flashLabel: {
    color: '#fff',
  },
  overlayTextButton: {
    height: 40,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  overlayTextLabel: {
    color: '#fff',
  },
});
