import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Eye, FileText, Info, Upload, X } from 'lucide-react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

export function isReceiptImageFile(file) {
    if (!file) return false;
    const t = (file.type || '').toLowerCase();
    if (t.startsWith('image/')) return true;
    const name = (file.name || '').toLowerCase();
    return IMAGE_EXT.test(name);
}

export function formatFileSize(bytes) {
    if (bytes == null || Number.isNaN(bytes)) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
    const v = bytes / k ** i;
    return `${i === 0 ? v : v.toFixed(1)} ${sizes[i]}`;
}

/**
 * Full-screen image / file preview (lightbox). For non-images, offers open-in-new-tab.
 */
export function ReceiptPreviewModal({ open, onClose, file, previewUrl }) {
    const [imageBroken, setImageBroken] = useState(false);
    const isImage = isReceiptImageFile(file);

    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return undefined;
        setImageBroken(false);
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) setImageBroken(false);
    }, [open, previewUrl]);

    const openExternal = () => {
        if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
    };

    if (!open || !file || !previewUrl) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close preview"
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Receipt preview"
                className="relative z-[1] flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-3 sm:px-5">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--color-text-strong)]" title={file.name}>
                            {file.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">{formatFileSize(file.size)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {!isImage || imageBroken ? (
                            <button
                                type="button"
                                onClick={openExternal}
                                className="rounded-xl border border-[var(--color-accent-400)] bg-[var(--color-accent-50)] px-3 py-2 text-xs font-bold text-[var(--color-accent-600)] transition hover:bg-[var(--color-accent-100)] sm:text-sm"
                            >
                                Open file
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-strong)] transition hover:bg-[var(--color-surface-subtle)]"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center bg-[var(--color-surface-muted)] p-4 sm:p-6">
                    {isImage && !imageBroken ? (
                        <img
                            src={previewUrl}
                            alt={`Preview of ${file.name}`}
                            className="max-h-[min(72vh,640px)] max-w-full object-contain"
                            onError={() => setImageBroken(true)}
                        />
                    ) : (
                        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-[var(--shadow-card-soft)]">
                                <FileText size={36} strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                                    {imageBroken ? 'Could not load image preview' : 'Preview not available for this file type'}
                                </p>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                    You can open the file in a new tab to view it.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openExternal}
                                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-600)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--color-accent-500)]"
                            >
                                <Eye size={18} />
                                Open file
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Uploaded file row: thumbnail (images), meta, Preview + Remove.
 */
export function ReceiptFileCard({
    file,
    previewUrl,
    onPreview,
    onRemove,
    showRemove = true,
    className = '',
}) {
    const [thumbError, setThumbError] = useState(false);
    const isImage = isReceiptImageFile(file);

    useEffect(() => {
        setThumbError(false);
    }, [file, previewUrl]);

    if (!file || !previewUrl) return null;

    const showThumb = isImage && !thumbError;

    return (
        <div
            className={`flex flex-col gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-3 shadow-[var(--shadow-card-soft)] sm:flex-row sm:items-center sm:gap-4 sm:p-4 ${className}`}
        >
            <button
                type="button"
                onClick={onPreview}
                className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-accent-600)] transition hover:border-[var(--color-accent-300)] hover:shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] sm:h-20 sm:w-20"
                aria-label="Preview receipt"
            >
                {showThumb ? (
                    <img
                        src={previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => setThumbError(true)}
                    />
                ) : (
                    <FileText size={32} strokeWidth={1.5} className="opacity-80" />
                )}
            </button>

            <div className="min-w-0 flex-1 text-left">
                <button
                    type="button"
                    onClick={onPreview}
                    className="w-full truncate text-left text-sm font-semibold text-[var(--color-text-strong)] underline-offset-2 hover:text-[var(--color-accent-600)] hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] rounded-sm"
                    title={file.name}
                >
                    {file.name}
                </button>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{formatFileSize(file.size)}</p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch md:flex-row md:items-center">
                <button
                    type="button"
                    onClick={onPreview}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-[var(--color-accent-400)] bg-[var(--color-accent-50)] px-4 py-2 text-sm font-bold text-[var(--color-accent-600)] transition hover:bg-[var(--color-accent-100)] sm:flex-initial"
                >
                    <Eye size={16} strokeWidth={2.25} />
                    Preview
                </button>
                {showRemove && onRemove ? (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-bold text-[var(--color-danger-main)] transition hover:bg-[var(--color-danger-main)]/5 hover:underline sm:flex-initial"
                    >
                        Remove
                    </button>
                ) : null}
            </div>
        </div>
    );
}

/**
 * Deposit-style receipt upload block: button, file input, uploaded card, helper copy.
 */
export default function ReceiptUploadField({
    file,
    /** When omitted, an object URL is created and revoked inside this component (standalone use). */
    previewUrl: previewUrlProp,
    onFileChange,
    onRemove,
    fileInputRef,
    onPreview,
    error,
    accept = 'image/*,.pdf,application/pdf',
    uploadButtonLabel = 'Upload receipt',
    helperText = 'Upload your deposit receipt for faster processing.',
    maxSizeNote = 'Max file size 2MB. JPG, PNG, WebP, or PDF.',
    requiredMessage = 'Receipt upload is required to continue.',
}) {
    const externalSupplied = previewUrlProp !== undefined;
    const internalUrl = useMemo(() => {
        if (externalSupplied) return null;
        return file ? URL.createObjectURL(file) : null;
    }, [file, externalSupplied]);

    const previewUrl = externalSupplied ? previewUrlProp : internalUrl;

    useEffect(
        () => () => {
            if (internalUrl) URL.revokeObjectURL(internalUrl);
        },
        [internalUrl],
    );

    return (
        <div className="space-y-3">
            <div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-accent-400)] bg-[var(--color-accent-50)] px-5 text-sm font-bold text-[var(--color-accent-600)] transition hover:bg-[var(--color-accent-100)] sm:w-auto sm:justify-start"
                >
                    <Upload size={18} strokeWidth={2.25} />
                    {uploadButtonLabel}
                </button>
                <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={onFileChange} />
            </div>

            {file && previewUrl ? (
                <ReceiptFileCard file={file} previewUrl={previewUrl} onPreview={onPreview} onRemove={onRemove} />
            ) : null}

            {error ? (
                <p className="flex items-start gap-2 text-sm font-medium text-[var(--color-danger-main)]">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {error}
                </p>
            ) : null}

            <p className="flex items-start gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)]/80 px-3 py-2.5 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
                <Info size={16} className="mt-0.5 shrink-0 text-[var(--color-accent-600)]" strokeWidth={2.25} />
                <span>
                    {helperText} <span className="font-medium text-[var(--color-text-strong)]">{maxSizeNote}</span>
                </span>
            </p>

            {!file && requiredMessage ? (
                <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger-main)]">
                    <AlertCircle size={14} className="shrink-0" />
                    {requiredMessage}
                </p>
            ) : null}
        </div>
    );
}
