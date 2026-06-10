/**
 * Live Casino lobby page — layout + assets aligned with 12WIN /en/casino (GameLobby caelo).
 * Tile art: `src/assets/live-casino/` (same sources as 12WIN nav / lobby).
 */
import liveCasinoHeroBanner from '../assets/live-casino/category-banner-livecasino.webp';

/** Fixed hero — same source as 12WIN: cdn.ike4.com category_banner_livecasino */
export const LIVE_CASINO_HERO_BANNER = liveCasinoHeroBanner;

/** Provider grid: 2 → 3 → 6 columns like 12WIN desktop. */
export const LIVE_CASINO_PROVIDER_GRID_CLASS =
    'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6';
