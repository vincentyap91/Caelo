import React from 'react';
import LiveCasinoLobbyHero from './live-casino/LiveCasinoLobbyHero';
import ProviderLobbyTile from './game/ProviderLobbyTile';
import { ESPORTS_HERO_BANNER } from '../constants/categoryPageBanners';
import { LIVE_CASINO_PROVIDER_GRID_CLASS } from '../constants/liveCasinoPageConfig';
import { ESPORTS_PROVIDERS } from '../constants/esportsProviders';
import { normalizeFavouriteCategory } from '../utils/favouriteGames';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';

export default function EsportsPage({ onNavigate }) {
    const handleSelectProvider = (provider) => {
        navigateToGameDetail(onNavigate, provider.name, 'E-Sports');
    };

    return (
        <main className="w-full bg-gradient-live-page pb-14">
            <LiveCasinoLobbyHero bannerImage={ESPORTS_HERO_BANNER} bannerAlt="E-Sports" />

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-7 md:px-8">
                <div className={LIVE_CASINO_PROVIDER_GRID_CLASS}>
                    {ESPORTS_PROVIDERS.map((provider, index) => (
                        <ProviderLobbyTile
                            key={provider.id}
                            provider={provider}
                            index={index}
                            onSelect={handleSelectProvider}
                            favouriteCategory={normalizeFavouriteCategory('e-sports', provider.name)}
                            navigatePage="e-sports"
                            gameProvider="E-Sports"
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
