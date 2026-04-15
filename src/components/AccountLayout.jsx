import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import AccountSidebar from './AccountSidebar';

export default function AccountLayout({ activePage, authUser, onNavigate, onLogout, onLiveChatClick, children }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <main
            className="w-full bg-[linear-gradient(180deg,var(--gradient-account-shell-start)_0%,var(--gradient-account-shell-mid)_38%,var(--gradient-account-shell-end)_100%)] pb-16 pt-6 md:pt-8"
        >
            <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 md:px-6 xl:px-8">
                <div className="flex items-center justify-between gap-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen((open) => !open)}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-700)] shadow-[var(--shadow-subtle)] transition-all hover:bg-[var(--color-accent-50)] hover:shadow"
                    >
                        <UserRound size={16} />
                        Account Menu
                    </button>
                    <p className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Secure Profile
                    </p>
                </div>

                <div className="flex items-start gap-4 xl:gap-0">
                    <div
                        className={`fixed inset-y-0 left-0 z-[100] flex h-dvh max-h-dvh min-h-0 w-[min(320px,88vw)] flex-col lg:relative lg:z-auto lg:h-auto lg:max-h-none lg:w-auto ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
                    >
                        <AccountSidebar
                            activePage={activePage}
                            authUser={authUser}
                            onNavigate={(page, options) => {
                                onNavigate?.(page, options);
                                setMobileSidebarOpen(false);
                            }}
                            onLogout={() => {
                                setMobileSidebarOpen(false);
                                onLogout?.();
                            }}
                            onLiveChatClick={() => {
                                onLiveChatClick?.();
                                setMobileSidebarOpen(false);
                            }}
                        />
                    </div>

                    {mobileSidebarOpen && (
                        <button
                            type="button"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-[2px] lg:hidden"
                            aria-label="Close account menu"
                        />
                    )}

                    {/* Mobile: shell already uses px-4; neutralize nested .page-container horizontal padding so content aligns with Account Menu. */}
                    <div className="min-w-0 flex-1 max-md:[&_.page-container]:px-0">{children}</div>
                </div>
            </div>
        </main>
    );
}
