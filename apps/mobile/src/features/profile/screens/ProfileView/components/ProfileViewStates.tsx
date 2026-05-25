import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Screen, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface BaseStateProps {
  isOwner: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

const Loading: React.FC<BaseStateProps> = ({ isOwner }) => {
  const theme = useUITheme();

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={{
        height: theme.layout.headerHeight,
        paddingHorizontal: theme.layout.screenPaddingH,
        justifyContent: 'center' as const,
      }}>
        <Text style={{ ...theme.text.h2, color: theme.colors.textPrimary }} accessibilityRole="header">
          {isOwner ? 'Mi Perfil' : 'Perfil'}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: theme.spacing.base }}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
        <Text style={{ ...theme.text.body, color: theme.colors.textSecondary }}>
          Cargando perfil…
        </Text>
      </View>
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

interface ErrorStateProps extends BaseStateProps {
  error: string | null;
}

const Error: React.FC<ErrorStateProps> = ({ isOwner, error }) => {
  const theme = useUITheme();

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={{
        height: theme.layout.headerHeight,
        paddingHorizontal: theme.layout.screenPaddingH,
        justifyContent: 'center' as const,
      }}>
        <Text style={{ ...theme.text.h2, color: theme.colors.textPrimary }} accessibilityRole="header">
          {isOwner ? 'Mi Perfil' : 'Perfil'}
        </Text>
      </View>
      <View style={{
        flex: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        padding: theme.spacing['3xl'],
        gap: theme.spacing.base,
      }}>
        <Feather name="alert-circle" size={theme.layout.iconMd * 2} color={theme.colors.error} />
        <Text style={{ ...theme.text.body, color: theme.colors.error, textAlign: 'center' as const }}>
          {error ?? 'No se pudo cargar el perfil.'}
        </Text>
      </View>
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Uso: <ProfileViewStates.Loading /> y <ProfileViewStates.Error />

export const ProfileViewStates = { Loading, Error };
