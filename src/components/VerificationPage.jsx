import React, { useState } from 'react';
import {
    AlertTriangle,
    ChevronDown,
    ChevronLeft,
    CloudUpload,
    FileText,
    FolderPlus,
    Info,
    Landmark,
    ShieldCheck,
    Clock,
} from 'lucide-react';

const verificationOptions = [
    {
        id: 'bank',
        title: 'Bank Account',
        description: 'Verify your bank account for security',
        icon: Landmark,
        status: 'Not Started',
        actionLabel: 'Add Bank Account',
    },
    {
        id: 'identity',
        title: 'Identity Verification',
        description: 'Confirming user identity for safety',
        icon: ShieldCheck,
        status: 'Not Started',
        actionLabel: 'Add ID Card or Passport',
    },
];

const bankRequirements = [
    'The **Bank Name and Logo** must be clearly visible on the bank statement.',
    'The **Statement Date** must be no older than six months.',
    'The **Bank Account Number** must match the one entered in this request.',
    'The statement must be **fully visible**, with all four corners shown.',
    "The **Account Holder's Name** on the statement must match the **first and last name** provided in this request.",
];

const idRequirements = [
    'Both Front and Back sides of ID card must be received',
    'Clear picture with all 4 corners visible',
    'Document must be valid and not expired',
    'Document must be showing expiry date',
    'Document must show your unaltered photo',
    'Document must show your date of birth',
    'Water marks on documents must be visible',
];

const passportRequirements = [
    'Clear picture with all 4 corners visible',
    'Document must be valid and not expired',
    'Document must be showing expiry date',
    'Document must show your unaltered photo',
    'Document must show your date of birth',
    'Water marks on documents must be visible',
];

export default function VerificationPage() {
    const [view, setView] = useState('main');
    const [docType, setDocType] = useState('id');
    const [bankForm, setBankForm] = useState({
        bank: '',
        accountNumber: '',
        firstName: '',
        lastName: '',
    });
    const [bankStatement, setBankStatement] = useState(null);
    const [idFront, setIdFront] = useState(null);
    const [idBack, setIdBack] = useState(null);
    const [passportFile, setPassportFile] = useState(null);

    const handleBankSubmit = (e) => {
        e.preventDefault();
        setView('main');
    };

    const handleIdSubmit = (e) => {
        e.preventDefault();
        setView('main');
    };

    if (view === 'bank') {
        return (
            <div className="page-container">
                    <button
                        type="button"
                        onClick={() => setView('main')}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:text-[var(--color-accent-600)]"
                    >
                        <ChevronLeft size={18} />
                        Add Bank Account
                    </button>

                    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                        <div className="space-y-6">
                            <form onSubmit={handleBankSubmit} className="space-y-6">
                                <section className="surface-card rounded-2xl p-6">
                                    <h2 className="text-lg font-bold text-[var(--color-text-strong)]">Bank Account Information</h2>
                                    <div className="mt-4 space-y-4">
                                        <label className="block">
                                            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Select the Bank</span>
                                            <div className="flex h-12 items-center justify-between rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] px-4 text-[var(--color-text-muted)]">
                                                <span>Select the Bank</span>
                                                <ChevronDown size={18} />
                                            </div>
                                        </label>
                                        <label className="block">
                                            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Bank Account Number</span>
                                            <input
                                                type="text"
                                                value={bankForm.accountNumber}
                                                onChange={(e) => setBankForm((p) => ({ ...p, accountNumber: e.target.value }))}
                                                placeholder="e.g. 0123456789"
                                                className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] px-4 text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section className="surface-card rounded-2xl p-6">
                                    <h2 className="text-lg font-bold text-[var(--color-text-strong)]">Account Holder Information</h2>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">First Name</span>
                                            <input
                                                type="text"
                                                value={bankForm.firstName}
                                                onChange={(e) => setBankForm((p) => ({ ...p, firstName: e.target.value }))}
                                                placeholder="e.g. John"
                                                className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] px-4 text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Last Name</span>
                                            <input
                                                type="text"
                                                value={bankForm.lastName}
                                                onChange={(e) => setBankForm((p) => ({ ...p, lastName: e.target.value }))}
                                                placeholder="e.g. Smith"
                                                className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] px-4 text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section className="surface-card rounded-2xl p-6">
                                    <h2 className="text-lg font-bold text-[var(--color-text-strong)]">Bank Statement</h2>
                                    <label className="mt-4 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-accent-200)] bg-[rgb(239_246_255_/_0.5)] p-6 transition hover:border-[var(--color-accent-300)] hover:bg-[rgb(239_246_255_/_0.8)]">
                                        <CloudUpload size={36} className="text-[var(--color-accent-500)]" />
                                        <span className="mt-3 text-sm font-medium text-[var(--color-text-main)]">
                                            Drop or click to upload a file
                                        </span>
                                        <span className="mt-1 text-sm text-[var(--color-accent-600)] underline">Browse</span>
                                        <span className="mt-2 text-xs text-[var(--color-text-muted)]">(JPG, PDF or PNG) File size limit: 5MB</span>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            className="hidden"
                                            onChange={(e) => setBankStatement(e.target.files?.[0])}
                                        />
                                    </label>
                                </section>

                                <button
                                    type="submit"
                                    className="btn-theme-primary w-full rounded-xl py-3.5 text-base font-bold shadow-md transition hover:shadow-lg"
                                >
                                    Create Bank Account
                                </button>
                            </form>
                        </div>

                        <div className="space-y-6">
                            <section className="surface-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-[var(--color-text-strong)]">Bank Statement Instructions</h2>
                                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                                    Please upload a copy of your bank statement that meets the stated requirements.
                                </p>
                                <div className="mt-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] p-6">
                                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-4 text-center shadow-sm">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                            <Landmark size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-[var(--color-text-main)]">STATEMENT OF ACCOUNT</p>
                                        <div className="mt-4 space-y-2 text-left text-xs text-[var(--color-text-muted)]">
                                            <p>ACCOUNT NUMBER: 123456789-0</p>
                                            <p>STATEMENT DATE: September 4, 2024</p>
                                            <p>JOHN SMITH</p>
                                            <p className="text-[var(--color-text-muted)]">PERIOD COVERED: 08/01/2024 to 08/31/2024</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="surface-card rounded-2xl p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text-strong)]">
                                    Requirements
                                    <ChevronDown size={18} className="text-[var(--color-text-soft)]" />
                                </h2>
                                <ul className="mt-4 space-y-3">
                                    {bankRequirements.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-[var(--color-text-muted)]">
                                            <FileText size={16} className="mt-0.5 shrink-0 text-[var(--color-accent-500)]" />
                                            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="surface-card rounded-2xl p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text-strong)]">
                                    Important
                                    <ChevronDown size={18} className="text-[var(--color-text-soft)]" />
                                </h2>
                                <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">
                                    <li className="flex gap-3">
                                        <AlertTriangle size={18} className="shrink-0 text-amber-500" />
                                        An invalid or blurry bank statement may delay your verification or lead to unsuccessful verification.
                                    </li>
                                    <li className="flex gap-3">
                                        <Clock size={18} className="shrink-0 text-blue-500" />
                                        Bank account verification will take approximately 15-30 minutes after uploading your bank statement.
                                    </li>
                                    <li className="flex gap-3">
                                        <Info size={18} className="shrink-0 text-blue-500" />
                                        Credit card images and statements are not allowed.
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
            </div>
        );
    }

    if (view === 'identity') {
        const requirements = docType === 'id' ? idRequirements : passportRequirements;
        return (
            <div className="page-container">
                    <button
                        type="button"
                        onClick={() => setView('main')}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:text-[var(--color-accent-600)]"
                    >
                        <ChevronLeft size={18} />
                        Identity Verification
                    </button>

                    <div className="mb-6 flex gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-1">
                        <button
                            type="button"
                            onClick={() => setDocType('id')}
                            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                                docType === 'id'
                                    ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]'
                            }`}
                        >
                            ID
                        </button>
                        <button
                            type="button"
                            onClick={() => setDocType('passport')}
                            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                                docType === 'passport'
                                    ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]'
                            }`}
                        >
                            Passport
                        </button>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                        <div className="space-y-6">
                            <form onSubmit={handleIdSubmit} className="space-y-6">
                                <section className="surface-card rounded-2xl p-6">
                                    {docType === 'id' ? (
                                        <>
                                            <label className="block">
                                                <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Front side of ID</span>
                                                <div className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-accent-200)] bg-[rgb(239_246_255_/_0.5)] p-6 transition hover:border-[var(--color-accent-300)] hover:bg-[rgb(239_246_255_/_0.8)]">
                                                    <FolderPlus size={32} className="text-[var(--color-accent-500)]" />
                                                    <span className="mt-2 text-sm font-medium text-[var(--color-text-main)]">Front side of ID</span>
                                                    <span className="mt-1 text-xs text-[var(--color-text-muted)]">(JPG, PDF or PNG) File size limit: 5MB</span>
                                                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setIdFront(e.target.files?.[0])} />
                                                </div>
                                            </label>
                                            <label className="mt-4 block">
                                                <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Back side of ID</span>
                                                <div className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-accent-200)] bg-[rgb(239_246_255_/_0.5)] p-6 transition hover:border-[var(--color-accent-300)] hover:bg-[rgb(239_246_255_/_0.8)]">
                                                    <FolderPlus size={32} className="text-[var(--color-accent-500)]" />
                                                    <span className="mt-2 text-sm font-medium text-[var(--color-text-main)]">Back side of ID</span>
                                                    <span className="mt-1 text-xs text-[var(--color-text-muted)]">(JPG, PDF or PNG) File size limit: 5MB</span>
                                                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setIdBack(e.target.files?.[0])} />
                                                </div>
                                            </label>
                                        </>
                                    ) : (
                                        <label className="block">
                                            <div className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-accent-200)] bg-[rgb(239_246_255_/_0.5)] p-6 transition hover:border-[var(--color-accent-300)] hover:bg-[rgb(239_246_255_/_0.8)]">
                                                <FolderPlus size={40} className="text-[var(--color-accent-500)]" />
                                                <span className="mt-3 text-sm font-medium text-[var(--color-text-main)]">Drop or click to upload a file</span>
                                                <span className="mt-1 text-xs text-[var(--color-text-muted)]">(JPG, PDF or PNG) File size limit: 5MB</span>
                                                <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setPassportFile(e.target.files?.[0])} />
                                            </div>
                                        </label>
                                    )}

                                    <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                        <Clock size={16} className="text-[var(--color-accent-500)]" />
                                        Please be aware that your ID verification will take approximately 15-30 minutes.
                                    </p>

                                    <button
                                        type="submit"
                                        className="btn-theme-primary mt-6 w-full rounded-xl py-3.5 text-base font-bold shadow-md transition hover:shadow-lg"
                                    >
                                        {docType === 'id' ? 'Upload Your ID' : 'Upload Your Passport'}
                                    </button>
                                </section>
                            </form>
                        </div>

                        <section className="surface-card rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-[var(--color-text-strong)]">
                                Proof of Identity - Copy of {docType === 'id' ? 'ID Card' : 'Passport'}.
                            </h2>
                            <ul className="mt-4 space-y-3">
                                {requirements.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-[var(--color-text-muted)]">
                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-500)]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
            </div>
        );
    }

    return (
        <div className="page-container">
                <h1 className="page-title">Verification</h1>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {verificationOptions.map(({ id, title, description, icon: Icon, status, actionLabel }) => (
                        <article
                            key={id}
                            className="surface-card flex flex-col rounded-2xl p-6 transition hover:shadow-[var(--shadow-card-hover)]"
                        >
                            <div className="flex items-start justify-between">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent-200)] bg-[var(--color-accent-50)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-700)]">
                                    <Info size={12} />
                                    {status}
                                </span>
                            </div>
                            <div className="mt-4 flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--color-text-strong)]">{title}</h2>
                                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setView(id)}
                                className="mt-6 inline-flex w-fit items-center justify-center rounded-full border-2 border-[var(--color-accent-500)] bg-[var(--color-surface-base)] px-5 py-2.5 text-sm font-bold text-[var(--color-accent-600)] transition hover:bg-[var(--color-accent-50)]"
                            >
                                {actionLabel}
                            </button>
                        </article>
                    ))}
                </div>
        </div>
    );
}
