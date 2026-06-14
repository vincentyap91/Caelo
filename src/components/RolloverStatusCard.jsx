import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, CircleCheckBig, ShieldAlert } from 'lucide-react';
import {
    DEMO_ROLLOVER_STATUS,
    formatRolloverAmount,
    getRolloverProgressPercent,
} from '../constants/rolloverStatus';
import ProgressBar from './ui/ProgressBar';

function Metric({ label, value, dark = false }) {
    return (
        <div className={`rounded-xl px-3 py-2 ${dark ? 'bg-[var(--color-surface-base)]/5' : 'bg-[var(--color-surface-cool-light)]/90'}`}>
            <p className={`text-xs font-bold uppercase tracking-wide ${dark ? 'text-[var(--color-text-card-text)]/55' : 'text-[var(--color-text-soft)]'}`}>
                {label}
            </p>
            <p className={`mt-1 text-sm font-bold tabular-nums ${dark ? 'text-[var(--color-text-card-text)]' : 'text-[var(--color-text-primary)]'}`}>
                {formatRolloverAmount(value)}
            </p>
        </div>
    );
}

function SupportRequestRow({ eligible, dark = false, onRequestSupport }) {
    return (
        <div className={`flex flex-col gap-2 rounded-xl border px-3 py-3 sm:flex-row sm:items-center sm:justify-between ${
            dark
                ? 'border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/4'
                : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/70'
        }`}>
            <div className="min-w-0">
                <p className={`text-sm font-semibold ${dark ? 'text-[var(--color-text-card-text)]' : 'text-[var(--color-text-primary)]'}`}>
                    Clear Deposit Rollover
                </p>
                <p className={`mt-1 text-xs leading-snug ${dark ? 'text-[var(--color-text-card-text)]/65' : 'text-[var(--color-text-muted)]'}`}>
                    Need help? Ask customer service to clear this rollover.
                </p>
            </div>
            <button
                type="button"
                onClick={() => onRequestSupport?.()}
                className={`rollover-status-card__support-btn${dark ? ' rollover-status-card__support-btn--dark' : ''}`}
            >
                Contact Support
            </button>
        </div>
    );
}

export default function RolloverStatusCard({
    status = DEMO_ROLLOVER_STATUS,
    variant = 'detail',
    onClick,
    onRequestSupport,
}) {
    const percent = getRolloverProgressPercent(status);
    const isComplete = Boolean(status?.requirementMet) || Number(status?.remainingAmount) <= 0;
    const title = status?.title || 'Deposit Rollover';
    const badgeLabel = isComplete ? 'Completed' : 'In Progress';
    const targetAmount = Number(status?.targetAmount) || 0;
    const completedAmount = Number(status?.completedAmount) || 0;
    const canRequestClear = Boolean(status?.canRequestClear ?? (targetAmount > 0 && completedAmount >= targetAmount && !status?.requirementMet));
    const [detailsOpen, setDetailsOpen] = useState(false);

    if (variant === 'compact-dark') {
        const compactContent = (
            <>
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-sticky-nav-active)]">
                            Rollover Summary
                        </p>
                        <p className="mt-1 truncate text-base font-bold text-[var(--color-text-card-text)]">{title}</p>
                    </div>
                    <p className="shrink-0 text-xs font-bold text-[var(--color-accent-yellow)]">{Math.round(percent)}%</p>
                </div>

                <div className="mt-2">
                    <ProgressBar percent={percent} variant="dark" />
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-xs text-[var(--color-text-card-text)]/70">
                        {isComplete ? 'Withdrawal is available.' : `Remaining ${formatRolloverAmount(status?.remainingAmount)} to unlock withdrawal.`}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setDetailsOpen((open) => !open);
                            }}
                            className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-xs font-bold text-[var(--color-text-sticky-nav-active)] transition hover:text-[var(--color-text-card-text)]"
                            aria-expanded={detailsOpen}
                        >
                            Details
                            <ChevronDown size={12} className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {onClick ? (
                            <button
                                type="button"
                                onClick={onClick}
                                className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-xs font-bold text-[var(--color-text-card-text)]/75 transition hover:text-[var(--color-text-card-text)]"
                            >
                                Cashier
                                <ChevronRight size={12} />
                            </button>
                        ) : null}
                    </div>
                </div>

                {detailsOpen && (
                    <div className="mt-2 space-y-2 border-t border-[var(--color-border-subtle)] pt-2">
                        <div className="grid grid-cols-3 gap-2">
                            <Metric label="Target" value={status?.targetAmount} dark />
                            <Metric label="Done" value={status?.completedAmount} dark />
                            <Metric label="Left" value={status?.remainingAmount} dark />
                        </div>
                        <SupportRequestRow eligible={canRequestClear} dark onRequestSupport={onRequestSupport} />
                    </div>
                )}
            </>
        );

        return (
            <div className="dark-nav-tile mt-2.5 w-full rounded-[18px] p-2.5 text-left">
                {compactContent}
            </div>
        );
    }

    if (variant === 'warning') {
        return (
            <div className="surface-card overflow-hidden rounded-2xl border-[var(--color-warning)] bg-gradient-rollover-warn shadow-[var(--shadow-card-soft)]">
                <div className="flex flex-col gap-3 p-4 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.95fr)_auto] md:items-center md:gap-5 md:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-pale)] text-[var(--color-text-sub-title)] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]">
                            <AlertTriangle size={17} />
                        </div>
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold leading-tight text-[var(--color-text-primary)] md:text-base">
                                    {title}
                                </h2>
                                <span className="inline-flex items-center rounded-full bg-[var(--color-accent-pale)] px-2 py-0.5 text-xs font-bold text-[var(--color-text-sub-title)]">
                                    {badgeLabel}
                                </span>
                            </div>
                            <p className="max-w-[34ch] text-sm leading-snug text-[var(--color-text-secondary)] md:text-sm">
                                Complete deposit rollover to enable withdrawal.
                            </p>
                        </div>
                    </div>

                    <div className="min-w-0 md:self-center">
                        <ProgressBar percent={percent} />
                    </div>

                    <div className="flex items-center justify-between gap-3 md:min-w-[210px] md:justify-end md:gap-4">
                        <div className="rounded-xl bg-[var(--color-border-subtle)]5 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] md:text-right">
                            <p className="text-sm font-bold leading-none text-[var(--color-text-primary)]">{Math.round(percent)}% completed</p>
                            <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">{formatRolloverAmount(status?.remainingAmount)} remaining</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDetailsOpen((open) => !open)}
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[var(--color-button-hover)] transition hover:bg-[var(--color-surface-base)]/40 hover:text-[var(--color-button-hover)]"
                            aria-expanded={detailsOpen}
                        >
                            {detailsOpen ? 'Hide Details' : 'View Details'}
                            <ChevronDown size={14} className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {detailsOpen && (
                    <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] px-4 py-3 md:px-5">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                <Metric label="Target amount" value={status?.targetAmount} />
                                <Metric label="Completed amount" value={status?.completedAmount} />
                                <Metric label="Remaining amount" value={status?.remainingAmount} />
                            </div>
                            <SupportRequestRow eligible={canRequestClear} onRequestSupport={onRequestSupport} />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'summary-inline') {
        return (
            <div className="rollover-status-card surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="flex flex-col gap-3 p-4 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.95fr)_auto] md:items-center md:gap-5 md:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className={`rollover-status-card__icon${isComplete ? ' is-complete' : ''}`}>
                            {isComplete ? <CircleCheckBig size={17} /> : <ShieldAlert size={17} />}
                        </div>
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-base font-bold leading-tight text-[var(--color-text-primary)]">
                                    {title}
                                </p>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                                    isComplete
                                        ? 'bg-[color-mix(in_srgb,var(--color-success)_12%,white)] text-[var(--color-success)]'
                                        : 'bg-[color-mix(in_srgb,var(--color-button-hover)_10%,white)] text-[var(--color-text-sub)]'
                                }`}>
                                    {badgeLabel}
                                </span>
                            </div>
                            <p className="max-w-[34ch] text-sm leading-snug text-[var(--color-text-secondary)] md:text-sm">
                                Complete rollover before withdrawal
                            </p>
                        </div>
                    </div>

                    <div className="min-w-0 md:self-center">
                        <ProgressBar percent={percent} />
                    </div>

                    <div className="flex items-center justify-between gap-3 md:min-w-[210px] md:justify-end md:gap-4">
                        <div className="rounded-xl bg-[var(--color-border-subtle)]5 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] md:text-right">
                            <p className="text-sm font-bold leading-none text-[var(--color-text-primary)]">{Math.round(percent)}% completed</p>
                            <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">{formatRolloverAmount(status?.remainingAmount)} remaining</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDetailsOpen((open) => !open)}
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[var(--color-button-hover)] transition hover:bg-[var(--color-surface-base)]/40 hover:text-[var(--color-button-hover)]"
                            aria-expanded={detailsOpen}
                        >
                            {detailsOpen ? 'Hide Details' : 'View Details'}
                            <ChevronDown size={14} className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {detailsOpen && (
                    <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] px-4 py-4 md:px-5">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <Metric label="Target amount" value={status?.targetAmount} />
                                <Metric label="Completed amount" value={status?.completedAmount} />
                                <Metric label="Remaining amount" value={status?.remainingAmount} />
                            </div>
                            <SupportRequestRow eligible={canRequestClear} onRequestSupport={onRequestSupport} />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="rollover-status-card surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
            <div className="border-b border-[var(--color-border-subtle)] bg-gradient-soft-panel px-5 py-4 md:px-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className={`rollover-status-card__icon rollover-status-card__icon--lg${isComplete ? ' is-complete' : ''}`}>
                            {isComplete ? <CircleCheckBig size={20} /> : <ShieldAlert size={20} />}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-button-hover)]">
                                Wallet / Cashier
                            </p>
                            <h2 className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">{title}</h2>
                            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                {isComplete
                                    ? 'Your rollover is complete and withdrawal is available.'
                                    : 'Track your progress here before making a withdrawal.'}
                            </p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        isComplete
                            ? 'bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-[var(--color-success)]'
                            : 'bg-[color-mix(in_srgb,var(--color-button-hover)_10%,white)] text-[var(--color-button-hover)]'
                    }`}>
                        {badgeLabel}
                    </span>
                </div>
            </div>

            <div className="space-y-4 p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {Math.round(percent)}% completed
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Latest qualifying amount: {formatRolloverAmount(status?.latestQualifiedAmount)}{status?.updatedAt ? ` | Updated ${status.updatedAt}` : ''}
                        </p>
                    </div>
                    <p className="text-right text-sm font-semibold text-[var(--color-text-secondary)]">
                        {isComplete
                            ? 'No remaining rollover.'
                            : `${formatRolloverAmount(status?.remainingAmount)} remaining`}
                    </p>
                </div>

                <ProgressBar percent={percent} />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Metric label="Target amount" value={status?.targetAmount} />
                    <Metric label="Completed amount" value={status?.completedAmount} />
                    <Metric label="Remaining amount" value={status?.remainingAmount} />
                </div>
            </div>
        </div>
    );
}

