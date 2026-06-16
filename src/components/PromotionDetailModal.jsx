import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import CountdownTimer from './ui/CountdownTimer';

export default function PromotionDetailModal({
    open,
    onClose,
    onChatClick,
    bannerImage,
    title,
    category,
    description,
    endDate,
    eventDetails,
    applySteps = [],
    providers = [],
}) {
    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
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
                className="absolute inset-0 bg-[var(--color-overlay-strong)] backdrop-blur-[2px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label={title ? `${title} details` : 'Promotion details'}
                className="relative z-[1] flex max-h-[min(92vh,860px)] w-full max-w-[920px] flex-col overflow-hidden rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] shadow-[var(--shadow-modal)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-4 sm:px-7">
                    <div>
                        <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
                            Promotion Details
                        </h2>
                    </div>

                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-glow)] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-secondary)]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                    <div className="overflow-hidden rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-cool-light)] shadow-[var(--shadow-subtle)]">
                        <img
                            src={bannerImage}
                            alt={title}
                            className="block w-full object-cover"
                        />
                    </div>

                    <div className="mt-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {category && (
                                <span className="promotion-card-category inline-flex rounded-full bg-[var(--color-secondary-tag)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-secondary-tag-text)]">
                                    {category}
                                </span>
                            )}
                            {endDate && (
                                <div className="shrink-0">
                                    <CountdownTimer endDate={endDate} size="modal" align="right" />
                                </div>
                            )}
                        </div>

                        <h3 className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 rounded-[20px] border border-[var(--color-border-subtle)] bg-gradient-soft-panel p-4 sm:p-5">
                        <h4 className="text-lg font-bold text-[var(--color-text-primary)]">Event Details</h4>

                        {/* Mobile: same orange header identity as desktop — label strip + value column */}
                        <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] sm:hidden">
                            <dl className="divide-y divide-[var(--color-border-subtle)]">
                                {detailCells.map((cell) => (
                                    <div
                                        key={cell.label}
                                        className="grid grid-cols-[minmax(0,40%)_minmax(0,1fr)] items-stretch"
                                    >
                                        <dt className="flex items-center bg-gradient-cta border-r border-[var(--color-border-brand)] px-2.5 py-3 text-left text-xs font-bold uppercase leading-snug tracking-wide text-[var(--color-primary)]">
                                            {cell.label}
                                        </dt>
                                        <dd className="m-0 flex min-w-0 items-center justify-end bg-[var(--color-tertiery)] px-3 py-3 text-right text-sm font-semibold leading-snug text-[var(--color-text-secondary)] break-words tabular-nums">
                                            {cell.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Tablet / desktop: unchanged wide table */}
                        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] sm:block">
                            <div className="grid grid-cols-5 border-b border-[var(--color-border-subtle)] bg-gradient-cta text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                                {detailCells.map((cell) => (
                                    <div
                                        key={cell.label}
                                        className="border-r border-[var(--color-border-brand)] px-3 py-3 text-center last:border-r-0"
                                    >
                                        {cell.label}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-5 bg-[var(--color-tertiery)] text-sm font-semibold text-[var(--color-text-secondary)]">
                                {detailCells.map((cell) => (
                                    <div
                                        key={cell.label}
                                        className="border-r border-[var(--color-border-subtle)] px-3 py-3 text-center last:border-r-0"
                                    >
                                        {cell.value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] p-4 shadow-[var(--shadow-subtle)] sm:p-5">
                        <h4 className="text-lg font-bold text-[var(--color-text-primary)]">How to Apply</h4>
                        <ol className="mt-4 space-y-3">
                            {applySteps.map((step, index) => (
                                <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-tag)] text-xs font-bold text-[var(--color-secondary-tag-text)]">
                                        {index + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {providers.length > 0 && (
                        <div className="mt-6 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] p-4 shadow-[var(--shadow-subtle)] sm:p-5">
                            <h4 className="text-lg font-bold text-[var(--color-text-primary)]">Applicable Providers</h4>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {providers.map((provider) => (
                                    <span
                                        key={provider}
                                        className="inline-flex rounded-full border border-[var(--color-accent-glow)] bg-[var(--color-secondary-tag)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-secondary-tag-text)]"
                                    >
                                        {provider}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onChatClick}
                        className="btn-promotion-chat mt-6 flex min-h-12 w-full items-center justify-center rounded-full px-6 text-base font-bold transition hover:brightness-105"
                    >
                        Chat with Us
                    </button>
                </div>
            </section>
        </div>
    );
}


