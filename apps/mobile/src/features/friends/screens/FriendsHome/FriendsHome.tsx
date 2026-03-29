import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { FriendsStackParamList } from 'src/core/navigation/AppNavigator';
import httpClient from 'src/core/http/client';
import { socialService } from 'src/features/friends/services/friends.service';
import { userService } from 'src/features/profile/services/user.service';
import { FriendRequest, Friendship } from 'src/features/friends/types/friends.types';
import { ApiResponse } from 'src/features/profile/types/user.types';
import { useFriendsHomeTheme } from './FriendsHome.styles';

type FriendsNavigation = NativeStackNavigationProp<FriendsStackParamList>;
interface RawUserRecord {
  friendCode?: string;
}

export const FriendsHome: React.FC = () => {
  const { styles } = useFriendsHomeTheme();
  const { user } = useAuth();
  const navigation = useNavigation<FriendsNavigation>();

  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friendCode, setFriendCode] = useState('------');
  const [loading, setLoading] = useState(true);

  const getRequestLabel = useCallback((request: FriendRequest) => {
    return request.fromUserId;
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSocial = async () => {
      if (!user?.id) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const [profileResponse, userResponse, friendshipsResponse, requestsResponse] = await Promise.all([
          userService.getProfile(user.id),
          httpClient.get<ApiResponse<RawUserRecord>>(`/api/users/${user.id}`),
          socialService.getFriendships(user.id),
          socialService.getFriendRequests(user.id),
        ]);

        if (!mounted) {
          return;
        }

        if (profileResponse.success) {
          const codeFromUser = userResponse.data.success ? userResponse.data.data.friendCode : undefined;
          const fallbackCode = profileResponse.data.nickname.replace('@', '').toUpperCase();
          setFriendCode((codeFromUser ?? fallbackCode).toUpperCase());
        }

        setFriendships(friendshipsResponse);
        setRequests(requestsResponse);
      } catch {
        if (mounted) {
          setFriendships([]);
          setRequests([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSocial();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) {
        return;
      }

      socialService.getFriendRequests(user.id)
        .then(data => setRequests(data))
        .catch(() => {
          // Keep previous state to avoid a visual jump if the refresh fails.
        });

      socialService.getFriendships(user.id)
        .then(data => setFriendships(data))
        .catch(() => {
          // Keep previous state to avoid a visual jump if the refresh fails.
        });
    }, [user?.id]),
  );

  const incomingRequests = useMemo(
    () => requests.filter(item => item.toUserId === user?.id && item.status === 'pending'),
    [requests, user?.id],
  );

  return (
    <CustomSafeArea scroll>
      <View style={styles.root}>
        <AppHeader title="Amigos" subtitle="COMUNIDAD" showBack={false} />

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tu código</Text>
            <Text style={styles.sectionSubtitle}>Úsalo para recibir solicitudes de amistad</Text>
            <Text style={styles.codeText}>{friendCode}</Text>
            <Text style={styles.codeHint}>Compártelo tal cual para que te encuentren rápido</Text>
            <View style={styles.navRow}>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonPrimary]}
                onPress={() => navigation.navigate('AddFriend')}
                activeOpacity={0.85}
              >
                <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>Agregar por código</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('FriendRequests')}
                activeOpacity={0.85}
              >
                <Text style={styles.navButtonText}>Ver solicitudes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryValue}>{friendships.length}</Text>
              <Text style={styles.summaryLabel}>Amigos</Text>
            </View>

            <View style={styles.summaryPill}>
              <Text style={styles.summaryValue}>{incomingRequests.length}</Text>
              <Text style={styles.summaryLabel}>Solicitudes</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Solicitudes recibidas</Text>
            <Text style={styles.sectionSubtitle}>Revisa y responde rápido para crecer tu red</Text>
            {loading ? (
              <Text style={styles.sectionSubtitle}>Cargando actividad social...</Text>
            ) : incomingRequests.length === 0 ? (
              <EmptyState
                iconName="users"
                title="Sin solicitudes nuevas"
                subtitle="Cuando alguien use tu código, aparecerá aquí"
              />
            ) : (
              incomingRequests.map(request => (
                <View key={request.id} style={styles.requestRow}>
                  <Text style={styles.requestTitle}>Solicitud de {getRequestLabel(request)}</Text>
                  <Text style={styles.requestMeta}>Pendiente de respuesta</Text>

                  <TouchableOpacity
                    style={styles.requestAction}
                    onPress={() => navigation.navigate('FriendRequests')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.requestActionText}>Gestionar solicitud</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};
