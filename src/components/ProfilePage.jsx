import React, { useState } from 'react';
import {
    Banknote,
    ChevronDown,
    Landmark,
    Mail,
    PencilLine,
    Phone,
    Trash2,
    UserCircle2,
} from 'lucide-react';
import AccountLayout from './AccountLayout';
import CalendarDateInput from './CalendarDateInput';
import ProfilePhotoModal from './ProfilePhotoModal';
import VipStatusPill from './VipStatusPill';
import { BANKS } from '../constants/banks';

function formatDateForInput(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const PROFILE_PHOTO_STORAGE_KEY = 'riocity_profile_photo';

function readStoredProfilePhoto() {
    try {
        return localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY);
    } catch {
        return null;
    }
}

const personalFields = [
    { key: 'username', label: 'Username' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'referralCode', label: 'Referral Code' },
    { key: 'referralLink', label: 'Referral Link' },
    { key: 'rank', label: 'Rank' },
    { key: 'birthday', label: 'Birthday' },
    { key: 'gender', label: 'Gender' }
];

const contactFields = [
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone Number', type: 'tel' }
];


function Field({ label, value, placeholder, type = 'text', editable, onChange, icon: Icon }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
            <div
                className={`group flex h-12 items-center gap-3 rounded-xl border px-4 shadow-[var(--shadow-subtle)] transition-all focus-within:border-[var(--color-accent-400)] focus-within:ring-2 focus-within:ring-[rgb(96_165_250_/_0.2)] ${
                    editable
                        ? 'border-[var(--color-accent-300)] bg-[var(--color-surface-base)] hover:border-[var(--color-accent-400)]'
                        : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] hover:border-[var(--color-accent-200)]'
                }`}
            >
                {Icon && (
                    <Icon
                        size={18}
                        className={`shrink-0 transition-colors ${editable ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-soft)] group-hover:text-[var(--color-accent-500)]'}`}
                    />
                )}
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    disabled={!editable}
                    onChange={onChange}
                    className={`w-full bg-transparent text-sm font-medium outline-none ${
                        editable ? 'text-[var(--color-text-strong)]' : 'text-[var(--color-text-muted)]'
                    } placeholder:text-[var(--color-text-soft)] disabled:cursor-not-allowed`}
                />
            </div>
        </label>
    );
}

function SectionCard({ title, description, editing, onToggleEdit, children, actions }) {
    return (
        <section className="surface-card rounded-2xl p-6 transition-all md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">{title}</h2>
                    {description && (
                        <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">{description}</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {actions}
                    <button
                        type="button"
                        onClick={onToggleEdit}
                        aria-pressed={editing}
                        className="btn-theme-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                    >
                        <PencilLine size={16} />
                        {editing ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>

            <div className="mt-6">{children}</div>
        </section>
    );
}

export default function ProfilePage({ authUser, onLogout, onNavigate, onLiveChatClick }) {
    const vipLevel = authUser?.vipLevel || 'Diamond';
    const [editing, setEditing] = useState({
        personal: false,
        contact: false,
        banking: false
    });
    const [showBankForm, setShowBankForm] = useState(false);
    const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankForm, setBankForm] = useState({
        bankId: '',
        accountHolder: '',
        accountNumber: '',
        branchName: ''
    });
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(readStoredProfilePhoto);
    const [profilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        username: authUser?.name || 'demo',
        fullName: 'Demo',
        referralCode: 'Zy4REBcM',
        referralLink: 'https://riocity.com/register?code=Zy4REBcM',
        rank: vipLevel,
        birthday: '1990-08-01',
        gender: 'Male',
        email: 'demo@gmail.com',
        phone: '60 123456701',
    });

    const toggleEdit = (sectionKey) => {
        setEditing((current) => ({
            ...current,
            [sectionKey]: !current[sectionKey]
        }));
    };

    const updateField = (field) => (event) => {
        const value = event.target.value;
        setFormValues((current) => ({
            ...current,
            [field]: value
        }));
    };

    const updateBankForm = (field) => (event) => {
        const value = event.target.value;
        setBankForm((current) => ({ ...current, [field]: value }));
    };

    const handleSaveBankAccount = () => {
        const bank = BANKS.find((b) => b.id === bankForm.bankId);
        if (!bankForm.bankId || !bankForm.accountHolder?.trim() || !bankForm.accountNumber?.trim()) return;
        setBankAccounts((prev) => [
            ...prev,
            {
                id: crypto.randomUUID?.() ?? Date.now().toString(),
                bankId: bankForm.bankId,
                bankName: bank?.label ?? bankForm.bankId,
                bankImage: bank?.image,
                accountHolder: bankForm.accountHolder.trim(),
                accountNumber: bankForm.accountNumber.trim(),
                branchName: bankForm.branchName?.trim() || ''
            }
        ]);
        setBankForm({ bankId: '', accountHolder: '', accountNumber: '', branchName: '' });
        setShowBankForm(false);
        setEditing((c) => ({ ...c, banking: false }));
    };

    const handleRemoveBankAccount = (id) => {
        setBankAccounts((prev) => prev.filter((a) => a.id !== id));
    };

    const birthdayMax = formatDateForInput(new Date());

    const handleProfilePhotoSave = (dataUrl) => {
        setProfilePhotoUrl(dataUrl);
        try {
            if (dataUrl) {
                localStorage.setItem(PROFILE_PHOTO_STORAGE_KEY, dataUrl);
            } else {
                localStorage.removeItem(PROFILE_PHOTO_STORAGE_KEY);
            }
        } catch {
            /* ignore quota / private mode — image still shows for this session */
        }
    };

    return (
        <AccountLayout activePage="profile" authUser={authUser} onNavigate={onNavigate} onLogout={onLogout} onLiveChatClick={onLiveChatClick}>
            <div className="page-container">
                <h1 className="page-title">Account Details</h1>

                <div className="mt-8 space-y-6">
                    <div className="surface-card flex flex-col gap-4 rounded-2xl p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
                        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5 md:flex-row md:items-center">
                            <div className="relative shrink-0 self-start">
                                <button
                                    type="button"
                                    onClick={() => setProfilePhotoModalOpen(true)}
                                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2"
                                    aria-label="Change profile photo"
                                >
                                    <div className="blue-accent-avatar flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full sm:h-20 sm:w-20 md:h-24 md:w-24">
                                        {profilePhotoUrl ? (
                                            <img src={profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserCircle2 size={48} className="text-[var(--color-accent-600)]" />
                                        )}
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setProfilePhotoModalOpen(true)}
                                    className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-sm transition hover:scale-105 hover:bg-[var(--color-accent-50)]"
                                    aria-label="Edit profile photo"
                                >
                                    <PencilLine size={14} />
                                </button>
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col gap-3">
                                <div className="space-y-1.5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-600)] sm:text-xs sm:tracking-widest">
                                        Verified Account Profile
                                    </p>
                                    <h2 className="truncate text-2xl font-bold tracking-tight text-[var(--color-text-strong)] md:text-3xl">
                                        {formValues.username}
                                    </h2>
                                    <p className="text-sm font-medium text-[var(--color-text-muted)]">{formValues.email}</p>
                                </div>
                                <div className="flex flex-row gap-2 sm:flex-wrap">
                                    <span className="inline-flex w-fit rounded-full border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-700)]">
                                        Joined 08/01/2026
                                    </span>
                                    <span className="inline-flex w-fit rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-700)]">
                                        Player ID 679129
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full shrink-0 flex-col border-t border-[var(--color-border-default)] pt-4 md:w-auto md:border-t-0 md:pt-0 md:pl-2">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)] md:sr-only">
                                VIP rank
                            </p>
                            <div className="flex justify-start md:justify-end">
                                <div className="md:hidden">
                                    <VipStatusPill level={vipLevel} size="large" layout="row" />
                                </div>
                                <div className="hidden md:block">
                                    <VipStatusPill level={vipLevel} size="large" layout="column" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <SectionCard
                            title="Personal Info"
                            description="Core account identity and referral information."
                            editing={editing.personal}
                            onToggleEdit={() => toggleEdit('personal')}
                        >
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {personalFields.map(({ key, label, placeholder }) =>
                                    key === 'birthday' ? (
                                        <label key={key} className="block">
                                            <span className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
                                            <CalendarDateInput
                                                label={null}
                                                value={formValues.birthday}
                                                onChange={updateField('birthday')}
                                                disabled={!editing.personal}
                                                max={birthdayMax}
                                                min="1900-01-01"
                                                className="w-full"
                                                inputClassName={
                                                    editing.personal
                                                        ? 'h-12 border-[var(--color-accent-300)] bg-[var(--color-surface-base)] hover:border-[var(--color-accent-400)]'
                                                        : 'h-12 cursor-not-allowed border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
                                                }
                                            />
                                        </label>
                                    ) : (
                                        <Field
                                            key={key}
                                            label={label}
                                            value={formValues[key]}
                                            placeholder={placeholder}
                                            editable={editing.personal}
                                            onChange={updateField(key)}
                                        />
                                    ),
                                )}
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Contact Info"
                            description="Keep your recovery and communication details up to date."
                            editing={editing.contact}
                            onToggleEdit={() => toggleEdit('contact')}
                        >
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {contactFields.map(({ key, label, type }) => (
                                    <Field
                                        key={key}
                                        label={label}
                                        type={type}
                                        value={formValues[key]}
                                        editable={editing.contact}
                                        onChange={updateField(key)}
                                        icon={key === 'email' ? Mail : Phone}
                                    />
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Banking Details"
                            description="Manage payout-ready banking information in a secure format."
                            editing={editing.banking}
                            onToggleEdit={showBankForm ? handleSaveBankAccount : () => { setShowBankForm(true); setEditing((c) => ({ ...c, banking: true })); }}
                            actions={
                                <>
                                    {!showBankForm && (
                                        <button
                                            type="button"
                                            onClick={() => { setShowBankForm(true); setEditing((c) => ({ ...c, banking: true })); }}
                                            className="btn-theme-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                                        >
                                            <Banknote size={16} />
                                            Add Bank Account
                                        </button>
                                    )}
                                    {showBankForm && (
                                        <button
                                            type="button"
                                            onClick={() => { setShowBankForm(false); setEditing((c) => ({ ...c, banking: false })); setBankForm({ bankId: '', accountHolder: '', accountNumber: '', branchName: '' }); }}
                                            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-strong)] transition hover:bg-[var(--color-surface-subtle)]"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </>
                            }
                        >
                            {showBankForm ? (
                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    <div>
                                        <span className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">Bank <span className="text-[var(--color-danger-main)]">*</span></span>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setBankDropdownOpen((o) => !o)}
                                                className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                            >
                                                {bankForm.bankId && BANKS.find((b) => b.id === bankForm.bankId)?.image ? (
                                                    <span className="flex items-center gap-2.5">
                                                        <img src={BANKS.find((b) => b.id === bankForm.bankId)?.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                        <span className="font-medium text-[var(--color-text-strong)]">{BANKS.find((b) => b.id === bankForm.bankId)?.label}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-text-soft)]">Select Bank</span>
                                                )}
                                                <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${bankDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {bankDropdownOpen && (
                                                <>
                                                    <div className="absolute inset-0 z-10" onClick={() => setBankDropdownOpen(false)} aria-hidden />
                                                    <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                        {BANKS.map((b) => (
                                                            <button
                                                                key={b.id}
                                                                type="button"
                                                                onClick={() => { setBankForm((f) => ({ ...f, bankId: b.id })); setBankDropdownOpen(false); }}
                                                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                                                            >
                                                                {b.image ? <img src={b.image} alt="" className="h-6 w-6 shrink-0 object-contain" /> : null}
                                                                <span className="font-normal text-[var(--color-text-strong)]">{b.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Field label="Account Holder" value={bankForm.accountHolder} onChange={updateBankForm('accountHolder')} editable={true} icon={UserCircle2} />
                                    <Field label="Account Number" value={bankForm.accountNumber} onChange={updateBankForm('accountNumber')} editable={true} icon={Landmark} />
                                    <Field label="Branch Name" value={bankForm.branchName} onChange={updateBankForm('branchName')} editable={true} placeholder="Optional" />
                                </div>
                            ) : bankAccounts.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {bankAccounts.map((acc) => (
                                            <div
                                                key={acc.id}
                                                className="flex items-start gap-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] p-4 transition hover:border-[var(--color-accent-200)]"
                                            >
                                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        {acc.bankImage ? <img src={acc.bankImage} alt="" className="h-8 w-8 shrink-0 object-contain" /> : <Landmark size={24} className="text-[var(--color-text-muted)]" />}
                                                        <span className="truncate font-semibold text-[var(--color-text-strong)]">{acc.bankName}</span>
                                                    </div>
                                                    <p className="text-sm text-[var(--color-text-muted)]">{acc.accountHolder}</p>
                                                    <p className="font-mono text-sm font-medium text-[var(--color-text-strong)]">{acc.accountNumber}</p>
                                                    {acc.branchName && <p className="text-xs text-[var(--color-text-soft)]">{acc.branchName}</p>}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBankAccount(acc.id)}
                                                    aria-label="Remove bank account"
                                                    className="shrink-0 rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-danger-main)]/10 hover:text-[var(--color-danger-main)]"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-accent-200)] bg-[var(--color-accent-50)] p-6 text-center">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-[var(--shadow-accent-avatar)]">
                                        <Landmark size={28} />
                                    </div>
                                    <p className="mt-5 text-lg font-bold text-[var(--color-text-strong)]">No bank account added</p>
                                    <p className="mt-2 max-w-[420px] text-sm font-medium leading-6 text-[var(--color-text-muted)]">
                                        Add your bank profile to enable secure withdrawals and faster account verification.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => { setShowBankForm(true); setEditing((c) => ({ ...c, banking: true })); }}
                                        className="btn-theme-primary mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                                    >
                                        <Banknote size={16} />
                                        + Add Bank Account
                                    </button>
                                </div>
                            )}
                        </SectionCard>
                    </div>
                </div>
            </div>

            <ProfilePhotoModal
                open={profilePhotoModalOpen}
                onClose={() => setProfilePhotoModalOpen(false)}
                initialUrl={profilePhotoUrl}
                onSave={handleProfilePhotoSave}
            />
        </AccountLayout>
    );
}
