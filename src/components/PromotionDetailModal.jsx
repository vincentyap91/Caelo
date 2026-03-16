import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function PromotionDetailModal({
    open,
    onClose,
    bannerImage,
    title,
    category,
    description,
    eventDetails,
    applySteps = [],
    providers = [],
}) {
    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const detailCells = [
        { label: 'Min Deposit', value: eventDetails?.minDeposit ?? '-' },
        { label: 'Bonus', value: eventDetails?.bonus ?? '-' },
        { label: 'Max Bonus', value: eventDetails?.maxBonus ?? '-' },
        { label: 'Turnover', value: eventDetails?.turnover ?? '-' },
        { label: 'Validity Period', value: eventDetails?.validityPeriod ?? '-' },
    ];

    return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close promotion details"
                onClick={onClose}
                className="absolute inset-0 bg-[rgb(2_11_31_/_0.68)] backdrop-blur-[2px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label={title ? `${title} details` : 'Promotion details'}
                className="relative z-[1] flex max-h-[min(92vh,860px)] w-full max-w-[920px] flex-col overflow-hidden rounded-[24px] border border-[rgb(219_228_243)] bg-[var(--color-surface-base)] shadow-[var(--shadow-modal)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[rgb(228_234_243)] px-5 py-4 sm:px-7">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-600)]">
                            Promotion
                        </p>
                        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--color-text-strong)] sm:text-2xl">
                            Promotion Details
                        </h2>
                    </div>

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
                            alt={title}
                            className="block w-full object-cover"
                        />
                    </div>

                    <div className="mt-6">
                        {category && (
                            <span className="inline-flex rounded-full bg-[var(--color-accent-50)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent-700)]">
                                {category}
                            </span>
                        )}
                        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--color-text-strong)]">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 rounded-[20px] border border-[rgb(228_234_243)] bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--gradient-soft-panel-end)_100%)] p-4 sm:p-5">
                        <h4 className="text-lg font-extrabold text-[var(--color-text-strong)]">Event Details</h4>
                        <div className="mt-4 overflow-hidden rounded-2xl border border-[rgb(228_234_243)] bg-white">
                            <div className="grid grid-cols-2 border-b border-[rgb(228_234_243)] bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[11px] font-black uppercase tracking-[0.08em] text-[var(--color-cta-text)] sm:grid-cols-5">
                                {detailCells.map((cell) => (
                                    <div
                                        key={cell.label}
                                        className="border-r border-[rgb(214_188_113)] px-3 py-3 text-center last:border-r-0"
                                    >
                                        {cell.label}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 bg-white text-sm font-semibold text-[var(--color-text-main)] sm:grid-cols-5">
                                {detailCells.map((cell) => (
                                    <div
                                        key={cell.label}
                                        className="border-r border-[rgb(228_234_243)] px-3 py-3 text-center last:border-r-0"
                                    >
                                        {cell.value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-[20px] border border-[rgb(228_234_243)] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)] sm:p-5">
                        <h4 className="text-lg font-extrabold text-[var(--color-text-strong)]">How to Apply</h4>
                        <ol className="mt-4 space-y-3">
                            {applySteps.map((step, index) => (
                                <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text-main)] sm:text-base">
                                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-50)] text-xs font-black text-[var(--color-accent-700)]">
                                        {index + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {providers.length > 0 && (
                        <div className="mt-6 rounded-[20px] border border-[rgb(228_234_243)] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)] sm:p-5">
                            <h4 className="text-lg font-extrabold text-[var(--color-text-strong)]">Applicable Providers</h4>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {providers.map((provider) => (
                                    <span
                                        key={provider}
                                        className="inline-flex rounded-full border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-accent-700)]"
                                    >
                                        {provider}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
