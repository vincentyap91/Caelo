import React from 'react';
import { BANKS } from '../constants/banks';
import UsdtIcon from './footerPayments/UsdtIcon';

function PaymentMethodChip({ children, minWide = false }) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgb(168_226_251)] bg-white/90 backdrop-blur-sm ${
                minWide
                    ? 'h-9 min-w-[4.25rem] px-2.5 py-0 sm:h-10 sm:min-w-[4.75rem] sm:px-3 md:h-11 md:min-w-[5.25rem]'
                    : 'h-9 w-9 p-0 sm:h-10 sm:w-10 md:h-11 md:w-11'
            }`}
        >
            {children}
        </span>
    );
}

const E_WALLET_OPTIONS = [
    { id: 'jazzcash', label: 'Jazzcash', image: 'https://pksoftcdn.azureedge.net/media/jazzcash_wicon-202505081346058397.png' },
    { id: 'easypaisa', label: 'EasyPaisa', image: 'https://pksoftcdn.azureedge.net/media/easypaisa_wicon-202505140932274142.png' },
];

const BANK_OPTIONS = [
    BANKS.find((bank) => bank.id === 'maybank'),
    BANKS.find((bank) => bank.id === 'rhb'),
].filter(Boolean);

const wideIconClass =
    'h-6 w-auto max-h-6 object-contain drop-shadow-[0_1px_2px_rgba(15,23,42,0.12)] sm:h-7 sm:max-h-7 md:h-8 md:max-h-8';
const squareIconClass =
    'h-6 w-6 shrink-0 object-contain drop-shadow-[0_1px_2px_rgba(15,23,42,0.12)] sm:h-7 sm:w-7 md:h-8 md:w-8';

export default function FooterPaymentMethods() {
    return (
        <div
            className="footer-payment-methods-container flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-3.5"
            aria-label="Accepted payment methods"
        >
            {BANK_OPTIONS.map((bank) => (
                <PaymentMethodChip key={bank.id} minWide>
                    <img
                        src={bank.image}
                        alt={bank.label}
                        className={wideIconClass}
                        loading="lazy"
                        decoding="async"
                    />
                </PaymentMethodChip>
            ))}
            {E_WALLET_OPTIONS.map((wallet) => (
                <PaymentMethodChip key={wallet.id} minWide>
                    <img
                        src={wallet.image}
                        alt={wallet.label}
                        className={wideIconClass}
                        loading="lazy"
                        decoding="async"
                    />
                </PaymentMethodChip>
            ))}
            <PaymentMethodChip minWide>
                <UsdtIcon className={squareIconClass} />
            </PaymentMethodChip>
        </div>
    );
}
