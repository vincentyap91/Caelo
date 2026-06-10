import React from 'react';
import LiveCasinoLobbyHero from './live-casino/LiveCasinoLobbyHero';
import ProviderLobbyTile from './game/ProviderLobbyTile';
import { ALL_GAMES_HERO_BANNER } from '../constants/categoryPageBanners';
import { LIVE_CASINO_PROVIDER_GRID_CLASS } from '../constants/liveCasinoPageConfig';
import { TOP_GAMES, getTopGameFavouriteCategory, topGameToLobbyProvider } from '../constants/topGamesCatalog';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';

export default function AllGamesPage({ onNavigate }) {
    return (
        <main className="all-games-page w-full bg-gradient-live-page pb-14">
            <LiveCasinoLobbyHero bannerImage={ALL_GAMES_HERO_BANNER} bannerAlt="All Games" />

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-7 md:px-8">
                <div className={LIVE_CASINO_PROVIDER_GRID_CLASS}>
                    {TOP_GAMES.map((game, index) => (
                        <ProviderLobbyTile
                            key={`${game.name}-${game.provider}`}
                            provider={topGameToLobbyProvider(game)}
                            index={index}
                            onSelect={() => navigateToGameDetail(onNavigate, game.name, game.provider)}
                            favouriteCategory={getTopGameFavouriteCategory(game.page)}
                            navigatePage={game.page}
                            gameProvider={game.provider}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
