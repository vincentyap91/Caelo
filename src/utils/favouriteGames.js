/** Stable id for localStorage favourites (category + name + provider). */
export function buildFavouriteGameId(category, name, provider = '') {
    return `${category}::${name}::${provider}`;
}

/** Group favourites for Favourites page sections. */
export function isSlotsFavouritesSection(category) {
    return category === 'slots' || category === 'fishing' || category === 'home-top';
}
