/**
 * Date / filter quick-range pills — Cam88 color/surface/filter (inactive) + color/button/tabs (active).
 * Matches History Record screenshot: pale inactive shell, navy active pill + white label.
 */
export function filterPillClassName(selected, options = {}) {
    const {
        shape = 'rounded-xl',
        smMinWidthClass = 'sm:min-w-[96px]',
        extraClass = '',
    } = options;

    return [
        'caelo-filter-pill max-sm:snap-start shrink-0 whitespace-nowrap border px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm',
        shape,
        smMinWidthClass,
        selected ? 'caelo-filter-pill--active' : 'caelo-filter-pill--inactive',
        extraClass,
    ]
        .filter(Boolean)
        .join(' ');
}
