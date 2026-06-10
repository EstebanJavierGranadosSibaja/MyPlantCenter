import { Feather } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useUITheme } from 'src/ui/theme/UIThemeContext';

interface Props {
  onSend: (text: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** Extra bottom padding (e.g. safe-area inset) when no tab bar sits below. */
  bottomInset?: number;
}

export function MessageInput({
  onSend,
  onTyping,
  onStopTyping,
  placeholder = 'Escribe un mensaje…',
  disabled = false,
  bottomInset = 0,
}: Props) {
  const theme = useUITheme();
  const [text, setText] = useState('');
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (val: string) => {
      setText(val);
      onTyping?.();
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => onStopTyping?.(), 2000);
    },
    [onTyping, onStopTyping],
  );

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    if (typingTimer.current) clearTimeout(typingTimer.current);
    onStopTyping?.();
  }, [text, onSend, onStopTyping]);

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopColor: theme.colors.borderSubtle,
          paddingBottom: 10 + bottomInset,
        },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.bg,
            color: theme.colors.textPrimary,
            borderColor: theme.colors.borderDefault,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={text}
        onChangeText={handleChange}
        multiline
        maxLength={900}
        editable={!disabled}
        returnKeyType="default"
        blurOnSubmit={false}
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        style={({ pressed }) => [
          styles.sendBtn,
          {
            backgroundColor: canSend ? theme.colors.accent : theme.colors.borderDefault,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
        accessibilityLabel="Enviar mensaje"
      >
        <Feather name="send" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
    lineHeight: 22,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
});
