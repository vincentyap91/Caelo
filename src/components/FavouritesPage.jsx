import React, { useEffect, useState } from 'react';
import { Gamepad2, Heart, Monitor, Trophy } from 'lucide-react';
import { GameCardFavouriteButton, GameCardPlayBar } from './game/GameCardActions';
import { isSlotsFavouritesSection } from '../utils/favouriteGames';
import { useFavourites } from '../context/FavouritesContext';

const sportsSections = [
    { id: 'games', title: 'Favourite Games', emptyText: 'No favourite games' },
    { id: 'competitions', title: 'Favourite Competitions', emptyText: 'No favourite competitions' },
];

const casinoSections = [
    { id: 'live-casino', title: 'Live Casino', emptyText: 'No favourites yet', icon: Monitor },
    { id: 'slots', title: 'Slots & Fishing', emptyText: 'No favourites yet', icon: Gamepad2 },
];

/** Tailwind defaults: sm 640px, lg 1024px, xl 1280px — keep in sync with grid classes below. */
function getFavouritesGridColumnCount(sectionId, width) {
    if (sectionId === 'live-casino') {
        return width >= 640 ? 4 : 2;
    }
    if (width >= 1280) return 6;
    if (width >= 1024) return 4;
    if (width >= 640) return 3;
    return 2;
}

function useViewportWidth() {
    const [width, setWidth] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth : 1024,
    );
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
}

function EmptyCard({ text }) {
    return (
        <div className="surface-card flex min-h-[200px] flex-col items-center justify-center rounded-2xl p-8">
            <Heart size={48} className="text-[var(--color-text-soft)]" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-medium text-[var(--color-text-muted)]">{text}</p>
        </div>
    );
}

function FavouriteTile({ item, onNavigate }) {
    const hasImage = Boolean(item.imgUrl);
    /** Live casino / sports / etc. use square logos — contain + inset so nothing is clipped. */
    const isProviderLogo = !isSlotsFavouritesSection(item.category);
    return (
        <div className="surface-card group relative flex flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)] transition hover:-translate-y-0.5 hover:shadow-lg">
            <div
                className={`relative h-40 overflow-hidden bg-[var(--color-surface-muted)] sm:h-44 ${
                    isProviderLogo ? 'flex items-center justify-center px-4 py-5 sm:px-5 sm:py-6' : ''
                }`}
            >
                {hasImage ? (
                    <img
                        src={item.imgUrl}
                        alt=""
                        className={
                            isProviderLogo
                                ? 'max-h-full max-w-full object-contain object-center transition duration-300 group-hover:brightness-105'
                                : 'h-full w-full object-cover transition duration-500 group-hover:scale-105'
                        }
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs font-medium text-[var(--color-text-muted)]">
                        No image
                    </div>
                )}
                <GameCardFavouriteButton
                    category={item.category}
                    name={item.name}
                    provider={item.provider}
                    imgUrl={item.imgUrl}
                    navigatePage={item.navigatePage}
                />
                {(item.category === 'slots' || item.category === 'fishing') && (
                    <GameCardPlayBar
                        showOnHover
                        onPlayClick={() => {
                            if (item.navigatePage) onNavigate?.(item.navigatePage);
                        }}
                    />
                )}
            </div>
            <div className="border-t border-[var(--color-border-default)] p-3">
                <p className="line-clamp-2 text-sm font-bold text-[var(--color-text-strong)]">{item.name}</p>
                {item.provider ? (
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">{item.provider}</p>
                ) : null}
            </div>
        </div>
    );
}

export default function FavouritesPage({ onNavigate }) {
    const [category, setCategory] = useState('casino');
    const viewportWidth = useViewportWidth();
    const [visibleRowsBySection, setVisibleRowsBySection] = useState({
        'live-casino': 2,
        slots: 2,
    });
    const { items } = useFavourites();

    const slotsItems = items.filter((i) => isSlotsFavouritesSection(i.category));
    const liveItems = items.filter((i) => !isSlotsFavouritesSection(i.category));

    return (
        <div className="page-container">
            <h1 className="page-title">Favourites</h1>

            <div className="mb-8 mt-8 flex justify-center">
                <div className="inline-flex rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-1 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                    <button
                        type="button"
                        onClick={() => setCategory('casino')}
                        className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                            category === 'casino'
                                ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]'
                        }`}
                    >
                        Live Casino and Slots
                    </button>
                    <button
                        type="button"
                        onClick={() => setCategory('sports')}
                        className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                            category === 'sports'
                                ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]'
                        }`}
                    >
                        Sports
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {category === 'sports' ? (
                    sportsSections.map(({ id, title, emptyText }) => (
                        <section key={id}>
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--color-text-strong)]">
                                <Trophy size={20} className="text-[var(--color-accent-600)]" />
                                {title}
                            </h2>
                            <EmptyCard text={emptyText} />
                        </section>
                    ))
                ) : (
                    casinoSections.map(({ id, title, emptyText, icon: Icon }) => {
                        const sectionItems = id === 'slots' ? slotsItems : liveItems;
                        const columnCount = getFavouritesGridColumnCount(id, viewportWidth);
                        const rowsToShow = visibleRowsBySection[id] ?? 2;
                        const visibleLimit = columnCount * rowsToShow;
                        const shownItems = sectionItems.slice(0, visibleLimit);
                        const hasMore = sectionItems.length > visibleLimit;
                        return (
                            <section key={id}>
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--color-text-strong)]">
                                    <Icon size={20} className="text-[var(--color-accent-600)]" />
                                    {title}
                                </h2>
                                {sectionItems.length === 0 ? (
                                    <EmptyCard text={emptyText} />
                                ) : (
                                    <>
                                        <div
                                            className={
                                                id === 'live-casino'
                                                    ? 'grid grid-cols-2 gap-3 sm:grid-cols-4'
                                                    : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
                                            }
                                        >
                                            {shownItems.map((item) => (
                                                <FavouriteTile key={item.id} item={item} onNavigate={onNavigate} />
                                            ))}
                                        </div>
                                        {hasMore ? (
                                            <div className="mt-6 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setVisibleRowsBySection((prev) => ({
                                                            ...prev,
                                                            [id]: (prev[id] ?? 2) + 2,
                                                        }))
                                                    }
                                                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-8 py-2.5 text-sm font-semibold text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] transition hover:border-[var(--color-accent-300)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]"
                                                >
                                                    Load more
                                                </button>
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </section>
                        );
                    })
                )}
            </div>
        </div>
    );
}
