import React, { useEffect, useMemo, useState } from 'react';
import ProviderLaunchModal from './ProviderLaunchModal';
import PromotionWarningModal from './PromotionWarningModal';
import LiveCasinoLobbyHero from './live-casino/LiveCasinoLobbyHero';
import LiveCasinoProviderTile from './live-casino/LiveCasinoProviderTile';
import { LIVE_CASINO_PROVIDER_GRID_CLASS } from '../constants/liveCasinoPageConfig';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import {
    EZUGI_PROVIDER_ID,
    LIVE_CASINO_LAUNCH_MODAL_BY_PROVIDER_ID,
    LIVE_CASINO_PAGE_PROVIDERS,
    resolveLiveCasinoHeroBanner,
} from '../constants/liveCasinoProviders';

const providerLogos = LIVE_CASINO_PAGE_PROVIDERS;

function resolveLaunchConfig(providerId) {
    return LIVE_CASINO_LAUNCH_MODAL_BY_PROVIDER_ID[providerId] ?? null;
}

export default function LiveCasinoPage({ selectedProviderIdFromMenu, onNavigate }) {
    const [providerLaunchOpen, setProviderLaunchOpen] = useState(false);
    const [promotionWarningOpen, setPromotionWarningOpen] = useState(false);
    const [activeProvider, setActiveProvider] = useState(
        () => providerLogos.find((p) => p.id === 'evolution') ?? providerLogos[0]
    );

    useEffect(() => {
        if (selectedProviderIdFromMenu) {
            const match = providerLogos.find((p) => p.id === selectedProviderIdFromMenu);
            if (match) setActiveProvider(match);
        }
    }, [selectedProviderIdFromMenu]);

    const handleSelectProvider = (provider) => {
        setActiveProvider(provider);
        if (resolveLaunchConfig(provider.id)) {
            setProviderLaunchOpen(true);
            return;
        }
        navigateToGameDetail(onNavigate, provider.name, 'Live Casino');
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
        const launchCfg = resolveLaunchConfig(activeProvider.id);
        navigateToGameDetail(onNavigate, launchCfg?.title ?? activeProvider.name, 'Live Casino');
    };

    const launchCfg =
        resolveLaunchConfig(activeProvider.id) ?? resolveLaunchConfig(EZUGI_PROVIDER_ID);
    const modalBannerImage = launchCfg?.bannerImage ?? resolveLiveCasinoHeroBanner(activeProvider);

    return (
        <main className="w-full bg-gradient-live-page pb-14">
            <ProviderLaunchModal
                open={providerLaunchOpen}
                onClose={handleCloseProviderLaunch}
                title={launchCfg?.title}
                bannerImage={modalBannerImage}
                wallet={launchCfg?.wallet}
                membershipRebate={launchCfg?.membershipRebate}
                onStartGame={handleStartProviderGame}
            />
            <PromotionWarningModal
                open={promotionWarningOpen}
                onClose={() => setPromotionWarningOpen(false)}
                onContinue={handleContinueEzugiLaunch}
            />

            <LiveCasinoLobbyHero />

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-7 md:px-8">
                <div className={LIVE_CASINO_PROVIDER_GRID_CLASS}>
                    {providerLogos.map((provider, index) => (
                        <LiveCasinoProviderTile
                            key={provider.id}
                            provider={provider}
                            index={index}
                            selected={activeProvider.id === provider.id}
                            onSelect={handleSelectProvider}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
