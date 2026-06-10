import React from 'react';
import wineGlass from '../assets/wine-glass.png';
import penguin from '../assets/penguin.png';

const MobilePromoCard = ({ title, image, imageAlt, imageClassName = '', glowClassName = '', onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="home-promo-card home-promo-card--mobile relative w-full cursor-pointer overflow-hidden rounded-[24px] border-2 border-[var(--color-border-brand)] bg-gradient-promo-card text-left shadow-[var(--shadow-brand-soft)] transition-[transform,box-shadow] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-button-hover)] md:hidden"
    >
        <div className="absolute inset-0 bg-gradient-promo-overlay" />
        <div className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-promo-bottom-glow ${glowClassName}`} />

        <div className="relative z-10 grid min-h-[158px] grid-cols-[1.2fr_0.9fr] items-center gap-2 px-4 py-4">
            <div className="self-center">
                <h3 className="max-w-[150px] text-base font-bold leading-tight tracking-tight text-[var(--color-button-hover)]">
                    {title}
                </h3>
            </div>

            <div className="relative flex h-full items-center justify-end">
                <div className="home-promo-card__image-glow pointer-events-none absolute bottom-2 right-0 h-20 w-20 rounded-full blur-2xl" />
                <img
                    src={image}
                    alt={imageAlt}
                    className={`home-promo-card__image relative z-10 h-[112px] w-auto max-w-none object-contain ${imageClassName}`}
                />
            </div>
        </div>
    </button>
);

const DesktopPromoCard = ({ title, image, imageAlt, imageClassName = '', glowClassName = '', onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="home-promo-card home-promo-card--desktop group relative hidden h-[120px] w-full flex-1 cursor-pointer rounded-2xl border-2 border-[var(--color-border-brand)] bg-gradient-promo-card-desktop text-left shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-button-hover)] md:block"
    >
        <div className="absolute inset-0 bg-cover opacity-10 mix-blend-multiply" />
        <div className={`absolute inset-x-0 bottom-0 h-full ${glowClassName}`} />

        <div className="absolute left-6 top-1/2 z-10 -translate-y-1/2 flex flex-col gap-1">
            <h3 className="w-[280px] text-lg font-bold leading-tight tracking-tight text-[var(--color-button-hover)]">
                {title}
            </h3>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-[6px] z-20 h-[150px] origin-bottom transition-transform group-hover:scale-[1.03]">
            <img
                src={image}
                alt={imageAlt}
                className={`home-promo-card__image h-full w-auto max-w-none object-contain ${imageClassName}`}
            />
        </div>
    </button>
);

export default function Promos({ onNavigate }) {
    return (
        <section className="home-promos-section mt-6 flex w-full flex-col gap-4 md:flex-row md:gap-6">
            <MobilePromoCard
                title={<>Special Welcome Bonus<br />For New Member</>}
                image={wineGlass}
                imageAlt="Welcome bonus woman"
                imageClassName="translate-y-2"
                onClick={() => onNavigate?.('promotion')}
            />
            <DesktopPromoCard
                title={<>Special Welcome Bonus<br />For New Member</>}
                image={wineGlass}
                imageAlt="Welcome bonus woman"
                imageClassName=""
                onClick={() => onNavigate?.('promotion')}
            />

            <MobilePromoCard
                title="Earn Referral Bonus"
                image={penguin}
                imageAlt="Earn referral bonus"
                imageClassName="translate-y-2"
                glowClassName="!bg-gradient-promo-bottom-glow-soft"
                onClick={() => onNavigate?.('referral')}
            />
            <DesktopPromoCard
                title="Earn Referral Bonus"
                image={penguin}
                imageAlt="Earn referral bonus"
                imageClassName=""
                glowClassName="!bg-gradient-promo-bottom-glow-soft"
                onClick={() => onNavigate?.('referral')}
            />
        </section>
    );
}


