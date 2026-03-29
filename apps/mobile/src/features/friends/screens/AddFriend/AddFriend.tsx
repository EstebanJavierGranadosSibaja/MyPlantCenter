import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { socialService } from 'src/features/friends/services/friends.service';
import { useAddFriendTheme } from './AddFriend.styles';

export const AddFriend: React.FC = () => {
  const { styles } = useAddFriendTheme();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    if (!user?.id) {
      return;
    }

    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      showToast({
        type: 'warning',
        title: 'Ingresa un código válido',
      });
      return;
    }

    setSending(true);
    try {
      await socialService.sendFriendRequest(user.id, normalized);
      showToast({
        type: 'success',
        title: 'Solicitud enviada',
      });
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

  return (
    <CustomSafeArea keyboardAvoiding>
      <View style={styles.root}>
        <AppHeader title="Agregar amigo" subtitle="POR CÓDIGO" showBack />

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Enviar solicitud</Text>
            <Text style={styles.subtitle}>Ingresa el código de amistad de la otra persona</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="EJ: 1SZ2LO"
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={onSend} disabled={sending} activeOpacity={0.85}>
              <Text style={styles.buttonText}>{sending ? 'Enviando...' : 'Enviar solicitud'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};
