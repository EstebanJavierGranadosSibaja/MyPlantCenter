import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useProfileTabsTheme } from './ProfileTabs.styles';

// Tipos
export type ProfileTab = 'perfil' | 'categorias' | 'ajustes';

export const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'perfil', label: 'Resumen' },
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
          <Pressable
            key={tab.key}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.tabPressed,
              active === tab.key && styles.tabActive,
            ]}
            onPress={() => onChange(tab.key)}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
          >
            <Text style={[
              styles.tabText,
              active === tab.key && styles.tabTextActive,
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};