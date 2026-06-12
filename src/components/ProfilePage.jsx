import React, { useState } from 'react';
import {
    AlertCircle,
    Calendar,
    Phone,
    UserCircle2,
    UserRound,
} from 'lucide-react';
import AccountLayout from './AccountLayout';
import ProfilePhotoModal from './ProfilePhotoModal';
import VipStatusPill from './VipStatusPill';
import CurrentPromoSection from './slots/CurrentPromoSection';
import ProgressBar from './ui/ProgressBar';
import useSlotCurrentPromo from '../hooks/useSlotCurrentPromo';
import { PROFILE_SHOW_ACTIVE_PROMO } from '../constants/slotCurrentPromo';
import { getVipStatus } from '../constants/vipStatus';
import { PROFILE_NEXT_VIP_TIER, PROFILE_VIP_PROGRESS_PERCENT, PROFILE_VIP_TIER } from '../constants/profileVipTier';

const PROFILE_PHOTO_STORAGE_KEY = 'riocity_profile_photo';

function readStoredProfilePhoto() {
    try {
        return localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY);
    } catch {
        return null;
    }
}

const PERSONAL_INFO_DOB_HINT = 'Please enter your date of birth to receive additional bonus';

function PersonalInfoReadOnlyField({ label, value, icon: Icon, className = '' }) {
    return (
        <div className={`block${className ? ` ${className}` : ''}`}>
            <span className="profile-personal-field__label mb-2 block text-xs font-semibold md:text-sm">{label}</span>
            <div className="profile-personal-field__control flex h-12 items-center gap-3 rounded-xl px-4">
                {Icon ? <Icon size={18} className="profile-personal-field__icon shrink-0" aria-hidden /> : null}
                <span className="profile-personal-field__value min-w-0 truncate text-sm font-semibold">{value || '—'}</span>
            </div>
        </div>
    );
}

function PersonalInfoDateField({ label, value, onChange, hint }) {
    return (
        <div className="block">
            <span className="profile-personal-field__label mb-2 block text-xs font-semibold md:text-sm">{label}</span>
            <div className="profile-personal-dob-field flex h-12 items-center gap-3 rounded-xl px-4">
                <Calendar size={18} className="profile-personal-dob-field__icon shrink-0" aria-hidden />
                <input
                    type="date"
                    value={value}
                    onChange={onChange}
                    className="profile-personal-dob-input min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                />
            </div>
            {hint ? (
                <p className="profile-personal-dob-hint mt-2 flex items-center gap-1.5 text-xs font-semibold leading-snug">
                    <AlertCircle size={14} className="shrink-0" aria-hidden />
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

function SectionCard({ title, description, children }) {
    return (
        <section className="profile-section-card surface-card rounded-2xl p-6 transition-all md:p-8">
            <div>
                <h2 className="profile-section-card__title text-base font-bold tracking-tight md:text-xl">{title}</h2>
                {description ? (
                    <p className="profile-section-card__subtitle mt-1 text-xs font-semibold leading-snug md:text-sm">
                        {description}
                    </p>
                ) : null}
            </div>
            <div className="mt-6">{children}</div>
        </section>
    );
}

function ProfileVipProgressSection({ targetTier, progressPercent, tier, showTierHeader = false, variant = 'inline', className = '' }) {
    const vip = showTierHeader ? getVipStatus(tier || 'Platinum') : null;
    const wrapClass =
        variant === 'card'
            ? `profile-vip-progress-section profile-vip-progress-section--card rounded-2xl px-5 py-4 ${className}`
            : `profile-vip-progress-section ${className}`;

    return (
        <div className={wrapClass}>
            {showTierHeader && vip ? (
                <div className="mb-3 flex items-center">
                    <p className="profile-vip-progress-section__tier text-sm font-extrabold uppercase">{vip.tier}</p>
                </div>
            ) : null}

            <div className="flex items-center justify-between gap-2">
                <span className="profile-vip-progress__target rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase shadow-[var(--shadow-subtle)]">
                    TARGET: {String(targetTier || '').toUpperCase()}
                </span>
                <span className="profile-vip-progress__percent text-sm font-bold">{progressPercent}%</span>
            </div>
            <ProgressBar percent={progressPercent} variant="profile-vip" className="mt-3 h-2.5" />
            <p className="profile-vip-progress-section__caption mt-3 text-center text-sm font-semibold">
                Progress to next tier: {progressPercent}%
            </p>
        </div>
    );
}

export default function ProfilePage({ authUser, onLogout, onNavigate, onLiveChatClick }) {
    const { promo, isActive: isPromoActive, progressPercent, endPromo } = useSlotCurrentPromo();
    const vipLevel = PROFILE_VIP_TIER;
    const vipProgressPercent = Math.max(0, Math.min(100, Number(PROFILE_VIP_PROGRESS_PERCENT) || 0));
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(readStoredProfilePhoto);
    const [profilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        username: authUser?.name || 'test123',
        fullName: 'test',
        birthday: '2008-06-11',
        email: 'demo@gmail.com',
        phone: '85512144234',
    });
    const [personalInfoSaving, setPersonalInfoSaving] = useState(false);

    const updateField = (field) => (event) => {
        const value = event.target.value;
        setFormValues((current) => ({
            ...current,
            [field]: value
        }));
    };

    const handleSavePersonalInfo = () => {
        setPersonalInfoSaving(true);
        window.setTimeout(() => setPersonalInfoSaving(false), 400);
    };

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
            <div className="profile-page page-container">
                <h1 className="profile-page__title page-title">Account Details</h1>

                <div className="mt-5 space-y-5 md:mt-8 md:space-y-6">
                    <div className="profile-account-header surface-card flex flex-row items-center justify-between gap-3 rounded-2xl p-4 sm:p-6 md:gap-8 md:p-8">
                        <div className="flex min-w-0 flex-1 flex-row items-center gap-3 sm:gap-5">
                            <div className="relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setProfilePhotoModalOpen(true)}
                                    className="profile-account-header__photo-btn rounded-full"
                                    aria-label="Change profile photo"
                                >
                                    <div className="profile-account-header__avatar blue-accent-avatar flex h-14 w-14 items-center justify-center overflow-hidden rounded-full sm:h-20 sm:w-20 md:h-24 md:w-24">
                                        {profilePhotoUrl ? (
                                            <img src={profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserCircle2 size={48} className="profile-account-header__avatar-icon" />
                                        )}
                                    </div>
                                </button>
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-3">
                                <div className="space-y-0.5 md:space-y-1.5">
                                    <p className="profile-account-header__badge text-[10px] font-semibold uppercase tracking-wide md:text-xs md:tracking-code">
                                        Verified Account
                                    </p>
                                    <h2 className="profile-account-header__username truncate text-lg font-bold tracking-tight sm:text-xl md:text-3xl">
                                        {formValues.username}
                                    </h2>
                                    <p className="profile-account-header__contact truncate text-xs font-semibold md:text-sm">{formValues.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-center pl-3 md:pl-6">
                            <VipStatusPill level={vipLevel} size="large" layout="column" />
                            <div className="profile-account-header__divider ml-4 hidden h-[108px] w-px md:block" />
                            <ProfileVipProgressSection
                                targetTier={PROFILE_NEXT_VIP_TIER}
                                progressPercent={vipProgressPercent}
                                className="ml-4 hidden w-[210px] md:block"
                            />
                        </div>
                    </div>
                    <ProfileVipProgressSection
                        targetTier={PROFILE_NEXT_VIP_TIER}
                        progressPercent={vipProgressPercent}
                        className="mt-3 md:hidden"
                        tier={vipLevel}
                        variant="card"
                    />

                    {PROFILE_SHOW_ACTIVE_PROMO && isPromoActive && promo ? (
                        <CurrentPromoSection
                            variant="profile"
                            promo={promo}
                            progressPercent={progressPercent}
                            onEndPromo={endPromo}
                        />
                    ) : null}

                    <div className="space-y-6">
                        <SectionCard
                            title="Personal Info"
                            description="Core account identity and contact details."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <PersonalInfoReadOnlyField
                                    label="Username"
                                    value={formValues.username}
                                    icon={UserRound}
                                />
                                <PersonalInfoReadOnlyField
                                    label="Full Name"
                                    value={formValues.fullName}
                                    icon={UserRound}
                                />
                                <PersonalInfoReadOnlyField
                                    label="Phone Number"
                                    value={formValues.phone}
                                    icon={Phone}
                                    className="md:col-span-2"
                                />
                                <PersonalInfoDateField
                                    label="Date of Birth"
                                    value={formValues.birthday}
                                    onChange={updateField('birthday')}
                                    hint={PERSONAL_INFO_DOB_HINT}
                                />
                            </div>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleSavePersonalInfo}
                                    disabled={personalInfoSaving}
                                    className="profile-personal-save btn-theme-cta inline-flex min-h-[44px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {personalInfoSaving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
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

