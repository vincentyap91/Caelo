import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingSocials({ onLiveChatClick }) {
    const unreadCount = 2;

    return (
        <button
            type="button"
            onClick={onLiveChatClick}
            className="fixed bottom-6 right-6 z-[100] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-accent-500)_0%,var(--color-brand-deep)_100%)] text-white shadow-[var(--shadow-nav-pill)] transition hover:brightness-110"
            title="Live Chat"
            aria-label="Open live chat"
        >
            <MessageCircle size={24} />
            <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 -translate-y-1 translate-x-1 items-center justify-center rounded-full bg-[var(--color-danger-main)] px-1 text-xs font-bold text-white">
                {unreadCount}
            </span>
        </button>
    );
}

