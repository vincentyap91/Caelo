import React from 'react';
import { PAGE_BANNER_IMG_FILL } from '../../constants/pageBannerClasses';
import { LIVE_CASINO_HERO_BANNER } from '../../constants/liveCasinoPageConfig';

/**
 * 12WIN GameLobby hero: single fixed “LIVE CASINO” banner (no per-provider swap, no CTA overlay).
 */
export default function LiveCasinoLobbyHero({ bannerImage = LIVE_CASINO_HERO_BANNER, bannerAlt = 'Live Casino' }) {
    return (
        <section className="w-full pt-5 md:pt-7">
            <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
                <div className="page-hero-banner">
                    <img
                        src={bannerImage}
                        alt={bannerAlt}
                        className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL} page-hero-banner__img--show-bottom`}
                    />
                </div>
            </div>
        </section>
    );
}
