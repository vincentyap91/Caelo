import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

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

    return (
        <div
            role="search"
            className={`group flex h-11 min-h-[44px] min-w-0 items-center rounded-[var(--radius-control)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-0 pl-3 pr-1.5 shadow-[var(--shadow-input)] transition-all hover:border-[var(--color-accent-200)] focus-within:border-[var(--color-accent-400)] focus-within:ring-2 focus-within:ring-[var(--color-accent-400)]/20 ${widthClassName} ${className}`.trim()}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-1">
                <Search
                    size={16}
                    strokeWidth={2.25}
                    className="shrink-0 text-[var(--color-text-brand)]"
                    aria-hidden
                />
                <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    aria-label={ariaLabel ?? placeholder}
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] [&::-webkit-search-cancel-button]:hidden"
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-accent-50)] hover:text-[var(--color-text-primary)]"
                        aria-label="Clear search"
                    >
                        <X size={16} strokeWidth={2.25} aria-hidden />
                    </button>
                </div>
            ) : null}
        </div>
    );
}
