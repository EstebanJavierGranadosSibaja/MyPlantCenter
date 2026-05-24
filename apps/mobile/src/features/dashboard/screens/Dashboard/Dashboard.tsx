import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { buildCareSummary, buildCareTasks } from 'src/features/care/utils/careSchedule';
import { plantService } from 'src/features/plants/services/plant.service';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { useDashboardTheme } from './Dashboard.styles';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

// Saludo, varia según la hora
function getGreeting(): { text: string; icon: React.ComponentProps<typeof Feather>['name'] } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Buenos días', icon: 'sunrise' };
  if (hour < 18) return { text: 'Buenas tardes', icon: 'cloud' };
  return { text: 'Buenas noches', icon: 'moon' };
}

function getCollectionStatus(plantsCount: number, loading: boolean): string {
  if (loading) {
    return 'Sync';
  }

  if (plantsCount === 0) {
    return 'Vacia';
  }

  if (plantsCount < 4) {
    return 'Crece';
  }

  return 'Activa';
}

function getSummaryHint(plantsCount: number, loading: boolean): string {
  if (loading) {
    return 'Actualizando tu resumen general.';
  }

  if (plantsCount === 0) {
    return 'Agrega tu primera planta para comenzar a registrar riego y salud.';
  }

  if (plantsCount === 1) {
    return 'Buen comienzo, mantén el seguimiento para no perder el ritmo.';
  }

  return 'Tu jardin va en crecimiento, revisa plantas y amistades desde las otras pestañas.';
}

// Componente 
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme, styles } = useDashboardTheme();
  const navigation = useNavigation<RootNavigation>();
  const greeting = getGreeting();
  const [loading, setLoading] = useState(true);
  const [plantsCount, setPlantsCount] = useState(0);
  const [careSummary, setCareSummary] = useState(() => buildCareSummary([]));

  const loadPlantsCount = React.useCallback(async () => {
    if (!user?.id) {
      setPlantsCount(0);
      setCareSummary(buildCareSummary([]));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const plants = await plantService.getByUser(user.id);
      setPlantsCount(plants.length);
      setCareSummary(buildCareSummary(buildCareTasks(plants)));
    } catch {
      setPlantsCount(0);
      setCareSummary(buildCareSummary([]));
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

  useFocusEffect(
    React.useCallback(() => {
      loadPlantsCount();
    }, [loadPlantsCount]),
  );

  const plantsLabel = plantsCount === 1 ? 'planta' : 'plantas';
  const collectionStatus = getCollectionStatus(plantsCount, loading);
  const summaryHint = getSummaryHint(plantsCount, loading);

  const handleAddPlant = () => {
    navigation.navigate('AddPlant');
  };

  const handleOpenCalendar = () => {
    navigation.navigate('WateringCalendar');
  };

  return (
    <CustomSafeArea
      scroll
      scrollBottomInset={theme.layout.heroPaddingBottom + theme.spacing['4xl']}
    >
      <View style={styles.root}>
        <AppHeader
          title="Inicio"
          subtitle="TU PANEL DIARIO"
          showBack={false}
        />
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <View style={styles.greetingRow}>
              <View style={styles.greetingIconWrap}>
                <Feather
                  name={greeting.icon}
                  size={theme.typography.size.lg}
                  color={theme.colors.accent}
                />
              </View>

              <View style={styles.greetingCopy}>
                <Text style={styles.greetingEyebrow}>{greeting.text}</Text>
                <Text style={styles.greetingTitle}>{firstName}</Text>
              </View>
            </View>

            <Text style={styles.greetingSubtitle}>
              {loading ? 'Actualizando tu resumen...' : `Tienes ${plantsCount} ${plantsLabel} registradas.`}
            </Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Plantas</Text>
              <Text style={styles.metricValue}>{loading ? '--' : String(plantsCount)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Coleccion</Text>
              <Text style={styles.metricValue}>{collectionStatus}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen rapido</Text>
            <Text style={styles.summaryText}>{summaryHint}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
              onPress={handleAddPlant}
              accessibilityRole="button"
              accessibilityLabel="Agregar planta"
            >
              <Feather
                name="plus"
                size={theme.typography.size.base}
                color={theme.colors.textInverse}
              />
              <Text style={styles.actionButtonText}>
                {plantsCount === 0 ? 'Agregar primera planta' : 'Agregar otra planta'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.careCard}>
            <View style={styles.careHeader}>
              <Text style={styles.careTitle}>Riego inteligente</Text>
              <Text style={styles.careMeta}>Hoy y próximos días</Text>
            </View>

            <View style={styles.careRow}>
              <View style={styles.carePill}>
                <Text style={styles.careValue}>{loading ? '--' : String(careSummary.overdue)}</Text>
                <Text style={styles.careLabel}>Atrasadas</Text>
              </View>
              <View style={styles.carePill}>
                <Text style={styles.careValue}>{loading ? '--' : String(careSummary.dueToday)}</Text>
                <Text style={styles.careLabel}>Hoy</Text>
              </View>
              <View style={styles.carePill}>
                <Text style={styles.careValue}>{loading ? '--' : String(careSummary.soon + careSummary.upcoming)}</Text>
                <Text style={styles.careLabel}>Próximas</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.careButton,
                pressed && styles.careButtonPressed,
              ]}
              onPress={handleOpenCalendar}
              accessibilityRole="button"
              accessibilityLabel="Ver calendario de riego"
            >
              <Feather
                name="calendar"
                size={theme.typography.size.base}
                color={theme.colors.textInverse}
              />
              <Text style={styles.careButtonText}>Ver calendario</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};
