import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useCustomSafeAreaTheme } from './CustomSafeArea.styles';

interface CustomSafeAreaProps {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  scrollBottomInset?: number;
}

export const CustomSafeArea: React.FC<CustomSafeAreaProps> = ({
  children,
  scroll = false,
  edges = ['top', 'bottom', 'left', 'right'],
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
  scrollBottomInset = 0,
}) => {
  const { styles } = useCustomSafeAreaTheme();

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        scrollBottomInset > 0 ? { paddingBottom: scrollBottomInset } : null,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
    >
      {children}
    </ScrollView>
  ) : children;

  const wrappedBody = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {body}
    </KeyboardAvoidingView>
  ) : body;

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      {wrappedBody}
    </SafeAreaView>
  );
};
