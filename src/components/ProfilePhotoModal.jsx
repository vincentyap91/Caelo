import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, UserCircle2, X } from 'lucide-react';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const MAX_BYTES = 2 * 1024 * 1024;

export default function ProfilePhotoModal({ open, onClose, initialUrl, onSave }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            return;
        }
        setPreview(initialUrl ?? null);
        setError('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [open, initialUrl]);

    if (!open) {
        return null;
    }

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('Please choose a JPG, PNG, WebP, or GIF image.');
            return;
        }
        if (file.size > MAX_BYTES) {
            setError('Image must be 2 MB or smaller.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(typeof reader.result === 'string' ? reader.result : null);
            setError('');
        };
        reader.onerror = () => setError('Could not read this file. Try another image.');
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        onSave?.(preview ?? null);
        onClose?.();
    };

    const handleRemove = () => {
        setPreview(null);
        setError('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onSave?.(null);
        onClose?.();
    };

    const hasPhoto = Boolean(preview);

    return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close profile photo"
                onClick={onClose}
                className="absolute inset-0 bg-[rgb(2_11_31_/_0.68)] backdrop-blur-[2px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-photo-modal-title"
                className="relative z-[1] flex w-full max-w-[420px] flex-col overflow-hidden rounded-[24px] border border-[rgb(219_228_243)] bg-[var(--color-surface-base)] shadow-[var(--shadow-modal)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[rgb(228_234_243)] px-5 py-4 sm:px-6">
                    <h2
                        id="profile-photo-modal-title"
                        className="text-lg font-bold tracking-tight text-[var(--color-text-strong)] sm:text-xl"
                    >
                        Profile photo
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-white text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-6 sm:px-6">
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">
                        Upload a clear photo of yourself. JPG, PNG, WebP, or GIF up to 2 MB.
                    </p>

                    <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-accent-200)] bg-[var(--color-accent-50)] shadow-[var(--shadow-subtle)]">
                        {hasPhoto ? (
                            <img src={preview} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <UserCircle2 size={72} className="text-[var(--color-accent-400)]" strokeWidth={1.25} />
                        )}
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPT}
                        className="sr-only"
                        onChange={handleFileChange}
                    />

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="btn-theme-primary mx-auto mt-6 flex min-h-[44px] w-full max-w-xs items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:scale-[1.01] hover:shadow-md sm:w-auto"
                    >
                        <ImagePlus size={18} />
                        Choose photo
                    </button>

                    {error && (
                        <p className="mt-3 text-center text-sm font-medium text-[var(--color-danger-main)]" role="alert">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-[rgb(228_234_243)] bg-[var(--color-surface-subtle)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    {(initialUrl || hasPhoto) && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-sm font-semibold text-[var(--color-text-muted)] underline-offset-2 transition hover:text-[var(--color-danger-main)] hover:underline"
                        >
                            Remove photo
                        </button>
                    )}
                    <div className="flex flex-1 justify-end gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex min-h-[44px] min-w-[100px] items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-white px-4 text-sm font-semibold text-[var(--color-text-strong)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="btn-theme-primary inline-flex min-h-[44px] min-w-[100px] items-center justify-center rounded-xl px-5 text-sm font-semibold shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

