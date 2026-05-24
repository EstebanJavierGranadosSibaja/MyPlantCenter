import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
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
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { Badge } from 'src/shared/components/ui/Badge/Badge';
import { useWateringCalendarTheme } from './WateringCalendar.styles';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

const STATUS_LABELS: Record<CareStatus, string> = {
  overdue: 'Atrasada',
  due: 'Hoy',
  soon: 'Pronto',
  upcoming: 'Programada',
};

export const WateringCalendar: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<RootNavigation>();
  const { theme, styles } = useWateringCalendarTheme();

  const [loading, setLoading] = React.useState(true);
  const [plants, setPlants] = React.useState<Plant[]>([]);
  const [history, setHistory] = React.useState<CareHistoryItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingPlantId, setPendingPlantId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    if (!user?.id) {
      setPlants([]);
      setHistory([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [plantsResponse, historyResponse] = await Promise.all([
        plantService.getByUser(user.id),
        careHistoryService.getUserHistory(user.id),
      ]);
      setPlants(plantsResponse);
      setHistory(historyResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar el calendario.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const tasks = React.useMemo(() => buildCareTasks(plants), [plants]);
  const summary = React.useMemo(() => buildCareSummary(tasks), [tasks]);
  const wateringHistory = React.useMemo(
    () => history.filter(item => item.type === 'watering'),
    [history],
  );
  const streak = React.useMemo(() => calculateCareStreak(wateringHistory), [wateringHistory]);
  const priorityTasks = React.useMemo(() => sortCareTasksByPriority(tasks), [tasks]);
  const calendarDays = React.useMemo(() => buildCalendarDays(tasks, 14), [tasks]);

  const formatDueLabel = (task: CareTask): string => {
    if (task.daysUntil < 0) {
      const days = Math.abs(task.daysUntil);
      return `Atrasada ${days} día${days === 1 ? '' : 's'}`;
    }
    if (task.daysUntil === 0) {
      return 'Riego hoy';
    }
    if (task.daysUntil === 1) {
      return 'Mañana';
    }
    return `En ${task.daysUntil} días`;
  };

  const statusColor = (status: CareStatus): string => {
    if (status === 'overdue') return theme.colors.error;
    if (status === 'due') return theme.colors.warning;
    if (status === 'soon') return theme.colors.secondary;
    return theme.colors.textMuted;
  };

  const canComplete = (task: CareTask): boolean => task.status === 'overdue' || task.status === 'due';

  const handleComplete = async (task: CareTask) => {
    if (!user?.id || pendingPlantId) {
      return;
    }

    setPendingPlantId(task.plantId);
    const completedAt = new Date().toISOString();
    const idempotencyKey = `${task.plantId}:${completedAt}`;

    try {
      await careHistoryService.logWatering(user.id, task.plantId, completedAt, idempotencyKey);
      showToast({
        type: 'success',
        title: 'Riego registrado',
        subtitle: `${task.plantName} quedó como regada.`,
      });
      await loadData();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'No se pudo registrar el riego',
        subtitle: err instanceof Error ? err.message : undefined,
        autoDismiss: false,
      });
    } finally {
      setPendingPlantId(null);
    }
  };

  return (
    <CustomSafeArea scroll scrollBottomInset={theme.layout.heroPaddingBottom + theme.spacing['4xl']}>
      <AppHeader title="Calendario de riego" subtitle="PRIORIDAD INTELIGENTE" showBack />

      <View style={styles.root}>
        <View style={styles.content}>
          {loading ? (
            <View style={styles.card}>
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text style={styles.sectionMeta}>Cargando agenda de riego...</Text>
            </View>
          ) : error ? (
            <EmptyState
              iconName="alert-circle"
              title="No se pudo cargar"
              subtitle={error}
              actionLabel="Reintentar"
              onAction={loadData}
            />
          ) : plants.length === 0 ? (
            <View style={styles.emptyStateWrap}>
              <EmptyState
                iconName="droplet"
                title="Sin plantas registradas"
                subtitle="Agrega una planta para generar tu calendario de riego."
                actionLabel="Agregar planta"
                onAction={() => navigation.navigate('AddPlant')}
              />
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Resumen de riego</Text>
                  <Text style={styles.sectionMeta}>{summary.total} tareas activas</Text>
                </View>

                <View style={styles.summaryRow}>
                  <View style={styles.summaryPill}>
                    <Text style={styles.summaryValue}>{summary.overdue}</Text>
                    <Text style={styles.summaryLabel}>Atrasadas</Text>
                  </View>
                  <View style={styles.summaryPill}>
                    <Text style={styles.summaryValue}>{summary.dueToday}</Text>
                    <Text style={styles.summaryLabel}>Hoy</Text>
                  </View>
                  <View style={styles.summaryPill}>
                    <Text style={styles.summaryValue}>{summary.soon + summary.upcoming}</Text>
                    <Text style={styles.summaryLabel}>Próximas</Text>
                  </View>
                </View>

                <View style={styles.streakRow}>
                  <Text style={styles.streakLabel}>Racha de cuidado</Text>
                  <Text style={styles.streakValue}>{streak} días</Text>
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Prioridad inteligente</Text>
                  <Text style={styles.sectionMeta}>Ordenado por urgencia</Text>
                </View>

                {priorityTasks.length === 0 ? (
                  <Text style={styles.sectionMeta}>Sin tareas de riego por ahora.</Text>
                ) : (
                  <View style={styles.priorityList}>
                    {priorityTasks.map(task => (
                      <View key={task.plantId} style={styles.priorityRow}>
                        <View style={styles.priorityInfo}>
                          <Text style={styles.priorityName}>{task.plantName}</Text>
                          <Text style={styles.priorityMeta}>
                            Riego cada {task.wateringFrequencyDays} día{task.wateringFrequencyDays === 1 ? '' : 's'} · {formatDueLabel(task)}
                          </Text>
                        </View>

                        <View style={styles.priorityActions}>
                          <Badge
                            label={STATUS_LABELS[task.status]}
                            iconName={task.status === 'overdue' ? 'alert-circle' : 'droplet'}
                            color={statusColor(task.status)}
                            size="sm"
                          />
                          {canComplete(task) && (
                            <Pressable
                              style={({ pressed }) => [
                                styles.actionButton,
                                pressed && styles.actionButtonPressed,
                              ]}
                              onPress={() => handleComplete(task)}
                              disabled={pendingPlantId === task.plantId}
                            >
                              <Text style={styles.actionButtonText}>
                                {pendingPlantId === task.plantId ? 'Guardando...' : 'Marcar'}
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Calendario</Text>
                  <Text style={styles.sectionMeta}>Próximos 14 días</Text>
                </View>

                {calendarDays.length === 0 ? (
                  <EmptyState
                    iconName="calendar"
                    title="Sin riegos programados"
                    subtitle="Tus plantas están al día por ahora."
                  />
                ) : (
                  calendarDays.map(day => (
                    <View key={day.key} style={styles.dayBlock}>
                      <Text style={styles.dayTitle}>{day.label}</Text>
                      {day.tasks.map(task => (
                        <View key={`${day.key}-${task.plantId}`} style={styles.dayTaskRow}>
                          <View style={styles.dayTaskInfo}>
                            <Text style={styles.dayTaskName}>{task.plantName}</Text>
                            <Text style={styles.dayTaskMeta}>
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
        </View>
      </View>
    </CustomSafeArea>
  );
};
