import React, { useEffect, useState } from 'react';
import GameDetailBreadcrumb from './GameDetailBreadcrumb';
import GameDetailPlayer from './GameDetailPlayer';
import GameDetailDataTable from './GameDetailDataTable';
import GameDetailRecommendedCarousel from './GameDetailRecommendedCarousel';
import GameDetailMobileInfoCard from './GameDetailMobileInfoCard';
import GameDetailPlayModal from './GameDetailPlayModal';
import Pussy888PreLaunchPanel from './Pussy888PreLaunchPanel';

/**
 * Full game detail template: breadcrumb, title bar, player, provider line, ranking, recommended, latest bets.
 *
 * @param {Object} props
 * @param {{ label: string, href?: string, onNavigate?: () => void }[]} props.breadcrumbItems
 * @param {string} props.gameTitle
 * @param {string} props.providerName
 * @param {string} [props.gameImageUrl] — thumbnail for mobile info card
 * @param {() => void} [props.onProviderNavigate] — optional (e.g. go to category lobby)
 * @param {string} [props.gameSubtitle] — optional line under title
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
 * @param {import('react').ReactNode} [props.children] — extra content below latest bets
 */
export default function GameDetailLayout({
    breadcrumbItems,
    gameTitle,
    providerName,
    gameImageUrl = '',
    onProviderNavigate,
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
    const isPussy888 = providerName?.trim().toLowerCase() === 'pussy888';
    const [mobilePlayOpen, setMobilePlayOpen] = useState(false);
    const [pussy888Ready, setPussy888Ready] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(min-width:768px)').matches : false,
    );

    useEffect(() => {
        setPussy888Ready(false);
        setMobilePlayOpen(false);
    }, [gameTitle, providerName]);

    useEffect(() => {
        const mq = window.matchMedia('(min-width:768px)');
        const onChange = () => {
            setIsDesktop(mq.matches);
            if (mq.matches) setMobilePlayOpen(false);
        };
        onChange();
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const handlePussy888LaunchWebsite = () => {
        setPussy888Ready(true);
        if (!isDesktop) setMobilePlayOpen(true);
    };

    return (
        <main className="w-full bg-gradient-live-page-content pb-14 font-sans md:pb-20 lg:pb-24">
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col px-4 md:px-8">
                <header className="pt-4 md:pt-8">
                    <div className="mb-5 md:mb-6">
                        <GameDetailBreadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="hidden flex-col gap-1 border-b border-[var(--color-border-subtle)] pb-5 md:flex md:flex-row md:items-end md:justify-between md:pb-6">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl lg:text-3xl lg:leading-tight">
                                {gameTitle}
                            </h1>
                            {gameSubtitle ? (
                                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">{gameSubtitle}</p>
                            ) : null}
                        </div>
                    </div>
                </header>

                {/* Mobile: compact info card; embedded player not mounted so iframe never loads until Play */}
                {!isDesktop ? (
                    <div className="mt-5">
                        {isPussy888 && !pussy888Ready ? (
                            <div className="space-y-4">
                                <div className="border-b border-[var(--color-border-subtle)] pb-4">
                                    <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">{gameTitle}</h1>
                                    {gameSubtitle ? (
                                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">{gameSubtitle}</p>
                                    ) : null}
                                </div>
                                <Pussy888PreLaunchPanel onLaunchWebsite={handlePussy888LaunchWebsite} />
                            </div>
                        ) : (
                            <GameDetailMobileInfoCard
                                gameTitle={gameTitle}
                                providerName={providerName}
                                imageUrl={gameImageUrl}
                                onPlayNow={() => setMobilePlayOpen(true)}
                                onProviderClick={onProviderNavigate ?? null}
                            />
                        )}
                    </div>
                ) : null}

                {isDesktop ? (
                    <div className="mt-6 md:mt-8 lg:mt-9">
                        {isPussy888 && !pussy888Ready ? (
                            <Pussy888PreLaunchPanel onLaunchWebsite={handlePussy888LaunchWebsite} />
                        ) : (
                            <GameDetailPlayer
                                iframeUrl={iframeUrl}
                                iframeTitle={iframeTitle ?? gameTitle}
                                showFallback={showGameFallback}
                                fallbackMessage={fallbackMessage}
                                fallbackActions={fallbackActions}
                            >
                                {gameContainerChildren}
                            </GameDetailPlayer>
                        )}
                    </div>
                ) : null}

                {!isDesktop && (!isPussy888 || pussy888Ready) ? (
                    <GameDetailPlayModal
                        open={mobilePlayOpen}
                        onClose={() => setMobilePlayOpen(false)}
                        gameTitle={gameTitle}
                        iframeUrl={iframeUrl}
                        iframeTitle={iframeTitle}
                        showFallback={showGameFallback}
                        fallbackMessage={fallbackMessage}
                        fallbackActions={fallbackActions}
                        gameContainerChildren={gameContainerChildren}
                    />
                ) : null}

                <p className="mt-5 hidden text-sm leading-relaxed text-[var(--color-text-muted)] md:mt-6 md:block md:text-base">
                    <span className="font-semibold text-[var(--color-text-primary)]">{gameTitle}</span>
                    {' by '}
                    <span className="font-bold text-[var(--color-secondary)] underline decoration-[var(--color-border-subtle)] underline-offset-[3px]">
                        {providerName}
                    </span>
                </p>

                {rankingColumns.length > 0 && rankingRows.length > 0 ? (
                    <section className="mt-10 space-y-4 md:mt-12 md:space-y-5 lg:mt-14">
                        <div className="inline-flex rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] p-1 shadow-[var(--shadow-subtle)]">
                            <span className="rounded-lg bg-[var(--color-surface-cool-light)] px-4 py-2.5 text-sm font-bold text-[var(--color-secondary)] md:px-5">
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
                        <h2 className="mb-4 text-base font-bold tracking-tight text-[var(--color-text-primary)] md:mb-5 md:text-xl">
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


