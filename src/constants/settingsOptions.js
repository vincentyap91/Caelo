import { Bell, HelpCircle, MessageCircle, ShieldCheck, Star } from 'lucide-react';

/**
 * Shared settings options – used in Navbar profile dropdown and AccountSidebar.
 * `action: 'liveChat'` opens live chat instead of navigating by id.
 */
export const settingsOptions = [
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'live-chat', label: 'Live Chat', icon: MessageCircle, action: 'liveChat' },
    { id: 'help-center', label: 'Help Center', icon: HelpCircle },
    { id: 'feedback', label: 'Feedback', icon: Star },
];
