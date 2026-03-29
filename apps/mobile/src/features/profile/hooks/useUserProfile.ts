import { useCallback, useEffect, useState } from 'react';
import { userService } from 'src/features/profile/services/user.service';
import {
  EditProfileDTO,
  UpdateNotificationsDTO,
  UpdatePrivacyDTO,
  UserProfile,
} from 'src/features/profile/types/user.types';

// Estado interno del hook
interface UseUserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

// Hook
export function useUserProfile(userId: string) {

  const [state, setState] = useState<UseUserProfileState>({
    profile: null,
    loading: false,
    saving: false,
    error: null,
  });

  // Helpers para actualizar partes del estado
  const setLoading = (loading: boolean) =>
    setState(s => ({ ...s, loading }));

  const setSaving = (saving: boolean) =>
    setState(s => ({ ...s, saving }));

  const setError = (error: string | null) =>
    setState(s => ({ ...s, error }));

  const setProfile = (profile: UserProfile) =>
    setState(s => ({ ...s, profile, error: null }));

  // Acciones
  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setState(s => ({
        ...s,
        profile: null,
        loading: false,
        error: null,
      }));
      return;
    }

    setLoading(true);
    try {
      const res = await userService.getProfile(userId);
      if (res.success) setProfile(res.data);
      else setError(res.error ?? 'Error al cargar el perfil.');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (dto: EditProfileDTO) => {
    setSaving(true);
    try {
      const res = await userService.updateProfile(userId, dto);
      if (res.success) {
        setProfile(res.data);
      } else {
        setError(res.error ?? 'Error al actualizar.');
      }
      return res;
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
      return {
        success: false,
        error: 'Error de conexión. Intenta de nuevo.',
        data: undefined as unknown as UserProfile,
      };
    } finally {
      setSaving(false);
    }
  }, [userId]);

  const updatePrivacy = useCallback(async (dto: UpdatePrivacyDTO) => {
    if (!state.profile) return;
    const anterior = state.profile;
    setProfile({
      ...state.profile,
      privacy: { ...state.profile.privacy, ...dto.privacy },
    });
    try {
      const res = await userService.updatePrivacy(userId, dto);
      if (!res.success) {
        setProfile(anterior);
        setError(res.error ?? 'Error al actualizar privacidad.');
      }
    } catch {
      setProfile(anterior);
      setError('Error de conexión. Intenta de nuevo.');
    }
  }, [userId, state.profile]);

  const updateNotifications = useCallback(async (dto: UpdateNotificationsDTO) => {
    if (!state.profile) return;
    const anterior = state.profile;
    setProfile({
      ...state.profile,
      notifications: { ...state.profile.notifications, ...dto.notifications },
    });
    try {
      const res = await userService.updateNotifications(userId, dto);
      if (!res.success) {
        setProfile(anterior);
        setError(res.error ?? 'Error al actualizar notificaciones.');
      }
    } catch {
      setProfile(anterior);
      setError('Error de conexión. Intenta de nuevo.');
    }
  }, [userId, state.profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    ...state,
    fetchProfile,
    updateProfile,
    updatePrivacy,
    updateNotifications,
  };
}