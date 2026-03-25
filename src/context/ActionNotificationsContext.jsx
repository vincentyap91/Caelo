import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActionNotificationToast, ACTION_NOTIFICATION_DURATION_MS } from '../components/notifications/ActionNotificationToast';
import { isPushNotificationsEnabled } from '../utils/notificationPreferences';
import { recordTransactionNotification, TRANSACTION_NOTIFICATION_COPY } from '../utils/recentNotifications';

const noop = () => {};

const ActionNotificationsContext = createContext({
    showTransactionNotification: noop,
    dismissTransactionNotification: noop,
});

export function ActionNotificationsProvider({ children }) {
    const [payload, setPayload] = useState(null);
    const timeoutRef = useRef(undefined);

    const dismiss = useCallback(() => {
        if (timeoutRef.current != null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
        setPayload(null);
    }, []);

    useEffect(
        () => () => {
            if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
        },
        []
    );

    const showTransactionNotification = useCallback(
        ({ kind }) => {
            if (!kind || (kind !== 'deposit' && kind !== 'withdrawal')) return;

            recordTransactionNotification({ kind });

            if (!isPushNotificationsEnabled()) return;

            if (timeoutRef.current != null) {
                window.clearTimeout(timeoutRef.current);
            }

            setPayload({
                id: `${Date.now()}-${kind}`,
                kind,
                message: TRANSACTION_NOTIFICATION_COPY[kind].message,
            });

            timeoutRef.current = window.setTimeout(() => {
                setPayload(null);
                timeoutRef.current = undefined;
            }, ACTION_NOTIFICATION_DURATION_MS);
        },
        []
    );

    return (
        <ActionNotificationsContext.Provider value={{ showTransactionNotification, dismissTransactionNotification: dismiss }}>
            {children}
            {payload ? (
                <div
                    className="pointer-events-none fixed right-4 top-[calc(113px+10px)] z-[320] md:top-[calc(92px+10px)]"
                    aria-hidden={false}
                >
                    <ActionNotificationToast
                        key={payload.id}
                        kind={payload.kind}
                        statusLabel="Ongoing"
                        message={payload.message}
                        onDismiss={dismiss}
                    />
                </div>
            ) : null}
        </ActionNotificationsContext.Provider>
    );
}

export function useActionNotifications() {
    return useContext(ActionNotificationsContext);
}
