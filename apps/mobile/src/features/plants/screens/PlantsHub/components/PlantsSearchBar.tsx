import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';
import { usePlantsHubTheme } from '../PlantsHub.styles';

interface PlantsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlantsSearchBar: React.FC<PlantsSearchBarProps> = ({ value, onChange }) => {
  const { theme, styles } = usePlantsHubTheme();

  return (
    <View style={styles.searchWrapper}>
      <Feather
        name="search"
        size={theme.typography.size.lg}
        color={theme.colors.textMuted}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.searchInput}
        placeholder="Busca por nombre, especie o nota"
        placeholderTextColor={theme.colors.textMuted}
      />
    </View>
  );
};
