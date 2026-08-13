const OPEN_BETS_STORAGE_KEY = '1xbet-open-bets';
const SETTLED_BETS_STORAGE_KEY = '1xbet-settled-bets';

function pad2(n) {
    return String(n).padStart(2, '0');
}

function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function roundMoney(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function parseBetNumber(value) {
    const n = Number(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
}

function formatMoney(n) {
    const abs = Math.abs(n).toFixed(2);
    return n < 0 ? `-${abs}` : abs;
}

function formatDateKey(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatPlacedAt(d, time) {
    return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${time}`;
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatBetDate(bet) {
    const parts = String(bet.dateKey || '').split('-');
    const placed = String(bet.placedAt || '');
    const timeMatch = placed.match(/(\d{1,2}:\d{2})\s*$/);
    const time = timeMatch ? timeMatch[1] : '';
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}${time ? ` / ${time}` : ''}`;
    }
    return placed || bet.dateLabel || '—';
}

function formatPlacedLabel(date) {
    return String(date || '').replace(/^(\d{2})\/(\d{2})\/(\d{4})\s*\/\s*/, (_, d, m) => {
        return `${Number(d)} ${SHORT_MONTHS[Number(m) - 1] || m}, `;
    });
}

function getBetHistoryIcon(bet) {
    const sport = String(bet?.sport || bet?.competition || bet?.eventName || '').toLowerCase();
    if (sport.includes('casino') || sport.includes('baccarat') || sport.includes('slot')) {
        return '/sportsbook/assets/icons/icon-dice.svg';
    }
    if (sport.includes('esport') || sport.includes('cs') || sport.includes('dota')) {
        return '/sportsbook/assets/icons/sport-esports.svg';
    }
    if (sport.includes('basket')) return '/sportsbook/assets/icons/sport-basketball.svg';
    if (sport.includes('tennis')) return '/sportsbook/assets/icons/sport-tennis.svg';
    if (sport.includes('hockey')) return '/sportsbook/assets/icons/sport-hockey.svg';
    if (sport.includes('volley')) return '/sportsbook/assets/icons/sport-volleyball.svg';
    if (sport.includes('baseball')) return '/sportsbook/assets/icons/sport-baseball.svg';
    return '/sportsbook/assets/icons/sport-football.svg';
}

function normalizeHistoryStatus(status) {
    const raw = String(status || 'Open').trim();
    if (/^(unsettled|running|open)$/i.test(raw)) return 'Open';
    if (/^lost$/i.test(raw)) return 'Lost';
    if (/^sold$/i.test(raw)) return 'Sold';
    return raw.replace(/^\w/, (ch) => ch.toUpperCase());
}

function normalizeBetStatusDisplay(status) {
    const raw = String(status || 'Open');
    if (/^lost$/i.test(raw)) return 'Loss';
    if (/^(unsettled|running)$/i.test(raw)) return 'Open';
    return raw;
}

function isOpenBetStatus(status) {
    return /^(open|running|unsettled)$/i.test(String(status || ''));
}

function potentialWinAmount(bet) {
    const stake = parseBetNumber(bet.stake);
    const odds = parseBetNumber(bet.odds);
    if (odds > 0) return roundMoney(stake * odds);
    return parseBetNumber(bet.winnings);
}

function settledReturnAmount(bet) {
    const status = String(bet.status || '').toLowerCase();
    const stake = parseBetNumber(bet.stake);
    if (status === 'won') return parseBetNumber(bet.winnings) || potentialWinAmount(bet);
    if (status === 'sold') return parseBetNumber(bet.winnings);
    if (status === 'void' || status === 'cancelled') return stake;
    if (status === 'lost' || status === 'loss') return 0;
    return 0;
}

function getProviderName(bet) {
    const category = String(bet.category || '').toLowerCase();
    if (category === 'casino') return bet.league || 'Casino';
    if (category === 'esports') return 'Esports';
    return 'Sports';
}

function resolveSessionBetDate(bet) {
    if (bet?.soldDate) {
        const sold = new Date(bet.soldDate);
        if (!Number.isNaN(sold.getTime())) return sold;
    }
    const parts = String(bet?.placedDate || '')
        .split('/')
        .map((part) => Number(part));
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        const d = new Date(parts[2], parts[0] - 1, parts[1]);
        const timeParts = String(bet?.placedTime || '12:00:00')
            .split(':')
            .map((part) => Number(part));
        d.setHours(timeParts[0] || 0, timeParts[1] || 0, timeParts[2] || 0, 0);
        return d;
    }
    return new Date();
}

function sessionBetToHistoryEntry(bet) {
    const when = resolveSessionBetDate(bet);
    const dateKey = formatDateKey(when);
    const time = `${pad2(when.getHours())}:${pad2(when.getMinutes())}`;
    const status = normalizeHistoryStatus(bet.status);
    const winnings =
        bet.soldValue != null
            ? Number(bet.soldValue).toFixed(2)
            : String(bet.potentialWinnings || bet.maxPayout || bet.winnings || '0.00');
    const sport = String(bet.sport || 'Sports');
    const category = /casino/i.test(sport) ? 'casino' : /esport/i.test(sport) ? 'esports' : 'sports';

    return {
        id: String(bet.id),
        category,
        sport,
        icon: getBetHistoryIcon(bet),
        league: bet.competition || bet.eventName || bet.league || '',
        match: bet.match || '',
        betType: bet.betType || 'Single',
        odds: String(bet.odds || '—'),
        stake: Number(bet.stake || 0).toFixed(2),
        winnings,
        status,
        dateKey,
        placedAt: formatPlacedAt(when, time),
        source: 'session',
    };
}

function readStoredBets(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const list = JSON.parse(raw);
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

function buildDemoBetHistory() {
    const today = startOfDay(new Date());
    const daysAgo = (n) => {
        const d = new Date(today);
        d.setDate(d.getDate() - n);
        return d;
    };

    const stamp = (days, time, rest) => {
        const d = daysAgo(days);
        return {
            ...rest,
            dateKey: formatDateKey(d),
            placedAt: formatPlacedAt(d, time),
        };
    };

    return [
        stamp(1, '14:32', {
            id: '123456789',
            category: 'sports',
            sport: 'Tennis',
            icon: '/sportsbook/assets/icons/sport-tennis.svg',
            league: 'Wimbledon. Grass',
            match: 'Arthur Fery vs Alexander Zverev',
            betType: 'Single',
            odds: '1.85',
            stake: '50.00',
            winnings: '92.50',
            status: 'Won',
        }),
        stamp(1, '11:05', {
            id: '123456790',
            category: 'sports',
            sport: 'Basketball',
            icon: '/sportsbook/assets/icons/sport-basketball.svg',
            league: 'NBA. USA',
            match: 'Boston Celtics vs Dallas Mavericks',
            betType: 'Single',
            odds: '1.72',
            stake: '40.00',
            winnings: '0.00',
            status: 'Lost',
        }),
        stamp(3, '21:18', {
            id: '123456801',
            category: 'sports',
            sport: 'Football',
            icon: '/sportsbook/assets/icons/sport-football.svg',
            league: 'Premier League. England',
            match: 'Arsenal vs Chelsea',
            betType: 'Single',
            odds: '2.10',
            stake: '25.00',
            winnings: '52.50',
            status: 'Open',
        }),
        stamp(0, '16:42', {
            id: '123456810',
            category: 'casino',
            sport: 'Casino',
            icon: '/sportsbook/assets/icons/icon-dice.svg',
            league: 'Live Casino',
            match: 'Holi Bac 1',
            betType: 'Real money',
            odds: '—',
            stake: '20.00',
            winnings: '38.00',
            status: 'Won',
        }),
        stamp(0, '13:24', {
            id: '123456811',
            category: 'esports',
            sport: 'Esports',
            icon: '/sportsbook/assets/icons/sport-esports.svg',
            league: 'Counter-Strike 2. ESL Pro League',
            match: 'Team Spirit vs NAVI',
            betType: 'Single',
            odds: '1.82',
            stake: '35.00',
            winnings: '63.70',
            status: 'Won',
        }),
        stamp(1, '20:15', {
            id: '123456812',
            category: 'esports',
            sport: 'Esports',
            icon: '/sportsbook/assets/icons/sport-esports.svg',
            league: 'Dota 2. The International',
            match: 'Team Liquid vs Gaimin Gladiators',
            betType: 'Single',
            odds: '2.05',
            stake: '20.00',
            winnings: '0.00',
            status: 'Open',
        }),
        stamp(3, '18:40', {
            id: '123456815',
            category: 'sports',
            sport: 'Football',
            icon: '/sportsbook/assets/icons/sport-football.svg',
            league: 'Serie A. Italy',
            match: 'Inter vs Milan',
            betType: 'Single',
            odds: '1.90',
            stake: '18.00',
            winnings: '0.00',
            status: 'Void',
        }),
        stamp(2, '19:48', {
            id: '123456850',
            category: 'sports',
            sport: 'Football',
            icon: '/sportsbook/assets/icons/sport-football.svg',
            league: 'Bundesliga. Germany',
            match: 'Bayern vs Dortmund',
            betType: 'Single',
            odds: '1.68',
            stake: '45.00',
            winnings: '38.20',
            status: 'Sold',
        }),
        stamp(2, '10:12', {
            id: '123456832',
            category: 'casino',
            sport: 'Casino',
            icon: '/sportsbook/assets/icons/icon-dice.svg',
            league: 'Slots',
            match: 'Sweet Bonanza',
            betType: 'Real money',
            odds: '—',
            stake: '15.00',
            winnings: '0.00',
            status: 'Lost',
        }),
        stamp(1, '22:06', {
            id: '123456833',
            category: 'casino',
            sport: 'Casino',
            icon: '/sportsbook/assets/icons/icon-dice.svg',
            league: 'Live Casino',
            match: 'Lightning Baccarat',
            betType: 'Real money',
            odds: '—',
            stake: '30.00',
            winnings: '0.00',
            status: 'Lost',
        }),
        stamp(12, '19:03', {
            id: '123456820',
            category: 'sports',
            sport: 'Tennis',
            icon: '/sportsbook/assets/icons/sport-tennis.svg',
            league: 'ATP. Hard',
            match: 'Djokovic vs Alcaraz',
            betType: 'Single',
            odds: '1.95',
            stake: '30.00',
            winnings: '0.00',
            status: 'Cancelled',
        }),
        stamp(40, '09:27', {
            id: '123456830',
            category: 'casino',
            sport: 'Casino',
            icon: '/sportsbook/assets/icons/icon-dice.svg',
            league: 'Slots',
            match: 'Gates of Olympus',
            betType: 'Real money',
            odds: '—',
            stake: '12.00',
            winnings: '0.00',
            status: 'Lost',
        }),
        stamp(70, '22:10', {
            id: '123456840',
            category: 'sports',
            sport: 'Football',
            icon: '/sportsbook/assets/icons/sport-football.svg',
            league: 'La Liga. Spain',
            match: 'Real Madrid vs Barcelona',
            betType: 'Single',
            odds: '2.40',
            stake: '60.00',
            winnings: '144.00',
            status: 'Won',
        }),
    ];
}

export function loadBetRecordSource() {
    const session = [
        ...readStoredBets(SETTLED_BETS_STORAGE_KEY).map(sessionBetToHistoryEntry),
        ...readStoredBets(OPEN_BETS_STORAGE_KEY).map(sessionBetToHistoryEntry),
    ];
    const seen = new Set(session.map((bet) => String(bet.id)));
    const demo = buildDemoBetHistory().filter((bet) => !seen.has(String(bet.id)));
    return session.concat(demo);
}

export function betMatchesType(bet, typeValue) {
    const category = String(bet.category || '').toLowerCase();
    const league = String(bet.league || '');
    if (!typeValue || typeValue === 'all') return true;
    if (typeValue === 'sports') return category === 'sports' || category === 'esports';
    if (typeValue === 'casino') return category === 'casino' && !/live/i.test(league);
    if (typeValue === 'live') return category === 'casino' && /live/i.test(league);
    return true;
}

export function betMatchesStatus(bet, statusValue) {
    const statusKey = String(bet.status || '').toLowerCase();
    if (!statusValue || statusValue === 'all') return true;
    if (statusValue === 'open') {
        return statusKey === 'open' || statusKey === 'running' || statusKey === 'unsettled';
    }
    if (statusValue === 'lost') {
        return statusKey === 'lost' || statusKey === 'loss';
    }
    return statusKey === statusValue;
}

export function toBetDetailRow(bet) {
    const statusRaw = String(bet.status || 'Open');
    let statusKey = statusRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (statusKey === 'loss') statusKey = 'lost';
    const stake = parseBetNumber(bet.stake);
    let winAmount = 0;
    let winStrike = false;
    let winTone = '';

    if (/^lost$/i.test(statusRaw)) {
        winAmount = potentialWinAmount(bet);
        winStrike = true;
    } else if (/^won$/i.test(statusRaw)) {
        winAmount = parseBetNumber(bet.winnings) || potentialWinAmount(bet);
        winTone = 'pos';
    } else if (/^sold$/i.test(statusRaw)) {
        winAmount = parseBetNumber(bet.winnings);
        winTone = winAmount >= stake ? 'pos' : 'neg';
    } else if (/^(void|cancelled)$/i.test(statusRaw)) {
        winAmount = stake;
    } else {
        winAmount = potentialWinAmount(bet);
        winTone = 'open';
    }

    const isOpen = isOpenBetStatus(statusRaw);

    return {
        id: String(bet.id || ''),
        dateKey: bet.dateKey,
        icon: bet.icon || '/sportsbook/assets/icons/sport-football.svg',
        match: bet.match || '—',
        league: bet.league || '',
        slip: String(bet.id || '—'),
        date: formatBetDate(bet),
        placedLabel: formatPlacedLabel(formatBetDate(bet)),
        betType: bet.betType || 'Single',
        stake: stake.toFixed(2),
        stakeValue: stake,
        odds: bet.odds && String(bet.odds) !== '—' ? String(bet.odds) : '—',
        status: normalizeBetStatusDisplay(statusRaw),
        statusKey,
        payout: winAmount.toFixed(2),
        payoutValue: winAmount,
        payoutStrike: winStrike,
        payoutTone: winTone,
        provider: getProviderName(bet),
        isOpen,
        returnValue: isOpen ? 0 : settledReturnAmount(bet),
    };
}

export function computeBetKpis(rows) {
    let totalStake = 0;
    let settledStake = 0;
    let totalReturn = 0;
    let openStake = 0;

    rows.forEach((row) => {
        totalStake += row.stakeValue;
        if (row.isOpen) {
            openStake += row.stakeValue;
        } else {
            settledStake += row.stakeValue;
            totalReturn += row.returnValue;
        }
    });

    return {
        totalStake: roundMoney(totalStake),
        totalReturn: roundMoney(totalReturn),
        net: roundMoney(totalReturn - settledStake),
        openStake: roundMoney(openStake),
        settledStake: roundMoney(settledStake),
    };
}

export function aggregateProviderSummary(rows) {
    const map = {};
    const order = [];

    rows.forEach((row) => {
        if (row.isOpen) return;
        const key = row.provider || 'Other';
        if (!map[key]) {
            map[key] = { provider: key, turnover: 0, winLoss: 0 };
            order.push(key);
        }
        map[key].turnover += row.stakeValue;
        map[key].winLoss += row.returnValue - row.stakeValue;
    });

    return order.map((key) => {
        const item = map[key];
        const turnover = roundMoney(item.turnover);
        const winLoss = roundMoney(item.winLoss);
        return {
            id: key,
            provider: item.provider,
            turnover: turnover.toFixed(2),
            turnoverValue: turnover,
            winLoss: formatMoney(winLoss),
            winLossValue: winLoss,
            amountTone: winLoss < 0 ? 'neg' : winLoss > 0 ? 'pos' : '',
        };
    });
}

export function formatSignedMoney(n) {
    if (n > 0) return `+${n.toFixed(2)}`;
    return formatMoney(n);
}
