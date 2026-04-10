import React from 'react';
import { Crown, Gift, Headset, House, UserCircle2 } from 'lucide-react';

const ACCOUNT_ACTIVE_PAGES = ['profile', 'verification', 'favourites', 'withdrawal'];

const TABS = [
    { id: 'home', label: 'Home', page: 'home', icon: House },
    { id: 'promotion', label: 'Promotion', page: 'promotion', icon: Gift },
    { id: 'vip', label: 'VIP', page: 'vip', icon: Crown },
    { id: 'contact', label: 'Contact', action: 'liveChat', icon: Headset },
    { id: 'account', label: 'Account', page: 'profile', icon: UserCircle2 },
];

export default function MobileHomeBottomNav({ activePage, authUser, onNavigate, onLiveChatClick, onLoginClick }) {
    const isAccountActive =
        activePage && ACCOUNT_ACTIVE_PAGES.includes(activePage);

    return (
        <nav
            aria-label="Home quick navigation"
            className="fixed inset-x-0 bottom-0 z-[85] border-t border-[rgb(168_226_251)] bg-[var(--color-surface-base)] shadow-[0_-2px_12px_rgba(15,23,42,0.06)] md:hidden"
        >
            <div className="mx-auto flex w-full max-w-screen-2xl items-stretch pb-[max(0.375rem,env(safe-area-inset-bottom,0px))] pt-1">
                {TABS.map(({ id, label, page, action, icon: Icon }) => {
                    const isActive =
                        (id === 'home' && activePage === 'home') ||
                        (page && activePage === page) ||
                        (id === 'account' && isAccountActive);

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                if (action === 'liveChat') {
                                    onLiveChatClick?.();
                                    return;
                                }
                                if (id === 'account' && !authUser) {
                                    onLoginClick?.();
                                    return;
                                }
                                if (page) {
                                    onNavigate?.(page);
                                }
                            }}
                            className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 py-1.5 transition select-none active:opacity-85 ${
                                isActive
                                    ? 'text-[var(--color-accent-600)]'
                                    : 'text-[var(--color-text-muted)]'
                            }`}
                        >
                            <Icon
                                size={20}
                                strokeWidth={isActive ? 2.5 : 2}
                                className="shrink-0"
                                aria-hidden
                            />
                            <span
                                className={`w-full max-w-full truncate text-center text-xs leading-none ${
                                    isActive ? 'font-bold text-[var(--color-accent-600)]' : 'font-medium'
                                }`}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
