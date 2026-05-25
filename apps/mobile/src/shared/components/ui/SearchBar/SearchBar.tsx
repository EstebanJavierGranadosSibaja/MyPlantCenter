import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleProp, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSearchBarTheme } from './SearchBar.styles';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar…',
  onClear,
  style,
}) => {
  const { theme, styles } = useSearchBarTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <View style={[styles.wrapper, isFocused && styles.focused, style]}>
      <Feather
        name="search"
        size={theme.layout.iconSm}
        color={theme.colors.textTertiary}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
        >
          <Feather
            name="x"
            size={theme.layout.iconSm}
            color={theme.colors.textTertiary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
