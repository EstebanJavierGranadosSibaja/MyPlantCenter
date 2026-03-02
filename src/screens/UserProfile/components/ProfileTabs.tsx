import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { colors }          from '../../../theme/colors';
import { textStyles }      from '../../../theme/typography';
import { spacing, layout } from '../../../theme/spacing';

// ── Types ─────────────────────────────────────────────────────────────────────

// Definimos el tipo aquí y lo exportamos
// UserProfile.tsx lo importa para tipar su propio estado
export type ProfileTab = 'perfil' | 'categorias' | 'ajustes';

// Cada tab tiene un id, una etiqueta y un emoji
export interface TabItem {
  id:    ProfileTab;
  label: string;
  emoji: string;
}

// Lista de tabs — la exportamos también porque UserProfile.tsx la necesita para saber cuántas tabs hay sin duplicar la definición
export const TABS: TabItem[] = [
  { id: 'perfil',     label: 'Perfil',    emoji: '🪴' },
  { id: 'categorias', label: 'Colección', emoji: '🌿' },
  { id: 'ajustes',    label: 'Ajustes',   emoji: '⚙️' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

// ── Componente ────────────────────────────────────────────────────────────────

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>

        {TABS.map(tab => {

          // Calculamos si este tab es el activo lo guardamos en una variable para no repetir la comparación
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && styles.tabActive,
                // isActive && styles.tabActive aplica el estilo solo si isActive es true, es lo mismo que: isActive ? styles.tabActive : null
              ]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabText,
                isActive && styles.tabTextActive,
              ]}>
                {tab.emoji} {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

      </View>
    </View>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: layout.screenH,
    paddingTop:        spacing[5],
    paddingBottom:     spacing[1],
  },
  container: {
    flexDirection:   'row',
    backgroundColor: colors.tabBg,
    borderRadius:    layout.tabBarRadius,
    padding:         layout.tabBarPadding,
    gap:             spacing[1] - 2,
  },
  tab: {
    flex:            1,
    borderRadius:    layout.tabItemRadius,
    paddingVertical: spacing[2] + 1,   // 9
    alignItems:      'center',
    justifyContent:  'center',
  },
  tabActive: {
    backgroundColor: colors.tabActive,
  },
  tabText: {
    ...textStyles.tabLabel,
    color: colors.tabInactive,
  },
  tabTextActive: {
    color: colors.textInverse,
  },
});