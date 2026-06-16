import React from 'react';
import { Club, Dices, Fish, Flame, Gamepad2, Grid3x3, Ticket, Trophy } from 'lucide-react';
import CasinoChipIcon from '../ui/CasinoChipIcon';

export const GAME_CATEGORY_NAV_ITEMS = [
    { id: 'all-games', label: 'All Games', page: 'all-games', icon: Grid3x3 },
    { id: 'popular', label: 'Popular', page: null, icon: Flame },
    { id: 'live-casino', label: 'Casino', page: 'live-casino', icon: CasinoChipIcon },
    { id: 'sports', label: 'Sports', page: 'sports', icon: Trophy },
    { id: 'e-sports', label: 'E-Sports', page: 'e-sports', icon: Gamepad2 },
    { id: 'slots', label: 'Slots', page: 'slots', icon: Dices },
    { id: 'fishing', label: 'Fishing', page: 'fishing', icon: Fish },
    { id: 'lottery', label: 'Lottery', page: 'lottery', icon: Ticket },
    { id: 'poker', label: 'Poker', page: 'poker', icon: Club },
];

function resolveCategoryTarget(category) {
    return category.page ?? 'all-games';
}

/** Selected state — Category Tabs active pill (Cam88 1395:13359). */
export const CATEGORY_NAV_ACTIVE_CLASS =
    'category-tab-item--active border border-[var(--color-border-subtle)] bg-[var(--color-surface-menu-active)] text-[var(--color-tertiery)] ring-1 ring-white/10';

const MOBILE_SIDEBAR_INACTIVE_CLASS =
    'category-tab-item border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-primary)] shadow-sm';

const DESKTOP_TAB_INACTIVE_CLASS =
    'category-tab-item border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-primary)] shadow-sm hover:bg-[var(--color-secondary)] hover:text-[var(--color-tertiery)]';

export function GameCategoryNavItem({
    category,
    active = false,
    orientation = 'vertical',
    onSelect,
}) {
    const Icon = category.icon;
    const vertical = orientation === 'vertical';

    const inactiveClass = vertical ? MOBILE_SIDEBAR_INACTIVE_CLASS : DESKTOP_TAB_INACTIVE_CLASS;

    return (
        <button
            type="button"
            onClick={() => onSelect?.(category)}
            className={`${vertical
                    ? 'flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center'
                    : 'flex shrink-0 flex-row items-center justify-center gap-2 rounded-xl px-3 py-2 text-left'
                } transition-all ${active ? CATEGORY_NAV_ACTIVE_CLASS : inactiveClass}`}
            aria-pressed={active}
        >
            <Icon
                size={vertical ? 18 : 20}
                strokeWidth={active ? 2.5 : 2}
                className={`shrink-0 ${active ? 'text-[var(--color-tertiery)]' : 'text-[var(--color-primary)]'}`}
                aria-hidden
            />
            <span
                className={`text-xs font-bold leading-tight ${vertical
                    ? 'line-clamp-2 w-full text-center'
                    : 'line-clamp-1 whitespace-nowrap'
                }`}
            >
                {category.label}
            </span>
        </button>
    );
}

export function GameCategorySidebar({ activeId, onNavigate, className = '' }) {
    return (
        <aside
            aria-label="Game category navigation"
            className={`sticky top-24 hidden w-[5.25rem] shrink-0 flex-col gap-2 self-start md:flex ${className}`.trim()}
        >
            {GAME_CATEGORY_NAV_ITEMS.map((category) => (
                <GameCategoryNavItem
                    key={category.id}
                    category={category}
                    active={activeId === category.id}
                    onSelect={(item) => onNavigate?.(resolveCategoryTarget(item))}
                />
            ))}
        </aside>
    );
}

export function GameCategoryTabRail({ activeId, onNavigate, className = '' }) {
    return (
        <nav
            aria-label="Game category tabs"
            className={`hidden min-w-0 overflow-x-auto pb-2 md:block ${className}`.trim()}
        >
            <div className="flex min-w-max gap-2.5">
                {GAME_CATEGORY_NAV_ITEMS.map((category) => (
                    <GameCategoryNavItem
                        key={category.id}
                        category={category}
                        active={activeId === category.id}
                        orientation="horizontal"
                        onSelect={(item) => onNavigate?.(resolveCategoryTarget(item))}
                    />
                ))}
            </div>
        </nav>
    );
}
