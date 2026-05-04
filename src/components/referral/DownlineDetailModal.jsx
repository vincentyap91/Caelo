import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';

/* ─────────────────────────────────────────────
   Gold-bordered info box (used in view mode)
───────────────────────────────────────────── */
function InfoBox({ label, value, children, className = '' }) {
    return (
        <div
            className={`rounded-xl border bg-[var(--color-surface-muted)] px-4 py-3 ${className}`}
            style={{ borderColor: 'var(--color-cta-border)' }}
        >
            <p className="text-xs font-medium text-[var(--color-text-muted)]">
                {label}
            </p>
            {value !== undefined && (
                <p className="mt-0.5 text-sm font-bold text-[var(--color-text-brand)]">
                    {value || '–'}
                </p>
            )}
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Summary box (used in edit mode)
───────────────────────────────────────────── */
function SummaryBox({ username, contact }) {
    return (
        <div
            className="rounded-xl border bg-[var(--color-surface-muted)] px-4 py-3"
            style={{ borderColor: 'var(--color-cta-border)' }}
        >
            <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                {username}
            </p>
            <p className="mt-0.5 text-sm text-[var(--color-text-brand)]">
                Contact No. : {contact || '–'}
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   View Mode: Downline Detail
───────────────────────────────────────────── */
function ViewMode({ downline, onEdit, onBack }) {
    return (
        <>
            {/* Back button */}
            <button
                type="button"
                onClick={onBack}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-brand)] transition hover:opacity-80"
            >
                <ChevronLeft size={16} strokeWidth={2.5} aria-hidden />
                Downline Detail
            </button>

            <div className="space-y-3">
                {/* Username box with Edit Detail button */}
                <div
                    className="flex items-center justify-between gap-3 rounded-xl border bg-[var(--color-surface-muted)] px-4 py-3"
                    style={{ borderColor: 'var(--color-cta-border)' }}
                >
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-[var(--color-text-muted)]">
                            Username
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-[var(--color-text-strong)]">
                            {downline.username}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onEdit}
                        className="btn-theme-cta shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition hover:opacity-90 active:scale-95"
                    >
                        Edit Detail
                    </button>
                </div>

                {/* Contact + Created Date row */}
                <div className="grid grid-cols-2 gap-3">
                    <InfoBox label="Contact No." value={downline.contact} />
                    <InfoBox label="Created Date" value={downline.createdDate} />
                </div>

                {/* Remark */}
                <InfoBox label="Remark" value={downline.remark} className="min-h-[72px]" />
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   Edit Mode: Edit Downline Detail
───────────────────────────────────────────── */
function EditMode({ downline, onBack, onSave }) {
    const [remark, setRemark] = useState(downline.remark || '');

    function handleSave() {
        onSave({ remark });
    }

    return (
        <>
            {/* Back button */}
            <button
                type="button"
                onClick={onBack}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-brand)] transition hover:opacity-80"
            >
                <ChevronLeft size={16} strokeWidth={2.5} aria-hidden />
                Edit Downline Detail
            </button>

            <div className="space-y-4">
                {/* Summary box */}
                <SummaryBox username={downline.username} contact={downline.contact} />

                {/* Remark field */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[var(--color-text-muted)]">
                        Remark
                    </label>
                    <input
                        type="text"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder=""
                        className="w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-4 py-2.5 text-sm text-[var(--color-text-strong)] outline-none transition focus:border-[var(--color-cta-border)] focus:ring-2 focus:ring-[var(--color-cta-border)]"
                    />
                </div>

                {/* Save Changes button */}
                <div className="flex justify-center pt-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn-theme-cta rounded-full px-10 py-2.5 text-sm font-bold transition hover:opacity-90 active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   Main Modal
───────────────────────────────────────────── */
export default function DownlineDetailModal({ downline, onClose, onSaveRemark }) {
    // 'view' | 'edit'
    const [subView, setSubView] = useState('view');
    const overlayRef = useRef(null);

    /* Lock body scroll while open */
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    /* Close on Escape */
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    /* Close on overlay click */
    function handleOverlayClick(e) {
        if (e.target === overlayRef.current) onClose();
    }

    function handleSave(updates) {
        onSaveRemark?.(downline.id, updates.remark);
        setSubView('view');
    }

    if (!downline) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Downlines detail"
        >
            <div
                className="relative w-full max-w-[480px] rounded-2xl bg-[var(--color-surface-base)] shadow-[var(--shadow-modal)]"
            >
                {/* Modal header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border-default)] px-5 py-4">
                    <h2 className="text-base font-bold text-[var(--color-text-brand)]">
                        Downlines
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-strong)]"
                        aria-label="Close modal"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* Modal body */}
                <div className="px-5 py-5">
                    {subView === 'view' ? (
                        <ViewMode
                            downline={downline}
                            onEdit={() => setSubView('edit')}
                            onBack={onClose}
                        />
                    ) : (
                        <EditMode
                            downline={downline}
                            onBack={() => setSubView('view')}
                            onSave={handleSave}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
