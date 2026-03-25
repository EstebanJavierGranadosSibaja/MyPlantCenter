import { useCallback, useState } from 'react';

interface ConfirmActionConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
}

export function useConfirmAction() {
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<ConfirmActionConfig>({
        title: '',
        message: '',
    });
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    const openConfirm = useCallback(
        (
            confirmConfig: ConfirmActionConfig,
            onConfirm: () => void | Promise<void>
        ) => {
            setConfig(confirmConfig);
            setOnConfirmCallback(() => onConfirm);
            setVisible(true);
        },
        []
    );

    const closeConfirm = useCallback(() => {
        setVisible(false);
        setOnConfirmCallback(null);
    }, []);

    const handleConfirm = useCallback(async () => {
        if (onConfirmCallback) {
            await onConfirmCallback();
        }
        closeConfirm();
    }, [onConfirmCallback, closeConfirm]);

    return {
        visible,
        config,
        openConfirm,
        closeConfirm,
        handleConfirm,
    };
}
