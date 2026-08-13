/* =========================================================
   WC2026 / MSI — page UI only (tabs, markets, filters).
   Odds go through shared [data-odd] + script.js / SbBetSlipStore.
   ========================================================= */

(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function pageRoot() {
    return document.getElementById("wc-match") || document.getElementById("msi-match");
  }

  function layoutRoot() {
    return document.querySelector(".wc-layout, .msi-layout");
  }

  function bind() {
    if (window.__teTopEventsAc) {
      try {
        window.__teTopEventsAc.abort();
      } catch (_) {
        /* ignore */
      }
    }
    if (!pageRoot() || !layoutRoot()) return;

    const ac = new AbortController();
    window.__teTopEventsAc = ac;
    const { signal } = ac;

    document.addEventListener(
      "click",
      (event) => {
        if (!pageRoot()) return;

        const tab = event.target.closest(".wc-tab[data-tab-target]");
        if (tab) {
          const tabs = tab.closest(".wc-tabs");
          const panelRoot = tabs?.parentElement;
          const target = tab.getAttribute("data-tab-target");
          if (!tabs || !panelRoot || !target) return;
          $$(".wc-tab", tabs).forEach((item) => {
            const on = item === tab;
            item.classList.toggle("active", on);
            item.setAttribute("aria-selected", on ? "true" : "false");
          });
          $$("[data-tab-panel]", panelRoot).forEach((panel) => {
            panel.hidden = panel.id !== target;
          });
          return;
        }

        const head = event.target.closest(".wc-market-head");
        if (head) {
          const market = head.closest(".wc-market");
          if (!market) return;
          const body = $(".wc-market-body", market);
          const open = !market.classList.contains("open");
          market.classList.toggle("open", open);
          head.setAttribute("aria-expanded", open ? "true" : "false");
          if (body) body.hidden = !open;
          return;
        }

        if (event.target.closest(".wc-mkt-collapse")) {
          $$(".wc-market", layoutRoot()).forEach((market) => {
            market.classList.remove("open");
            const mHead = $(".wc-market-head", market);
            const mBody = $(".wc-market-body", market);
            if (mHead) mHead.setAttribute("aria-expanded", "false");
            if (mBody) mBody.hidden = true;
          });
          return;
        }

        const chip = event.target.closest(".wc-mkt-chip, .wc-filter");
        if (chip) {
          const group = chip.parentElement;
          if (!group) return;
          $$(chip.classList.contains("wc-filter") ? ".wc-filter" : ".wc-mkt-chip", group).forEach((item) => {
            item.classList.toggle("active", item === chip);
          });
          return;
        }

        const fav = event.target.closest(".wc-fav-btn");
        if (fav) {
          const on = fav.classList.toggle("is-active");
          fav.setAttribute("aria-pressed", on ? "true" : "false");
        }
      },
      { signal }
    );

    $$(".wc-mkt-input", layoutRoot()).forEach((input) => {
      input.addEventListener(
        "input",
        () => {
          const q = input.value.trim().toLowerCase();
          const list = input.closest(".wc-markets-card")?.querySelector(".wc-markets-list");
          if (!list) return;
          $$(".wc-market", list).forEach((market) => {
            const label = ($(".wc-market-head", market)?.textContent || "").toLowerCase();
            market.hidden = Boolean(q) && !label.includes(q);
          });
        },
        { signal }
      );
    });
  }

  function init() {
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
