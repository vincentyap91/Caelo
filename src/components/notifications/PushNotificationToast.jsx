import React from 'react';
import {
    AlertTriangle,
    ArrowDownToLine,
    ArrowUpFromLine,
    CheckCircle2,
    Info,
    Loader2,
    LogIn,
    LogOut,
    ShieldAlert,
    UserPlus,
    X,
    XCircle,
} from 'lucide-react';
import { PUSH_VARIANT } from '../../constants/pushNotificationCopy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const DURATION_MS_DEFAULT = 5200;
const DURATION_MS_AUTH = 4200;

const variantStyles = {
    [PUSH_VARIANT.success]: {
        iconWrap:
            'bg-[rgb(236_253_245)] text-[var(--color-success-main)] shadow-[0_10px_24px_rgba(57,181,74,0.14)]',
        iconRing: 'ring-1 ring-[rgb(57_181_74_/_0.12)]',
        accent: 'bg-[var(--color-success-main)]',
        accentSoft: 'bg-[rgb(57_181_74_/_0.1)]',
        accentText: 'text-[var(--color-success-main)]',
    },
    [PUSH_VARIANT.error]: {
        iconWrap:
            'bg-[rgb(255_241_237)] text-[var(--color-danger-main)] shadow-[0_10px_24px_rgba(255,91,46,0.14)]',
        iconRing: 'ring-1 ring-[rgb(255_91_46_/_0.14)]',
        accent: 'bg-[var(--color-danger-main)]',
        accentSoft: 'bg-[rgb(255_91_46_/_0.1)]',
        accentText: 'text-[var(--color-danger-main)]',
    },
    [PUSH_VARIANT.warning]: {
        iconWrap:
            'bg-[rgb(255_247_237)] text-[var(--color-hot-main)] shadow-[0_10px_24px_rgba(255,77,0,0.12)]',
        iconRing: 'ring-1 ring-[rgb(255_77_0_/_0.14)]',
        accent: 'bg-[var(--color-hot-main)]',
        accentSoft: 'bg-[rgb(255_77_0_/_0.1)]',
        accentText: 'text-[var(--color-hot-main)]',
    },
    [PUSH_VARIANT.info]: {
        iconWrap:
            'bg-[var(--color-accent-50)] text-[var(--color-accent-600)] shadow-[var(--shadow-accent)]',
        iconRing: 'ring-1 ring-[rgb(59_130_246_/_0.14)]',
        accent: 'bg-[var(--color-accent-500)]',
        accentSoft: 'bg-[rgb(59_130_246_/_0.1)]',
        accentText: 'text-[var(--color-accent-700)]',
    },
};

function pickIcon({ variant, category, showPending, eventId }) {
    if (showPending) return Loader2;
    if (eventId?.includes('deposit')) return ArrowDownToLine;
    if (eventId?.includes('withdrawal')) return ArrowUpFromLine;
    if (eventId?.includes('login')) return LogIn;
    if (eventId === 'logout') return LogOut;
    if (eventId?.includes('register')) return UserPlus;
    if (eventId === 'session_timeout' || eventId === 'auto_logout') return ShieldAlert;
    if (variant === PUSH_VARIANT.success) return CheckCircle2;
    if (variant === PUSH_VARIANT.error) return XCircle;
    if (variant === PUSH_VARIANT.warning) return AlertTriangle;
    if (category === 'transaction') return Info;
    return Info;
}

function renderIcon({ icon, fallbackIcon: FallbackIcon, showPending, reducedMotion }) {
    if (showPending) {
        return (
            <Loader2
                size={22}
                strokeWidth={2.25}
                className={reducedMotion ? undefined : 'animate-spin'}
                aria-hidden
            />
        );
    }

    if (icon) {
        if (React.isValidElement(icon)) return icon;
        return React.createElement(icon, { size: 22, strokeWidth: 2.25, 'aria-hidden': true });
    }

    return <FallbackIcon size={22} strokeWidth={2.25} aria-hidden />;
}

/**
 * Shared toast shell for auth, transaction, and system notifications.
 */
export function PushNotificationToast({
    variant = PUSH_VARIANT.info,
    stateType,
    category = 'auth',
    icon,
    title,
    message,
    eventId = '',
    showPending = false,
    statusLabel,
    durationMs = DURATION_MS_DEFAULT,
    onDismiss,
}) {
    const reducedMotion = usePrefersReducedMotion();
    const [timeLeftMs, setTimeLeftMs] = React.useState(durationMs);
    const resolvedVariant = stateType ?? variant;
    const vs = variantStyles[resolvedVariant] ?? variantStyles[PUSH_VARIANT.info];
    const Icon = pickIcon({ variant: resolvedVariant, category, showPending, eventId });
    const isAssertive = resolvedVariant === PUSH_VARIANT.error || resolvedVariant === PUSH_VARIANT.warning;
    const progress = durationMs > 0 ? Math.max(0, Math.min(1, timeLeftMs / durationMs)) : 0;

    React.useEffect(() => {
        setTimeLeftMs(durationMs);
        const startedAt = Date.now();
        const intervalId = window.setInterval(() => {
            const next = Math.max(0, durationMs - (Date.now() - startedAt));
            setTimeLeftMs(next);
            if (next <= 0) {
                window.clearInterval(intervalId);
            }
        }, 100);

        return () => window.clearInterval(intervalId);
    }, [durationMs]);

    return (
        <div
            role={isAssertive ? 'alert' : 'status'}
            aria-live={isAssertive ? 'assertive' : 'polite'}
            className={`push-notification-toast-enter relative pointer-events-auto w-full overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-default)] bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--gradient-soft-panel-end)_100%)] shadow-[var(--shadow-card-raised)] ring-1 ring-white/70`}
            style={
                reducedMotion
                    ? { animation: 'none', '--push-toast-duration': `${durationMs}ms` }
                    : { '--push-toast-duration': `${durationMs}ms` }
            }
        >
            <div
                aria-hidden
                className={`absolute bottom-3 left-3 top-3 w-1 rounded-full ${vs.accent}`}
            />
            <div
                aria-hidden
                className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_46%)] opacity-80`}
            />
            <div className="relative flex items-start gap-3 py-3.5 pl-7 pr-3 sm:gap-4 sm:py-4 sm:pl-8 sm:pr-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${vs.iconWrap} ${vs.iconRing}`}>
                    {renderIcon({ icon, fallbackIcon: Icon, showPending, reducedMotion })}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-2">
                        <p className="text-base font-bold leading-tight text-[var(--color-text-strong)] sm:text-base">
                            {title}
                        </p>
                        {statusLabel ? (
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                                    showPending
                                        ? 'bg-[var(--color-accent-100)] text-[var(--color-accent-700)]'
                                        : `${vs.accentSoft} ${vs.accentText}`
                                }`}
                            >
                                {showPending ? (
                                    <Loader2
                                        size={12}
                                        className={reducedMotion ? undefined : 'animate-spin'}
                                        aria-hidden
                                    />
                                ) : null}
                                {statusLabel}
                            </span>
                        ) : null}
                    </div>
                    <p className="mt-1.5 max-w-[34ch] text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
                        {message}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 -mr-1 -mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-soft)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-300)] focus-visible:ring-offset-2"
                    aria-label="Dismiss notification"
                >
                    <X size={18} strokeWidth={2.4} />
                </button>
            </div>
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1.5 overflow-hidden bg-[var(--color-surface-muted)]"
            >
                <div
                    className={`h-full transition-[width] duration-100 ease-linear ${vs.accent}`}
                    style={{
                        width: `${progress * 100}%`,
                        transition: reducedMotion ? 'none' : undefined,
                    }}
                />
            </div>
            <style>
                {`
                  @keyframes push-notification-enter {
                    from { transform: translate3d(0, 10px, 0) scale(0.98); opacity: 0; }
                    to { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
                  }
                  .push-notification-toast-enter {
                    animation: push-notification-enter 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .push-notification-toast-enter {
                      animation: none;
                    }
                  }
                `}
            </style>
        </div>
    );
}

export const PUSH_TOAST_DURATION_DEFAULT_MS = DURATION_MS_DEFAULT;
export const PUSH_TOAST_DURATION_AUTH_MS = DURATION_MS_AUTH;
export const ACTION_NOTIFICATION_DURATION_MS = DURATION_MS_DEFAULT;


