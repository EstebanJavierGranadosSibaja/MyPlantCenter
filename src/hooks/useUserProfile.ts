import { useState, useCallback, useEffect } from 'react';
// useState    → guarda datos que pueden cambiar (estado)
// useCallback → memoriza funciones para no recrearlas en cada render
// useEffect   → ejecuta código cuando algo cambia (o al montar el componente)

import {
  UserProfile,
  EditProfileDTO,
  UpdatePrivacyDTO,
  UpdateNotificationsDTO,
} from '../types-dtos/user.types';

import { userService } from '../services/user.service';

interface UseUserProfileState {
  profile: UserProfile | null;

  loading:  boolean;   // true mientras espera respuesta del servidor
  saving:   boolean;   // true mientras guarda cambios
  error:    string | null;   // mensaje de error, o null si no hay error
}

interface UseUserProfileReturn extends UseUserProfileState {
  fetchProfile:        () => Promise<void>;
  updateProfile:       (dto: EditProfileDTO) => Promise<void>;
  updatePrivacy:       (dto: UpdatePrivacyDTO) => Promise<void>;
  updateNotifications: (dto: UpdateNotificationsDTO) => Promise<void>;
  clearError:          () => void;
  // () => void significa "función que no recibe nada y no devuelve nada"
  // () => Promise<void> significa "función async que no devuelve valor útil"
}

// ── El hook ───────────────────────────────────────────────────────────────────

export function useUserProfile(userId: string): UseUserProfileReturn {

  const [state, setState] = useState<UseUserProfileState>({
    profile: null,    // al inicio no hay datos
    loading: false,   // no está cargando todavía
    saving:  false,
    error:   null,
  });

  // ── Funciones auxiliares ──────────────────────────────────────────────────

  const setLoading = (loading: boolean) =>
    setState(s => ({ ...s, loading }));

  const setSaving = (saving: boolean) =>
    setState(s => ({ ...s, saving }));

  const setError = (error: string | null) =>
    setState(s => ({ ...s, error }));

  const setProfile = (profile: UserProfile) =>
    setState(s => ({ ...s, profile, error: null }));

  // ── Acciones ──────────────────────────────────────────────────────────────

  // useCallback memoriza la función — no la recrea en cada render.
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      // try/catch maneja errores — si algo falla dentro del try, salta al catch sin romper la app
      const response = await userService.getProfile(userId);

      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message ?? 'Error al cargar el perfil.');
        // ?? es "nullish coalescing": si response.message es null o undefined,
        // usa el string de la derecha como valor por defecto
      }
    } catch (e) {
      // Esto captura errores de red (sin internet, servidor caído, etc.)
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      // finally SIEMPRE se ejecuta, haya error o no
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (dto: EditProfileDTO) => {
    setSaving(true);
    try {
      const response = await userService.updateProfile(userId, dto);
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message ?? 'Error al actualizar el perfil.');
      }
    } catch (e) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }, [userId]);

  const updatePrivacy = useCallback(async (dto: UpdatePrivacyDTO) => {
    if (!state.profile) return;
    // Si no hay perfil cargado, no hacemos nada

    // Optimistic update — actualizamos la UI ANTES de que responda el servidor.
    const perfilAnterior = state.profile;
    setProfile({
      ...state.profile,
      privacidad: { ...state.profile.privacidad, ...dto.privacidad },
    });

    try {
      const response = await userService.updatePrivacy(userId, dto);
      if (!response.success) {
        // El servidor rechazó el cambio — revertimos al estado anterior
        setProfile(perfilAnterior);
        setError(response.message ?? 'Error al actualizar privacidad.');
      }
    } catch (e) {
      setProfile(perfilAnterior);
      setError('Error de conexión. Intenta de nuevo.');
    }
  }, [userId, state.profile]);

  const updateNotifications = useCallback(async (dto: UpdateNotificationsDTO) => {
    if (!state.profile) return;

    const perfilAnterior = state.profile;
    setProfile({
      ...state.profile,
      notificaciones: { ...state.profile.notificaciones, ...dto.notificaciones },
    });

    try {
      const response = await userService.updateNotifications(userId, dto);
      if (!response.success) {
        setProfile(perfilAnterior);
        setError(response.message ?? 'Error al actualizar notificaciones.');
      }
    } catch (e) {
      setProfile(perfilAnterior);
      setError('Error de conexión. Intenta de nuevo.');
    }
  }, [userId, state.profile]);

  const clearError = () => setError(null);

  // ── useEffect ─────────────────────────────────────────────────────────────
  // useEffect ejecuta código como efecto secundario.

  useEffect(() => {
    fetchProfile();
  }, []);

  // ── Retorno ───────────────────────────────────────────────────────────────
  return {
    ...state,   // profile, loading, saving, error
    fetchProfile,
    updateProfile,
    updatePrivacy,
    updateNotifications,
    clearError,
  };
}