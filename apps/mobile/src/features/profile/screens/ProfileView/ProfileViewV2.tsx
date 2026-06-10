import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useProfileViewState } from 'src/features/profile/hooks/useProfileViewState';
import { Screen } from 'src/ui';
import { ProfileHero } from './profile/ProfileHero/ProfileHero';
import { ProfileViewHeader } from './components/ProfileViewHeader';
import { ProfileViewStates } from './components/ProfileViewStates';
import { ProfileViewTabs } from './components/ProfileViewTabs';

// ─────────────────────────────────────────────────────────────────────────────

export type ProfileTab = 'perfil' | 'categorias' | 'ajustes';

export interface ProfileViewProps {
  userId: string;
  isOwner: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

export function ProfileViewV2({ userId, isOwner }: ProfileViewProps) {
  const state = useProfileViewState(userId, isOwner);

  // Refresca al volver de la pantalla "Editar perfil" para reflejar cambios.
  const { fetchProfile } = state;
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile]),
  );

  if (state.loading && !state.profile) {
    return <ProfileViewStates.Loading isOwner={isOwner} />;
  }

  if (!state.profile || !state.heroProps) {
    return <ProfileViewStates.Error isOwner={isOwner} error={state.error} />;
  }

  return (
    <Screen scroll edges={['top', 'left', 'right']} contentStyle={{ paddingBottom: 132 }}>
      <ProfileViewHeader
        isOwner={isOwner}
        profile={state.profile}
      />
      <ProfileHero {...state.heroProps} />
      <ProfileViewTabs
        isOwner={isOwner}
        profile={state.profile}
        state={state}
      />
    </Screen>
  );
}
