import React from 'react';
import { DEFAULT_COMMISSION_LEVEL_LABELS } from '../../constants/referralCommissionRates';

/**
 * Themed provider × downline-level commission grid for the referral “Game commission rate” accordion.
 * Reuse for any category by passing `rows` (and optional column labels).
 */
export default function ReferralGameCommissionTable({
    rows = [],
    providerColumnLabel = 'Provider',
    levelLabels = DEFAULT_COMMISSION_LEVEL_LABELS,
    className = '',
}) {
    if (!rows.length) {
        return null;
    }

    const levelKeys = levelLabels.map((_, i) => `l${i + 1}`);

    return (
        <div
            className={[
                'overflow-hidden rounded-xl border border-[var(--color-border-brand)] bg-[var(--color-surface-base)] shadow-[var(--shadow-subtle)]',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-[var(--color-border-accent)] bg-surface-secondary-table-head">
                            <th
                                scope="col"
                                className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-[var(--color-text-card-text)] md:px-5 md:text-sm"
                            >
                                {providerColumnLabel}
                            </th>
                            {levelLabels.map((label) => (
                                <th
                                    key={label}
                                    scope="col"
                                    className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-[var(--color-text-card-text)] md:px-5 md:text-sm"
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr
                                key={row.id ?? row.provider}
                                className={[
                                    'border-b border-[var(--color-border-subtle)] last:border-b-0',
                                    idx % 2 === 1 ? 'bg-[var(--color-surface-subtle)]/70' : 'bg-[var(--color-surface-base)]',
                                ].join(' ')}
                            >
                                <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)] md:px-5 md:py-3.5">
                                    {row.provider}
                                </td>
                                {levelKeys.map((key) => (
                                    <td
                                        key={key}
                                        className="px-4 py-3 text-center text-sm font-bold tabular-nums text-[var(--color-button-hover)] md:px-5 md:py-3.5"
                                    >
                                        {row[key] ?? '—'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
