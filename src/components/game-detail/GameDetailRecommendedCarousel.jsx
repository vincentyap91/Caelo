import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {{ id: string, name: string, imgUrl: string, provider?: string }[]} props.games
 * @param {() => void} [props.onMoreGames]
 * @param {(game: object) => void} [props.onGameClick]
 */
export default function GameDetailRecommendedCarousel({ title = 'Recommended Games', games = [], onMoreGames, onGameClick }) {
    const scrollerRef = useRef(null);

    const scrollBy = (dir) => {
        const el = scrollerRef.current;
        if (!el) return;
        const delta = Math.min(320, el.clientWidth * 0.85);
        el.scrollBy({ left: dir * delta, behavior: 'smooth' });
    };

    return (
        <section className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6 lg:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 md:mb-6">
                <h3 className="text-lg font-bold italic tracking-tight text-[var(--color-text-strong)] md:text-xl">{title}</h3>
                <div className="flex flex-shrink-0 items-center gap-2">
                    {onMoreGames ? (
                        <button
                            type="button"
                            onClick={onMoreGames}
                            className="btn-theme-primary rounded-xl px-4 py-2 text-xs font-bold md:text-sm"
                        >
                            More Games
                        </button>
                    ) : null}
                    <div className="hidden gap-1 sm:flex">
                        <button
                            type="button"
                            onClick={() => scrollBy(-1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-accent-600)] transition hover:bg-[var(--color-accent-50)]"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollBy(1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-accent-600)] transition hover:bg-[var(--color-accent-50)]"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={scrollerRef}
                className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 pt-0.5 md:gap-4 lg:gap-5"
            >
                {games.map((g) => (
                    <button
                        key={g.id}
                        type="button"
                        onClick={() => onGameClick?.(g)}
                        className="group relative flex w-[42%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-[200px] md:w-[220px]"
                    >
                        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-slate-200">
                            <img
                                src={g.imgUrl}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.04]"
                                loading="lazy"
                                decoding="async"
                            />
                            {g.provider ? (
                                <span className="absolute left-1/2 top-2 z-[1] max-w-[90%] -translate-x-1/2 truncate rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                                    {g.provider}
                                </span>
                            ) : null}
                        </div>
                        <p className="line-clamp-2 shrink-0 px-2 py-2 text-center text-xs font-bold text-[var(--color-text-strong)] md:text-sm">{g.name}</p>
                    </button>
                ))}
            </div>
        </section>
    );
}
