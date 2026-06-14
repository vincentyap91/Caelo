import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Up to 7 pages show every number (e.g. 1 2 3 4 5 6); beyond that use ellipsis. */
function buildPageItems(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => ({
            type: 'page',
            value: index + 1,
        }));
    }

    const items = [];
    const addPage = (page) => items.push({ type: 'page', value: page });
    const addEllipsis = (id) => items.push({ type: 'ellipsis', id });

    addPage(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
        addEllipsis('left');
    } else {
        for (let page = 2; page < start; page += 1) {
            addPage(page);
        }
    }

    for (let page = start; page <= end; page += 1) {
        addPage(page);
    }

    if (end < totalPages - 1) {
        addEllipsis('right');
    } else {
        for (let page = end + 1; page < totalPages; page += 1) {
            addPage(page);
        }
    }

    addPage(totalPages);

    return items;
}

/**
 * Shared table pagination — Cam88 color/button/pagination + color/button/cta/pagination.
 * Caelo look via `.table-pagination` scoped tokens in styles/theme.css.
 */
export default function TablePagination({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
    ariaLabel = 'Table pagination',
}) {
    const safeTotal = Math.max(1, totalPages);
    const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
    const pageItems = useMemo(
        () => buildPageItems(safeCurrent, safeTotal),
        [safeCurrent, safeTotal]
    );

    const canGoPrev = safeCurrent > 1;
    const canGoNext = safeCurrent < safeTotal;

    return (
        <nav className={`table-pagination ${className}`.trim()} aria-label={ariaLabel}>
            <button
                type="button"
                className="table-pagination__arrow"
                onClick={() => onPageChange(safeCurrent - 1)}
                disabled={!canGoPrev}
                aria-label="Previous page"
            >
                <ChevronLeft size={15} strokeWidth={2.25} aria-hidden />
            </button>

            <div className="table-pagination__pages" role="group" aria-label="Page numbers">
                {pageItems.map((item) => {
                    if (item.type === 'ellipsis') {
                        return (
                            <span
                                key={`ellipsis-${item.id}`}
                                className="table-pagination__ellipsis"
                                aria-hidden
                            >
                                …
                            </span>
                        );
                    }

                    const isActive = item.value === safeCurrent;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            className={`table-pagination__page${isActive ? ' is-active' : ''}`}
                            onClick={() => onPageChange(item.value)}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`Page ${item.value}`}
                        >
                            {item.value}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                className="table-pagination__arrow"
                onClick={() => onPageChange(safeCurrent + 1)}
                disabled={!canGoNext}
                aria-label="Next page"
            >
                <ChevronRight size={15} strokeWidth={2.25} aria-hidden />
            </button>
        </nav>
    );
}
