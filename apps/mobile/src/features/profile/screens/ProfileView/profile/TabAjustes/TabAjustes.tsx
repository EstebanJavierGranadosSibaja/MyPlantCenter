import { Feather } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import { auth } from 'src/core/config/firebase';
import httpClient from 'src/core/http/client';
import { useAuth } from 'src/core/contexts/AuthContext';
import { ThemePreference, useThemeContext } from 'src/core/contexts/ThemeContext';
import { ApiResponse, UpdateNotificationsDTO, UpdatePrivacyDTO, UserProfile } from 'src/features/profile/types/user.types';
import { ConfirmActionModal } from 'src/shared/components/feedback/ConfirmActionModal/ConfirmActionModal';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { ListItem } from 'src/shared/components/ui/ListItem/ListItem';
import { Toggle } from 'src/shared/components/ui/Toggle/Toggle';
import { useConfirmAction } from 'src/shared/hooks/useConfirmAction';
import { useTabAjustesTheme } from './TabAjustes.styles';

// ─────────────────────────────────────────────────────────────────────────────

interface TabAjustesProps {
  profile: UserProfile;
  onUpdatePrivacy: (dto: UpdatePrivacyDTO) => void;
  onUpdateNotifications: (dto: UpdateNotificationsDTO) => void;
}

// ─────────────────────────────────────────────────────────────────────────────

const THEME_OPTIONS: {
  key: ThemePreference;
  iconName: React.ComponentProps<typeof Feather>['name'];
  label: string;
}[] = [
  { key: 'light',  iconName: 'sun',        label: 'Claro'   },
  { key: 'dark',   iconName: 'moon',       label: 'Oscuro'  },
  { key: 'system', iconName: 'smartphone', label: 'Sistema' },
];

// ─────────────────────────────────────────────────────────────────────────────

export const TabAjustes: React.FC<TabAjustesProps> = ({
  profile,
  onUpdatePrivacy,
  onUpdateNotifications,
}) => {
  const { theme, styles } = useTabAjustesTheme();
  const { preference, setPreference } = useThemeContext();
  const { logout, loading } = useAuth();
  const confirm = useConfirmAction();

  const [friendCode, setFriendCode] = useState('');

  useEffect(() => {
    let mounted = true;
    httpClient
      .get<ApiResponse<{ friendCode?: string }>>(`/api/users/${profile.id}`)
      .then(res => {
        if (mounted && res.data.success && res.data.data.friendCode) {
          setFriendCode(res.data.data.friendCode.toUpperCase());
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [profile.id]);

  const openLogoutConfirm = useCallback(() => {
    confirm.openConfirm(
      {
        title:       'Cerrar sesión',
        message:     '¿Seguro que desea salir de su cuenta?',
        confirmText: 'Sí, salir',
        cancelText:  'No',
      },
      logout,
    );
  }, [confirm, logout]);

  const openPasswordResetConfirm = useCallback(() => {
    const email = auth.currentUser?.email;
    if (!email) {
      showToast({
        type: 'error',
        title: 'No pudimos identificar tu correo',
        subtitle: 'Vuelve a iniciar sesión e inténtalo de nuevo.',
      });
      return;
    }

    confirm.openConfirm(
      {
        title:       'Cambiar contraseña',
        message:     `Te enviaremos un correo a ${email} con instrucciones para restablecer tu contraseña.`,
        confirmText: 'Enviar correo',
        cancelText:  'Cancelar',
      },
      async () => {
        try {
          await sendPasswordResetEmail(auth, email);
          showToast({
            type: 'success',
            title: 'Correo enviado',
            subtitle: 'Revisa tu bandeja para restablecer la contraseña.',
          });
        } catch {
          showToast({
            type: 'error',
            title: 'No se pudo enviar el correo',
            subtitle: 'Inténtalo de nuevo en unos minutos.',
          });
        }
      },
    );
  }, [confirm]);

  const handleShareProfile = useCallback(async () => {
    const code = friendCode || profile.nickname.replace('@', '').toUpperCase();
    try {
      await Share.share({
        message: `¡Agrégame en MyPlantCenter! 🌱\nMi código de amistad es: ${code}`,
      });
    } catch {
      // Share cancelado por el usuario — sin acción
    }
  }, [friendCode, profile.nickname]);

  return (
    <View style={styles.container}>

      {/* ── Apariencia ── */}
      <View>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <View style={styles.themeSelector}>
          {THEME_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.themeOption,
                preference === opt.key && styles.themeOptionActive,
              ]}
              onPress={() => setPreference(opt.key)}
              activeOpacity={0.8}
            >
              <Feather
                name={opt.iconName}
                size={theme.layout.iconMd}
                color={preference === opt.key ? theme.colors.accent : theme.colors.textTertiary}
              />
              <Text style={[
                styles.themeOptionLabel,
                preference === opt.key && styles.themeOptionLabelActive,
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Privacidad ── */}
      <View>
        <Text style={styles.sectionTitle}>Privacidad</Text>
        <View style={styles.group}>
          <View style={styles.groupItem}>
            <Toggle
              label="Perfil público"
              description="Cualquiera puede ver tu perfil"
              value={profile.privacy.publicProfile}
              onChange={v => onUpdatePrivacy({ privacy: { publicProfile: v } })}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupItem}>
            <Toggle
              label="Mostrar racha"
              description="Tu racha aparece en tu perfil"
              value={profile.privacy.showStreak}
              onChange={v => onUpdatePrivacy({ privacy: { showStreak: v } })}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupItem}>
            <Toggle
              label="Mostrar cumpleaños"
              value={profile.privacy.showBirthday}
              onChange={v => onUpdatePrivacy({ privacy: { showBirthday: v } })}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupItem}>
            <Toggle
              label="Permitir solicitudes"
              description="Otros usuarios pueden agregarte"
              value={profile.privacy.allowRequests}
              onChange={v => onUpdatePrivacy({ privacy: { allowRequests: v } })}
            />
          </View>
        </View>
      </View>

      {/* ── Notificaciones ── */}
      <View>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.group}>
          <View style={styles.groupItem}>
            <Toggle
              label="Recordatorios de riego"
              description="Te avisamos cuando toca regar"
              value={profile.notifications.wateringReminders}
              onChange={v => onUpdateNotifications({ notifications: { wateringReminders: v } })}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupItem}>
            <Toggle
              label="Alertas de salud"
              description="Notificaciones sobre tus plantas"
              value={profile.notifications.healthAlerts}
              onChange={v => onUpdateNotifications({ notifications: { healthAlerts: v } })}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupItem}>
            <Toggle
              label="Nuevos amigos"
              value={profile.notifications.newFriends}
              onChange={v => onUpdateNotifications({ notifications: { newFriends: v } })}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupItem}>
            <Toggle
              label="Logros desbloqueados"
              value={profile.notifications.achievementsUnlocked}
              onChange={v => onUpdateNotifications({ notifications: { achievementsUnlocked: v } })}
            />
          </View>
        </View>
      </View>

      {/* ── Cuenta ── */}
      <View>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.group}>
          <ListItem
            label="Compartir perfil"
            iconName="share-2"
            iconColor={theme.colors.accent}
            onPress={handleShareProfile}
            showChevron
            showDivider
          />
          <ListItem
            label="Cambiar contraseña"
            iconName="lock"
            iconColor={theme.colors.textSecondary}
            onPress={openPasswordResetConfirm}
            showChevron
            showDivider
          />
          <ListItem
            label={loading ? 'Cerrando sesión…' : 'Cerrar sesión'}
            iconName="log-out"
            iconColor={theme.colors.warning}
            onPress={openLogoutConfirm}
            showChevron
          />
        </View>
      </View>

      <ConfirmActionModal
        visible={confirm.visible}
        title={confirm.config.title}
        message={confirm.config.message}
        confirmText={confirm.config.confirmText}
        cancelText={confirm.config.cancelText}
        destructive={confirm.config.destructive}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.closeConfirm}
      />

    </View>
  );
};
