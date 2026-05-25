import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useListItemTheme } from './ListItem.styles';

interface ListItemProps {
  label: string;
  sublabel?: string;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  iconColor?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  showDivider?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  label,
  sublabel,
  iconName,
  iconColor,
  right,
  onPress,
  showChevron = false,
  destructive = false,
  showDivider = false,
}) => {
  const { theme, styles } = useListItemTheme();

  const resolvedIconColor = iconColor ?? (destructive ? theme.colors.error : theme.colors.textSecondary);

  const content = (
    <>
      {iconName ? (
        <View style={styles.iconWrap}>
          <Feather name={iconName} size={theme.layout.iconMd} color={resolvedIconColor} />
        </View>
      ) : null}

      <View style={styles.labelGroup}>
        <Text style={[styles.label, destructive && styles.labelDestructive]}>
          {label}
        </Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>

      {right ? (
        <View style={styles.right}>{right}</View>
      ) : showChevron ? (
        <View style={styles.right}>
          <Feather name="chevron-right" size={theme.layout.iconMd} color={theme.colors.textTertiary} />
        </View>
      ) : null}
    </>
  );

  return (
    <>
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={({ pressed }) => [styles.base, pressed && styles.pressed]}
        >
          {content}
        </Pressable>
      ) : (
        <View style={styles.base}>{content}</View>
      )}
      {showDivider ? <View style={styles.divider} /> : null}
    </>
  );
};
