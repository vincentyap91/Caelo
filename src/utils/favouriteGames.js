/** Stable id for localStorage favourites (category + name + provider). */
export function buildFavouriteGameId(category, name, provider = '') {
    return `${category}::${name}::${provider}`;
}

const SLOT_SECTION_CATEGORIES = new Set(['slots', 'fishing', 'home-top']);
const SPORTS_GAME_CATEGORIES = new Set(['sports-game']);
const SPORTS_COMPETITION_CATEGORIES = new Set(['sports-competition']);

/** Group favourites for Favourites page sections. */
export function isSlotsFavouritesSection(category) {
    return SLOT_SECTION_CATEGORIES.has(category);
}

export function normalizeFavouriteCategory(category, name = '') {
    if (category !== 'sports') return category;
    return /virtual sports/i.test(name) ? 'sports-game' : 'sports-competition';
}

export function isSportsFavouriteCategory(category) {
    return SPORTS_GAME_CATEGORIES.has(category) || SPORTS_COMPETITION_CATEGORIES.has(category);
}

export function getSportsFavouriteSectionId(item) {
    const normalizedCategory = normalizeFavouriteCategory(item?.category, item?.name);
    if (SPORTS_GAME_CATEGORIES.has(normalizedCategory)) {
        return 'games';
    }
    if (SPORTS_COMPETITION_CATEGORIES.has(normalizedCategory)) {
        return 'competitions';
    }
    return null;
}
