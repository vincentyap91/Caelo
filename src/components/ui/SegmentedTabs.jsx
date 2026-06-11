import React from 'react';

/**
 * Rebate-style segmented control (Cam88 color/button/tabs + color/surface/filter).
 * Active: navy pill + white label. Inactive: transparent on shell, muted label.
 *
 * @param {'equal' | 'fit'} [layout] - 'equal': all tabs same width; 'fit': tabs fit content width.
 * @param {string} [className] - Optional extra classes for the container
 */
export default function SegmentedTabs({ items, value, onChange, layout = 'equal', className = '' }) {
    const isEqual = layout === 'equal';

    return (
        <div
            role="tablist"
            className={`caelo-segmented-tabs ${isEqual ? 'caelo-segmented-tabs--equal' : 'caelo-segmented-tabs--fit'} ${className}`.trim()}
        >
            {items.map((item) => {
                const id = typeof item === 'string' ? item : item.id;
                const label = typeof item === 'string' ? item : item.label;
                const active = value === id;

                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(id)}
                        className={`caelo-segmented-tabs__tab ${active ? 'caelo-segmented-tabs__tab--active' : ''} ${
                            isEqual ? 'caelo-segmented-tabs__tab--equal' : 'caelo-segmented-tabs__tab--fit'
                        }`.trim()}
                    >
                        <span className="caelo-segmented-tabs__label">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
