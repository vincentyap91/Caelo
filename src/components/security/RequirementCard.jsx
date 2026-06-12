import React from 'react';
import { Info } from 'lucide-react';

export default function RequirementCard({ title, items, helperText }) {
    return (
        <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-card-soft)]">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--color-text-primary)]">
                <Info size={18} className="text-[var(--color-info-icon)]" />
                {title}
            </h3>
            {items && items.length > 0 && (
                <ul className="mb-4 space-y-2">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-info-icon)]" />
                            {item}
                        </li>
                    ))}
                </ul>
            )}
            {helperText && (
                <div className="flex gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-cool-light)] p-4">
                    <Info size={18} className="mt-0.5 shrink-0 text-[var(--color-info-icon)]" />
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{helperText}</p>
                </div>
            )}
        </div>
    );
}
