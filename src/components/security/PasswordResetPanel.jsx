import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import RequirementCard from './RequirementCard';
import { changePassword } from '../../services/securityService';

const PASSWORD_REQUIREMENTS = [
    'Minimum of 8 characters',
    'New password has to contain at least 1 number',
    'New password has to contain upper and lowercase letters',
];

const REQUIREMENTS_HELPER = 'Change your password periodically. It\'s recommended to update every 3–6 months.';

function PasswordInput({ label, value, onChange, error, showPassword, onToggleShow }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">{label}</span>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter here"
                    className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none placeholder:text-[var(--color-text-soft)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)] ${
                        error
                            ? 'border-[var(--color-danger-main)] bg-[rgb(255_91_46_/_0.05)] text-[var(--color-text-strong)] focus:border-[var(--color-danger-main)]'
                            : 'border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] focus:border-[var(--color-accent-400)]'
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-soft)] transition hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && <p className="mt-1.5 text-xs text-[var(--color-danger-main)]">{error}</p>}
        </label>
    );
}

function validatePassword(password) {
    const errors = [];
    if (password.length < 8) errors.push('Minimum of 8 characters');
    if (!/\d/.test(password)) errors.push('Must contain at least 1 number');
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) errors.push('Must contain uppercase and lowercase letters');
    return errors;
}

export default function PasswordResetPanel() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!currentPassword) newErrors.current = 'Current password is required';
        if (!newPassword) newErrors.new = 'New password is required';
        else {
            const reqErrors = validatePassword(newPassword);
            if (reqErrors.length) newErrors.new = reqErrors[0];
        }
        if (newPassword !== confirmPassword) newErrors.confirm = 'Passwords do not match';

        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        const result = await changePassword(currentPassword, newPassword);
        if (result.success) {
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setErrors({ current: result.error || 'Failed to change password' });
        }
    };

    if (success) {
        return (
            <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-card-soft)]">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-success-main)] bg-[rgb(57_181_74_/_0.12)] px-4 py-2 text-sm font-semibold text-[var(--color-success-main)]">
                    Password changed successfully
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Your password has been updated. Please use your new password for your next login.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-card-soft)]">
                <h2 className="mb-6 text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <PasswordInput
                        label="Current Password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        error={errors.current}
                        showPassword={showCurrent}
                        onToggleShow={() => setShowCurrent((s) => !s)}
                    />
                    <PasswordInput
                        label="New Password"
                        value={newPassword}
                        onChange={setNewPassword}
                        error={errors.new}
                        showPassword={showNew}
                        onToggleShow={() => setShowNew((s) => !s)}
                    />
                    <PasswordInput
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        error={errors.confirm}
                        showPassword={showConfirm}
                        onToggleShow={() => setShowConfirm((s) => !s)}
                    />
                    <button
                        type="submit"
                        className="btn-theme-cta w-full rounded-xl py-3.5 text-base font-bold shadow-[var(--shadow-cta)] transition hover:-translate-y-0.5 hover:brightness-105"
                    >
                        Change Password
                    </button>
                </form>
            </div>
            <div>
                <RequirementCard
                    title="Requirements"
                    items={PASSWORD_REQUIREMENTS}
                    helperText={REQUIREMENTS_HELPER}
                />
            </div>
        </div>
    );
}
