import { Feather } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useMemo, useState } from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';
import {
  Modal,
  Platform,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useUITheme } from '../../theme/UIThemeContext';
import { UITheme } from '../../tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Selector de fecha con react-hook-form. Guarda el valor como "DD/MM/AAAA"
// (formato consistente que entienden los validadores/normalizadores existentes)
// y abre el picker NATIVO: diálogo en Android, spinner en modal en iOS.

export interface DateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  hint?: string;
  isRequired?: boolean;
  placeholder?: string;
  leftIcon?: React.ComponentProps<typeof Feather>['name'];
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: StyleProp<ViewStyle>;
}

// ── Helpers de formato ───────────────────────────────────────────────────────

const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

const formatDDMMYYYY = (d: Date): string =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

/** Acepta "DD/MM/AAAA" o ISO "AAAA-MM-DD" y devuelve un Date (o null). */
const parseToDate = (value?: string): Date | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const ddmmyyyy = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const iso = new Date(trimmed);
  return Number.isNaN(iso.getTime()) ? null : iso;
};

// ── Estilos ──────────────────────────────────────────────────────────────────

interface DateFieldStyles {
  wrapper: ViewStyle;
  label: TextStyle;
  labelRequired: TextStyle;
  row: ViewStyle;
  rowError: ViewStyle;
  valueText: TextStyle;
  placeholderText: TextStyle;
  hint: TextStyle;
  errorRow: ViewStyle;
  errorText: TextStyle;
  iosBackdrop: ViewStyle;
  iosSheet: ViewStyle;
  iosSheetHeader: ViewStyle;
  iosSheetAction: TextStyle;
}

const makeStyles = (theme: UITheme): DateFieldStyles => ({
  wrapper: { width: '100%', gap: theme.spacing.xs },
  label: { ...theme.text.label, color: theme.colors.textSecondary },
  labelRequired: { color: theme.colors.error },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.layout.inputHeight,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.inputRadius,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.sm,
  },
  rowError: { borderColor: theme.colors.error },
  valueText: { ...theme.text.body, flex: 1, color: theme.colors.textPrimary },
  placeholderText: { ...theme.text.body, flex: 1, color: theme.colors.textTertiary },
  hint: { ...theme.text.caption, color: theme.colors.textTertiary },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  errorText: { ...theme.text.caption, color: theme.colors.error, flex: 1 },
  iosBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  iosSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: theme.spacing.xl,
  },
  iosSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  iosSheetAction: { ...theme.text.button, color: theme.colors.accent },
});

// ─────────────────────────────────────────────────────────────────────────────

export function DateField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  isRequired = false,
  placeholder = 'DD/MM/AAAA',
  leftIcon = 'calendar',
  minimumDate,
  maximumDate,
  containerStyle,
}: DateFieldProps<T>) {
  const theme = useUITheme();
  const s = useMemo(() => makeStyles(theme), [theme]);

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });

  const currentDate = parseToDate(value as string | undefined);
  const displayText = currentDate ? formatDDMMYYYY(currentDate) : '';

  // iOS: el picker vive dentro de un Modal con un borrador editable.
  const [iosOpen, setIosOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState<Date>(currentDate ?? new Date());

  const commit = (date: Date) => {
    onChange(formatDDMMYYYY(date));
    onBlur();
  };

  const openPicker = () => {
    const base = currentDate ?? new Date();

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: base,
        mode: 'date',
        minimumDate,
        maximumDate,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          if (event.type === 'set' && date) commit(date);
          else onBlur();
        },
      });
    } else {
      setIosDraft(base);
      setIosOpen(true);
    }
  };

  const rowStyle = useMemo<ViewStyle>(
    () => ({ ...s.row, ...(error ? s.rowError : null) }),
    [s, error],
  );

  return (
    <View style={[s.wrapper, containerStyle]}>
      {label ? (
        <Text style={s.label}>
          {label}
          {isRequired ? <Text style={s.labelRequired}> *</Text> : null}
        </Text>
      ) : null}

      <Pressable
        style={rowStyle}
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label}: ${displayText || 'sin fecha'}` : 'Seleccionar fecha'}
      >
        {leftIcon ? (
          <Feather name={leftIcon} size={theme.layout.iconMd} color={theme.colors.textTertiary} />
        ) : null}
        <Text style={displayText ? s.valueText : s.placeholderText} numberOfLines={1}>
          {displayText || placeholder}
        </Text>
        <Feather name="chevron-down" size={theme.layout.iconSm} color={theme.colors.textTertiary} />
      </Pressable>

      {error ? (
        <View style={s.errorRow}>
          <Feather name="alert-circle" size={theme.layout.iconSm} color={theme.colors.error} />
          <Text style={s.errorText} numberOfLines={2}>
            {error.message as string}
          </Text>
        </View>
      ) : hint ? (
        <Text style={s.hint}>{hint}</Text>
      ) : null}

      {/* iOS: picker en modal con botones Cancelar / Listo */}
      {Platform.OS === 'ios' && (
        <Modal visible={iosOpen} transparent animationType="slide" onRequestClose={() => setIosOpen(false)}>
          <Pressable style={s.iosBackdrop} onPress={() => setIosOpen(false)}>
            <Pressable style={s.iosSheet} onPress={() => {}}>
              <View style={s.iosSheetHeader}>
                <TouchableOpacity onPress={() => setIosOpen(false)}>
                  <Text style={[s.iosSheetAction, { color: theme.colors.textSecondary }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    commit(iosDraft);
                    setIosOpen(false);
                  }}
                >
                  <Text style={s.iosSheetAction}>Listo</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={iosDraft}
                mode="date"
                display="spinner"
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={(_e: DateTimePickerEvent, date?: Date) => {
                  if (date) setIosDraft(date);
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
