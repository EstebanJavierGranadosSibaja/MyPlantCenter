import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { careHistoryService } from 'src/features/care/services/careHistory.service';
import { plantService } from 'src/features/plants/services/plant.service';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { Button, DetailHeader, Screen, Surface, Text, useUITheme } from 'src/ui';
import { vacationService } from '../services/vacation.service';
import { PlantRiskLevel, PlantVacationRisk, VacationPlan } from '../types/vacation.types';

// ─────────────────────────────────────────────────────────────────────────────

const RISK_CONFIG: Record<PlantRiskLevel, {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  colorKey: 'accent' | 'textSecondary' | 'textTertiary';
  bgKey: 'accentSoft' | 'bgSubtle' | 'borderSubtle';
}> = {
  high:   { icon: 'alert-triangle', label: 'Alto riesgo',   colorKey: 'accent',          bgKey: 'accentSoft' },
  medium: { icon: 'alert-circle',   label: 'Riesgo medio',  colorKey: 'textSecondary',   bgKey: 'bgSubtle' },
  low:    { icon: 'check-circle',   label: 'Sin riesgo',    colorKey: 'textTertiary',    bgKey: 'borderSubtle' },
};

const formatDate = (d: Date): string =>
  d.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });

const formatISO = (d: Date): string => {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

// ─────────────────────────────────────────────────────────────────────────────

function RiskRow({
  item,
  onWater,
  busy,
}: {
  item: PlantVacationRisk;
  onWater: () => void;
  busy: boolean;
}) {
  const theme  = useUITheme();
  const config = RISK_CONFIG[item.riskLevel];
  const color  = theme.colors[config.colorKey];
  const bg     = theme.colors[config.bgKey];
  const showWater = item.riskLevel !== 'low';

  return (
    <Surface elevation="xs" radius="lg" border="subtle" style={styles.riskRow}>
      <View style={[styles.riskIcon, { backgroundColor: bg }]}>
        <Feather name={config.icon} size={theme.layout.iconSm} color={color} />
      </View>
      <View style={styles.riskBody}>
        <Text variant="label" numberOfLines={1}>{item.plantName}</Text>
        <Text variant="caption" color="textTertiary" numberOfLines={2}>
          {item.recommendedAction}
        </Text>
        <View style={styles.riskFooter}>
          <Text variant="caption" style={{ color }}>
            {config.label}
          </Text>
          {showWater && (
            <Button
              label={busy ? '…' : 'Marcar regada'}
              onPress={onWater}
              loading={busy}
              disabled={busy}
              variant="secondary"
              size="sm"
            />
          )}
        </View>
      </View>
    </Surface>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type DatePickerField = 'departure' | 'return';

export function VacationModeScreen() {
  const theme      = useUITheme();
  const { user }   = useAuth();
  const navigation = useNavigation();

  const today = React.useMemo(() => new Date(), []);
  const tomorrow = React.useMemo(() => {
    const d = new Date(today); d.setDate(d.getDate() + 1); return d;
  }, [today]);
  const dayAfter = React.useMemo(() => {
    const d = new Date(today); d.setDate(d.getDate() + 7); return d;
  }, [today]);

  const [loading,        setLoading]        = React.useState(true);
  const [saving,         setSaving]          = React.useState(false);
  const [plants,         setPlants]          = React.useState<Awaited<ReturnType<typeof plantService.getByUser>>>([]);
  const [risks,          setRisks]           = React.useState<PlantVacationRisk[]>([]);
  const [activeVacation, setActiveVacation]  = React.useState<VacationPlan | null>(null);
  const [departure,      setDeparture]       = React.useState<Date>(tomorrow);
  const [returnDate,     setReturnDate]       = React.useState<Date>(dayAfter);
  const [pickerField,    setPickerField]      = React.useState<DatePickerField | null>(null);
  const [showPicker,     setShowPicker]       = React.useState(false);
  const [wateringId,     setWateringId]       = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [fetchedPlants, saved] = await Promise.all([
        plantService.getByUser(user.id),
        vacationService.load(),
      ]);

      setPlants(fetchedPlants);

      if (saved?.isActive) {
        setActiveVacation(saved);
        setDeparture(new Date(saved.departureDate));
        setReturnDate(new Date(saved.returnDate));
      }
    } catch {
      showToast({ type: 'error', title: 'No se pudo cargar la información.' });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Refresca al enfocar la pantalla para reflejar plantas agregadas/regadas.
  useFocusEffect(React.useCallback(() => { load(); }, [load]));

  // Recalcula el riesgo EN VIVO cada vez que cambian las plantas o las fechas.
  React.useEffect(() => {
    setRisks(vacationService.assessRisks(plants, departure, returnDate));
  }, [plants, departure, returnDate]);

  const applyDate = React.useCallback((field: DatePickerField, date: Date) => {
    if (field === 'departure') {
      setDeparture(date);
      setReturnDate(prev => {
        if (date >= prev) {
          const next = new Date(date);
          next.setDate(next.getDate() + 1);
          return next;
        }
        return prev;
      });
    } else {
      setReturnDate(prev => (date > departure ? date : prev));
    }
  }, [departure]);

  const handleDateChange = React.useCallback((field: DatePickerField) =>
    (_event: unknown, date?: Date) => {
      setShowPicker(false);
      setPickerField(null);
      if (date) applyDate(field, date);
    },
  [applyDate]);

  const openPicker = React.useCallback((field: DatePickerField) => {
    const currentValue = field === 'departure' ? departure : returnDate;
    const minDate      = field === 'departure' ? today : departure;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentValue,
        mode: 'date',
        minimumDate: minDate,
        onChange: handleDateChange(field),
      });
    } else {
      setPickerField(field);
      setShowPicker(true);
    }
  }, [departure, handleDateChange, returnDate, today]);

  const handleActivate = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const plan: VacationPlan = {
        departureDate: formatISO(departure),
        returnDate:    formatISO(returnDate),
        isActive:      true,
      };
      await vacationService.save(plan);
      const refreshedPlants = await plantService.getByUser(user.id);
      setPlants(refreshedPlants); // el efecto recalcula el riesgo
      setActiveVacation(plan);
      showToast({ type: 'success', title: 'Modo vacaciones activado' });
    } catch {
      showToast({ type: 'error', title: 'No se pudo activar el modo vacaciones.' });
    } finally {
      setSaving(false);
    }
  };

  const handleWaterPlant = async (plantId: string, plantName: string) => {
    if (!user?.id || wateringId) return;
    setWateringId(plantId);
    try {
      await careHistoryService.logWatering(user.id, plantId);
      const refreshed = await plantService.getByUser(user.id);
      setPlants(refreshed); // el efecto recalcula el riesgo en vivo
      showToast({ type: 'success', title: `${plantName} regada`, subtitle: 'Riesgo actualizado.' });
    } catch {
      showToast({ type: 'error', title: 'No se pudo registrar el riego' });
    } finally {
      setWateringId(null);
    }
  };

  const handleDeactivate = async () => {
    await vacationService.clear();
    setActiveVacation(null);
    showToast({ type: 'success', title: 'Modo vacaciones desactivado' });
    navigation.goBack();
  };

  const vacationDays = Math.max(
    1,
    Math.round((returnDate.getTime() - departure.getTime()) / (24 * 60 * 60 * 1000)),
  );

  const highRiskCount   = risks.filter(r => r.riskLevel === 'high').length;
  const mediumRiskCount = risks.filter(r => r.riskLevel === 'medium').length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen edges={['top', 'left', 'right']} contentStyle={styles.root}>
      <DetailHeader title="Modo Vacaciones" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Active banner ─────────────────────────────────────────────── */}
        {activeVacation && (
          <Surface elevation="xs" radius="lg" border="subtle"
            style={[styles.activeBanner, { backgroundColor: theme.colors.accentSoft }]}
          >
            <Feather name="sun" size={theme.layout.iconMd} color={theme.colors.accent} />
            <View style={styles.bannerText}>
              <Text variant="label" color="accent">Vacaciones activas</Text>
              <Text variant="caption" color="textSecondary">
                {formatDate(departure)} → {formatDate(returnDate)} ({vacationDays} d)
              </Text>
            </View>
          </Surface>
        )}

        {/* ── Date selector ─────────────────────────────────────────────── */}
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
          <Text variant="title">Fechas de viaje</Text>

          <View style={styles.dateRow}>
            <TouchableOpacity
              style={[styles.datePicker, { backgroundColor: theme.colors.bgSubtle, borderColor: theme.colors.borderDefault }]}
              onPress={() => openPicker('departure')}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={theme.layout.iconSm} color={theme.colors.accent} />
              <View>
                <Text variant="overline" color="textTertiary">Salida</Text>
                <Text variant="label">{formatDate(departure)}</Text>
              </View>
            </TouchableOpacity>

            <Feather name="arrow-right" size={theme.layout.iconSm} color={theme.colors.textTertiary} />

            <TouchableOpacity
              style={[styles.datePicker, { backgroundColor: theme.colors.bgSubtle, borderColor: theme.colors.borderDefault }]}
              onPress={() => openPicker('return')}
              activeOpacity={0.7}
            >
              <Feather name="log-in" size={theme.layout.iconSm} color={theme.colors.accent} />
              <View>
                <Text variant="overline" color="textTertiary">Regreso</Text>
                <Text variant="label">{formatDate(returnDate)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Surface elevation="none" radius="md" border="subtle" style={[styles.durationChip, { backgroundColor: theme.colors.bgSubtle }]}>
            <Feather name="clock" size={14} color={theme.colors.textTertiary} />
            <Text variant="caption" color="textSecondary">{vacationDays} días fuera</Text>
          </Surface>

          {activeVacation ? (
            <Button
              label="Desactivar modo vacaciones"
              variant="ghost"
              onPress={handleDeactivate}
              leftSlot={<Feather name="x-circle" size={theme.layout.iconSm} color={theme.colors.textSecondary} />}
              fullWidth
            />
          ) : (
            <Button
              label={saving ? 'Activando...' : 'Activar modo vacaciones'}
              onPress={handleActivate}
              disabled={saving}
              leftSlot={<Feather name="sun" size={theme.layout.iconSm} color={theme.colors.textOnAccent} />}
              fullWidth
            />
          )}
        </Surface>

        {/* ── Risk assessment ───────────────────────────────────────────── */}
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
          <View style={styles.riskHeader}>
            <Text variant="title">Evaluación de plantas</Text>
            {loading ? null : (
              <Text variant="caption" color="textTertiary">{risks.length} plantas</Text>
            )}
          </View>

          {(highRiskCount > 0 || mediumRiskCount > 0) && !loading && (
            <Surface elevation="none" radius="md" border="subtle"
              style={[styles.summaryChip, { backgroundColor: theme.colors.accentSoft }]}
            >
              <Feather name="alert-triangle" size={14} color={theme.colors.accent} />
              <Text variant="caption" color="accent">
                {highRiskCount > 0 ? `${highRiskCount} de alto riesgo` : ''}
                {highRiskCount > 0 && mediumRiskCount > 0 ? ', ' : ''}
                {mediumRiskCount > 0 ? `${mediumRiskCount} de riesgo medio` : ''}
              </Text>
            </Surface>
          )}

          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.accent} />
          ) : risks.length === 0 ? (
            <Text variant="bodyMd" color="textTertiary">No tienes plantas registradas aún.</Text>
          ) : (
            <View style={styles.riskList}>
              {risks.map(r => (
                <RiskRow
                  key={r.plantId}
                  item={r}
                  busy={wateringId === r.plantId}
                  onWater={() => handleWaterPlant(r.plantId, r.plantName)}
                />
              ))}
            </View>
          )}
        </Surface>

        {/* ── Tips ─────────────────────────────────────────────────────── */}
        <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>
          <Text variant="title">Consejos antes de salir</Text>
          {[
            'Riega todas las plantas marcadas como "Alto riesgo" el día anterior a tu salida.',
            'Agrupa las plantas en un lugar con luz indirecta para reducir evaporación.',
            'Usa platillos con agua bajo las macetas para plantas sensibles.',
            'Pide a alguien de confianza regar las plantas de alto riesgo si tu viaje es largo.',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipNum, { backgroundColor: theme.colors.accentSoft }]}>
                <Text variant="overline" color="accent">{i + 1}</Text>
              </View>
              <Text variant="bodyMd" color="textSecondary" style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Surface>
      </ScrollView>

      {/* ── Date picker — iOS only (Android uses DateTimePickerAndroid.open) ── */}
      {showPicker && Platform.OS === 'ios' && pickerField && (
        <DateTimePicker
          value={pickerField === 'departure' ? departure : returnDate}
          mode="date"
          display="inline"
          minimumDate={pickerField === 'departure' ? today : departure}
          onChange={handleDateChange(pickerField)}
        />
      )}
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
    gap: 12,
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  bannerText: {
    flex: 1,
    gap: 2,
  },
  card: {
    padding: 20,
    gap: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  riskList: {
    gap: 8,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
  },
  riskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskBody: {
    flex: 1,
    gap: 3,
  },
  riskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipText: {
    flex: 1,
  },
});
