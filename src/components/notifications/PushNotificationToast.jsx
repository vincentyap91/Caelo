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

const DURATION_MS_DEFAULT = 4000;
const DURATION_MS_AUTH = 4000;

const EXIT_ANIMATION_NAME = 'push-notification-exit';

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
    dismissAt,
    timerPaused = false,
    pauseRemainderMs,
    exiting = false,
    onDismiss,
    onExitComplete,
    onTimerPause,
    onTimerResume,
}) {
    const reducedMotion = usePrefersReducedMotion();
    const [timeLeftMs, setTimeLeftMs] = React.useState(durationMs);
    const onExitCompleteRef = React.useRef(onExitComplete);
    onExitCompleteRef.current = onExitComplete;
    const resumeRafRef = React.useRef(0);

    const resolvedVariant = stateType ?? variant;
    const vs = variantStyles[resolvedVariant] ?? variantStyles[PUSH_VARIANT.info];
    const Icon = pickIcon({ variant: resolvedVariant, category, showPending, eventId });
    const isAssertive = resolvedVariant === PUSH_VARIANT.error || resolvedVariant === PUSH_VARIANT.warning;
    const progress = durationMs > 0 ? Math.max(0, Math.min(1, timeLeftMs / durationMs)) : 0;

    const animClass = exiting ? 'push-notification-toast-exit' : 'push-notification-toast-enter';

    React.useEffect(() => {
        if (exiting) return;
        if (timerPaused) {
            setTimeLeftMs(Math.max(0, pauseRemainderMs ?? 0));
            return;
        }
        if (typeof dismissAt !== 'number' || Number.isNaN(dismissAt)) return;

        const tick = () => {
            setTimeLeftMs(Math.max(0, dismissAt - Date.now()));
        };
        tick();
        const intervalId = window.setInterval(tick, 100);
        return () => window.clearInterval(intervalId);
    }, [exiting, timerPaused, dismissAt, pauseRemainderMs]);

    function handlePointerEnter(e) {
        if (exiting) return;
        if (e.pointerType === 'touch') return;
        onTimerPause?.();
    }

    function scheduleResume() {
        if (exiting) return;
        if (resumeRafRef.current) window.cancelAnimationFrame(resumeRafRef.current);
        resumeRafRef.current = window.requestAnimationFrame(() => {
            resumeRafRef.current = 0;
            onTimerResume?.();
        });
    }

    function handlePointerLeave(e) {
        if (exiting) return;
        if (e.pointerType === 'touch') return;
        scheduleResume();
    }

    /** Mouse leave mirrors pointer leave (some environments / drivers don’t emit pointer events reliably). */
    function handleMouseLeave(e) {
        if (exiting) return;
        if (e.nativeEvent?.pointerType === 'touch') return;
        scheduleResume();
    }

    React.useEffect(
        () => () => {
            if (resumeRafRef.current) window.cancelAnimationFrame(resumeRafRef.current);
        },
        []
    );

    /** prefers-reduced-motion: CSS disables animations — unmount immediately after exit intent. */
    React.useEffect(() => {
        if (!exiting) return;
        if (!reducedMotion) return;
        const id = window.setTimeout(() => onExitCompleteRef.current?.(), 0);
        return () => window.clearTimeout(id);
    }, [exiting, reducedMotion]);

    function handleAnimationEnd(e) {
        if (e.target !== e.currentTarget) return;
        if (!exiting) return;
        if (reducedMotion) return;
        const name = e.animationName || '';
        if (!name.includes(EXIT_ANIMATION_NAME)) return;
        onExitCompleteRef.current?.();
    }

    return (
        <div
            role={isAssertive ? 'alert' : 'status'}
            aria-live={isAssertive ? 'assertive' : 'polite'}
            onAnimationEnd={handleAnimationEnd}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onMouseLeave={handleMouseLeave}
            className={`${animClass} relative w-full overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-default)] bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--gradient-soft-panel-end)_100%)] shadow-[var(--shadow-card-raised)] ring-1 ring-white/70`}
            style={{ '--push-toast-duration': `${durationMs}ms` }}
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
                    disabled={exiting}
                    className="shrink-0 -mr-1 -mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-soft)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-300)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
                        transition: reducedMotion || timerPaused ? 'none' : undefined,
                    }}
                />
            </div>
        </div>
    );
}

export const PUSH_TOAST_DURATION_DEFAULT_MS = DURATION_MS_DEFAULT;
export const PUSH_TOAST_DURATION_AUTH_MS = DURATION_MS_AUTH;
export const ACTION_NOTIFICATION_DURATION_MS = DURATION_MS_DEFAULT;
