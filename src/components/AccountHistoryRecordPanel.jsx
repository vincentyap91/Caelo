import React, { useEffect, useMemo, useRef, useState } from 'react';
import CalendarDateInput from './CalendarDateInput';
import HorizontalScrollTabRow, { scrollTabIntoViewSmooth } from './HorizontalScrollTabRow';
import TablePagination from './ui/TablePagination';
import { filterPillClassName } from './ui/filterPillClasses';

const DEFAULT_PAGE_SIZE = 5;

function formatDateForInput(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function parseHistoryDate(value) {
    if (!value) {
        return null;
    }

    const [datePart] = String(value).split(' ');
    const parts = datePart.split('-').map((part) => Number(part));

    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
        return null;
    }

    const [first, second, third] = parts;
    if (String(datePart).length === 10 && first > 31) {
        return new Date(first, second - 1, third);
    }

    if (String(datePart).length === 10 && third > 31) {
        return new Date(third, second - 1, first);
    }

    if (first > 31) {
        return new Date(first, second - 1, third);
    }

    return new Date(third, second - 1, first);
}

function getStatusTone(value) {
    const normalized = String(value ?? '').trim().toLowerCase();

    if (!normalized) {
        return 'neutral';
    }

    if (
        normalized.includes('success') ||
        normalized.includes('completed') ||
        normalized.includes('approved') ||
        normalized.includes('claimed') ||
        normalized.includes('cleared')
    ) {
        return 'success';
    }

    if (
        normalized.includes('pending') ||
        normalized.includes('processing') ||
        normalized.includes('in progress') ||
        normalized.includes('ongoing')
    ) {
        return 'warning';
    }

    if (
        normalized.includes('failed') ||
        normalized.includes('rejected') ||
        normalized.includes('cancelled') ||
        normalized.includes('canceled') ||
        normalized.includes('declined')
    ) {
        return 'danger';
    }

    return 'neutral';
}

function getStatusPillClassName(value) {
    const tone = getStatusTone(value);
    const base = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none';

    if (tone === 'success') {
        return `${base} border-[var(--color-success-vivid)]/25 bg-[var(--color-success-vivid)]/12 text-[var(--color-success-vivid)]`;
    }

    if (tone === 'warning') {
        return `${base} border-[var(--color-warning)]/30 bg-[var(--color-warning)]/15 text-[var(--color-text-sub-title)]`;
    }

    if (tone === 'danger') {
        return `${base} border-[var(--color-danger)]/22 bg-[var(--color-danger)]/10 text-[var(--color-danger-red)]`;
    }

    return `${base} border-[var(--color-border-subtle)] bg-[var(--color-surface-filter)] text-[var(--color-text-muted)]`;
}

const HISTORY_QUICK_RANGES = [
    { id: 'today', label: 'Today' },
    { id: '3days', label: 'In 3 days' },
    { id: 'week', label: 'In a week' },
    { id: 'month', label: 'In a month' },
];

/**
 * Shared filter + table shell for history/record pages.
 * @param {Object} props
 * @param {string} props.startDateLabel
 * @param {string} props.endDateLabel
 * @param {{ key: string, label: string, align?: 'left'|'right' }[]} props.columns
 * @param {Array<Record<string, any>>} [props.rows]
 * @param {string} [props.rowDateKey]
 * @param {import('react').ReactNode} [props.filterSlot]
 * @param {boolean} [props.pillQuickRanges]
 * @param {string} [props.emptyMessage]
 * @param {number} [props.pageSize]
 */
export default function AccountHistoryRecordPanel({
    startDateLabel,
    endDateLabel,
    columns,
    rows = [],
    rowDateKey = 'date',
    filterSlot = null,
    pillQuickRanges = false,
    emptyMessage = null,
    pageSize = DEFAULT_PAGE_SIZE,
}) {
    const quickTabRefs = useRef({});
    const today = new Date();
    const [historyStart, setHistoryStart] = useState(formatDateForInput(today));
    const [historyEnd, setHistoryEnd] = useState(formatDateForInput(new Date(today.getTime() + 86400000)));
    const [historyQuickRange, setHistoryQuickRange] = useState('today');
    const [currentPage, setCurrentPage] = useState(1);

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
    const startDate = parseHistoryDate(historyStart);
    const endDate = parseHistoryDate(historyEnd);
    const filteredRows = rows.filter((row) => {
        const rowDate = parseHistoryDate(row?.[rowDateKey]);
        if (!rowDate || !startDate || !endDate) {
            return true;
        }

        const rowTime = rowDate.getTime();
        return rowTime >= startDate.getTime() && rowTime <= endDate.getTime();
    });

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

    useEffect(() => {
        setCurrentPage(1);
    }, [historyStart, historyEnd, rows, pageSize]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredRows.slice(startIndex, startIndex + pageSize);
    }, [filteredRows, currentPage, pageSize]);

    const quickRangeButtonClass = (selected) =>
        filterPillClassName(selected, { shape: pillQuickRanges ? 'rounded-full' : 'rounded-xl' });

    return (
        <div className="history-record-panel space-y-6">
            <div className="history-record-filter-card surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
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
                <HorizontalScrollTabRow className="mt-4">
                    {HISTORY_QUICK_RANGES.map(({ id, label }) => (
                        <button
                            key={id}
                            ref={(el) => {
                                if (el) quickTabRefs.current[id] = el;
                                else delete quickTabRefs.current[id];
                            }}
                            type="button"
                            onClick={() => {
                                setHistoryRangeFromQuick(id);
                                scrollTabIntoViewSmooth(quickTabRefs.current[id]);
                            }}
                            className={quickRangeButtonClass(historyQuickRange === id)}
                        >
                            {label}
                        </button>
                    ))}
                </HorizontalScrollTabRow>
                <div className="mt-4">
                    <button
                        type="button"
                        className="history-record-submit btn-theme-cta inline-flex h-11 min-w-[120px] items-center justify-center rounded-[var(--radius-control)] px-6 text-sm font-bold text-[var(--color-button-cta-primary)] shadow-[var(--shadow-cta)] transition hover:scale-[1.02] hover:brightness-[1.02]"
                    >
                        Submit
                    </button>
                </div>
            </div>

            <div className="history-record-table-card surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="overflow-x-auto">
                    <table className="history-record-table w-full min-w-[320px] border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-table)]">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)] ${
                                            col.align === 'right' ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.length > 0 ? (
                                paginatedRows.map((row, rowIndex) => (
                                    <tr
                                        key={row.id ?? `${rowIndex}-${rowDateKey}`}
                                        className="border-b border-[var(--color-border-subtle)] transition hover:bg-[var(--color-surface-deep)]"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={`px-4 py-3.5 text-sm font-medium text-[var(--color-text-primary)] ${
                                                    col.align === 'right' ? 'text-right' : 'text-left'
                                                }`}
                                            >
                                                {col.key === 'status' ? (
                                                    <span className={getStatusPillClassName(row?.[col.key])}>
                                                        {row?.[col.key] ?? '—'}
                                                    </span>
                                                ) : (
                                                    row?.[col.key] ?? '—'
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={colCount} className="history-record-empty-cell p-4 sm:p-5">
                                        <div className="history-record-empty-state px-4 py-12 text-center text-sm font-medium text-[var(--color-text-primary)]">
                                            {emptyMessage ?? 'No data found'}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="history-record-table-footer">
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
