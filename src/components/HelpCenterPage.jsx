import React, { useEffect, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import SegmentedTabs from './ui/SegmentedTabs';

const mainTabs = [
    { id: 'faq', label: 'FAQ' },
    { id: 'tc', label: 'T&C' },
    { id: 'bet-rules', label: 'Bet Rules & Regulations' },
];

const subCategoryTabs = [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'My Account' },
    { id: 'payment', label: 'Payment' },
    { id: 'promotions', label: 'Promotions' },
    { id: 'fair-play', label: 'Fair Play' },
    { id: 'games', label: 'Games Category' },
    { id: 'technical', label: 'Technical' },
];

const faqItems = [
    { id: 1, question: 'How do I create an account?', answer: 'Click the Register button in the top right corner, fill in your details, and verify your email. You can start playing within minutes.' },
    { id: 2, question: 'What payment methods are accepted?', answer: 'We accept major e-wallets, bank transfers, and credit/debit cards. All transactions are encrypted and secure.' },
    { id: 3, question: 'How do I withdraw my winnings?', answer: 'Go to your account dashboard, select Withdraw, choose your preferred method, and follow the verification steps. Withdrawals are typically processed within 24-48 hours.' },
    { id: 4, question: 'Is my personal information secure?', answer: 'Yes. We use industry-standard encryption and never share your data with third parties. Your account is protected by secure login and optional 2FA.' },
    { id: 5, question: 'How can I contact customer support?', answer: 'Use our 24/7 Live Chat from any page, or email support@12win.com. Our team typically responds within minutes.' },
];

const termsSections = [
    {
        title: 'General',
        items: [
            'These terms govern access to and use of the 12WIN platform. By registering, logging in, depositing, placing bets, or using any service on the site, you confirm that you have read, understood, and agreed to these terms together with any applicable game rules, bonus terms, or platform policies.',
            'You must be of legal age in your jurisdiction to register and use the platform.',
            'You are responsible for ensuring that online gaming is permitted where you access the service.',
            '12WIN may refuse service, suspend access, or restrict activity where required for security, compliance, operational, or responsible-gaming reasons.',
            'Rules, promotions, products, limits, and content may be updated from time to time, and continued use of the platform constitutes acceptance of the latest version.',
        ],
    },
    {
        title: "Member's Account",
        items: [
            'Members are responsible for keeping account information accurate, complete, and secure. The account holder is solely responsible for activity conducted through their credentials unless otherwise determined by 12WIN after review.',
            'Only one account is allowed per person, household, device group, payment source, or shared environment unless the platform has approved otherwise.',
            'Registration details must be true and kept up to date. 12WIN may request supporting documents at any time for identity or account review.',
            'Passwords, verification codes, and account access details must not be shared with any third party.',
            'Accounts may be suspended, limited, or closed if duplicate registration, identity inconsistency, suspicious activity, or policy breaches are detected.',
        ],
    },
    {
        title: 'Deposits & Withdrawals',
        items: [
            'All financial activity on the platform is subject to internal review, payment-channel rules, fraud screening, and verification requirements. Processing time can vary depending on the payment method, account status, and compliance checks.',
            'Deposits and withdrawals may only be made through approved channels and under the account holder name where required.',
            '12WIN may request identity, payment-source, or account-ownership documents before approving selected transactions.',
            'Withdrawal requests may be delayed, adjusted, or rejected where rollover, bonus, security, or verification requirements remain incomplete.',
            'Chargebacks, payment disputes, fraudulent transaction claims, or reversed deposits may lead to account suspension and recovery action.',
        ],
    },
    {
        title: 'Management of Betting Transactions',
        items: [
            'All wagers, bet confirmations, settlements, cancellations, and related records are managed according to platform rules and the relevant product or game logic in effect at the time the transaction is accepted.',
            'A bet is only considered accepted once it is confirmed by the platform and recorded in the betting history or system record.',
            '12WIN may void, reject, or cancel bets affected by obvious errors, incorrect odds, duplicate transmissions, pricing mistakes, technical faults, or interrupted game states.',
            'Where a game round, event, or settlement is impacted by malfunction, disconnection, corruption, or force majeure, the platform reserves the right to review or reverse the affected transaction.',
            'System records maintained by 12WIN will be treated as the primary reference in the event of transaction disputes unless there is clear evidence to the contrary.',
        ],
    },
    {
        title: 'Misc / Disclaimers / Other Terms',
        items: [
            '12WIN provides the service on an operational best-effort basis and does not guarantee uninterrupted availability at all times. Access may be affected by maintenance, connectivity issues, third-party providers, or events beyond reasonable control.',
            'The platform is not liable for indirect, incidental, or consequential loss arising from the use of the service except where required by law.',
            'All trademarks, content, design assets, and platform materials remain the property of their respective owners and may not be reused without permission.',
            'If any part of these terms is found invalid or unenforceable, the remaining provisions will continue to apply.',
            'For account support or clarification on platform rules, members should contact customer service through the official support channels available on the site.',
        ],
    },
];

function resolveHelpMainTab(defaultTab) {
    const hashTab = typeof window !== 'undefined' ? window.location.hash.slice(1).toLowerCase() : '';
    if (hashTab === 'faq' || hashTab === 'tc' || hashTab === 'bet-rules') return hashTab;
    if (defaultTab === 'faq' || defaultTab === 'tc' || defaultTab === 'bet-rules') return defaultTab;
    return 'faq';
}

function AccordionItem({ index, question, answer, isOpen, onToggle }) {
    return (
        <div className="surface-card overflow-hidden rounded-2xl">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[var(--color-surface-muted)]"
            >
                <span className="text-base font-bold text-[var(--color-text-strong)]">
                    {index}. {question}
                </span>
                <ChevronDown
                    size={20}
                    className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="border-t border-[var(--color-border-default)] px-5 py-4">
                    <p className="text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default function HelpCenterPage({ navigationState = null, guestLayout = false }) {
    const [mainTab, setMainTab] = useState(() => resolveHelpMainTab(navigationState?.helpTab));
    const [subTab, setSubTab] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        setMainTab(resolveHelpMainTab(navigationState?.helpTab));
    }, [navigationState?.helpTab]);

    useEffect(() => {
        const syncFromHash = () => setMainTab(resolveHelpMainTab(navigationState?.helpTab));
        window.addEventListener('hashchange', syncFromHash);
        window.addEventListener('popstate', syncFromHash);
        return () => {
            window.removeEventListener('hashchange', syncFromHash);
            window.removeEventListener('popstate', syncFromHash);
        };
    }, [navigationState?.helpTab]);

    const toggleExpand = (id) => {
        setExpandedId((current) => (current === id ? null : id));
    };

    const filteredFaq = searchQuery.trim()
        ? faqItems.filter(
              (item) =>
                  item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : faqItems;

    const shellClass = guestLayout
        ? 'mx-auto w-full max-w-[1480px] px-4 md:px-6 xl:px-8'
        : 'page-container';

    return (
        <div className={shellClass}>
            <h1 className="page-title">Help Center</h1>

            <div className="mt-8 space-y-6">
                <label className="relative block">
                    <span className="sr-only">Search help topics</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for help..."
                        className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] pl-4 pr-12 text-sm text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none placeholder:text-[var(--color-text-soft)] ring-[var(--color-accent-400)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                    />
                    <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-soft)]" />
                </label>

                <SegmentedTabs
                    items={mainTabs}
                    value={mainTab}
                    onChange={setMainTab}
                />

                <div className="flex flex-wrap gap-2">
                    {subCategoryTabs.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setSubTab(id)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                subTab === id
                                    ? 'border-2 border-[var(--color-accent-500)] bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-sm'
                                    : 'border border-transparent bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {mainTab === 'faq' && filteredFaq.length > 0 &&
                        filteredFaq.map((item, idx) => (
                            <AccordionItem
                                key={item.id}
                                index={idx + 1}
                                question={item.question}
                                answer={item.answer}
                                isOpen={expandedId === item.id}
                                onToggle={() => toggleExpand(item.id)}
                            />
                        ))}
                    {mainTab === 'faq' && filteredFaq.length === 0 && (
                        <div className="surface-card rounded-2xl p-8 text-center">
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                    )}
                    {mainTab === 'tc' && (
                        <div className="space-y-4">
                            {termsSections.map((section) => (
                                <section key={section.title} className="surface-card rounded-2xl p-6 md:p-8">
                                    <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">
                                        {section.title}
                                    </h2>
                                    <ol className="mt-4 space-y-3">
                                        {section.items.map((item, index) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-50)] text-xs font-bold text-[var(--color-accent-700)]">
                                                    {index + 1}
                                                </span>
                                                <p className="text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                                                    {item}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            ))}
                        </div>
                    )}
                    {mainTab === 'bet-rules' && (
                        <div className="surface-card rounded-2xl p-6 md:p-8">
                            <p className="text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                                Bet Rules and Regulations content will appear here. This section covers betting limits, settlement rules, and dispute resolution.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
