import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { LocalPlant, plantLocalService } from 'src/features/plants/services/plantLocal.service';
import { PlantJob, plantJobService } from 'src/features/plants/services/plantJob.service';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { Button, DetailHeader, Screen, Surface, Text, useUITheme } from 'src/ui';
import { plantDetectionService } from '../../services/plantDetection.service';

// ─────────────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<RootStackParamList>;

const formatRelative = (iso: string): string => {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const min = Math.floor((Date.now() - t) / 60000);
  if (min < 1) return 'Ahora';
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  return `Hace ${Math.floor(h / 24)} d`;
};

// ─────────────────────────────────────────────────────────────────────────────

export function ScanHistoryScreen() {
  const theme = useUITheme();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [loading, setLoading] = React.useState(true);
  const [jobs, setJobs]       = React.useState<PlantJob[]>([]);
  const [scans, setScans]     = React.useState<LocalPlant[]>([]);
  const [busyId, setBusyId]   = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const [pending, local] = await Promise.all([
      plantJobService.getPendingAndFailedJobs(),
      plantLocalService.getPlants(),
    ]);
    setJobs(pending);
    setScans(local);
    setLoading(false);
  }, []);

  useFocusEffect(React.useCallback(() => { void load(); }, [load]));

  // ── Acciones ───────────────────────────────────────────────────────────────

  const syncJob = async (job: PlantJob) => {
    if (!userId || busyId) return;
    setBusyId(job.id);
    try {
      const jobUserId = job.userId ?? userId;
      if (!job.userId) await plantJobService.assignJobUser(job.id, jobUserId);
      await plantDetectionService.analyze(jobUserId, { imageUri: job.imageUri, imageBase64: undefined, source: 'scan-history' });
      await plantJobService.removeJob(job.id);
      showToast({ type: 'success', title: 'Análisis completado', subtitle: 'Ya puedes agregarla a tus plantas.' });
      await load();
    } catch {
      showToast({ type: 'warning', title: 'No se pudo analizar', subtitle: 'Revisa tu conexión e intenta de nuevo.' });
    } finally {
      setBusyId(null);
    }
  };

  const discardJob = async (job: PlantJob) => {
    await plantJobService.removeJob(job.id);
    await load();
  };

  const discardScan = async (scan: LocalPlant) => {
    await plantLocalService.removePlant(scan.id);
    await load();
  };

  const addScan = (scan: LocalPlant) => {
    navigation.navigate('AddPlant', {
      prefill: { name: scan.name, species: scan.scientificName, notes: scan.summary },
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const isEmpty = !loading && jobs.length === 0 && scans.length === 0;

  return (
    <Screen scroll edges={['top', 'left', 'right']} contentStyle={styles.content}>
      <View style={styles.headerWrap}>
        <DetailHeader title="Análisis" onBack={() => navigation.goBack()} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      ) : isEmpty ? (
        <EmptyState
          iconName="camera"
          title="Sin análisis aún"
          subtitle="Escanea una planta con la cámara para verla aquí y agregarla a tu colección."
        />
      ) : (
        <>
          {/* ── Pendientes de sincronizar ─────────────────────────────────── */}
          {jobs.length > 0 && (
            <View style={styles.section}>
              <Text variant="overline" color="textTertiary" style={styles.sectionLabel}>
                Pendientes de sincronizar
              </Text>
              {jobs.map(job => (
                <Surface key={job.id} elevation="xs" radius="lg" border="subtle" style={styles.row}>
                  <Image source={{ uri: job.imageUri }} style={[styles.thumb, { backgroundColor: theme.colors.bgSubtle }]} resizeMode="cover" />
                  <View style={styles.rowBody}>
                    <Text variant="label" numberOfLines={1}>Análisis pendiente</Text>
                    <Text variant="caption" color="textTertiary">
                      {formatRelative(job.timestamp)}{job.status === 'failed' ? ' · falló' : ''}
                    </Text>
                    <View style={styles.rowActions}>
                      <Button
                        label={busyId === job.id ? 'Analizando...' : 'Sincronizar'}
                        onPress={() => syncJob(job)}
                        loading={busyId === job.id}
                        disabled={busyId !== null}
                        variant="secondary"
                        size="sm"
                      />
                      <Button
                        label="Descartar"
                        onPress={() => discardJob(job)}
                        disabled={busyId !== null}
                        variant="ghost"
                        size="sm"
                      />
                    </View>
                  </View>
                </Surface>
              ))}
            </View>
          )}

          {/* ── Análisis recientes (addables) ─────────────────────────────── */}
          {scans.length > 0 && (
            <View style={styles.section}>
              <Text variant="overline" color="textTertiary" style={styles.sectionLabel}>
                Análisis recientes
              </Text>
              {scans.map(scan => (
                <Surface key={scan.id} elevation="xs" radius="lg" border="subtle" style={styles.row}>
                  <Image source={{ uri: scan.imageUri }} style={[styles.thumb, { backgroundColor: theme.colors.bgSubtle }]} resizeMode="cover" />
                  <View style={styles.rowBody}>
                    <Text variant="label" numberOfLines={1}>{scan.name}</Text>
                    <Text variant="caption" color="textTertiary" numberOfLines={1}>
                      {scan.scientificName} · {Math.round(scan.confidence * 100)}%
                    </Text>
                    <View style={styles.rowActions}>
                      <Button
                        label="Agregar"
                        onPress={() => addScan(scan)}
                        variant="primary"
                        size="sm"
                        leftSlot={<Feather name="plus" size={theme.layout.iconSm} color={theme.colors.textOnAccent} />}
                      />
                      <Button
                        label="Descartar"
                        onPress={() => discardScan(scan)}
                        variant="ghost"
                        size="sm"
                      />
                    </View>
                  </View>
                </Surface>
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 16,
  },
  headerWrap: {
    marginHorizontal: -20,
  },
  loadingBox: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
});
