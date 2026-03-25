import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { EmptyState } from 'src/components/common/EmptyState/EmptyState';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useDashboardTheme } from './Dashboard.styles';

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
  const greeting = getGreeting();
  const loading = false;
  const plantsCount = 0;

  return (
    <CustomSafeArea>
      <View style={styles.root}>
        <AppHeader
          title="MyPlantCenter"
          subtitle="BIENVENIDO"
          showBack={false}
        />
        {!loading && plantsCount === 0 ? (
          <EmptyState
            iconName="sun"
            title="Todo listo"
            subtitle="Agrega plantas para ver tu resumen"
          />
        ) : (
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
        )}
      </View>
    </CustomSafeArea>
  );
};