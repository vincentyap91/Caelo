import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/** Web_Slot - Cam88 (781:13837 / 903:25656) search field semantics (§13.11). */
export const SLOTS_BROWSE_SEARCH_CLASS =
    'slots-browse-search border-[var(--color-border-subtle)] bg-[var(--color-surface-input-inverse)] focus-within:border-[var(--color-primary)] focus-within:ring-[var(--color-primary)]/20 hover:border-[var(--color-border-brand)]';

/**
 * Controlled provider/game search field with clear (X).
 * Callers own `value` / `onChange`; pass a stable `category` key so the query resets when
 * the user moves between category routes or mobile category tabs.
 */
export default function SearchProvider({
    value,
    onChange,
    category,
    placeholder = 'Search provider',
    ariaLabel,
    className = '',
    widthClassName = 'w-full',
    searchSemantics = 'default',
}) {
    const inputRef = useRef(null);
    const isFirstCategoryRender = useRef(true);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const hasText = Boolean(String(value ?? '').trim());

    useEffect(() => {
        if (isFirstCategoryRender.current) {
            isFirstCategoryRender.current = false;
            return;
        }
        onChangeRef.current('');
    }, [category]);

    const isSlotsSearch = searchSemantics === 'slots' || className.includes('slots-browse-search');
    const shellClass = isSlotsSearch
        ? `group flex h-11 min-h-[44px] min-w-0 items-center rounded-[var(--radius-control)] border py-0 pl-3 pr-1.5 shadow-[var(--shadow-input)] transition-all focus-within:ring-2 ${SLOTS_BROWSE_SEARCH_CLASS}`
        : `group flex h-11 min-h-[44px] min-w-0 items-center rounded-[var(--radius-control)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-0 pl-3 pr-1.5 shadow-[var(--shadow-input)] transition-all hover:border-[var(--color-accent-glow)] focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20`;
    const iconClass = isSlotsSearch
        ? 'shrink-0 text-[var(--color-info-icon)]'
        : 'shrink-0 text-[var(--color-text-primary-card-title)]';
    const inputClass = isSlotsSearch
        ? 'min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-info-icon)] [&::-webkit-search-cancel-button]:hidden'
        : 'min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] [&::-webkit-search-cancel-button]:hidden';

    return (
        <div
            role="search"
            className={`${shellClass} ${widthClassName} ${className}`.trim()}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-1">
                <Search
                    size={16}
                    strokeWidth={2.25}
                    className={iconClass}
                    aria-hidden
                />
                <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    aria-label={ariaLabel ?? placeholder}
                    className={inputClass}
                />
            </div>
            {hasText ? (
                <div className="flex shrink-0 items-center justify-end self-stretch pl-2">
                    <button
                        type="button"
                        onClick={() => {
                            onChange('');
                            inputRef.current?.focus();
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-text-primary)]"
                        aria-label="Clear search"
                    >
                        <X size={16} strokeWidth={2.25} aria-hidden />
                    </button>
                </div>
            ) : null}
        </div>
    );
}
