import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesRow from './components/FeaturesRow';
import PlayersPromo from './components/PlayersPromo';
import GameCategories from './components/GameCategories';
import TopGames from './components/TopGames';
import VipTier from './components/VipTier';
import AppDownload from './components/AppDownload';
import Promos from './components/Promos';
import LiveCasinoPage from './components/LiveCasinoPage';
import SlotsPage from './components/SlotsPage';
import SportsPage from './components/SportsPage';
import EsportsPage from './components/EsportsPage';
import LotteryPage from './components/LotteryPage';
import FishingPage from './components/FishingPage';
import PokerPage from './components/PokerPage';
import PromotionPage from './components/PromotionPage';
import VipPage from './components/VipPage';
import ProfilePage from './components/ProfilePage';
import AccountLayout from './components/AccountLayout';
import RegisterPage from './components/RegisterPage';
import VerificationPage from './components/VerificationPage';
import FavouritesPage from './components/FavouritesPage';
import MyBetsPage from './components/MyBetsPage';
import FeedbackPage from './components/FeedbackPage';
import HelpCenterPage from './components/HelpCenterPage';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import LoginModal from './components/LoginModal';
import './index.css';
import LiveChatModal from './components/LiveChatModal';

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
  if (pathname === '/register') {
    return 'register';
  }
  if (pathname === '/profile' || pathname === '/account-details') {
    return 'profile';
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
  if (pathname === '/bet-slip') {
    return 'my-bets';
  }
  return 'home';
}

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

  const handleNavigate = (targetPage) => {
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
      register: '/register',
      profile: '/profile',
      verification: '/verification',
      favourites: '/favourites',
      'my-bets': '/my-bets',
      feedback: '/feedback',
      'help-center': '/help',
    };
    const nextPath = pathByPage[targetPage] ?? '/';
    setPage(targetPage);

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
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
            : page === 'profile' || page === 'verification' || page === 'favourites' || page === 'my-bets' || page === 'feedback' || page === 'help-center'
              ? 'bg-[var(--color-page-account)]'
              : 'bg-[var(--color-page-default)]'
    }`}>
      <FloatingSocials onLiveChatClick={() => setLiveChatOpen((open) => !open)} />

      <Navbar
        onNavigate={handleNavigate}
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

      <div className="pt-[88px]">
      {page === 'home' ? (
        <>
          {/* Hero sits just underneath */}
          <HeroSection />

          {/* Main Content Area */}
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 pb-10 md:px-8">
            <FeaturesRow />
            <PlayersPromo />
            <GameCategories />
            <TopGames />
            <VipTier />
            <AppDownload />
            <Promos />
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
      ) : page === 'profile' ? (
        <ProfilePage authUser={authUser} onLogout={() => setAuthUser(null)} onNavigate={handleNavigate} onLiveChatClick={() => setLiveChatOpen(true)} />
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
      ) : (
        <RegisterPage onLoginClick={() => setLoginModalOpen(true)} />
      )}

      <Footer />
      </div>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        logoText="LOGO"
        onLogin={(username) => {
          setAuthUser({
            name: username || 'vincentzo',
            balance: 'MYR 0.00',
            notifications: 1,
          });
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
  );
}

export default App;
