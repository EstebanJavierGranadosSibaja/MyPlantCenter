import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { detectionHistoryService, DetectionRecord } from 'src/features/camera/services/detectionHistory.service';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
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

interface StatusChipProps {
  status: DetectionRecord['status'];
  styles: ReturnType<typeof useHistoryScreenTheme>['styles'];
  colors: ReturnType<typeof useHistoryScreenTheme>['theme']['colors'];
}

const StatusChip: React.FC<StatusChipProps> = ({ status, styles, colors }) => {
  const config = {
    pending: { label: 'Pendiente', bg: colors.warning + '20', color: colors.warning },
    synced: { label: 'Sincronizado', bg: colors.success + '20', color: colors.success },
    failed: { label: 'Error', bg: colors.error + '20', color: colors.error },
  };

  const { label, bg, color } = config[status];

  return (
    <View style={[styles.statusChip, { backgroundColor: bg }]}>
      <Text style={[styles.statusLabel, { color }]}>{label}</Text>
    </View>
  );
};

interface DetectionItemProps {
  record: DetectionRecord;
  theme: ReturnType<typeof useHistoryScreenTheme>['theme'];
  styles: ReturnType<typeof useHistoryScreenTheme>['styles'];
}

const DetectionItem: React.FC<DetectionItemProps> = ({ record, styles, theme }) => (
  <View style={styles.itemCard}>
    <View style={styles.imageContainer}>
      {record.imageUri ? (
        <Image source={{ uri: record.imageUri }} style={styles.imageContainer} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ fontSize: 20 }}>🌿</Text>
        </View>
      )}
    </View>

    <View style={styles.itemContent}>
      <Text style={styles.plantName} numberOfLines={1}>
        {record.plantName || 'Sin nombre'}
      </Text>

      {record.scientificName ? (
        <Text style={styles.scientificName} numberOfLines={1}>
          {record.scientificName}
        </Text>
      ) : null}

      <View style={styles.itemMeta}>
        <StatusChip status={record.status} styles={styles} colors={theme.colors} />
        <Text style={styles.timestamp}>{formatDate(record.timestamp)}</Text>
      </View>
    </View>
  </View>
);

const EmptyState: React.FC<{ styles: ReturnType<typeof useHistoryScreenTheme>['styles'] }> = ({ styles }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyEmoji}>🌱</Text>
    <Text style={styles.emptyTitle}>No hay historial</Text>
    <Text style={styles.emptyDescription}>
      Las detecciones que realices aparecerán aquí. Si estás sin conexión, se sincronizarán automáticamente cuando vuelvas a tener internet.
    </Text>
  </View>
);

export const HistoryScreen: React.FC = () => {
  const { theme, styles } = useHistoryScreenTheme();
  const [records, setRecords] = React.useState<DetectionRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadHistory = React.useCallback(async () => {
    try {
      const data = await detectionHistoryService.getAll();
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <CustomSafeArea>
      <AppHeader title="Historial" subtitle="DETECCIONES" showBack />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : records.length === 0 ? (
        <EmptyState styles={styles} />
      ) : (
        <ScrollView style={styles.root} contentContainerStyle={styles.listContainer}>
          {records.map((record) => (
            <DetectionItem key={record.id} record={record} theme={theme} styles={styles} />
          ))}
        </ScrollView>
      )}
    </CustomSafeArea>
  );
};