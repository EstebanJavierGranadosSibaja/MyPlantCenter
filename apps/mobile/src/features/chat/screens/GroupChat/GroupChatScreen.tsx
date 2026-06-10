import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
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

type Nav = NativeStackNavigationProp<ChatStackParamList>;

export function GroupChatScreen() {
  const theme = useUITheme();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const {
    connected,
    chatUser,
    groupMessages,
    typingInGroup,
    sendGroupMessage,
    sendTypingGroup,
    sendStopTyping,
    markRead,
    onlineUsers,
  } = useChat();

  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (groupMessages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [groupMessages.length]);

  const handleSend = useCallback(
    (text: string) => {
      sendGroupMessage(text);
    },
    [sendGroupMessage],
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

  const onlineCount = onlineUsers.length;
  const typingNicknames = typingInGroup
    .filter(e => e.userId !== chatUser?.id)
    .map(e => e.nickname);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const isOwn = item.sender_id === chatUser?.id;
      const prevMsg = groupMessages[index - 1];
      const showSender = !prevMsg || prevMsg.sender_id !== item.sender_id;
      return <MessageBubble message={item} isOwn={isOwn} showSender={showSender} />;
    },
    [chatUser?.id, groupMessages],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
        <View style={styles.headerLeft}>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.accentSoft }]}>
            <Feather name="message-circle" size={18} color={theme.colors.accentForeground} />
          </View>
          <View>
            <Text variant="title">Chat grupal</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: connected ? theme.colors.accent : theme.colors.borderDefault },
                ]}
              />
              <Text variant="caption" color="textSecondary">
                {connected ? `${onlineCount} en línea` : 'Reconectando…'}
              </Text>
            </View>
          </View>
        </View>
        <Feather
          name="users"
          size={20}
          color={theme.colors.textSecondary}
          onPress={() => navigation.navigate('DMList')}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={groupMessages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        onViewableItemsChanged={handleViewableChange}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={40} color={theme.colors.borderDefault} />
            <Text variant="bodyMd" color="textSecondary" align="center" style={styles.emptyText}>
              Aún no hay mensajes.{'\n'}¡Sé el primero en escribir!
            </Text>
          </View>
        }
      />

      {/* Typing indicator */}
      {typingNicknames.length > 0 && (
        <View style={[styles.typingBar, { backgroundColor: theme.colors.bg }]}>
          <Text variant="caption" color="textSecondary">
            {typingNicknames.length === 1
              ? `${typingNicknames[0]} está escribiendo…`
              : `${typingNicknames.join(', ')} están escribiendo…`}
          </Text>
        </View>
      )}

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onTyping={sendTypingGroup}
        onStopTyping={sendStopTyping}
        disabled={!connected}
        placeholder={connected ? 'Escribe un mensaje…' : 'Conectando…'}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
  emptyText: {
    maxWidth: 220,
  },
  typingBar: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
});
