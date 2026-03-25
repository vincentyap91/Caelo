import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import PromotionStyleTabs from './PromotionStyleTabs';
import { GameCardFavouriteButton } from './game/GameCardActions';
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

const providerLogos = [
    { id: 'casino', name: 'W Casino', src: wcasinoLogo, categories: ['Baccarat', 'Game Shows'], featured: true },
    { id: 'sagaming', name: 'SA Gaming', src: sagamingLogo, categories: ['Baccarat', 'Dragon Tiger'], featured: true },
    { id: 'playtech', name: 'Playtech LiveCasino', src: playtechLogo, categories: ['Roulette', 'Blackjack'], featured: true },
    { id: 'sexy-gaming', name: 'Sexy Gaming', src: sexygamingLogo, categories: ['Baccarat', 'Blackjack'], featured: true },
    { id: 'dream-gaming', name: 'DreamGaming', src: dreamgamingLogo, categories: ['Baccarat', 'Roulette'], featured: true },
    { id: 'evolution', name: 'Evolution Gaming', src: evolutionLogo, categories: ['Roulette', 'Game Shows'], featured: true },
    { id: 'pragmatic-play', name: 'Pragmatic Play Live Casino', src: pragmaticLiveLogo, categories: ['Game Shows', 'Roulette'], featured: true },
    { id: 'wm-casino', name: 'WM Casino', src: wmcasinoLogo, categories: ['Baccarat'], featured: false },
    { id: 'big-gaming', name: 'Big Gaming', src: biggamingLogo, categories: ['Game Shows'], featured: false },
    { id: 'allbet', name: 'AllBet', src: allbetLogo, categories: ['Blackjack', 'Baccarat'], featured: false },
    { id: 'yeebet-live', name: 'YeeBet', src: yeebetLogo, categories: ['Baccarat'], featured: false },
    { id: 'world-entertainment', name: 'WECasino', src: wecasinoLogo, categories: ['Game Shows'], featured: false },
    { id: 'mt-live', name: 'MT', src: mtLogo, categories: ['Dragon Tiger'], featured: false }
];

const providerTags = ['All', 'Trending', 'Baccarat', 'Roulette', 'Dragon Tiger', 'Blackjack', 'Game Shows'];

export default function LiveCasinoPage({ selectedProviderIdFromMenu }) {
    const [activeTag, setActiveTag] = useState('All');
    const [query, setQuery] = useState('');
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
        <a
            href="#"
            className={`btn-theme-cta inline-flex h-10 min-w-[140px] items-center justify-center rounded-[10px] px-5 text-sm font-black tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 md:h-12 md:min-w-[180px] md:px-8 md:text-base ${className}`}
            aria-label={`Play ${bannerProvider.name}`}
        >
            PLAY LIVE
        </a>
    );

    return (
        <main
            className="w-full pb-14 bg-[linear-gradient(180deg,var(--gradient-live-page-start)_0%,var(--gradient-live-page-mid)_36%,var(--gradient-live-page-end)_100%)]"
        >
            {showStickyPlayBar && (
                <div
                    className="fixed left-0 right-0 top-[114px] z-40 bg-[rgb(255_255_255_/_0.95)] backdrop-blur-md shadow-[0_8px_24px_rgba(16,32,72,0.12)] md:top-22"
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
                                <a
                                    href="#"
                                    className="btn-theme-cta mt-1 inline-flex h-8 min-w-[118px] items-center justify-center self-center rounded-[9px] px-4 text-[12px] font-black tracking-[0.05em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] sm:mt-2 sm:h-9 sm:min-w-[136px] sm:px-5 sm:text-[13px] md:mt-6 md:h-14 md:min-w-[260px] md:self-auto md:rounded-[10px] md:px-12 md:text-xl"
                                    aria-label={`Play ${bannerProvider.name}`}
                                >
                                    PLAY LIVE
                                </a>
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
                        <div
                            key={provider.name}
                            className={`group relative flex h-[86px] items-center justify-center rounded-3xl border bg-[var(--color-page-default)] px-3 shadow-[var(--shadow-live-provider)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-live-provider-hover)] md:h-[104px] ${
                                bannerProvider.name === provider.name
                                    ? 'border-[var(--color-brand-deep)] ring-2 ring-[rgb(31_93_168_/_0.25)]'
                                    : 'border-[rgb(209_216_229)] hover:border-[rgb(183_194_215)]'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => handleSelectProvider(provider)}
                                className="absolute inset-0 z-0 rounded-3xl"
                                aria-label={`Show ${provider.name} in banner`}
                            />
                            {provider.featured && (
                                <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-[var(--color-hot-main)] px-2 py-0.5 text-[10px] font-black tracking-wide text-white shadow-[var(--shadow-hot)] md:text-xs">
                                    HOT
                                </span>
                            )}
                            <GameCardFavouriteButton
                                category="live-casino"
                                name={provider.name}
                                provider=""
                                imgUrl={typeof provider.src === 'string' ? provider.src : ''}
                                navigatePage="live-casino"
                                size="sm"
                                className="rounded-lg"
                            />
                            <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center py-2">
                                <img
                                    src={provider.src}
                                    alt={provider.name}
                                    loading={index < 12 ? 'eager' : 'lazy'}
                                    className="max-h-[28px] max-w-full object-contain saturate-110 contrast-110 transition duration-300 group-hover:scale-105 md:max-h-[40px]"
                                />
                            </div>
                        </div>
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
