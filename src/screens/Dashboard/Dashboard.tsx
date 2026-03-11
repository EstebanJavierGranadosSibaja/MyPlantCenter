import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { Avatar } from 'src/components/ui/Avatar/Avatar';
import { CustomSafeArea } from 'src/components/layout/CustomSaveArea';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import { useDashboardTheme } from './Dashboard.styles';

// Tipo de navegación 
type DashboardNavProp = NativeStackNavigationProp<RootStackParamList>;

// Saludo, varia según la hora
function getGreeting(): { text: string; icon: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Buenos días', icon: 'sunrise' };
  if (hour < 18) return { text: 'Buenas tardes', icon: 'cloud' };
  return { text: 'Buenas noches', icon: 'moon' };
}

// Componente 
export const Dashboard: React.FC = () => {
  const { theme, styles } = useDashboardTheme();
  const navigation = useNavigation<DashboardNavProp>();
  const greeting = getGreeting();

  const handleOpenProfile = () => {
    navigation.navigate('Perfil');
  };

  const avatarButton = (
    <TouchableOpacity
      style={styles.avatarButton}
      onPress={handleOpenProfile}
      activeOpacity={0.8}
      accessibilityLabel="Ver perfil de usuario"
      accessibilityRole="button"
    >
      <View style={{ position: 'relative' }}>
        <Avatar size={theme.layout.avatarSm} />
        <View style={styles.avatarBadge}>
          <Feather
            name="user"
            size={theme.typography.size.xs}
            color={theme.colors.textInverse}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <CustomSafeArea>

      {/* Un solo AppHeader con el avatar en el slot derecho */}
      <AppHeader
        title="MyPlantCenter"
        showBack={false}
        right={avatarButton}
      />

      {/* Saludo */}
      <View style={styles.greetingSection}>
        <Feather
          name={greeting.icon as any}
          size={theme.typography.size['6xl']}
          color={theme.colors.accent}
        />
        <Text style={styles.greetingTitle}>
          {greeting.text}, Esteban
        </Text>
        <Text style={styles.greetingSubtitle}>
          Bienvenido a MyPlantCenter
        </Text>
      </View>

    </CustomSafeArea>
  );
};