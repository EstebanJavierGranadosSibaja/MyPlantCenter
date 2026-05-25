import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import httpClient from 'src/core/http/client';
import { FriendsStackParamList } from 'src/core/navigation/AppNavigator';
import { socialService } from 'src/features/friends/services/friends.service';
import { FriendRequest, Friendship } from 'src/features/friends/types/friends.types';
import { userService } from 'src/features/profile/services/user.service';
import { ApiResponse } from 'src/features/profile/types/user.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { Button, Screen, ScreenHeader, Surface, Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

type FriendsNav = NativeStackNavigationProp<FriendsStackParamList>;

interface RawUserRecord { friendCode?: string }

// ─────────────────────────────────────────────────────────────────────────────

export function FriendsHomeV2() {
  const theme = useUITheme();
  const { user } = useAuth();
  const navigation = useNavigation<FriendsNav>();

  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [requests, setRequests]       = useState<FriendRequest[]>([]);
  const [friendCode, setFriendCode]   = useState('------');
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user?.id) { setLoading(false); return; }
      setLoading(true);
      try {
        const [profileRes, userRes, friendshipsRes, requestsRes] = await Promise.all([
          userService.getProfile(user.id),
          httpClient.get<ApiResponse<RawUserRecord>>(`/api/users/${user.id}`),
          socialService.getFriendships(user.id),
          socialService.getFriendRequests(user.id),
        ]);
        if (!mounted) return;
        if (profileRes.success) {
          const codeFromUser  = userRes.data.success ? userRes.data.data.friendCode : undefined;
          const fallbackCode  = profileRes.data.nickname.replace('@', '').toUpperCase();
          setFriendCode((codeFromUser ?? fallbackCode).toUpperCase());
        }
        setFriendships(friendshipsRes);
        setRequests(requestsRes);
      } catch {
        if (mounted) { setFriendships([]); setRequests([]); }
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
    socialService.getFriendships(user.id).then(setFriendships).catch(() => {});
  }, [user?.id]));

  const handleRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const [friendshipsRes, requestsRes] = await Promise.all([
        socialService.getFriendships(user.id),
        socialService.getFriendRequests(user.id),
      ]);
      setFriendships(friendshipsRes);
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
          <Text variant="numeric">{friendships.length}</Text>
          <Text variant="overline" color="textTertiary">Amigos</Text>
        </Surface>
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.statCard}>
          <Text variant="numeric">{incomingRequests.length}</Text>
          <Text variant="overline" color="textTertiary">Solicitudes</Text>
        </Surface>
      </View>

      {/* ── Incoming requests ─────────────────────────────────────────── */}
      <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
        <Text variant="title">Solicitudes recibidas</Text>
        <Text variant="bodyMd" color="textSecondary">Revisa y responde rápido para crecer tu red</Text>

        {loading ? (
          <Text variant="bodyMd" color="textTertiary">Cargando actividad social...</Text>
        ) : incomingRequests.length === 0 ? (
          <EmptyState
            iconName="users"
            title="Sin solicitudes nuevas"
            subtitle="Cuando alguien use tu código, aparecerá aquí"
          />
        ) : (
          incomingRequests.map(request => (
            <Surface key={request.id} elevation="xs" radius="md" border="subtle" style={styles.requestCard}>
              <Text variant="title">Solicitud de {request.fromUserId}</Text>
              <Text variant="caption" color="textTertiary">Pendiente de respuesta</Text>
              <Button
                label="Gestionar solicitud"
                onPress={() => navigation.navigate('FriendRequests')}
                variant="secondary"
                size="sm"
                fullWidth
              />
            </Surface>
          ))
        )}
      </Surface>

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
  requestCard: {
    padding: 16,
    gap: 8,
  },
});
