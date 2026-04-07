import React, { useEffect } from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function PromotionWarningModal({
    open,
    onClose,
    onContinue,
    title = 'You have available promotions.',
    message = 'Go to the promotions page to claim them now.',
    warningMessage = 'You may not be able to redeem some promotions after you continue.',
    continueLabel = 'Continue Anyway',
}) {
    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return undefined;
        const handleEscape = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[240] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close promotion warning"
                onClick={onClose}
                className="absolute inset-0 bg-[var(--color-nav-overlay)] backdrop-blur-[1px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label="Promotion warning"
                className="relative z-[1] flex w-full max-w-[500px] flex-col overflow-hidden rounded-[22px] border border-[rgb(219_228_243)] bg-[var(--color-surface-base)] shadow-[var(--shadow-modal)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 border-b border-[rgb(228_234_243)] px-5 py-3.5 sm:px-6">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-strong)] sm:text-xl">
                        Promotion Notice
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-white text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)] sm:h-10 sm:w-10"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-5.5">
                    <div className="mx-auto flex max-w-[500px] flex-col items-center text-center">
                        <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)] shadow-[0_12px_24px_rgba(255,178,45,0.16)]">
                            <AlertTriangle size={30} strokeWidth={2.4} />
                        </span>

                        <div className="mt-4 max-w-[30rem]">
                            <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-strong)] sm:text-2xl">
                                {title}
                            </h3>
                            <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                                {message}
                            </p>
                        </div>

                        <div className="mt-5 w-full rounded-[20px] border border-[rgb(255_91_46_/_0.2)] bg-[rgb(255_91_46_/_0.06)] px-4 py-3.5 text-left shadow-[0_4px_14px_rgba(255,91,46,0.06)] sm:px-5 sm:py-4">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgb(255_91_46_/_0.12)] text-[var(--color-danger-main)]">
                                    <AlertCircle size={18} strokeWidth={2.3} />
                                </span>
                                <p className="text-sm font-semibold leading-relaxed text-[rgb(173,49,24)] sm:text-base">
                                    {warningMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center border-t border-[rgb(228_234_243)] px-5 py-4 sm:px-6 sm:py-5">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="btn-theme-cta inline-flex min-h-11 min-w-[200px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-105 sm:min-h-12 sm:px-7 sm:py-3 sm:text-base"
                    >
                        {continueLabel}
                    </button>
                </div>
            </section>
        </div>
    );
}
