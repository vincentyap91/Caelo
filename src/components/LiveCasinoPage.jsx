import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import PromotionStyleTabs from './PromotionStyleTabs';
import ProviderLaunchModal from './ProviderLaunchModal';
import PromotionWarningModal from './PromotionWarningModal';
import LobbyProviderCard from './game/LobbyProviderCard';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import liveCasinoBanner from '../assets/live-casino.jpg';
import { PAGE_BANNER_IMG, PAGE_BANNER_WRAP } from '../constants/pageBannerClasses';
import wcasinoLogo from '../assets/wcasino-2x-min-202505280008599013-202506250016539240.png';
import sagamingLogo from '../assets/sagaming2025_wh-202510270604321830.png';
import playtechLogo from '../assets/playtech-202505140443475046-202506242335087315.svg';
import sexygamingLogo from '../assets/sexygaming-202505140447445395-202506240659312869.svg';
import dreamgamingLogo from '../assets/dreamgaming-min-202506201545375005-202506250034043371.png';
import evolutionLogo from '../assets/evolution-202505140444284259-202506242322200281.svg';
import pragmaticLiveLogo from '../assets/pp-live-casino-202505140447187176-202506240700358930.svg';
import wmcasinoLogo from '../assets/wmcasino-202505140442522647-202506242346230340.svg';
import biggamingLogo from '../assets/biggaming-min-202506201446479379-202506250032270399.png';
import allbetLogo from '../assets/allbet-1-202505132310053829-202506250015492361.svg';
import yeebetLogo from '../assets/yeebet-min-202506201536311077-202506250033163315.png';
import wecasinoLogo from '../assets/worldent-min-202507141449569526-202507170806057662.png';
import mtLogo from '../assets/download-202506250034489694.png';
/** Compact grid mark; hero/menu tiles use `liveCasinoMenuTileAssets` (`ezugi-hero.png`). */
import ezugiLogo from '../assets/live-casino/ezugi.webp';
import afbGamingLogo from '../assets/live-casino/afb-logo.png';
import ct855Logo from '../assets/live-casino/ct855.png';

const EZUGI_PROVIDER_ID = 'ezugi';
const AFB_PROVIDER_ID = 'afb-gaming';
const CT855_PROVIDER_ID = 'ct855';

const providerLogos = [
    { id: 'casino', name: 'W Casino', src: wcasinoLogo, categories: ['Baccarat', 'Game Shows'], featured: true },
    { id: 'sagaming', name: 'SA Gaming', src: sagamingLogo, categories: ['Baccarat', 'Dragon Tiger'], featured: true },
    { id: 'playtech', name: 'Playtech LiveCasino', src: playtechLogo, categories: ['Roulette', 'Blackjack'], featured: true },
    { id: 'sexy-gaming', name: 'Sexy Gaming', src: sexygamingLogo, categories: ['Baccarat', 'Blackjack'], featured: true },
    { id: 'dream-gaming', name: 'DreamGaming', src: dreamgamingLogo, categories: ['Baccarat', 'Roulette'], featured: true },
    { id: 'evolution', name: 'Evolution Gaming', src: evolutionLogo, categories: ['Roulette', 'Game Shows'], featured: true },
    { id: 'pragmatic-play', name: 'Pragmatic Play Live Casino', src: pragmaticLiveLogo, categories: ['Game Shows', 'Roulette'], featured: true },
    { id: EZUGI_PROVIDER_ID, name: 'Ezugi', src: ezugiLogo, categories: ['Baccarat', 'Roulette', 'Game Shows'], featured: true },
    { id: 'afb-gaming', name: 'AFB Gaming', src: afbGamingLogo, categories: ['Baccarat', 'Roulette', 'Blackjack'], featured: true },
    { id: CT855_PROVIDER_ID, name: 'CT855', src: ct855Logo, categories: ['Baccarat', 'Roulette', 'Dragon Tiger'], featured: true },
    { id: 'wm-casino', name: 'WM Casino', src: wmcasinoLogo, categories: ['Baccarat'], featured: false },
    { id: 'big-gaming', name: 'Big Gaming', src: biggamingLogo, categories: ['Game Shows'], featured: false },
    { id: 'allbet', name: 'AllBet', src: allbetLogo, categories: ['Blackjack', 'Baccarat'], featured: false },
    { id: 'yeebet-live', name: 'YeeBet', src: yeebetLogo, categories: ['Baccarat'], featured: false },
    { id: 'world-entertainment', name: 'WECasino', src: wecasinoLogo, categories: ['Game Shows'], featured: false },
    { id: 'mt-live', name: 'MT', src: mtLogo, categories: ['Dragon Tiger'], featured: false }
];

const providerTags = ['All', 'Trending', 'Baccarat', 'Roulette', 'Dragon Tiger', 'Blackjack', 'Game Shows'];
const EZUGI_LAUNCH_CONFIG = {
    title: 'Ezugi',
    bannerImage:
        'https://pksoftcdn.azureedge.net/media/ezugi_cam88_providerbanner_1029pxx420px-202601301129537731.jpg',
    wallet: '201.00',
    membershipRebate: '0.00%',
};
const AFB_LAUNCH_CONFIG = {
    title: 'AFB Gaming',
    bannerImage:
        'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_afbcasino-202408151024208680-202408151200309656.jpg',
    wallet: '201.00',
    membershipRebate: '0.00%',
};
const CT855_LAUNCH_CONFIG = {
    title: 'CT855',
    bannerImage: 'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_ct855-202409021036566678.jpg',
    wallet: '201.00',
    membershipRebate: '0.00%',
};

const LAUNCH_MODAL_BY_PROVIDER_ID = {
    [EZUGI_PROVIDER_ID]: EZUGI_LAUNCH_CONFIG,
    [AFB_PROVIDER_ID]: AFB_LAUNCH_CONFIG,
    [CT855_PROVIDER_ID]: CT855_LAUNCH_CONFIG,
};

function resolveLaunchConfig(providerId) {
    return LAUNCH_MODAL_BY_PROVIDER_ID[providerId] ?? null;
}

export default function LiveCasinoPage({ selectedProviderIdFromMenu, onNavigate }) {
    const [activeTag, setActiveTag] = useState('All');
    const [query, setQuery] = useState('');
    const [providerLaunchOpen, setProviderLaunchOpen] = useState(false);
    const [promotionWarningOpen, setPromotionWarningOpen] = useState(false);
    const [bannerProvider, setBannerProvider] = useState(
        () => providerLogos.find((provider) => provider.name === 'SA Gaming') ?? providerLogos[0]
    );

    useEffect(() => {
        if (selectedProviderIdFromMenu) {
            const match = providerLogos.find((p) => p.id === selectedProviderIdFromMenu);
            if (match) {
                setActiveTag('All');
                setQuery('');
                setBannerProvider(match);
            }
        }
    }, [selectedProviderIdFromMenu]);
    const [showStickyPlayBar, setShowStickyPlayBar] = useState(false);
    const playButtonAreaRef = useRef(null);

    const filteredProviders = useMemo(() => {
        const text = query.trim().toLowerCase();

        return providerLogos.filter((provider) => {
            const tagMatch =
                activeTag === 'All'
                    ? true
                    : activeTag === 'Trending'
                        ? provider.featured
                        : provider.categories.includes(activeTag);
            const textMatch = text ? provider.name.toLowerCase().includes(text) : true;
            return tagMatch && textMatch;
        });
    }, [activeTag, query]);

    const handleSelectProvider = (provider) => {
        setBannerProvider(provider);
        if (resolveLaunchConfig(provider.id)) setProviderLaunchOpen(true);
    };

    const handlePlayLive = () => {
        if (resolveLaunchConfig(bannerProvider.id)) {
            setProviderLaunchOpen(true);
            return;
        }
        navigateToGameDetail(onNavigate, bannerProvider.name, 'Live Casino');
    };

    const handleStartProviderGame = () => {
        setPromotionWarningOpen(true);
    };

    const handleCloseProviderLaunch = () => {
        setProviderLaunchOpen(false);
        setPromotionWarningOpen(false);
    };

    const handleContinueEzugiLaunch = () => {
        setPromotionWarningOpen(false);
        setProviderLaunchOpen(false);
        const launchCfg = resolveLaunchConfig(bannerProvider.id);
        navigateToGameDetail(onNavigate, launchCfg?.title ?? bannerProvider.name, 'Live Casino');
    };

    useEffect(() => {
        const el = playButtonAreaRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyPlayBar(!entry.isIntersecting),
            { threshold: 0, rootMargin: '-80px 0px 0px 0px', root: null }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const PlayButton = ({ className = '' }) => (
        <button
            type="button"
            onClick={handlePlayLive}
            className={`btn-theme-cta inline-flex h-10 min-w-[140px] items-center justify-center rounded-[10px] px-5 text-sm font-black tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 md:h-12 md:min-w-[180px] md:px-8 md:text-base ${className}`}
            aria-label={
                resolveLaunchConfig(bannerProvider.id)
                    ? `Play ${resolveLaunchConfig(bannerProvider.id)?.title ?? bannerProvider.name}`
                    : `Play ${bannerProvider.name}`
            }
        >
            PLAY LIVE
        </button>
    );

    return (
        <main
            className="w-full pb-14 bg-[linear-gradient(180deg,var(--gradient-live-page-start)_0%,var(--gradient-live-page-mid)_36%,var(--gradient-live-page-end)_100%)]"
        >
            <ProviderLaunchModal
                open={providerLaunchOpen}
                onClose={handleCloseProviderLaunch}
                title={(resolveLaunchConfig(bannerProvider.id) ?? EZUGI_LAUNCH_CONFIG).title}
                bannerImage={(resolveLaunchConfig(bannerProvider.id) ?? EZUGI_LAUNCH_CONFIG).bannerImage}
                wallet={(resolveLaunchConfig(bannerProvider.id) ?? EZUGI_LAUNCH_CONFIG).wallet}
                membershipRebate={(resolveLaunchConfig(bannerProvider.id) ?? EZUGI_LAUNCH_CONFIG).membershipRebate}
                onStartGame={handleStartProviderGame}
            />
            <PromotionWarningModal
                open={promotionWarningOpen}
                onClose={() => setPromotionWarningOpen(false)}
                onContinue={handleContinueEzugiLaunch}
            />

            {showStickyPlayBar && (
                <div
                    className="fixed left-0 right-0 z-40 bg-[rgb(255_255_255_/_0.95)] backdrop-blur-md shadow-[0_8px_24px_rgba(16,32,72,0.12)] md:top-22"
                    role="banner"
                    aria-label="Quick play bar"
                >
                    <div className="flex items-center justify-center gap-4 px-4 py-3">
                    <img
                        src={bannerProvider.src}
                        alt={bannerProvider.name}
                        className="h-8 md:h-10 object-contain"
                    />
                    <span className="hidden text-sm font-bold text-[rgb(42_53_72)] sm:inline md:text-base">
                        {bannerProvider.name}
                    </span>
                    <PlayButton />
                    </div>
                </div>
            )}

            <section className="w-full border-y border-[rgb(219_226_240)] bg-[var(--color-surface-base-85)] backdrop-blur">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(102_112_134)]">
                        Premium Live Casino Lounge
                    </div>
                    <div className="hidden items-center gap-3 text-xs font-semibold text-[rgb(83_96_122)] sm:flex">
                        <span>High Definition Stream</span>
                        <span className="h-1 w-1 rounded-full bg-[rgb(153_166_190)]"></span>
                        <span>Fast Payout</span>
                    </div>
                </div>
            </section>

            <section className="w-full">
                <div className="w-full mx-auto">
                    <div className={PAGE_BANNER_WRAP}>
                        <img
                            src={liveCasinoBanner}
                            alt="Live Casino Banner"
                            className={PAGE_BANNER_IMG}
                        />
                        <div
                            ref={playButtonAreaRef}
                            className="absolute inset-y-0 right-0 flex w-[56%] items-center justify-end pr-3 sm:w-[52%] sm:pr-4 md:w-[50%] md:justify-start md:pr-0"
                        >
                            <div className="flex w-full max-w-[500px] flex-col items-end justify-center py-4 text-right md:block md:px-8 md:py-7 md:text-center">
                                <div className="mt-1 flex w-full justify-center md:mt-5 md:justify-center">
                                        <img
                                            src={bannerProvider.src}
                                            alt={bannerProvider.name}
                                            className="h-10 max-w-[140px] object-contain sm:h-12 sm:max-w-[170px] md:h-20 md:max-w-none"
                                        />
                                </div>
                                <h1 className="mt-3 hidden text-3xl font-black uppercase tracking-[0.03em] text-[rgb(25_41_71)] md:block">
                                    Live Casino
                                </h1>
                                <p className="mx-auto mt-3 hidden max-w-[420px] text-base font-semibold leading-[1.35] text-[rgb(42_53_72)] md:block md:mt-4">
                                    Live dealers, real thrills, instant payouts.
                                </p>
                                <button
                                    type="button"
                                    onClick={handlePlayLive}
                                    className="btn-theme-cta mt-1 inline-flex h-8 min-w-[118px] items-center justify-center self-center rounded-[9px] px-4 text-[12px] font-black tracking-[0.05em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] sm:mt-2 sm:h-9 sm:min-w-[136px] sm:px-5 sm:text-[13px] md:mt-6 md:h-14 md:min-w-[260px] md:self-auto md:rounded-[10px] md:px-12 md:text-xl"
                                    aria-label={
                                        bannerProvider.id === EZUGI_PROVIDER_ID
                                            ? `Play ${EZUGI_LAUNCH_CONFIG.title}`
                                            : `Play ${bannerProvider.name}`
                                    }
                                >
                                    PLAY LIVE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="live-casino-providers" className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-4 md:mt-6">
                <div className="rounded-2xl border border-[rgb(219_228_243)] bg-[var(--color-surface-base-80)] p-4 shadow-[0_6px_18px_rgba(20,43,87,0.09)] backdrop-blur-sm md:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <p className="text-xl font-extrabold tracking-[0.02em] text-[rgb(28_40_65)] md:text-2xl">Live Casino Providers</p>
                            <p className="mt-1 text-xs text-[rgb(93_103_128)] md:text-sm">
                                Choose from top brands with real-time action and studio-grade stream quality.
                            </p>
                        </div>
                        <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-[var(--color-border-live)] bg-[var(--color-surface-base)] px-3 shadow-[inset_0_1px_2px_rgba(9,30,66,0.06)] lg:w-[330px]">
                            <Search size={16} className="text-[rgb(95_110_139)]" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search provider"
                                className="w-full bg-transparent text-sm font-semibold text-[rgb(42_58_88)] outline-none placeholder:text-[rgb(139_151_174)]"
                            />
                        </label>
                    </div>

                    <div className="mt-4">
                        <PromotionStyleTabs
                            items={providerTags}
                            value={activeTag}
                            onChange={setActiveTag}
                            ariaLabel="Live casino categories"
                        />
                    </div>

                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-[rgb(106_117_144)] md:text-xs">
                        {filteredProviders.length} provider{filteredProviders.length === 1 ? '' : 's'} found
                    </p>
                </div>
            </section>

            <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-5 md:mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {filteredProviders.map((provider, index) => (
                        <LobbyProviderCard
                            key={provider.name}
                            provider={provider}
                            index={index}
                            selected={bannerProvider.name === provider.name}
                            onSelect={handleSelectProvider}
                            gameProvider="Live Casino"
                            favouriteCategory="live-casino"
                            navigatePage="live-casino"
                            onNavigate={onNavigate}
                            onPlayClick={
                                resolveLaunchConfig(provider.id)
                                    ? () => {
                                          setBannerProvider(provider);
                                          setProviderLaunchOpen(true);
                                      }
                                    : undefined
                            }
                        />
                    ))}
                </div>
                {filteredProviders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-[rgb(220_228_242)] bg-[var(--color-surface-base)] px-4 py-7 text-center">
                        <p className="text-base font-extrabold text-[rgb(43_58_87)]">No providers match your search.</p>
                        <p className="mt-1 text-xs text-[rgb(106_117_144)]">Try a different keyword or switch filter.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
