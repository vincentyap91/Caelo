import React, { useEffect, useRef, useState } from 'react';
import '../styles/sportsbook-bridge.css';

const BASE_STYLESHEETS = [
  '/sportsbook/css/styles.css',
  '/sportsbook/css/auth-modals.css',
  '/sportsbook/css/account.css',
  '/sportsbook/mobile/css/mobile-sports-filter.css',
  '/sportsbook/mobile/css/mobile-markets-filter.css',
];

const EVENT_STYLESHEETS = [
  '/sportsbook/css/multi-live.css',
  '/sportsbook/css/event.css',
];

const MODE_STYLESHEETS = {
  'big-tournaments': [
    '/sportsbook/css/big-tournaments.css',
    '/sportsbook/mobile/css/mobile-big-tournaments.css',
  ],
  'long-term-bets': [
    '/sportsbook/css/long-term-bets.css',
    '/sportsbook/mobile/css/mobile-long-term.css',
  ],
  'fast-bet': ['/sportsbook/css/fast-bet.css'],
  'multi-live': ['/sportsbook/css/multi-live.css'],
  wc2026: ['/sportsbook/css/wc2026.css', '/sportsbook/css/top-events-theme.css'],
  msi: ['/sportsbook/css/msi.css', '/sportsbook/css/top-events-theme.css'],
  favourites: ['/sportsbook/css/favourites.css'],
  search: ['/sportsbook/css/search.css'],
  esports: ['/sportsbook/css/esports.css'],
};

/** Caelo orange+blue remap — must load LAST so it wins over 1xbet tokens */
const PALETTE_STYLESHEET = '/sportsbook/css/caelo-palette.css';

const BASE_SCRIPTS = [
  '/sportsbook/js/favourites-store.js',
  '/sportsbook/js/bet-slip-store.js',
  '/sportsbook/js/accumulators.js',
  '/sportsbook/js/bet-save-load.js',
  '/sportsbook/js/bet-slip-generator.js',
  '/sportsbook/js/shared-bet-slip.js',
  '/sportsbook/js/script.js',
  '/sportsbook/js/auth-modals.js',
  '/sportsbook/mobile/js/mobile-sports-filter.js',
  '/sportsbook/mobile/js/mobile-markets-filter.js',
];

/** Modes that use dedicated page JS instead of (or after) the live-events table shell */
const MODE_EXTRA_SCRIPTS = {
  event: ['/sportsbook/js/event.js'],
  'big-tournaments': ['/sportsbook/js/big-tournaments.js'],
  'long-term-bets': ['/sportsbook/js/long-term-bets.js'],
  'fast-bet': ['/sportsbook/js/fast-bet.js'],
  'multi-live': ['/sportsbook/js/multi-live.js'],
  wc2026: ['/sportsbook/js/top-events.js'],
  msi: ['/sportsbook/js/top-events.js'],
  favourites: ['/sportsbook/js/favourites-page.js'],
  search: ['/sportsbook/js/search-page.js'],
  esports: ['/sportsbook/js/esports.js'],
};

/** Skip heavy live-table script.js on pages that own their own demo board */
const SKIP_SCRIPT_JS = new Set(['big-tournaments', 'long-term-bets', 'fast-bet', 'favourites', 'search']);

const MODE_LAYOUT = {
  home: '/sportsbook/partials/sportsbook-layout.html',
  event: '/sportsbook/partials/sportsbook-event-layout.html',
  'national-team': '/sportsbook/partials/sportsbook-national-team-layout.html',
  'live-national-team': '/sportsbook/partials/sportsbook-live-national-team-layout.html',
  sports: '/sportsbook/partials/sportsbook-sports-layout.html',
  'long-term-bets': '/sportsbook/partials/sportsbook-long-term-bets-layout.html',
  'big-tournaments': '/sportsbook/partials/sportsbook-big-tournaments-layout.html',
  'marble-live': '/sportsbook/partials/sportsbook-marble-live-layout.html',
  'fast-bet': '/sportsbook/partials/sportsbook-fast-bet-layout.html',
  'multi-live': '/sportsbook/partials/sportsbook-multi-live-layout.html',
  wc2026: '/sportsbook/partials/sportsbook-wc2026-layout.html',
  msi: '/sportsbook/partials/sportsbook-msi-layout.html',
  favourites: '/sportsbook/partials/sportsbook-favourites-layout.html',
  search: '/sportsbook/partials/sportsbook-search-layout.html',
  esports: '/sportsbook/partials/sportsbook-esports-layout.html',
};

const MODE_DATA_PAGE = {
  home: 'home',
  event: 'event',
  'national-team': 'national-team',
  'live-national-team': 'live-national-team',
  sports: 'sports',
  'long-term-bets': 'long-term-bets',
  'big-tournaments': 'big-tournaments',
  'marble-live': 'marble-live',
  'fast-bet': 'fast-bet',
  'multi-live': 'multi-live',
  wc2026: 'wc2026',
  msi: 'msi',
  favourites: 'favourites',
  search: 'search',
  esports: 'esports',
};

export const SPORTSBOOK_MODES = Object.keys(MODE_LAYOUT);

const MARKER = 'data-sportsbook-port';
/** Must match public/sportsbook/js/auth-modals.js AUTH_KEY */
const SPORTSBOOK_AUTH_KEY = '1xbet_logged_in';

function loadStylesheet(href) {
  return new Promise((resolve, reject) => {
    document.querySelectorAll(`link[${MARKER}][data-href="${href}"]`).forEach((el) => el.remove());
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}${href.includes('?') ? '&' : '?'}port=${Date.now()}`;
    link.setAttribute(MARKER, '1');
    link.setAttribute('data-href', href);
    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(link);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const url = `${src}${src.includes('?') ? '&' : '?'}port=${Date.now()}`;
    const script = document.createElement('script');
    script.src = url;
    script.async = false;
    script.setAttribute(MARKER, '1');
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function removePortAssets() {
  document.querySelectorAll(`[${MARKER}]`).forEach((el) => el.remove());
  // Auth / bet-slip JS injects backdrops onto document.body — remove on leave
  document
    .querySelectorAll(
      '#auth-backdrop, .bss-backdrop, #ds-event-info, .ba-backdrop, .sbs-backdrop, .tsp-backdrop, .bh-desktop-backdrop, #mh-mf, #right-sidebar[data-shared-bet-slip="1"], #bsg-overlay'
    )
    .forEach((el) => el.remove());
}

function isFigmaCapturePreview() {
  try {
    return Boolean(new URLSearchParams(window.location.search).get("figmaCapture"));
  } catch {
    return false;
  }
}

function syncSportsbookAuth(loggedIn) {
  const on = !!loggedIn;
  try {
    if (on) sessionStorage.setItem(SPORTSBOOK_AUTH_KEY, '1');
    else sessionStorage.removeItem(SPORTSBOOK_AUTH_KEY);
  } catch {
    /* ignore */
  }

  if (window.AuthModals && typeof window.AuthModals.setLoggedIn === 'function') {
    window.AuthModals.setLoggedIn(on);
    return;
  }

  document.body.classList.toggle('is-logged-in', on);
  if (typeof window.syncBetSlipAuthUi === 'function') {
    window.syncBetSlipAuthUi();
  }
}

function scriptsForMode(mode) {
  const base = SKIP_SCRIPT_JS.has(mode)
    ? BASE_SCRIPTS.filter((src) => !src.endsWith('/script.js') && !src.endsWith('/accumulators.js'))
    : BASE_SCRIPTS;
  return [...base, ...(MODE_EXTRA_SCRIPTS[mode] || [])];
}

/**
 * 1xBet sportsbook middle shell + chrome (Canon): layout, colors, buttons, modals.
 * mode maps to body[data-page] + partial layout (home / event / national-team / …).
 * Caelo Navbar/Footer stay in App.jsx. No 1xbet header/footer/home-social.
 */
export default function SportsbookPage({
  authUser = null,
  mode = 'home',
  onNavigate,
  onLoginClick,
}) {
  const shellRef = useRef(null);
  const [booted, setBooted] = useState(false);
  const [error, setError] = useState(null);
  const loggedIn = !!authUser || isFigmaCapturePreview();
  const resolvedMode = MODE_LAYOUT[mode] ? mode : 'home';
  const dataPage = MODE_DATA_PAGE[resolvedMode] || 'home';
  const isEvent = resolvedMode === 'event';
  const onNavigateRef = useRef(onNavigate);
  const onLoginClickRef = useRef(onLoginClick);
  onNavigateRef.current = onNavigate;
  onLoginClickRef.current = onLoginClick;

  useEffect(() => {
    /* Multi-LIVE is desktop-only — 1xbet sends ≤900 to Live National Team */
    if (resolvedMode === 'multi-live' && window.matchMedia('(max-width: 900px)').matches) {
      onNavigateRef.current?.('sportsbook-live-national-team', { path: '/sportsbook/live-national-team' });
      return undefined;
    }

    let cancelled = false;
    const prevPage = document.body.dataset.page;
    const hadLoggedInClass = document.body.classList.contains('is-logged-in');
    const hadEventPageClass = document.body.classList.contains('ds-event-page');
    const prevScrollRestoration = history.scrollRestoration;

    try {
      history.scrollRestoration = 'manual';
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    document.body.dataset.page = dataPage;
    document.body.classList.add('sportsbook-port-active');
    if (isEvent) document.body.classList.add('ds-event-page');
    else document.body.classList.remove('ds-event-page', 'is-ev-stats');
    syncSportsbookAuth(loggedIn);

    (async () => {
      try {
        const sheets = [
          ...BASE_STYLESHEETS,
          ...(isEvent ? EVENT_STYLESHEETS : []),
          ...(MODE_STYLESHEETS[resolvedMode] || []),
          PALETTE_STYLESHEET,
        ];
        await Promise.all(sheets.map(loadStylesheet));

        const layoutUrl = MODE_LAYOUT[resolvedMode];
        const [layoutRes, chromeRes] = await Promise.all([
          fetch(layoutUrl),
          fetch('/sportsbook/partials/sportsbook-chrome.html'),
        ]);
        if (!layoutRes.ok) throw new Error(`Layout fetch ${layoutRes.status}`);
        if (!chromeRes.ok) throw new Error(`Chrome fetch ${chromeRes.status}`);
        const layout = await layoutRes.text();
        const chrome = await chromeRes.text();
        if (cancelled || !shellRef.current) return;

        // Imperative inject — script.js / auth-modals / event.js own DOM after this
        shellRef.current.innerHTML = `${layout}\n${chrome}`;
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

        const scripts = scriptsForMode(resolvedMode);
        for (const src of scripts) {
          if (cancelled) return;
          await loadScript(src);
        }
        if (cancelled) return;

        /* script.js may have set these on a prior home visit — clear on SKIP modes */
        if (SKIP_SCRIPT_JS.has(resolvedMode)) {
          window.__sbBetSlipOwnedByScript = false;
          window.__sbMyBetsOwnedByScript = false;
        }

        syncSportsbookAuth(loggedIn);
        window.__caeloSportsbookNavigate = (action, path) => {
          onNavigateRef.current?.(action, path ? { path } : undefined);
        };
        if (typeof window.SharedBetSlip?.ensure === 'function') {
          await window.SharedBetSlip.ensure();
        }
        if (typeof window.DsBetSlipGenerator?.ensureEmptyCta === 'function') {
          window.DsBetSlipGenerator.ensureEmptyCta();
        }
        /* Slip may inject after AuthModals.setLoggedIn — re-sync guest/logged UI */
        if (typeof window.syncBetSlipAuthUi === 'function') {
          window.syncBetSlipAuthUi();
        }
        if (typeof window.SbBetSlipStore?.paint === 'function') {
          window.SbBetSlipStore.paint();
        }
        if (typeof window.SbBetSlipStore?.paintMyBets === 'function') {
          window.SbBetSlipStore.paintMyBets({ force: SKIP_SCRIPT_JS.has(resolvedMode) });
        }
        if (typeof window.applyBetSlipSettings === 'function') {
          window.applyBetSlipSettings();
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        requestAnimationFrame(() => {
          if (!cancelled) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
        setBooted(true);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      cancelled = true;
      if (typeof window.__sbDestroyRuntime === 'function') {
        window.__sbDestroyRuntime();
      }
      removePortAssets();
      if (shellRef.current) shellRef.current.innerHTML = '';
      try {
        delete window.__caeloSportsbookNavigate;
      } catch {
        /* ignore */
      }
      document.body.classList.remove(
        'sportsbook-port-active',
        'ds-event-page',
        'is-ev-stats',
        'drawer-open',
        'mh-sf-open',
        'mh-mf-open',
        'sb-search-open',
        'bss-open',
        'ds-event-info-open',
        'ba-open',
        'sbs-open',
        'tsp-open',
        'bh-desktop-open',
        'hide-mobile-tabbar',
        'bt-mobile-board-ready'
      );
      if (!hadEventPageClass) document.body.classList.remove('ds-event-page');
      if (!hadLoggedInClass) document.body.classList.remove('is-logged-in');
      try {
        sessionStorage.removeItem(SPORTSBOOK_AUTH_KEY);
      } catch {
        /* ignore */
      }
      try {
        history.scrollRestoration = prevScrollRestoration || 'auto';
      } catch {
        /* ignore */
      }
      if (prevPage == null) delete document.body.dataset.page;
      else document.body.dataset.page = prevPage;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedMode]);

  useEffect(() => {
    if (!booted) return;
    syncSportsbookAuth(loggedIn);
    if (typeof window.syncBetSlipAuthUi === 'function') {
      window.syncBetSlipAuthUi();
    }
  }, [booted, loggedIn]);

  /* Bridge mobile tabbar Casino / Deposit / Log in / sportsbook subpages → Caelo app routes */
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !booted) return;

    const onClick = (e) => {
      const el = e.target.closest('[data-caelo-nav]');
      if (!el || !shell.contains(el)) return;
      e.preventDefault();
      e.stopPropagation();

      const action = el.getAttribute('data-caelo-nav');
      if (!action) return;

      if (typeof window.closeSportsTabFlyout === 'function') {
        window.closeSportsTabFlyout();
      }

      if (action === 'login') {
        onLoginClickRef.current?.();
        return;
      }
      if (action === 'deposit') {
        if (!loggedIn) onLoginClickRef.current?.();
        else onNavigateRef.current?.('deposit');
        return;
      }
      if (action === 'profile') {
        if (!loggedIn) onLoginClickRef.current?.();
        else onNavigateRef.current?.('profile');
        return;
      }
      if (typeof action === 'string' && action.startsWith('sportsbook')) {
        const href = el.getAttribute('href');
        if (href && href.startsWith('/sportsbook')) {
          onNavigateRef.current?.(action, { path: href });
          return;
        }
      }
      onNavigateRef.current?.(action);
    };

    shell.addEventListener('click', onClick);
    return () => shell.removeEventListener('click', onClick);
  }, [booted, loggedIn]);

  if (error) {
    return (
      <div className="sportsbook-root sportsbook-root--error px-4 py-10 text-center text-sm text-red-200">
        Failed to load sportsbook: {error}
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className="sportsbook-root"
      data-sportsbook-shell="1"
      data-sportsbook-mode={resolvedMode}
      aria-busy={!booted}
    />
  );
}
