import React from 'react';
import LiveCasinoLobbyHero from './live-casino/LiveCasinoLobbyHero';
import ProviderLobbyTile from './game/ProviderLobbyTile';
import { SPORTS_HERO_BANNER } from '../constants/categoryPageBanners';
import { LIVE_CASINO_PROVIDER_GRID_CLASS } from '../constants/liveCasinoPageConfig';
import { SPORTS_PROVIDERS } from '../constants/sportsProviders';
import { normalizeFavouriteCategory } from '../utils/favouriteGames';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';

export default function SportsPage({ onNavigate }) {
    const handleSelectProvider = (provider) => {
        navigateToGameDetail(onNavigate, provider.name, 'Sportsbook');
    };

    return (
        <main className="sports-page w-full bg-gradient-live-page pb-14">
            <LiveCasinoLobbyHero bannerImage={SPORTS_HERO_BANNER} bannerAlt="Sports" />

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-7 md:px-8">
                <div className={LIVE_CASINO_PROVIDER_GRID_CLASS}>
                    {SPORTS_PROVIDERS.map((provider, index) => (
                        <ProviderLobbyTile
                            key={provider.id}
                            provider={provider}
                            index={index}
                            onSelect={handleSelectProvider}
                            favouriteCategory={normalizeFavouriteCategory('sports', provider.name)}
                            navigatePage="sports"
                            gameProvider="Sportsbook"
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
