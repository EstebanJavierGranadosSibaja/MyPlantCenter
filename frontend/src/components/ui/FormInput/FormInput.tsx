import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { FeatherIconName } from 'src/types-dtos/user.types';
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
  const errorMessage = (fieldState.error?.message as string | undefined) ?? fieldErrorText;

  const trailingElement = rightElement ?? (
    isPassword ? (
      <TouchableOpacity
        onPress={() => setShowPassword(prev => !prev)}
        accessibilityRole="button"
        accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <Feather
          name={showPassword ? 'eye-off' : 'eye'}
          size={theme.typography.size['2xl']}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>
    ) : null
  );

  const normalizedValue =
    typeof value === 'number' ? String(value) : ((value ?? '') as string);

  const handleChangeText = (text: string) => {
    const isNumericKeyboard =
      inputProps.keyboardType === 'numeric' ||
      inputProps.keyboardType === 'number-pad' ||
      inputProps.keyboardType === 'decimal-pad';

    if (isNumericKeyboard) {
      const sanitized = text.replace(/[^\d]/g, '');
      onChange(sanitized === '' ? undefined : Number(sanitized));
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
            size={theme.typography.size['2xl']}
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
