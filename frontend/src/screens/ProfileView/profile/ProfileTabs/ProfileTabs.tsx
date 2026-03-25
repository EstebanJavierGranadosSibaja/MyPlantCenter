import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useProfileTabsTheme } from './ProfileTabs.styles';

// Tipos
export type ProfileTab = 'perfil' | 'categorias' | 'ajustes';

export const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'perfil', label: 'Perfil' },
  { key: 'categorias', label: 'Categorías' },
  { key: 'ajustes', label: 'Ajustes' },
];

// Props
interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  tabs?: { key: ProfileTab; label: string }[];
}

// Componente 
export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  active,
  onChange,
  tabs = TABS,
}) => {
  const { styles } = useProfileTabsTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, active === tab.key && styles.tabActive]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.8}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
          >
            <Text style={[
              styles.tabText,
              active === tab.key && styles.tabTextActive,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};