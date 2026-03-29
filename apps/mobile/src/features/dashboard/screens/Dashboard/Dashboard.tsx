import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { plantService } from 'src/features/plants/services/plant.service';
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
  const { user } = useAuth();
  const { theme, styles } = useDashboardTheme();
  const greeting = getGreeting();
  const [loading, setLoading] = useState(true);
  const [plantsCount, setPlantsCount] = useState(0);

  const loadPlantsCount = React.useCallback(async () => {
    if (!user?.id) {
      setPlantsCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const plants = await plantService.getByUser(user.id);
      setPlantsCount(plants.length);
    } catch {
      setPlantsCount(0);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const firstName = useMemo(() => {
    const source = user?.fullName?.trim();
    if (!source) {
      return 'jardinero';
    }

    const [name] = source.split(/\s+/);
    return name;
  }, [user?.fullName]);

  useEffect(() => {
    loadPlantsCount();
  }, [loadPlantsCount]);

  useFocusEffect(
    React.useCallback(() => {
      loadPlantsCount();
    }, [loadPlantsCount]),
  );

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
              {greeting.text}, {firstName}
            </Text>
            <Text style={styles.greetingSubtitle}>
              Tienes {plantsCount} planta{plantsCount === 1 ? '' : 's'} registradas
            </Text>
          </View>
        )}
      </View>
    </CustomSafeArea>
  );
};