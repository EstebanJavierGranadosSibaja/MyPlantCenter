import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUITheme } from '../../theme/UIThemeContext';
import { Text } from '../Text/Text';

// ─────────────────────────────────────────────────────────────────────────────
// DetailHeader — the app-wide standard header for pushed / detail screens.
//
// Layout: [ back ]      Centered title      [ right slot ]
//
// The back button and the right slot occupy equal fixed-width sides, so the
// title stays optically centered regardless of what's on either side. Provides
// its own horizontal padding (screenPaddingH) — place it at the top of a screen
// whose content has NO horizontal padding, or it will be double-padded.
// ─────────────────────────────────────────────────────────────────────────────

export interface DetailHeaderProps {
  title: string;
  /** Defaults to navigation.goBack(). */
  onBack?: () => void;
  /** Optional element anchored to the right (icon button, badge…). */
  rightSlot?: React.ReactNode;
  /** Hide the back affordance (e.g. a root that can't go back). */
  hideBack?: boolean;
}

export function DetailHeader({ title, onBack, rightSlot, hideBack = false }: DetailHeaderProps) {
  const theme = useUITheme();
  const navigation = useNavigation();
  const handleBack = onBack ?? (() => navigation.goBack());

  return (
    <View style={[styles.row, { paddingHorizontal: theme.layout.screenPaddingH }]}>
      <View style={styles.side}>
        {!hideBack && (
          <Pressable
            onPress={handleBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Feather name="arrow-left" size={theme.layout.iconLg} color={theme.colors.textPrimary} />
          </Pressable>
        )}
      </View>

      <Text variant="title" align="center" numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 14,
    minHeight: 52,
  },
  side: {
    width: 40,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
  },
});
