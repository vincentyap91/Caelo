import React, { useMemo, useState, useEffect } from 'react';
import { Play, Search, TrendingUp, TrendingDown } from 'lucide-react';
import slotsBanner from '../assets/slot-banner.jpg';
import { PAGE_BANNER_IMG_FILL, PAGE_BANNER_WRAP_ASPECT } from '../constants/pageBannerClasses';
import { MATCHED_SLOT_PROVIDERS } from '../constants/matchedSlotProviders';
import PromotionStyleTabs from './PromotionStyleTabs';
import { GameCardFavouriteButton, GameCardPlayBar } from './game/GameCardActions';
import { SLOT_GAMES as slotGames } from '../constants/gameCatalogs';
import { buildGameDetailSlug, navigateToGameDetail } from '../utils/gameDetailRoutes';

const CDN = 'https://cdn.i8global.com/lb9/master';

const slotProviders = [
    { name: 'Pragmatic Play', src: `${CDN}/pragmaticplay/pp-202505140448040730-202506200354029751.svg`, featured: true },
    { name: 'PlayTech Slots', src: `${CDN}/playtechslots/playtech-202505140443475046-202507230000384478-202508140011404228.svg`, featured: true },
    /* AdvantPlay: strip-only asset (navbar mega-menu uses `matchedSlotProviders` — keep URLs independent). */
    { name: 'AdvantPlay', src: `${CDN}/advantplay1/advantplay-min-202507170638442926-202509040235032332-202509180625238829.png`, featured: true },
    { name: 'JiLi', src: `${CDN}/jili/jili-min-202506200742098986-202508110205447696-202508212322163049.png`, featured: true },
    { name: 'JDB', src: `${CDN}/jdb/jdbslot-min-202506200911451833-202506250030508552.png`, featured: true },
    { name: 'Mega888 H5', src: `${CDN}/mega888h5/mega888@2x-min-202510091328133268-202601132337530680.png`, featured: true },
    { name: 'Fat Panda', src: `${CDN}/fatpanda/fatpanda_wh-min-202507210010021076-202507210043526492.png`, featured: true },
    { name: 'AFB Slot', src: `${CDN}/afbslot/afb777-202505140445032607-202506242319591057.svg`, featured: true },
    { name: 'Fastspin', src: `${CDN}/fastspin/fastspin_wh-min-202507170648206305-202507180026049374.png`, featured: true },
    { name: 'Nextspin', src: `${CDN}/nextspin/nextspin_wh-min-202507150325176151-202507172124363806.png`, featured: true },
    { name: 'Funky Games', src: `${CDN}/funkygames/funky%20games-202505140444483770-202506242320544103.svg`, featured: true },
    { name: 'Evo888H5', src: `${CDN}/evo888h5/evo888h5_wh-202510120414485924-202510270133186749.png`, featured: false, new: true },
    { name: 'Joker', src: `${CDN}/joker/joker-1-202505140443313183-202506242335528120.svg`, featured: false },
    { name: 'YGR', src: `${CDN}/ygr/ygr-202505140441007635-202506250006231822.svg`, featured: false },
    { name: 'FaChai', src: `${CDN}/fachai/fachai_wh-min-202507150302042721-202507172121335159.png`, featured: false },
    { name: 'Habanero', src: `${CDN}/habanero/habanero-202505140509135729-202506250005244757.svg`, featured: false },
    { name: 'MicroGaming', src: `${CDN}/microgaming/microgaming-202505140443103466-202506242344011199.svg`, featured: false },
    { name: 'Yggdrasil', src: `${CDN}/yggdrasil/yggdrasil-202505140454199856-202506240658349745.svg`, featured: false },
    { name: 'RelaxGaming', src: `${CDN}/relaxgaming/relaxgaming_wh-min-202507170643564538-202507180024244323.png`, featured: false },
    { name: 'SBO Slots', src: `${CDN}/sboslots/sboslot-202505140448207414-202506240640270691.svg`, featured: false },
    { name: 'PlayStar', src: `${CDN}/playstar/ps-202505140440118534-202506250008317555.svg`, featured: false },
    { name: 'DragoonSoft', src: `${CDN}/dragoonsoft/dragoonsoft-min-202507150246327347-202507172115425245.png`, featured: false },
    { name: 'KA Gaming', src: `${CDN}/kagaming/ka%20gaming-202505132310342194-202506250009308750.svg`, featured: false },
    { name: 'SimplePlay', src: `${CDN}/simpleplay/simpleplay_wh-min-202511200222550469-202601112330240065.png`, featured: false, new: true },
    { name: '568WinGames', src: `${CDN}/568wingames/568win-202505140442284669-202506250001235776.svg`, featured: false },
    { name: 'CC88', src: `${CDN}/cc88/cc88-202505140440359959-202506250007312379.svg`, featured: false },
];

const gameTabs = ['All Games', 'Hot Games', 'New Games', 'Highest RTP'];
const pageContainerClass = 'mx-auto w-full max-w-screen-2xl px-4 md:px-8';
const sectionTitleClass = 'text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl';

const liveBigWins = [
    { user: 'Alex M.', amount: 'MYR 67,450', game: 'Great Blue Jackpot', time: '2 min ago', amountColor: 'text-[var(--color-danger-main)]' },
    { user: 'Sarah K.', amount: 'MYR 52,300', game: 'Fire Blaze: Blue Wizard', time: '5 min ago', amountColor: 'text-[var(--color-brand-primary)]' },
    { user: 'John D.', amount: 'MYR 120,500', game: 'Archer', time: '8 min ago', amountColor: 'text-[var(--color-danger-main)]' },
];

const INITIAL_GAMES = 30; // 5 rows × 6 columns (lg)

export default function SlotsPage({ selectedProviderIdFromMenu, onNavigate }) {
    const [activeTab, setActiveTab] = useState('All Games');
    const [query, setQuery] = useState('');
    const [activeProvider, setActiveProvider] = useState(slotProviders[0].name);
    const [gamesToShow, setGamesToShow] = useState(INITIAL_GAMES);

    useEffect(() => {
        setGamesToShow(INITIAL_GAMES);
    }, [activeProvider, activeTab]);

    useEffect(() => {
        if (!selectedProviderIdFromMenu) return;
        const match = MATCHED_SLOT_PROVIDERS.find((p) => p.id === selectedProviderIdFromMenu);
        if (match) {
            setActiveProvider(match.gameProvider);
            setGamesToShow(INITIAL_GAMES);
        }
    }, [selectedProviderIdFromMenu]);

    const filteredGames = useMemo(() => {
        const text = query.trim().toLowerCase();
        const games = slotGames.filter((game) => {
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
        if (activeTab === 'Highest RTP') {
            return [...games].sort((a, b) => b.rtp - a.rtp);
        }
        return games;
    }, [activeTab, query, activeProvider]);

    return (
        <main className="w-full bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 pb-14 font-sans">
            <section className="w-full border-y border-slate-200 bg-white/80 backdrop-blur">
                <div className={`${pageContainerClass} flex h-12 items-center justify-between`}>
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Instant Rebate Slots
                    </div>
                    <div className="hidden items-center gap-3 text-xs font-semibold text-slate-600 sm:flex">
                        <span>No Waiting</span>
                        <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                        <span>No One Rivals Us</span>
                    </div>
                </div>
            </section>

            <section className="w-full">
                <div className="w-full mx-auto">
                    <div className={PAGE_BANNER_WRAP_ASPECT}>
                        <img
                            src={slotsBanner}
                            alt="Slots Banner - Instant Rebate"
                            className={PAGE_BANNER_IMG_FILL}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <h1 className="text-xl font-black uppercase tracking-[0.03em] text-[rgb(25_41_71)] sm:text-2xl md:text-3xl">
                                        Slots
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${pageContainerClass} mt-4`}>
                <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 pr-3">
                    {slotProviders.map((provider) => {
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
                        <PromotionStyleTabs
                            items={gameTabs}
                            value={activeTab}
                            onChange={setActiveTab}
                            ariaLabel="Slot game filters"
                        />
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
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-orange-600">
                        Live RTP updates every 30 minutes. Last system update at 3:00 PM (GMT+8).
                    </p>
                </div>
            </section>

            <section className={`${pageContainerClass} mt-5 md:mt-6`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {filteredGames.slice(0, gamesToShow).map((game, idx) => {
                        const isHighRtp = game.rtp >= 96.5;
                        const TrendIcon = isHighRtp ? TrendingUp : TrendingDown;
                        const arrowColor = isHighRtp ? 'text-green-600' : 'text-red-600';

                        return (
                        <div
                            key={idx}
                            className="surface-card group relative flex flex-col overflow-hidden rounded-2xl transition md:hover:-translate-y-1 md:hover:shadow-lg"
                        >
                            <button
                                type="button"
                                className="absolute inset-0 z-[5] md:hidden"
                                onClick={() => navigateToGameDetail(onNavigate, game.name, game.provider)}
                                aria-label={`Open ${game.name}`}
                            />
                            {(game.hot || game.new) && (
                                <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-black text-white">
                                    {game.hot ? 'HOT' : 'NEW'}
                                </span>
                            )}
                            <div className="relative h-44 overflow-hidden sm:h-52 xl:h-56">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 md:group-hover:scale-110"
                                    style={{ backgroundImage: `url("${game.imgUrl}")` }}
                                />
                                <GameCardFavouriteButton
                                    category="slots"
                                    name={game.name}
                                    provider={game.provider}
                                    imgUrl={game.imgUrl}
                                    navigatePage="slots"
                                />
                                <GameCardPlayBar
                                    showOnHover
                                    gameName={game.name}
                                    gameProvider={game.provider}
                                    onNavigate={onNavigate}
                                />
                            </div>
                            <div className="p-2 md:p-3">
                                <p className="line-clamp-2 text-xs font-bold text-slate-800 md:text-sm">{game.name}</p>
                                <p className="mt-1 text-xs text-slate-500">{game.provider}</p>
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                                    RTP {game.rtp.toFixed(2)}%
                                    <TrendIcon size={14} strokeWidth={2.5} className={arrowColor} />
                                </span>
                            </div>
                        </div>
                        );
                    })}
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
                            const game = slotGames.find((g) => g.name === win.game) ?? slotGames[0];
                            return (
                            <div
                                key={idx}
                                className="surface-card group relative flex min-w-0 flex-1 basis-[200px] items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                        src={game.imgUrl}
                                        alt={win.game}
                                        className="h-full w-full object-cover"
                                    />
                                    <GameCardFavouriteButton
                                        category="slots"
                                        name={game.name}
                                        provider={game.provider}
                                        imgUrl={game.imgUrl}
                                        navigatePage="slots"
                                        size="sm"
                                        className="!right-0.5 !top-0.5 scale-[0.85] sm:scale-90"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800">
                                        {win.user} won <span className={win.amountColor}>{win.amount}</span>
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        on {win.game} · {win.time}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onNavigate?.('game-detail', {
                                                gameSlug: buildGameDetailSlug(game.name, game.provider),
                                            })
                                        }
                                        className="btn-theme-primary mt-2 inline-flex h-9 max-w-[180px] items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold transition hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Play size={14} fill="currentColor" className="opacity-95" aria-hidden />
                                        Play
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
