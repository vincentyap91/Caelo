import React from 'react';

/**
 * A shared Segmented Control / Tab component used for main navigation tabs
 * such as FAQ, T&C, Bet Rules, etc.
 *
 * @param {'equal' | 'fit'} [layout] - 'equal': all tabs same width; 'fit': tabs fit content width.
 * @param {string} [className] - Optional extra classes for the container
 */
export default function SegmentedTabs({ items, value, onChange, layout = 'equal', className = '' }) {
    const isEqual = layout === 'equal';

    return (
        <div
            className={`flex gap-1 overflow-x-auto rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-1 shadow-[var(--shadow-subtle)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isEqual ? 'w-full' : 'w-fit'
                } ${className}`}
        >
            {items.map((item) => {
                const id = typeof item === 'string' ? item : item.id;
                const label = typeof item === 'string' ? item : item.label;
                const active = value === id;

                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onChange(id)}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 py-3 text-xs font-bold transition sm:px-4 sm:py-2.5 sm:text-sm ${isEqual ? 'flex-1 min-w-0' : 'px-4'
                            } ${active
                                ? 'btn-theme-primary shadow-sm'
                                : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]'
                            }`}
                    >
                        <span className="line-clamp-2 w-full text-center leading-tight">
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
