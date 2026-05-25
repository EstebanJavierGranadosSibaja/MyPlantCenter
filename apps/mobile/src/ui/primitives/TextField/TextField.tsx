import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useUITheme } from '../../theme/UIThemeContext';
import { UITheme } from '../../tokens';

// ─────────────────────────────────────────────────────────────────────────────

export interface TextFieldProps<T extends FieldValues>
  extends Omit<TextInputProps,
    | 'value'
    | 'onChangeText'
    | 'onBlur'
    | 'onFocus'
    | 'blurOnSubmit'
  > {
  // React Hook Form binding
  control: Control<T>;
  name:    FieldPath<T>;

  // Visual
  label?:     string;
  hint?:      string;
  isRequired?: boolean;
  isPassword?: boolean;
  leftIcon?:   React.ComponentProps<typeof Feather>['name'];
  rightSlot?:  React.ReactNode;

  // Focus chain — ref to the next field's TextInput
  nextRef?: React.RefObject<TextInput | null>;

  // Forwarded ref to this field's TextInput
  inputRef?: React.Ref<TextInput>;

  // Style overrides
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?:     StyleProp<TextStyle>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Style factory — executed once per theme, memoized.

interface FieldStyles {
  wrapper:          ViewStyle;
  label:            TextStyle;
  labelRequired:    TextStyle;
  row:              ViewStyle;
  rowFocused:       ViewStyle;
  rowError:         ViewStyle;
  rowDisabled:      ViewStyle;
  input:            TextStyle;
  hint:             TextStyle;
  errorRow:         ViewStyle;
  errorText:        TextStyle;
  iconColor:        string;
  placeholderColor: string;
}

const makeFieldStyles = (theme: UITheme): FieldStyles => ({
  wrapper: {
    width: '100%',
    gap: theme.spacing.xs,
  },

  label: {
    ...theme.text.label,
    color: theme.colors.textSecondary,
  },

  labelRequired: {
    color: theme.colors.error,
  },

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

  rowFocused: {
    borderColor: theme.colors.borderStrong,
    // Subtle accent ring via shadow — no color change on the border itself
    // to keep the design quiet. Shadow communicates focus, not a green border.
    shadowColor:   theme.colors.accent,
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius:  6,
    elevation:     2,
  },

  rowError: {
    borderColor: theme.colors.error,
  },

  rowDisabled: {
    backgroundColor: theme.colors.bgSubtle,
    opacity: 0.55,
  },

  input: {
    ...theme.text.body,
    flex: 1,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
    // Prevent Android from adding its own padding
    includeFontPadding: false,
  },

  hint: {
    ...theme.text.caption,
    color: theme.colors.textTertiary,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  errorText: {
    ...theme.text.caption,
    color: theme.colors.error,
    flex: 1,
  },

  iconColor:        theme.colors.textTertiary,
  placeholderColor: theme.colors.textTertiary,
});

// ─────────────────────────────────────────────────────────────────────────────

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  isRequired  = false,
  isPassword  = false,
  leftIcon,
  rightSlot,
  nextRef,
  inputRef,
  containerStyle,
  inputStyle,
  editable     = true,
  returnKeyType,
  onSubmitEditing,
  ...rest
}: TextFieldProps<T>) {
  const theme = useUITheme();

  // Styles memoized — recompute only when theme changes.
  const s = useMemo(() => makeFieldStyles(theme), [theme]);

  // Focus state — drives the focused ring style.
  const [isFocused, setIsFocused] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Timestamp of last focus — used by the spurious-IME guard below.
  const focusedAtRef = useRef(0);

  // Whether the user (or autofill) changed the value since the last focus.
  // A spurious IME action fires before any real interaction — this flag
  // distinguishes "keyboard mounted and fired ACTION_NEXT immediately" from
  // "user intentionally pressed Next after typing or reviewing the field".
  const hasInteractedRef = useRef(false);

  // React Hook Form
  const {
    field:      { value, onChange, onBlur: rhfOnBlur },
    fieldState: { error },
  } = useController({ control, name });

  // ── Value normalization ────────────────────────────────────────────────────

  const normalizedValue =
    typeof value === 'number' ? String(value) :
    typeof value === 'string' ? value :
    '';

  // ── Focus management ───────────────────────────────────────────────────────

  const handleFocus = useCallback(() => {
    focusedAtRef.current = Date.now();
    hasInteractedRef.current = false;
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    rhfOnBlur();
  }, [rhfOnBlur]);

  const handleChange = useCallback((text: string) => {
    hasInteractedRef.current = true;
    onChange(text);
  }, [onChange]);

  // ── blurOnSubmit — auto-false when returnKeyType="next" ───────────────────
  //
  // With blurOnSubmit=true (default), Android blurs the field BEFORE
  // onSubmitEditing fires in JS. This lets Android's focus system compete
  // with programmatic ref.focus() — causing the focus-jumping bug.
  //
  // With blurOnSubmit=false + direct nextRef.focus() below, the sequence is:
  //   1. User presses NEXT
  //   2. onSubmitEditing fires in JS (field is still focused)
  //   3. nextRef.focus() fires — focus moves to next field atomically
  //   4. Current field blurs as a consequence (triggered by next gaining focus)
  // No race condition possible.

  const effectiveBlurOnSubmit =
    returnKeyType === 'next' ? false : undefined;

  // ── onSubmitEditing — spurious IME guard + focus chain ────────────────────
  //
  // Guard: some non-Samsung IMEs fire IME_ACTION_NEXT spuriously within
  // milliseconds of focus even with blurOnSubmit=false. Block callbacks
  // arriving within 100ms of focus as a secondary defense.
  //
  // Focus chain: if nextRef is provided and returnKeyType="next", move focus
  // directly without setTimeout. This is safe because blurOnSubmit=false
  // guarantees the current field is still mounted and focused at this point.

  const handleSubmitEditing = useCallback<
    NonNullable<TextInputProps['onSubmitEditing']>
  >((e) => {
    // Two-layer guard against spurious IME_ACTION_NEXT:
    // 1. Time: some IMEs fire within ms of focus — block anything under 300ms.
    // 2. Interaction: if the user (or autofill) never changed the value in this
    //    focus session, the action is almost certainly spurious — block it.
    if (Date.now() - focusedAtRef.current < 300) return;
    if (!hasInteractedRef.current) return;
    if (returnKeyType === 'next' && nextRef?.current) {
      nextRef.current.focus();
      return;
    }
    onSubmitEditing?.(e);
  }, [returnKeyType, nextRef, onSubmitEditing]);

  // ── Trailing element ───────────────────────────────────────────────────────

  const trailingElement = rightSlot ?? (
    isPassword ? (
      <TouchableOpacity
        onPress={() => setShowPassword(v => !v)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <Feather
          name={showPassword ? 'eye-off' : 'eye'}
          size={theme.layout.iconMd}
          color={s.iconColor}
        />
      </TouchableOpacity>
    ) : null
  );

  // ── Row style — memoized to prevent new object on every focus ─────────────

  const rowStyle = useMemo<ViewStyle>(() => ({
    ...s.row,
    ...(isFocused && !error  ? s.rowFocused  : null),
    ...(error                ? s.rowError    : null),
    ...(!editable            ? s.rowDisabled : null),
  }), [s, isFocused, error, editable]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[s.wrapper, containerStyle]}>

      {label ? (
        <Text style={s.label}>
          {label}
          {isRequired
            ? <Text style={s.labelRequired}> *</Text>
            : null}
        </Text>
      ) : null}

      <View style={rowStyle}>
        {leftIcon ? (
          <Feather
            name={leftIcon}
            size={theme.layout.iconMd}
            color={s.iconColor}
          />
        ) : null}

        <TextInput
          ref={inputRef}
          value={normalizedValue}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={s.placeholderColor}
          returnKeyType={returnKeyType}
          blurOnSubmit={effectiveBlurOnSubmit}
          onSubmitEditing={handleSubmitEditing}
          style={[s.input, inputStyle]}
          // Android: prevent included font padding from misaligning text
          textAlignVertical="center"
          // Android: let the system handle autofill; focus chain is controlled
          // by blurOnSubmit=false + direct focus, not by Samsung's autofill chain
          importantForAutofill={Platform.OS === 'android' ? 'yes' : undefined}
          {...rest}
        />

        {trailingElement}
      </View>

      {error ? (
        <View style={s.errorRow}>
          <Feather
            name="alert-circle"
            size={theme.layout.iconSm}
            color={theme.colors.error}
          />
          <Text style={s.errorText} numberOfLines={2}>
            {error.message as string}
          </Text>
        </View>
      ) : hint ? (
        <Text style={s.hint}>{hint}</Text>
      ) : null}

    </View>
  );
}
