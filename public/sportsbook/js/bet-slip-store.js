/**
 * Shared sportsbook bet-slip selections across all /sportsbook modes.
 * Persists in sessionStorage so home ↔ search ↔ favourites ↔ BT keep the same slip.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "caelo_sb_bet_slip_v1";
  const CHANGE_EVENT = "sb-bet-slip-change";
  const listeners = new Set();

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatOdd(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? "");
    const fixed = n.toFixed(2);
    return fixed.replace(/\.?0+$/, (m) => (m.includes(".") ? m.replace(/0+$/, "").replace(/\.$/, "") : m)) || String(n);
  }

  function eventKey(bet) {
    if (!bet) return "";
    if (bet.eventId != null && bet.eventId !== "") return String(bet.eventId);
    const id = String(bet.id || "");
    const cut = id.indexOf("-");
    return cut > 0 ? id.slice(0, cut) : id;
  }

  function normalize(bet) {
    if (!bet || typeof bet !== "object") return null;
    const id = String(bet.id || "").trim();
    if (!id) return null;
    const odds = Number(bet.odds);
    return {
      id,
      eventId: bet.eventId != null ? String(bet.eventId) : eventKey(bet),
      league: bet.league || "",
      match: bet.match || "",
      market: bet.market || "",
      selection: bet.selection || "",
      odds: Number.isFinite(odds) ? odds : 0,
      home: bet.home || "",
      away: bet.away || "",
      homeLogo: bet.homeLogo || "",
      awayLogo: bet.awayLogo || "",
      sportIcon: bet.sportIcon || "",
      live: !!bet.live,
      scoreH: bet.scoreH,
      scoreA: bet.scoreA,
    };
  }

  function read() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalize).filter(Boolean);
    } catch (_) {
      return [];
    }
  }

  function write(items, opts) {
    const next = (Array.isArray(items) ? items : []).map(normalize).filter(Boolean);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {
      /* ignore quota */
    }
    window.__betSlipCount = next.length;
    if (!(opts && opts.silent)) {
      notify(next);
    }
    return next;
  }

  function notify(items) {
    const list = items || read();
    listeners.forEach((fn) => {
      try {
        fn(list);
      } catch (_) {
        /* ignore */
      }
    });
    try {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { items: list } }));
    } catch (_) {
      /* ignore */
    }
  }

  function subscribe(fn) {
    if (typeof fn !== "function") return () => {};
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function toggle(data) {
    const bet = normalize(data);
    if (!bet) return read();
    let items = read();
    const idx = items.findIndex((b) => b.id === bet.id);
    if (idx >= 0) {
      items.splice(idx, 1);
    } else {
      const ek = eventKey(bet);
      items = items.filter((b) => eventKey(b) !== ek);
      items.push(bet);
    }
    return write(items);
  }

  function remove(id) {
    const key = String(id || "");
    return write(read().filter((b) => b.id !== key));
  }

  function clear() {
    return write([]);
  }

  function has(id) {
    return read().some((b) => b.id === String(id || ""));
  }

  function count() {
    return read().length;
  }

  function productOdds(items) {
    return (items || read()).reduce((acc, b) => {
      const n = Number(b.odds);
      return acc * (Number.isFinite(n) && n > 0 ? n : 1);
    }, 1);
  }

  function syncBadge(items) {
    const n = (items || read()).length;
    window.__betSlipCount = n;
    const badge = document.getElementById("mobile-bet-count");
    if (badge) {
      badge.textContent = String(n);
      badge.hidden = n < 1;
    }
    const rail = document.getElementById("rc-bet-count");
    if (rail) rail.textContent = String(n);
    if (typeof window.syncMobileBetCount === "function") {
      try {
        window.syncMobileBetCount();
      } catch (_) {
        /* ignore */
      }
    }
  }

  function cardHtml(b) {
    return (
      `<article class="bet-item ticket-card" data-bet-id="${escapeHtml(b.id)}">` +
      `<button type="button" class="bet-remove" data-remove="${escapeHtml(b.id)}" aria-label="Remove selection">×</button>` +
      `<div class="ticket-card-body">` +
      `<div class="ticket-meta-line">` +
      (b.live ? `<span class="ticket-live-badge">LIVE</span>` : "") +
      `<span class="bet-item-league">${escapeHtml(b.league || "Sports")}</span>` +
      `</div>` +
      `<div class="bet-item-match">${escapeHtml(b.match)}</div>` +
      `<div class="ticket-selection-row">` +
      `<span class="odds">${escapeHtml(formatOdd(b.odds))}</span>` +
      `<span class="ticket-market">${escapeHtml(b.market || "")} · ${escapeHtml(b.selection || "")}</span>` +
      `</div>` +
      `</div>` +
      `</article>`
    );
  }

  /**
   * Paint shared DOM (#bet-list / empty / footer / totals).
   * Used on pages that skip script.js; home still uses script.renderBetSlip.
   */
  function paint(opts) {
    const items = read();
    const skipScriptOwned =
      typeof window.__sbBetSlipOwnedByScript === "boolean" && window.__sbBetSlipOwnedByScript;
    /* force: always paint DOM (open sheet / cross-page sync) */
    if (skipScriptOwned && !(opts && opts.force)) {
      syncBadge(items);
      if (typeof window.syncBetSlipAuthUi === "function") window.syncBetSlipAuthUi();
      return items;
    }

    const empty = document.getElementById("bet-empty");
    const list = document.getElementById("bet-list");
    const footer = document.getElementById("bet-footer");
    const body = document.getElementById("bet-slip-body");
    const totalOdds = document.getElementById("total-odds");
    const potentialReturn = document.getElementById("potential-return");
    const stakeInput = document.getElementById("stake-input");
    const regCta = document.getElementById("bet-reg-cta");

    syncBadge(items);

    if (!list) {
      if (typeof window.syncBetSlipAuthUi === "function") window.syncBetSlipAuthUi();
      return items;
    }

    if (body) body.classList.toggle("has-bets", items.length > 0);

    if (!items.length) {
      if (empty) empty.hidden = false;
      list.hidden = true;
      list.innerHTML = "";
      if (footer) {
        footer.hidden = true;
        footer.classList.remove("is-sticky");
      }
      if (regCta) {
        const loggedIn = document.body.classList.contains("is-logged-in");
        regCta.hidden = loggedIn;
      }
      if (typeof window.DsBetSlipGenerator?.ensureEmptyCta === "function") {
        window.DsBetSlipGenerator.ensureEmptyCta();
      }
      if (typeof window.syncBetSlipAuthUi === "function") window.syncBetSlipAuthUi();
      return items;
    }

    if (empty) empty.hidden = true;
    list.hidden = false;
    list.innerHTML = items.map(cardHtml).join("");
    if (footer) {
      footer.hidden = false;
      footer.classList.add("is-sticky");
    }
    if (regCta) regCta.hidden = true;

    const total = productOdds(items);
    if (totalOdds) totalOdds.textContent = formatOdd(total);
    if (potentialReturn) {
      const stake = Number(stakeInput?.value) || 0;
      const win = stake * total;
      potentialReturn.textContent = Number.isFinite(win) ? String(Math.round(win * 100) / 100) : "0";
    }

    if (typeof window.syncBetSlipAuthUi === "function") window.syncBetSlipAuthUi();
    return items;
  }

  /* ── My bets (Active / History) — localStorage, shared across modes ── */
  const OPEN_BETS_KEY = "1xbet-open-bets";
  const SETTLED_BETS_KEY = "1xbet-settled-bets";
  const MYBETS_CHANGE_EVENT = "sb:mybets-change";

  const DEFAULT_OPEN_BETS = [
    {
      id: "487030422",
      placedDate: "07/12/2026",
      placedTime: "21:54:55",
      sport: "Football",
      market: "Correct Score",
      pick: "2 : 1",
      selection: "2 : 1",
      match: "France -vs- Spain",
      eventName: "WORLD CUP 2026 (in Canada, Mexico & USA)",
      competition: "WORLD CUP 2026 (in Canada, Mexico & USA)",
      eventDate: "07/15",
      maxPayout: "100.80",
      potentialWinnings: "100.80",
      odds: "8.4",
      oddsTag: "E",
      stake: "12.00",
      originalStake: "12.00",
      betType: "Single bet",
      status: "Running",
      cashOut: true,
      sellEligible: true,
      sellValue: 9,
      cashOutValue: 9,
    },
  ];

  function readJsonList(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJsonList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(Array.isArray(list) ? list : []));
    } catch (_) {
      /* ignore quota */
    }
  }

  function emitMyBetsChange(detail) {
    try {
      window.dispatchEvent(new CustomEvent(MYBETS_CHANGE_EVENT, { detail: detail || {} }));
    } catch (_) {
      /* ignore */
    }
  }

  function readOpenBets() {
    try {
      if (localStorage.getItem(OPEN_BETS_KEY) == null) {
        writeJsonList(OPEN_BETS_KEY, DEFAULT_OPEN_BETS);
        return DEFAULT_OPEN_BETS.map((b) => ({ ...b }));
      }
    } catch (_) {
      /* ignore */
    }
    return readJsonList(OPEN_BETS_KEY, []);
  }

  function writeOpenBets(list) {
    writeJsonList(OPEN_BETS_KEY, list);
    emitMyBetsChange({ open: true });
  }

  function readSettledBets() {
    return readJsonList(SETTLED_BETS_KEY, []);
  }

  function writeSettledBets(list) {
    writeJsonList(SETTLED_BETS_KEY, list);
    emitMyBetsChange({ settled: true });
  }

  function formatCompactAmount(amount) {
    const n = Number(amount);
    if (!Number.isFinite(n)) return String(amount == null ? "0" : amount);
    return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, "").replace(/\.$/, "");
  }

  function esc(s) {
    return escapeHtml(s);
  }

  function openBetCardHtml(bet) {
    const id = esc(bet.id || "");
    const status = bet.status || "Unsettled";
    const eventName = bet.competition || bet.eventName || "";
    const betType = bet.betType || (bet.market === "Accumulator" ? "Accumulator" : "Single bet");
    const selection = bet.selection || bet.pick || "";
    const potential = bet.potentialWinnings || bet.maxPayout || "0.00";
    const displayTime = String(bet.placedTime || "").split(":").slice(0, 2).join(":");
    const sell = Number(bet.sellValue ?? bet.cashOutValue);
    const canSell =
      bet.sellEligible !== false &&
      bet.cashOut !== false &&
      /^(unsettled|running|open|accepted)$/i.test(String(status)) &&
      Number.isFinite(sell) &&
      sell > 0;
    const sellActions = canSell
      ? `<div class="mybets-sell-row">` +
        `<button type="button" class="mybets-sell" data-mybets-sell="${id}">Sell for ${esc(formatCompactAmount(sell))} MYR</button>` +
        `</div>`
      : "";

    return (
      `<article class="mybets-card mybets-slip-card" data-mybets-id="${id}">` +
      `<header class="mybets-slip-card__head">Bet slip № ${id}</header>` +
      `<div class="mybets-slip-card__summary">` +
      `<div class="mybets-slip-card__row"><span>${esc(bet.placedDate || "")} (${esc(displayTime)})</span><span>${esc(status)}</span></div>` +
      `<div class="mybets-slip-card__row"><span>${esc(betType)}</span><strong>${esc(formatCompactAmount(bet.stake))} MYR</strong></div>` +
      `<div class="mybets-slip-card__row"><span>Potential winnings</span><strong>${esc(formatCompactAmount(potential))} MYR</strong></div>` +
      `</div>` +
      `<div class="mybets-slip-card__event">` +
      `<div class="mybets-slip-card__league">${esc(eventName)}</div>` +
      `<div class="mybets-slip-card__match">${esc(bet.match || "")}</div>` +
      `<div class="mybets-slip-card__selection"><span>${esc(formatCompactAmount(bet.odds))}</span> ${esc(selection)}</div>` +
      `<div class="mybets-slip-card__row mybets-slip-card__status"><span>Status</span><span>${esc(status)}</span></div>` +
      `</div>` +
      sellActions +
      `</article>`
    );
  }

  function settledBetCardHtml(bet) {
    const id = esc(bet.id || "");
    const status = bet.result || bet.status || "Settled";
    const selection = bet.selection || bet.pick || "";
    const potential = bet.potentialWinnings || bet.maxPayout || bet.payout || "0.00";
    const displayTime = String(bet.placedTime || "").split(":").slice(0, 2).join(":");
    return (
      `<article class="mybets-card mybets-slip-card mybets-card--settled" data-mybets-id="${id}">` +
      `<header class="mybets-slip-card__head">Bet slip № ${id}</header>` +
      `<div class="mybets-slip-card__summary">` +
      `<div class="mybets-slip-card__row"><span>${esc(bet.placedDate || "")} (${esc(displayTime)})</span><span>${esc(status)}</span></div>` +
      `<div class="mybets-slip-card__row"><span>Stake</span><strong>${esc(formatCompactAmount(bet.stake))} MYR</strong></div>` +
      `<div class="mybets-slip-card__row"><span>Payout</span><strong>${esc(formatCompactAmount(potential))} MYR</strong></div>` +
      `</div>` +
      `<div class="mybets-slip-card__event">` +
      `<div class="mybets-slip-card__match">${esc(bet.match || "")}</div>` +
      `<div class="mybets-slip-card__selection"><span>${esc(formatCompactAmount(bet.odds))}</span> ${esc(selection)}</div>` +
      `</div>` +
      `</article>`
    );
  }

  function emptyMyBetsHtml(tab) {
    if (tab === "history") {
      return (
        `<div class="mybets-empty mybets-empty--history">` +
        `<p class="bet-empty-text">There are no settled bet slips for the last session.</p>` +
        `</div>`
      );
    }
    return (
      `<div class="mybets-empty">` +
      `<p class="bet-empty-text">No open bets. Place a bet to see it here.</p>` +
      `</div>`
    );
  }

  function getActiveMyBetsTab(root) {
    const on = root?.querySelector?.(".mybets-subtab.active, .mybets-subtab.is-active");
    const key = on?.getAttribute?.("data-mybets-tab");
    return key === "history" ? "history" : "open";
  }

  function updateMyBetsBadges(root, openCount, historyCount) {
    const openN = Number(openCount) || 0;
    const histN = Number(historyCount) || 0;
    const scope = root || document;
    const openBadge = scope.querySelector("#mybets-open-count");
    const historyBadge = scope.querySelector("#mybets-history-count");
    if (openBadge) openBadge.textContent = String(openN);
    if (historyBadge) historyBadge.textContent = String(histN);
  }

  function paintMyBets(opts) {
    const force = !!(opts && opts.force);
    const open = readOpenBets();
    const settled = readSettledBets();
    if (window.__sbMyBetsOwnedByScript && !force) {
      updateMyBetsBadges(document, open.length, settled.length);
      return;
    }
    const roots = document.querySelectorAll("#my-bets-body, #right-drawer, .right-drawer, [data-bet-slip-root]");
    const painted = new Set();
    roots.forEach((root) => {
      const content =
        root.id === "mybets-content"
          ? root
          : root.querySelector("#mybets-content") || root.querySelector("[data-mybets-content]");
      if (!content || painted.has(content)) return;
      painted.add(content);
      const scope = content.closest("#my-bets-body") || root;
      const tab = getActiveMyBetsTab(scope);
      const list = tab === "history" ? settled : open;
      if (!list.length) {
        content.innerHTML = emptyMyBetsHtml(tab);
      } else {
        content.innerHTML =
          `<div class="mybets-cards">${list
            .map((b) => (tab === "history" ? settledBetCardHtml(b) : openBetCardHtml(b)))
            .join("")}</div>`;
      }
      updateMyBetsBadges(scope, open.length, settled.length);
    });
    updateMyBetsBadges(document, open.length, settled.length);
  }

  function wireDomOnce() {
    if (document.documentElement.dataset.sbBetSlipStoreWired === "1") return;
    document.documentElement.dataset.sbBetSlipStoreWired = "1";

    document.addEventListener("click", (e) => {
      const sub = e.target.closest("[data-mybets-tab]");
      if (sub && !window.__sbMyBetsOwnedByScript) {
        const root = sub.closest("#my-bets-body, #right-drawer, .right-drawer, [data-bet-slip-root]") || document;
        root.querySelectorAll("[data-mybets-tab]").forEach((t) => {
          const on = t === sub;
          t.classList.toggle("active", on);
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        paintMyBets({ force: true });
      }

      /* When script.js owns interactions, leave remove/clear to it */
      if (window.__sbBetSlipOwnedByScript) return;

      const removeBtn = e.target.closest("[data-remove]");
      if (removeBtn) {
        e.preventDefault();
        remove(removeBtn.getAttribute("data-remove"));
        paint({ force: true });
        return;
      }
      if (e.target.closest("#clear-bets")) {
        e.preventDefault();
        clear();
        paint({ force: true });
      }
    });

    window.addEventListener(CHANGE_EVENT, () => {
      if (!window.__sbBetSlipOwnedByScript) paint();
      else syncBadge();
    });
    window.addEventListener(MYBETS_CHANGE_EVENT, () => {
      if (!window.__sbMyBetsOwnedByScript) paintMyBets({ force: true });
      else updateMyBetsBadges(document, readOpenBets().length, readSettledBets().length);
    });
    window.addEventListener("storage", (e) => {
      if (e.key === OPEN_BETS_KEY || e.key === SETTLED_BETS_KEY) {
        if (!window.__sbMyBetsOwnedByScript) paintMyBets({ force: true });
      }
    });
  }

  window.SbBetSlipStore = {
    STORAGE_KEY,
    CHANGE_EVENT,
    OPEN_BETS_KEY,
    SETTLED_BETS_KEY,
    MYBETS_CHANGE_EVENT,
    read,
    write,
    toggle,
    remove,
    clear,
    has,
    count,
    productOdds,
    formatOdd,
    paint,
    syncBadge,
    subscribe,
    eventKey,
    readOpenBets,
    writeOpenBets,
    readSettledBets,
    writeSettledBets,
    paintMyBets,
  };

  wireDomOnce();
})();
