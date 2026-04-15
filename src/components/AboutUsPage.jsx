import React from 'react';
import {
    CircleDollarSign,
    Dices,
    Gamepad2,
    Landmark,
    ShieldCheck,
    Sparkles,
    Trophy,
} from 'lucide-react';
import aboutUsBg from '../assets/about-us-bg.jpg';
import ContentPageLayout, { ContentSectionCard } from './content/ContentPageLayout';

const ABOUT_FEATURES = [
    '24/7 support',
    'Fast payouts',
    'Secure payments',
    'Mobile friendly',
];

const ABOUT_SECTIONS = [
    {
        title: '4D Lottery',
        icon: Trophy,
        description:
            '12WIN brings together multiple lottery options in one place, making it easy to follow popular draws and enjoy a smoother online experience across trusted names and familiar markets.',
    },
    {
        title: 'Online Casino',
        icon: Landmark,
        description:
            'Our live casino experience is built around flexibility, with a wide mix of well-known providers, familiar table games, and simple switching between environments so players can follow the pace and style they prefer.',
    },
    {
        title: 'Sportsbook',
        icon: CircleDollarSign,
        description:
            'The sportsbook covers major sports categories and versatile bet types, with strong odds coverage, useful match information, and a setup designed to support both pre-match and live betting decisions.',
    },
    {
        title: 'Fun to Play Games',
        icon: Gamepad2,
        description:
            'From slots and fishing titles to arcade-style play and casual instant entertainment, the platform offers a broad mix of games built for variety, visual appeal, and rewarding sessions.',
    },
    {
        title: 'RNG Games',
        icon: Dices,
        description:
            'Fast-result RNG tables are available for players who want quicker rounds, consecutive play opportunities, and a more direct betting rhythm without sacrificing clarity or structure.',
    },
    {
        title: 'Virtual Sports',
        icon: Sparkles,
        description:
            'Virtual sports add another layer of entertainment with computer-generated events and streamlined betting, offering another convenient option for players looking for fast-paced action.',
    },
];

export default function AboutUsPage() {
    return (
        <ContentPageLayout
            eyebrow="Company"
            title="About Us"
            lead="12WIN offers a broad range of gaming products with attractive payout opportunities, convenient payment support, and around-the-clock customer service. The platform is designed to feel fast, accessible, and dependable across desktop, tablet, and mobile, while supporting a rewarding referral and bonus journey for members."
            highlights={ABOUT_FEATURES}
            heroVisualSrc={aboutUsBg}
            heroVisualAlt=""
        >
            <ContentSectionCard
                title="Built for convenience, variety, and long-term play"
                icon={ShieldCheck}
                description="Within 12WIN, players can explore a full range of lottery, casino, sportsbook, RNG, and virtual experiences in one consistent environment. The focus is straightforward: clear access to games, reliable transaction flows, and a product mix that stays easy to browse and use."
            />

            <div className="grid items-stretch gap-5 md:grid-cols-2 md:gap-6">
                {ABOUT_SECTIONS.map((section) => (
                    <ContentSectionCard
                        key={section.title}
                        title={section.title}
                        description={section.description}
                        icon={section.icon}
                        className="h-full"
                    />
                ))}
            </div>

            <ContentSectionCard
                title="A platform designed to stay simple and secure"
                icon={ShieldCheck}
                description="Signing up is intended to be straightforward, with secure data handling, protected payment flows, and an experience that remains practical across devices. 12WIN aims to deliver a robust online gaming experience with a clean interface, responsive access, and dependable support whenever players need it."
            />
        </ContentPageLayout>
    );
}
