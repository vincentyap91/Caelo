import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * @param {Object} props
 * @param {{ label: string, href?: string, onNavigate?: () => void }[]} props.items â€” last item is highlighted as current.
 */
export default function GameDetailBreadcrumb({ items = [] }) {
    if (items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-text-muted)] md:text-sm">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <React.Fragment key={`${item.label}-${index}`}>
                        {index > 0 && <ChevronRight size={14} className="shrink-0 text-[var(--color-text-soft)]" aria-hidden />}
                        {isLast ? (
                            <span className="inline-flex items-center rounded-full bg-[var(--color-accent-600)] px-3 py-1 text-xs font-bold text-white shadow-sm md:text-sm">
                                {item.label}
                            </span>
                        ) : item.onNavigate || item.href ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (item.onNavigate) item.onNavigate();
                                    else if (item.href) window.location.assign(item.href);
                                }}
                                className="font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-accent-600)]"
                            >
                                {item.label}
                            </button>
                        ) : (
                            <span className="font-medium text-[var(--color-text-muted)]">{item.label}</span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}

