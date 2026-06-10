import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { DetailHeader, Screen, Surface, Text, useUITheme } from 'src/ui';
import { notificationService } from '../services/notification.service';
import { AppNotification } from '../types/notification.types';

// ─────────────────────────────────────────────────────────────────────────────

const NOTIFICATION_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  friend_request:        'user-plus',
  friend_accepted:       'users',
  watering_reminder:     'droplet',
  plant_detection:       'camera',
  achievement_unlocked:  'award',
};

const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return 'Ahora';
  const m = Math.floor(diff / 60000);
  if (m < 60) return m <= 0 ? 'Ahora' : `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  return `Hace ${Math.floor(h / 24)} d`;
};

// ─────────────────────────────────────────────────────────────────────────────

function NotificationItem({ item }: { item: AppNotification }) {
  const theme  = useUITheme();
  const icon   = NOTIFICATION_ICONS[item.type] ?? 'bell';
  const isRead = item.read;

  return (
    <Surface elevation="xs" radius="lg" border="subtle" style={[styles.item, isRead && styles.itemRead]}>
      <View style={[styles.iconWrap, { backgroundColor: isRead ? theme.colors.bgSubtle : theme.colors.accentSoft }]}>
        <Feather name={icon} size={theme.layout.iconSm} color={isRead ? theme.colors.textTertiary : theme.colors.accent} />
      </View>
      <View style={styles.itemBody}>
        <View style={styles.itemHeader}>
          <Text variant="label" style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          {!isRead && (
            <View style={[styles.unreadDot, { backgroundColor: theme.colors.accent }]} />
          )}
        </View>
        <Text variant="bodyMd" color="textSecondary" numberOfLines={2}>{item.body}</Text>
        <Text variant="caption" color="textTertiary">{formatRelativeTime(item.createdAt)}</Text>
      </View>
    </Surface>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function NotificationsScreen() {
  const theme      = useUITheme();
  const { user }   = useAuth();
  const navigation = useNavigation();

  const [loading,       setLoading]       = React.useState(true);
  const [refreshing,    setRefreshing]    = React.useState(false);
  const [error,         setError]         = React.useState<string | null>(null);
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);

  const fetchData = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setError(null);
      const data = await notificationService.getByUser(user.id);
      setNotifications(data);
    } catch {
      setError('No se pudieron cargar las notificaciones.');
    }
  }, [user?.id]);

  const handleLoad = React.useCallback(async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  }, [fetchData]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  React.useEffect(() => { handleLoad(); }, [handleLoad]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen
      scroll
      edges={['top', 'left', 'right']}
      contentStyle={styles.content}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <DetailHeader title="Notificaciones" />

      {loading ? (
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.loadingCard}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text variant="bodyMd" color="textSecondary" align="center">Cargando notificaciones...</Text>
        </Surface>
      ) : error ? (
        <EmptyState
          iconName="alert-circle"
          title="Error al cargar"
          subtitle={error}
          actionLabel="Reintentar"
          onAction={handleLoad}
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          iconName="bell"
          title="Sin notificaciones"
          subtitle="Aquí verás avisos de solicitudes de amistad, recordatorios de riego y más."
        />
      ) : (
        <>
          {unreadCount > 0 && (
            <Surface elevation="xs" radius="lg" border="subtle" style={[styles.badge, { backgroundColor: theme.colors.accentSoft }]}>
              <Feather name="bell" size={theme.layout.iconSm} color={theme.colors.accent} />
              <Text variant="bodyMd" color="accent">{unreadCount} sin leer</Text>
            </Surface>
          )}

          <View style={styles.list}>
            {notifications.map(item => (
              <NotificationItem key={item.id} item={item} />
            ))}
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
    paddingTop: 4,
    paddingBottom: 120,
    gap: 12,
  },
  loadingCard: {
    padding: 32,
    gap: 12,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  itemRead: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
