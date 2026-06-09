import React from 'react';
import pussy888PrelaunchBanner from '../../assets/prelaunch-banner.jpg';
const LOGO_URL = 'https://pksoftcdn.azureedge.net/media/pussy888-202511050844023196.png';

const inputClass =
    'w-full rounded-xl border border-[var(--color-border-subtle)]/90 bg-[var(--color-surface-base)] px-3.5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--inset-panel)] outline-none ring-[var(--color-accent)] focus-visible:ring-2';

const primaryBtnClass =
    'btn-theme-cta-soft inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-2.5 text-center text-xs font-bold leading-tight shadow-[var(--shadow-cta-soft)] transition hover:brightness-[1.05] active:scale-[0.98] sm:text-sm';

const secondaryBtnClass =
    'btn-theme-primary inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-2.5 text-center text-xs font-bold leading-tight text-[var(--color-text-card-text)] shadow-sm transition hover:brightness-110 active:scale-[0.98] sm:text-sm';

/**
 * Pre-launch instructions for Pussy888: shown on game detail before the iframe / play modal.
 */
export default function Pussy888PreLaunchPanel({ onLaunchWebsite }) {
    return (
        <section
            aria-label="Pussy888 launch instructions"
            className="relative isolate w-full overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] shadow-[var(--shadow-card-raised)]"
        >
            <img
                src={pussy888PrelaunchBanner}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[89%_0%] md:object-center"
                loading="lazy"
                decoding="async"
            />
            <div
                className="absolute inset-0 bg-gradient-game-card-overlay md:bg-gradient-sidenav-scrim"
                aria-hidden
            />

            <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 text-center md:max-w-none md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 md:py-12 md:text-left lg:gap-16">
                <div className="flex w-full max-w-md flex-col items-center md:max-w-lg md:items-center">
                    <img
                        src={LOGO_URL}
                        alt="Pussy888"
                        className="h-16 w-auto max-w-[min(100%,240px)] object-contain object-center md:h-[4.5rem]"
                    />
                    <p className="mt-5 text-sm font-medium leading-relaxed text-[var(--color-text-card-text)] md:mt-6 md:text-base">
                        To play, click &apos;Transfer All Credit&apos;, launch the APK, copy paste your username and password to log
                        in.
                    </p>

                    <div className="mt-6 w-full space-y-4 text-left">
                        <div>
                            <label htmlFor="p888-demo-user" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-card-text)]">
                                Username
                            </label>
                            <input id="p888-demo-user" type="text" readOnly value="12WIN_MEMBER" className={inputClass} tabIndex={-1} />
                        </div>
                        <div>
                            <label htmlFor="p888-demo-pass" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-card-text)]">
                                Password
                            </label>
                            <input
                                id="p888-demo-pass"
                                type="password"
                                readOnly
                                value="••••••••"
                                className={inputClass}
                                tabIndex={-1}
                            />
                        </div>
                    </div>

                    <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:gap-3.5">
                        <button type="button" className={primaryBtnClass}>
                            Transfer All Credit
                        </button>
                        <button type="button" className={secondaryBtnClass}>
                            Restore All Credit
                        </button>
                        <button type="button" className={primaryBtnClass}>
                            Download APK
                        </button>
                        <button type="button" onClick={onLaunchWebsite} className={secondaryBtnClass}>
                            Launch Website
                        </button>
                    </div>
                </div>

                <div className="hidden min-h-[200px] flex-1 md:block" aria-hidden />
            </div>
        </section>
    );
}
