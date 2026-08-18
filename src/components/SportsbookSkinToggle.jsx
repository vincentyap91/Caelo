import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function SportsbookSkinToggle({
  skin = 'light',
  onToggle,
  className = '',
}) {
  const isDay = skin !== 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDay}
      aria-label={isDay ? 'Switch sportsbook to dark' : 'Switch sportsbook to white'}
      title={isDay ? 'White sportsbook — click for dark' : 'Dark sportsbook — click for white'}
      onClick={onToggle}
      className={`sb-skin-toggle ${isDay ? 'is-day' : 'is-night'} ${className}`.trim()}
    >
      <span className="sb-skin-toggle__track" aria-hidden>
        <span className="sb-skin-toggle__thumb" />
        <Sun size={13} strokeWidth={2.4} className="sb-skin-toggle__icon sb-skin-toggle__icon--sun" />
        <Moon size={13} strokeWidth={2.4} className="sb-skin-toggle__icon sb-skin-toggle__icon--moon" />
      </span>
    </button>
  );
}
