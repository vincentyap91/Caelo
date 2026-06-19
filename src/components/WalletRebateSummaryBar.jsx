import React from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { BROWSE_MEMBERSHIP_REBATE, BROWSE_WALLET_BALANCE } from '../constants/browseWalletSummary';

/** Matches ProductBrowseControlPanel: outer panel around WalletRebateSummaryBar (Slots / browse). */
export const WALLET_REBATE_BROWSE_PANEL_CLASS =
    'rounded-[24px] border border-[var(--color-border-subtle)] bg-gradient-wallet-glass px-2.5 py-2 shadow-[var(--shadow-live-card)] backdrop-blur-sm md:px-4 md:py-4';

/** Web_Slot - Cam88 (781:13837 / 903:25656) wallet / promo shell — semantic surface-base (§13.11). */
export const SLOTS_BROWSE_PANEL_CLASS =
    'slots-browse-panel rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] px-2.5 py-2 shadow-[var(--shadow-live-card)] backdrop-blur-sm md:px-4 md:py-4';

/** Shared inner card shell for slots browse summary tiles (wallet, promo, etc.). */
export const BROWSE_SUMMARY_CARD_SHELL_CLASS =
    'surface-card rounded-[var(--radius-panel)] border-[var(--color-border-subtle)] bg-gradient-wallet-panel shadow-[var(--shadow-subtle)]';

/** Cam88 Web_Slot inner summary tiles — `--color-surface` card shell (§13.11). */
export const SLOTS_BROWSE_SUMMARY_CARD_SHELL_CLASS =
    'slots-browse-summary-card rounded-[var(--radius-panel)] border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] shadow-[var(--shadow-subtle)]';

export const BROWSE_SUMMARY_CARD_COMPACT_CLASS =
    'min-h-[56px] px-2.5 py-2.5 sm:min-h-[68px] sm:px-3.5 sm:py-3';

/** Typography aligned with compact denseMobile wallet/rebate tiles. */
export const BROWSE_SUMMARY_LABEL_COMPACT_CLASS =
    'font-semibold tracking-tight leading-tight text-[var(--color-primary)] text-xs sm:text-sm';

export const SLOTS_BROWSE_SUMMARY_LABEL_COMPACT_CLASS =
    'slots-browse-summary-label font-semibold tracking-tight leading-tight text-[var(--color-primary)] text-xs sm:text-sm';

export const BROWSE_SUMMARY_VALUE_COMPACT_CLASS =
    'tabular-nums font-bold leading-tight tracking-tight text-[var(--color-surface-accent)] text-base sm:text-lg md:text-xl';

export const SLOTS_BROWSE_SUMMARY_VALUE_COMPACT_CLASS =
    'slots-browse-summary-value tabular-nums font-bold leading-tight tracking-tight text-[var(--color-text-primary)] text-base sm:text-lg md:text-xl';

function SummaryItem({
    title,
    value,
    icon: Icon,
    valueClassName = 'text-[var(--color-text-primary)]',
    iconClassName = 'text-[var(--color-text-soft)]',
    emphasis = 'default',
    compact = false,
    denseMobile = false,
    browseSemantics = 'default',
}) {
    const isSlotsBrowse = browseSemantics === 'slots';
    const isPrimary = emphasis === 'primary';
    const cardShellClass = isSlotsBrowse ? SLOTS_BROWSE_SUMMARY_CARD_SHELL_CLASS : BROWSE_SUMMARY_CARD_SHELL_CLASS;

    const compactLayoutClass = denseMobile
        ? 'min-h-[56px] gap-1.5 px-2.5 py-1.5 sm:min-h-[68px] sm:gap-2 sm:px-3.5 sm:py-2.5'
        : 'min-h-[64px] gap-2 px-3 py-2 sm:min-h-[68px] sm:px-3.5 sm:py-2.5';

    const valueSizeClass = (() => {
        if (!compact) {
            return isPrimary ? 'text-2xl font-bold sm:text-3xl' : 'text-2xl font-bold sm:text-3xl';
        }
        if (denseMobile) {
            return isPrimary
                ? 'text-base font-bold sm:text-lg sm:font-bold md:text-xl'
                : 'text-base font-bold sm:text-lg md:text-xl';
        }
        return isPrimary ? 'text-lg font-bold sm:text-xl' : 'text-lg font-bold sm:text-xl';
    })();

    const iconBtnClass = compact
        ? denseMobile
            ? 'h-7 w-7 sm:h-[30px] sm:w-[30px] md:h-[34px] md:w-[34px]'
            : 'h-[30px] w-[30px] sm:h-[34px] sm:w-[34px]'
        : 'h-9 w-9 sm:h-10 sm:w-10';

    const iconSize = compact ? (denseMobile ? 13 : 14) : 17;
    const labelClass =
        compact && denseMobile
            ? isSlotsBrowse
                ? SLOTS_BROWSE_SUMMARY_LABEL_COMPACT_CLASS
                : BROWSE_SUMMARY_LABEL_COMPACT_CLASS
            : isSlotsBrowse
              ? `slots-browse-summary-label font-semibold tracking-tight text-[var(--color-primary)] ${compact ? 'text-xs sm:text-sm' : 'text-sm'}`
              : `font-semibold tracking-tight text-[var(--color-text-secondary)] ${compact ? 'text-xs sm:text-sm' : 'text-sm'}`;
    const resolvedValueClassName = isSlotsBrowse ? 'text-[var(--color-text-primary)]' : valueClassName;
    const compactValueClass =
        compact && denseMobile
            ? isSlotsBrowse
                ? SLOTS_BROWSE_SUMMARY_VALUE_COMPACT_CLASS
                : BROWSE_SUMMARY_VALUE_COMPACT_CLASS
            : valueSizeClass;

    return (
        <article
            className={`${cardShellClass} flex h-full min-w-0 items-center justify-between ${compact ? compactLayoutClass : 'min-h-[86px] gap-3 px-4 py-3 sm:min-h-[92px] sm:px-4.5 sm:py-3.5'
                }`}
        >
            <div className="min-w-0 flex-1">
                <p className={labelClass}>{title}</p>
                <p
                    className={`tabular-nums leading-tight tracking-tight sm:leading-none ${resolvedValueClassName} ${compactValueClass}`}
                >
                    {value}
                </p>

            </div>

            <div className="flex shrink-0 items-start">
                <button
                    type="button"
                    aria-label={title}
                    className={`inline-flex items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-float)] ${iconClassName} ${iconBtnClass}`}
                >
                    <Icon size={iconSize} strokeWidth={2} />
                </button>
            </div>
        </article>
    );
}

export default function WalletRebateSummaryBar({
    wallet = BROWSE_WALLET_BALANCE,
    membershipRebate = BROWSE_MEMBERSHIP_REBATE,
    className = '',
    compact = false,
    bare = false,
    denseMobile = false,
    browseSemantics = 'default',
}) {
    const panelPad = compact
        ? denseMobile
            ? 'p-0 sm:p-1.5 md:p-2'
            : 'p-1.5 sm:p-2'
        : 'p-2.5 sm:p-3';

    const gridGap = compact
        ? denseMobile
            ? 'gap-1 sm:gap-1.5 md:gap-2'
            : 'gap-1.5 sm:gap-2'
        : 'gap-2.5 sm:gap-3';

    return (
        <section
            aria-label="Wallet and membership rebate summary"
            className={`${bare
                ? 'rounded-none border-0 bg-transparent p-0 shadow-none'
                : `surface-panel rounded-[calc(var(--radius-shell)-4px)] border-[var(--color-border-subtle)] bg-gradient-wallet-shell shadow-[var(--shadow-subtle)] ${panelPad}`
                } ${className}`}
        >
            <div
                className={`grid ${denseMobile ? 'grid-cols-2' : 'sm:grid-cols-2'} ${gridGap}`}
            >
                <SummaryItem
                    title="Wallet Balance"
                    value={wallet}
                    icon={RefreshCw}
                    emphasis="primary"
                    compact={compact}
                    denseMobile={denseMobile}
                    browseSemantics={browseSemantics}
                />
                <SummaryItem
                    title="Membership Rebate"
                    value={membershipRebate}
                    icon={Lock}
                    iconClassName="text-[var(--color-text-soft)]"
                    compact={compact}
                    denseMobile={denseMobile}
                    browseSemantics={browseSemantics}
                />
            </div>
        </section>
    );
}

