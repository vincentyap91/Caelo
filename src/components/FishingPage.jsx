import React, { useMemo, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import fishingBanner from '../assets/fishing-banner.jpg';
import { PAGE_BANNER_IMG_FILL, PAGE_BANNER_WRAP_ASPECT } from '../constants/pageBannerClasses';

const CDN = 'https://cdn.i8global.com/lb9/master';

const fishingProviders = [
    { name: 'JiLi Fishing', src: `${CDN}/jilifishing/jilif-202506200821066519-202508130218481666-202508220228072561.png`, featured: true },
    { name: 'JDB Fishing', src: `${CDN}/jdbfishing/jdbf-202506200914179063-202506250031365113.png`, featured: true },
    { name: 'DragoonSoft Fishing', src: `${CDN}/dragoonsoftfishing/dragoonsoft-min-202507150246327347-202507210728004447-202507212313114465.png`, featured: false },
    { name: 'Funky Games Fishing', src: `${CDN}/funkygamesfishing/funky%20games-202505140444483770-202507210731202838-202507212316321214.svg`, featured: false },
];

const fishingGames = [
    { name: 'Ocean King', provider: 'JiLi Fishing', rtp: 96.2, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_dreef_pop.png', hot: true },
    { name: 'Fishing God', provider: 'JiLi Fishing', rtp: 95.8, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_gblue_pop.png', hot: true },
    { name: 'Golden Tidal', provider: 'JiLi Fishing', rtp: 96.1, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_bwizard_pop.png', new: true },
    { name: 'Dragon Fortune', provider: 'JDB Fishing', rtp: 95.5, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_dsparks_pop.png', hot: true },
    { name: 'Catch the Big One', provider: 'JDB Fishing', rtp: 96.0, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_archer_pop.png', hot: true },
    { name: 'Deep Sea Riches', provider: 'JDB Fishing', rtp: 95.2, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/grbjp.png' },
    { name: 'Pirate Waters', provider: 'DragoonSoft Fishing', rtp: 95.9, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_captres_pop.png', new: true },
    { name: 'Coral Reef', provider: 'DragoonSoft Fishing', rtp: 95.4, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_nwinds_pop.png' },
    { name: 'Mermaid Treasure', provider: 'Funky Games Fishing', rtp: 96.3, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_tsgift_pop.png', hot: true },
    { name: 'Shark Attack', provider: 'Funky Games Fishing', rtp: 95.7, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_eigoldcd_pop.png' },
    { name: 'Tropical Catch', provider: 'JiLi Fishing', rtp: 95.6, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_squeen_pop.png' },
    { name: 'Bounty Hunter', provider: 'JDB Fishing', rtp: 96.0, imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_aluck_pop.png', new: true },
];

const gameTabs = ['All Games', 'Hot Games', 'New Games'];
const pageContainerClass = 'mx-auto w-full max-w-screen-2xl px-4 md:px-8';
const sectionTitleClass = 'text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl';

const liveBigWins = [
    { user: 'Alex M.', amount: 'MYR 45,200', game: 'Ocean King', time: '2 min ago', amountColor: 'text-[var(--color-danger-main)]' },
    { user: 'Sarah K.', amount: 'MYR 32,800', game: 'Fishing God', time: '5 min ago', amountColor: 'text-[var(--color-brand-primary)]' },
    { user: 'John D.', amount: 'MYR 78,500', game: 'Dragon Fortune', time: '8 min ago', amountColor: 'text-[var(--color-danger-main)]' },
];

const INITIAL_GAMES = 12;

export default function FishingPage() {
    const [activeTab, setActiveTab] = useState('All Games');
    const [query, setQuery] = useState('');
    const [activeProvider, setActiveProvider] = useState(fishingProviders[0].name);
    const [gamesToShow, setGamesToShow] = useState(INITIAL_GAMES);

    useEffect(() => {
        setGamesToShow(INITIAL_GAMES);
    }, [activeProvider, activeTab]);

    const filteredGames = useMemo(() => {
        const text = query.trim().toLowerCase();
        const games = fishingGames.filter((game) => {
            const providerMatch = game.provider === activeProvider;
            const tabMatch =
                activeTab === 'All Games'
                    ? true
                    : activeTab === 'Hot Games'
                        ? game.hot
                        : activeTab === 'New Games'
                            ? game.new
                            : true;
            const textMatch = text ? game.name.toLowerCase().includes(text) || game.provider.toLowerCase().includes(text) : true;
            return providerMatch && tabMatch && textMatch;
        });
        return games;
    }, [activeTab, query, activeProvider]);

    return (
        <main className="w-full bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 pb-14 font-sans">
            <section className="w-full border-y border-slate-200 bg-white/80 backdrop-blur">
                <div className={`${pageContainerClass} flex h-12 items-center justify-between`}>
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Fishing Games
                    </div>
                    <div className="hidden items-center gap-3 text-xs font-semibold text-slate-600 sm:flex">
                        <span>Live Action</span>
                        <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                        <span>Big Catches</span>
                    </div>
                </div>
            </section>

            <section className="w-full">
                <div className="w-full mx-auto">
                    <div className={PAGE_BANNER_WRAP_ASPECT}>
                        <img
                            src={fishingBanner}
                            alt="Fishing Banner"
                            className={PAGE_BANNER_IMG_FILL}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <h1 className="text-xl font-black uppercase tracking-[0.03em] text-[rgb(25_41_71)] sm:text-2xl md:text-3xl">
                                        Fishing
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${pageContainerClass} mt-4`}>
                <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 pr-3">
                    {fishingProviders.map((provider) => {
                        const isActive = activeProvider === provider.name;
                        return (
                            <button
                                key={provider.name}
                                type="button"
                                onClick={() => setActiveProvider(provider.name)}
                                className={`relative flex h-14 min-w-[calc((100%-0.5rem)/2.35)] shrink-0 items-center justify-center rounded-2xl border-2 bg-[var(--color-surface-base)] px-2 shadow-[var(--shadow-card-soft)] transition sm:min-w-[calc((100%-0.75rem)/3.35)] md:h-16 md:min-w-[calc((100%-1rem)/4.35)] lg:min-w-[calc((100%-2rem)/5.6)] xl:min-w-[calc((100%-3rem)/7.6)] ${
                                    isActive ? 'border-[var(--color-brand-deep)] ring-2 ring-[var(--color-brand-deep)]/30' : 'border-[rgb(209_216_229)] hover:border-[rgb(183_194_215)]'
                                }`}
                            >
                                {(provider.featured || provider.new) && (
                                    <span className={`absolute right-1 top-1 rounded-full px-2 py-0.5 text-xs font-black text-white ${provider.new ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                        {provider.new ? 'New' : 'Hot'}
                                    </span>
                                )}
                                <img src={provider.src} alt={provider.name} className="max-h-8 md:max-h-10 object-contain" draggable={false} />
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className={`${pageContainerClass} mt-4 md:mt-6`}>
                <div className="surface-panel rounded-2xl p-4 md:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {gameTabs.map((tab) => {
                                const selected = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide transition ${
                                            selected
                                                ? 'btn-theme-cta-soft border-amber-300 text-amber-950 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                        <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm lg:w-72">
                            <Search size={16} className="text-slate-500" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search Games"
                                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </label>
                    </div>
                </div>
            </section>

            <section className={`${pageContainerClass} mt-5 md:mt-6`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {filteredGames.slice(0, gamesToShow).map((game, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="surface-card group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                {(game.hot || game.new) && (
                                    <span className="absolute right-2 top-2 z-10 rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-black text-white">
                                        {game.hot ? 'HOT' : 'NEW'}
                                    </span>
                                )}
                                <div className="relative h-44 overflow-hidden sm:h-52 xl:h-56">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${game.imgUrl}")` }}
                                    />
                                </div>
                                <div className="p-2 md:p-3">
                                    <p className="line-clamp-2 text-xs font-bold text-slate-800 md:text-sm">{game.name}</p>
                                    <p className="mt-1 text-xs text-slate-500">{game.provider}</p>
                                </div>
                            </a>
                    ))}
                </div>
                {filteredGames.length === 0 && (
                    <div className="surface-card mt-6 rounded-2xl px-4 py-7 text-center">
                        <p className="text-base font-extrabold text-slate-800">No games match your search.</p>
                        <p className="mt-1 text-xs text-slate-500">Try a different keyword or switch filter.</p>
                    </div>
                )}
                {filteredGames.length > gamesToShow && (
                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setGamesToShow(filteredGames.length)}
                            className="btn-theme-cta inline-flex h-12 items-center justify-center rounded-lg px-8 text-sm font-black tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                        >
                            SEE MORE
                        </button>
                    </div>
                )}
            </section>

            <section className={`${pageContainerClass} mt-8 pb-8 md:mt-10`}>
                <div className="surface-panel rounded-2xl p-4 md:p-5">
                    <h2 className={sectionTitleClass}>Live Big Wins</h2>
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
                        {liveBigWins.map((win, idx) => {
                            const game = fishingGames.find((g) => g.name === win.game) ?? fishingGames[0];
                            return (
                                <a
                                    key={idx}
                                    href="#"
                                    className="surface-card group flex min-w-0 flex-1 basis-[200px] items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                        <img
                                            src={game.imgUrl}
                                            alt={win.game}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-800">
                                            {win.user} won <span className={win.amountColor}>{win.amount}</span>
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            on {win.game} · {win.time}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
