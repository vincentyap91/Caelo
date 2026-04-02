import React from 'react';
import GameDetailBreadcrumb from './GameDetailBreadcrumb';
import GameDetailPlayer from './GameDetailPlayer';
import GameDetailDataTable from './GameDetailDataTable';
import GameDetailRecommendedCarousel from './GameDetailRecommendedCarousel';

/**
 * Full game detail template: breadcrumb, title bar, player, provider line, ranking, recommended, latest bets.
 *
 * @param {Object} props
 * @param {{ label: string, href?: string, onNavigate?: () => void }[]} props.breadcrumbItems
 * @param {string} props.gameTitle
 * @param {string} props.providerName
 * @param {string} [props.gameSubtitle] â€” optional line under title
 * @param {string} [props.iframeUrl]
 * @param {string} [props.iframeTitle]
 * @param {boolean} [props.showGameFallback]
 * @param {string} [props.fallbackMessage]
 * @param {import('react').ReactNode} [props.fallbackActions]
 * @param {import('react').ReactNode} [props.gameContainerChildren]
 * @param {{ key: string, label: string, align?: string, highlight?: boolean }[]} props.rankingColumns
 * @param {Record<string, unknown>[]} props.rankingRows
 * @param {string} [props.rankingSectionTitle]
 * @param {{ key: string, label: string, align?: string, highlight?: boolean }[]} props.latestBetsColumns
 * @param {Record<string, unknown>[]} props.latestBetsRows
 * @param {{ id: string, name: string, imgUrl: string, provider?: string }[]} props.recommendedGames
 * @param {() => void} [props.onRecommendedMoreGames]
 * @param {(game: object) => void} [props.onRecommendedGameClick]
 * @param {string} [props.recommendedTitle]
 * @param {import('react').ReactNode} [props.children] â€” extra content below latest bets
 */
export default function GameDetailLayout({
    breadcrumbItems,
    gameTitle,
    providerName,
    gameSubtitle,
    iframeUrl,
    iframeTitle,
    showGameFallback = false,
    fallbackMessage = '',
    fallbackActions = null,
    gameContainerChildren = null,
    rankingColumns = [],
    rankingRows = [],
    rankingSectionTitle = 'Ranking',
    latestBetsColumns = [],
    latestBetsRows = [],
    recommendedGames = [],
    onRecommendedMoreGames,
    onRecommendedGameClick,
    recommendedTitle = 'Recommended Games',
    children = null,
}) {
    return (
        <main className="w-full bg-gradient-to-b from-[var(--gradient-live-page-start)] via-[var(--gradient-live-page-mid)] to-[var(--gradient-live-page-end)] pb-14 font-sans md:pb-20 lg:pb-24">
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col px-4 md:px-8">
                <header className="pt-4 md:pt-8">
                    <div className="mb-5 md:mb-6">
                        <GameDetailBreadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="flex flex-col gap-1 border-b border-[var(--color-border-default)] pb-5 md:flex-row md:items-end md:justify-between md:pb-6">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-strong)] md:text-3xl lg:text-3xl lg:leading-tight">
                                {gameTitle}
                            </h1>
                            {gameSubtitle ? (
                                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">{gameSubtitle}</p>
                            ) : null}
                        </div>
                    </div>
                </header>

                <div className="mt-6 md:mt-8 lg:mt-9">
                    <GameDetailPlayer
                        iframeUrl={iframeUrl}
                        iframeTitle={iframeTitle ?? gameTitle}
                        showFallback={showGameFallback}
                        fallbackMessage={fallbackMessage}
                        fallbackActions={fallbackActions}
                    >
                        {gameContainerChildren}
                    </GameDetailPlayer>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)] md:mt-6 md:text-base">
                    <span className="font-semibold text-[var(--color-text-strong)]">{gameTitle}</span>
                    {' by '}
                    <span className="font-bold text-[var(--color-accent-600)] underline decoration-[var(--color-accent-300)] underline-offset-[3px]">
                        {providerName}
                    </span>
                </p>

                {rankingColumns.length > 0 && rankingRows.length > 0 ? (
                    <section className="mt-10 space-y-4 md:mt-12 md:space-y-5 lg:mt-14">
                        <div className="inline-flex rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-1 shadow-[var(--shadow-subtle)]">
                            <span className="rounded-lg bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm font-bold text-[var(--color-accent-600)] md:px-5">
                                {rankingSectionTitle}
                            </span>
                        </div>
                        <GameDetailDataTable columns={rankingColumns} rows={rankingRows} striped />
                    </section>
                ) : null}

                {recommendedGames.length > 0 ? (
                    <div className="mt-10 md:mt-12 lg:mt-14">
                        <GameDetailRecommendedCarousel
                            title={recommendedTitle}
                            games={recommendedGames}
                            onMoreGames={onRecommendedMoreGames}
                            onGameClick={onRecommendedGameClick}
                        />
                    </div>
                ) : null}

                {latestBetsColumns.length > 0 && latestBetsRows.length > 0 ? (
                    <section className="mt-10 md:mt-12 lg:mt-14">
                        <h2 className="mb-4 text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:mb-5 md:text-xl">
                            Latest Bets
                        </h2>
                        <GameDetailDataTable columns={latestBetsColumns} rows={latestBetsRows} striped />
                    </section>
                ) : null}

                {children}
            </div>
        </main>
    );
}


