import React, { useEffect } from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';

export default function PromotionWarningModal({
    open,
    onClose,
    onContinue,
    title = 'You have available promotions.',
    message = 'Go to the promotions page to claim them now.',
    warningMessage = 'You may not be able to redeem some promotions after you continue.',
    continueLabel = 'Continue Anyway',
}) {
    useEffect(() => {
        if (!open) return undefined;
        const handleEscape = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = prevOverflow;
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
                className="relative z-[1] w-full max-w-[520px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#242424_0%,#202020_100%)] px-6 pb-8 pt-7 text-center shadow-[var(--shadow-modal)] sm:px-10 sm:pb-10 sm:pt-8"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffb22d_0%,#ff9500_100%)] text-white shadow-[0_14px_28px_rgba(255,149,0,0.28)] sm:h-28 sm:w-28">
                    <AlertTriangle size={44} strokeWidth={3} />
                </div>

                <div className="mt-7 space-y-1 text-white">
                    <h2 className="text-[1.85rem] font-semibold leading-tight sm:text-[2rem]">{title}</h2>
                    <p className="mx-auto max-w-[16ch] text-[1.85rem] font-semibold leading-tight sm:max-w-[18ch] sm:text-[2rem]">
                        {message}
                    </p>
                </div>

                <div className="mt-7 rounded-[18px] border border-[rgba(255,87,87,0.55)] bg-[rgba(112,22,22,0.34)] px-4 py-4 text-left sm:px-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={21} className="mt-0.5 shrink-0 text-[#ff3b30]" />
                        <p className="text-lg font-medium leading-relaxed text-[#ff5447] sm:text-[1.15rem]">
                            {warningMessage}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onContinue}
                    className="mt-8 inline-flex min-h-12 min-w-[230px] items-center justify-center rounded-xl bg-[linear-gradient(180deg,#4dff8d_0%,#39e776_100%)] px-8 py-3 text-lg font-black text-[#062e11] shadow-[0_14px_26px_rgba(57,231,118,0.24)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                    {continueLabel}
                </button>
            </section>
        </div>
    );
}
