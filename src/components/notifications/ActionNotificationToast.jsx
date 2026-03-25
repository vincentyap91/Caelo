import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Loader2, X } from 'lucide-react';

const DURATION_MS = 5000;

/**
 * Single slide-in toast (top-right) for transaction status. Site-aligned surface + brand accents.
 */
export function ActionNotificationToast({ kind, statusLabel = 'Ongoing', message, onDismiss }) {
    const title = kind === 'deposit' ? 'Deposit' : 'Withdrawal';
    const Icon = kind === 'deposit' ? ArrowDownToLine : ArrowUpFromLine;

    return (
        <div
            role="status"
            aria-live="polite"
            className="action-notification-toast-enter pointer-events-auto w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl border border-[var(--color-border-brand)] bg-[var(--color-surface-base)] shadow-[0_12px_40px_rgba(15,23,42,0.18)]"
        >
            <div className="flex gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                    <Icon size={22} strokeWidth={2.25} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-extrabold text-[var(--color-text-strong)]">{title}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-100)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-700)]">
                            <Loader2 size={12} className="animate-spin" aria-hidden />
                            {statusLabel}
                        </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{message}</p>
                </div>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 -mr-1 -mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-strong)]"
                    aria-label="Dismiss notification"
                >
                    <X size={16} />
                </button>
            </div>
            <div className="h-1 w-full overflow-hidden bg-[var(--color-surface-muted)]">
                <div
                    className="h-full origin-left bg-[var(--color-accent-500)]"
                    style={{
                        animation: `action-toast-progress ${DURATION_MS}ms linear forwards`,
                    }}
                />
            </div>
            <style>
                {`
                  @keyframes action-notification-enter {
                    from { transform: translateX(110%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                  }
                  @keyframes action-toast-progress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                  }
                  .action-notification-toast-enter {
                    animation: action-notification-enter 0.35s ease-out forwards;
                  }
                `}
            </style>
        </div>
    );
}

export const ACTION_NOTIFICATION_DURATION_MS = DURATION_MS;
