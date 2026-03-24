import React from 'react';
import EeziePayIcon from './footerPayments/EeziePayIcon';
import TouchNGoIcon from './footerPayments/TouchNGoIcon';
import DuitNowIcon from './footerPayments/DuitNowIcon';
import GrabPayIcon from './footerPayments/GrabPayIcon';
import ShopeePayIcon from './footerPayments/ShopeePayIcon';
import BoostIcon from './footerPayments/BoostIcon';
import TruePayIcon from './footerPayments/TruePayIcon';
import SurePayIcon from './footerPayments/SurePayIcon';
import UsdtIcon from './footerPayments/UsdtIcon';
import BtcIcon from './footerPayments/BtcIcon';
import LitecoinIcon from './footerPayments/LitecoinIcon';
import EthereumIcon from './footerPayments/EthereumIcon';

/** Flat badge: dark backing keeps white logo artwork readable on the light footer without button-like depth */
function PaymentMethodChip({ children, minWide = false }) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-white/20 bg-[var(--color-brand-deep)] ${
                minWide
                    ? 'h-9 min-w-[3.75rem] px-2 py-0 sm:h-10 sm:min-w-[4.25rem] sm:px-2.5'
                    : 'h-9 w-9 p-0 sm:h-10 sm:w-10'
            }`}
        >
            {children}
        </span>
    );
}

const wideIconClass =
    'h-6 w-auto max-h-6 brightness-[1.02] contrast-[1.05] sm:h-7 sm:max-h-7 md:h-8 md:max-h-8';
const squareIconClass =
    'h-6 w-6 shrink-0 brightness-[1.02] contrast-[1.05] sm:h-7 sm:w-7 md:h-8 md:w-8';

export default function FooterPaymentMethods() {
    return (
        <div
            className="footer-payment-methods-container flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-3.5"
            aria-label="Accepted payment methods"
        >
            <PaymentMethodChip minWide>
                <EeziePayIcon className={wideIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip>
                <TouchNGoIcon className={squareIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip minWide>
                <DuitNowIcon className={wideIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip minWide>
                <GrabPayIcon className={wideIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip minWide>
                <ShopeePayIcon className={wideIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip minWide>
                <BoostIcon className="h-5 w-auto max-h-5 sm:h-5 sm:max-h-5 md:h-6 md:max-h-6" />
            </PaymentMethodChip>
            <PaymentMethodChip minWide>
                <TruePayIcon className="h-5 w-auto max-h-5 sm:h-5 sm:max-h-5 md:h-6 md:max-h-6" />
            </PaymentMethodChip>
            <PaymentMethodChip minWide>
                <SurePayIcon className="h-5 w-auto max-h-5 sm:h-6 sm:max-h-6 md:h-7 md:max-h-7" />
            </PaymentMethodChip>
            <PaymentMethodChip>
                <UsdtIcon className={squareIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip>
                <BtcIcon className={squareIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip>
                <LitecoinIcon className={squareIconClass} />
            </PaymentMethodChip>
            <PaymentMethodChip>
                <EthereumIcon className={squareIconClass} />
            </PaymentMethodChip>
        </div>
    );
}
