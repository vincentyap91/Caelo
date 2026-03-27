import React from 'react';

function alignClass(align) {
    if (align === 'right') return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
}

/**
 * Generic striped table for ranking / latest bets.
 * @param {Object} props
 * @param {{ key: string, label: string, align?: 'left'|'right'|'center', highlight?: boolean }[]} props.columns
 * @param {Record<string, string|number>[]} props.rows
 * @param {boolean} [props.striped] — alternate row backgrounds
 */
export default function GameDetailDataTable({ columns = [], rows = [], striped = true }) {
    if (columns.length === 0) return null;

    return (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] shadow-[var(--shadow-card-soft)]">
            <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-muted)]">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={`px-4 py-3.5 text-sm font-bold text-[var(--color-text-strong)] md:px-5 md:py-4 ${alignClass(col.align)}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, ri) => (
                        <tr
                            key={row.id ?? ri}
                            className={`border-b border-[var(--color-border-default)] last:border-b-0 ${
                                striped && ri % 2 === 1 ? 'bg-[var(--color-accent-50)]/60' : ''
                            }`}
                        >
                            {columns.map((col) => {
                                const raw = row[col.key];
                                const isHighlight = col.highlight;
                                return (
                                    <td
                                        key={col.key}
                                        className={`px-4 py-3 font-medium leading-snug text-[var(--color-text-main)] md:px-5 md:py-3.5 ${alignClass(col.align)} ${
                                            isHighlight ? 'font-bold text-[var(--color-cta-strong-end)] tabular-nums' : ''
                                        }`}
                                    >
                                        {raw}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
