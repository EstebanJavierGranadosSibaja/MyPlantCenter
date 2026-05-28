import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { UserProfile } from 'src/features/profile/types/user.types';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface ProfileViewHeaderProps {
  isOwner: boolean;
  profile: UserProfile;
}

// ─────────────────────────────────────────────────────────────────────────────

export const ProfileViewHeader: React.FC<ProfileViewHeaderProps> = ({
  isOwner,
  profile,
}) => {
  const theme = useUITheme();
  const navigation = useNavigation();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      height: theme.layout.headerHeight,
      paddingHorizontal: theme.layout.screenPaddingH,
      gap: theme.spacing.sm,
    }}>

      {!isOwner && (
        <Pressable
          onPress={() => { if (navigation.canGoBack()) navigation.goBack(); }}
          style={({ pressed }) => ({
            width: theme.layout.buttonHeightSm,
            height: theme.layout.buttonHeightSm,
            borderRadius: theme.radius.full,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: pressed ? theme.colors.bgSubtle : 'transparent',
          })}
          accessibilityLabel="Volver atrás"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={theme.layout.iconMd} color={theme.colors.textPrimary} />
        </Pressable>
      )}

      <View style={{ flex: 1 }}>
        <Text
          style={{ ...theme.text.h2, color: theme.colors.textPrimary }}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {isOwner ? 'Mi Perfil' : profile.name}
        </Text>
      </View>

    </View>
  );
};
