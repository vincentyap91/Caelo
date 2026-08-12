/**
 * Shared sportsbook mobile bet slip (homepage bottom-sheet UX).
 * Injects partials/mobile-bet-slip.html when #right-sidebar is missing.
 * Used across all sportsbook modes (home + inner pages).
 */
(function () {
  "use strict";

  const SCRIPT_EL =
    document.currentScript ||
    document.querySelector('script[src*="shared-bet-slip.js"]');

  let injectPromise = null;
  let chromeWired = false;

  function rootBase() {
    if (SCRIPT_EL && SCRIPT_EL.src) {
      try {
        return new URL("../", SCRIPT_EL.src).href;
      } catch (_) {
        /* fall through */
      }
    }
    return "/sportsbook/";
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function hostEl() {
    return (
      document.querySelector('[data-sportsbook-shell="1"]') ||
      document.querySelector(".sportsbook-root") ||
      document.body
    );
  }

  function ensureDrawerBackdrop() {
    let backdrop = document.getElementById("drawer-backdrop");
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    backdrop.id = "drawer-backdrop";
    backdrop.hidden = true;
    const host = hostEl();
    host.appendChild(backdrop);
    return backdrop;
  }

  function setBackdrop(visible) {
    const backdrop = ensureDrawerBackdrop();
    backdrop.hidden = !visible;
    backdrop.classList.toggle("is-visible", visible);
    document.body.classList.toggle("drawer-open", visible);
  }

  function selectSlipTab(root) {
    const scope = root || document;
    const tabs = scope.querySelectorAll("[data-bet-tab]");
    const slipBody =
      scope.querySelector("#bet-slip-body") || document.getElementById("bet-slip-body");
    const myBody =
      scope.querySelector("#my-bets-body") || document.getElementById("my-bets-body");
    tabs.forEach((tab) => {
      const on = tab.getAttribute("data-bet-tab") === "slip";
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (slipBody) slipBody.hidden = false;
    if (myBody) myBody.hidden = true;
  }

  function refreshSlipRecords() {
    if (typeof window.sbHydrateBetSlip === "function") {
      window.sbHydrateBetSlip();
    } else if (typeof window.SbBetSlipStore?.paint === "function") {
      window.SbBetSlipStore.paint({ force: true });
    }
    if (typeof window.SbBetSlipStore?.paintMyBets === "function") {
      window.SbBetSlipStore.paintMyBets({ force: !window.__sbMyBetsOwnedByScript });
    }
  }

  function closeSlip() {
    document.getElementById("right-sidebar")?.classList.remove("is-open");
    document.getElementById("mobile-betslip-btn")?.setAttribute("aria-expanded", "false");
    setBackdrop(false);
    if (typeof window.syncMobileBetCount === "function") window.syncMobileBetCount();
    else if (typeof window.SbBetSlipStore?.syncBadge === "function") {
      window.SbBetSlipStore.syncBadge();
    }
  }

  function openSlip(right) {
    if (!isMobileViewport()) return;
    const el = right || document.getElementById("right-sidebar");
    if (!el) return;
    normalizeSheet(el);
    selectSlipTab(el);
    refreshSlipRecords();
    el.classList.remove("collapsed");
    document.querySelector(".sportsbook-layout")?.classList.remove("right-collapsed");
    el.classList.add("is-open");
    document.getElementById("mobile-betslip-btn")?.setAttribute("aria-expanded", "true");
    setBackdrop(true);
    if (typeof window.syncMobileBetCount === "function") window.syncMobileBetCount();
    else if (typeof window.SbBetSlipStore?.syncBadge === "function") {
      window.SbBetSlipStore.syncBadge();
    }
  }

  function normalizeMobileClose(root) {
    if (!root) return;
    const btn = root.querySelector("#right-drawer-close");
    if (!btn) return;
    if (btn.querySelector(".mobile-drawer-close-title") && btn.querySelector(".mobile-drawer-handle")) {
      return;
    }
    btn.setAttribute("aria-label", "Close bet slip");
    btn.innerHTML =
      '<span class="mobile-drawer-handle" aria-hidden="true"></span>' +
      '<span class="mobile-drawer-close-title">Bet slip</span>' +
      '<span class="mobile-drawer-close-action">Close</span>';
  }

  function hydrateEmptyCta() {
    if (typeof window.DsBetSlipGenerator?.ensureEmptyCta === "function") {
      window.DsBetSlipGenerator.ensureEmptyCta();
    }
  }

  function isLoggedIn() {
    try {
      if (sessionStorage.getItem("1xbet_logged_in") === "1") return true;
    } catch (_) {
      /* ignore */
    }
    return document.body.classList.contains("is-logged-in");
  }

  function ensureMyBetsLoggedInShell(body) {
    if (!body) return;
    let guest = body.querySelector(".mybets-guest");
    let app = body.querySelector(".mybets-app");
    if (!guest) {
      guest = document.createElement("div");
      guest.className = "mybets-guest";
      guest.id = "mybets-guest";
      guest.innerHTML =
        '<div class="mybets-guest-card"><p class="bet-empty-text">Please log in to your account or register</p></div>' +
        '<button type="button" class="btn-slip-reg mybets-guest-cta" data-auth-open="register" data-caelo-nav="register">Registration</button>';
      body.prepend(guest);
    }
    if (!app) {
      app = document.createElement("div");
      app.className = "mybets-app";
      app.id = "mybets-app";
      app.hidden = true;
      body.appendChild(app);
    }
    /* Full Active/History chrome so SKIP pages can paint the same open bets as home */
    if (!app.querySelector("#mybets-content")) {
      app.innerHTML =
        '<div class="mybets-subtabs" role="tablist" aria-label="My bets views">' +
        '<button type="button" class="mybets-subtab active" role="tab" aria-selected="true" data-mybets-tab="open">' +
        'Active bets <span class="mybets-badge" id="mybets-open-count">0</span>' +
        "</button>" +
        '<button type="button" class="mybets-subtab" role="tab" aria-selected="false" data-mybets-tab="history">' +
        'History <span class="mybets-badge" id="mybets-history-count">0</span>' +
        "</button>" +
        "</div>" +
        '<div class="mybets-content" id="mybets-content"></div>' +
        '<p class="mybets-footer-note">All transactions are time stamped at GMT-4.</p>';
    }
    if (isLoggedIn() && typeof window.SbBetSlipStore?.paintMyBets === "function") {
      window.SbBetSlipStore.paintMyBets({ force: !window.__sbMyBetsOwnedByScript });
    }
  }

  /**
   * Auth-aware bet slip chrome for all sportsbook modes (incl. pages that skip script.js).
   * script.js may replace this with a richer implementation when present.
   */
  function syncBetSlipAuthUi() {
    const loggedIn = isLoggedIn();
    const panel = document.querySelector(".bet-slip-panel");
    if (panel) panel.classList.toggle("is-logged-in", loggedIn);

    const emptyText = document.querySelector("#bet-empty .bet-empty-text");
    if (emptyText && !document.querySelector("#bet-empty .bet-empty-gen") && isMobileViewport()) {
      if (!emptyText.dataset.desktopEmptyCopy) {
        emptyText.dataset.desktopEmptyCopy = emptyText.innerHTML;
      }
      emptyText.textContent = loggedIn
        ? "Your bet slip is empty. Add an event to place a bet"
        : "Register to place a bet";
    }

    const wallet = window.DsWallet;
    const balance = loggedIn && wallet ? Number(wallet.get()) || 0 : 0;
    const balLabel = wallet && typeof wallet.format === "function" ? wallet.format(balance) : String(balance || 0);

    const meta = document.getElementById("ticket-account-meta");
    if (meta) {
      meta.classList.toggle("is-guest", !loggedIn);
      const balanceRow = meta.querySelector('[data-ticket-meta="balance"]');
      const advRow = meta.querySelector('[data-ticket-meta="advancebet"]');
      if (balanceRow) {
        balanceRow.hidden = !loggedIn;
        const strong = balanceRow.querySelector("strong");
        if (strong) strong.textContent = balLabel + " MYR";
      }
      if (advRow) advRow.hidden = !loggedIn;
    }

    const place = document.getElementById("place-bet");
    if (place) {
      if (!loggedIn) {
        place.textContent = "Registration";
        place.dataset.cta = "register";
      } else if (balance <= 0) {
        place.textContent = "Deposit";
        place.dataset.cta = "deposit";
      } else {
        place.textContent = "Place Bet";
        place.dataset.cta = "place";
      }
    }

    const list = document.getElementById("bet-list");
    const hasBets = !!(list && !list.hidden && list.children.length > 0);
    const regCta = document.getElementById("bet-reg-cta");
    if (regCta) regCta.hidden = loggedIn || hasBets;

    const myBody = document.getElementById("my-bets-body");
    if (myBody) {
      ensureMyBetsLoggedInShell(myBody);
      const guest = myBody.querySelector(".mybets-guest");
      const app = myBody.querySelector(".mybets-app");
      if (guest) guest.hidden = loggedIn;
      if (app) app.hidden = !loggedIn;
      myBody.classList.toggle("is-guest", !loggedIn);
    }
  }

  window.syncBetSlipAuthUi = syncBetSlipAuthUi;

  function normalizeSheet(root) {
    if (!root) return;
    normalizeMobileClose(root);
    wireBetTabs(root);
    hydrateEmptyCta();
    syncBetSlipAuthUi();
    if (typeof window.SbBetSlipStore?.paint === "function") {
      window.SbBetSlipStore.paint();
    }
    if (typeof window.SbBetSlipStore?.paintMyBets === "function") {
      window.SbBetSlipStore.paintMyBets({ force: !window.__sbMyBetsOwnedByScript });
    }
  }

  function wireBetTabs(root) {
    if (!root || root.dataset.sharedTabsWired === "1") return;
    root.dataset.sharedTabsWired = "1";
    const tabs = root.querySelectorAll("[data-bet-tab]");
    const slipBody = root.querySelector("#bet-slip-body");
    const myBody = root.querySelector("#my-bets-body");
    if (!tabs.length || !slipBody) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const which = tab.getAttribute("data-bet-tab");
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        slipBody.hidden = which !== "slip";
        if (myBody) myBody.hidden = which !== "mybets";
        if (which === "mybets") {
          syncBetSlipAuthUi();
          if (typeof window.SbBetSlipStore?.paintMyBets === "function") {
            window.SbBetSlipStore.paintMyBets({ force: !window.__sbMyBetsOwnedByScript });
          }
        } else if (which === "slip") {
          refreshSlipRecords();
        }
      });
    });
  }

  function wireChrome() {
    if (chromeWired) return;
    chromeWired = true;

    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest("#right-drawer-close");
      if (closeBtn) {
        e.preventDefault();
        closeSlip();
        return;
      }
      if (e.target.closest("#drawer-backdrop")) {
        closeSlip();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (document.getElementById("right-sidebar")?.classList.contains("is-open")) {
        closeSlip();
      }
    });
  }

  function removeStaleInjected() {
    document.querySelectorAll('[data-shared-bet-slip="1"]').forEach((el) => {
      if (!document.getElementById("right-sidebar") || el.id !== "right-sidebar") {
        /* keep single #right-sidebar handled below */
      }
    });
    const slips = document.querySelectorAll("#right-sidebar");
    if (slips.length <= 1) return;
    slips.forEach((el, i) => {
      if (i === 0) return;
      if (el.getAttribute("data-shared-bet-slip") === "1") el.remove();
    });
  }

  function ensureRightSidebar() {
    removeStaleInjected();

    const existing = document.getElementById("right-sidebar");
    if (existing) {
      wireChrome();
      normalizeSheet(existing);
      return Promise.resolve(existing);
    }

    if (injectPromise) return injectPromise;

    ensureDrawerBackdrop();
    const url = `${rootBase()}partials/mobile-bet-slip.html`;

    injectPromise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`shared bet slip HTTP ${res.status}`);
        return res.text();
      })
      .then((html) => {
        if (document.getElementById("right-sidebar")) {
          return document.getElementById("right-sidebar");
        }
        const wrap = document.createElement("div");
        wrap.innerHTML = html.trim();
        const aside = wrap.querySelector("#right-sidebar") || wrap.firstElementChild;
        if (!aside) throw new Error("shared bet slip root missing");
        hostEl().appendChild(aside);
        wireChrome();
        normalizeSheet(aside);
        return aside;
      })
      .catch((err) => {
        console.warn("[SharedBetSlip] Failed to load shared bet slip:", err);
        injectPromise = null;
        return null;
      });

    return injectPromise;
  }

  function toggle() {
    if (!isMobileViewport()) return Promise.resolve(null);
    return ensureRightSidebar().then((right) => {
      if (!right) return null;
      if (right.classList.contains("is-open")) {
        closeSlip();
      } else {
        openSlip(right);
      }
      return right;
    });
  }

  window.SharedBetSlip = {
    ensure: ensureRightSidebar,
    open: () =>
      ensureRightSidebar().then((r) => {
        openSlip(r);
        return r;
      }),
    close: closeSlip,
    toggle,
    selectSlipTab,
    refresh: refreshSlipRecords,
  };

  function prefetchIfNeeded() {
    if (document.getElementById("right-sidebar")) {
      wireChrome();
      normalizeSheet(document.getElementById("right-sidebar"));
      return;
    }
    if (!document.querySelector(".mobile-tabbar, [data-sportsbook-shell]")) return;
    ensureRightSidebar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prefetchIfNeeded);
  } else {
    prefetchIfNeeded();
  }
})();
