import React from 'react';
import { UserProfile } from 'src/features/profile/types/user.types';
import { DetailHeader, ScreenHeader } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface ProfileViewHeaderProps {
  isOwner: boolean;
  profile: UserProfile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Owner profile is a TAB ROOT → left-aligned title (ScreenHeader), consistent
// with the other tabs (Inicio, Plantas, Amigos, Explorar).
//
// A visitor's profile is a PUSHED screen → centered title + back (DetailHeader).
// It uses the generic "Perfil" instead of the person's name, because the hero
// right below already shows the name — repeating it in the header looked wrong.

export const ProfileViewHeader: React.FC<ProfileViewHeaderProps> = ({ isOwner }) => {
  if (isOwner) {
    return <ScreenHeader title="Mi Perfil" />;
  }
  return <DetailHeader title="Perfil" />;
};
