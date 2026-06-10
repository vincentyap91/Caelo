import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';

/**
 * TAC / OTP failure: incorrect code or expired window. OK dismisses for retry.
 */
export default function TacErrorModal({ open, onConfirm, titleId = 'tac-error-title' }) {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onConfirm?.();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onConfirm]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[280] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Dismiss"
                className="absolute inset-0 bg-[var(--color-surface-darkest)]/65 backdrop-blur-[2px]"
                onClick={onConfirm}
            />
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-[1] w-full max-w-[340px] rounded-[22px] bg-[var(--color-surface-card-container)] px-8 pb-8 pt-10 shadow-[var(--shadow-modal)] sm:max-w-[360px] sm:rounded-[24px] sm:px-10 sm:pt-12 sm:pb-10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    <XCircle
                        className="text-[var(--color-danger)]"
                        size={72}
                        strokeWidth={1.35}
                        aria-hidden
                    />
                    <p id={titleId} className="mt-6 text-base font-medium leading-snug text-[var(--color-text-card-text)] sm:text-lg">
                        TAC Is Incorrect Or Has Expired.
                    </p>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="mt-8 min-w-[140px] rounded-xl bg-[var(--color-success-vivid)] px-10 py-3 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-text-primary)] shadow-[var(--shadow-success)] transition hover:brightness-95 active:scale-[0.99]"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

