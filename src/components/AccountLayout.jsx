import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import AccountSidebar from './AccountSidebar';

export default function AccountLayout({
    activePage,
    authUser,
    guestPreview = false,
    variant,
    onNavigate,
    onLogout,
    onLoginClick,
    onLiveChatClick,
    children,
}) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const isCashier = variant === 'cashier';

    return (
        <main
            className={`account-layout w-full bg-gradient-account-shell pb-16 pt-6 md:pt-8${isCashier ? ' account-layout-cashier' : ''}`}
        >
            <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 md:px-6 xl:px-8">
                <div className="flex items-center justify-between gap-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen((open) => !open)}
                        className="account-layout__menu-trigger inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--color-accent-glow)] bg-[var(--color-tertiery)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-sub)] shadow-[var(--shadow-subtle)] transition-all hover:bg-[var(--color-accent-pale)] hover:shadow"
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
                        className={`fixed inset-y-0 left-0 z-[140] flex h-dvh max-h-dvh min-h-0 w-[min(320px,88vw)] flex-col transition-transform duration-300 ease-out will-change-transform lg:relative lg:z-auto lg:h-auto lg:max-h-none lg:w-auto lg:transition-none ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
                    >
                        <AccountSidebar
                            activePage={activePage}
                            authUser={authUser}
                            guestPreview={guestPreview}
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
                            onLoginClick={() => {
                                onLoginClick?.();
                                setMobileSidebarOpen(false);
                            }}
                        />
                    </div>

                    {mobileSidebarOpen && (
                        <button
                            type="button"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="fixed inset-0 z-[135] bg-slate-900/20 backdrop-blur-[2px] lg:hidden"
                            aria-label="Close account menu"
                        />
                    )}

                    <div className="min-w-0 flex-1 max-md:[&_.page-container]:px-0">{children}</div>
                </div>
            </div>
        </main>
    );
}
