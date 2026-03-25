import React from 'react';

/** Button classes matching Promotion page category filters. */
export function promotionStyleTabButtonClassName(selected) {
    return `rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all duration-200 md:text-sm ${
        selected
            ? 'btn-theme-cta-soft border-amber-300 text-amber-950 shadow-[0_6px_12px_rgba(255,174,39,0.18)]'
            : 'border border-[var(--color-border-default)] bg-white text-[var(--color-text-main)] hover:border-[var(--color-accent-200)] hover:text-[var(--color-text-strong)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04)]'
    }`;
}

/**
 * Shared pill tabs (Promotion categories style).
 * @param {string[] | { id: string, label: string }[]} items
 * @param {string} value — active item id (for objects) or string value
 * @param {(id: string) => void} onChange
 * @param {'inline' | 'panel'} [variant] — `panel` wraps in the Promotion page bordered card
 */
export default function PromotionStyleTabs({
    items,
    value,
    onChange,
    variant = 'inline',
    className = '',
    panelClassName = '',
    tablistClassName = '',
    gapClassName = 'gap-2.5',
    ariaLabel,
}) {
    const list = (
        <div
            className={`flex flex-wrap ${gapClassName} ${tablistClassName}`.trim()}
            role="tablist"
            aria-label={ariaLabel}
        >
            {items.map((item) => {
                const id = typeof item === 'string' ? item : item.id;
                const label = typeof item === 'string' ? item : item.label;
                const selected = value === id;
                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(id)}
                        className={promotionStyleTabButtonClassName(selected)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );

    if (variant === 'panel') {
        return (
            <section
                className={`rounded-2xl border border-[rgb(228_234_243)] bg-[var(--color-surface-base)] p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] md:p-5 ${panelClassName} ${className}`.trim()}
            >
                {list}
            </section>
        );
    }

    return <div className={className}>{list}</div>;
}
