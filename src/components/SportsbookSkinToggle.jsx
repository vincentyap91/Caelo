import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const TOGGLE_MS = 420;

export default function SportsbookSkinToggle({
  skin = 'light',
  onToggle,
  className = '',
}) {
  const isDayProp = skin !== 'dark';
  const [isDay, setIsDay] = useState(isDayProp);
  const busyRef = useRef(false);
  const timerRef = useRef(0);

  useEffect(() => {
    if (busyRef.current) return;
    setIsDay(isDayProp);
  }, [isDayProp]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleClick = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setIsDay((current) => !current);
    timerRef.current = window.setTimeout(() => {
      onToggle?.();
      busyRef.current = false;
    }, TOGGLE_MS);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDay}
      aria-busy={busyRef.current}
      aria-label={isDay ? 'Switch sportsbook to dark' : 'Switch sportsbook to white'}
      title={isDay ? 'White sportsbook — click for dark' : 'Dark sportsbook — click for white'}
      onClick={handleClick}
      className={`sb-skin-toggle ${isDay ? 'is-day' : 'is-night'} ${className}`.trim()}
    >
      <span className="sb-skin-toggle__sky sb-skin-toggle__sky--day" aria-hidden />
      <span className="sb-skin-toggle__sky sb-skin-toggle__sky--night" aria-hidden />
      <span className="sb-skin-toggle__thumb">
        {isDay ? (
          <Sun
            key="sun"
            size={12}
            strokeWidth={2.5}
            className="sb-skin-toggle__icon sb-skin-toggle__icon--sun"
          />
        ) : (
          <Moon
            key="moon"
            size={12}
            strokeWidth={2.5}
            className="sb-skin-toggle__icon sb-skin-toggle__icon--moon"
          />
        )}
      </span>
    </button>
  );
}
