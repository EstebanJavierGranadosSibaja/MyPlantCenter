import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUITheme } from 'src/ui/theme/UIThemeContext';
import { Text } from 'src/ui';
import { ChatUser } from '../types/chat.types';

interface Props {
  user: ChatUser;
  onPress?: () => void;
  lastMessage?: string;
  unread?: boolean;
}

export function UserListItem({ user, onPress, lastMessage, unread }: Props) {
  const theme = useUITheme();

  const initials = user.nickname.slice(0, 2).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? theme.colors.accentSoft
            : theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: theme.colors.accentMuted }]}>
        <Text variant="caption" style={{ color: theme.colors.accentForeground, fontWeight: '700' }}>
          {initials}
        </Text>
        {user.is_online && (
          <View style={[styles.onlineDot, { backgroundColor: theme.colors.accent }]} />
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text variant="title" style={styles.nickname} numberOfLines={1}>
            {user.nickname}
          </Text>
          {unread && (
            <View style={[styles.unreadDot, { backgroundColor: theme.colors.accent }]} />
          )}
        </View>
        {lastMessage ? (
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {lastMessage}
          </Text>
        ) : (
          <Text variant="caption" color="textSecondary">
            {user.is_online ? 'En línea' : 'Desconectado'}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nickname: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
