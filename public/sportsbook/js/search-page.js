(() => {
  const SAMPLE = [
    {
      id: "se-ucl-psg-dortmund",
      sport: "Football",
      sportIcon: "/sportsbook/assets/icons/sport-football.svg",
      league: "UEFA Champions League",
      scope: "line",
      home: "Paris Saint-Germain",
      homeLogo: "/sportsbook/assets/images/mobile-home/teams/team-01.webp",
      away: "Borussia Dortmund",
      awayLogo: "/sportsbook/assets/images/mobile-home/teams/team-02.webp",
      meta: "League Stage · 22/07 21:00",
      odds: [
        { lab: "1", market: "1X2", selection: "1", val: 1.85 },
        { lab: "X", market: "1X2", selection: "X", val: 3.4 },
        { lab: "2", market: "1X2", selection: "2", val: 3.25 },
        { lab: "TOTAL", market: "Total", selection: "Over", val: 1.95 },
      ],
    },
    {
      id: "se-ucl-copenhagen-city",
      sport: "Football",
      sportIcon: "/sportsbook/assets/icons/sport-football.svg",
      league: "UEFA Champions League",
      scope: "line",
      home: "Copenhagen",
      homeLogo: "/sportsbook/assets/images/mobile-home/teams/team-03.webp",
      away: "Manchester City",
      awayLogo: "/sportsbook/assets/images/mobile-home/teams/team-04.webp",
      meta: "13.02, 21:00",
      odds: [
        { lab: "1", market: "1X2", selection: "1", val: 11.5 },
        { lab: "X", market: "1X2", selection: "X", val: 7.1 },
        { lab: "2", market: "1X2", selection: "2", val: 1.25 },
        { lab: "TOTAL", market: "Total", selection: "Over", val: 1.88 },
      ],
    },
    {
      id: "se-laliga-rm-barca",
      sport: "Football",
      sportIcon: "/sportsbook/assets/icons/sport-football.svg",
      league: "Spain. La Liga",
      scope: "line",
      home: "Real Madrid",
      homeLogo: "/sportsbook/assets/images/mobile-home/teams/team-05.webp",
      away: "Barcelona",
      awayLogo: "/sportsbook/assets/images/mobile-home/teams/team-06.webp",
      meta: "Round 1 · 23/07 20:00",
      odds: [
        { lab: "1", market: "1X2", selection: "1", val: 2.2 },
        { lab: "X", market: "1X2", selection: "X", val: 3.5 },
        { lab: "2", market: "1X2", selection: "2", val: 3.15 },
        { lab: "TOTAL", market: "Total", selection: "Over", val: 1.9 },
      ],
    },
    {
      id: "se-cs2-navi-vitality",
      sport: "Esports",
      sportIcon: "/sportsbook/assets/icons/sport-esports.svg",
      league: "CS2. ESL Pro League",
      scope: "cyber",
      home: "Natus Vincere",
      homeLogo: "/sportsbook/assets/images/mobile-home/teams/team-07.webp",
      away: "Vitality",
      awayLogo: "/sportsbook/assets/images/mobile-home/teams/team-08.webp",
      meta: "Bo3 · 21/07 19:00",
      odds: [
        { lab: "1", market: "1X2", selection: "1", val: 1.72 },
        { lab: "2", market: "1X2", selection: "2", val: 2.05 },
        { lab: "TOTAL", market: "Total", selection: "Over", val: 1.85 },
        { lab: "HANDICAP", market: "Handicap", selection: "1", val: 1.9 },
      ],
    },
    {
      id: "se-epl-arsenal-chelsea",
      sport: "Football",
      sportIcon: "/sportsbook/assets/icons/sport-football.svg",
      league: "England. Premier League",
      scope: "live",
      home: "Arsenal",
      homeLogo: "/sportsbook/assets/images/mobile-home/teams/team-09.webp",
      away: "Chelsea",
      awayLogo: "/sportsbook/assets/images/mobile-home/teams/team-10.webp",
      meta: "LIVE · 67′",
      odds: [
        { lab: "1", market: "1X2", selection: "1", val: 1.95 },
        { lab: "X", market: "1X2", selection: "X", val: 3.2 },
        { lab: "2", market: "1X2", selection: "2", val: 3.8 },
        { lab: "TOTAL", market: "Total", selection: "Over", val: 1.7 },
      ],
    },
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const store = () => window.SbBetSlipStore;

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatOdd(v) {
    if (store()?.formatOdd) return store().formatOdd(v);
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? "");
    return String(n);
  }

  function showToast(msg) {
    const el = $("#se-toast") || $("#toast");
    if (!el || !msg) return;
    el.textContent = msg;
    el.hidden = false;
    window.clearTimeout(el._t);
    el._t = window.setTimeout(() => {
      el.hidden = true;
    }, 1800);
  }

  function slipItems() {
    return store()?.read?.() || [];
  }

  function matchesQuery(item, q, exact) {
    const hay = `${item.league} ${item.home} ${item.away} ${item.sport}`.toLowerCase();
    if (exact) {
      return (
        hay.split(/\s+/).includes(q) ||
        item.league.toLowerCase() === q ||
        item.home.toLowerCase() === q ||
        item.away.toLowerCase() === q
      );
    }
    return hay.includes(q);
  }

  function oddButton(match, odd) {
    if (odd == null || odd.val == null || !(Number(odd.val) > 0)) return "";
    const id = `${match.id}-${odd.market}-${odd.selection}`;
    const selected = slipItems().some((b) => b.id === id) ? " is-selected" : "";
    const payload = JSON.stringify({
      id,
      eventId: match.id,
      league: match.league,
      match: `${match.home} - ${match.away}`,
      market: odd.market,
      selection: odd.selection,
      odds: odd.val,
      home: match.home,
      away: match.away,
      homeLogo: match.homeLogo,
      awayLogo: match.awayLogo,
      sportIcon: match.sportIcon,
      live: match.scope === "live",
    }).replace(/"/g, "&quot;");
    return `<button type="button" class="se-odds__btn${selected}" data-odd="${payload}" aria-pressed="${selected ? "true" : "false"}"><span class="se-odds__lab">${escapeHtml(odd.lab)}</span><span class="se-odds__val">${escapeHtml(formatOdd(odd.val))}</span></button>`;
  }

  function renderList(items) {
    const list = $("#se-list");
    if (!list) return;

    if (!items.length) {
      list.innerHTML = `<p class="se-none">No events found</p>`;
      return;
    }

    const groups = new Map();
    items.forEach((item) => {
      const key = `${item.sport}::${item.league}`;
      if (!groups.has(key)) {
        groups.set(key, {
          sport: item.sport,
          sportIcon: item.sportIcon,
          league: item.league,
          matches: [],
        });
      }
      groups.get(key).matches.push(item);
    });

    list.innerHTML = Array.from(groups.values())
      .map((group) => {
        const matchesHtml = group.matches
          .map((m) => {
            const odds = (m.odds || []).map((o) => oddButton(m, o)).join("");
            return `<article class="se-match">
              <div class="se-match__teams">
                <p class="se-match__team"><img src="${escapeHtml(m.homeLogo)}" alt="" width="20" height="20" />${escapeHtml(m.home)}</p>
                <p class="se-match__team"><img src="${escapeHtml(m.awayLogo)}" alt="" width="20" height="20" />${escapeHtml(m.away)}</p>
              </div>
              <p class="se-match__meta">${escapeHtml(m.meta)}</p>
              <div class="se-match__odds">${odds}</div>
            </article>`;
          })
          .join("");

        return `<section class="se-group">
          <p class="se-group__sport"><img src="${escapeHtml(group.sportIcon)}" alt="" width="14" height="14" />${escapeHtml(group.sport)}</p>
          <div class="se-league">
            <button type="button" class="se-league__star" data-toast="Favourites" aria-label="Favourite">
              <img src="/sportsbook/mobile/assets/icons/sp-star.svg" alt="" width="16" height="16" />
            </button>
            <span class="se-league__name">${escapeHtml(group.league)}</span>
          </div>
          ${matchesHtml}
        </section>`;
      })
      .join("");
  }

  let tab = "all";
  let update = () => {};

  function initSearchPage() {
    if (document.body.getAttribute("data-page") !== "search") return;

    const input = $("#se-input");
    const clearBtn = $("#se-clear");
    const empty = $("#se-empty");
    const results = $("#se-results");
    const exactBtn = $("#se-exact");

    if (exactBtn) {
      exactBtn.addEventListener("click", () => {
        const on = exactBtn.getAttribute("aria-checked") !== "true";
        exactBtn.setAttribute("aria-checked", on ? "true" : "false");
        update();
      });
    }

    $$("[data-se-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        tab = btn.getAttribute("data-se-tab") || "all";
        $$("[data-se-tab]").forEach((t) => {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        update();
      });
    });

    document.addEventListener("click", (e) => {
      const oddBtn = e.target.closest(".se-odds__btn[data-odd]");
      if (oddBtn) {
        e.preventDefault();
        try {
          const data = JSON.parse(oddBtn.getAttribute("data-odd").replace(/&quot;/g, '"'));
          store()?.toggle?.(data);
          store()?.paint?.({ force: true });
          update();
        } catch (_) {
          /* ignore */
        }
        return;
      }

      const toastBtn = e.target.closest("[data-toast]");
      if (toastBtn && document.body.contains(toastBtn)) {
        e.preventDefault();
        const msg = toastBtn.getAttribute("data-toast");
        if (msg) showToast(msg);
      }
    });

    if (store()?.CHANGE_EVENT) {
      window.addEventListener(store().CHANGE_EVENT, () => update());
    }

    update = () => {
      const q = (input?.value || "").trim();
      const exact = exactBtn?.getAttribute("aria-checked") === "true";

      if (clearBtn) clearBtn.hidden = q.length === 0;

      if (q.length < 1) {
        if (empty) empty.hidden = false;
        if (results) results.hidden = true;
        return;
      }

      if (empty) empty.hidden = true;
      if (results) results.hidden = false;

      const needle = q.toLowerCase();
      const filtered = SAMPLE.filter((item) => {
        if (tab === "live" && item.scope !== "live") return false;
        if (tab === "line" && item.scope !== "line") return false;
        if (tab === "cyber" && item.scope !== "cyber") return false;
        return matchesQuery(item, needle, exact);
      });
      renderList(filtered);
    };

    input?.addEventListener("input", update);
    clearBtn?.addEventListener("click", () => {
      if (!input) return;
      input.value = "";
      input.focus();
      update();
    });

    const params = new URLSearchParams(window.location.search);
    const qParam = params.get("q");
    if (qParam && input) input.value = qParam;

    store()?.paint?.();
    update();
    window.setTimeout(() => input?.focus(), 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearchPage);
  } else {
    initSearchPage();
  }
})();
