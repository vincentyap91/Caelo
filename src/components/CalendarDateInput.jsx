import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';

const INPUT_CLASS =
    'date-input-single-icon h-11 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] pl-4 pr-10 text-sm font-medium text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]';

/**
 * Styled `type="date"` with a single Lucide calendar affordance (see `.date-input-single-icon` in theme.css).
 * @param {Object} props
 * @param {import('react').ReactNode} [props.label] — if set, wraps field in a block label with title styling.
 * @param {string} [props.className] — outer wrapper (label or div); default `block` when `label` is set, else unset.
 * @param {string} [props.labelClassName] — extra classes on the label title span.
 * @param {string} [props.inputClassName] — appended to the input element classes.
 */
const CalendarDateInput = forwardRef(function CalendarDateInput(
    { label, className, labelClassName = '', inputClassName = '', ...inputProps },
    ref,
) {
    const control = (
        <div className="relative flex items-center">
            <input
                ref={ref}
                type="date"
                className={[INPUT_CLASS, inputClassName].filter(Boolean).join(' ')}
                {...inputProps}
            />
            <Calendar
                size={18}
                className="pointer-events-none absolute right-3 text-[var(--color-accent-600)]"
                aria-hidden
            />
        </div>
    );

    if (label != null) {
        return (
            <label className={className ?? 'block'}>
                <span
                    className={[
                        'mb-2 block text-xs font-semibold text-[var(--color-text-strong)] md:text-sm',
                        labelClassName,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {label}
                </span>
                {control}
            </label>
        );
    }

    return <div className={className}>{control}</div>;
});

CalendarDateInput.displayName = 'CalendarDateInput';

export default CalendarDateInput;
