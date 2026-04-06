import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    PushNotificationToast,
    PUSH_TOAST_DURATION_AUTH_MS,
    PUSH_TOAST_DURATION_DEFAULT_MS,
} from '../components/notifications/PushNotificationToast';
import { PUSH_EVENT, resolvePushNotification } from '../constants/pushNotificationCopy';
import { isPushNotificationsEnabled } from '../utils/notificationPreferences';
import { tryNativePush } from '../utils/browserNativeNotification';
import { recordPushNotificationEntry } from '../utils/recentNotifications';

const noop = () => {};

/** Max concurrently visible toasts (non-exiting); extras dismiss oldest with exit animation. */
const MAX_VISIBLE_TOASTS = 4;

const ActionNotificationsContext = createContext({
    showPushNotification: noop,
    dismissPushNotification: noop,
    showTransactionNotification: noop,
});

const E2E_TOAST_API_FLAG = 'e2e_toast_api';

function clearToastTimer(timeoutRefs, id) {
    const t = timeoutRefs.current.get(id);
    if (t != null) {
        window.clearTimeout(t);
        timeoutRefs.current.delete(id);
    }
}

/**
 * In-app toasts + optional native Notification when tab hidden. Respects “Allow Push Notifications”.
 * Supports stacked toasts with enter/exit CSS animations (no abrupt unmount).
 */
export function ActionNotificationsProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timeoutRefs = useRef(new Map());

    const removeToast = useCallback((id) => {
        clearToastTimer(timeoutRefs, id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const beginExit = useCallback((id) => {
        clearToastTimer(timeoutRefs, id);
        setToasts((prev) => {
            if (!prev.some((t) => t.id === id && !t.exiting)) return prev;
            return prev.map((t) => (t.id === id ? { ...t, exiting: true, timerPaused: false } : t));
        });
    }, []);

    const pauseToastTimer = useCallback((id) => {
        setToasts((prev) => {
            const t = prev.find((x) => x.id === id);
            if (!t || t.exiting || t.timerPaused) return prev;
            clearToastTimer(timeoutRefs, id);
            const pauseRemainderMs = Math.max(0, t.dismissAt - Date.now());
            return prev.map((x) => (x.id === id ? { ...x, timerPaused: true, pauseRemainderMs } : x));
        });
    }, []);

    const resumeToastTimer = useCallback((id) => {
        setToasts((prev) => {
            const t = prev.find((x) => x.id === id);
            if (!t || t.exiting || !t.timerPaused) return prev;
            const rem = Math.max(0, t.pauseRemainderMs ?? 0);
            const dismissAt = Date.now() + rem;
            return prev.map((x) =>
                x.id === id ? { ...x, timerPaused: false, pauseRemainderMs: undefined, dismissAt } : x
            );
        });
    }, []);

    const dismissPushNotification = useCallback(() => {
        timeoutRefs.current.forEach((t) => window.clearTimeout(t));
        timeoutRefs.current.clear();
        setToasts((prev) => (prev.length === 0 ? prev : prev.map((t) => ({ ...t, exiting: true }))));
    }, []);

    useEffect(
        () => () => {
            timeoutRefs.current.forEach((t) => window.clearTimeout(t));
            timeoutRefs.current.clear();
        },
        []
    );

    /** Keep one setTimeout per toast in sync with dismissAt / pause (resume must not rely on post-setState sync reads). */
    useEffect(() => {
        const activeIds = new Set(toasts.map((t) => t.id));
        timeoutRefs.current.forEach((tid, id) => {
            if (!activeIds.has(id)) {
                window.clearTimeout(tid);
                timeoutRefs.current.delete(id);
            }
        });

        toasts.forEach((t) => {
            if (t.exiting || t.timerPaused) {
                clearToastTimer(timeoutRefs, t.id);
                return;
            }
            const rem = t.dismissAt - Date.now();
            clearToastTimer(timeoutRefs, t.id);
            if (rem <= 0) {
                window.queueMicrotask(() => beginExit(t.id));
                return;
            }
            const timeoutId = window.setTimeout(() => beginExit(t.id), rem);
            timeoutRefs.current.set(t.id, timeoutId);
        });
    }, [toasts, beginExit]);

    const showPushNotification = useCallback(
        (raw) => {
            const event = typeof raw === 'string' ? raw : raw?.event;
            if (!event) return;

            const vars = typeof raw === 'object' && raw !== null ? raw : {};
            const { title, message, variant, category } = resolvePushNotification(event, vars);

            let durationMs =
                category === 'auth' || category === 'security'
                    ? PUSH_TOAST_DURATION_AUTH_MS
                    : PUSH_TOAST_DURATION_DEFAULT_MS;

            if (
                typeof sessionStorage !== 'undefined' &&
                sessionStorage.getItem(E2E_TOAST_API_FLAG) === '1' &&
                typeof vars.__testDurationMs === 'number' &&
                vars.__testDurationMs > 0
            ) {
                durationMs = vars.__testDurationMs;
            }

            const showPending = Boolean(vars.pending);
            const statusLabel = vars.statusLabel ?? (showPending ? 'Pending' : undefined);

            const recordRecent =
                event.startsWith('deposit') ||
                event.startsWith('withdrawal') ||
                event === PUSH_EVENT.SESSION_TIMEOUT ||
                event === PUSH_EVENT.AUTO_LOGOUT;

            if (recordRecent) {
                recordPushNotificationEntry({
                    title,
                    message,
                    status: showPending ? 'ongoing' : variant,
                    kind: event.includes('deposit') ? 'deposit' : event.includes('withdrawal') ? 'withdrawal' : 'push',
                });
            }

            if (!isPushNotificationsEnabled()) return;

            tryNativePush({ title, body: message });

            const id = `${Date.now()}-${event}-${Math.random().toString(36).slice(2, 9)}`;
            const dismissAt = Date.now() + durationMs;
            const item = {
                id,
                event,
                title,
                message,
                variant,
                category,
                showPending,
                statusLabel,
                durationMs,
                exiting: false,
                timerPaused: false,
                pauseRemainderMs: undefined,
                dismissAt,
            };

            setToasts((prev) => {
                const next = [item, ...prev];
                const active = next.filter((t) => !t.exiting);
                if (active.length > MAX_VISIBLE_TOASTS) {
                    const oldest = active[active.length - 1];
                    if (oldest && oldest.id !== id) {
                        window.queueMicrotask(() => beginExit(oldest.id));
                    }
                }
                return next;
            });
        },
        [beginExit]
    );

    /** Back-compat: deposit / withdrawal modal submitted (maps to pending). Pass `amount` when known. */
    const showTransactionNotification = useCallback(
        ({ kind, amount }) => {
            if (!kind || (kind !== 'deposit' && kind !== 'withdrawal')) return;
            const event = kind === 'deposit' ? PUSH_EVENT.DEPOSIT_PENDING : PUSH_EVENT.WITHDRAWAL_PENDING;
            showPushNotification({ event, pending: true, amount });
        },
        [showPushNotification]
    );

    /** Dev + Playwright: sessionStorage `e2e_toast_api=1` before load exposes controls. */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const allow = import.meta.env.DEV || sessionStorage.getItem(E2E_TOAST_API_FLAG) === '1';
        if (!allow) return;
        window.__riocityActionNotifications = {
            showPushNotification,
            dismissPushNotification,
        };
        return () => {
            delete window.__riocityActionNotifications;
        };
    }, [showPushNotification, dismissPushNotification]);

    return (
        <ActionNotificationsContext.Provider
            value={{ showPushNotification, dismissPushNotification, showTransactionNotification }}
        >
            {children}
            {toasts.length > 0 ? (
                <div className="pointer-events-none fixed left-4 right-4 top-[calc(113px+8px)] z-[320] flex flex-col gap-3 sm:left-auto sm:right-4 sm:w-[min(100vw-2rem,20rem)]">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto w-full">
                            <PushNotificationToast
                                eventId={t.event}
                                variant={t.variant}
                                category={t.category}
                                title={t.title}
                                message={t.message}
                                showPending={t.showPending}
                                statusLabel={t.statusLabel}
                                durationMs={t.durationMs}
                                dismissAt={t.dismissAt}
                                timerPaused={t.timerPaused}
                                pauseRemainderMs={t.pauseRemainderMs}
                                exiting={t.exiting}
                                onDismiss={() => beginExit(t.id)}
                                onExitComplete={() => removeToast(t.id)}
                                onTimerPause={() => pauseToastTimer(t.id)}
                                onTimerResume={() => resumeToastTimer(t.id)}
                            />
                        </div>
                    ))}
                </div>
            ) : null}
        </ActionNotificationsContext.Provider>
    );
}

export function useActionNotifications() {
    return useContext(ActionNotificationsContext);
}
