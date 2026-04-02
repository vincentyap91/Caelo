import React from 'react';

/**
 * Full-width nav mega-menu: fixed square provider tiles (same chrome as legacy Live Casino dropdown).
 * @param {Object} props
 * @param {boolean} props.open
 * @param {{ id: string, name: string, image?: string, src?: string, hot?: boolean }[]} props.providers
 * @param {(provider: object) => void} [props.onProviderClick]
 */
export default function NavProviderDropdownPanel({ open = false, providers = [], onProviderClick }) {
    if (!open) {
        return null;
    }

    return (
        <section className="absolute left-1/2 top-full z-[80] w-screen -translate-x-1/2 border-t border-[rgb(26_59_114)]">
            <div className="mx-auto w-full max-w-screen-2xl px-4 py-5 md:px-8 md:py-7">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-8">
                    {providers.map((provider) => {
                        const img = provider.image ?? provider.src;
                        const label = provider.name ?? provider.label ?? '';
                        return (
                            <button
                                key={provider.id}
                                type="button"
                                onClick={() => onProviderClick?.(provider)}
                                className="group relative h-[160px] w-[160px] justify-self-center overflow-hidden rounded-2xl border border-white/10 bg-[rgb(10_28_63)] text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-[rgb(158_199_255_/_0.7)] hover:shadow-[0_0_0_1px_rgba(120,178,255,0.45),0_14px_24px_rgba(7,19,44,0.75),0_0_24px_rgba(97,156,255,0.35)]"
                            >
                                {img ? (
                                    <img
                                        src={img}
                                        alt={label}
                                        className="absolute inset-0 h-full w-full object-fill transition duration-500 group-hover:scale-105"
                                        draggable={false}
                                    />
                                ) : null}

                                {provider.hot ? (
                                    <span className="absolute right-2 top-2 rounded-full bg-[var(--color-hot-main)] px-2 py-0.5 text-xs font-bold tracking-[0.06em] text-white shadow-[0_4px_10px_rgba(255,77,0,0.4)]">
                                        HOT
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

