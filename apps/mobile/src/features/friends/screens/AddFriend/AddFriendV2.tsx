import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { socialService } from 'src/features/friends/services/friends.service';
import { Button, KeyboardScreen, Surface, Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

export function AddFriendV2() {
  const theme = useUITheme();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    if (!user?.id) return;

    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      showToast({ type: 'warning', title: 'Ingresa un código válido' });
      return;
    }

    setSending(true);
    try {
      await socialService.sendFriendRequest(user.id, normalized);
      showToast({ type: 'success', title: 'Solicitud enviada' });
      setCode('');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'No se pudo enviar la solicitud',
        subtitle: error instanceof Error ? error.message : undefined,
        autoDismiss: false,
      });
    } finally {
      setSending(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardScreen contentStyle={styles.content}>

      {/* Nav bar */}
      <View style={styles.navBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Feather name="arrow-left" size={theme.layout.iconMd} color={theme.colors.textPrimary} />
        </Pressable>
        <Text variant="h2">Agregar amigo</Text>
      </View>

      {/* Form card */}
      <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>
        <Text variant="title">Enviar solicitud</Text>
        <Text variant="bodyMd" color="textSecondary">
          Ingresa el código de amistad de la otra persona
        </Text>

        {/* Code input — uncontrolled, no RHF needed for single state field */}
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: theme.colors.surface,
              borderColor:     theme.colors.borderDefault,
            },
          ]}
        >
          <TextInput
            value={code}
            onChangeText={v => setCode(v.toUpperCase())}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="EJ: 1SZ2LO"
            placeholderTextColor={theme.colors.textTertiary}
            returnKeyType="send"
            onSubmitEditing={onSend}
            style={[styles.input, { color: theme.colors.textPrimary }]}
          />
        </View>

        <Button
          label="Enviar solicitud"
          onPress={onSend}
          loading={sending}
          disabled={sending}
          fullWidth
        />
      </Surface>

    </KeyboardScreen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 24,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  card: {
    padding: 20,
    gap: 16,
  },
  inputRow: {
    height: 52,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 3,
  },
});
