import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import GameDetailPlayer from './GameDetailPlayer';

/**
 * Full-screen mobile launcher for the game iframe / fallback (desktop unused).
 */
export default function GameDetailPlayModal({
    open,
    onClose,
    gameTitle,
    iframeUrl,
    iframeTitle,
    showFallback,
    fallbackMessage,
    fallbackActions,
    gameContainerChildren,
}) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useBodyScrollLock(mounted);

    useEffect(() => {
        if (open) {
            setMounted(true);
            const id = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(id);
        }
        setVisible(false);
        const t = window.setTimeout(() => setMounted(false), 220);
        return () => window.clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (!open || !mounted) {
            return undefined;
        }
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, mounted, onClose]);

    if (!mounted || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={gameTitle ? `Play ${gameTitle}` : 'Game player'}
            className={`fixed inset-0 z-[240] flex flex-col bg-[var(--color-surface-darkest)] transition-opacity duration-200 ease-out ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ maxHeight: '100dvh', height: '100dvh' }}
        >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border-brand)] bg-[var(--color-primary)] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[var(--inset-highlight-soft)]">
                <h2 className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight text-[var(--color-text-card-text)] md:text-base">{gameTitle}</h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close game"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border-brand)]/25 bg-[var(--color-border-subtle)] text-[var(--color-text-card-text)] transition hover:bg-[var(--color-surface-base)]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                    <X size={20} strokeWidth={2.25} />
                </button>
            </header>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <GameDetailPlayer
                    variant="fullscreen"
                    iframeUrl={iframeUrl}
                    iframeTitle={iframeTitle ?? gameTitle}
                    showFallback={showFallback}
                    fallbackMessage={fallbackMessage}
                    fallbackActions={fallbackActions}
                >
                    {gameContainerChildren}
                </GameDetailPlayer>
            </div>
        </div>,
        document.body,
    );
}
