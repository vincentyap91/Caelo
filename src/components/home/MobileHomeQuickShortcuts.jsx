import React from 'react';
import { Crown, Gift, Headset, Share2, Users } from 'lucide-react';

const SHORTCUTS = [
    { id: 'vip', label: 'VIP', page: 'vip', icon: Crown },
    { id: 'affiliate', label: 'Affiliate', page: 'referral-commission', icon: Users },
    { id: 'referral', label: 'Referral', page: 'referral', icon: Share2 },
    { id: 'promotion', label: 'Promotion', page: 'promotion', icon: Gift },
    { id: 'contact', label: 'Contact', action: 'liveChat', icon: Headset },
];

export default function MobileHomeQuickShortcuts({ onNavigate, onLiveChatClick }) {
    return (
        <section aria-label="Quick shortcuts" className="w-full border-b border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-3 md:hidden">
            <div className="mx-auto flex max-w-screen-2xl justify-between gap-1 px-3">
                {SHORTCUTS.map(({ id, label, page, action, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => {
                            if (action === 'liveChat') {
                                onLiveChatClick?.();
                                return;
                            }
                            if (page) onNavigate?.(page);
                        }}
                        className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition active:scale-[0.98]"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-accent-600)] shadow-sm">
                            <Icon size={18} strokeWidth={2} aria-hidden />
                        </span>
                        <span className="w-full truncate text-center text-xs font-semibold leading-tight text-[var(--color-text-strong)]">
                            {label}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
