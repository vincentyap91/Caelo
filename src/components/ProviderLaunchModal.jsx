import React, { useEffect } from 'react';
import { Percent, Wallet, X } from 'lucide-react';

function InfoCard({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center gap-4 rounded-[20px] border border-[rgb(228_234_243)] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)] sm:p-5">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                <Icon size={20} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
                <p className="mt-1 text-xl font-black tracking-tight text-[var(--color-text-strong)] sm:text-2xl">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function ProviderLaunchModal({
    open,
    onClose,
    title,
    bannerImage,
    wallet = '0.00',
    membershipRebate = '0.00%',
    onStartGame,
    startLabel = 'Start Game',
}) {
    useEffect(() => {
        if (!open) return undefined;
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose?.();
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
        <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-[var(--color-nav-overlay)] backdrop-blur-[1px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label={`${title} launch`}
                className="relative z-[1] flex max-h-[min(92vh,860px)] w-full max-w-[920px] flex-col overflow-hidden rounded-[24px] border border-[rgb(219_228_243)] bg-[var(--color-surface-base)] shadow-[var(--shadow-modal)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 border-b border-[rgb(228_234_243)] px-5 py-4 sm:px-7">
                    <h2 className="text-xl font-extrabold tracking-tight text-[var(--color-text-strong)] sm:text-2xl">
                        {title}
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-white text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                    <div className="overflow-hidden rounded-[20px] border border-[rgb(228_234_243)] bg-[var(--color-surface-muted)] shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                        <img
                            src={bannerImage}
                            alt={`${title} banner`}
                            className="block h-auto w-full object-cover"
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InfoCard label="Wallet" value={wallet} icon={Wallet} />
                        <InfoCard label="Membership Rebate" value={membershipRebate} icon={Percent} />
                    </div>

                    <div className="mt-6 flex justify-center border-t border-[rgb(228_234_243)] pt-5 sm:pt-6">
                        <button
                            type="button"
                            onClick={onStartGame}
                            className="btn-theme-cta inline-flex min-h-12 min-w-[180px] items-center justify-center rounded-xl px-8 py-3 text-base font-black tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                        >
                            {startLabel}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
