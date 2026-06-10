import React from 'react';

/**
 * Deposit / Withdrawal mode switcher — scoped to cashier-flow-page styles only.
 */
export default function CashierModeTabs({ activeMode = 'deposit', onNavigate }) {
    return (
        <div className="cashier-mode-tabs" role="tablist" aria-label="Deposit or withdrawal">
            <button
                type="button"
                role="tab"
                aria-selected={activeMode === 'deposit'}
                className={`cashier-mode-tab${activeMode === 'deposit' ? ' is-active' : ''}`}
                onClick={() => onNavigate?.('deposit')}
            >
                Deposit
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={activeMode === 'withdrawal'}
                className={`cashier-mode-tab${activeMode === 'withdrawal' ? ' is-active' : ''}`}
                onClick={() => onNavigate?.('withdrawal')}
            >
                Withdrawal
            </button>
        </div>
    );
}
