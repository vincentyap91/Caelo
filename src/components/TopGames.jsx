import React from 'react';
import SectionHeader from './SectionHeader';
import { Crown } from 'lucide-react';
import { GameCardFavouriteButton, GameCardPlayBar } from './game/GameCardActions';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
/** Hero-style tiles (same sources as `liveCasinoNavProviders.js`), not flat logo marks */
import wCasinoTopImage from '../assets/live-casino/809fa51dd86ce47eaf28b331fe1d6bbd63e199cd-qJzlSpbk.png';
import dreamGamingTopImage from '../assets/live-casino/dream gaming_casino-202603051120541084.png';

/** Names + providers must match `gameCatalogs` / `lobbyRegistry` so `/game/:slug` resolves. */
const games = [
    {
        name: 'Gates of Olympus Super Scatter',
        provider: 'Pragmatic Play',
        imgUrl: 'https://zd3rmimelg.iwzphbojix.net/game_pic/square/200/vs20olympgold.png',
        page: 'slots',
    },
    { name: 'W Casino', provider: 'Live Casino', imgUrl: wCasinoTopImage, page: 'live-casino' },
    { name: 'DreamGaming', provider: 'Live Casino', imgUrl: dreamGamingTopImage, page: 'live-casino' },
    {
        name: "Dragon's Luck",
        provider: 'Pragmatic Play',
        imgUrl: 'https://pksoftcdn.azureedge.net/games/PragmaticPlayT/vs20olympgate.png',
        page: 'slots',
    },
    {
        name: 'Nomikai Fever',
        provider: 'Pragmatic Play',
        imgUrl: 'https://gamifystaging.blob.core.windows.net/staging/common/8eb11693-ad04-40f3-b2f1-cd7989c7fcc6.png',
        page: 'slots',
    },
    {
        name: 'Lucky Sports',
        provider: 'Sportsbook',
        imgUrl: 'https://pksoftcdn.azureedge.net/media/200x200_providerbanner_luckysport-202407260917076261-202408060821509512-202410241125136236.png',
        page: 'sports',
    },
];

export default function TopGames({ onNavigate }) {
    const favouriteCategory = (page) => {
        const map = {
            slots: 'slots',
            fishing: 'fishing',
            'live-casino': 'live-casino',
            poker: 'poker',
            sports: 'sports',
            'e-sports': 'e-sports',
            lottery: 'lottery',
        };
        return map[page] ?? 'home-top';
    };

    return (
        <section className="w-full pt-4">
            <SectionHeader
                title="Top Games"
                icon={<Crown size={22} fill="currentColor" className="text-[var(--color-brand-secondary)]" />}
                rightLink="See all"
                rightLinkTo="slots"
                onNavigate={onNavigate}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
                {games.map((game, idx) => (
                    <div
                        key={`${game.name}-${idx}`}
                        className="group relative flex flex-col overflow-hidden rounded-xl border-b-4 border-[var(--color-brand-primary)] bg-[var(--color-surface-base)] shadow-[var(--shadow-brand-card)] transition-transform md:hover:-translate-y-1"
                    >
                        <button
                            type="button"
                            onClick={() => navigateToGameDetail(onNavigate, game.name, game.provider)}
                            className="absolute inset-0 z-[5] md:hidden"
                            aria-label={`Open ${game.name}`}
                        />
                        <div className="relative w-full aspect-square overflow-hidden">
                            <div
                                className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 md:group-hover:scale-110"
                                style={{ backgroundImage: `url("${game.imgUrl}")` }}
                            />

                            <GameCardPlayBar
                                showOnHover
                                gameName={game.name}
                                gameProvider={game.provider}
                                onNavigate={onNavigate}
                            />

                            <div className="pointer-events-none absolute left-0 top-0 z-20 flex items-center justify-center rounded-br-lg bg-white px-2 py-0.5 shadow-sm">
                                <span className="text-xs font-black italic text-[var(--color-brand-secondary)]">{game.provider}</span>
                            </div>

                            <GameCardFavouriteButton
                                category={favouriteCategory(game.page)}
                                name={game.name}
                                provider={game.provider}
                                imgUrl={game.imgUrl}
                                navigatePage={game.page}
                                size="sm"
                            />
                        </div>

                        <div className="flex min-h-[40px] items-center justify-center bg-[var(--color-brand-primary)] px-2 py-2">
                            <span className="block truncate text-center text-xs font-bold text-white">{game.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
