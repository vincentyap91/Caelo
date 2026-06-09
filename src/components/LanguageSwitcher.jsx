import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FLAG_CDN = 'https://flagcdn.com/w40';
const LANGUAGES = [
    { code: 'en-us', label: 'English', flagCode: 'gb', short: 'EN' },
    { code: 'zh-cn', label: '????', flagCode: 'cn', short: 'CN' },
    { code: 'zh-tw', label: '????', flagCode: 'tw', short: 'TW' },
    { code: 'th-th', label: '???', flagCode: 'th', short: 'TH' },
    { code: 'ko-kr', label: '???', flagCode: 'kr', short: 'KR' },
    { code: 'vi-vn', label: 'Ti?ng Vi?t', flagCode: 'vn', short: 'VN' },
    { code: 'id-id', label: 'Indonesia', flagCode: 'id', short: 'ID' },
    { code: 'hi-in', label: '??????', flagCode: 'in', short: 'IN' },
    { code: 'km-kh', label: 'Khmer', flagCode: 'kh', short: 'KH' },
    { code: 'my-mm', label: '??????', flagCode: 'mm', short: 'MM' },
    { code: 'ja-jp', label: '???', flagCode: 'jp', short: 'JP' },
];

export default function LanguageSwitcher({
    value = 'en-us',
    onChange,
    buttonClassName = 'nav-top-pill nav-top-pill--icon shrink-0',
    tone = 'dark',
    showShortLabel = true,
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const current = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0];
    const isLightTone = tone === 'light';

    useEffect(() => {
        if (!open) return undefined;
        const handlePointerDown = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    return (
        <div ref={ref} className="relative isolate z-[999]">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center ${showShortLabel ? 'gap-1.5' : 'gap-1'} ${buttonClassName} ${
                    isLightTone
                        ? 'border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition-all hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-cool-light)]'
                        : ''
                }`}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Language: ${current.label}`}
            >
                <img
                    src={`${FLAG_CDN}/${current.flagCode}.png`}
                    alt=""
                    className="h-4 w-6 shrink-0 rounded-sm object-cover"
                />
                {showShortLabel ? <span className="text-xs font-bold uppercase">{current.short}</span> : null}
                <ChevronDown
                    size={12}
                    className={`transition-transform ${isLightTone ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-sticky-nav-text)]/75'} ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className={`absolute right-0 top-full z-[450] mt-2 w-[240px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-[18px] py-1 shadow-[var(--shadow-nav-dropdown)] backdrop-blur-xl ${
                        isLightTone
                            ? 'border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]'
                            : 'border border-[var(--color-border-brand)] bg-gradient-language-nav'
                    }`}
                    role="listbox"
                >
                    <div
                        className={`pointer-events-none absolute inset-x-0 top-0 h-12 ${
                            isLightTone
                                ? 'bg-gradient-language-panel-top-light'
                                : 'bg-gradient-language-panel-top'
                        }`}
                    />
                    <div
                        className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 ${
                            isLightTone
                                ? 'bg-gradient-language-panel-radial-light'
                                : 'bg-gradient-language-panel-radial'
                        }`}
                    />
                    {LANGUAGES.map((lang) => {
                        const isActive = value === lang.code;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => {
                                    onChange?.(lang.code);
                                    setOpen(false);
                                }}
                                className={`group relative flex w-full items-center gap-3 px-3.5 py-3 text-left text-sm font-semibold transition-colors duration-200 ${
                                    isLightTone
                                        ? `text-[var(--color-text-primary)] ${
                                            isActive
                                                ? 'bg-[var(--color-surface-subtle)] shadow-[var(--inset-panel)]'
                                                : 'hover:bg-[var(--color-surface-cool-light)]'
                                        }`
                                        : `text-[var(--color-text-sticky-nav-text)] ${
                                            isActive
                                                ? 'bg-gradient-language-option-active shadow-[var(--inset-highlight-soft)]'
                                                : 'hover:bg-[var(--color-border-subtle)]'
                                        }`
                                }`}
                            >
                                <img
                                    src={`${FLAG_CDN}/${lang.flagCode}.png`}
                                    alt=""
                                    className="h-5 w-7 shrink-0 rounded-[4px] object-cover ring-1 ring-white/10"
                                />
                                <span className="font-multilingual min-w-0 flex-1 truncate">{lang.label}</span>
                                <span
                                    className={`ml-auto inline-flex h-2.5 w-2.5 shrink-0 rounded-full transition-opacity ${
                                        isActive
                                            ? isLightTone
                                                ? 'bg-[var(--color-primary)] shadow-[0_0_0_4px_var(--color-accent)]/12'
                                                : 'bg-[var(--color-accent)] shadow-[0_0_0_4px_var(--color-accent)]/18'
                                            : isLightTone
                                                ? 'bg-[var(--color-text-soft)]/0 opacity-0 group-hover:bg-[var(--color-text-soft)]/30 group-hover:opacity-100'
                                                : 'bg-[var(--color-surface-base)]/0 opacity-0 group-hover:bg-[var(--color-surface-base)]/30 group-hover:opacity-100'
                                    }`}
                                    aria-hidden="true"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

