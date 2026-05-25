import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface FollowButtonProps {
  following: boolean;
  onToggle: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

export const FollowButton: React.FC<FollowButtonProps> = ({ following, onToggle }) => {
  const theme = useUITheme();

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: theme.spacing.xs,
        borderRadius: theme.radius.full,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: 1,
        backgroundColor: following
          ? (pressed ? theme.colors.bgSubtle : theme.colors.surface)
          : (pressed ? theme.colors.accentPressed : theme.colors.accent),
        borderColor: following
          ? theme.colors.borderDefault
          : theme.colors.accent,
      })}
      accessibilityLabel={following ? 'Dejar de seguir' : 'Seguir usuario'}
      accessibilityRole="button"
    >
      <Feather
        name={following ? 'user-check' : 'user-plus'}
        size={theme.layout.iconSm}
        color={following ? theme.colors.textSecondary : theme.colors.textOnAccent}
      />
      <Text style={{ ...theme.text.buttonSm, color: following ? theme.colors.textSecondary : theme.colors.textOnAccent }}>
        {following ? 'Siguiendo' : 'Seguir'}
      </Text>
    </Pressable>
  );
};
