import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import LobbyHeroBanner from './lobby/LobbyHeroBanner';
import LobbyProviderCard from './game/LobbyProviderCard';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import pokerBanner from '../assets/poker-banner.jpg';
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

    const handlePlayPoker = () => {
        navigateToGameDetail(onNavigate, bannerProvider.name, 'Poker');
    };

    const playAriaLabel = `Play ${bannerProvider.name}`;

    return (
        <main
            className="w-full pb-14 bg-gradient-live-page"
        >
            <LobbyHeroBanner
                layout="poker"
                bannerImage={pokerBanner}
                bannerAlt="Poker Banner"
                provider={bannerProvider}
                onPlay={handlePlayPoker}
                ctaLabel="PLAY POKER"
                title="Poker"
                tagline="Sharp plays, deep stacks, nonstop action."
                stickyPlayAriaLabel={playAriaLabel}
                bannerPlayAriaLabel={playAriaLabel}
            />

            <section className="mx-auto mt-4 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-4 shadow-[var(--shadow-live-card)] backdrop-blur-sm md:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xl font-bold text-[var(--color-text-primary)] md:text-2xl">Poker Providers</p>
                            <p className="mt-1 text-xs text-[var(--color-text-muted)] md:text-sm">
                                Choose a poker room for tournaments, cash tables, and quick sit-and-go action.
                            </p>
                        </div>
                        <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-3 shadow-[var(--inset-panel)] lg:w-[330px]">
                            <Search size={16} className="text-[var(--color-text-muted)]" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search provider"
                                className="w-full bg-transparent text-sm font-semibold text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-soft)]"
                            />
                        </label>
                    </div>

                    <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--color-text-soft)] md:text-xs">
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
                    <div className="mt-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] px-4 py-7 text-center">
                        <p className="text-base font-bold text-[var(--color-text-secondary)]">No providers match your search.</p>
                        <p className="mt-1 text-xs text-[var(--color-text-soft)]">Try a different keyword.</p>
                    </div>
                )}
            </section>
        </main>
    );
}

