import React, { useRef } from 'react';
import HorizontalScrollTabRow, { scrollTabIntoViewSmooth } from './HorizontalScrollTabRow';

/** Button classes matching Promotion page category filters. */
export function promotionStyleTabButtonClassName(selected) {
    return `rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 md:text-sm ${
        selected
            ? 'btn-theme-tab-selected'
            : 'border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-glow)] hover:text-[var(--color-text-primary)] hover:shadow-[var(--shadow-subtle)]'
    }`;
}

/**
 * Shared pill tabs (Promotion categories style).
 * On small screens: single-row horizontal scroll (Bet Record–style); from `sm` up: wrapping row unchanged.
 * @param {string[] | { id: string, label: string }[]} items
 * @param {string} value — active item id (for objects) or string value
 * @param {(id: string) => void} onChange
 * @param {'inline' | 'panel'} [variant] — `panel` wraps in the Promotion page bordered card
 * @param {string} [tablistClassName] — classes on the horizontal scroll container
 * @param {string} [gapClassName] — extra classes on the inner row (use `!gap-*` to override default spacing)
 */
export default function PromotionStyleTabs({
    items,
    value,
    onChange,
    variant = 'inline',
    className = '',
    panelClassName = '',
    tablistClassName = '',
    gapClassName = '',
    ariaLabel,
}) {
    const tabRefs = useRef({});
    /** Lets callers e.g. `!gap-3 sm:!gap-3` override the scroll row’s default gaps. */
    const scrollInnerExtra = gapClassName.trim();

    const list = (
        <HorizontalScrollTabRow
            className={tablistClassName}
            innerClassName={scrollInnerExtra}
            innerListProps={{
                role: 'tablist',
                ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
            }}
        >
            {items.map((item) => {
                const id = typeof item === 'string' ? item : item.id;
                const label = typeof item === 'string' ? item : item.label;
                const selected = value === id;
                return (
                    <button
                        key={id}
                        ref={(el) => {
                            if (el) tabRefs.current[id] = el;
                            else delete tabRefs.current[id];
                        }}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => {
                            onChange(id);
                            scrollTabIntoViewSmooth(tabRefs.current[id]);
                        }}
                        className={`max-sm:snap-start shrink-0 whitespace-nowrap ${promotionStyleTabButtonClassName(selected)}`}
                    >
                        {label}
                    </button>
                );
            })}
        </HorizontalScrollTabRow>
    );

    if (variant === 'panel') {
        return (
            <section
                className={`rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] p-4 shadow-[var(--shadow-subtle)] md:p-5 ${panelClassName} ${className}`.trim()}
            >
                {list}
            </section>
        );
    }

    return <div className={className}>{list}</div>;
}
