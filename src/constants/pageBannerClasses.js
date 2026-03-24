/**
 * Shared page banner layout: fixed 150px height on mobile (max-md), unchanged from md up.
 * Use with PAGE_BANNER_IMG or PAGE_BANNER_IMG_FILL on the <img>.
 */

export const PAGE_BANNER_WRAP =
    'relative overflow-hidden shadow-[var(--shadow-live-banner)] max-md:h-[150px] max-md:overflow-hidden';

/** Slots / Fishing: preserve wide aspect ratio on tablet+ */
export const PAGE_BANNER_WRAP_ASPECT = `${PAGE_BANNER_WRAP} md:aspect-[67/15]`;

/** Sports top strip keeps its border */
export const PAGE_BANNER_WRAP_SPORTS = `${PAGE_BANNER_WRAP} border border-[var(--color-border-live)]`;

/**
 * Default banner image: cover in fixed mobile strip; natural/intrinsic height from md+.
 */
export const PAGE_BANNER_IMG =
    'block w-full bg-[rgb(221_232_248)] max-md:h-full max-md:min-h-0 max-md:object-cover max-md:object-center md:h-auto md:w-full md:object-cover md:object-center';

/**
 * Inside `PAGE_BANNER_WRAP_ASPECT` (or any box with explicit height): fill with cover.
 */
export const PAGE_BANNER_IMG_FILL =
    'block h-full w-full bg-[rgb(221_232_248)] object-cover object-center';

/** VIP hero — mobile crop favors left side of artwork (object-position only; md+ unchanged) */
export const PAGE_BANNER_IMG_VIP =
    'block w-full bg-[rgb(216_227_242)] max-md:h-full max-md:min-h-0 max-md:object-cover max-md:object-[22%_center] md:h-auto md:w-full md:object-cover md:object-center';
