import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
    // Add online users not already in the list
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
      {/* Header */}
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
        <Feather
          name="arrow-left"
          size={22}
          color={theme.colors.textPrimary}
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text variant="title">Mensajes directos</Text>
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
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={usersWithChats}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
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
    padding: 16,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 80,
  },
});
