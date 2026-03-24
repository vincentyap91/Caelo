import { CalendarDays, Package, Sparkles, Ticket } from 'lucide-react';

/** Icons for Rewards nav (account sidebar + profile dropdown) — keys match program `id` */
export const REWARDS_NAV_ICONS = {
    'daily-bonus': CalendarDays,
    'spin-wheel': Sparkles,
    'voucher-scratch': Ticket,
    'prize-box': Package,
};

/** Rewards area: program ids match URL hash on `/loyalty-rewards#…` */
export const REWARDS_PROGRAMS = [
    { id: 'daily-bonus', label: 'Daily Bonus' },
    { id: 'spin-wheel', label: 'Spin Wheel' },
    { id: 'voucher-scratch', label: 'Voucher Scratch' },
    { id: 'prize-box', label: 'Prize Box' },
];

export const REWARDS_PROGRAM_IDS = REWARDS_PROGRAMS.map((p) => p.id);

export const REWARDS_SUB_TABS = [
    { id: 'unclaimed', label: 'Unclaimed' },
    { id: 'history', label: 'History' },
    { id: 'benefits', label: 'Benefits' },
];
