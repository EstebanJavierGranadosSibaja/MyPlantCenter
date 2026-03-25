import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useConfirmActionModalTheme } from './ConfirmActionModal.styles';

interface ConfirmActionModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
    visible,
    title,
    message,
    confirmText = 'Si',
    cancelText = 'No',
    destructive = false,
    onConfirm,
    onCancel,
}) => {
    const { styles } = useConfirmActionModalTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={onCancel}>
                <Pressable style={styles.card} onPress={() => undefined}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel={cancelText}
                        >
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                destructive ? styles.destructiveButton : styles.confirmButton,
                            ]}
                            onPress={onConfirm}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel={confirmText}
                        >
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
