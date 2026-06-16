import React, { useCallback, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import GameDetailFallbackPanel from './GameDetailFallbackPanel';

/**
 * Game stage: wide 21:9 on desktop page, or full-bleed height inside mobile play modal.
 * @param {Object} props
 * @param {'embedded' | 'fullscreen'} [props.variant]
 * @param {string} [props.iframeUrl]
 * @param {string} [props.iframeTitle]
 * @param {boolean} [props.showFallback]
 * @param {string} [props.fallbackMessage]
 * @param {import('react').ReactNode} [props.fallbackActions]
 * @param {import('react').ReactNode} [props.children] — replaces iframe when no iframeUrl (e.g. custom loader)
 */
export default function GameDetailPlayer({
    variant = 'embedded',
    iframeUrl,
    iframeTitle = 'Game',
    showFallback = false,
    fallbackMessage = '',
    fallbackActions = null,
    children = null,
}) {
    const wrapRef = useRef(null);
    const [fs, setFs] = useState(false);

    const toggleFullscreen = useCallback(() => {
        const el = wrapRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen?.().catch(() => {});
        } else {
            document.exitFullscreen?.().catch(() => {});
        }
    }, []);

    React.useEffect(() => {
        const onFs = () => setFs(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', onFs);
        return () => document.removeEventListener('fullscreenchange', onFs);
    }, []);

    const showIframe = Boolean(iframeUrl) && !showFallback;
    const isFullscreen = variant === 'fullscreen';

    return (
        <div
            ref={wrapRef}
            className={`relative w-full overflow-hidden bg-[var(--color-surface-start)] ${
                isFullscreen
                    ? 'flex h-full min-h-0 flex-1 flex-col rounded-none shadow-none ring-0'
                    : `rounded-2xl shadow-[var(--shadow-card-raised)] ring-1 ring-[var(--color-border-subtle)] ${
                          fs ? 'rounded-none ring-0 shadow-none' : ''
                      }`
            }`}
        >
            <div
                className={
                    isFullscreen ? 'relative min-h-0 flex-1 w-full' : 'relative aspect-[21/9] w-full'
                }
            >
                {children && !showIframe ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface-start)]">{children}</div>
                ) : null}

                {showIframe ? (
                    <iframe
                        title={iframeTitle}
                        src={iframeUrl}
                        className="absolute inset-0 h-full w-full border-0"
                        allow="autoplay; fullscreen; payment"
                        allowFullScreen
                    />
                ) : null}

                {showFallback ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface-darkest)]/88 p-4 sm:p-6">
                        <GameDetailFallbackPanel message={fallbackMessage} actions={fallbackActions} />
                    </div>
                ) : null}

                {!isFullscreen ? (
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-brand)]/20 bg-[var(--color-surface-darkest)]/50 text-[var(--color-tertiery)] backdrop-blur-sm transition hover:bg-[var(--color-surface-darkest)]/70"
                        aria-label={fs ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                        <Maximize2 size={18} />
                    </button>
                ) : null}
            </div>
        </div>
    );
}
