import React from 'react';
import { UserProfile } from 'src/features/profile/types/user.types';
import { DetailHeader } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface ProfileViewHeaderProps {
  isOwner: boolean;
  profile: UserProfile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Uses the app-wide DetailHeader (centered title + back). The owner profile is
// a tab root, so it hides the back button; a visitor's profile is a pushed
// screen and keeps it.

export const ProfileViewHeader: React.FC<ProfileViewHeaderProps> = ({
  isOwner,
  profile,
}) => {
  return (
    <DetailHeader
      title={isOwner ? 'Mi Perfil' : profile.name}
      hideBack={isOwner}
    />
  );
};
