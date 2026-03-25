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

  const borderRad = avatarSize * 0.3;
  const IconSize = avatarSize * 0.45;
  const dotSize = avatarSize * 0.18;
  const dotRadius = avatarSize * 0.09;
  const dotOffset = theme.layout.avatarOnlineDotOffset;
  const dotBorder = avatarSize * 0.025;

  return (
    <View style={{ position: 'relative', width: avatarSize, height: avatarSize }}>

      <View
        style={[
          styles.container,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: borderRad,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: borderRad,
            }}
            resizeMode="cover"
          />
        ) : (
          <Feather name={iconName} size={IconSize} color={theme.colors.accentSoft} />
        )}
      </View>

      {showOnlineDot && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotRadius,
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