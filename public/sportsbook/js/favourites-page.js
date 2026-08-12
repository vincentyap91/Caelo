(() => {
  function withSportsbookPath(src) {
    if (!src) return "/sportsbook/assets/icons/sport-esports.svg";
    if (/^(https?:|data:|\/)/i.test(src)) return src;
    return `/sportsbook/${src.replace(/^\.\//, "")}`;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function scoreHtml(score) {
    if (score === null || score === undefined || score === "") return "";
    return `<span class="fv-card__score">${escapeHtml(score)}</span>`;
  }

  function cardHtml(event) {
    const stream = event.hasStream
      ? `<button type="button" class="fv-card__stream" data-toast="Live stream coming soon" aria-label="Watch stream">
          <img src="/sportsbook/assets/icons/nav-stream.svg" alt="" width="14" height="14" />
        </button>`
      : "";

    const homeScore = event.homeScore != null ? event.homeScore : "";
    const awayScore = event.awayScore != null ? event.awayScore : "";
    const showScores = event.scope === "live" || homeScore !== "" || awayScore !== "";

    return `<article class="fv-card" data-fav-event
      data-event-id="${escapeHtml(event.id)}"
      data-event-scope="${escapeHtml(event.scope || "sports")}"
    >
      <div class="fv-card__top">
        <div class="fv-card__meta">
          <img class="fv-card__sport" src="${escapeHtml(withSportsbookPath(event.sportIcon))}" alt="" width="16" height="16" />
          <span class="fv-card__status">${escapeHtml(event.time || "")}</span>
        </div>
        <div class="fv-card__actions">
          ${stream}
          <button type="button" class="fv-card__more" data-event-info="${escapeHtml(event.id)}" aria-label="Event info" aria-haspopup="dialog">
            <img src="/sportsbook/assets/icons/icon-more.svg" alt="" width="14" height="14" onerror="this.style.display='none';this.parentElement.textContent='⋯'" />
          </button>
        </div>
      </div>
      <a href="#" class="fv-card__league">${escapeHtml(event.league || "")}</a>
      <div class="fv-card__teams">
        <div class="fv-card__row">
          <span class="fv-card__team">
            <img src="${escapeHtml(withSportsbookPath(event.homeLogo || "assets/images/partners/partner-barcelona.webp"))}" alt="" width="20" height="20" />
            ${escapeHtml(event.home || "")}
          </span>
          ${showScores ? scoreHtml(homeScore === "" ? "—" : homeScore) : ""}
        </div>
        <div class="fv-card__row">
          <span class="fv-card__team">
            <img src="${escapeHtml(withSportsbookPath(event.awayLogo || "assets/images/partners/partner-psg.webp"))}" alt="" width="20" height="20" />
            ${escapeHtml(event.away || "")}
          </span>
          ${showScores ? scoreHtml(awayScore === "" ? "—" : awayScore) : ""}
        </div>
      </div>
      ${event.note ? `<p class="fv-card__note">${escapeHtml(event.note)}</p>` : ""}
    </article>`;
  }

  function init() {
    if (document.body.getAttribute("data-page") !== "favourites") return;
    const api = window.SbFavourites;
    if (!api) return;

    api.ensureDemo();

    const listEl = document.getElementById("fv-list");
    const emptyEl = document.getElementById("fv-empty");
    let tab = "live";

    document.querySelectorAll("[data-fv-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        tab = btn.getAttribute("data-fv-tab") || "live";
        document.querySelectorAll("[data-fv-tab]").forEach((t) => {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        render();
      });
    });

    document.querySelectorAll("[data-fv-acc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = document.getElementById(btn.getAttribute("aria-controls") || "");
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        if (panel) panel.hidden = open;
      });
    });

    document.addEventListener("click", (e) => {
      const historyBtn = e.target.closest("[data-fv-bet-history]");
      if (historyBtn) {
        e.preventDefault();
        if (typeof window.openBetHistoryPanel === "function") {
          window.openBetHistoryPanel();
        } else {
          showToast("Bet history");
        }
        return;
      }

      const toastBtn = e.target.closest("[data-toast]");
      if (toastBtn) {
        e.preventDefault();
        const msg = toastBtn.getAttribute("data-toast");
        const el = document.getElementById("fv-toast");
        if (!el || !msg) return;
        el.textContent = msg;
        el.hidden = false;
        window.clearTimeout(el._t);
        el._t = window.setTimeout(() => {
          el.hidden = true;
        }, 1800);
        return;
      }

      if (e.target.closest("a, button")) return;
      const card = e.target.closest("[data-fav-event][data-event-id]");
      if (!card) return;
      const id = card.getAttribute("data-event-id");
      const event = (api.getById && api.getById(id)) || { id };
      try {
        sessionStorage.setItem(
          "ds-event-pending",
          JSON.stringify({
            id: event.id,
            home: event.home || "",
            away: event.away || "",
            league: event.league || "",
            sport: event.sport || "football",
            sportIcon: withSportsbookPath(event.sportIcon || "assets/icons/sport-football.svg"),
            homeLogo: withSportsbookPath(event.homeLogo || ""),
            awayLogo: withSportsbookPath(event.awayLogo || ""),
            live: event.scope === "live",
            scoreH: event.homeScore,
            scoreA: event.awayScore,
            clock: event.time || "",
          })
        );
      } catch (_) {
        /* ignore */
      }
      const href = `/sportsbook/event?id=${encodeURIComponent(id)}`;
      if (typeof window.__caeloSportsbookNavigate === "function") {
        window.__caeloSportsbookNavigate("sportsbook-event", href);
      } else {
        window.location.href = href;
      }
    });

    function showToast(msg) {
      const el = document.getElementById("fv-toast") || document.getElementById("toast");
      if (!el || !msg) return;
      el.textContent = msg;
      el.hidden = false;
      window.clearTimeout(el._t);
      el._t = window.setTimeout(() => {
        el.hidden = true;
      }, 1800);
    }

    function render() {
      const all = api.readAll();
      const filtered = all.filter((item) => {
        if (tab === "live") return item.scope === "live";
        return item.scope !== "live";
      });

      if (!filtered.length) {
        if (listEl) {
          listEl.hidden = true;
          listEl.innerHTML = "";
        }
        if (emptyEl) emptyEl.hidden = false;
        return;
      }

      if (emptyEl) emptyEl.hidden = true;
      if (listEl) {
        listEl.hidden = false;
        listEl.innerHTML = filtered.map(cardHtml).join("");
      }
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
