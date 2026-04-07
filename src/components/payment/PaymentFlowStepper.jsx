import React from 'react';
import { Check } from 'lucide-react';

/**
 * Horizontal payment flow stepper (deposit / withdrawal).
 * Labels show on all breakpoints; compact on mobile, roomier on sm+.
 */
export default function PaymentFlowStepper({ step, steps }) {
    return (
        <nav aria-label="Progress" className="w-full">
            <ol className="mx-auto flex w-full max-w-3xl list-none flex-wrap items-stretch justify-center gap-y-2 p-0 sm:flex-nowrap sm:items-center sm:gap-y-0">
                {steps.map((s, idx) => {
                    const isCompleted = step > s.id;
                    const isActive = step === s.id;
                    const isLast = idx === steps.length - 1;

                    return (
                        <React.Fragment key={s.id}>
                            <li className="flex min-w-0 flex-1 basis-[28%] flex-col items-center gap-1 sm:basis-auto sm:gap-1.5 md:min-w-[6.5rem] md:max-w-[11rem]">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition sm:h-10 sm:w-10 sm:text-sm ${
                                        isCompleted
                                            ? 'bg-[var(--color-accent-600)] text-white'
                                            : isActive
                                              ? 'bg-[var(--color-accent-600)] text-white ring-[3px] ring-[rgb(96_165_250_/_0.22)] shadow-[0_6px_14px_rgba(37,99,235,0.18)]'
                                              : 'border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check size={18} strokeWidth={2.5} className="sm:h-5 sm:w-5" aria-hidden />
                                    ) : (
                                        s.id
                                    )}
                                </div>
                                <span
                                    className={`w-full max-w-[7.5rem] text-center text-xs font-semibold leading-snug sm:max-w-none sm:text-sm ${
                                        isActive
                                            ? 'text-[var(--color-accent-600)]'
                                            : isCompleted
                                              ? 'text-[var(--color-text-strong)]'
                                              : 'text-[var(--color-text-muted)]'
                                    }`}
                                >
                                    {s.label}
                                </span>
                            </li>
                            {!isLast && (
                                <li
                                    className="flex min-h-[2.25rem] min-w-[1rem] flex-1 items-center self-center px-0.5 sm:min-h-0 sm:min-w-[1.5rem] sm:max-w-[4.5rem] sm:flex-[1_1_2rem] sm:px-1 md:max-w-[6rem]"
                                    aria-hidden
                                >
                                    <div
                                        className={`h-1 w-full rounded-full ${
                                            step > s.id ? 'bg-[var(--color-accent-600)]' : 'bg-[var(--color-border-default)]'
                                        }`}
                                    />
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
