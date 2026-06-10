import React, { useState } from 'react';
import { Copy, Check, Share2, Users } from 'lucide-react';
import referralBanner from '../../assets/home/referral-banner-1544x451.webp';

const REFERRAL_CODE = '024555';
const REFERRAL_URL =
    typeof window !== 'undefined'
        ? `${window.location.origin}/en/register?code=${REFERRAL_CODE}`
        : `https://staging.riocity9.com/en/register?code=${REFERRAL_CODE}`;

const SHARE_BTN = {
    background: 'var(--color-danger)',
    color: 'var(--color-text-card-text)',
    boxShadow: 'var(--shadow-hot)',
};

const NAVY_BTN = {
    background: 'var(--color-primary)',
    color: 'var(--color-text-card-text)',
    boxShadow: 'var(--shadow-accent)',
};

function ReferralHubCard({
    onNavigate,
    onShare,
    copied,
    onCopy,
    className = '',
    idPrefix = 'referral-banner',
}) {
    return (
        <div
            className={`w-full rounded-2xl border border-[var(--color-border-brand)] bg-[var(--color-surface-cool-light)] p-5 text-center sm:p-6 ${className}`}
        >
            <h2 className="text-xl font-bold leading-tight text-[var(--color-text-tertiary)]">
                Your Unique Referral Hub
            </h2>
            <p className="mt-1 text-base font-bold text-[var(--color-text-card-text)]">
                Share &amp; Grow Your Network
            </p>

            <div className="mt-4 text-left">
                <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
                    My Referral Link
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 py-2.5">
                    <input
                        type="text"
                        value={REFERRAL_URL}
                        readOnly
                        aria-label="Referral link"
                        className="min-w-0 flex-1 bg-transparent text-[11px] font-mono text-[var(--color-text-tertiary)] outline-none"
                    />
                    <button
                        type="button"
                        onClick={onCopy}
                        aria-label="Copy referral link"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] transition-colors duration-150 hover:bg-[var(--color-border-brand)]"
                    >
                        {copied ? (
                            <Check size={14} className="text-[var(--color-success)]" />
                        ) : (
                            <Copy size={14} />
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    id={`${idPrefix}-share-btn`}
                    onClick={onShare}
                    className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                    style={SHARE_BTN}
                >
                    <Share2 size={14} />
                    Share
                </button>
                <button
                    type="button"
                    id={`${idPrefix}-downlines-btn`}
                    onClick={() => onNavigate?.('referral')}
                    className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                    style={NAVY_BTN}
                >
                    <Users size={14} />
                    Downlines
                </button>
            </div>

            <button
                type="button"
                id={`${idPrefix}-more-info-btn`}
                onClick={() => onNavigate?.('referral')}
                className="mt-2.5 w-full rounded-xl py-3 text-sm font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                style={NAVY_BTN}
            >
                More Info
            </button>
        </div>
    );
}

function MobileLayout({ onNavigate, onShare, copied, onCopy }) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl md:hidden">
            <img
                src={referralBanner}
                alt="Referral – Invite friends and earn"
                className="block h-auto w-full object-cover object-center"
                draggable={false}
            />
            <div className="w-full px-4 py-4">
                <ReferralHubCard
                    onNavigate={onNavigate}
                    onShare={onShare}
                    copied={copied}
                    onCopy={onCopy}
                    idPrefix="mob-referral"
                />
            </div>
        </div>
    );
}

function DesktopLayout({ onNavigate, onShare, copied, onCopy }) {
    return (
        <div className="relative hidden w-full overflow-hidden rounded-2xl md:block">
            <img
                src={referralBanner}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="block h-auto w-full object-cover object-center"
            />

            <div className="absolute inset-0 z-10 flex items-center p-4">
                <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
                    <ReferralHubCard
                        onNavigate={onNavigate}
                        onShare={onShare}
                        copied={copied}
                        onCopy={onCopy}
                        className="w-full shrink-0 md:max-w-[360px] lg:max-w-[380px] lg:ml-[2%]"
                    />
                </div>
            </div>
        </div>
    );
}

export default function ReferralBannerSection({ onNavigate }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(REFERRAL_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: 'Join me!',
                    text: `Use my referral code ${REFERRAL_CODE} when you sign up!`,
                    url: REFERRAL_URL,
                })
                .catch(() => { });
        } else {
            handleCopy();
        }
    };

    const sharedProps = {
        onNavigate,
        onShare: handleShare,
        onCopy: handleCopy,
        copied,
    };

    return (
        <section aria-label="Referral banner" className="w-full">
            <MobileLayout {...sharedProps} />
            <DesktopLayout {...sharedProps} />
        </section>
    );
}
