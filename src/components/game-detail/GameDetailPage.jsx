import React, { useMemo } from 'react';
import GameDetailLayout from './GameDetailLayout';
import { gameDetailDemo } from '../../constants/gameDetailDemo';
import {
    buildGameDetailSlug,
    findGameDetailBySlug,
    getRecommendedGamesForDetail,
    titleFromUnknownGameSlug,
} from '../../utils/gameDetailRoutes';

/**
 * Game detail route — resolves catalog / lobby data by URL slug (`/game/:slug`), merges template tables from demo.
 */
export default function GameDetailPage({ onNavigate, gameDetailSlug }) {
    const resolved = useMemo(() => findGameDetailBySlug(gameDetailSlug), [gameDetailSlug]);

    const gameTitle = resolved?.name ?? (gameDetailSlug ? titleFromUnknownGameSlug(gameDetailSlug) : gameDetailDemo.gameTitle);
    const providerName = resolved?.provider ?? gameDetailDemo.providerName;
    const gameImageUrl = resolved?.imgUrl ?? '';

    const recommendedGames = useMemo(
        () => getRecommendedGamesForDetail(gameDetailSlug, resolved),
        [gameDetailSlug, resolved],
    );

    const breadcrumbItems = useMemo(
        () => [
            {
                label: resolved?.categoryLabel ?? gameDetailDemo.categoryLabel,
                onNavigate: () => onNavigate?.(resolved?.categoryPage ?? gameDetailDemo.categoryPage),
            },
            { label: gameTitle },
        ],
        [onNavigate, resolved?.categoryLabel, resolved?.categoryPage, gameTitle],
    );

    const fallbackActions = (
        <>
            <button
                type="button"
                onClick={() => onNavigate?.('home')}
                className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-3 text-sm font-bold text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-accent-50)] sm:min-w-[7.5rem]"
            >
                Back To Home
            </button>
            <button
                type="button"
                onClick={() => onNavigate?.(resolved?.categoryPage ?? 'slots')}
                className="btn-theme-cta inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-xl px-3 text-sm font-bold transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:min-w-[7.5rem]"
            >
                More Games
            </button>
        </>
    );

    return (
        <GameDetailLayout
            breadcrumbItems={breadcrumbItems}
            gameTitle={gameTitle}
            providerName={providerName}
            gameImageUrl={gameImageUrl}
            onProviderNavigate={() => onNavigate?.(resolved?.categoryPage ?? gameDetailDemo.categoryPage)}
            iframeUrl={gameDetailDemo.iframeUrl || undefined}
            iframeTitle={gameDetailDemo.iframeTitle}
            showGameFallback={gameDetailDemo.showGameFallback}
            fallbackMessage={gameDetailDemo.fallbackMessage}
            fallbackActions={fallbackActions}
            rankingColumns={gameDetailDemo.rankingColumns}
            rankingRows={gameDetailDemo.rankingRows}
            rankingSectionTitle={gameDetailDemo.rankingSectionTitle}
            latestBetsColumns={gameDetailDemo.latestBetsColumns}
            latestBetsRows={gameDetailDemo.latestBetsRows}
            recommendedGames={recommendedGames}
            onRecommendedMoreGames={() => onNavigate?.(resolved?.categoryPage ?? 'slots')}
            onRecommendedGameClick={(g) => {
                const slug = buildGameDetailSlug(g.name, g.provider ?? '');
                onNavigate?.('game-detail', { gameSlug: slug });
            }}
        />
    );
}

