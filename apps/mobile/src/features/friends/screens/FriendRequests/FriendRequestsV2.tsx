import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { socialService } from 'src/features/friends/services/friends.service';
import { FriendRequest } from 'src/features/friends/types/friends.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { Button, DetailHeader, Screen, Surface, Text } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

export function FriendRequestsV2() {
  const { user } = useAuth();

  const [loading, setLoading]   = useState(true);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const loadRequests = useCallback(async () => {
    if (!user?.id) { setRequests([]); setLoading(false); return; }
    setLoading(true);
    try {
      setRequests(await socialService.getFriendRequests(user.id));
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const incoming = useMemo(
    () => requests.filter(r => r.toUserId === user?.id && r.status === 'pending'),
    [requests, user?.id],
  );

  const onResolve = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user?.id) return;
    try {
      await socialService.resolveFriendRequest(requestId, user.id, status);
      showToast({ type: 'success', title: status === 'accepted' ? 'Solicitud aceptada' : 'Solicitud rechazada' });
      await loadRequests();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'No se pudo procesar la solicitud',
        subtitle: error instanceof Error ? error.message : undefined,
        autoDismiss: false,
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen edges={['top', 'left', 'right']}>

      <DetailHeader title="Solicitudes" />

      {/* List area */}
      <View style={styles.listArea}>
        {loading ? (
          <View style={styles.center}>
            <Text variant="bodyMd" color="textTertiary">Cargando solicitudes...</Text>
          </View>
        ) : incoming.length === 0 ? (
          <EmptyState
            iconName="users"
            title="Sin solicitudes"
            subtitle="Cuando alguien te agregue aparecerá aquí"
          />
        ) : (
          <FlatList
            data={incoming}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Surface elevation="xs" radius="lg" border="subtle" style={styles.requestCard}>
                <Text variant="title">Usuario: {item.fromUserId}</Text>
                <Text variant="caption" color="textTertiary">Código destino: {item.toCode}</Text>
                <View style={styles.actionRow}>
                  <View style={styles.actionWrap}>
                    <Button
                      label="Aceptar"
                      onPress={() => onResolve(item.id, 'accepted')}
                      variant="primary"
                      size="sm"
                      fullWidth
                    />
                  </View>
                  <View style={styles.actionWrap}>
                    <Button
                      label="Rechazar"
                      onPress={() => onResolve(item.id, 'rejected')}
                      variant="destructive"
                      size="sm"
                      fullWidth
                    />
                  </View>
                </View>
              </Surface>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  listArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  requestCard: {
    padding: 16,
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionWrap: {
    flex: 1,
  },
});
