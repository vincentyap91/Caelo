import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DEFAULT_MOCK_OTP_CODE, DEFAULT_TAC_COUNTDOWN_SECONDS } from '../../constants/verification';
import { tacSentInstructionLine } from '../../utils/phoneDisplay';
import TacErrorModal from './TacErrorModal';

const OTP_LENGTH = 6;

/**
 * Phone / TAC verification UI: masked instruction, 6 digit boxes, countdown, expired help + CTA.
 * Reusable for registration or future verification steps.
 *
 * @param {object} props
 * @param {string} props.phoneRaw - raw phone string from the form (masked in copy)
 * @param {number} [props.countdownSeconds]
 * @param {string} [props.expectedCode] - mock / server-expected code
 * @param {() => void} props.onVerified
 * @param {() => void} [props.onBack]
 * @param {() => void} [props.onContactCustomerService]
 * @param {string} [props.className]
 */
export default function VerifyPhoneNumberStep({
    phoneRaw,
    countdownSeconds = DEFAULT_TAC_COUNTDOWN_SECONDS,
    expectedCode = DEFAULT_MOCK_OTP_CODE,
    onVerified,
    onBack,
    onContactCustomerService,
    className = '',
}) {
    const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(''));
    const [tacErrorModalOpen, setTacErrorModalOpen] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(countdownSeconds);
    const [timerExpired, setTimerExpired] = useState(false);
    const inputsRef = useRef([]);
    const hasVerifiedRef = useRef(false);
    const lastFailureFingerprintRef = useRef('');

    const instruction = tacSentInstructionLine(phoneRaw);

    useEffect(() => {
        inputsRef.current = inputsRef.current.slice(0, OTP_LENGTH);
    }, []);

    useEffect(() => {
        if (timerExpired) return undefined;
        const id = window.setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    setTimerExpired(true);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => window.clearInterval(id);
    }, [timerExpired]);

    const focusInput = useCallback((i) => {
        const el = inputsRef.current[i];
        if (el) el.focus();
    }, []);

    const handleTacErrorDismiss = useCallback(() => {
        setTacErrorModalOpen(false);
        lastFailureFingerprintRef.current = '';
        setDigits(Array(OTP_LENGTH).fill(''));
        requestAnimationFrame(() => focusInput(0));
    }, [focusInput]);

    useEffect(() => {
        const code = digits.join('');
        if (code.length < OTP_LENGTH) {
            lastFailureFingerprintRef.current = '';
            return;
        }

        const expiredAfterSuccessCode = timerExpired && code === expectedCode;
        const wrongCode = code !== expectedCode;

        if (!expiredAfterSuccessCode && code === expectedCode && !timerExpired) {
            if (!hasVerifiedRef.current) {
                hasVerifiedRef.current = true;
                onVerified?.();
            }
            return;
        }

        if (wrongCode || expiredAfterSuccessCode) {
            const fp = `${code}|${timerExpired ? '1' : '0'}`;
            if (lastFailureFingerprintRef.current === fp) return;
            lastFailureFingerprintRef.current = fp;
            setTacErrorModalOpen(true);
        }
    }, [digits, expectedCode, onVerified, timerExpired]);

    const handleChange = useCallback(
        (index, e) => {
            const v = e.target.value.replace(/\D/g, '').slice(-1);
            setDigits((prev) => {
                const next = [...prev];
                next[index] = v;
                return next;
            });
            if (v && index < OTP_LENGTH - 1) {
                focusInput(index + 1);
            }
        },
        [focusInput]
    );

    const handleKeyDown = useCallback(
        (index, e) => {
            if (e.key === 'Backspace') {
                if (!digits[index] && index > 0) {
                    e.preventDefault();
                    setDigits((prev) => {
                        const next = [...prev];
                        next[index - 1] = '';
                        return next;
                    });
                    focusInput(index - 1);
                }
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                focusInput(index - 1);
            }
            if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
                e.preventDefault();
                focusInput(index + 1);
            }
        },
        [digits, focusInput]
    );

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!paste) return;
        const next = Array(OTP_LENGTH)
            .fill('')
            .map((_, i) => paste[i] ?? '');
        setDigits(next);
        const focusIdx = Math.min(paste.length, OTP_LENGTH - 1);
        requestAnimationFrame(() => focusInput(focusIdx));
    }, [focusInput]);

    return (
        <div className={`relative mx-auto w-full max-w-[420px] ${className}`}>
            <TacErrorModal open={tacErrorModalOpen} onConfirm={handleTacErrorDismiss} />
            {onBack ? (
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(35_64_106)] transition hover:text-[rgb(18_63_128)]"
                >
                    <ArrowLeft size={16} aria-hidden />
                    Back
                </button>
            ) : null}

            <h2 className="text-center text-xl font-bold tracking-tight text-[rgb(18_63_128)] sm:text-2xl">
                Verify Your Number
            </h2>
            <p className="mt-3 text-center text-sm font-medium leading-relaxed text-[rgb(35_64_106)] sm:text-base">
                {instruction}
            </p>

            <div className="mx-auto mt-6 grid w-full max-w-[min(100%,360px)] grid-cols-6 gap-1.5 sm:max-w-[400px] sm:gap-2">
                {digits.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                            inputsRef.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        aria-label={`Verification digit ${i + 1} of ${OTP_LENGTH}`}
                        onChange={(e) => handleChange(i, e)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        onFocus={(e) => e.target.select()}
                        className="h-11 min-w-0 rounded-lg border-2 border-[rgb(159_201_238)] bg-white text-center text-lg font-bold tabular-nums text-[rgb(18_63_128)] shadow-[var(--inset-panel)] outline-none transition focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.25)] sm:h-12 sm:text-xl"
                    />
                ))}
            </div>

            {!timerExpired ? (
                <p className="mt-5 text-center text-sm font-bold text-[rgb(255_185_104)] sm:text-base">
                    TAC Code Sent. {secondsLeft}s
                </p>
            ) : (
                <div className="mt-5 flex flex-col items-center gap-4">
                    <p className="text-center text-sm font-bold text-[rgb(255_185_104)] sm:text-base">
                        Didn&apos;t receive a code? Try another method.
                    </p>
                    {onContactCustomerService ? (
                        <button
                            type="button"
                            onClick={onContactCustomerService}
                            className="h-12 w-full max-w-sm rounded-xl bg-[#39FF88] px-4 text-center text-base font-bold text-black shadow-[0_10px_24px_rgba(57_255_136_0.35)] transition hover:brightness-95 active:scale-[0.99]"
                        >
                            Contact Customer Service
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
}

