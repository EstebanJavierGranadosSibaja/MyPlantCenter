import { Feather } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useCameraScanTheme } from './CameraScan.styles';

export const CameraScan: React.FC = () => {
  const { theme, styles } = useCameraScanTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [capturedUri, setCapturedUri] = React.useState<string | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const cameraRef = React.useRef<CameraView | null>(null);

  const onCapture = async () => {
    if (!cameraRef.current || isCapturing) {
      return;
    }

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      setCapturedUri(photo.uri);
    } catch {
      showToast({
        type: 'error',
        title: 'No se pudo tomar la foto',
        autoDismiss: false,
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const onUseForAi = () => {
    if (!capturedUri) {
      return;
    }

    showToast({
      type: 'success',
      title: 'Imagen lista para IA',
      subtitle: 'Ya puedes conectar aquí el endpoint de inferencia.',
    });
  };

  if (!permission) {
    return (
      <CustomSafeArea>
        <View style={styles.root}>
          <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />
          <View style={styles.content}>
            <View style={styles.frame}>
              <Text style={styles.title}>Cargando permisos...</Text>
            </View>
          </View>
        </View>
      </CustomSafeArea>
    );
  }

  if (!permission.granted) {
    return (
      <CustomSafeArea>
        <View style={styles.root}>
          <AppHeader title="Escáner IA" subtitle="BÚSQUEDA VISUAL" showBack />
          <View style={styles.content}>
            <View style={styles.frame}>
              <Feather name="camera-off" size={theme.typography.size['6xl']} color={theme.colors.warning} />
              <Text style={styles.title}>Permiso requerido</Text>
              <Text style={styles.subtitle}>Necesitamos cámara para escanear plantas con IA.</Text>
              <TouchableOpacity style={styles.actionButton} onPress={requestPermission} activeOpacity={0.85}>
                <Text style={styles.actionButtonText}>Conceder permiso</Text>
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
          <View style={styles.cameraWrap}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
              activeOpacity={0.85}
            >
              <Feather name="refresh-ccw" size={theme.typography.size.base} color={theme.colors.textPrimary} />
              <Text style={styles.secondaryButtonText}>Girar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={onCapture} activeOpacity={0.85}>
              <Feather name="camera" size={theme.typography.size['2xl']} color={theme.colors.textInverse} />
              <Text style={styles.captureButtonText}>{isCapturing ? 'Capturando...' : 'Capturar'}</Text>
            </TouchableOpacity>
          </View>

          {capturedUri && (
            <View style={styles.previewWrap}>
              <Image source={{ uri: capturedUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.actionButton} onPress={onUseForAi} activeOpacity={0.85}>
                <Text style={styles.actionButtonText}>Usar imagen para IA</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.frame}>
            <Text style={styles.subtitle}>Captura una planta y usa la imagen para inferencia IA en el siguiente paso.</Text>
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};
