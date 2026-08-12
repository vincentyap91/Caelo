import React, { useEffect, useRef, useState } from 'react';
import '../styles/sportsbook-bridge.css';

const BASE_STYLESHEETS = [
  '/sportsbook/css/styles.css',
  '/sportsbook/css/auth-modals.css',
  '/sportsbook/css/account.css',
  '/sportsbook/mobile/css/mobile-sports-filter.css',
];

const EVENT_STYLESHEETS = [
  '/sportsbook/css/multi-live.css',
  '/sportsbook/css/event.css',
];

/** Caelo orange+blue remap — must load LAST so it wins over 1xbet tokens */
const PALETTE_STYLESHEET = '/sportsbook/css/caelo-palette.css';

const BASE_SCRIPTS = [
  '/sportsbook/js/favourites-store.js',
  '/sportsbook/js/accumulators.js',
  '/sportsbook/js/bet-save-load.js',
  '/sportsbook/js/bet-slip-generator.js',
  '/sportsbook/js/script.js',
  '/sportsbook/js/auth-modals.js',
  '/sportsbook/mobile/js/mobile-sports-filter.js',
];

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
      '#auth-backdrop, .bss-backdrop, #ds-event-info, .ba-backdrop, .sbs-backdrop, .tsp-backdrop, .bh-desktop-backdrop'
    )
    .forEach((el) => el.remove());
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

/**
 * 1xBet sportsbook middle shell + chrome (Canon): layout, colors, buttons, modals.
 * mode="event" → event.html match details (board / tabs / markets / stats / event-info modal).
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
  const loggedIn = !!authUser;
  const isEvent = mode === 'event';
  const onNavigateRef = useRef(onNavigate);
  const onLoginClickRef = useRef(onLoginClick);
  onNavigateRef.current = onNavigate;
  onLoginClickRef.current = onLoginClick;

  useEffect(() => {
    let cancelled = false;
    const prevPage = document.body.dataset.page;
    const hadLoggedInClass = document.body.classList.contains('is-logged-in');
    const hadEventPageClass = document.body.classList.contains('ds-event-page');

    document.body.dataset.page = isEvent ? 'event' : 'home';
    document.body.classList.add('sportsbook-port-active');
    if (isEvent) document.body.classList.add('ds-event-page');
    else document.body.classList.remove('ds-event-page', 'is-ev-stats');
    syncSportsbookAuth(loggedIn);

    (async () => {
      try {
        const sheets = [
          ...BASE_STYLESHEETS,
          ...(isEvent ? EVENT_STYLESHEETS : []),
          PALETTE_STYLESHEET,
        ];
        await Promise.all(sheets.map(loadStylesheet));

        const layoutUrl = isEvent
          ? '/sportsbook/partials/sportsbook-event-layout.html'
          : '/sportsbook/partials/sportsbook-layout.html';
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

        const scripts = isEvent
          ? [...BASE_SCRIPTS, '/sportsbook/js/event.js']
          : BASE_SCRIPTS;

        for (const src of scripts) {
          if (cancelled) return;
          await loadScript(src);
        }
        if (cancelled) return;

        syncSportsbookAuth(loggedIn);
        setBooted(true);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      cancelled = true;
      removePortAssets();
      if (shellRef.current) shellRef.current.innerHTML = '';
      document.body.classList.remove(
        'sportsbook-port-active',
        'ds-event-page',
        'is-ev-stats',
        'drawer-open',
        'mh-sf-open',
        'bss-open',
        'ds-event-info-open',
        'ba-open',
        'sbs-open',
        'tsp-open',
        'bh-desktop-open',
        'hide-mobile-tabbar'
      );
      if (!hadEventPageClass) document.body.classList.remove('ds-event-page');
      if (!hadLoggedInClass) document.body.classList.remove('is-logged-in');
      try {
        sessionStorage.removeItem(SPORTSBOOK_AUTH_KEY);
      } catch {
        /* ignore */
      }
      if (prevPage == null) delete document.body.dataset.page;
      else document.body.dataset.page = prevPage;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEvent]);

  useEffect(() => {
    if (!booted) return;
    syncSportsbookAuth(loggedIn);
  }, [booted, loggedIn]);

  /* Bridge mobile tabbar Casino / Deposit / Log in → Caelo app routes */
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
      data-sportsbook-mode={isEvent ? 'event' : 'home'}
      aria-busy={!booted}
    />
  );
}
