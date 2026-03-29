import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { socialService } from 'src/features/friends/services/friends.service';
import { FriendRequest } from 'src/features/friends/types/friends.types';
import { useFriendRequestsTheme } from './FriendRequests.styles';

export const FriendRequests: React.FC = () => {
  const { styles } = useFriendRequestsTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const loadRequests = useCallback(async () => {
    if (!user?.id) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await socialService.getFriendRequests(user.id);
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const incoming = useMemo(
    () => requests.filter(item => item.toUserId === user?.id && item.status === 'pending'),
    [requests, user?.id],
  );

  const onResolve = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user?.id) {
      return;
    }

    try {
      await socialService.resolveFriendRequest(requestId, user.id, status);
      showToast({
        type: 'success',
        title: status === 'accepted' ? 'Solicitud aceptada' : 'Solicitud rechazada',
      });
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

  return (
    <CustomSafeArea>
      <View style={styles.root}>
        <AppHeader title="Solicitudes" subtitle="RECIBIDAS" showBack />

        <View style={styles.content}>
          {loading ? (
            <Text style={styles.subtitle}>Cargando solicitudes...</Text>
          ) : incoming.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                iconName="users"
                title="Sin solicitudes"
                subtitle="Cuando alguien te agregue aparecerá aquí"
              />
            </View>
          ) : (
            <FlatList
              data={incoming}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.title}>Usuario: {item.fromUserId}</Text>
                  <Text style={styles.subtitle}>Código destino: {item.toCode}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonAccept]}
                      onPress={() => onResolve(item.id, 'accepted')}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.buttonText, styles.buttonTextAccept]}>Aceptar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => onResolve(item.id, 'rejected')}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.buttonText}>Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </CustomSafeArea>
  );
};
