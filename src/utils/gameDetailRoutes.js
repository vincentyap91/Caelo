import { SLOT_GAMES, FISHING_GAMES, EXTRA_GAME_DETAIL_ENTRIES } from '../constants/gameCatalogs';
import { ALL_LOBBY_GAMES } from '../constants/lobbyRegistry';

/**
 * URL-safe segment from a display string (game title, provider name).
 */
export function slugifySegment(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'game';
}

/**
 * Stable slug for `/game/:slug` — name + provider disambiguates duplicates.
 */
export function buildGameDetailSlug(name, provider = '') {
    const a = slugifySegment(name);
    const b = provider ? slugifySegment(provider) : '';
    return b ? `${a}--${b}` : a;
}

/**
 * @param {string} pathname — `window.location.pathname`
 * @returns {string|null} decoded slug after `/game/`, or null for `/game` or non-game paths
 */
export function parseGameDetailSlugFromPathname(pathname) {
    const lower = pathname.toLowerCase();
    if (lower === '/game' || lower === '/game/') return null;
    if (!pathname.toLowerCase().startsWith('/game/')) return null;
    const raw = pathname.slice('/game/'.length);
    if (!raw) return null;
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

export function buildGameDetailPath(slug) {
    return `/game/${encodeURIComponent(slug)}`;
}

function allSlotLikeGames() {
    return [...SLOT_GAMES, ...EXTRA_GAME_DETAIL_ENTRIES];
}

/**
 * @returns {object | null} Resolved game / lobby row with categoryLabel, categoryPage, kind
 */
export function findGameDetailBySlug(slug) {
    if (!slug) return null;
    const slot = SLOT_GAMES.find((g) => buildGameDetailSlug(g.name, g.provider) === slug);
    if (slot) {
        return { ...slot, categoryLabel: 'Slots', categoryPage: 'slots', kind: 'slots' };
    }
    const extra = EXTRA_GAME_DETAIL_ENTRIES.find((g) => buildGameDetailSlug(g.name, g.provider) === slug);
    if (extra) {
        return { ...extra };
    }
    const fish = FISHING_GAMES.find((g) => buildGameDetailSlug(g.name, g.provider) === slug);
    if (fish) {
        return { ...fish, categoryLabel: 'Fishing', categoryPage: 'fishing', kind: 'fishing' };
    }
    const lobby = ALL_LOBBY_GAMES.find((g) => buildGameDetailSlug(g.name, g.provider) === slug);
    if (lobby) {
        return { ...lobby };
    }
    return null;
}

/**
 * Carousel rows for the detail page — excludes current slug; falls back to popular slots.
 * @param {string|null} slug
 * @param {object|null} resolved — from findGameDetailBySlug
 * @returns {{ id: string, name: string, provider: string, imgUrl: string }[]}
 */
export function getRecommendedGamesForDetail(slug, resolved) {
    const toCarousel = (g) => ({
        id: buildGameDetailSlug(g.name, g.provider),
        name: g.name,
        provider: g.provider,
        imgUrl: g.imgUrl,
    });

    if (!resolved) {
        return allSlotLikeGames().slice(0, 4).map(toCarousel);
    }

    if (resolved.kind === 'slots') {
        return allSlotLikeGames()
            .filter((g) => buildGameDetailSlug(g.name, g.provider) !== slug)
            .slice(0, 4)
            .map(toCarousel);
    }

    if (resolved.kind === 'fishing') {
        return FISHING_GAMES.filter((g) => buildGameDetailSlug(g.name, g.provider) !== slug)
            .slice(0, 4)
            .map(toCarousel);
    }

    if (resolved.kind === 'lobby') {
        return allSlotLikeGames().slice(0, 4).map(toCarousel);
    }

    return allSlotLikeGames().slice(0, 4).map(toCarousel);
}

/** SPA helper: navigate to `/game/:slug` for name + provider. */
export function navigateToGameDetail(onNavigate, name, provider) {
    if (!onNavigate || !name) return;
    onNavigate('game-detail', { gameSlug: buildGameDetailSlug(name, provider ?? '') });
}

/** Fallback title when slug has no catalog match. */
export function titleFromUnknownGameSlug(slug) {
    if (!slug) return 'Game';
    const namePart = slug.includes('--') ? slug.split('--')[0] : slug;
    return namePart
        .split('-')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}
