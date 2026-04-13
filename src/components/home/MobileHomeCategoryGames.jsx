import React, { useMemo, useState } from 'react';
import { Dices, Fish, Flame, Gamepad2, Landmark, Ticket, Trophy } from 'lucide-react';
import TopGameCard from '../game/TopGameCard';
import { TOP_GAMES } from '../../constants/topGamesCatalog';

const CATEGORIES = [
    { id: 'popular', label: 'Popular', page: null, icon: Flame },
    { id: 'live-casino', label: 'Casino', page: 'live-casino', icon: Landmark },
    { id: 'sports', label: 'Sports', page: 'sports', icon: Trophy },
    { id: 'e-sports', label: 'E-Sports', page: 'e-sports', icon: Gamepad2 },
    { id: 'slots', label: 'Slots', page: 'slots', icon: Dices },
    { id: 'fishing', label: 'Fishing', page: 'fishing', icon: Fish },
    { id: 'lottery', label: 'Lottery', page: 'lottery', icon: Ticket },
    { id: 'poker', label: 'Poker', page: 'poker', icon: Dices },
];

export default function MobileHomeCategoryGames({ onNavigate }) {
    const [activeId, setActiveId] = useState('popular');

    const filteredGames = useMemo(() => {
        if (activeId === 'popular') {
            return TOP_GAMES.slice(0, 12);
        }
        const cat = CATEGORIES.find((c) => c.id === activeId);
        const pageKey = cat?.page;
        if (!pageKey) return TOP_GAMES.slice(0, 12);
        return TOP_GAMES.filter((g) => g.page === pageKey).slice(0, 12);
    }, [activeId]);

    return (
        <section aria-label="Games by category" className="w-full md:hidden">
            <div className="mx-auto flex max-w-screen-2xl gap-3 px-3 pb-8 pt-3">
                <nav
                    aria-label="Game categories"
                    className="sticky top-14 z-10 flex w-[4.5rem] shrink-0 flex-col gap-2 self-start py-1"
                >
                    {CATEGORIES.map(({ id, label, icon: Icon }) => {
                        const active = activeId === id;
                        return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveId(id)}
                                    className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-center transition ${
                                        active
                                        ? 'bg-[var(--color-accent-600)] text-white shadow-md'
                                        : 'border border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-strong)] shadow-sm'
                                }`}
                            >
                                    <Icon
                                        size={20}
                                        strokeWidth={active ? 2.5 : 2}
                                        className={active ? 'text-white' : 'text-[var(--color-brand-primary)]'}
                                        aria-hidden
                                    />
                                    <span className="line-clamp-2 w-full text-center text-[11px] font-bold leading-tight">{label}</span>
                                </button>
                        );
                    })}
                </nav>

                <div className="min-w-0 flex-1">
                    <div className="grid grid-cols-2 gap-3">
                        {filteredGames.map((game) => (
                            <TopGameCard
                                key={`${game.name}-${game.provider}-${activeId}`}
                                game={game}
                                onNavigate={onNavigate}
                                className="h-full"
                            />
                        ))}
                    </div>
                    {filteredGames.length === 0 ? (
                        <p className="mt-4 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-6 text-center text-sm font-medium text-[var(--color-text-muted)]">
                            No featured games in this category yet.
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
