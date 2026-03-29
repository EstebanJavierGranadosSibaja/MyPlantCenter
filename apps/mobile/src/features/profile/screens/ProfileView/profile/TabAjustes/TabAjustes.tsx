import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { ConfirmActionModal } from 'src/shared/components/feedback/ConfirmActionModal/ConfirmActionModal';
import { Toggle } from 'src/shared/components/ui/Toggle/Toggle';
import { ThemePreference, useThemeContext } from 'src/core/contexts/ThemeContext';
import { useConfirmAction } from 'src/shared/hooks/useConfirmAction';
import { UpdateNotificationsDTO, UpdatePrivacyDTO, UserProfile } from 'src/features/profile/types/user.types';
import { AccountActionItem } from './components/AccountActionItem';
import { useTabAjustesTheme } from './TabAjustes.styles';

interface TabAjustesProps {
  profile: UserProfile;
  onUpdatePrivacy: (dto: UpdatePrivacyDTO) => void;
  onUpdateNotifications: (dto: UpdateNotificationsDTO) => void;
}

const THEME_OPTIONS: { key: ThemePreference; iconName: React.ComponentProps<typeof Feather>['name']; label: string }[] = [
  { key: 'light', iconName: 'sun', label: 'Claro' },
  { key: 'dark', iconName: 'moon', label: 'Oscuro' },
  { key: 'system', iconName: 'smartphone', label: 'Sistema' },
];

export const TabAjustes: React.FC<TabAjustesProps> = ({
  profile,
  onUpdatePrivacy,
  onUpdateNotifications,
}) => {
  const { theme, styles } = useTabAjustesTheme();
  const { preference, setPreference } = useThemeContext();
  const { logout, loading } = useAuth();
  const confirm = useConfirmAction();

  const openLogoutConfirm = useCallback(() => {
    confirm.openConfirm(
      {
        title: 'Cerrar sesión',
        message: '¿Seguro que desea salir de su cuenta?',
        confirmText: 'Sí, salir',
        cancelText: 'No',
      },
      logout
    );
  }, [confirm, logout]);

  return (
    <View style={styles.container}>
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
                size={theme.typography.size['2xl']}
                color={preference === opt.key ? theme.colors.accent : theme.colors.textMuted}
              />
              <Text
                style={[
                  styles.themeOptionLabel,
                  preference === opt.key && styles.themeOptionLabelActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Privacidad</Text>
        <View style={styles.group}>
          <View style={styles.groupItem}>
            <Toggle
              label="Perfil público"
              description="Cualquiera puede ver tu perfil"
              value={profile.privacy.publicProfile}
              onChange={v => onUpdatePrivacy({
                privacy: { publicProfile: v },
              })}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.groupItem}>
            <Toggle
              label="Mostrar racha"
              description="Tu racha aparece en tu perfil"
              value={profile.privacy.showStreak}
              onChange={v => onUpdatePrivacy({
                privacy: { showStreak: v },
              })}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.groupItem}>
            <Toggle
              label="Mostrar cumpleaños"
              value={profile.privacy.showBirthday}
              onChange={v => onUpdatePrivacy({
                privacy: { showBirthday: v },
              })}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.groupItem}>
            <Toggle
              label="Permitir solicitudes"
              description="Otros usuarios pueden agregarte"
              value={profile.privacy.allowRequests}
              onChange={v => onUpdatePrivacy({
                privacy: { allowRequests: v },
              })}
            />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.group}>
          <View style={styles.groupItem}>
            <Toggle
              label="Recordatorios de riego"
              description="Te avisamos cuando toca regar"
              value={profile.notifications.wateringReminders}
              onChange={v => onUpdateNotifications({
                notifications: { wateringReminders: v },
              })}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.groupItem}>
            <Toggle
              label="Alertas de salud"
              description="Notificaciones sobre tus plantas"
              value={profile.notifications.healthAlerts}
              onChange={v => onUpdateNotifications({
                notifications: { healthAlerts: v },
              })}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.groupItem}>
            <Toggle
              label="Nuevos amigos"
              value={profile.notifications.newFriends}
              onChange={v => onUpdateNotifications({
                notifications: { newFriends: v },
              })}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.groupItem}>
            <Toggle
              label="Logros desbloqueados"
              value={profile.notifications.achievementsUnlocked}
              onChange={v => onUpdateNotifications({
                notifications: { achievementsUnlocked: v },
              })}
            />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <AccountActionItem
          label="Exportar mis datos"
          iconName="save"
          color={theme.colors.actionExport}
          onPress={() => undefined}
        />
        <AccountActionItem
          label="Cambiar contraseña"
          iconName="lock"
          color={theme.colors.actionPassword}
          onPress={() => undefined}
        />
        <AccountActionItem
          label={loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
          iconName="log-out"
          color={theme.colors.actionLogout}
          onPress={openLogoutConfirm}
        />
        <AccountActionItem
          label="Eliminar cuenta"
          iconName="trash-2"
          color={theme.colors.actionDelete}
          onPress={() => undefined}
        />
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
