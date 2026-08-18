/** Day (white) / night (dark) sportsbook chrome. Default is white. */

export const SPORTSBOOK_SKIN_STORAGE_KEY = 'caelo-sportsbook-skin';
export const SPORTSBOOK_SKIN_DEFAULT = 'light';

/** White-chrome sportsbook previews — dark `/sportsbook/<slug>` originals stay unchanged. */
export const SPORTSBOOK_LIGHT_SLUGS = {
  'national-team': 'sportsbook-light-national-team',
  'big-tournaments': 'sportsbook-light-big-tournaments',
  'long-term-bets': 'sportsbook-light-long-term-bets',
  'multi-live': 'sportsbook-light-multi-live',
  'live-national-team': 'sportsbook-light-live-national-team',
  'marble-live': 'sportsbook-light-marble-live',
  'fast-bet': 'sportsbook-light-fast-bet',
  esports: 'sportsbook-light-esports',
};

const DARK_PAGE_TO_LIGHT = {
  sportsbook: 'sportsbook-light',
  'sportsbook-national-team': 'sportsbook-light-national-team',
  'sportsbook-big-tournaments': 'sportsbook-light-big-tournaments',
  'sportsbook-long-term-bets': 'sportsbook-light-long-term-bets',
  'sportsbook-multi-live': 'sportsbook-light-multi-live',
  'sportsbook-live-national-team': 'sportsbook-light-live-national-team',
  'sportsbook-marble-live': 'sportsbook-light-marble-live',
  'sportsbook-fast-bet': 'sportsbook-light-fast-bet',
  'sportsbook-esports': 'sportsbook-light-esports',
};

const LIGHT_PAGE_TO_DARK = Object.fromEntries(
  Object.entries(DARK_PAGE_TO_LIGHT).map(([dark, light]) => [light, dark]),
);

export function getSportsbookSkin() {
  try {
    const value = window.localStorage.getItem(SPORTSBOOK_SKIN_STORAGE_KEY);
    if (value === 'dark' || value === 'light') return value;
  } catch {
    /* ignore */
  }
  return SPORTSBOOK_SKIN_DEFAULT;
}

export function setSportsbookSkin(skin) {
  try {
    window.localStorage.setItem(
      SPORTSBOOK_SKIN_STORAGE_KEY,
      skin === 'dark' ? 'dark' : 'light',
    );
  } catch {
    /* ignore */
  }
}

export function toCanonicalSportsbookPage(pageId) {
  if (pageId === 'sportsbook-light') return 'sportsbook';
  if (typeof pageId === 'string' && pageId.startsWith('sportsbook-light-')) {
    return `sportsbook-${pageId.slice('sportsbook-light-'.length)}`;
  }
  return pageId;
}

export function sportsbookSkinFromPage(pageId) {
  if (pageId === 'sportsbook-light' || (typeof pageId === 'string' && pageId.startsWith('sportsbook-light-'))) {
    return 'light';
  }
  if (DARK_PAGE_TO_LIGHT[pageId]) return 'dark';
  return null;
}

export function applySportsbookSkinToPage(pageId, skin = getSportsbookSkin()) {
  if (skin === 'light') return DARK_PAGE_TO_LIGHT[pageId] ?? pageId;
  return LIGHT_PAGE_TO_DARK[pageId] ?? pageId;
}

export function applySportsbookSkinToPath(path, skin = getSportsbookSkin()) {
  if (typeof path !== 'string') return path;
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] ?? path;
  const suffix = match?.[2] ?? '';
  const p = pathname.toLowerCase();
  if (!p.startsWith('/sportsbook')) return path;

  if (skin === 'light') {
    if (p === '/sportsbook/light' || p.startsWith('/sportsbook/light/')) return path;
    if (p === '/sportsbook') return `/sportsbook/light${suffix}`;
    const rest = p.slice('/sportsbook/'.length);
    const slug = rest.split('/')[0];
    if (SPORTSBOOK_LIGHT_SLUGS[slug] && rest === slug) {
      return `/sportsbook/light/${slug}${suffix}`;
    }
    return path;
  }

  if (p === '/sportsbook/light') return `/sportsbook${suffix}`;
  if (p.startsWith('/sportsbook/light/')) {
    return `/sportsbook/${p.slice('/sportsbook/light/'.length)}${suffix}`;
  }
  return path;
}

export function sportsbookMenuItemIsActive(itemPage, activePage) {
  return toCanonicalSportsbookPage(itemPage) === toCanonicalSportsbookPage(activePage);
}

export function hasSportsbookDualSkin(pageId) {
  return Boolean(DARK_PAGE_TO_LIGHT[pageId] || LIGHT_PAGE_TO_DARK[pageId]);
}
