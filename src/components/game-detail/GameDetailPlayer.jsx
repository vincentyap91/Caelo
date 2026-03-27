import React, { useCallback, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import GameDetailFallbackPanel from './GameDetailFallbackPanel';

/**
 * Wide game stage (21:9): shorter than 16:9 so more page content stays visible; iframe, custom children, or fallback overlay.
 * @param {Object} props
 * @param {string} [props.iframeUrl]
 * @param {string} [props.iframeTitle]
 * @param {boolean} [props.showFallback]
 * @param {string} [props.fallbackMessage]
 * @param {import('react').ReactNode} [props.fallbackActions]
 * @param {import('react').ReactNode} [props.children] — replaces iframe when no iframeUrl (e.g. custom loader)
 */
export default function GameDetailPlayer({
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

    return (
        <div
            ref={wrapRef}
            className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 shadow-[var(--shadow-card-raised)] ring-1 ring-[var(--color-border-default)] ${
                fs ? 'rounded-none ring-0 shadow-none' : ''
            }`}
        >
            <div className="relative aspect-[21/9] w-full">
                {children && !showIframe ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950">{children}</div>
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-4">
                        <GameDetailFallbackPanel message={fallbackMessage} actions={fallbackActions} />
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                    aria-label={fs ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                    <Maximize2 size={18} />
                </button>
            </div>
        </div>
    );
}
