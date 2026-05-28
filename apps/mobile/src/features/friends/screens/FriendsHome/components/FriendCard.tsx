import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { FriendSummary } from 'src/features/friends/types/friends.types';
import { Avatar } from 'src/shared/components/ui/Avatar/Avatar';
import { Surface, Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface FriendCardProps {
  friend: FriendSummary;
  onPress: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

export const FriendCard: React.FC<FriendCardProps> = ({ friend, onPress }) => {
  const theme = useUITheme();

  const nickname = friend.nickname ? `@${friend.nickname}` : '';
  const plantsLabel = friend.plantsCount === 1 ? '1 planta' : `${friend.plantsCount} plantas`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver perfil de ${friend.name}`}
    >
      {({ pressed }) => (
        <Surface
          elevation="xs"
          radius="lg"
          border="subtle"
          bg={pressed ? 'bgSubtle' : 'surface'}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            padding: theme.spacing.md,
          }}
        >
          <Avatar
            uri={friend.avatarUrl ?? undefined}
            size={theme.layout.avatarMd}
            showOnlineDot={false}
            showLevelBadge
            level={friend.level}
          />

          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="title" numberOfLines={1}>{friend.name}</Text>
            {nickname ? (
              <Text variant="caption" color="textTertiary" numberOfLines={1}>{nickname}</Text>
            ) : null}
            <Text variant="caption" color="textSecondary" numberOfLines={1}>{plantsLabel}</Text>
          </View>

          <Feather name="chevron-right" size={theme.layout.iconMd} color={theme.colors.textTertiary} />
        </Surface>
      )}
    </Pressable>
  );
};
