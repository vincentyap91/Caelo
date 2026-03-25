import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import AccountHistoryRecordPanel from './AccountHistoryRecordPanel';

/**
 * Rewards “Record” popup — same filter + table pattern as Referral Commission → History.
 */
export default function RewardsActivityRecordModal({ open, onClose, filterSlot, columns, recordContextKey, tableEmptyMessage }) {
    useEffect(() => {
        if (!open) return undefined;
        const handleEscape = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="absolute inset-0 bg-[rgb(15_23_42_/_0.45)] backdrop-blur-[2px] transition-opacity"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="rewards-record-modal-title"
                className="relative z-[1] flex max-h-[min(90vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-panel-xl)] border border-[var(--color-border-default)] bg-[var(--color-surface-base)] shadow-[var(--shadow-modal)]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-5 py-4 md:px-6">
                    <h2 id="rewards-record-modal-title" className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">
                        Record
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 md:p-6">
                    <AccountHistoryRecordPanel
                        key={recordContextKey ?? 'rewards-record'}
                        startDateLabel="Start Claim Date"
                        endDateLabel="End Claim Date"
                        columns={columns}
                        filterSlot={filterSlot}
                        pillQuickRanges
                        emptyMessage={tableEmptyMessage}
                    />
                </div>
            </div>
        </div>
    );
}
