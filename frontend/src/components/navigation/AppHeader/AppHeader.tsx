import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppHeaderTheme } from './AppHeader.styles';

// Props 
interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  style?: object;
}

// Componente 
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  right,
  style,
}) => {
  const { theme, styles } = useAppHeaderTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: theme.spacing.sm },
        style,
      ]}
    >

      {/* ── Botón back ── */}
      {showBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityLabel="Volver atrás"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" color={theme.colors.heroText} size={24} />
        </TouchableOpacity>
      )}

      {/* ── Título ── */}
      <View style={styles.titleGroup}>
        <Text
          style={styles.title}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* ── Slot derecho ── */}
      {right && (
        <View style={styles.rightSlot}>
          {right}
        </View>
      )}

    </View>
  );
};