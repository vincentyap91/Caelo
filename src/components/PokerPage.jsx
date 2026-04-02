import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import LobbyProviderCard from './game/LobbyProviderCard';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import pokerBanner from '../assets/poker-banner.jpg';
import { PAGE_BANNER_IMG, PAGE_BANNER_WRAP } from '../constants/pageBannerClasses';
import playtechLogo from '../assets/playtech-202505140443475046-202506242335087315.svg';
import evolutionLogo from '../assets/evolution-202505140444284259-202506242322200281.svg';
import pragmaticLiveLogo from '../assets/pp-live-casino-202505140447187176-202506240700358930.svg';
import mtLogo from '../assets/download-202506250034489694.png';

const providerLogos = [
    { id: 'playtech-poker', name: 'Playtech Poker', src: playtechLogo, categories: ['Texas Holdem', 'Tournaments'], featured: true },
    { id: 'evolution-poker', name: 'Evolution Poker', src: evolutionLogo, categories: ['Cash Games', 'Holdem'], featured: true },
    { id: 'pragmatic-poker', name: 'Pragmatic Poker', src: pragmaticLiveLogo, categories: ['Tournaments', 'Sit & Go'], featured: true },
    { id: 'mt-poker', name: 'MT Poker', src: mtLogo, categories: ['Cash Games'], featured: false },
];

export default function PokerPage({ onNavigate }) {
    const [query, setQuery] = useState('');
    const [bannerProvider, setBannerProvider] = useState(
        () => providerLogos.find((provider) => provider.id === 'playtech-poker') ?? providerLogos[0]
    );
    const [showStickyPlayBar, setShowStickyPlayBar] = useState(false);
    const playButtonAreaRef = useRef(null);

    const filteredProviders = useMemo(() => {
        const text = query.trim().toLowerCase();
        if (!text) return providerLogos;
        return providerLogos.filter((provider) => provider.name.toLowerCase().includes(text));
    }, [query]);

    const handleSelectProvider = (provider) => {
        setBannerProvider(provider);
    };

    useEffect(() => {
        if (!filteredProviders.some((provider) => provider.id === bannerProvider.id)) {
            setBannerProvider(filteredProviders[0] ?? providerLogos[0]);
        }
    }, [filteredProviders, bannerProvider.id]);

    useEffect(() => {
        const el = playButtonAreaRef.current;
        if (!el) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyPlayBar(!entry.isIntersecting),
            { threshold: 0, rootMargin: '-80px 0px 0px 0px', root: null }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handlePlayPoker = () => {
        navigateToGameDetail(onNavigate, bannerProvider.name, 'Poker');
    };

    const PlayButton = ({ className = '' }) => (
        <button
            type="button"
            onClick={handlePlayPoker}
            className={`btn-theme-cta inline-flex h-10 min-w-[140px] items-center justify-center rounded-[10px] px-5 text-sm font-bold tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 md:h-12 md:min-w-[180px] md:px-8 md:text-base ${className}`}
            aria-label={`Play ${bannerProvider.name}`}
        >
            PLAY POKER
        </button>
    );

    return (
        <main
            className="w-full pb-14 bg-[linear-gradient(180deg,var(--gradient-live-page-start)_0%,var(--gradient-live-page-mid)_36%,var(--gradient-live-page-end)_100%)]"
        >
            {showStickyPlayBar && (
                <div
                    className="fixed left-0 right-0 top-22 z-40 bg-[rgb(255_255_255_/_0.95)] backdrop-blur-md shadow-[0_8px_24px_rgba(16,32,72,0.12)]"
                    role="banner"
                    aria-label="Quick play bar"
                >
                    <div className="flex items-center justify-center gap-4 px-4 py-3">
                        <img
                            src={bannerProvider.src}
                            alt={bannerProvider.name}
                            className="h-8 object-contain md:h-10"
                        />
                        <span className="hidden text-sm font-bold text-[rgb(42_53_72)] sm:inline md:text-base">
                            {bannerProvider.name}
                        </span>
                        <PlayButton />
                    </div>
                </div>
            )}

            <section className="w-full border-y border-[rgb(219_226_240)] bg-[var(--color-surface-base-85)] backdrop-blur">
                <div className="mx-auto flex h-12 w-full max-w-screen-2xl items-center justify-between px-4 md:px-8">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(102_112_134)]">
                        Premium Poker Lounge
                    </div>
                    <div className="hidden items-center gap-3 text-xs font-semibold text-[rgb(83_96_122)] sm:flex">
                        <span>Cash Tables</span>
                        <span className="h-1 w-1 rounded-full bg-[rgb(153_166_190)]"></span>
                        <span>Fast Tournaments</span>
                    </div>
                </div>
            </section>

            <section className="w-full">
                <div className="w-full mx-auto">
                    <div className={PAGE_BANNER_WRAP}>
                        <img
                            src={pokerBanner}
                            alt="Poker Banner"
                            className={PAGE_BANNER_IMG}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div ref={playButtonAreaRef} className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <div className="flex justify-center max-md:justify-center">
                                        <img
                                            src={bannerProvider.src}
                                            alt={bannerProvider.name}
                                            className="h-10 max-w-[140px] object-contain sm:h-12 sm:max-w-[170px] md:h-20 md:max-w-none"
                                        />
                                    </div>
                                    <h1 className="mt-3 hidden text-3xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] md:block">
                                        Poker
                                    </h1>
                                    <p className="mx-auto mt-3 hidden max-w-[420px] text-base font-semibold leading-[1.35] text-[rgb(42_53_72)] md:block md:mt-4">
                                        Sharp plays, deep stacks, nonstop action.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handlePlayPoker}
                                        className="btn-theme-cta mt-1 inline-flex h-8 min-w-[118px] items-center justify-center self-center rounded-[9px] px-4 text-xs font-bold tracking-[0.05em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] max-md:self-start sm:mt-2 sm:h-9 sm:min-w-[136px] sm:px-5 sm:text-sm md:mt-6 md:h-14 md:min-w-[260px] md:self-auto md:rounded-[10px] md:px-12 md:text-xl"
                                        aria-label={`Play ${bannerProvider.name}`}
                                    >
                                        PLAY POKER
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-4 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="rounded-2xl border border-[rgb(219_228_243)] bg-[var(--color-surface-base-80)] p-4 shadow-[0_6px_18px_rgba(20,43,87,0.09)] backdrop-blur-sm md:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xl font-bold tracking-[0.02em] text-[rgb(28_40_65)] md:text-2xl">Poker Providers</p>
                            <p className="mt-1 text-xs text-[rgb(93_103_128)] md:text-sm">
                                Choose a poker room for tournaments, cash tables, and quick sit-and-go action.
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

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-[rgb(106_117_144)] md:text-xs">
                        {filteredProviders.length} provider{filteredProviders.length === 1 ? '' : 's'} found
                    </p>
                </div>
            </section>

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
                    {filteredProviders.map((provider, index) => (
                        <LobbyProviderCard
                            key={provider.name}
                            provider={provider}
                            index={index}
                            selected={bannerProvider.name === provider.name}
                            onSelect={handleSelectProvider}
                            gameProvider="Poker"
                            favouriteCategory="poker"
                            navigatePage="poker"
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
                {filteredProviders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-[rgb(220_228_242)] bg-[var(--color-surface-base)] px-4 py-7 text-center">
                        <p className="text-base font-bold text-[rgb(43_58_87)]">No providers match your search.</p>
                        <p className="mt-1 text-xs text-[rgb(106_117_144)]">Try a different keyword.</p>
                    </div>
                )}
            </section>
        </main>
    );
}


