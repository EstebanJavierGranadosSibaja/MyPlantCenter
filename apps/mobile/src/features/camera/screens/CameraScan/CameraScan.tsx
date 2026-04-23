import { Feather } from '@expo/vector-icons';
import { useCamera } from '@features/camera/hooks/useCamara';
import { CameraView } from 'expo-camera';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { useCameraScanTheme } from './CameraScan.styles';

export const CameraScan: React.FC = () => {
  const { theme, styles } = useCameraScanTheme();
  const [isCapturing, setIsCapturing] = React.useState(false);

  const {
    cameraRef,
    isPermissionGranted,
    isLoadingPermissions,
    requestPermissions,
    takePhoto,
    toggleFacing,
    toggleFlash,
    saveToGallery,
    lastPhoto,
    error,
    facing,
    flashMode,
  } = useCamera();

  // 🔔 errores del hook
  React.useEffect(() => {
    if (error) {
      showToast({ type: 'error', title: error });
    }
  }, [error]);

  // 📸 captura con bloqueo + guardado opcional
  const onCapture = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    const photo = await takePhoto({ quality: 0.7 });
    setIsCapturing(false);

    if (!photo) {
      showToast({ type: 'error', title: 'No se pudo tomar la foto' });
      return;
    }

    // opcional: guardar automáticamente
    try {
      await saveToGallery(photo.uri);
      showToast({ type: 'success', title: 'Foto guardada en galería' });
    } catch {
      showToast({ type: 'error', title: 'No se pudo guardar en galería' });
    }
  };

  // 🤖 punto de integración con IA
  const onUseForAi = () => {
    if (!lastPhoto) return;

    showToast({
      type: 'success',
      title: 'Imagen lista para IA',
      subtitle: 'Aquí conectas tu modelo o endpoint.',
    });
  };

  // 🔄 permitir nueva captura (sin tocar el hook)
  const onRetake = () => {
    // truco simple: “ocultar” preview dejando que la cámara vuelva a ser protagonista
    // si quieres reset real, puedes extender el hook con setLastPhoto(null)
    showToast({ type: 'success', title: 'Listo para nueva captura' });
  };

  if (isLoadingPermissions) {
    return (
      <CustomSafeArea>
        <View style={styles.root}>
          <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />
          <View style={styles.content}>
            <Text style={styles.subtitle}>Cargando permisos...</Text>
          </View>
        </View>
      </CustomSafeArea>
    );
  }

  if (!isPermissionGranted) {
    return (
      <CustomSafeArea>
        <View style={styles.root}>
          <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />
          <View style={styles.content}>
            <View style={styles.frame}>
              <Text style={styles.title}>Permiso requerido</Text>
              <Text style={styles.subtitle}>
                Necesitamos acceso a la cámara para escanear plantas.
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={requestPermissions}
                activeOpacity={0.85}
              >
                <Text style={styles.actionButtonText}>Conceder permisos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CustomSafeArea>
    );
  }

  return (
    <CustomSafeArea>
      <View style={styles.root}>
        <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />

        <View style={styles.content}>
          {/* 📷 cámara (se mantiene visible; puedes ocultarla si prefieres full preview) */}
          <View style={styles.cameraWrap}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              flash={flashMode}
            />
          </View>

          {/* 🎛 acciones */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleFacing}
              activeOpacity={0.85}
            >
              <Feather
                name="refresh-ccw"
                size={theme.typography.size.base}
                color={theme.colors.textPrimary}
              />
              <Text style={styles.secondaryButtonText}>Girar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={onCapture}
              activeOpacity={0.85}
              disabled={isCapturing}
            >
              <Feather
                name="camera"
                size={theme.typography.size['2xl']}
                color={theme.colors.textInverse}
              />
              <Text style={styles.captureButtonText}>
                {isCapturing ? 'Capturando...' : 'Capturar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleFlash}
              activeOpacity={0.85}
            >
              <Feather
                name="zap"
                size={theme.typography.size.base}
                color={theme.colors.textPrimary}
              />
              <Text style={styles.secondaryButtonText}>Flash</Text>
            </TouchableOpacity>
          </View>

          {/* 🖼 preview + acciones */}
          {lastPhoto && (
            <View style={styles.previewWrap}>
              <Image
                source={{ uri: lastPhoto.uri }}
                style={styles.previewImage}
              />

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onRetake}
                  activeOpacity={0.85}
                >
                  <Feather
                    name="rotate-ccw"
                    size={theme.typography.size.base}
                    color={theme.colors.textPrimary}
                  />
                  <Text style={styles.secondaryButtonText}>Reintentar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onUseForAi}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionButtonText}>
                    Usar imagen para IA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.frame}>
            <Text style={styles.subtitle}>
              Captura una planta y usa la imagen para inferencia IA en el
              siguiente paso.
            </Text>
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};