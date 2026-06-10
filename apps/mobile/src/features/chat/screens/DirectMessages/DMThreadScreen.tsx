import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'src/ui';
import { useUITheme } from 'src/ui/theme/UIThemeContext';
import { MessageBubble } from '../../components/MessageBubble';
import { MessageInput } from '../../components/MessageInput';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from '../../types/chat.types';
import { ChatStackParamList } from '../ChatNavigator';

type Props = NativeStackScreenProps<ChatStackParamList, 'DMThread'>;
type Nav = NativeStackNavigationProp<ChatStackParamList>;

export function DMThreadScreen() {
  const theme = useUITheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const insets = useSafeAreaInsets();
  const { userId, nickname } = route.params;

  const {
    chatUser,
    directMessages,
    onlineUsers,
    typingInDM,
    sendDM,
    sendTypingDM,
    sendStopTyping,
    markRead,
    connected,
  } = useChat();

  const messages = directMessages[userId] ?? [];
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const peerUser = onlineUsers.find(u => u.id === userId);
  const isTyping = Boolean(typingInDM[userId]);

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const handleSend = useCallback(
    (text: string) => {
      sendDM(userId, text);
    },
    [sendDM, userId],
  );

  const handleViewableChange = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: ChatMessage }> }) => {
      viewableItems.forEach(({ item }) => {
        if (item.sender_id !== chatUser?.id && item.allow_read_receipt) {
          markRead(item.id);
        }
      });
    },
    [chatUser?.id, markRead],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isOwn = item.sender_id === chatUser?.id;
      return <MessageBubble message={item} isOwn={isOwn} showSender={false} />;
    },
    [chatUser?.id],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.bg }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderBottomColor: theme.colors.borderSubtle,
            paddingTop: insets.top + 12,
          },
        ]}
      >
        <Feather
          name="arrow-left"
          size={22}
          color={theme.colors.textPrimary}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerCenter}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.accentMuted }]}>
            <Text variant="caption" style={{ color: theme.colors.accentForeground, fontWeight: '700' }}>
              {nickname.slice(0, 2).toUpperCase()}
            </Text>
            {peerUser?.is_online && (
              <View style={[styles.onlineDot, { backgroundColor: theme.colors.accent }]} />
            )}
          </View>
          <View>
            <Text variant="title">{nickname}</Text>
            <Text variant="caption" color="textSecondary">
              {peerUser?.is_online ? 'En línea' : 'Desconectado'}
            </Text>
          </View>
        </View>
        <View style={{ width: 22 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        onViewableItemsChanged={handleViewableChange}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={40} color={theme.colors.borderDefault} />
            <Text variant="bodyMd" color="textSecondary" align="center" style={{ maxWidth: 220 }}>
              Aún no hay mensajes.{'\n'}¡Envía el primero!
            </Text>
          </View>
        }
      />

      {/* Typing */}
      {isTyping && (
        <View style={[styles.typingBar, { backgroundColor: theme.colors.bg }]}>
          <Text variant="caption" color="textSecondary">
            {nickname} está escribiendo…
          </Text>
        </View>
      )}

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onTyping={() => sendTypingDM(userId)}
        onStopTyping={sendStopTyping}
        disabled={!connected}
        placeholder={connected ? `Mensaje a ${nickname}…` : 'Conectando…'}
        bottomInset={insets.bottom}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 80,
  },
  typingBar: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
});
