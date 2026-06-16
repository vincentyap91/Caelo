import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function PaymentConfirmModal({ open, onClose, type = 'deposit' }) {
    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return undefined;
        const handleEscape = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    const message = type === 'deposit'
        ? 'We are verifying your payment. Once we receive the money, your account balance will be updated.'
        : 'We are processing your withdrawal. Once verified, the amount will be transferred to your account.';

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-[var(--color-surface-darkest)]/70 backdrop-blur-[1px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label="Payment submitted"
                className="cashier-payment-confirm-modal relative z-[1] w-full max-w-[420px] rounded-2xl border border-[var(--color-border-brand)] bg-gradient-register-panel px-6 pb-6 pt-8 shadow-[var(--shadow-modal)] sm:px-8 sm:pb-8 sm:pt-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-accent)] text-[var(--color-tertiery)] transition hover:brightness-95"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-[var(--color-tertiery)] shadow-[var(--shadow-success)]">
                        <Check size={28} strokeWidth={2.5} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                            {type === 'deposit' ? 'Payment Submitted' : 'Withdrawal Submitted'}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-theme-cta w-full max-w-[200px] rounded-xl px-6 py-3.5 text-base font-bold uppercase"
                    >
                        OK
                    </button>
                </div>
            </section>
        </div>
    );
}
