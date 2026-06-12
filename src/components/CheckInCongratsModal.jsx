import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Coins } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function CheckInCongratsModal({ open, amount, onClose, autoCloseMs = 3000 }) {
    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return undefined;
        const timer = setTimeout(() => onClose?.(), autoCloseMs);
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose, autoCloseMs]);

    if (!open) return null;
    if (typeof document === 'undefined') return null;

    const coinCount = 14;
    const viewportStyle = {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        minHeight: '100vh',
        margin: 0,
    };

    return createPortal(
        <div className="z-[240] flex items-center justify-center p-4 sm:p-6" style={viewportStyle}>
            <button
                type="button"
                aria-label="Close congratulations"
                onClick={onClose}
                className="bg-[var(--color-overlay-strong)] backdrop-blur-[2px]"
                style={{ ...viewportStyle, zIndex: 0 }}
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label="Reward claimed"
                className="check-in-success-modal claim-congrats-pop relative z-[1] flex w-full max-w-[420px] flex-col items-center overflow-hidden rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-popup-body)] px-6 py-7 text-center shadow-[var(--shadow-modal)] sm:px-8 sm:py-9"
                onClick={(e) => e.stopPropagation()}
            >
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    {Array.from({ length: coinCount }).map((_, i) => (
                        <span
                            key={i}
                            className="claim-coin-fall absolute text-[var(--color-text-check-in-day-active)]"
                            style={{
                                left: `${(i * (100 / coinCount)).toFixed(2)}%`,
                                animationDelay: `${(i % 5) * 0.18}s`,
                                animationDuration: `${1.6 + (i % 4) * 0.25}s`,
                                opacity: 0.85,
                            }}
                        >
                            <Coins size={i % 3 === 0 ? 20 : 16} strokeWidth={2.25} />
                        </span>
                    ))}
                </div>

                <span
                    className="check-in-success-modal-icon claim-coin-burst relative z-[1] flex h-20 w-20 items-center justify-center rounded-full bg-gradient-check-in-day text-[var(--color-icon-check-in-active)] shadow-[var(--shadow-cta)] ring-2 ring-[var(--color-surface-check-in-icon)] sm:h-24 sm:w-24"
                    aria-hidden
                >
                    <Coins className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={2.25} />
                </span>

                <h2 className="relative z-[1] mt-5 text-lg font-bold tracking-tight text-[var(--color-text-primary)] sm:text-xl">
                    Congratulations!
                </h2>
                <p className="relative z-[1] mt-2 text-2xl font-bold text-[var(--color-accent-check-in-reward)] sm:text-3xl">
                    You got {amount}
                </p>
                <p className="check-in-success-modal-body relative z-[1] mt-2 text-sm leading-relaxed text-[var(--color-text-primary)] sm:text-[15px]">
                    Come back tomorrow to keep your streak going and unlock a bigger reward.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="btn-theme-primary relative z-[1] mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl px-6 text-sm font-bold text-[var(--color-button-cta-primary)] shadow-sm transition hover:brightness-105"
                >
                    Awesome
                </button>

                <p className="relative z-[1] mt-2.5 text-[11px] font-medium text-[var(--color-text-check-in-day-muted)]">
                    Auto-closing in {Math.round(autoCloseMs / 1000)} seconds
                </p>
            </section>
        </div>,
        document.body
    );
}
