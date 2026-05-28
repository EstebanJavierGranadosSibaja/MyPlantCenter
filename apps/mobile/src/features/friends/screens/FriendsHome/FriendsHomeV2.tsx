import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import httpClient from 'src/core/http/client';
import { FriendsStackParamList, RootStackParamList } from 'src/core/navigation/AppNavigator';
import { socialService } from 'src/features/friends/services/friends.service';
import { FriendRequest, FriendSummary } from 'src/features/friends/types/friends.types';
import { userService } from 'src/features/profile/services/user.service';
import { ApiResponse } from 'src/features/profile/types/user.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { SearchBar } from 'src/shared/components/ui/SearchBar/SearchBar';
import { Skeleton } from 'src/shared/components/ui/Skeleton/Skeleton';
import { Button, Screen, ScreenHeader, Surface, Text } from 'src/ui';
import { FriendCard } from './components/FriendCard';

// ─────────────────────────────────────────────────────────────────────────────

type FriendsNav = NativeStackNavigationProp<FriendsStackParamList>;
type RootNav = NativeStackNavigationProp<RootStackParamList>;

interface RawUserRecord { friendCode?: string }

// ─────────────────────────────────────────────────────────────────────────────

export function FriendsHomeV2() {
  const { user } = useAuth();
  const navigation = useNavigation<FriendsNav>();
  const rootNavigation = useNavigation<RootNav>();

  const [friends, setFriends]       = useState<FriendSummary[]>([]);
  const [requests, setRequests]     = useState<FriendRequest[]>([]);
  const [friendCode, setFriendCode] = useState('------');
  const [query, setQuery]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user?.id) { setLoading(false); return; }
      setLoading(true);
      try {
        const [profileRes, userRes, friendsRes, requestsRes] = await Promise.all([
          userService.getProfile(user.id),
          httpClient.get<ApiResponse<RawUserRecord>>(`/api/users/${user.id}`),
          socialService.getFriends(user.id),
          socialService.getFriendRequests(user.id),
        ]);
        if (!mounted) return;
        if (profileRes.success) {
          const codeFromUser = userRes.data.success ? userRes.data.data.friendCode : undefined;
          const fallbackCode = profileRes.data.nickname.replace('@', '').toUpperCase();
          setFriendCode((codeFromUser ?? fallbackCode).toUpperCase());
        }
        setFriends(friendsRes);
        setRequests(requestsRes);
      } catch {
        if (mounted) { setFriends([]); setRequests([]); }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [user?.id]);

  useFocusEffect(useCallback(() => {
    if (!user?.id) return;
    socialService.getFriendRequests(user.id).then(setRequests).catch(() => {});
    socialService.getFriends(user.id).then(setFriends).catch(() => {});
  }, [user?.id]));

  const handleRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        socialService.getFriends(user.id),
        socialService.getFriendRequests(user.id),
      ]);
      setFriends(friendsRes);
      setRequests(requestsRes);
    } catch {
      // silently fail on refresh
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);

  const incomingRequests = useMemo(
    () => requests.filter(r => r.toUserId === user?.id && r.status === 'pending'),
    [requests, user?.id],
  );

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      f => f.name.toLowerCase().includes(q) || f.nickname.toLowerCase().includes(q),
    );
  }, [friends, query]);

  const openFriendProfile = useCallback((userId: string) => {
    rootNavigation.navigate('UserProfile', { userId });
  }, [rootNavigation]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen
      scroll
      edges={['top', 'left', 'right']}
      contentStyle={styles.content}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >

      <ScreenHeader title="Amigos" />

      {/* ── Friend code card ───────────────────────────────────────────── */}
      <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
        <Text variant="title">Tu código</Text>
        <Text variant="bodyMd" color="textSecondary">Úsalo para recibir solicitudes de amistad</Text>

        <Text variant="numeric" align="center" style={styles.codeText}>{friendCode}</Text>
        <Text variant="caption" color="textTertiary" align="center">
          Compártelo tal cual para que te encuentren rápido
        </Text>

        <View style={styles.actionRow}>
          <View style={styles.actionWrap}>
            <Button
              label="Agregar por código"
              onPress={() => navigation.navigate('AddFriend')}
              variant="primary"
              size="sm"
              fullWidth
            />
          </View>
          <View style={styles.actionWrap}>
            <Button
              label="Ver solicitudes"
              onPress={() => navigation.navigate('FriendRequests')}
              variant="secondary"
              size="sm"
              fullWidth
            />
          </View>
        </View>
      </Surface>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <View style={styles.statsRow}>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.statCard}>
          <Text variant="numeric">{friends.length}</Text>
          <Text variant="overline" color="textTertiary">Amigos</Text>
        </Surface>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.statCard}>
          <Text variant="numeric">{incomingRequests.length}</Text>
          <Text variant="overline" color="textTertiary">Solicitudes</Text>
        </Surface>
      </View>

      {/* ── Friends list ──────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text variant="title">Tus amigos</Text>

        {friends.length > 0 && (
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Buscar amigos…"
          />
        )}

        {loading ? (
          <View style={styles.list}>
            {[0, 1, 2].map(i => (
              <Surface key={i} elevation="xs" radius="lg" border="subtle" style={styles.skeletonRow}>
                <Skeleton width={52} height={52} radius={26} />
                <View style={styles.skeletonText}>
                  <Skeleton width="55%" height={16} />
                  <Skeleton width="35%" height={12} />
                </View>
              </Surface>
            ))}
          </View>
        ) : friends.length === 0 ? (
          <EmptyState
            iconName="users"
            title="Aún no tienes amigos"
            subtitle="Comparte tu código o agrega a alguien por el suyo para empezar"
          />
        ) : filteredFriends.length === 0 ? (
          <EmptyState
            iconName="search"
            title="Sin resultados"
            subtitle={`Ningún amigo coincide con "${query.trim()}"`}
          />
        ) : (
          <View style={styles.list}>
            {filteredFriends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onPress={() => openFriendProfile(friend.id)}
              />
            ))}
          </View>
        )}
      </View>

      {/* ── Incoming requests ─────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text variant="title">Solicitudes recibidas</Text>

        {loading ? (
          <Text variant="bodyMd" color="textTertiary">Cargando actividad social...</Text>
        ) : incomingRequests.length === 0 ? (
          <EmptyState
            iconName="user-plus"
            title="Sin solicitudes nuevas"
            subtitle="Cuando alguien use tu código, aparecerá aquí"
          />
        ) : (
          <View style={styles.list}>
            {incomingRequests.map(request => (
              <Surface key={request.id} elevation="xs" radius="lg" border="subtle" style={styles.requestCard}>
                <Text variant="title">Nueva solicitud de amistad</Text>
                <Text variant="caption" color="textTertiary">Pendiente de respuesta</Text>
                <Button
                  label="Gestionar solicitud"
                  onPress={() => navigation.navigate('FriendRequests')}
                  variant="secondary"
                  size="sm"
                  fullWidth
                />
              </Surface>
            ))}
          </View>
        )}
      </View>

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
  codeText: {
    letterSpacing: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionWrap: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 4,
  },
  section: {
    gap: 12,
    marginTop: 8,
  },
  list: {
    gap: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  skeletonText: {
    flex: 1,
    gap: 8,
  },
  requestCard: {
    padding: 16,
    gap: 8,
  },
});
