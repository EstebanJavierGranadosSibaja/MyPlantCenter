import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Skeleton } from 'src/shared/components/ui/Skeleton/Skeleton';
import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { careHistoryService } from 'src/features/care/services/careHistory.service';
import { CareHistoryItem } from 'src/features/care/types/care.types';
import {
  buildCalendarDays,
  buildCareSummary,
  buildCareTasks,
  calculateCareStreak,
  CareStatus,
  CareTask,
  sortCareTasksByPriority,
} from 'src/features/care/utils/careSchedule';
import { plantService } from 'src/features/plants/services/plant.service';
import { Plant } from 'src/features/plants/types/plant.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { Badge } from 'src/shared/components/ui/Badge/Badge';
import { Button, DetailHeader, Screen, Surface, Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_LABELS: Record<CareStatus, string> = {
  overdue:  'Atrasada',
  due:      'Hoy',
  soon:     'Pronto',
  upcoming: 'Programada',
};

// ─────────────────────────────────────────────────────────────────────────────

export function WateringCalendarV2() {
  const theme = useUITheme();
  const { user } = useAuth();
  const navigation = useNavigation<RootNav>();

  const [loading, setLoading]           = React.useState(true);
  const [plants, setPlants]             = React.useState<Plant[]>([]);
  const [history, setHistory]           = React.useState<CareHistoryItem[]>([]);
  const [error, setError]               = React.useState<string | null>(null);
  const [pendingPlantId, setPending]    = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    if (!user?.id) { setPlants([]); setHistory([]); setError(null); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const [plantsRes, historyRes] = await Promise.all([
        plantService.getByUser(user.id),
        careHistoryService.getUserHistory(user.id),
      ]);
      setPlants(plantsRes);
      setHistory(historyRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el calendario.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(React.useCallback(() => { loadData(); }, [loadData]));

  const tasks         = React.useMemo(() => buildCareTasks(plants), [plants]);
  const summary       = React.useMemo(() => buildCareSummary(tasks), [tasks]);
  const wateringHist  = React.useMemo(() => history.filter(h => h.type === 'watering'), [history]);
  const streak        = React.useMemo(() => calculateCareStreak(wateringHist), [wateringHist]);
  const priorityTasks = React.useMemo(() => sortCareTasksByPriority(tasks), [tasks]);
  const calendarDays  = React.useMemo(() => buildCalendarDays(tasks, 14), [tasks]);

  const formatDueLabel = (task: CareTask): string => {
    if (task.daysUntil < 0) {
      const d = Math.abs(task.daysUntil);
      return `Atrasada ${d} día${d === 1 ? '' : 's'}`;
    }
    if (task.daysUntil === 0) return 'Riego hoy';
    if (task.daysUntil === 1) return 'Mañana';
    return `En ${task.daysUntil} días`;
  };

  const statusColor = (status: CareStatus): string => {
    if (status === 'overdue') return theme.colors.error;
    if (status === 'due')     return theme.colors.warning;
    if (status === 'soon')    return theme.colors.accent;
    return theme.colors.textTertiary;
  };

  const handleComplete = async (task: CareTask) => {
    if (!user?.id || pendingPlantId) return;
    setPending(task.plantId);
    const completedAt = new Date().toISOString();
    try {
      await careHistoryService.logWatering(user.id, task.plantId, completedAt, `${task.plantId}:${completedAt}`);
      showToast({ type: 'success', title: 'Riego registrado', subtitle: `${task.plantName} quedó como regada.` });
      await loadData();
    } catch (err) {
      showToast({ type: 'error', title: 'No se pudo registrar el riego', subtitle: err instanceof Error ? err.message : undefined, autoDismiss: false });
    } finally {
      setPending(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen scroll edges={['top', 'left', 'right']} contentStyle={styles.content}>

      {/* Negative margin cancels the content's horizontal padding so the
          header spans full width while its inner padding aligns with the cards. */}
      <View style={styles.headerWrap}>
        <DetailHeader title="Calendario de riego" />
      </View>

      {loading ? (
        <>
          <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
            <Skeleton width="45%" height={16} />
            <View style={styles.pillsRow}>
              <Skeleton width="31%" height={64} radius={14} />
              <Skeleton width="31%" height={64} radius={14} />
              <Skeleton width="31%" height={64} radius={14} />
            </View>
            <View style={[styles.streakRow, { marginTop: 4 }]}>
              <Skeleton width="40%" height={13} />
              <Skeleton width="25%" height={16} />
            </View>
          </Surface>
          <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
            <Skeleton width="50%" height={16} />
            {[0, 1, 2].map(i => <Skeleton key={i} width="100%" height={52} radius={10} />)}
          </Surface>
        </>
      ) : error ? (
        <EmptyState iconName="alert-circle" title="No se pudo cargar" subtitle={error} actionLabel="Reintentar" onAction={loadData} />
      ) : plants.length === 0 ? (
        <EmptyState iconName="droplet" title="Sin plantas registradas" subtitle="Agrega una planta para generar tu calendario de riego." actionLabel="Agregar planta" onAction={() => navigation.navigate('AddPlant')} />
      ) : (
        <>
          {/* ── Summary card ───────────────────────────────────────────── */}
          <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text variant="title">Resumen de riego</Text>
              <Text variant="caption" color="textTertiary">{summary.total} tareas activas</Text>
            </View>

            <View style={styles.pillsRow}>
              {[
                { label: 'Atrasadas', value: summary.overdue },
                { label: 'Hoy',       value: summary.dueToday },
                { label: 'Próximas',  value: summary.soon + summary.upcoming },
              ].map(({ label, value }) => (
                <View key={label} style={[styles.pill, { backgroundColor: theme.colors.bgSubtle, borderColor: theme.colors.borderSubtle }]}>
                  <Text variant="numeric">{value}</Text>
                  <Text variant="overline" color="textTertiary">{label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.streakRow}>
              <Text variant="label" color="textSecondary">Racha de cuidado</Text>
              <Text variant="title" color="accentForeground">{streak} días</Text>
            </View>
          </Surface>

          {/* ── Priority list ──────────────────────────────────────────── */}
          <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text variant="title">Prioridad inteligente</Text>
              <Text variant="caption" color="textTertiary">Ordenado por urgencia</Text>
            </View>

            {priorityTasks.length === 0 ? (
              <Text variant="bodyMd" color="textTertiary">Sin tareas de riego por ahora.</Text>
            ) : (
              priorityTasks.map(task => (
                <View key={task.plantId} style={[styles.taskRow, { borderTopColor: theme.colors.borderSubtle }]}>
                  <View style={styles.taskInfo}>
                    <Text variant="title" numberOfLines={1}>{task.plantName}</Text>
                    <Text variant="caption" color="textTertiary">
                      Cada {task.wateringFrequencyDays} día{task.wateringFrequencyDays === 1 ? '' : 's'} · {formatDueLabel(task)}
                    </Text>
                  </View>
                  <View style={styles.taskActions}>
                    <Badge
                      label={STATUS_LABELS[task.status]}
                      iconName={task.status === 'overdue' ? 'alert-circle' : 'droplet'}
                      color={statusColor(task.status)}
                      size="sm"
                    />
                    {(task.status === 'overdue' || task.status === 'due') && (
                      <Button
                        label={pendingPlantId === task.plantId ? 'Guardando...' : 'Marcar'}
                        onPress={() => handleComplete(task)}
                        loading={pendingPlantId === task.plantId}
                        disabled={pendingPlantId !== null}
                        variant="secondary"
                        size="sm"
                      />
                    )}
                  </View>
                </View>
              ))
            )}
          </Surface>

          {/* ── Calendar section ───────────────────────────────────────── */}
          <View style={styles.calendarSection}>
            <View style={styles.cardHeader}>
              <Text variant="title">Calendario</Text>
              <Text variant="caption" color="textTertiary">Próximos 14 días</Text>
            </View>

            {calendarDays.length === 0 ? (
              <EmptyState iconName="calendar" title="Sin riegos programados" subtitle="Tus plantas están al día por ahora." />
            ) : (
              calendarDays.map(day => (
                <View key={day.key} style={styles.dayBlock}>
                  <Text variant="label" color="textSecondary">{day.label}</Text>
                  {day.tasks.map(task => (
                    <View key={`${day.key}-${task.plantId}`} style={[styles.dayTask, { borderColor: theme.colors.borderSubtle }]}>
                      <View style={styles.taskInfo}>
                        <Text variant="bodyMd" numberOfLines={1}>{task.plantName}</Text>
                        <Text variant="caption" color="textTertiary">
                          Cada {task.wateringFrequencyDays} día{task.wateringFrequencyDays === 1 ? '' : 's'}
                        </Text>
                      </View>
                      <Badge
                        label={STATUS_LABELS[task.status]}
                        iconName={task.status === 'overdue' ? 'alert-circle' : 'droplet'}
                        color={statusColor(task.status)}
                        size="sm"
                      />
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
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
    gap: 12,
  },
  headerWrap: {
    marginHorizontal: -20,
    marginBottom: 4,
  },
  card: {
    padding: 20,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  taskInfo: {
    flex: 1,
    gap: 2,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  calendarSection: {
    gap: 12,
  },
  dayBlock: {
    gap: 8,
    marginTop: 4,
  },
  dayTask: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    gap: 8,
  },
});
