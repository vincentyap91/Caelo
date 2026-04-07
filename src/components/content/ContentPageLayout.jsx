import React from 'react';

export function ContentHighlightList({ items = [], className = '', variant = 'default' }) {
    if (!items.length) return null;

    const hero = variant === 'hero';
    const heroMobileOverlay = variant === 'heroMobileOverlay';

    return (
        <div
            className={`${
                heroMobileOverlay
                    ? 'grid w-full grid-cols-2 gap-x-2 gap-y-2'
                    : hero
                      ? 'mt-0 flex max-w-[30rem] flex-wrap gap-x-2 gap-y-2.5 md:mt-5 md:max-w-[33rem] md:gap-3'
                      : 'mt-4 flex max-w-[30rem] flex-wrap gap-x-2 gap-y-2.5 md:mt-5 md:max-w-[33rem] md:gap-3'
            } ${className}`.trim()}
        >
            {items.map((item) => (
                <span
                    key={item}
                    className={`inline-flex min-w-0 shrink-0 items-center justify-center rounded-full border text-center text-xs font-bold uppercase leading-tight tracking-[0.14em] text-[var(--color-accent-700)] ${
                        heroMobileOverlay
                            ? 'min-h-[2.5rem] w-full border-[var(--color-accent-100)] bg-white/92 px-2 py-2 shadow-[0_2px_12px_rgba(15,23,42,0.1)] backdrop-blur-sm'
                            : 'border-[var(--color-accent-100)] bg-white px-3.5 py-2 shadow-[var(--shadow-subtle)] sm:px-4'
                    }`}
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

export function ContentSectionCard({ title, description, icon: Icon, children, className = '' }) {
    return (
        <section className={`surface-card rounded-[24px] p-5 md:p-6 ${className}`.trim()}>
            <div className="flex items-start gap-4">
                {Icon ? (
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] text-[var(--color-accent-600)] shadow-[var(--shadow-subtle)]">
                        <Icon size={22} strokeWidth={2.1} />
                    </span>
                ) : null}
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">{title}</h2>
                    {description ? (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">{description}</p>
                    ) : null}
                    {children ? <div className="mt-4">{children}</div> : null}
                </div>
            </div>
        </section>
    );
}

export default function ContentPageLayout({
    eyebrow,
    title,
    lead,
    highlights = [],
    heroVisualSrc = null,
    heroVisualAlt = '',
    children,
}) {
    const heroCardClass = heroVisualSrc
        ? 'rounded-[28px] border-[var(--color-border-brand)] px-5 py-5 shadow-[var(--shadow-card-raised)] sm:px-6 sm:py-6 max-md:rounded-[32px] max-md:px-7 max-md:py-8 md:px-8 md:py-7 lg:px-9 lg:py-8'
        : 'rounded-[28px] border-[var(--color-border-brand)] px-5 py-5 shadow-[var(--shadow-card-raised)] sm:px-6 sm:py-6 md:px-8 md:py-7 lg:px-9 lg:py-8';

    return (
        <main className="w-full bg-[linear-gradient(180deg,var(--gradient-live-page-start)_0%,var(--gradient-live-page-mid)_42%,var(--gradient-live-page-end)_100%)] pb-14 md:pb-20">
            <div className="page-container pt-6 md:pt-8">
                <section className={`surface-card soft-blue-panel relative overflow-hidden ${heroCardClass}`}>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.16)_0%,transparent_72%)]" />
                    <div className="pointer-events-none absolute bottom-[-5rem] left-[-3rem] h-40 w-56 rounded-full bg-[radial-gradient(circle,rgba(224,235,255,0.72)_0%,rgba(224,235,255,0.26)_48%,rgba(224,235,255,0)_76%)] blur-3xl md:bottom-[-4rem] md:left-[-1rem] md:h-48 md:w-72" />
                    {heroVisualSrc ? (
                        <>
                            {/* Mobile: large right column (~56% w), full height; md+: unchanged rail. */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[56%] md:w-[47%] lg:w-[70%]">
                                <div className="absolute inset-0 overflow-hidden rounded-r-[28px] max-md:rounded-r-[32px]">
                                    <div className="content-hero-visual-img-frame absolute inset-0">
                                        <img
                                            src={heroVisualSrc}
                                            alt={heroVisualAlt}
                                            className="absolute inset-0 h-full w-full object-cover object-[82%_42%] max-md:object-[84%_38%] md:object-[81%_center] lg:object-[80%_center]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-x-0 inset-y-0 bg-[linear-gradient(90deg,#fff_0%,#fff_12%,rgba(255,255,255,0.99)_24%,rgba(255,255,255,0.96)_38%,rgba(255,255,255,0.82)_52%,rgba(255,255,255,0.35)_72%,rgba(255,255,255,0.06)_88%,rgba(255,255,255,0)_100%)] md:bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_26%,rgba(255,255,255,0.74)_50%,rgba(255,255,255,0.20)_56%,rgba(255,255,255,0)_100%)]" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.5)_42%,transparent_100%)] md:hidden" />
                            <div
                                className="pointer-events-none absolute left-[14%] top-[3%] h-[6rem] w-[7rem] bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(255,255,255,0.88)_38%,rgba(255,255,255,0.18)_64%,rgba(255,255,255,0)_92%)] blur-[46px] sm:left-[22%] sm:top-[5%] md:left-[31%] md:top-[6%] md:h-28 md:w-32 lg:left-[34%]"
                            />
                        </>
                    ) : null}
                    <div
                        className={`relative z-[1] flex w-full min-h-[248px] sm:min-h-[264px] md:min-h-[282px] lg:min-h-[300px] ${heroVisualSrc ? 'max-md:min-h-0 max-md:flex-col max-md:items-start max-md:justify-start md:flex-row md:items-center' : 'items-center'}`}
                    >
                        {heroVisualSrc ? (
                            <div className="w-full max-w-[28rem] max-md:max-w-[58%] max-md:min-w-0 max-md:pb-32 max-md:pr-0 pr-10 sm:max-w-[31rem] sm:pr-16 md:block md:max-w-[57%] md:pb-0 md:pr-8 lg:max-w-[54%]">
                                {eyebrow ? (
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-700)]">
                                        {eyebrow}
                                    </p>
                                ) : null}
                                <h1 className="page-title mt-2.5 text-[var(--color-text-strong)] max-md:mt-2 md:mt-3">
                                    {title}
                                </h1>
                                {lead ? (
                                    <p className="mt-3 max-w-[34rem] text-sm leading-relaxed text-[var(--color-text-muted)] max-md:mt-3 md:mt-4 md:max-w-[32rem] md:text-base md:leading-7">
                                        {lead}
                                    </p>
                                ) : null}
                                <div className="mt-4 hidden md:mt-5 md:block">
                                    <ContentHighlightList items={highlights} variant="hero" />
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl">
                                {eyebrow ? (
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-700)]">{eyebrow}</p>
                                ) : null}
                                <h1 className="page-title mt-2.5 text-[var(--color-text-strong)] md:mt-3">{title}</h1>
                                {lead ? (
                                    <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[var(--color-text-muted)] md:mt-4 md:max-w-[32rem] md:text-base">
                                        {lead}
                                    </p>
                                ) : null}
                                <ContentHighlightList items={highlights} />
                            </div>
                        )}
                    </div>
                    {heroVisualSrc && highlights.length ? (
                        <div className="absolute inset-x-0 bottom-0 z-[4] md:hidden">
                            <div className="bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.65)_32%,rgba(255,255,255,0.96)_100%)] px-7 pb-7 pt-12">
                                <ContentHighlightList items={highlights} variant="heroMobileOverlay" />
                            </div>
                        </div>
                    ) : null}
                </section>

                <div className="mt-5 space-y-5 md:mt-7 md:space-y-6">{children}</div>
            </div>
        </main>
    );
}
