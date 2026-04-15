import { MessageCircle, Smartphone } from 'lucide-react';

export default function FloatingSocials({ onLiveChatClick, onDownloadAppClick, className = '' }) {
    const unreadCount = 2;

    return (
        <div className={`fixed bottom-20 md:bottom-6 right-6 z-[130] hidden md:flex flex-col gap-4 ${className}`.trim()}>
            {/* App Download - Top */}
            <button
                type="button"
                onClick={onDownloadAppClick}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(90deg,var(--color-brand-secondary)_0%,var(--color-brand-primary)_100%)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition hover:brightness-110"
                aria-label="Download app"
            >
                <Smartphone size={24} className="shrink-0" />
            </button>

            {/* Live Chat - Bottom */}
            <button
                type="button"
                onClick={onLiveChatClick}
                className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-accent-500)_0%,var(--color-brand-deep)_100%)] text-white shadow-[var(--shadow-nav-pill)] transition hover:brightness-110"
                title="Live Chat"
                aria-label="Open live chat"
            >
                <MessageCircle size={24} />
                <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 -translate-y-1 translate-x-1 items-center justify-center rounded-full bg-[var(--color-danger-main)] px-1 text-xs font-bold text-white">
                    {unreadCount}
                </span>
            </button>
        </div>
    );
}

