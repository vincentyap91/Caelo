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

const DURATION_MS_DEFAULT = 3000;
const DURATION_MS_AUTH = 3000;

const EXIT_ANIMATION_NAME = 'push-notification-exit';

const variantStyles = {
    [PUSH_VARIANT.success]: {
        iconWrap:
            'bg-[var(--color-success-light)] text-[var(--color-surface)] shadow-[var(--shadow-success)]',
        iconRing: 'ring-1 ring-[var(--color-success)]/12',
        accent: 'bg-[var(--color-success)]',
        accentSoft: 'bg-[var(--color-success)]/10',
        accentText: 'text-[var(--color-success)]',
    },
    [PUSH_VARIANT.error]: {
        iconWrap:
            'bg-[var(--color-surface-subtle)] text-[var(--color-danger)] shadow-[var(--shadow-hot)]',
        iconRing: 'ring-1 ring-[var(--color-danger)]/14',
        accent: 'bg-[var(--color-danger)]',
        accentSoft: 'bg-[var(--color-danger)]/10',
        accentText: 'text-[var(--color-danger)]',
    },
    [PUSH_VARIANT.warning]: {
        iconWrap:
            'bg-[var(--color-accent-pale)] text-[var(--color-danger)] shadow-[var(--shadow-hot)]',
        iconRing: 'ring-1 ring-[var(--color-danger)]/14',
        accent: 'bg-[var(--color-danger)]',
        accentSoft: 'bg-[var(--color-danger)]/10',
        accentText: 'text-[var(--color-danger)]',
    },
    [PUSH_VARIANT.info]: {
        iconWrap:
            'bg-[var(--color-accent-pale)] text-[var(--color-button-hover)] shadow-[var(--shadow-accent)]',
        iconRing: 'ring-1 ring-[var(--color-accent)]/14',
        accent: 'bg-[var(--color-accent)]',
        accentSoft: 'bg-[var(--color-accent)]/10',
        accentText: 'text-[var(--color-button-hover)]',
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
    const progressBarRef = React.useRef(null);
    const progressAnimRef = React.useRef({ exiting, timerPaused, dismissAt, durationMs, pauseRemainderMs });
    progressAnimRef.current = { exiting, timerPaused, dismissAt, durationMs, pauseRemainderMs };

    const onExitCompleteRef = React.useRef(onExitComplete);
    onExitCompleteRef.current = onExitComplete;
    const resumeRafRef = React.useRef(0);

    const resolvedVariant = stateType ?? variant;
    const vs = variantStyles[resolvedVariant] ?? variantStyles[PUSH_VARIANT.info];
    const Icon = pickIcon({ variant: resolvedVariant, category, showPending, eventId });
    const isAssertive = resolvedVariant === PUSH_VARIANT.error || resolvedVariant === PUSH_VARIANT.warning;

    const animClass = exiting ? 'push-notification-toast-exit' : 'push-notification-toast-enter';

    /**
     * Smooth countdown bar: drive scaleX via rAF + ref (no 100ms interval re-renders).
     * Dismiss timing stays in ActionNotificationsProvider (setTimeout from dismissAt).
     */
    React.useEffect(() => {
        if (exiting) return;

        let rafId = 0;

        const applyProgress = () => {
            const { timerPaused: paused, dismissAt: endAt, durationMs: totalMs, pauseRemainderMs: pausedLeft } =
                progressAnimRef.current;

            let p = 0;
            if (paused) {
                p = totalMs > 0 ? Math.max(0, Math.min(1, (pausedLeft ?? 0) / totalMs)) : 0;
            } else if (typeof endAt === 'number' && !Number.isNaN(endAt)) {
                const left = Math.max(0, endAt - Date.now());
                p = totalMs > 0 ? Math.max(0, Math.min(1, left / totalMs)) : 0;
            }

            const el = progressBarRef.current;
            if (el) {
                el.style.transform = `scaleX(${p})`;
            }
        };

        const tick = () => {
            if (progressAnimRef.current.exiting) return;

            applyProgress();

            const { timerPaused: paused, dismissAt: endAt } = progressAnimRef.current;
            if (paused) return;
            if (typeof endAt !== 'number' || Number.isNaN(endAt) || endAt <= Date.now()) return;

            rafId = window.requestAnimationFrame(tick);
        };

        applyProgress();
        if (!timerPaused && typeof dismissAt === 'number' && !Number.isNaN(dismissAt) && dismissAt > Date.now()) {
            rafId = window.requestAnimationFrame(tick);
        }

        return () => window.cancelAnimationFrame(rafId);
    }, [exiting, timerPaused, dismissAt, pauseRemainderMs, durationMs]);

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
            className={`${animClass} relative w-full overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-subtle)] bg-gradient-soft-panel shadow-[var(--shadow-card-raised)] ring-1 ring-white/70`}
            style={{ '--push-toast-duration': `${durationMs}ms` }}
        >
            <div
                aria-hidden
                className={`absolute bottom-3 left-3 top-3 w-1 rounded-full ${vs.accent}`}
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-notification-shine opacity-80"
            />
            <div className="relative flex items-start gap-3 py-3.5 pl-7 pr-3 sm:gap-4 sm:py-4 sm:pl-8 sm:pr-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${vs.iconWrap} ${vs.iconRing}`}>
                    {renderIcon({ icon, fallbackIcon: Icon, showPending, reducedMotion })}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-2">
                        <p className="text-base font-bold leading-tight text-[var(--color-text-primary)] sm:text-base">
                            {title}
                        </p>
                        {statusLabel ? (
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                                    showPending
                                        ? 'bg-[var(--color-accent-glow)] text-[var(--color-button-hover)]'
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
                    className="shrink-0 -mr-1 -mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-soft)] transition hover:bg-[var(--color-surface-cool-light)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-subtle)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Dismiss notification"
                >
                    <X size={18} strokeWidth={2.4} />
                </button>
            </div>
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1.5 overflow-hidden bg-[var(--color-surface-cool-light)]"
            >
                <div
                    ref={progressBarRef}
                    className={`h-full w-full origin-left will-change-transform motion-reduce:will-change-auto ${vs.accent}`}
                    style={{ transform: 'scaleX(1)' }}
                />
            </div>
        </div>
    );
}

export const PUSH_TOAST_DURATION_DEFAULT_MS = DURATION_MS_DEFAULT;
export const PUSH_TOAST_DURATION_AUTH_MS = DURATION_MS_AUTH;
export const ACTION_NOTIFICATION_DURATION_MS = DURATION_MS_DEFAULT;
