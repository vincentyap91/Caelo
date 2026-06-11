import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, FolderPlus } from 'lucide-react';

const feedbackCategories = ['Game selection', 'Payment', 'Account', 'Technical', 'Other'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function FeedbackPage() {
    const [category, setCategory] = useState('');
    const [comments, setComments] = useState('');
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setCategoryOpen(false);
        };
        if (categoryOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [categoryOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder - would submit to API
    };

    const handleFileChange = (e) => {
        const input = e.target;
        const f = input.files?.[0];
        setFileError('');
        if (!f) {
            setFile(null);
            return;
        }
        if (f.size > MAX_FILE_SIZE) {
            setFile(null);
            setFileError('File exceeds 5MB limit. Please choose a smaller file.');
            input.value = '';
            return;
        }
        setFile(f);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Share Feedback</h1>

            <div className="mt-8">
                <div className="surface-card rounded-2xl p-6 md:p-8">
                    <p className="mb-6 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                        Your insights fuel an exceptional gaming experience for all. Share your thoughts now.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="block">
                            <span id="feedback-category-label" className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Feedback Category</span>
                            <div className="relative">
                                <button
                                    type="button"
                                    aria-labelledby="feedback-category-label"
                                    onClick={() => setCategoryOpen((o) => !o)}
                                    aria-expanded={categoryOpen}
                                    aria-haspopup="listbox"
                                    className="flex h-12 w-full items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 text-left text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-subtle)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                >
                                    <span className={category ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-soft)]'}>
                                        {category || 'Select category'}
                                    </span>
                                    <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-soft)] transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {categoryOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            aria-hidden="true"
                                            onClick={() => setCategoryOpen(false)}
                                        />
                                        <div role="listbox" className="absolute left-0 top-full z-20 mt-1 w-full min-w-[180px] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-2 shadow-[var(--shadow-card-soft)]">
                                            {feedbackCategories.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={category === opt}
                                                    onClick={() => {
                                                        setCategory(opt);
                                                        setCategoryOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-2.5 text-left text-sm font-medium ${
                                                        category === opt
                                                            ? 'bg-[var(--color-accent-pale)] text-[var(--color-button-hover)]'
                                                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-cool-light)]'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <label className="block">
                            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Comments</span>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Write your comments"
                                rows={5}
                                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-subtle)] outline-none placeholder:text-[var(--color-text-soft)] ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Attachments (Optional)</span>
                            <div
                                className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-cool-light)] px-4 py-6 transition hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-accent-pale)]"
                                onClick={() => fileInputRef.current?.click()}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        fileInputRef.current?.click();
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label="Upload file (JPG, PDF or PNG, max 5MB)"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    aria-hidden="true"
                                />
                                <FolderPlus size={40} className="text-[var(--color-text-soft)]" />
                                <p className="mt-3 text-sm font-medium text-[var(--color-text-secondary)]">
                                    Drag and drop or click to choose files (Optional)
                                </p>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">(JPG, PDF or PNG) File size limit: 5MB</p>
                                {file && <p className="mt-2 text-xs font-medium text-[var(--color-button-hover)]">{file.name}</p>}
                                {fileError && <p className="mt-2 text-xs font-medium text-[var(--color-danger)]">{fileError}</p>}
                            </div>
                        </label>

                        <button
                            type="submit"
                            className="btn-theme-cta flex h-12 w-full items-center justify-center rounded-xl px-4 text-base font-bold shadow-[var(--shadow-cta)] transition hover:-translate-y-0.5 hover:brightness-105"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
