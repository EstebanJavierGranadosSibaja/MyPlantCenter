import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Toaster, toast } from 'sonner-native';
import { useFormToastTheme } from './FormToast.styles';

export interface ToastConfig {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  subtitle?: string;
  autoDismiss?: boolean;
  duration?: number;
}

function resolveToastDuration(config: ToastConfig): number {
  const fallbackDuration = config.type === 'warning' ? 4000 : 3000;
  const resolved = config.duration ?? fallbackDuration;
  const shouldAutoDismiss = config.autoDismiss ?? config.type !== 'error';

  return shouldAutoDismiss ? resolved : Number.POSITIVE_INFINITY;
}

export function showToast(config: ToastConfig): void {
  const options = {
    description: config.subtitle,
    duration: resolveToastDuration(config),
  };

  if (config.type === 'success') {
    toast.success(config.title, options);
    return;
  }

  if (config.type === 'info') {
    toast(config.title, options);
    return;
  }

  if (config.type === 'warning') {
    toast.warning(config.title, options);
    return;
  }

  toast.error(config.title, options);
}

export function FormToastProvider(): React.ReactElement {
  const { theme, styles } = useFormToastTheme();

  return (
    <Toaster
      position="top-center"
      visibleToasts={1}
      closeButton
      swipeToDismissDirection="up"
      positionerStyle={styles.container}
      toastOptions={{
        style: styles.card,
        titleStyle: styles.title,
        descriptionStyle: styles.subtitle,
        closeButtonStyle: styles.closeButton,
        success: styles.cardSuccess,
        warning: styles.cardWarning,
        error: styles.cardError,
      }}
      icons={{
        success: (
          <Feather
            name="check-circle"
            size={theme.typography.size['2xl']}
            color={theme.colors.success}
          />
        ),
        warning: (
          <Feather
            name="alert-triangle"
            size={theme.typography.size['2xl']}
            color={theme.colors.warning}
          />
        ),
        error: (
          <Feather
            name="x-circle"
            size={theme.typography.size['2xl']}
            color={theme.colors.error}
          />
        ),
      }}
    />
  );
}
