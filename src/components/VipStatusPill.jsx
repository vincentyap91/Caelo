import React from 'react';
import { getVipStatus } from '../constants/vipStatus';

export default function VipStatusPill({ level = 'Diamond', theme = 'light', size = 'default', username, layout = 'row', className = '' }) {
  const vip = getVipStatus(level);
  const isDark = theme === 'dark';
  const compact = size === 'compact';
  const large = size === 'large';
  const header = size === 'header';
  const headerWithUsername = header && username;
  const isColumn = layout === 'column';

  const medalSize = header ? 'h-6 w-6' : compact ? 'h-5 w-5' : large ? 'h-10 w-10' : 'h-7 w-7';
  const textSize = header ? 'text-xs' : compact ? 'text-xs' : large ? 'text-sm md:text-base' : 'text-xs';
  const padding = header ? 'px-3 py-0' : compact ? 'px-2.5 py-1' : large ? 'px-4 py-2.5 md:px-5 md:py-3' : 'px-3 py-1.5';
  const gap = isColumn && large ? 'gap-2.5' : header ? 'gap-2' : 'gap-2';

  const flexDir = isColumn ? 'flex-col' : 'flex-row';

  const basePillClasses = `inline-flex ${flexDir} items-center ${gap} ${header ? 'h-10 rounded-xl' : 'rounded-full'} ${padding} ${textSize} transition-all duration-200 ${header ? 'shrink-0' : ''} ${className}`;

  const lightStyles = 'border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)]';
  const darkStyles = 'border border-[rgb(61_125_203)] bg-[linear-gradient(180deg,#143567_0%,#0e2547_100%)] text-[rgb(219_234_255)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]';

  const headerGlossyPill =
    'border border-white/15 bg-[linear-gradient(180deg,#16508f_0%,#0d3562_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-[linear-gradient(180deg,#18599e_0%,#0e3a6d_100%)]';

  const pillStyles = header && isDark ? headerGlossyPill : isDark ? darkStyles : lightStyles;

  const displayText = headerWithUsername ? username : vip.label;
  const textColor = header && isDark ? 'text-[rgb(255_240_160)]' : '';
  const labelText = isColumn ? vip.tier : displayText;

  if (isColumn && large && !isDark) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative flex shrink-0 items-center justify-center">
          <img
            src={vip.medal}
            alt={`${vip.tier} medal`}
            className="h-16 w-16 object-contain md:h-20 md:w-20"
          />
        </div>
        <div
          className="-mt-2 inline-flex items-center justify-center rounded-full border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] px-4 py-2 shadow-[0_0_12px_rgba(59_130_246_/_0.25)]"
        >
          <span className="text-sm font-bold tracking-[0.02em] text-[var(--color-accent-700)] md:text-base">{labelText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${basePillClasses} ${pillStyles}`}>
      <img
        src={vip.medal}
        alt={`${vip.tier} medal`}
        className={`${medalSize} shrink-0 object-contain`}
      />
      <span className={`font-bold tracking-[0.02em] ${isColumn ? 'text-center' : 'min-w-0 truncate'} ${header ? 'max-w-[130px]' : ''} ${textColor || ''}`}>{labelText}</span>
    </div>
  );
}

