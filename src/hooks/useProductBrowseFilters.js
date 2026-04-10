import { useMemo, useState } from 'react';

export const DEFAULT_ALL_PROVIDERS_VALUE = '__all_providers__';

export function buildBrowseSummary({
    query,
    scope,
    provider,
    allProvidersValue,
    visibleProvidersCount,
    visibleGamesCount,
}) {
    const text = query.trim();

    if (text) {
        if (scope === 'providers') {
            return `${visibleProvidersCount} matching provider${visibleProvidersCount === 1 ? '' : 's'}`;
        }
        if (scope === 'games') {
            return `${visibleGamesCount} matching game${visibleGamesCount === 1 ? '' : 's'}`;
        }
        return `${visibleProvidersCount} matching provider${visibleProvidersCount === 1 ? '' : 's'} | ${visibleGamesCount} matching game${visibleGamesCount === 1 ? '' : 's'}`;
    }

    if (provider === allProvidersValue) {
        return `${visibleProvidersCount} providers | ${visibleGamesCount} games`;
    }

    return `${visibleGamesCount} games in ${provider}`;
}

export default function useProductBrowseFilters({
    providers,
    games,
    initialProvider,
    initialScope = 'all',
    initialQuery = '',
    allProvidersValue = DEFAULT_ALL_PROVIDERS_VALUE,
}) {
    const [searchScope, setSearchScope] = useState(initialScope);
    const [query, setQuery] = useState(initialQuery);
    const [activeProvider, setActiveProvider] = useState(initialProvider ?? allProvidersValue);

    const visibleProviders = useMemo(() => {
        const text = query.trim().toLowerCase();
        if (!text) return providers;

        return providers.filter((provider) => {
            const providerNameMatch = provider.name.toLowerCase().includes(text);
            const providerHasMatchingGame = games.some(
                (game) => game.provider === provider.name && game.name.toLowerCase().includes(text)
            );

            if (searchScope === 'providers') return providerNameMatch;
            if (searchScope === 'games') return providerHasMatchingGame;
            return providerNameMatch || providerHasMatchingGame;
        });
    }, [games, providers, query, searchScope]);

    const filteredGames = useMemo(() => {
        const text = query.trim().toLowerCase();
        return games.filter((game) => {
            const providerMatch = activeProvider === allProvidersValue || game.provider === activeProvider;
            if (!providerMatch) return false;
            if (!text) return true;

            const matchesGame = game.name.toLowerCase().includes(text);
            const matchesProvider = game.provider.toLowerCase().includes(text);

            if (searchScope === 'games') return matchesGame;
            if (searchScope === 'providers') return matchesProvider;
            return matchesGame || matchesProvider;
        });
    }, [activeProvider, allProvidersValue, games, query, searchScope]);

    const resultSummary = useMemo(() => buildBrowseSummary({
        query,
        scope: searchScope,
        provider: activeProvider,
        allProvidersValue,
        visibleProvidersCount: visibleProviders.length,
        visibleGamesCount: filteredGames.length,
    }), [activeProvider, allProvidersValue, filteredGames.length, query, searchScope, visibleProviders.length]);

    const applyBrowseFilters = ({ query: nextQuery, scope: nextScope, provider: nextProvider }) => {
        setQuery(nextQuery);
        setSearchScope(nextScope);
        setActiveProvider(nextProvider);
    };

    return {
        query,
        setQuery,
        searchScope,
        setSearchScope,
        activeProvider,
        setActiveProvider,
        visibleProviders,
        filteredGames,
        resultSummary,
        applyBrowseFilters,
    };
}
