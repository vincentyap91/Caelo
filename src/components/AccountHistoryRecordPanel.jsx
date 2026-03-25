import React, { useState } from 'react';
import CalendarDateInput from './CalendarDateInput';

function formatDateForInput(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const HISTORY_QUICK_RANGES = [
    { id: 'today', label: 'Today' },
    { id: '3days', label: 'In 3 days' },
    { id: 'week', label: 'In a week' },
    { id: 'month', label: 'In a month' },
];

/**
 * Shared “Referral Commission → History” filter + table shell (date range, quick ranges, Submit, empty table).
 * @param {Object} props
 * @param {string} props.startDateLabel
 * @param {string} props.endDateLabel
 * @param {{ key: string, label: string, align?: 'left'|'right' }[]} props.columns
 * @param {import('react').ReactNode} [props.filterSlot] — optional block above the date range (e.g. type filters).
 * @param {boolean} [props.pillQuickRanges] — use pill-shaped quick range buttons (e.g. Rewards Record modal).
 * @param {string} [props.emptyMessage] — centered table empty state (default “No data found”).
 */
export default function AccountHistoryRecordPanel({ startDateLabel, endDateLabel, columns, filterSlot = null, pillQuickRanges = false, emptyMessage = null }) {
    const today = new Date();
    const [historyStart, setHistoryStart] = useState(formatDateForInput(today));
    const [historyEnd, setHistoryEnd] = useState(formatDateForInput(new Date(today.getTime() + 86400000)));
    const [historyQuickRange, setHistoryQuickRange] = useState('today');

    const setHistoryRangeFromQuick = (id) => {
        setHistoryQuickRange(id);
        const end = new Date();
        let start = new Date();
        if (id === 'today') {
            start = new Date(end);
        } else if (id === '3days') {
            start.setDate(start.getDate() - 2);
        } else if (id === 'week') {
            start.setDate(start.getDate() - 6);
        } else if (id === 'month') {
            start.setDate(start.getDate() - 29);
        }
        setHistoryStart(formatDateForInput(start));
        setHistoryEnd(formatDateForInput(end));
    };

    const colCount = columns.length;

    return (
        <div className="space-y-6">
            <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                {filterSlot ? <div className="mb-5">{filterSlot}</div> : null}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CalendarDateInput
                        label={startDateLabel}
                        value={historyStart}
                        onChange={(e) => setHistoryStart(e.target.value)}
                    />
                    <CalendarDateInput
                        label={endDateLabel}
                        value={historyEnd}
                        onChange={(e) => setHistoryEnd(e.target.value)}
                    />
                </div>
                <div className={`mt-4 flex gap-2 ${pillQuickRanges ? 'flex-wrap sm:flex-nowrap' : ''}`}>
                    {HISTORY_QUICK_RANGES.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setHistoryRangeFromQuick(id)}
                            className={`min-w-0 flex-1 border px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                                pillQuickRanges ? 'rounded-full' : 'rounded-xl'
                            } ${
                                historyQuickRange === id
                                    ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-600)]'
                                    : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        className="btn-theme-cta inline-flex h-11 min-w-[120px] items-center justify-center rounded-[var(--radius-control)] px-6 text-sm font-bold text-white shadow-[var(--shadow-cta)] transition hover:scale-[1.02] hover:brightness-[1.02]"
                    >
                        Submit
                    </button>
                </div>
            </div>
            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[320px] border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] ${
                                            col.align === 'right' ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    colSpan={colCount}
                                    className="px-4 py-12 text-center text-sm font-medium text-[var(--color-text-muted)]"
                                >
                                    {emptyMessage ?? 'No data found'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
