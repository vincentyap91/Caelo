import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyInputField({ value, label, readOnly = true }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            setCopied(false);
        }
    };

    return (
        <label className="block">
            {label && (
                <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">{label}</span>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-3 shadow-[var(--shadow-subtle)] transition-all focus-within:border-[var(--color-accent-400)] focus-within:ring-2 focus-within:ring-[rgb(96_165_250_/_0.2)]">
                <input
                    type="text"
                    value={value}
                    readOnly={readOnly}
                    className="flex-1 bg-transparent text-sm font-mono font-medium text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)]"
                />
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]"
                    aria-label="Copy"
                >
                    {copied ? <Check size={16} className="text-[var(--color-success-main)]" /> : <Copy size={16} />}
                </button>
            </div>
        </label>
    );
}
