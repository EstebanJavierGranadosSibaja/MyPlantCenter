import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { plantJobService, PlantJob } from 'src/features/plants/services/plantJob.service';
import { plantDetectionService } from 'src/features/camera/services/plantDetection.service';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { useHistoryScreenTheme } from './HistoryScreen.styles';

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface SectionHeaderProps {
  title: string;
  count: number;
  emoji: string;
  styles: ReturnType<typeof useHistoryScreenTheme>['styles'];
  colors: ReturnType<typeof useHistoryScreenTheme>['theme']['colors'];
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count, emoji, styles, colors }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{emoji} {title}</Text>
    <View style={[styles.sectionBadge, { backgroundColor: colors.warning + '20' }]}>
      <Text style={[styles.sectionCount, { color: colors.warning }]}>{count}</Text>
    </View>
  </View>
);

interface StatusChipProps {
  status: PlantJob['status'];
  styles: ReturnType<typeof useHistoryScreenTheme>['styles'];
  colors: ReturnType<typeof useHistoryScreenTheme>['theme']['colors'];
}

const StatusChip: React.FC<StatusChipProps> = ({ status, styles, colors }) => {
  const config = {
    pending: { label: '⏳ Pendiente', bg: colors.warning + '20', color: colors.warning },
    syncing: { label: '🔄 Sincronizando', bg: colors.warning + '20', color: colors.warning },
    failed: { label: '❌ Error', bg: colors.error + '20', color: colors.error },
  };

  const { label, bg, color } = config[status] || config.pending;

  return (
    <View style={[styles.statusChip, { backgroundColor: bg }]}>
      <Text style={[styles.statusLabel, { color }]}>{label}</Text>
    </View>
  );
};

interface JobItemProps {
  job: PlantJob;
  styles: ReturnType<typeof useHistoryScreenTheme>['styles'];
  theme: ReturnType<typeof useHistoryScreenTheme>['theme'];
  onRetry: (job: PlantJob) => void;
  onDelete: (job: PlantJob) => void;
  syncingId: string | null;
}

const JobItem: React.FC<JobItemProps> = ({ job, styles, theme, onRetry, onDelete, syncingId }) => {
  const isSyncing = syncingId === job.id;
  const canRetry = job.status === 'pending' || job.status === 'failed';
  const hasError = job.status === 'failed' && job.lastError;

  return (
    <View style={styles.jobCard}>
      <View style={styles.imageContainer}>
        {job.imageUri ? (
          <Image source={{ uri: job.imageUri }} style={styles.jobImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 20 }}>🌿</Text>
          </View>
        )}
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.plantName} numberOfLines={1}>
          {job.plantName || 'Pendiente'}
        </Text>

        {job.scientificName ? (
          <Text style={styles.scientificName} numberOfLines={1}>
            {job.scientificName}
          </Text>
        ) : null}

        <View style={styles.itemMeta}>
          <StatusChip status={job.status} styles={styles} colors={theme.colors} />
          <Text style={styles.timestamp}>{formatDate(job.timestamp)}</Text>
        </View>

        {hasError && (
          <Text style={[styles.timestamp, { color: theme.colors.error, marginTop: 4 }]} numberOfLines={2}>
            ⚠️ {job.lastError}
          </Text>
        )}

        <View style={styles.jobActions}>
          {canRetry && !isSyncing && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => onRetry(job)}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          )}

          {isSyncing && (
            <Text style={styles.timestamp}>🔄 Sincronizando...</Text>
          )}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(job)}
          >
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const EmptyState: React.FC<{ title: string; description: string; styles: ReturnType<typeof useHistoryScreenTheme>['styles'] }> = ({ title, description, styles }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyEmoji}>📭</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyDescription}>{description}</Text>
  </View>
);

export const HistoryScreen: React.FC = () => {
  const { theme, styles } = useHistoryScreenTheme();
  const [pendingJobs, setPendingJobs] = React.useState<PlantJob[]>([]);
  const [failedJobs, setFailedJobs] = React.useState<PlantJob[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [syncingId, setSyncingId] = React.useState<string | null>(null);

  const loadJobs = React.useCallback(async () => {
    try {
      const [pending, failed] = await Promise.all([
        plantJobService.getPendingJobs(),
        plantJobService.getFailedJobs(),
      ]);
      setPendingJobs(pending);
      setFailedJobs(failed);
    } catch {
      setPendingJobs([]);
      setFailedJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = async (job: PlantJob) => {
    if (syncingId) return;

    const userId = 'manual-retry';
    const payload = {
      imageUri: job.imageUri,
      imageBase64: undefined,
      source: 'history-retry',
    };

    setSyncingId(job.id);

    try {
      await plantJobService.updateJobStatus(job.id, 'syncing');
      const result = await plantDetectionService.analyze(userId, payload);

      showToast({
        type: 'success',
        title: 'Análisis completado',
        subtitle: result.scientificName,
      });
    } catch (error) {
      console.warn('[HistoryScreen] Retry failed:', error);

      await plantJobService.updateJobStatus(
        job.id,
        'failed',
        error instanceof Error ? error.message : 'Unknown error',
      );

      showToast({
        type: 'error',
        title: 'Error al analizar',
        subtitle: 'Intenta de nuevo más tarde',
      });
    } finally {
      setSyncingId(null);
      void loadJobs();
    }
  };

  const handleDelete = async (job: PlantJob) => {
    try {
      await plantJobService.removeJob(job.id);
      void loadJobs();
      showToast({
        type: 'success',
        title: 'Eliminado',
        subtitle: 'El trabajo ha sido eliminado',
      });
    } catch (error) {
      console.warn('[HistoryScreen] Delete failed:', error);
      showToast({
        type: 'error',
        title: 'Error',
        subtitle: 'No se pudo eliminar',
      });
    }
  };

  React.useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const hasPending = pendingJobs.length > 0;
  const hasFailed = failedJobs.length > 0;
  const hasAny = hasPending || hasFailed;

  return (
    <CustomSafeArea>
      <AppHeader title="Historial" subtitle="TRABAJOS" showBack />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : !hasAny ? (
        <EmptyState
          title="No hay trabajos pendientes"
          description="Las detecciones que no se completen aparecerán aquí para que puedas reintentarlas."
          styles={styles}
        />
      ) : (
        <ScrollView style={styles.root} contentContainerStyle={styles.listContainer}>
          {hasPending && (
            <>
              <SectionHeader
                title="Pendientes"
                count={pendingJobs.length}
                emoji="⏳"
                styles={styles}
                colors={theme.colors}
              />
              {pendingJobs.map((job) => (
                <JobItem
                  key={job.id}
                  job={job}
                  styles={styles}
                  theme={theme}
                  onRetry={handleRetry}
                  onDelete={handleDelete}
                  syncingId={syncingId}
                />
              ))}
            </>
          )}

          {hasFailed && (
            <>
              <SectionHeader
                title="Fallidos"
                count={failedJobs.length}
                emoji="❌"
                styles={styles}
                colors={theme.colors}
              />
              {failedJobs.map((job) => (
                <JobItem
                  key={job.id}
                  job={job}
                  styles={styles}
                  theme={theme}
                  onRetry={handleRetry}
                  onDelete={handleDelete}
                  syncingId={syncingId}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </CustomSafeArea>
  );
};