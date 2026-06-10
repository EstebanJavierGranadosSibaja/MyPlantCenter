import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { exploreService } from 'src/features/explore/services/explore.service';
import { RecentActivity, TrendingPlant } from 'src/features/explore/types/explore.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { Badge } from 'src/shared/components/ui/Badge/Badge';
import { SearchBar } from 'src/shared/components/ui/SearchBar/SearchBar';
import { Screen, ScreenHeader, Surface, Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

const formatRelativeTime = (value: string): string => {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'Reciente';

  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return 'Reciente';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `Hace ${Math.max(1, minutes)} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  return `Hace ${Math.floor(hours / 24)} d`;
};

const formatConfidence = (value?: number): string | null => {
  if (typeof value !== 'number') return null;
  return `${Math.round(value * 100)}%`;
};

// ─────────────────────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<RecentActivity['actionType'], {
  label: string;
  icon:  React.ComponentProps<typeof Feather>['name'];
  color: string;
}> = {
  detected: { label: 'Detectada',    icon: 'camera',  color: '' },
  added:    { label: 'Agregada',      icon: 'plus',    color: '' },
  updated:  { label: 'Actualizada',   icon: 'edit-3',  color: '' },
};

// ─────────────────────────────────────────────────────────────────────────────

const CARE_TIPS: { icon: React.ComponentProps<typeof Feather>['name']; title: string; text: string }[] = [
  { icon: 'droplet', title: 'No riegues de más', text: 'La mayoría de plantas mueren por exceso de agua, no por falta. Mete el dedo 2-3 cm: si está seco, riega; si no, espera.' },
  { icon: 'sun', title: 'Luz indirecta ≠ sol directo', text: 'El sol directo del mediodía quema las hojas de muchas plantas de interior. Busca luz brillante pero filtrada.' },
  { icon: 'alert-triangle', title: 'Revisa el envés de las hojas', text: 'Manchas pegajosas, puntos o telarañas finas son señales tempranas de plaga. Detectarlas a tiempo lo es todo.' },
  { icon: 'layers', title: 'Drenaje primero', text: 'Si el agua tarda en salir, la maceta no drena bien y las raíces se pudren. Añade perlita o piedra al fondo.' },
  { icon: 'thermometer', title: 'Menos agua en invierno', text: 'En invierno casi todas crecen poco y necesitan menos riego. Evita fertilizar hasta la primavera.' },
];

export function ExplorarV2() {
  const theme = useUITheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [query,          setQuery]          = React.useState('');
  const [loading,        setLoading]        = React.useState(true);
  const [refreshing,     setRefreshing]     = React.useState(false);
  const [error,          setError]          = React.useState<string | null>(null);
  const [trending,       setTrending]       = React.useState<TrendingPlant[]>([]);
  const [activity,       setActivity]       = React.useState<RecentActivity[]>([]);

  // Tap en una planta en tendencia → ir a "Nueva planta" con datos prellenados.
  const handleAddTrending = React.useCallback((plant: TrendingPlant) => {
    navigation.navigate('AddPlant', {
      prefill: { name: plant.name, species: plant.scientificName },
    });
  }, [navigation]);

  // Tap en actividad → visitar el perfil del miembro de la comunidad.
  const handleVisitUser = React.useCallback((userId: string) => {
    navigation.navigate('UserProfile', { userId });
  }, [navigation]);

  const actionConfig = React.useMemo(() => ({
    ...ACTION_CONFIG,
    detected: { ...ACTION_CONFIG.detected, color: theme.colors.accent },
    added:    { ...ACTION_CONFIG.added,    color: theme.colors.accent },
    updated:  { ...ACTION_CONFIG.updated,  color: theme.colors.textSecondary },
  }), [theme]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await exploreService.getExploreData();
      setTrending(data.trendingPlants);
      setActivity(data.recentActivity);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar explorar.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await exploreService.getExploreData();
      setTrending(data.trendingPlants);
      setActivity(data.recentActivity);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar explorar.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const normalized = query.trim().toLowerCase();
  const hasQuery   = normalized.length > 0;

  const filteredTrending = hasQuery
    ? trending.filter(p =>
        p.name.toLowerCase().includes(normalized) ||
        p.scientificName.toLowerCase().includes(normalized),
      )
    : trending;

  const filteredActivity = hasQuery
    ? activity.filter(a =>
        a.plantName.toLowerCase().includes(normalized) ||
        a.plantScientificName.toLowerCase().includes(normalized) ||
        a.userNickname.toLowerCase().includes(normalized),
      )
    : activity;

  const isEmpty = !loading && !error && filteredTrending.length === 0 && filteredActivity.length === 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen
      scroll
      edges={['top', 'left', 'right']}
      contentStyle={styles.content}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >

      <ScreenHeader title="Explorar" />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Busca plantas, usuarios o tendencias"
      />

      {/* Body */}
      {loading ? (
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.loadingCard}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text variant="bodyMd" color="textSecondary" align="center">Cargando descubrimiento...</Text>
        </Surface>
      ) : error ? (
        <EmptyState iconName="alert-circle" title="No pudimos cargar explorar" subtitle={error} actionLabel="Reintentar" onAction={loadData} />
      ) : isEmpty ? (
        <EmptyState iconName="compass" title="Sin novedades" subtitle="No hay tendencias o actividad reciente por ahora" actionLabel="Actualizar" onAction={loadData} />
      ) : (
        <>
          {/* ── Trending plants ────────────────────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text variant="title">Plantas en tendencia</Text>
            <Text variant="caption" color="textTertiary">{filteredTrending.length} en foco</Text>
          </View>

          {filteredTrending.length === 0 ? (
            <Text variant="bodyMd" color="textTertiary">No hay plantas en tendencia todavía.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingRow}
            >
              {filteredTrending.map(plant => (
                <Pressable
                  key={plant.id}
                  onPress={() => handleAddTrending(plant)}
                  style={({ pressed }) => pressed && styles.pressed}
                  accessibilityRole="button"
                  accessibilityLabel={`Agregar ${plant.name} a mis plantas`}
                >
                  <Surface elevation="xs" radius="lg" border="subtle" style={styles.trendingCard}>
                    <View style={[styles.trendingImageWrap, { backgroundColor: theme.colors.bgSubtle }]}>
                      {plant.imageUrl ? (
                        <Image source={{ uri: plant.imageUrl }} style={styles.trendingImage} resizeMode="cover" />
                      ) : (
                        <Feather name="feather" size={28} color={theme.colors.accent} />
                      )}
                      <View style={[styles.addOverlay, { backgroundColor: theme.colors.accent }]}>
                        <Feather name="plus" size={theme.layout.iconSm} color={theme.colors.textOnAccent} />
                      </View>
                    </View>

                    <Text variant="label" numberOfLines={1}>{plant.name}</Text>
                    <Text variant="caption" color="textTertiary" numberOfLines={1}>{plant.scientificName}</Text>

                    <View style={styles.trendingFooter}>
                      <Badge label={`${plant.detectionCount} det.`} iconName="trending-up" size="sm" />
                      <Text variant="caption" color="textTertiary">{formatRelativeTime(plant.lastDetected)}</Text>
                    </View>
                  </Surface>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* ── Recent activity ────────────────────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text variant="title">Actividad reciente</Text>
            <Text variant="caption" color="textTertiary">Lo último en la comunidad</Text>
          </View>

          {filteredActivity.length === 0 ? (
            <Text variant="bodyMd" color="textTertiary">No hay actividad reciente aún.</Text>
          ) : (
            <View style={styles.activityList}>
              {filteredActivity.map(item => {
                const action     = actionConfig[item.actionType];
                const confidence = formatConfidence(item.confidence);

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleVisitUser(item.userId)}
                    style={({ pressed }) => pressed && styles.pressed}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver el perfil de ${item.userNickname}`}
                  >
                    <Surface elevation="xs" radius="lg" border="subtle" style={styles.activityCard}>
                      <View style={styles.activityHeader}>
                        <View style={[styles.avatarBadge, { backgroundColor: theme.colors.bgSubtle }]}>
                          <Feather name="user" size={theme.layout.iconSm} color={theme.colors.textSecondary} />
                        </View>
                        <View style={styles.activityInfo}>
                          <Text variant="label" numberOfLines={1}>@{item.userNickname}</Text>
                          <Text variant="caption" color="textTertiary" numberOfLines={1}>{item.plantName}</Text>
                        </View>
                        <Feather name="chevron-right" size={theme.layout.iconSm} color={theme.colors.textTertiary} />
                      </View>

                      <View style={styles.activityFooter}>
                        <Badge label={action.label} iconName={action.icon} color={action.color} size="sm" />
                        {confidence && (
                          <Text variant="caption" color="textTertiary">Confianza {confidence}</Text>
                        )}
                        <Text variant="caption" color="textTertiary" style={styles.activityTime}>
                          {formatRelativeTime(item.timestamp)}
                        </Text>
                      </View>
                    </Surface>
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
      )}

      {/* ── Consejos de cuidado (siempre útiles) ───────────────────────── */}
      {!loading && !error && !hasQuery && (
        <View style={styles.tipsSection}>
          <View style={styles.sectionHeader}>
            <Text variant="title">Consejos de cuidado</Text>
            <Text variant="caption" color="textTertiary">Para mantenerlas sanas</Text>
          </View>
          {CARE_TIPS.map(tip => (
            <Surface key={tip.title} elevation="xs" radius="lg" border="subtle" style={styles.tipCard}>
              <View style={[styles.tipIcon, { backgroundColor: theme.colors.accentSoft }]}>
                <Feather name={tip.icon} size={theme.layout.iconMd} color={theme.colors.accent} />
              </View>
              <View style={styles.tipBody}>
                <Text variant="label">{tip.title}</Text>
                <Text variant="caption" color="textSecondary">{tip.text}</Text>
              </View>
            </Surface>
          ))}
        </View>
      )}

    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
    gap: 16,
  },
  loadingCard: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendingRow: {
    gap: 12,
    paddingVertical: 4,
  },
  trendingCard: {
    width: 148,
    padding: 12,
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  trendingImageWrap: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  addOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  activityList: {
    gap: 8,
  },
  activityCard: {
    padding: 14,
    gap: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityInfo: {
    flex: 1,
    gap: 2,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityTime: {
    marginLeft: 'auto',
  },
  tipsSection: {
    gap: 8,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipBody: {
    flex: 1,
    gap: 2,
  },
});
