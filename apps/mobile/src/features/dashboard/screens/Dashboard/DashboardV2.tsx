import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { buildCareSummary, buildCareTasks } from 'src/features/care/utils/careSchedule';
import { plantService } from 'src/features/plants/services/plant.service';
import { Button, Screen, ScreenHeader, Surface, Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

type RootNav = NativeStackNavigationProp<RootStackParamList>;

function getGreeting(): { text: string; icon: React.ComponentProps<typeof Feather>['name'] } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Buenos días',   icon: 'sunrise' };
  if (hour < 18) return { text: 'Buenas tardes',  icon: 'cloud' };
  return             { text: 'Buenas noches',  icon: 'moon' };
}

function getCollectionStatus(count: number, loading: boolean): string {
  if (loading)    return '—';
  if (count === 0) return 'Vacía';
  if (count < 4)   return 'Crece';
  return           'Activa';
}

function getSummaryHint(count: number, loading: boolean): string {
  if (loading)    return 'Actualizando tu resumen general.';
  if (count === 0) return 'Agrega tu primera planta para comenzar a registrar riego y salud.';
  if (count === 1) return 'Buen comienzo, mantén el seguimiento para no perder el ritmo.';
  return          'Tu jardín va en crecimiento, revisa tus plantas y amistades desde las otras pestañas.';
}

// ─────────────────────────────────────────────────────────────────────────────

export function DashboardV2() {
  const theme = useUITheme();
  const { user } = useAuth();
  const navigation = useNavigation<RootNav>();
  const greeting = getGreeting();

  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [plantsCount, setPlantsCount] = useState(0);
  const [careSummary, setCareSummary] = useState(() => buildCareSummary([]));

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setPlantsCount(0);
      setCareSummary(buildCareSummary([]));
      return;
    }
    try {
      const plants = await plantService.getByUser(user.id);
      setPlantsCount(plants.length);
      setCareSummary(buildCareSummary(buildCareTasks(plants)));
    } catch {
      setPlantsCount(0);
      setCareSummary(buildCareSummary([]));
    }
  }, [user?.id]);

  const loadData = useCallback(async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const firstName = useMemo(() => {
    const source = user?.fullName?.trim();
    if (!source) return 'jardinero';
    const [name] = source.split(/\s+/);
    return name;
  }, [user?.fullName]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const plantsLabel      = plantsCount === 1 ? 'planta' : 'plantas';
  const collectionStatus = getCollectionStatus(plantsCount, loading);
  const summaryHint      = getSummaryHint(plantsCount, loading);

  const carePills = [
    { label: 'Atrasadas', value: careSummary.overdue },
    { label: 'Hoy',       value: careSummary.dueToday },
    { label: 'Próximas',  value: careSummary.soon + careSummary.upcoming },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen
      scroll
      edges={['top', 'left', 'right']}
      contentStyle={styles.content}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >

      <ScreenHeader title="Inicio" />

      {/* ── Greeting hero ──────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(320)}>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
          <View style={styles.greetingRow}>
            <View style={[styles.greetingBadge, { backgroundColor: theme.colors.accentSoft }]}>
              <Feather name={greeting.icon} size={theme.layout.iconMd} color={theme.colors.accent} />
            </View>
            <View style={styles.greetingCopy}>
              <Text variant="overline" color="textTertiary">{greeting.text}</Text>
              <Text variant="h2">{firstName}</Text>
            </View>
          </View>
          <Text variant="bodyMd" color="textSecondary">
            {loading
              ? 'Actualizando tu resumen...'
              : `Tienes ${plantsCount} ${plantsLabel} registradas.`}
          </Text>
        </Surface>
      </Animated.View>

      {/* ── Collection metrics ─────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(320).delay(80)} style={styles.metricsRow}>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.metricCard}>
          <Text variant="overline" color="textTertiary">Plantas</Text>
          <Text variant="numeric">{loading ? '—' : String(plantsCount)}</Text>
        </Surface>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.metricCard}>
          <Text variant="overline" color="textTertiary">Colección</Text>
          <Text variant="numeric">{collectionStatus}</Text>
        </Surface>
      </Animated.View>

      {/* ── Quick summary + add plant ───────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(320).delay(160)}>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
          <Text variant="title">Resumen rápido</Text>
          <Text variant="bodyMd" color="textSecondary">{summaryHint}</Text>
          <Button
            label={plantsCount === 0 ? 'Agregar primera planta' : 'Agregar otra planta'}
            onPress={() => navigation.navigate('AddPlant')}
            leftSlot={
              <Feather name="plus" size={theme.layout.iconSm} color={theme.colors.textOnAccent} />
            }
            fullWidth
          />
        </Surface>
      </Animated.View>

      {/* ── Watering / care status ─────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(320).delay(240)}>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
          <View style={styles.careHeader}>
            <Text variant="title">Riego inteligente</Text>
            <Text variant="bodyMd" color="textSecondary">Hoy y próximos días</Text>
          </View>

          <View style={styles.careRow}>
            {carePills.map(({ label, value }) => (
              <View
                key={label}
                style={[
                  styles.carePill,
                  {
                    backgroundColor: theme.colors.bgSubtle,
                    borderColor:     theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="numeric">{loading ? '—' : String(value)}</Text>
                <Text variant="overline" color="textTertiary">{label}</Text>
              </View>
            ))}
          </View>

          <Button
            label="Ver calendario"
            onPress={() => navigation.navigate('WateringCalendar')}
            leftSlot={
              <Feather name="calendar" size={theme.layout.iconSm} color={theme.colors.textOnAccent} />
            }
            fullWidth
          />
        </Surface>
      </Animated.View>

    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    padding: 20,
    gap: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greetingBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingCopy: {
    flex: 1,
    gap: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 4,
  },
  careHeader: {
    gap: 2,
  },
  careRow: {
    flexDirection: 'row',
    gap: 8,
  },
  carePill: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
});
