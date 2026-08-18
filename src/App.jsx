import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  clearAuthSession,
  isAuthSessionExpired,
  loadAuthSession,
  saveAuthSession,
} from './utils/authSessionStorage';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesRow from './components/FeaturesRow';
import HomeLiveActivity from './components/HomeLiveActivity';
import ReferralBannerSection from './components/home/ReferralBannerSection';
import GameCategories from './components/GameCategories';
import TopGames from './components/TopGames';
import VipTier from './components/VipTier';
import AppDownload from './components/AppDownload';
import ProviderShowcaseSection from './components/home/ProviderShowcaseSection';
import RecentPayoutSection from './components/home/RecentPayoutSection';
import Promos from './components/Promos';
import MobileHomeCategoryGames from './components/home/MobileHomeCategoryGames';
import MobileHomeBottomNav from './components/home/MobileHomeBottomNav';
import LoadingPage from './components/LoadingPage';
const LiveCasinoPage = React.lazy(() => import('./components/LiveCasinoPage'));
const SlotsPage = React.lazy(() => import('./components/SlotsPage'));
const AllGamesPage = React.lazy(() => import('./components/AllGamesPage'));
const SportsPage = React.lazy(() => import('./components/SportsPage'));
const SportsbookPage = React.lazy(() => import('./components/SportsbookPage'));
const EsportsPage = React.lazy(() => import('./components/EsportsPage'));
const LotteryPage = React.lazy(() => import('./components/LotteryPage'));
const FishingPage = React.lazy(() => import('./components/FishingPage'));
const PokerPage = React.lazy(() => import('./components/PokerPage'));
const HotGamesPage = React.lazy(() => import('./components/HotGamesPage'));
const GameDetailPage = React.lazy(() => import('./components/game-detail/GameDetailPage'));
const PromotionPage = React.lazy(() => import('./components/PromotionPage'));
const VipPage = React.lazy(() => import('./components/VipPage'));
const ReferralPage = React.lazy(() => import('./components/referral'));
const LiveChatPage = React.lazy(() => import('./components/LiveChatPage'));
import ProfilePage from './components/ProfilePage';
import AccountLayout from './components/AccountLayout';
import RegisterPage from './components/RegisterPage';
import VerificationPage from './components/VerificationPage';
import FavouritesPage from './components/FavouritesPage';
import MyBetsPage from './components/MyBetsPage';
import FeedbackPage from './components/FeedbackPage';
import HelpCenterPage from './components/HelpCenterPage';
import AboutUsPage from './components/AboutUsPage';
import SecurityPage from './components/SecurityPage';
import NotificationsPage from './components/NotificationsPage';
import RebatePage from './components/RebatePage';
import ReferralCommissionPage from './components/ReferralCommissionPage';
import HistoryRecordPage from './components/HistoryRecordPage';
import DepositPage from './components/DepositPage';
import WithdrawalPage from './components/WithdrawalPage';
import RewardsPage from './components/RewardsPage';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import AuthModal from './components/AuthModal';
import './index.css';
import LiveChatModal from './components/LiveChatModal';
import AnnouncementModal from './components/AnnouncementModal';
import DailyBonusClaimModal from './components/DailyBonusClaimModal';

import { ReferralDataProvider } from './context/ReferralDataContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { ActionNotificationsProvider, useActionNotifications } from './context/ActionNotificationsContext';
import { PUSH_EVENT } from './constants/pushNotificationCopy';
import { REWARDS_PROGRAM_IDS } from './constants/rewardsPrograms';
import { HISTORY_RECORD_PAGE_IDS } from './constants/historyRecordPages';
import { parseGameDetailSlugFromPathname } from './utils/gameDetailRoutes';
import {
  SPORTSBOOK_LIGHT_SLUGS,
  applySportsbookSkinToPage,
  applySportsbookSkinToPath,
  getSportsbookSkin,
  setSportsbookSkin,
  sportsbookSkinFromPage,
  hasSportsbookDualSkin,
} from './utils/sportsbookSkin';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ui/ScrollToTop';
import ThemeEditor from './components/ThemeEditor';

/** White-chrome sportsbook previews — dark /sportsbook/<slug> originals stay unchanged. */
function sportsbookLightModeFromPage(pageId) {
  if (pageId === 'sportsbook-light') return 'light';
  if (typeof pageId === 'string' && pageId.startsWith('sportsbook-light-')) {
    return pageId.slice('sportsbook-light-'.length);
  }
  return null;
}

function resolvePageFromPath() {
  try {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname === '/casino' || pathname === '/live-casino') {
      return 'live-casino';
    }
    if (pathname === '/game' || pathname.startsWith('/game/')) {
      return 'game-detail';
    }
    if (pathname === '/slots') {
      return 'slots';
    }
    if (pathname === '/all-games' || pathname === '/games') {
      return 'all-games';
    }
    if (pathname === '/sports') {
      return 'sports';
    }
    if (pathname === '/sportsbook/event' || pathname.startsWith('/sportsbook/event/')) {
      return 'sportsbook-event';
    }
    if (pathname === '/sportsbook/national-team') {
      return 'sportsbook-national-team';
    }
    if (pathname === '/sportsbook/live-national-team') {
      return 'sportsbook-live-national-team';
    }
    if (pathname === '/sportsbook/sports') {
      return 'sportsbook-sports';
    }
    if (pathname === '/sportsbook/long-term-bets') {
      return 'sportsbook-long-term-bets';
    }
    if (pathname === '/sportsbook/big-tournaments') {
      return 'sportsbook-big-tournaments';
    }
    if (pathname === '/sportsbook/marble-live') {
      return 'sportsbook-marble-live';
    }
    if (pathname === '/sportsbook/multi-live') {
      return 'sportsbook-multi-live';
    }
    if (pathname === '/sportsbook/fast-bet') {
      return 'sportsbook-fast-bet';
    }
    if (pathname === '/sportsbook/favourites') {
      return 'sportsbook-favourites';
    }
    if (pathname === '/sportsbook/search') {
      return 'sportsbook-search';
    }
    if (pathname === '/sportsbook/wc2026') {
      return 'sportsbook-wc2026';
    }
    if (pathname === '/sportsbook/msi') {
      return 'sportsbook-msi';
    }
    if (pathname === '/sportsbook/esports') {
      return 'sportsbook-esports';
    }
    if (pathname === '/sportsbook/light') {
      return 'sportsbook-light';
    }
    if (pathname.startsWith('/sportsbook/light/')) {
      const slug = pathname.slice('/sportsbook/light/'.length);
      if (SPORTSBOOK_LIGHT_SLUGS[slug]) return SPORTSBOOK_LIGHT_SLUGS[slug];
    }
    if (pathname === '/sportsbook') {
      return 'sportsbook';
    }
    if (pathname === '/e-sports' || pathname === '/esports') {
      return 'e-sports';
    }
    if (pathname === '/lottery' || pathname === '/rng') {
      return 'lottery';
    }
    if (pathname === '/fishing' || pathname === '/fish-hunt') {
      return 'fishing';
    }
    if (pathname === '/hot-games' || pathname === '/hot') {
      return 'hot-games';
    }
    if (pathname === '/poker') {
      return 'poker';
    }
    if (pathname === '/promotion' || pathname === '/promotions') {
      return 'promotion';
    }
    if (pathname === '/vip') {
      return 'vip';
    }
    if (pathname === '/referral') {
      return 'referral';
    }
    if (pathname === '/register') {
      return 'register';
    }
    if (pathname === '/profile' || pathname === '/account-details') {
      return 'profile';
    }
    if (pathname === '/loyalty-rewards' || pathname === '/loyalty') {
      return 'loyalty-rewards';
    }
    if (pathname === '/verification') {
      return 'verification';
    }
    if (pathname === '/favourites') {
      return 'favourites';
    }
    if (pathname === '/my-bets') {
      return 'my-bets';
    }
    if (pathname === '/feedback') {
      return 'feedback';
    }
    if (pathname === '/help' || pathname === '/help-center') {
      return 'help-center';
    }
    if (pathname === '/terms' || pathname === '/terms-and-conditions') {
      return 'help-center';
    }
    if (pathname === '/about' || pathname === '/about-us') {
      return 'about';
    }
    if (pathname === '/security') {
      return 'security';
    }
    if (pathname === '/notifications') {
      return 'notifications';
    }
    if (pathname === '/rebate') {
      return 'rebate';
    }
    if (pathname === '/referral-commission') {
      return 'referral-commission';
    }
    if (pathname === '/deposit') {
      return 'deposit';
    }
    if (pathname === '/withdrawal') {
      return 'withdrawal';
    }
    const historyRecordPage = HISTORY_RECORD_PAGE_IDS.find((id) => pathname === `/${id}`);
    if (historyRecordPage) {
      return historyRecordPage;
    }
    // Legacy app-download URLs render homepage (URL normalized in useEffect)
    if (pathname === '/app-download' || pathname === '/download' || pathname === '/mobile') {
      return 'home';
    }
    if (pathname === '/bet-slip') {
      return 'my-bets';
    }
    if (pathname === '/live-chat' || pathname === '/support') {
      return 'live-chat';
    }
    return 'home';
  } catch (err) {
    console.error('[resolvePageFromPath] Failed to resolve page from pathname:', err);
    return 'home';
  }
}


const DOWNLOAD_APP_HASH = '#download-app';
const PROTECTED_PAGE_IDS = new Set([
  'profile',
  'verification',
  'favourites',
  'my-bets',
  'feedback',
  'security',
  'notifications',
  'referral-commission',
  'deposit',
  'withdrawal',
  ...HISTORY_RECORD_PAGE_IDS,
]);

function isProtectedPage(pageId) {
  return PROTECTED_PAGE_IDS.has(pageId);
}

function isSportsbookPageId(pageId) {
  return (
    pageId === 'sportsbook'
    || pageId === 'sportsbook-event'
    || pageId === 'sportsbook-national-team'
    || pageId === 'sportsbook-live-national-team'
    || pageId === 'sportsbook-sports'
    || pageId === 'sportsbook-long-term-bets'
    || pageId === 'sportsbook-big-tournaments'
    || pageId === 'sportsbook-marble-live'
    || pageId === 'sportsbook-multi-live'
    || pageId === 'sportsbook-fast-bet'
    || pageId === 'sportsbook-favourites'
    || pageId === 'sportsbook-search'
    || pageId === 'sportsbook-wc2026'
    || pageId === 'sportsbook-msi'
    || pageId === 'sportsbook-esports'
    || pageId === 'sportsbook-light'
    || pageId.startsWith('sportsbook-light-')
  );
}

/** Cam88 shell background role → Caelo page tint (see styles/theme.css `.app-shell[data-app-shell-bg]`). */
function resolveAppShellBg(pageId, authUser) {
  if (pageId === 'home') return 'home';
  if (pageId === 'register') return 'register';
  if (isSportsbookPageId(pageId)) return 'sportsbook';
  if (pageId === 'rebate' && !authUser) return 'default';
  if (
    pageId === 'profile'
    || pageId === 'verification'
    || pageId === 'favourites'
    || pageId === 'my-bets'
    || pageId === 'loyalty-rewards'
    || pageId === 'feedback'
    || pageId === 'help-center'
    || pageId === 'security'
    || pageId === 'notifications'
    || pageId === 'referral-commission'
    || pageId === 'deposit'
    || pageId === 'withdrawal'
    || pageId === 'rebate'
    || HISTORY_RECORD_PAGE_IDS.includes(pageId)
  ) {
    return 'account';
  }
  return 'default';
}

/** Inactivity-based sign-out (demo client guard). Session storage expiry is separate. */
const IDLE_LOGOUT_MS = 45 * 60 * 1000;

function AppInner() {
  const initialAuthUser = loadAuthSession();
  const { showPushNotification } = useActionNotifications();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [authUser, setAuthUser] = useState(initialAuthUser);
  const [balanceRefreshing, setBalanceRefreshing] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [dailyBonusModalOpen, setDailyBonusModalOpen] = useState(false);
  const [page, setPage] = useState(() => {
    const nextPage = resolvePageFromPath();
    if (!initialAuthUser && isProtectedPage(nextPage)) return 'home';
    return applySportsbookSkinToPage(nextPage, getSportsbookSkin());
  });
  const [routePath, setRoutePath] = useState(() => {
    const nextPage = resolvePageFromPath();
    if (!initialAuthUser && isProtectedPage(nextPage)) return '/';
    return applySportsbookSkinToPath(window.location.pathname, getSportsbookSkin());
  });
  const [sportsbookSkin, setSportsbookSkinState] = useState(getSportsbookSkin);
  const [selectedCasinoProviderIdFromMenu, setSelectedCasinoProviderIdFromMenu] = useState(null);
  const [selectedSlotsProviderIdFromMenu, setSelectedSlotsProviderIdFromMenu] = useState(null);
  const [pageNavigationState, setPageNavigationState] = useState(null);
  const lastActivityRef = useRef(Date.now());

  const redirectToPublicHome = useCallback(({ openLogin = false, replace = true } = {}) => {
    const targetUrl = '/';
    const currentFullUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    setPage('home');
    setRoutePath('/');

    if (currentFullUrl !== targetUrl) {
      if (replace) {
        window.history.replaceState({}, '', targetUrl);
      } else {
        window.history.pushState({}, '', targetUrl);
      }
    }

    if (openLogin) {
      setLoginModalOpen(true);
    }
  }, []);

  const handleLogout = useCallback(
    (opts) => {
      const reason = opts && typeof opts === 'object' ? opts.reason : 'user';
      if (reason === 'session_expired') {
        showPushNotification({ event: PUSH_EVENT.SESSION_TIMEOUT });
      } else if (reason === 'idle') {
        showPushNotification({ event: PUSH_EVENT.AUTO_LOGOUT });
      } else {
        showPushNotification({ event: PUSH_EVENT.LOGOUT });
      }
      setAuthUser(null);
      clearAuthSession();
      setSelectedCasinoProviderIdFromMenu(null);
      setSelectedSlotsProviderIdFromMenu(null);
      if (isProtectedPage(page) || isProtectedPage(resolvePageFromPath())) {
        redirectToPublicHome({ replace: true });
      }
    },
    [page, redirectToPublicHome, showPushNotification]
  );

  const handleRefreshBalance = useCallback(() => {
    setBalanceRefreshing(true);
    const started = Date.now();
    const finish = () => {
      const elapsed = Date.now() - started;
      window.setTimeout(() => setBalanceRefreshing(false), Math.max(0, 320 - elapsed));
    };
    try {
      const sessionUser = loadAuthSession();
      setAuthUser((prev) => {
        if (!prev || !sessionUser) return prev;
        return {
          ...prev,
          balance: sessionUser.balance ?? prev.balance,
          name: sessionUser.name ?? prev.name,
          vipLevel: sessionUser.vipLevel ?? prev.vipLevel,
          notifications: sessionUser.notifications ?? prev.notifications,
        };
      });
    } finally {
      finish();
    }
  }, []);

  const handleLogin = useCallback((userOrUsername, options = {}) => {
    const { suppressLoginToast = false } = options;
    const user =
      typeof userOrUsername === 'object' && userOrUsername?.name
        ? userOrUsername
        : { name: userOrUsername || 'demo', balance: 'MYR 0.00', notifications: 1, vipLevel: 'Diamond' };
    setAuthUser(user);
    saveAuthSession(user);
    lastActivityRef.current = Date.now();
    const name = typeof userOrUsername === 'object' && userOrUsername?.name ? userOrUsername.name : userOrUsername;
    if (!suppressLoginToast) {
      showPushNotification({ event: PUSH_EVENT.LOGIN_SUCCESS, userName: name || user.name });
    }

    // Redirect to home page after successful login
    redirectToPublicHome({ replace: false });
  }, [showPushNotification, redirectToPublicHome]);

  useEffect(() => {
    if (!authUser) return undefined;
    const checkExpiry = () => {
      if (isAuthSessionExpired()) {
        handleLogout({ reason: 'session_expired' });
      }
    };
    const id = window.setInterval(checkExpiry, 60_000);
    document.addEventListener('visibilitychange', checkExpiry);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', checkExpiry);
    };
  }, [authUser, handleLogout]);

  useEffect(() => {
    if (!authUser) return undefined;
    const bump = () => {
      lastActivityRef.current = Date.now();
    };
    const evs = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const interval = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_LOGOUT_MS) {
        handleLogout({ reason: 'idle' });
      }
    }, 30_000);
    return () => {
      evs.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(interval);
    };
  }, [authUser, handleLogout]);

  useEffect(() => {
    const onPopState = () => {
      const nextPage = resolvePageFromPath();
      if (!authUser && isProtectedPage(nextPage)) {
        redirectToPublicHome({ openLogin: true, replace: true });
        return;
      }
      const fromUrl = sportsbookSkinFromPage(nextPage);
      if (fromUrl) {
        setSportsbookSkin(fromUrl);
        setSportsbookSkinState(fromUrl);
      }
      setPage(nextPage);
      setPageNavigationState(null);
      setRoutePath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [authUser, redirectToPublicHome]);

  useEffect(() => {
    const nextPage = resolvePageFromPath();
    if (!authUser && isProtectedPage(nextPage)) {
      redirectToPublicHome({ openLogin: true, replace: true });
    }
  }, [authUser, redirectToPublicHome]);

  useEffect(() => {
    const p = window.location.pathname.toLowerCase();
    if (p === '/app-download' || p === '/download' || p === '/mobile') {
      window.history.replaceState({}, '', `/${DOWNLOAD_APP_HASH}`);
    }
    if (p === '/terms' || p === '/terms-and-conditions') {
      window.history.replaceState({}, '', '/help#tc');
      window.dispatchEvent(new Event('hashchange'));
    }
  }, []);

  useEffect(() => {
    const preferredPath = applySportsbookSkinToPath(window.location.pathname, getSportsbookSkin());
    if (preferredPath !== window.location.pathname) {
      window.history.replaceState({}, '', preferredPath);
      setRoutePath(preferredPath);
      setPage(resolvePageFromPath());
    }
  }, []);

  const scrollToDownloadAppSection = useCallback(() => {
    document.getElementById('download-app')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleDownloadAppClick = useCallback(() => {
    if (page === 'home') {
      scrollToDownloadAppSection();
      return;
    }
    setPage('home');
    if (window.location.pathname !== '/' || window.location.hash !== DOWNLOAD_APP_HASH) {
      window.history.pushState({}, '', `/${DOWNLOAD_APP_HASH}`);
    }
  }, [page, scrollToDownloadAppSection]);

  useEffect(() => {
    if (page !== 'home') {
      return undefined;
    }
    if (window.location.hash !== DOWNLOAD_APP_HASH) {
      return undefined;
    }
    const id = window.setTimeout(() => {
      scrollToDownloadAppSection();
    }, 100);
    return () => window.clearTimeout(id);
  }, [page, scrollToDownloadAppSection]);

  useEffect(() => {
    // Keep deep-link behavior for download section on home.
    if (page === 'home' && window.location.hash === DOWNLOAD_APP_HASH) {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [page]);

  useEffect(() => {
    // Show announcement modal on mount/refresh if we are on the homepage
    if (resolvePageFromPath() === 'home') {
      setAnnouncementModalOpen(true);
    }
  }, []);

    const handleNavigate = (targetPage, options) => {
      const settingsToProfile = { security: 'security', notifications: 'notifications' };
      let resolvedPage = settingsToProfile[targetPage] ?? targetPage;
      if (isSportsbookPageId(resolvedPage)) {
        resolvedPage = applySportsbookSkinToPage(resolvedPage, getSportsbookSkin());
      }
    const pathByPage = {
      home: '/',
      'live-casino': '/casino',
      'game-detail': '/game',
      slots: '/slots',
      'all-games': '/all-games',
      sports: '/sports',
      sportsbook: '/sportsbook',
      'sportsbook-event': '/sportsbook/event',
      'sportsbook-national-team': '/sportsbook/national-team',
      'sportsbook-live-national-team': '/sportsbook/live-national-team',
      'sportsbook-sports': '/sportsbook/sports',
      'sportsbook-long-term-bets': '/sportsbook/long-term-bets',
      'sportsbook-big-tournaments': '/sportsbook/big-tournaments',
      'sportsbook-marble-live': '/sportsbook/marble-live',
      'sportsbook-multi-live': '/sportsbook/multi-live',
      'sportsbook-fast-bet': '/sportsbook/fast-bet',
      'sportsbook-favourites': '/sportsbook/favourites',
      'sportsbook-search': '/sportsbook/search',
      'sportsbook-wc2026': '/sportsbook/wc2026',
      'sportsbook-msi': '/sportsbook/msi',
      'sportsbook-esports': '/sportsbook/esports',
      'sportsbook-light': '/sportsbook/light',
      'sportsbook-light-national-team': '/sportsbook/light/national-team',
      'sportsbook-light-big-tournaments': '/sportsbook/light/big-tournaments',
      'sportsbook-light-long-term-bets': '/sportsbook/light/long-term-bets',
      'sportsbook-light-multi-live': '/sportsbook/light/multi-live',
      'sportsbook-light-live-national-team': '/sportsbook/light/live-national-team',
      'sportsbook-light-marble-live': '/sportsbook/light/marble-live',
      'sportsbook-light-fast-bet': '/sportsbook/light/fast-bet',
      'sportsbook-light-esports': '/sportsbook/light/esports',
      'e-sports': '/e-sports',
      lottery: '/lottery',
      fishing: '/fishing',
      'hot-games': '/hot-games',
      poker: '/poker',
      promotion: '/promotion',
      vip: '/vip',
      referral: '/referral',
      'live-chat': '/live-chat',
      register: '/register',
      profile: '/profile',
      verification: '/verification',
      favourites: '/favourites',
      'my-bets': '/my-bets',
      'loyalty-rewards': '/loyalty-rewards',
      feedback: '/feedback',
      'help-center': '/help',
      about: '/about',
      security: '/security',
      notifications: '/notifications',
      rebate: '/rebate',
      'referral-commission': '/referral-commission',
      deposit: '/deposit',
      withdrawal: '/withdrawal',
      ...Object.fromEntries(HISTORY_RECORD_PAGE_IDS.map((id) => [id, `/${id}`])),
    };
    if (!authUser && isProtectedPage(resolvedPage)) {
      setLoginModalOpen(true);
      return;
    }
    const nextPath = pathByPage[resolvedPage] ?? pathByPage[targetPage] ?? '/';
    
    // If we're already on the same page, scroll to top (user "refresh" action)
    if (page === resolvedPage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (resolvedPage === 'home') {
        setAnnouncementModalOpen(true);
      }
    }

    setPage(resolvedPage);
    setPageNavigationState(options ?? null);

    const currentPath = window.location.pathname;
    let fullUrl = nextPath;
    if (options?.path && typeof options.path === 'string' && options.path.startsWith('/')) {
      fullUrl = isSportsbookPageId(resolvedPage)
        ? applySportsbookSkinToPath(options.path, getSportsbookSkin())
        : options.path;
    }
    if (resolvedPage === 'game-detail') {
      const slug = options?.gameSlug ?? options?.gameId;
      fullUrl = slug ? `/game/${encodeURIComponent(String(slug))}` : '/game';
    }
    if (resolvedPage === 'loyalty-rewards') {
      let tab = 'daily-bonus';
      if (options?.rewardsTab && REWARDS_PROGRAM_IDS.includes(options.rewardsTab)) {
        tab = options.rewardsTab;
      } else if (currentPath === '/loyalty-rewards' && window.location.hash) {
        const fromHash = window.location.hash.slice(1);
        if (REWARDS_PROGRAM_IDS.includes(fromHash)) tab = fromHash;
      }
      fullUrl = `/loyalty-rewards#${tab}`;
    }
    if (resolvedPage === 'deposit' && options?.depositBonusId) {
      fullUrl = `/deposit?bonus=${encodeURIComponent(String(options.depositBonusId))}`;
    }
    if (resolvedPage === 'help-center') {
      const helpTab = options?.helpTab;
      fullUrl = helpTab ? `/help#${encodeURIComponent(String(helpTab))}` : '/help';
    }

    const currentFull = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentFull !== fullUrl) {
      window.history.pushState({}, '', fullUrl);
      // pushState does not fire hashchange; rewards UI listens on hashchange for in-page tab switches
      if (resolvedPage === 'loyalty-rewards' || resolvedPage === 'help-center') {
        window.dispatchEvent(new Event('hashchange'));
      }
    }
    setRoutePath(window.location.pathname);
  };

  const handleSportsbookSkinToggle = () => {
    const nextSkin = getSportsbookSkin() === 'dark' ? 'light' : 'dark';
    setSportsbookSkin(nextSkin);
    setSportsbookSkinState(nextSkin);
    if (isSportsbookPageId(page)) {
      handleNavigate(page);
    }
  };

  const sportsbookPageProps = {
    authUser,
    onNavigate: handleNavigate,
    onLoginClick: () => {
      setAuthModalView('login');
      setLoginModalOpen(true);
    },
  };

  return (
    <div
      data-app-shell-bg={resolveAppShellBg(page, authUser)}
      className="app-shell relative min-h-screen w-full overflow-x-hidden font-sans"
    >
      <ScrollToTop authUser={authUser} />
      <FloatingSocials
        authUser={authUser}
        onLiveChatClick={() => setLiveChatOpen(true)}
        onClaimRewardsClick={() => setDailyBonusModalOpen(true)}
      />

      <Navbar
        onNavigate={handleNavigate}
        onDownloadAppClick={handleDownloadAppClick}
        sportsbookSkin={sportsbookSkin}
        onSportsbookSkinToggle={handleSportsbookSkinToggle}
        showSportsbookSkinToggle={hasSportsbookDualSkin(page)}
        activePage={page}
        onLoginClick={() => {
          setAuthModalView('login');
          setLoginModalOpen(true);
        }}
        onRegisterClick={() => {
          setAuthModalView('register');
          setLoginModalOpen(true);
        }}
        authUser={authUser}
        onLogout={() => handleLogout({ reason: 'user' })}
        onAccountDetailsClick={() => handleNavigate('profile')}
        onLiveChatClick={() => setLiveChatOpen(true)}
        onTopLiveChatClick={() => handleNavigate('live-chat')}
        onCasinoProviderSelect={(menuProvider) => {
          setSelectedCasinoProviderIdFromMenu(menuProvider?.id ?? null);
          handleNavigate('live-casino');
        }}
        onSlotsProviderSelect={(menuProvider) => {
          setSelectedSlotsProviderIdFromMenu(menuProvider?.id ?? null);
          handleNavigate('slots');
        }}
        onRefreshBalance={authUser ? handleRefreshBalance : undefined}
        balanceRefreshing={balanceRefreshing}
      />

      <div className={page === 'home' ? 'max-lg:pt-14 lg:pt-[100px]' : 'pt-14 lg:pt-[100px]'}>
      <ErrorBoundary>
      <Suspense fallback={<LoadingPage fullPage="overlay" minDelay={300} />}>
      {page === 'home' ? (
        <>
          <HeroSection />

          <div className={authUser ? 'home-page home-page--logged-in' : 'home-page'}>
            <MobileHomeCategoryGames onNavigate={handleNavigate} variant="mobile" />

            <div className="mx-auto hidden w-full max-w-screen-2xl flex-col gap-8 px-4 pb-10 md:flex md:px-8">
              <FeaturesRow />
              <GameCategories onNavigate={handleNavigate} />
              <TopGames onNavigate={handleNavigate} />
            </div>

            <div className="mx-auto flex w-full max-w-screen-2xl max-md:pb-24 flex-col gap-8 px-4 pb-10 md:px-8">
              <VipTier onNavigate={handleNavigate} />
              <MobileHomeCategoryGames onNavigate={handleNavigate} variant="desktop" />
              {authUser && <ReferralBannerSection onNavigate={handleNavigate} />}
              <HomeLiveActivity onNavigate={handleNavigate} />
              <AppDownload />
              <ProviderShowcaseSection
                onSlotsProviderSelect={(menuProvider) => {
                  setSelectedSlotsProviderIdFromMenu(menuProvider?.id ?? null);
                  handleNavigate('slots');
                }}
              />
              <RecentPayoutSection onNavigate={handleNavigate} />
              <Promos onNavigate={handleNavigate} />
            </div>
          </div>

        </>
      ) : page === 'live-casino' ? (
        <LiveCasinoPage selectedProviderIdFromMenu={selectedCasinoProviderIdFromMenu} onNavigate={handleNavigate} />
      ) : page === 'game-detail' ? (
        <GameDetailPage
          onNavigate={handleNavigate}
          gameDetailSlug={parseGameDetailSlugFromPathname(routePath)}
        />
      ) : page === 'all-games' ? (
        <AllGamesPage onNavigate={handleNavigate} />
      ) : page === 'slots' ? (
        <SlotsPage selectedProviderIdFromMenu={selectedSlotsProviderIdFromMenu} onNavigate={handleNavigate} />
      ) : page === 'sports' ? (
        <SportsPage onNavigate={handleNavigate} />
      ) : page === 'sportsbook' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="home"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-event' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="event"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-national-team' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="national-team"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-live-national-team' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="live-national-team"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-sports' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="sports"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-long-term-bets' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="long-term-bets"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-big-tournaments' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="big-tournaments"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-marble-live' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="marble-live"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-multi-live' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="multi-live"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-fast-bet' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="fast-bet"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-favourites' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="favourites"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-search' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="search"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-wc2026' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="wc2026"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-msi' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="msi"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'sportsbook-esports' ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode="esports"
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : sportsbookLightModeFromPage(page) ? (
        <SportsbookPage
          {...sportsbookPageProps}
          authUser={authUser}
          mode={sportsbookLightModeFromPage(page)}
          light
          onNavigate={handleNavigate}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      ) : page === 'e-sports' ? (
        <EsportsPage onNavigate={handleNavigate} />
      ) : page === 'lottery' ? (
        <LotteryPage onNavigate={handleNavigate} />
      ) : page === 'fishing' ? (
        <FishingPage onNavigate={handleNavigate} />
      ) : page === 'hot-games' ? (
        <HotGamesPage onNavigate={handleNavigate} />
      ) : page === 'poker' ? (
        <PokerPage onNavigate={handleNavigate} />
      ) : page === 'promotion' ? (
        <PromotionPage authUser={authUser} onNavigate={handleNavigate} />
      ) : page === 'vip' ? (
        <VipPage authUser={authUser} />
      ) : page === 'referral' ? (
        <ReferralPage
          authUser={authUser}
          onLoginClick={() => setLoginModalOpen(true)}
        />
      ) : page === 'profile' ? (
        <ProfilePage authUser={authUser} onLogout={handleLogout} onNavigate={handleNavigate} onLiveChatClick={() => handleNavigate('live-chat')} />
      ) : page === 'loyalty-rewards' ? (
        <AccountLayout
          activePage="loyalty-rewards"
          authUser={authUser}
          guestPreview={!authUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onLoginClick={() => setLoginModalOpen(true)}
          onLiveChatClick={() => handleNavigate('live-chat')}
        >
          <RewardsPage guestPreview={!authUser} onLoginClick={() => setLoginModalOpen(true)} />
        </AccountLayout>
      ) : page === 'verification' ? (
        <AccountLayout activePage="verification" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <VerificationPage />
        </AccountLayout>
      ) : page === 'favourites' ? (
        <AccountLayout activePage="favourites" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <FavouritesPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'my-bets' ? (
        <AccountLayout activePage="my-bets" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <MyBetsPage />
        </AccountLayout>
      ) : page === 'feedback' ? (
        <AccountLayout activePage="feedback" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <FeedbackPage />
        </AccountLayout>
      ) : page === 'about' ? (
        <AboutUsPage />
      ) : page === 'help-center' ? (
        authUser ? (
          <AccountLayout activePage="help-center" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
            <HelpCenterPage navigationState={pageNavigationState} />
          </AccountLayout>
        ) : (
          <main className="w-full bg-gradient-account-shell pb-16 pt-6 md:pt-8">
            <HelpCenterPage navigationState={pageNavigationState} guestLayout />
          </main>
        )
      ) : page === 'security' ? (
        <AccountLayout activePage="security" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <SecurityPage authUser={authUser} />
        </AccountLayout>
      ) : page === 'notifications' ? (
        <AccountLayout activePage="notifications" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <NotificationsPage />
        </AccountLayout>
      ) : HISTORY_RECORD_PAGE_IDS.includes(page) ? (
        <AccountLayout activePage={page} authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <HistoryRecordPage activePage={page} />
        </AccountLayout>
      ) : page === 'rebate' ? (
        <main className="w-full bg-gradient-account-shell pb-16 pt-6 md:pt-8">
          <RebatePage 
            authUser={authUser} 
            onNavigate={handleNavigate} 
            onLoginClick={() => setLoginModalOpen(true)} 
            guestLayout={!authUser} 
          />
        </main>
      ) : page === 'referral-commission' ? (
        <AccountLayout activePage="referral-commission" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <ReferralCommissionPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'deposit' ? (
        <AccountLayout variant="cashier" activePage="deposit" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <DepositPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'withdrawal' ? (
        <AccountLayout variant="cashier" activePage="withdrawal" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <WithdrawalPage onNavigate={handleNavigate} navigationState={pageNavigationState} />
        </AccountLayout>
      ) : page === 'live-chat' ? (
        <LiveChatPage onNavigate={handleNavigate} authUser={authUser} />
      ) : (
        <RegisterPage
          onLoginClick={() => setLoginModalOpen(true)}
          onRegisterSuccess={(userName) => {
            showPushNotification({ event: PUSH_EVENT.REGISTER_SUCCESS, userName });
            handleLogin(userName, { suppressLoginToast: true });
            handleNavigate('home');
          }}
          onContactCustomerService={() => setLiveChatOpen(true)}
        />
      )}
      </Suspense>
      </ErrorBoundary>

      {page !== 'live-chat' && (
        <Footer
          onNavigate={handleNavigate}
          onLiveChatClick={() => setLiveChatOpen(true)}
          mobileVisualTone={page === 'referral-commission' || page === 'rebate' ? 'softer' : 'default'}
          className="max-md:pb-24"
        />
      )}
      </div>

      {page !== 'live-chat' && !isSportsbookPageId(page) && (
        <MobileHomeBottomNav
          activePage={page}
          authUser={authUser}
          onNavigate={handleNavigate}
          onLiveChatClick={() => setLiveChatOpen(true)}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      )}

      <AuthModal
        open={loginModalOpen}
        initialView={authModalView}
        onClose={() => setLoginModalOpen(false)}
        onAuthSuccess={(userOrUsername) => {
          handleLogin(userOrUsername);
          setLoginModalOpen(false);
          if (page === 'register') {
            handleNavigate('home');
          }
        }}
        onCustomerServiceClick={() => {
          setLoginModalOpen(false);
          setLiveChatOpen(true);
        }}
      />

      <LiveChatModal
        open={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        authUser={authUser}
      />

      <AnnouncementModal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
      />

      <DailyBonusClaimModal
        open={dailyBonusModalOpen}
        onClose={() => setDailyBonusModalOpen(false)}
        guestPreview={!authUser}
        onLoginClick={() => {
          setDailyBonusModalOpen(false);
          setAuthModalView('login');
          setLoginModalOpen(true);
        }}
      />

      <ThemeEditor />
    </div>
  );
}

export default function App() {
  return (
    <ReferralDataProvider>
      <FavouritesProvider>
        <ActionNotificationsProvider>
          <AppInner />
        </ActionNotificationsProvider>
      </FavouritesProvider>
    </ReferralDataProvider>
  );
}
