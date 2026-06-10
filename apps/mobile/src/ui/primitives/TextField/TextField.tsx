import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';
import {
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
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    rhfOnBlur();
  }, [rhfOnBlur]);

  const handleChange = useCallback((text: string) => {
    onChange(text);
  }, [onChange]);

  // ── Submit behavior — never emit IME_ACTION_NEXT ──────────────────────────
  //
  // Root cause of the focus-jumping bug: returnKeyType="next" sets Android's
  // IME_ACTION_NEXT. When that action fires, ANDROID ITSELF natively traverses
  // focus to the next focusable field (focusSearch) — no JS involved. Some
  // keyboards (Samsung/others) fire ACTION_NEXT spuriously the instant a field
  // gains focus, so focus cascades through every field in a loop. This is why
  // it reproduces on a real device but NEVER in the browser (the web has no IME
  // editor actions) and why it survived removing every JS .focus() call.
  //
  // Fix: map "next" to IME_ACTION_DONE. NOTE: "default" does NOT work — it maps
  // to IME_ACTION_UNSPECIFIED, and on a single-line field with a following
  // focusable field Android INFERS actionNext and traverses focus anyway. "done"
  // is an explicit terminal action the framework never traverses on.
  // submitBehavior="submit" keeps focus + keyboard open so a (possibly spurious)
  // Done press is an inert no-op instead of closing the keyboard — the user taps
  // the next field. Terminal fields keep their own action + run onSubmitEditing.
  const isNext = returnKeyType === 'next';
  const nativeReturnKeyType = isNext ? 'done' : returnKeyType;
  const submitBehavior = isNext ? ('submit' as const) : undefined;

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
          returnKeyType={nativeReturnKeyType}
          submitBehavior={submitBehavior}
          onSubmitEditing={onSubmitEditing}
          style={[s.input, inputStyle]}
          // Android: prevent included font padding from misaligning text
          textAlignVertical="center"
          {...rest}
          // ── Autofill DISABLED — root cause of the focus-jumping bug ──────────
          // There is NO .focus() call anywhere in the app, yet focus still
          // cascaded between fields. The mover was Android's Autofill framework:
          // with importantForAutofill="yes" + autofill hints on every field, the
          // service traversed/auto-filled fields on focus, moving focus natively
          // in a loop — infinite on plain-text fields, a single jump on password
          // fields (those gate on credential selection). Opting every field out
          // stops the native traversal. These come AFTER {...rest} so they
          // override any autoComplete/textContentType a screen passes.
          autoComplete="off"
          textContentType="none"
          importantForAutofill="no"
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
