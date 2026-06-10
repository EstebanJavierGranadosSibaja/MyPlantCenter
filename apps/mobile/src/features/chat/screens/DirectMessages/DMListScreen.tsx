import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'src/ui';
import { useUITheme } from 'src/ui/theme/UIThemeContext';
import { UserListItem } from '../../components/UserListItem';
import { useChat } from '../../hooks/useChat';
import { ChatUser } from '../../types/chat.types';
import { ChatStackParamList } from '../ChatNavigator';

type Nav = NativeStackNavigationProp<ChatStackParamList>;

export function DMListScreen() {
  const theme = useUITheme();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { chatUser, onlineUsers, directMessages, connected } = useChat();

  const usersWithChats = useMemo(() => {
    const withHistory = Object.keys(directMessages).filter(
      id => (directMessages[id]?.length ?? 0) > 0,
    );
    const withHistorySet = new Set(withHistory);

    // Users who have a DM thread (priority) then the rest who are online
    const all: ChatUser[] = [];
    for (const id of withHistory) {
      const u = onlineUsers.find(u => u.id === id);
      if (u) all.push(u);
    }
    for (const u of onlineUsers) {
      if (u.id !== chatUser?.id && !withHistorySet.has(u.id)) {
        all.push(u);
      }
    }
    return all;
  }, [onlineUsers, directMessages, chatUser?.id]);

  const getLastMessage = (userId: string): string | undefined => {
    const msgs = directMessages[userId];
    if (!msgs?.length) return undefined;
    return msgs[msgs.length - 1].content;
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.bg }]}>
      {/* Header — this is the Chat tab landing, so no back button */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderBottomColor: theme.colors.borderSubtle,
            paddingTop: insets.top + 12,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.accentSoft }]}>
            <Feather name="message-circle" size={18} color={theme.colors.accentForeground} />
          </View>
          <View>
            <Text variant="title">Chats</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: connected ? theme.colors.accent : theme.colors.borderDefault },
                ]}
              />
              <Text variant="caption" color="textSecondary">
                {connected ? `${onlineUsers.length} en línea` : 'Reconectando…'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={usersWithChats}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Group chat — the document observations live here */}
            <Pressable
              onPress={() => navigation.navigate('GroupChat')}
              style={({ pressed }) => [
                styles.groupCard,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.borderSubtle,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={[styles.groupAvatar, { backgroundColor: theme.colors.accent }]}>
                <Feather name="users" size={22} color="#fff" />
              </View>
              <View style={styles.groupInfo}>
                <Text variant="bodyMd" style={styles.groupTitle}>Chat grupal</Text>
                <Text variant="caption" color="textSecondary">
                  Observaciones del documento
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </Pressable>

            <Text variant="overline" color="textTertiary" style={styles.sectionLabel}>
              Mensajes directos
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="users" size={40} color={theme.colors.borderDefault} />
            <Text variant="bodyMd" color="textSecondary" align="center" style={{ maxWidth: 240 }}>
              No hay usuarios en línea.{'\n'}Cuando alguien se conecte aparecerá aquí.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            lastMessage={getLastMessage(item.id)}
            onPress={() =>
              navigation.navigate('DMThread', {
                userId: item.id,
                nickname: item.nickname,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    // Clears the floating tab bar (height 64 + bottom offset + safe area)
    paddingBottom: 120,
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: 8,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupInfo: {
    flex: 1,
    gap: 2,
  },
  groupTitle: {
    fontWeight: '700',
  },
  sectionLabel: {
    marginTop: 16,
    marginLeft: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 60,
  },
});
