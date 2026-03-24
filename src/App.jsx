import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesRow from './components/FeaturesRow';
import PlayersPromo from './components/PlayersPromo';
import GameCategories from './components/GameCategories';
import TopGames from './components/TopGames';
import VipTier from './components/VipTier';
import AppDownload from './components/AppDownload';
import Promos from './components/Promos';
import LoadingPage from './components/LoadingPage';
const LiveCasinoPage = React.lazy(() => import('./components/LiveCasinoPage'));
const SlotsPage = React.lazy(() => import('./components/SlotsPage'));
const SportsPage = React.lazy(() => import('./components/SportsPage'));
const EsportsPage = React.lazy(() => import('./components/EsportsPage'));
const LotteryPage = React.lazy(() => import('./components/LotteryPage'));
const FishingPage = React.lazy(() => import('./components/FishingPage'));
const PokerPage = React.lazy(() => import('./components/PokerPage'));
const PromotionPage = React.lazy(() => import('./components/PromotionPage'));
const VipPage = React.lazy(() => import('./components/VipPage'));
const ReferralPage = React.lazy(() => import('./components/referral'));
import ProfilePage from './components/ProfilePage';
import AccountLayout from './components/AccountLayout';
import RegisterPage from './components/RegisterPage';
import VerificationPage from './components/VerificationPage';
import FavouritesPage from './components/FavouritesPage';
import MyBetsPage from './components/MyBetsPage';
import FeedbackPage from './components/FeedbackPage';
import HelpCenterPage from './components/HelpCenterPage';
import SecurityPage from './components/SecurityPage';
import NotificationsPage from './components/NotificationsPage';
import RebatePage from './components/RebatePage';
import ReferralCommissionPage from './components/ReferralCommissionPage';
import DepositPage from './components/DepositPage';
import WithdrawalPage from './components/WithdrawalPage';
import LoyaltyRewardsPage from './components/LoyaltyRewardsPage';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import LoginModal from './components/LoginModal';
import './index.css';
import LiveChatModal from './components/LiveChatModal';
import { ReferralDataProvider } from './context/ReferralDataContext';
import { REWARDS_PROGRAM_IDS } from './constants/rewardsPrograms';

function resolvePageFromPath() {
  const pathname = window.location.pathname.toLowerCase();
  if (pathname === '/casino' || pathname === '/live-casino') {
    return 'live-casino';
  }
  if (pathname === '/slots') {
    return 'slots';
  }
  if (pathname === '/sports') {
    return 'sports';
  }
  if (pathname === '/e-sports' || pathname === '/esports') {
    return 'e-sports';
  }
  if (pathname === '/lottery') {
    return 'lottery';
  }
  if (pathname === '/fishing') {
    return 'fishing';
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
  // Legacy app-download URLs render homepage (URL normalized in useEffect)
  if (pathname === '/app-download' || pathname === '/download' || pathname === '/mobile') {
    return 'home';
  }
  if (pathname === '/bet-slip') {
    return 'my-bets';
  }
  return 'home';
}

const DOWNLOAD_APP_HASH = '#download-app';

function App() {
  const [page, setPage] = useState(resolvePageFromPath);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [selectedCasinoProviderIdFromMenu, setSelectedCasinoProviderIdFromMenu] = useState(null);
  useEffect(() => {
    const onPopState = () => setPage(resolvePageFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const p = window.location.pathname.toLowerCase();
    if (p === '/app-download' || p === '/download' || p === '/mobile') {
      window.history.replaceState({}, '', `/${DOWNLOAD_APP_HASH}`);
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

    const handleNavigate = (targetPage, options) => {
      const settingsToProfile = { security: 'security', notifications: 'notifications' };
      const resolvedPage = settingsToProfile[targetPage] ?? targetPage;
    const pathByPage = {
      home: '/',
      'live-casino': '/casino',
      slots: '/slots',
      sports: '/sports',
      'e-sports': '/e-sports',
      lottery: '/lottery',
      fishing: '/fishing',
      poker: '/poker',
      promotion: '/promotion',
      vip: '/vip',
      referral: '/referral',
      register: '/register',
      profile: '/profile',
      verification: '/verification',
      favourites: '/favourites',
      'my-bets': '/my-bets',
      'loyalty-rewards': '/loyalty-rewards',
      feedback: '/feedback',
      'help-center': '/help',
      security: '/security',
      notifications: '/notifications',
      rebate: '/rebate',
      'referral-commission': '/referral-commission',
      deposit: '/deposit',
      withdrawal: '/withdrawal',
    };
    const nextPath = pathByPage[resolvedPage] ?? pathByPage[targetPage] ?? '/';
    setPage(resolvedPage);

    const currentPath = window.location.pathname;
    let fullUrl = nextPath;
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

    const currentFull = `${window.location.pathname}${window.location.hash}`;
    if (currentFull !== fullUrl) {
      window.history.pushState({}, '', fullUrl);
      // pushState does not fire hashchange; rewards UI listens on hashchange for in-page tab switches
      if (resolvedPage === 'loyalty-rewards') {
        window.dispatchEvent(new Event('hashchange'));
      }
    }
  };

  return (
    <ReferralDataProvider>
    <div className={`relative min-h-screen w-full overflow-x-hidden font-sans ${
      page === 'home'
        ? 'bg-[var(--color-page-home)]'
        : page === 'register'
          ? 'bg-[var(--color-page-register)]'
          : page === 'slots'
            ? 'bg-[var(--color-page-default)]'
            : page === 'sports'
              ? 'bg-[var(--color-page-default)]'
              : page === 'e-sports'
                ? 'bg-[var(--color-page-default)]'
            : page === 'lottery'
              ? 'bg-[var(--color-page-default)]'
            : page === 'fishing'
              ? 'bg-[var(--color-page-default)]'
            : page === 'poker'
              ? 'bg-[var(--color-page-default)]'
            : page === 'promotion'
              ? 'bg-[var(--color-page-default)]'
            : page === 'vip'
              ? 'bg-[var(--color-page-default)]'
            : page === 'referral'
              ? 'bg-[var(--color-page-default)]'
            : page === 'profile' || page === 'verification' || page === 'favourites' || page === 'my-bets' || page === 'loyalty-rewards' || page === 'feedback' || page === 'help-center' || page === 'security' || page === 'notifications' || page === 'rebate' || page === 'referral-commission' || page === 'deposit' || page === 'withdrawal'
              ? 'bg-[var(--color-page-account)]'
              : 'bg-[var(--color-page-default)]'
    }`}>
      <FloatingSocials onLiveChatClick={() => setLiveChatOpen((open) => !open)} />

      <Navbar
        onNavigate={handleNavigate}
        onDownloadAppClick={handleDownloadAppClick}
        activePage={page}
        onLoginClick={() => setLoginModalOpen(true)}
        onRegisterClick={() => handleNavigate('register')}
        authUser={authUser}
        onLogout={() => setAuthUser(null)}
        onAccountDetailsClick={() => handleNavigate('profile')}
        onLiveChatClick={() => setLiveChatOpen(true)}
        onCasinoProviderSelect={(menuProvider) => {
          setSelectedCasinoProviderIdFromMenu(menuProvider?.id ?? null);
          handleNavigate('live-casino');
        }}
      />

      <div className="pt-[113px] md:pt-[92px]">
      <Suspense fallback={<LoadingPage fullPage="overlay" minDelay={300} />}>
      {page === 'home' ? (
        <>
          {/* Hero sits just underneath */}
          <HeroSection />

          {/* Main Content Area */}
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 pb-10 md:px-8">
            <FeaturesRow />
            <PlayersPromo />
            <GameCategories onNavigate={handleNavigate} />
            <TopGames onNavigate={handleNavigate} />
            <VipTier />
            <AppDownload />
            <Promos onNavigate={handleNavigate} />
          </div>
        </>
      ) : page === 'live-casino' ? (
        <LiveCasinoPage selectedProviderIdFromMenu={selectedCasinoProviderIdFromMenu} />
      ) : page === 'slots' ? (
        <SlotsPage />
      ) : page === 'sports' ? (
        <SportsPage />
      ) : page === 'e-sports' ? (
        <EsportsPage />
      ) : page === 'lottery' ? (
        <LotteryPage />
      ) : page === 'fishing' ? (
        <FishingPage />
      ) : page === 'poker' ? (
        <PokerPage />
      ) : page === 'promotion' ? (
        <PromotionPage />
      ) : page === 'vip' ? (
        <VipPage />
      ) : page === 'referral' ? (
        <ReferralPage />
      ) : page === 'profile' ? (
        <ProfilePage authUser={authUser} onLogout={() => setAuthUser(null)} onNavigate={handleNavigate} onLiveChatClick={() => setLiveChatOpen(true)} />
      ) : page === 'loyalty-rewards' ? (
        <AccountLayout activePage="loyalty-rewards" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <LoyaltyRewardsPage />
        </AccountLayout>
      ) : page === 'verification' ? (
        <AccountLayout activePage="verification" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <VerificationPage />
        </AccountLayout>
      ) : page === 'favourites' ? (
        <AccountLayout activePage="favourites" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <FavouritesPage />
        </AccountLayout>
      ) : page === 'my-bets' ? (
        <AccountLayout activePage="my-bets" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <MyBetsPage />
        </AccountLayout>
      ) : page === 'feedback' ? (
        <AccountLayout activePage="feedback" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <FeedbackPage />
        </AccountLayout>
      ) : page === 'help-center' ? (
        <AccountLayout activePage="help-center" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <HelpCenterPage />
        </AccountLayout>
      ) : page === 'security' ? (
        <AccountLayout activePage="security" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <SecurityPage />
        </AccountLayout>
      ) : page === 'notifications' ? (
        <AccountLayout activePage="notifications" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <NotificationsPage />
        </AccountLayout>
      ) : page === 'rebate' ? (
        <AccountLayout activePage="rebate" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <RebatePage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'referral-commission' ? (
        <AccountLayout activePage="referral-commission" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <ReferralCommissionPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'deposit' ? (
        <AccountLayout activePage="deposit" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <DepositPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'withdrawal' ? (
        <AccountLayout activePage="withdrawal" authUser={authUser} onNavigate={handleNavigate} onLogout={() => setAuthUser(null)} onLiveChatClick={() => setLiveChatOpen(true)}>
          <WithdrawalPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : (
        <RegisterPage onLoginClick={() => setLoginModalOpen(true)} />
      )}
      </Suspense>

      <Footer />
      </div>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        logoText="LOGO"
        onLogin={(userOrUsername) => {
          const user = typeof userOrUsername === 'object' && userOrUsername?.name
            ? userOrUsername
            : { name: userOrUsername || 'demo', balance: 'MYR 0.00', notifications: 1, vipLevel: 'Diamond' };
          setAuthUser(user);
          setLoginModalOpen(false);
        }}
        onRegisterClick={() => {
          setLoginModalOpen(false);
          handleNavigate('register');
        }}
      />

      <LiveChatModal
        open={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        authUser={authUser}
      />
    </div>
    </ReferralDataProvider>
  );
}

export default App;
