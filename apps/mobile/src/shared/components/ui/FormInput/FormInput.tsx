import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useMemo, useState } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import {
    Platform,
    StyleProp,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { FeatherIconName } from 'src/features/profile/types/user.types';
import { useFormInputTheme } from './FormInput.styles';

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  iconName?: FeatherIconName;
  rightElement?: React.ReactNode;
  isPassword?: boolean;
  isRequired?: boolean;
  helperText?: string;
  fieldErrorText?: string;
  inputRef?: React.Ref<TextInput>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  dateMask?: 'dd/mm/yyyy';
  datePicker?: boolean;
}

function toMaskedDate(value: Date): string {
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = String(value.getFullYear());
  return `${day}/${month}/${year}`;
}

function parseMaskedDate(value: string): Date | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year
    || parsed.getMonth() !== month - 1
    || parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

/**
 * FormInput — Componente reutilizable de campo de formulario
 *
 * Integra React Hook Form via `control` + `name`, eliminando el prop drilling
 * manual de `value`, `onChangeText`, `onBlur` y `error` que existía en cada pantalla.
 *
 * @param control      Objeto control de useForm(). Conecta el campo al formulario.
 * @param name         Nombre del campo en el esquema del formulario. Type-safe via FieldPath<T>.
 * @param label        Texto del label encima del input. Opcional.
 * @param iconName     Ícono Feather a la izquierda del input. Opcional.
 * @param rightElement Slot derecho del input (ej: botón de visibilidad, contador). Opcional.
 * @param isPassword   Activa secureTextEntry y el toggle de visibilidad integrado.
 * @param isRequired   Muestra asterisco rojo junto al label.
 * @param helperText   Texto de ayuda visible cuando no hay error activo.
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  iconName,
  rightElement,
  isPassword = false,
  isRequired = false,
  helperText,
  fieldErrorText,
  editable = true,
  style,
  containerStyle,
  inputStyle,
  inputRef,
  dateMask,
  datePicker = false,
  ...inputProps
}: FormInputProps<T>) {
  const { theme, styles } = useFormInputTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    field: { value, onChange, onBlur },
    fieldState,
  } = useController({ control, name });

  const shouldSecure = useMemo(() => isPassword && !showPassword, [isPassword, showPassword]);
  const canUseDatePicker = datePicker && dateMask === 'dd/mm/yyyy';
  const isAndroidDatePickerField = canUseDatePicker && Platform.OS === 'android';
  const errorMessage = (fieldState.error?.message as string | undefined) ?? fieldErrorText;

  const openDatePicker = () => {
    if (!canUseDatePicker || Platform.OS !== 'android') {
      return;
    }

    const baseDate = parseMaskedDate(normalizedValue) ?? new Date();

    DateTimePickerAndroid.open({
      value: baseDate,
      mode: 'date',
      onChange: (event, selectedDate) => {
        if (event.type !== 'set' || !selectedDate) {
          return;
        }

        onChange(toMaskedDate(selectedDate));
      },
    });
  };

  const trailingElement = rightElement ?? (
    isPassword ? (
      <TouchableOpacity
        onPress={() => setShowPassword(prev => !prev)}
        accessibilityRole="button"
        accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <Feather
          name={showPassword ? 'eye-off' : 'eye'}
          size={theme.typography.size.xl}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>
    ) : null
  );

  const normalizedValue =
    typeof value === 'number'
      ? String(value)
      : typeof value === 'string'
        ? value
        : '';

  const handleChangeText = (text: string) => {
    if (dateMask === 'dd/mm/yyyy') {
      const digits = text.replace(/\D/g, '').slice(0, 8);

      if (digits.length <= 2) {
        onChange(digits);
        return;
      }

      if (digits.length <= 4) {
        onChange(`${digits.slice(0, 2)}/${digits.slice(2)}`);
        return;
      }

      onChange(`${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`);
      return;
    }

    const isNumericKeyboard =
      inputProps.keyboardType === 'numeric' ||
      inputProps.keyboardType === 'number-pad' ||
      inputProps.keyboardType === 'decimal-pad';

    if (isNumericKeyboard) {
      const sanitized = text.replace(/[^\d]/g, '');
      // Permite borrar completamente el campo sin "rebotar" al último número válido.
      onChange(sanitized === '' ? '' : Number(sanitized));
      return;
    }

    onChange(text);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {isRequired ? <Text style={styles.labelRequired}> *</Text> : null}
        </Text>
      ) : null}

      {isAndroidDatePickerField ? (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={openDatePicker}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar fecha"
          style={[
            styles.fieldRow,
            isFocused && styles.fieldRowFocused,
            errorMessage && styles.fieldRowError,
            !editable && styles.fieldRowDisabled,
            !editable && styles.disabledOverlay,
          ]}
        >
          {iconName ? (
            <Feather
              name={iconName}
              size={theme.typography.size.xl}
              color={theme.colors.textMuted}
            />
          ) : null}

          <TextInput
            ref={inputRef}
            value={normalizedValue}
            editable={false}
            pointerEvents="none"
            style={[styles.input, inputStyle, style]}
            placeholderTextColor={theme.colors.textMuted}
            {...inputProps}
          />

          {trailingElement}
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.fieldRow,
            isFocused && styles.fieldRowFocused,
            errorMessage && styles.fieldRowError,
            !editable && styles.fieldRowDisabled,
            !editable && styles.disabledOverlay,
          ]}
        >
          {iconName ? (
            <Feather
              name={iconName}
              size={theme.typography.size.xl}
              color={theme.colors.textMuted}
            />
          ) : null}

          <TextInput
            ref={inputRef}
            value={normalizedValue}
            onChangeText={handleChangeText}
            onBlur={() => {
              setIsFocused(false);
              onBlur();
            }}
            onFocus={() => setIsFocused(true)}
            editable={editable}
            secureTextEntry={shouldSecure}
            style={[styles.input, inputStyle, style]}
            placeholderTextColor={theme.colors.textMuted}
            {...inputProps}
          />

          {trailingElement}
        </View>
      )}

      {errorMessage ? (
        <View style={styles.errorRow}>
          <Feather
            name="alert-circle"
            size={theme.typography.size.sm}
            color={theme.colors.error}
          />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}
