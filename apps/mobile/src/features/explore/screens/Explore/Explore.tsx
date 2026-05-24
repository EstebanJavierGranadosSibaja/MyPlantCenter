import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, View } from 'react-native';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { exploreService } from 'src/features/explore/services/explore.service';
import { RecentActivity, TrendingPlant } from 'src/features/explore/types/explore.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { Badge } from 'src/shared/components/ui/Badge/Badge';
import { useExplorarTheme } from './Explore.styles';

const formatRelativeTime = (value: string): string => {
    const timestamp = new Date(value).getTime();
    if (Number.isNaN(timestamp)) {
        return 'Reciente';
    }

    const diffMs = Date.now() - timestamp;
    if (diffMs < 0) {
        return 'Reciente';
    }

    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) {
        return `Hace ${Math.max(1, minutes)} min`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `Hace ${hours} h`;
    }

    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
};

const formatConfidence = (value?: number): string | null => {
    if (typeof value !== 'number') {
        return null;
    }

    return `${Math.round(value * 100)}%`;
};

export const Explorar: React.FC = () => {
    const { theme, styles } = useExplorarTheme();
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [trendingPlants, setTrendingPlants] = React.useState<TrendingPlant[]>([]);
    const [recentActivity, setRecentActivity] = React.useState<RecentActivity[]>([]);

    const loadExplore = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await exploreService.getExploreData();
            setTrendingPlants(data.trendingPlants);
            setRecentActivity(data.recentActivity);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo cargar explorar.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadExplore();
    }, [loadExplore]);

    const normalizedQuery = query.trim().toLowerCase();
    const hasQuery = normalizedQuery.length > 0;

    const filteredTrending = hasQuery
        ? trendingPlants.filter(item =>
                item.name.toLowerCase().includes(normalizedQuery)
                || item.scientificName.toLowerCase().includes(normalizedQuery),
            )
        : trendingPlants;

    const filteredActivity = hasQuery
        ? recentActivity.filter(item =>
                item.plantName.toLowerCase().includes(normalizedQuery)
                || item.plantScientificName.toLowerCase().includes(normalizedQuery)
                || item.userNickname.toLowerCase().includes(normalizedQuery),
            )
        : recentActivity;

    const isEmpty = !loading && !error && filteredTrending.length === 0 && filteredActivity.length === 0;

    const actionConfig: Record<RecentActivity['actionType'], { label: string; icon: React.ComponentProps<typeof Feather>['name']; color: string }> = {
        detected: { label: 'Detectada', icon: 'camera', color: theme.colors.accent },
        added: { label: 'Agregada', icon: 'plus', color: theme.colors.primary },
        updated: { label: 'Actualizada', icon: 'edit-3', color: theme.colors.secondary },
    };

    return (
        <CustomSafeArea
            scroll
            scrollBottomInset={theme.layout.heroPaddingBottom + theme.spacing['4xl']}
        >
            <AppHeader title="Explorar" subtitle="DESCUBRIMIENTO" showBack={false} />
            <View style={styles.root}>
                <View style={styles.searchWrapper}>
                    <Feather
                        name="search"
                        size={theme.typography.size.lg}
                        color={theme.colors.textMuted}
                    />
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Busca plantas, usuarios o tendencias"
                        placeholderTextColor={theme.colors.textMuted}
                    />
                </View>

                {loading ? (
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={theme.colors.accent} />
                        <Text style={styles.loadingText}>Cargando descubrimiento...</Text>
                    </View>
                ) : error ? (
                    <EmptyState
                        iconName="alert-circle"
                        title="No pudimos cargar explorar"
                        subtitle={error}
                        actionLabel="Reintentar"
                        onAction={loadExplore}
                    />
                ) : isEmpty ? (
                    <EmptyState
                        iconName="compass"
                        title="Sin novedades"
                        subtitle="No hay tendencias o actividad reciente por ahora"
                        actionLabel="Actualizar"
                        onAction={loadExplore}
                    />
                ) : (
                    <View style={styles.sections}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Plantas en tendencia</Text>
                            <Text style={styles.sectionMeta}>{filteredTrending.length} en foco</Text>
                        </View>

                        {filteredTrending.length === 0 ? (
                            <Text style={styles.sectionEmpty}>No hay plantas en tendencia todavia.</Text>
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.trendingRow}
                            >
                                {filteredTrending.map((plant: TrendingPlant) => (
                                    <View key={plant.id} style={styles.trendingCard}>
                                        <View style={styles.trendingImageWrap}>
                                            {plant.imageUrl ? (
                                                <Image
                                                    source={{ uri: plant.imageUrl }}
                                                    style={styles.trendingImage}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <Feather
                                                    name="leaf"
                                                    size={theme.typography.size['3xl']}
                                                    color={theme.colors.textMuted}
                                                />
                                            )}
                                        </View>

                                        <Text style={styles.trendingName}>{plant.name}</Text>
                                        <Text style={styles.trendingScientific}>{plant.scientificName}</Text>

                                        <View style={styles.trendingFooter}>
                                            <Badge
                                                label={`${plant.detectionCount} detecciones`}
                                                iconName="trending-up"
                                                size="sm"
                                            />
                                            <Text style={styles.trendingTime}>{formatRelativeTime(plant.lastDetected)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Actividad reciente</Text>
                            <Text style={styles.sectionMeta}>Lo ultimo en la comunidad</Text>
                        </View>

                        {filteredActivity.length === 0 ? (
                            <Text style={styles.sectionEmpty}>No hay actividad reciente aun.</Text>
                        ) : (
                            <View style={styles.activityList}>
                                {filteredActivity.map(activity => {
                                    const action = actionConfig[activity.actionType];
                                    const confidence = formatConfidence(activity.confidence);

                                    return (
                                        <View key={activity.id} style={styles.activityCard}>
                                            <View style={styles.activityHeader}>
                                                <View style={styles.activityAvatar}>
                                                    <Feather name="user" size={theme.typography.size.base} color={theme.colors.textSecondary} />
                                                </View>
                                                <View style={styles.activityInfo}>
                                                    <Text style={styles.activityUser}>@{activity.userNickname}</Text>
                                                    <Text style={styles.activityPlant}>{activity.plantName}</Text>
                                                </View>
                                                <Text style={styles.activityTime}>{formatRelativeTime(activity.timestamp)}</Text>
                                            </View>

                                            <View style={styles.activityFooter}>
                                                <Badge label={action.label} iconName={action.icon} color={action.color} size="sm" />
                                                {confidence && (
                                                    <Text style={styles.activityConfidence}>Confianza {confidence}</Text>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                )}
            </View>
        </CustomSafeArea>
    );
};