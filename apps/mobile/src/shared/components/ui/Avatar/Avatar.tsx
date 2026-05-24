import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useAvatarTheme } from './Avatar.styles';


// Props 
interface AvatarProps {
  uri?: string;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  showOnlineDot?: boolean;
  showLevelBadge?: boolean;
  level?: number;
}

// Componente
export const Avatar: React.FC<AvatarProps> = ({
  uri,
  iconName = 'user',
  size,
  showOnlineDot = true,
  showLevelBadge = false,
  level,
}) => {
  const { theme, styles } = useAvatarTheme();

  const avatarSize = size ?? theme.layout.avatarLg;
  const iconSize = avatarSize <= theme.layout.avatarSm
    ? theme.typography.size['2xl']
    : avatarSize <= theme.layout.avatarMd
      ? theme.typography.size['3xl']
      : theme.typography.size['4xl'];
  const dotSize = avatarSize <= theme.layout.avatarSm ? theme.spacing.sm : theme.spacing.md;
  const dotOffset = theme.layout.avatarOnlineDotOffset;
  const dotBorder = theme.borders.base;

  return (
    <View style={[styles.wrapper, { width: avatarSize, height: avatarSize }]}> 

      <View
        style={[
          styles.container,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: theme.radius.full,
          },
        ]}
      >
        {uri ? (
          <Image
             source={{ uri }}
             style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Feather name={iconName} size={iconSize} color={theme.colors.textInverse} />
        )}
      </View>

      {showOnlineDot && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: theme.radius.full,
              bottom: dotOffset,
              right: dotOffset,
              borderWidth: dotBorder,
            },
          ]}
        />
      )}

      {showLevelBadge && level !== undefined && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            Nv {level}
          </Text>
        </View>
      )}

    </View>
  );
};