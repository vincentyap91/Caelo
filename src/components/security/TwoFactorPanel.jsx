import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import CopyInputField from './CopyInputField';
import RequirementCard from './RequirementCard';
import QRCodeModal from './QRCodeModal';
import { generate2FASecret, enable2FA } from '../../services/securityService';

const SETUP_INSTRUCTIONS = [
    'Download an authentication app (Google Authenticator recommended)',
    'Scan the QR code or copy the setup key',
    'Enter the generated 6-digit code',
];

export default function TwoFactorPanel({ accountName = 'your account' }) {
    const [enabled, setEnabled] = useState(false);
    const [toggleOn, setToggleOn] = useState(false);
    const [secret, setSecret] = useState('');
    const [qrModalOpen, setQrModalOpen] = useState(false);

    const handleToggleOn = async () => {
        setToggleOn(true);
        const s = await generate2FASecret();
        setSecret(s);
    };

    const handleCancelSetup = () => {
        setToggleOn(false);
        setSecret('');
        setQrModalOpen(false);
    };

    const handleVerify = async (code) => {
        const result = await enable2FA(secret, code);
        if (result.success) {
            setEnabled(true);
            setSecret('');
        }
        return result;
    };

    if (enabled) {
        return (
            <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-card-soft)]">
                <h2 className="mb-2 text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">Two-Factor Authentication</h2>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-success-main)] bg-[rgb(57_181_74_/_0.12)] px-4 py-2 text-sm font-semibold text-[var(--color-success-main)]">
                    2FA Enabled
                </div>
                <p className="mb-6 text-sm text-[var(--color-text-muted)]">
                    Your account is protected with two-factor authentication.
                </p>
                <button
                    type="button"
                    onClick={() => setEnabled(false)}
                    className="rounded-xl border border-[var(--color-danger-main)] px-4 py-2.5 text-sm font-semibold text-[var(--color-danger-main)] transition hover:bg-[rgb(255_91_46_/_0.08)]"
                >
                    Disable 2FA
                </button>
            </div>
        );
    }

    if (!toggleOn) {
        return (
            <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-card-soft)]">
                <h2 className="mb-2 text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">Two-Factor Authentication</h2>
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-text-muted)]">Enable Authentication App</span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={false}
                        onClick={handleToggleOn}
                        className="relative h-6 w-11 shrink-0 rounded-full bg-[var(--color-border-default)] transition-colors hover:bg-[var(--color-accent-200)]"
                    >
                        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
                    </button>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                    You will receive a login code from your authentication app for added protection.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-6">
                    <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-card-soft)]">
                        <h2 className="mb-2 text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">Two-Factor Authentication</h2>
                        <p className="mb-6 text-sm text-[var(--color-text-muted)]">
                            Add an extra layer of security to your account:
                        </p>
                        <div className="space-y-4">
                            <CopyInputField label="Authentication Key" value={secret} />
                            <button
                                type="button"
                                onClick={() => setQrModalOpen(true)}
                                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-600)] transition hover:text-[var(--color-accent-700)]"
                            >
                                <QrCode size={18} />
                                View QR Code
                            </button>
                            <button
                                type="button"
                                onClick={() => setQrModalOpen(true)}
                                className="btn-theme-cta w-full rounded-xl py-3.5 text-base font-bold shadow-[var(--shadow-cta)] transition hover:-translate-y-0.5 hover:brightness-105"
                            >
                                Continue
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelSetup}
                                className="w-full rounded-xl border border-[var(--color-border-default)] py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <RequirementCard
                        title="Instructions for Setup"
                        items={SETUP_INSTRUCTIONS}
                    />
                </div>
            </div>

            <QRCodeModal
                open={qrModalOpen}
                onClose={() => setQrModalOpen(false)}
                secret={secret}
                accountName={accountName}
                onVerify={handleVerify}
            />
        </>
    );
}
