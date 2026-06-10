import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUITheme } from 'src/ui/theme/UIThemeContext';
import { Text } from 'src/ui';
import { ChatMessage } from '../types/chat.types';

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  showSender?: boolean;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  isOwn,
  showSender = true,
}: Props) {
  const theme = useUITheme();

  const bubbleBg = isOwn ? theme.colors.accent : theme.colors.surfaceElevated;
  const textColor = isOwn ? '#FFFFFF' : theme.colors.textPrimary;
  const metaColor = isOwn ? 'rgba(255,255,255,0.65)' : theme.colors.textSecondary;

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleBg,
            borderBottomRightRadius: isOwn ? 4 : 16,
            borderBottomLeftRadius: isOwn ? 16 : 4,
          },
        ]}
      >
        {showSender && !isOwn && (
          <Text
            variant="caption"
            style={[styles.senderName, { color: theme.colors.accentForeground }]}
          >
            {message.sender_nickname}
          </Text>
        )}
        <Text variant="body" style={{ color: textColor }}>
          {message.content}
        </Text>
        <View style={styles.meta}>
          <Text variant="caption" style={{ color: metaColor }}>
            {formatTime(message.timestamp)}
          </Text>
          {message.ttl && (
            <Text variant="caption" style={[styles.ttlBadge, { color: metaColor }]}>
              ⏱ {message.ttl}s
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  rowOwn: {
    alignItems: 'flex-end',
  },
  rowOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 2,
  },
  senderName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 2,
  },
  ttlBadge: {
    fontStyle: 'italic',
  },
});
