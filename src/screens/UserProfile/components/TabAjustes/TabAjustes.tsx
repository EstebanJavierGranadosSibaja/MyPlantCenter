import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Toggle } from 'src/components/ui/Toggle/Toggle';
import { ThemePreference, useThemeContext } from 'src/context/ThemeContext';
import { UpdateNotificationsDTO, UpdatePrivacyDTO, UserProfile } from 'src/types-dtos/user.types';
import { useTabAjustesTheme } from './TabAjustes.styles';


// Props
interface TabAjustesProps {
  profile: UserProfile;
  onUpdatePrivacy: (dto: UpdatePrivacyDTO) => void;
  onUpdateNotifications: (dto: UpdateNotificationsDTO) => void;
}

// Opciones de tema
const THEME_OPTIONS: { key: ThemePreference; iconName: React.ComponentProps<typeof Feather>['name']; label: string }[] = [
  { key: 'light', iconName: 'sun', label: 'Claro' },
  { key: 'dark', iconName: 'moon', label: 'Oscuro' },
  { key: 'system', iconName: 'smartphone', label: 'Sistema' },
];

// Componente 
export const TabAjustes: React.FC<TabAjustesProps> = ({
  profile,
  onUpdatePrivacy,
  onUpdateNotifications,
}) => {
  const { theme, styles } = useTabAjustesTheme();
  const { preference, setPreference } = useThemeContext();

  return (
    <View style={styles.container}>

      {/* ── Tema de la app ── */}
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

      {/* ── Notificaciones ── */}
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

      {/* ── Acciones de cuenta ── */}
      <View>
        <Text style={styles.sectionTitle}>Cuenta</Text>

        {[
          { iconName: 'save' as const, label: 'Exportar mis datos', color: theme.colors.actionExport },
          { iconName: 'lock' as const, label: 'Cambiar contraseña', color: theme.colors.actionPassword },
          { iconName: 'log-out' as const, label: 'Cerrar sesión', color: theme.colors.actionLogout },
          { iconName: 'trash-2' as const, label: 'Eliminar cuenta', color: theme.colors.actionDelete },
        ].map(action => (
          <TouchableOpacity
            key={action.label}
            style={[styles.actionButton, { marginBottom: theme.spacing.sm }]}
            activeOpacity={0.8}
          >
            <Feather name={action.iconName} size={theme.typography.size.lg} color={action.color} />
            <Text style={[styles.actionLabel, { color: action.color }]}>
              {action.label}
            </Text>
            <Feather name="chevron-right" size={theme.typography.size.lg} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
};