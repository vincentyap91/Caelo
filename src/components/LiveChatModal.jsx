import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Home, MessageCircle, MoreHorizontal, Search, Send, X } from 'lucide-react';

const messageThreads = [
    {
        id: 'luna-bonus',
        name: 'Luna',
        title: 'Chat with Luna',
        preview: 'Luna: CNY Is Just Around the Corner Boss...',
        time: '3w',
        unread: true,
        status: 'Active 4h ago',
        avatar: 'ðŸ¦‹',
        accent: 'bg-[linear-gradient(180deg,#ffdfc2_0%,#d77fa5_100%)]',
        type: 'article',
        articleTitle: 'CNY Is Just Around The Corner Boss ðŸŽ',
        articleBody: [
            'Want extra ong this CNY? Better join GemChat early!',
            'Members get exclusive rewards, surprise treats, and æ˜¥èŠ‚ gifts ðŸ’Œ',
            'Join our player community for info on promos, bonuses & more.',
            'Wanna know even more? GemNews is perfect for ya ðŸ‘€',
        ],
    },
    {
        id: 'luna-social',
        name: 'Luna',
        title: 'Chat with Luna',
        preview: 'Luna: Social Platforms You Use âœ¨ Hi vince...',
        time: '3w',
        unread: true,
        status: 'Active 4h ago',
        avatar: 'ðŸ¦‹',
        accent: 'bg-[linear-gradient(180deg,#ffdfc2_0%,#d77fa5_100%)]',
        type: 'article',
        articleTitle: 'Social Platforms You Use âœ¨',
        articleBody: [
            'Hi demo, we are sharing more support updates on our social platforms.',
            'Follow GemChat for the latest promos, reminders, and festive news.',
            'You can always come back here if you need more help.',
        ],
    },
    {
        id: 'nora',
        name: 'Nora',
        title: 'The team can also help',
        preview: 'Hello there. ðŸŒŸ Welcome to GemBet Support. ðŸ‘‹',
        time: 'Just now',
        unread: false,
        status: 'The team can also help',
        avatar: 'ðŸ§š',
        accent: 'bg-[linear-gradient(180deg,#ffb56f_0%,#8a4cff_100%)]',
        type: 'assistant',
    },
    {
        id: 'rory',
        name: 'Rory',
        title: 'Active',
        preview: 'Please select a topic related to your inquiry. ðŸ™',
        time: 'Just now',
        unread: false,
        status: 'Active',
        avatar: 'ðŸ°',
        accent: 'bg-[linear-gradient(180deg,#445bff_0%,#112a88_100%)]',
        type: 'support',
    },
];

const helpCollections = [
    { title: 'Crypto Handbook', description: 'Your go-to guide for Crypto on GemBet.', count: '4 articles' },
    { title: 'Payment Methods', description: '', count: '13 articles' },
    { title: 'SGD Bonuses', description: '', count: '9 articles' },
    { title: 'MYR Bonuses', description: 'Articles connected to MYR Bonuses', count: '2 articles' },
    { title: 'Account Settings', description: 'Guides on updating your information, managing preferences, and securing your account.', count: '12 articles' },
];

const helpTopics = [
    'How to Deposit with Surepay',
    'How to Withdraw Through Bank Transfer (SGD)',
    'How to Deposit with TruePay',
    'How to Create and Use Vouchers (MYR)',
];

const supportTags = ['Deposit', 'Withdrawal', 'Bonus', 'Verification', 'Technical Issue', 'Sports Inquiries', 'Casino Inquiries', 'Other'];

function Avatar({ thread, small = false }) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full border border-white/20 text-white shadow-[var(--shadow-brand-soft)] ${thread.accent} ${
                small ? 'h-10 w-10 text-lg' : 'h-12 w-12 text-xl'
            }`}
        >
            {thread.avatar}
        </span>
    );
}

function BottomNav({ activeTab, onChange }) {
    const navBtn = 'flex min-w-[72px] flex-col items-center gap-1.5 py-1';
    const active = 'text-[var(--color-brand-primary)] font-semibold';
    const inactive = 'text-[var(--color-text-muted)] font-medium';

    return (
        <div className="relative flex shrink-0 items-center justify-around rounded-none border-x-0 border-b-0 border-t border-[var(--color-border-brand)] bg-[var(--color-surface-base)] px-5 py-3.5 shadow-[var(--inset-panel)]">
            <button type="button" onClick={() => onChange('home')} className={`${navBtn} ${activeTab === 'home' ? active : inactive}`}>
                <Home size={20} strokeWidth={2} />
                <span className="text-sm">Home</span>
            </button>
            <button type="button" onClick={() => onChange('messages')} className={`relative ${navBtn} ${activeTab === 'messages' ? active : inactive}`}>
                <MessageCircle size={20} strokeWidth={2} />
                <span className="absolute right-4 -top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-danger-main)] px-1 text-xs font-bold text-white">
                    2
                </span>
                <span className="text-sm">Messages</span>
            </button>
            <button type="button" onClick={() => onChange('help')} className={`${navBtn} ${activeTab === 'help' ? active : inactive}`}>
                <HelpCircle size={20} strokeWidth={2} />
                <span className="text-sm">Help</span>
            </button>
        </div>
    );
}

export default function LiveChatModal({ open, onClose, authUser }) {
    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    const username = authUser?.name || 'demo';
    const [activeTab, setActiveTab] = useState('home');
    const [activeThreadId, setActiveThreadId] = useState(null);
    const [selectedSupportTag, setSelectedSupportTag] = useState('Other');
    const [recentChat, setRecentChat] = useState(null);
    const activeThread = useMemo(
        () => messageThreads.find((thread) => thread.id === activeThreadId) ?? null,
        [activeThreadId]
    );

    useEffect(() => {
        if (!open) {
            setActiveTab('home');
            setActiveThreadId(null);
            setSelectedSupportTag('Other');
        }
    }, [open]);

    const markRecentChat = (threadId, overrides = {}) => {
        const thread = messageThreads.find((t) => t.id === threadId);
        if (!thread) return;
        setRecentChat({
            threadId,
            title: overrides.title ?? thread.title,
            preview: overrides.preview ?? thread.preview,
            time: overrides.time ?? thread.time,
            unread: overrides.unread ?? thread.unread,
        });
    };

    const openMessages = () => {
        setActiveTab('messages');
        setActiveThreadId(null);
    };

    const openHelp = () => {
        setActiveTab('help');
        setActiveThreadId(null);
    };

    const openHome = () => {
        setActiveTab('home');
        setActiveThreadId(null);
    };

    const handleBottomNav = (tab) => {
        if (tab === 'home') openHome();
        if (tab === 'messages') openMessages();
        if (tab === 'help') openHelp();
    };

    const renderHome = () => (
        <>
            <div className="relative flex shrink-0 items-center justify-between px-6 pb-6 pt-7">
                <div className="text-2xl font-bold italic tracking-tight text-[var(--color-brand-secondary)]">GEMBET</div>
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                >
                    <X size={18} strokeWidth={3} />
                </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                <div className="rounded-[24px] border border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 pb-6 pt-7 shadow-[var(--inset-panel)]">
                <div className="border-b border-[rgb(171_204_235)] pb-5">
                    <p className="text-2xl font-bold leading-tight text-[var(--color-text-strong)]">
                        Hi {username},
                        <span className="ml-2 inline-block">ðŸ‘‹</span>
                    </p>
                    <p className="mt-1 text-2xl font-bold leading-tight text-[var(--color-brand-secondary)]">
                        How can we help you?
                    </p>
                </div>

                <div className="mt-5 space-y-3.5">
                    {recentChat && (() => {
                        const thread = messageThreads.find((t) => t.id === recentChat.threadId);
                        if (!thread) return null;
                        return (
                            <div className="surface-card rounded-2xl px-4 py-4">
                                <p className="mb-3 text-sm font-semibold text-[var(--color-text-muted)]">Recent message</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('messages');
                                        setActiveThreadId(recentChat.threadId);
                                    }}
                                    className="flex w-full items-start gap-3 text-left transition hover:opacity-90"
                                >
                                    <Avatar thread={thread} small />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-base font-semibold text-[var(--color-text-strong)]">{recentChat.title}</p>
                                        <p className="mt-1 truncate text-base leading-6 text-[var(--color-text-muted)]">{recentChat.preview}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[var(--color-text-muted)]">{recentChat.time}</span>
                                        {recentChat.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-danger-main)]" />}
                                    </div>
                                </button>
                            </div>
                        );
                    })()}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('messages');
                            setActiveThreadId('nora');
                            markRecentChat('rory', { title: 'Chat with Rory', preview: 'Nora: Rate your conversation', time: '17m', unread: true });
                        }}
                        className="surface-card flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
                    >
                        <span className="text-base font-semibold text-[var(--color-text-strong)]">Send us a message</span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)]">
                            <Send size={16} />
                        </span>
                    </button>

                    <button
                        type="button"
                        className="surface-card block w-full rounded-2xl px-4 py-4 text-left"
                        onClick={() => {
                            setActiveTab('messages');
                            setActiveThreadId('luna-bonus');
                            markRecentChat('luna-bonus');
                        }}
                    >
                        <h2 className="text-xl font-semibold leading-snug text-[var(--color-text-strong)]">
                            How Do I Claim The Welcome Bonus MYR?
                        </h2>
                        <p className="mt-2 text-base leading-6 text-[var(--color-text-muted)]">
                            Claiming process The Welcome Bonus can be claimed through...
                        </p>
                    </button>

                    <div className="surface-card rounded-2xl px-4 py-4">
                        <label className="flex items-center gap-3 rounded-xl bg-[var(--color-surface-muted)] px-4 py-3">
                            <span className="text-base font-semibold text-[var(--color-text-strong)]">Search for help</span>
                            <Search size={18} className="ml-auto text-[var(--color-brand-primary)]" />
                        </label>

                        <div className="mt-3 space-y-1">
                            {helpTopics.map((topic) => (
                                <button
                                    key={topic}
                                    type="button"
                                    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--color-surface-muted)]"
                                >
                                    <span className="flex-1 text-base leading-6 text-[var(--color-text-muted)]">{topic}</span>
                                    <ChevronRight size={18} className="mt-1 shrink-0 text-[var(--color-brand-primary)]" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <BottomNav activeTab="home" onChange={handleBottomNav} />
        </>
    );

    const renderMessages = () => (
        <>
            <div className="shrink-0 border-b border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="flex-1 text-center text-2xl font-bold text-[var(--color-brand-secondary)]">Messages</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-3">
                <div className="space-y-2">
                    {messageThreads.filter((thread) => thread.id === 'luna-bonus' || thread.id === 'luna-social').map((thread) => (
                        <button
                            key={thread.id}
                            type="button"
                            onClick={() => {
                                setActiveThreadId(thread.id);
                                markRecentChat(thread.id);
                            }}
                            className="surface-card flex w-full items-start gap-3 rounded-2xl px-4 py-4 text-left transition hover:border-[var(--color-accent-200)] hover:shadow-[var(--shadow-card-raised)]"
                        >
                            <Avatar thread={thread} small />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-base font-semibold text-[var(--color-text-strong)]">{thread.title}</p>
                                    <span className="text-sm text-[var(--color-text-muted)]">{thread.time}</span>
                                </div>
                                <p className="mt-1 truncate text-base leading-6 text-[var(--color-text-muted)]">{thread.preview}</p>
                            </div>
                            <span className="mt-3 h-2.5 w-2.5 rounded-full bg-[var(--color-danger-main)]" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="shrink-0 px-6 pb-5 pt-3">
                <button
                    type="button"
                    onClick={() => {
                        setActiveThreadId('nora');
                        markRecentChat('rory', { title: 'Chat with Rory', preview: 'Nora: Rate your conversation', time: '17m', unread: true });
                    }}
                    className="btn-theme-primary mx-auto flex h-14 min-w-[220px] items-center justify-center gap-3 rounded-2xl px-6 text-lg font-semibold shadow-[var(--shadow-nav-pill)]"
                >
                    Send us a message
                    <Send size={18} />
                </button>
            </div>
            <BottomNav activeTab="messages" onChange={handleBottomNav} />
        </>
    );

    const renderHelp = () => (
        <>
            <div className="shrink-0 border-b border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="flex-1 text-center text-2xl font-bold text-[var(--color-brand-secondary)]">Help</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
                <div className="surface-card rounded-2xl px-4 py-3">
                    <label className="flex items-center gap-3">
                        <span className="text-base font-semibold text-[var(--color-text-strong)]">Search for help</span>
                        <Search size={18} className="ml-auto text-[var(--color-brand-primary)]" />
                    </label>
                </div>

                <div className="mt-4">
                    <p className="text-xl font-bold text-[var(--color-text-strong)]">7 collections</p>
                    <div className="mt-3 space-y-2">
                        {helpCollections.map((collection) => (
                            <button
                                key={collection.title}
                                type="button"
                                className="surface-card flex w-full items-start gap-4 rounded-2xl px-4 py-4 text-left transition hover:border-[var(--color-accent-200)] hover:shadow-[var(--shadow-card-raised)]"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg font-semibold text-[var(--color-text-strong)]">{collection.title}</p>
                                    {collection.description && (
                                        <p className="mt-1 text-base leading-6 text-[var(--color-text-main)]">{collection.description}</p>
                                    )}
                                    <p className={`text-sm text-[var(--color-text-muted)] ${collection.description ? 'mt-1' : 'mt-2'}`}>{collection.count}</p>
                                </div>
                                <ChevronRight size={18} className="mt-1 shrink-0 text-[var(--color-brand-primary)]" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <BottomNav activeTab="help" onChange={handleBottomNav} />
        </>
    );

    const renderArticleThread = (thread) => (
        <>
            <div className="shrink-0 border-b border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 py-3.5">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => setActiveThreadId(null)}
                        className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <ChevronLeft size={18} strokeWidth={3} />
                    </button>
                    <Avatar thread={thread} small />
                    <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-[var(--color-brand-secondary)]">{thread.name}</p>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-[rgb(255_211_74)]" />
                            <span className="text-sm text-[var(--color-text-muted)]">{thread.status}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-5">
                <p className="text-center text-sm text-[var(--color-text-muted)]">Ask us anything, or share your feedback.</p>
                <article className="surface-card mt-5 rounded-3xl px-5 py-5 text-left">
                    <div className="flex items-center gap-3">
                        <Avatar thread={thread} small />
                        <span className="text-sm text-[var(--color-text-muted)]">{thread.name}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold leading-tight text-[var(--color-text-strong)]">{thread.articleTitle}</h3>
                    <div className="mt-4 space-y-4 text-base leading-7 text-[var(--color-text-strong)]">
                        {thread.articleBody.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            </div>
        </>
    );

    const renderAssistantThread = (thread) => (
        <>
            <div className="shrink-0 border-b border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 py-3.5">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => setActiveThreadId(null)}
                        className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <ChevronLeft size={18} strokeWidth={3} />
                    </button>
                    <Avatar thread={thread} small />
                    <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-[var(--color-brand-secondary)]">{thread.name}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{thread.title}</p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-5">
                <p className="text-center text-sm text-[var(--color-text-muted)]">Ask us anything, or share your feedback.</p>
                <article className="surface-card soft-blue-panel mt-5 w-[86%] rounded-[24px] px-4 py-4 text-left">
                    <div className="space-y-4 text-base leading-7 text-[var(--color-text-strong)]">
                        <p>Hello there. ðŸŒŸ Welcome to GemBet Support. ðŸ‘‹</p>
                        <p>Want extra ong this CNY? Better join GemChat early!</p>
                        <p>How can we assist you today?</p>
                    </div>
                </article>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">Nora â€¢ AI Agent â€¢ Just now</p>

                <div className="mt-20 flex flex-wrap justify-end gap-3">
                    {supportTags.map((tag) => {
                        const isSelected = selectedSupportTag === tag;
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                    setSelectedSupportTag(tag);
                                    setActiveThreadId('rory');
                                    markRecentChat('rory', { title: 'Chat with Rory', preview: 'Nora: Rate your conversation', time: '17m', unread: true });
                                }}
                                className={`rounded-full border border-[var(--color-border-default)] px-4 py-2.5 text-base font-medium shadow-[var(--shadow-card-soft)] transition ${
                                    isSelected
                                        ? 'bg-[var(--color-brand-primary)] text-white'
                                        : 'bg-[var(--color-surface-base)] text-[var(--color-brand-secondary)]'
                                }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );

    const renderSupportThread = (thread) => (
        <>
            <div className="shrink-0 border-b border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 py-3.5">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => setActiveThreadId('nora')}
                        className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <ChevronLeft size={18} strokeWidth={3} />
                    </button>
                    <Avatar thread={thread} small />
                    <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-[var(--color-brand-secondary)]">{thread.name}</p>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-success-main)]" />
                            <span className="text-sm text-[var(--color-text-muted)]">Active</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[rgb(0_174_239_/_0.1)]"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-5">
                <article className="surface-card soft-blue-panel w-[86%] rounded-[24px] px-4 py-4 text-left">
                    <div className="space-y-4 text-base leading-7 text-[var(--color-text-strong)]">
                        <p>Please select a topic related to your inquiry. ðŸ™</p>
                    </div>
                </article>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        className="btn-theme-primary rounded-full px-6 py-3 text-base font-semibold shadow-[var(--shadow-nav-pill)]"
                    >
                        General Questions
                    </button>
                </div>

                <article className="surface-card soft-blue-panel mt-6 w-[86%] rounded-[24px] px-4 py-4 text-left">
                    <div className="space-y-4 text-base leading-7 text-[var(--color-text-strong)]">
                        <p>Thank you for selecting the topic. ðŸŒŸ</p>
                        <p>We will connect you with our Support Agent shortly.</p>
                        <p>If you have a screenshot of the issue, it will help us resolve it quickly. ðŸ’Ž</p>
                    </div>
                </article>

                <div className="mt-5 flex items-center justify-center gap-3 text-base text-[var(--color-text-main)]">
                    <Avatar thread={thread} small />
                    <span className="font-medium">{thread.name} joined the conversation</span>
                </div>
            </div>

            <div className="surface-card border-x-0 border-b-0 rounded-none px-4 py-3">
                <div className="rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-4 py-3">
                    <p className="text-base text-[var(--color-text-muted)]">Message...</p>
                    <div className="mt-4 flex items-center gap-4 text-[var(--color-text-muted)]">
                        <span>ðŸ“Ž</span>
                        <span>ðŸ˜Š</span>
                        <span className="text-lg font-bold">GIF</span>
                        <span>ðŸŽ¤</span>
                        <button
                            type="button"
                            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-soft)]"
                        >
                            <ChevronRight size={18} className="-rotate-90" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <section
            role="dialog"
            aria-modal="false"
            aria-label="Live Chat"
            className={`fixed bottom-24 right-6 z-[190] flex h-[min(82vh,760px)] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-[28px] border border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-page-mid)_45%,var(--gradient-register-page-end)_100%)] shadow-[var(--shadow-register-card)] transition-all duration-300 ${
                open
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0'
            }`}
        >
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgb(0_174_239_/_0.12)_0%,transparent_70%)] pointer-events-none" />
            {activeThread
                ? activeThread.type === 'article'
                    ? renderArticleThread(activeThread)
                    : activeThread.type === 'assistant'
                        ? renderAssistantThread(activeThread)
                        : renderSupportThread(activeThread)
                : activeTab === 'messages'
                    ? renderMessages()
                    : activeTab === 'help'
                        ? renderHelp()
                        : renderHome()}
        </section>
    );
}


