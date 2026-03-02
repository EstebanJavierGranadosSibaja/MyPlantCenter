import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Toggle } from '../../../components/ui/Toggle/Toggle';
import { colors }               from '../../../theme/colors';
import { textStyles }           from '../../../theme/typography';
import { radius, spacing, layout } from '../../../theme/spacing';

import {
  PrivacySettings,
  NotificationSettings,
  UpdatePrivacyDTO,
  UpdateNotificationsDTO,
} from '../../../types-dtos/user.types';

// ── Types locales ─────────────────────────────────────────────────────────────

interface AccountAction {
  label: string;
  emoji: string;
  color: string;
}

// ── Constantes ────────────────────────────────────────────────────────────────

const PRIVACY_ITEMS: {
  key:   keyof PrivacySettings;
  label: string;
  description?: string;
}[] = [
  {
    key:         'perfilPublico',
    label:       'Perfil público',
    description: 'Tu perfil es visible para todos.',
  },
  { key: 'mostrarRacha',        label: 'Mostrar racha'                  },
  { key: 'mostrarCumpleanos',   label: 'Mostrar cumpleaños'             },
  { key: 'permitirSolicitudes', label: 'Permitir solicitudes de amistad'},
];

const NOTIFICATION_ITEMS: {
  key:   keyof NotificationSettings;
  label: string;
}[] = [
  { key: 'recordatoriosRiego',  label: 'Recordatorios de riego' },
  { key: 'alertasSalud',        label: 'Alertas de salud'       },
  { key: 'nuevosAmigos',        label: 'Nuevos amigos'          },
  { key: 'logrosDesbloqueados', label: 'Logros desbloqueados'   },
];

const ACCOUNT_ACTIONS: AccountAction[] = [
  { label: 'Exportar mis datos', emoji: '📤', color: colors.actionExport   },
  { label: 'Cambiar contraseña', emoji: '🔒', color: colors.actionPassword },
  { label: 'Cerrar sesión',      emoji: '👋', color: colors.actionLogout   },
  { label: 'Eliminar cuenta',    emoji: '🗑️', color: colors.actionDelete   },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface TabAjustesProps {
  privacidad:          PrivacySettings;
  notificaciones:      NotificationSettings;
  onUpdatePrivacy:     (dto: UpdatePrivacyDTO) => void;
  onUpdateNotifications: (dto: UpdateNotificationsDTO) => void;
}

// ── Componente ────────────────────────────────────────────────────────────────

export const TabAjustes: React.FC<TabAjustesProps> = ({
  privacidad,
  notificaciones,
  onUpdatePrivacy,
  onUpdateNotifications,
}) => {
  return (
    <>

      {/* ── Privacidad ── */}
      <View style={styles.section}>
        <SectionHeader title="Privacidad" />
        <SettingsGroup>
          {PRIVACY_ITEMS.map((item, index) => (
            <React.Fragment key={item.key}>
              <View style={styles.settingsItem}>
                <Toggle
                  value={privacidad[item.key]}
                  // privacidad[item.key] accede al valor dinámicamente
                  // si item.key = 'perfilPublico' → privacidad.perfilPublico
                  onChange={val => onUpdatePrivacy({
                    privacidad: { [item.key]: val },
                    // [item.key] → computed property
                    // crea { perfilPublico: val } o { mostrarRacha: val } etc.
                  })}
                  label={item.label}
                  description={
                    // Solo mostramos description en perfilPublico y cambia según el valor actual
                    item.key === 'perfilPublico'
                      ? privacidad.perfilPublico
                        ? 'Tu perfil es visible para todos.'
                        : 'Solo tus amigos pueden verte.'
                      : item.description
                  }
                />
              </View>
              {/* Divisor entre items — excepto después del último */}
              {index < PRIVACY_ITEMS.length - 1 && (
                <ItemDivider />
              )}
            </React.Fragment>
          ))}
        </SettingsGroup>
      </View>

      <SectionDivider />

      {/* ── Notificaciones ── */}
      <View style={styles.section}>
        <SectionHeader title="Notificaciones" />
        <SettingsGroup>
          {NOTIFICATION_ITEMS.map((item, index) => (
            <React.Fragment key={item.key}>
              <View style={styles.settingsItem}>
                <Toggle
                  value={notificaciones[item.key]}
                  onChange={val => onUpdateNotifications({
                    notificaciones: { [item.key]: val },
                  })}
                  label={item.label}
                />
              </View>
              {index < NOTIFICATION_ITEMS.length - 1 && (
                <ItemDivider />
              )}
            </React.Fragment>
          ))}
        </SettingsGroup>
      </View>

      <SectionDivider />

      {/* ── Cuenta ── */}
      <View style={styles.section}>
        <SectionHeader title="Cuenta" />
        {ACCOUNT_ACTIONS.map(action => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionButton}
            activeOpacity={0.75}
            // onPress vacío por ahora, se conectará cuando haya navegación
          >
            <Text style={styles.actionEmoji}>{action.emoji}</Text>
            <Text style={[styles.actionLabel, { color: action.color }]}>
              {action.label}
            </Text>
            <Text style={[styles.actionChevron, { color: action.color }]}>
              ›
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </>
  );
};

// ── Componentes internos ──────────────────────────────────────────────────────

const SectionDivider = () => <View style={styles.divider} />;

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
);

const ItemDivider = () => <View style={styles.itemDivider} />;

// SettingsGroup envuelve un grupo de toggles con el estilo de card. Es un componente de layout, solo aplica estilos al contenedor
const SettingsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.settingsGroup}>
    {children}
  </View>
);

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: layout.screenH,
    paddingVertical:   spacing[5],
  },
  divider: {
    height:           1,
    marginHorizontal: layout.screenH,
    backgroundColor:  colors.border,
  },
  sectionTitle: {
    ...textStyles.caption,
    color:        colors.textMuted,
    marginBottom: spacing[3] + 2,
  },

  // Grupo de settings
  settingsGroup: {
    backgroundColor: colors.cardBg,
    borderRadius:    radius.md,
    borderWidth:     1.5,
    borderColor:     colors.border,
    overflow:        'hidden',
  },
  settingsItem: {
    paddingHorizontal: spacing[4],
    paddingVertical:   spacing[4],
  },
  itemDivider: {
    height:           1,
    backgroundColor:  colors.border,
  },

  // Acciones de cuenta
  actionButton: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing[3],
    backgroundColor: colors.cardBg,
    borderWidth:     1.5,
    borderColor:     colors.border,
    borderRadius:    radius.md,
    padding:         spacing[3] + 2,
    marginBottom:    spacing[2],
  },
  actionEmoji: {
    fontSize:   spacing[4] + 2,   // 18
    lineHeight: spacing[5] + 2,   // 22
  },
  actionLabel: {
    ...textStyles.label,
    flex:       1,
    fontSize:   spacing[3] + 1,   // 13
    fontWeight: '500',
  },
  actionChevron: {
    fontSize: spacing[4],         // 16
  },
});