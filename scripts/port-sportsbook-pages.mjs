/**
 * Port 1xbet sportsbook page shells into Caelo partials.
 * Extracts sportsbook-layout (+ nt-mobile-mode when present) and remaps paths.
 */
import fs from "fs";
import path from "path";

const SRC = "C:/Users/vince/OneDrive/Desktop/1xbet";
const DEST = "C:/Users/vince/OneDrive/Desktop/Caelo/public/sportsbook";

const PAGES = [
  "national-team",
  "live-national-team",
  "sports",
  "long-term-bets",
  "big-tournaments",
  "marble-live",
  "fast-bet",
];

const PAGE_ROUTES = {
  "index.html": "/sportsbook",
  "national-team.html": "/sportsbook/national-team",
  "live-national-team.html": "/sportsbook/live-national-team",
  "sports.html": "/sportsbook/sports",
  "long-term-bets.html": "/sportsbook/long-term-bets",
  "big-tournaments.html": "/sportsbook/big-tournaments",
  "marble-live.html": "/sportsbook/marble-live",
  "fast-bet.html": "/sportsbook/fast-bet",
  "event.html": "/sportsbook/event",
  "search.html": "/sportsbook",
  "favourites.html": "/sportsbook",
  "multi-live.html": "/sportsbook",
  "accumulators.html": "/sportsbook/sports",
};

function extractBalancedDiv(html, startIdx) {
  let i = startIdx;
  let depth = 0;
  while (i < html.length) {
    const open = html.indexOf("<div", i);
    const close = html.indexOf("</div>", i);
    if (close === -1) throw new Error("Unbalanced div");
    if (open !== -1 && open < close) {
      depth += 1;
      i = open + 4;
    } else {
      depth -= 1;
      i = close + 6;
      if (depth === 0) return html.slice(startIdx, i);
    }
  }
  throw new Error("Unbalanced div EOF");
}

function extractNav(html, className) {
  const re = new RegExp(`<nav\\s+class="${className}"[\\s\\S]*?<\\/nav>`, "i");
  const m = html.match(re);
  return m ? m[0] : "";
}

function remapHtml(html) {
  let out = html;

  // src/href relative assets
  out = out.replace(
    /\b(src|href|poster)=(["'])(?!\/|https?:|data:|#|mailto:)([^"']+)\2/gi,
    (full, attr, q, p) => {
      // page links handled below
      if (/\.html(?:[?#]|$)/i.test(p) || p.startsWith("?")) return full;
      let cleaned = p.replace(/^\.\//, "").replace(/^\.\.\//, "");
      if (
        cleaned.startsWith("assets/") ||
        cleaned.startsWith("mobile/") ||
        cleaned.startsWith("css/") ||
        cleaned.startsWith("js/") ||
        cleaned.startsWith("partials/")
      ) {
        return `${attr}=${q}/sportsbook/${cleaned}${q}`;
      }
      return full;
    }
  );

  out = out.replace(/url\((['"]?)(?!\/|https?:|data:)([^'")]+)\1\)/gi, (full, q, p) => {
    let cleaned = p.replace(/^\.\.\//, "");
    if (cleaned.startsWith("assets/") || cleaned.startsWith("mobile/")) {
      return `url(${q}/sportsbook/${cleaned}${q})`;
    }
    return full;
  });

  // Page links (with optional query/hash)
  for (const [from, to] of Object.entries(PAGE_ROUTES)) {
    const esc = from.replace(".", "\\.");
    const re = new RegExp(`(href=["'])(?:\\.\\./)*${esc}([^"']*)(["'])`, "gi");
    out = out.replace(re, `$1${to}$2$3`);
  }

  // index.html#foo already covered; also bare "#live-events" stays

  // Add data-caelo-nav for sportsbook internal routes
  out = out.replace(
    /<a\b([^>]*?)href=(["'])(\/sportsbook(?:\/[a-z0-9\-]+)?)([^"']*)\2([^>]*)>/gi,
    (full, pre, q, route, rest, post) => {
      if (/\bdata-caelo-nav=/.test(full)) return full;
      const page =
        route === "/sportsbook"
          ? "sportsbook"
          : `sportsbook-${route.slice("/sportsbook/".length)}`;
      return `<a${pre}href=${q}${route}${rest}${q} data-caelo-nav="${page}"${post}>`;
    }
  );

  return out;
}

function remapCss(css) {
  return css.replace(/url\((['"]?)(?!\/|https?:|data:)([^'")]+)\1\)/gi, (full, q, p) => {
    let cleaned = p.replace(/^(\.\.\/)+/, "");
    // css files live in css/ so ../assets → assets
    if (cleaned.startsWith("assets/") || cleaned.startsWith("mobile/")) {
      return `url(${q}/sportsbook/${cleaned}${q})`;
    }
    // from mobile/css: ../../assets or ../assets
    if (cleaned.includes("assets/")) {
      const idx = cleaned.indexOf("assets/");
      return `url(${q}/sportsbook/${cleaned.slice(idx)}${q})`;
    }
    if (cleaned.includes("mobile/")) {
      const idx = cleaned.indexOf("mobile/");
      return `url(${q}/sportsbook/${cleaned.slice(idx)}${q})`;
    }
    return full;
  });
}

function copyFile(relFrom, relTo, { css = false } = {}) {
  const from = path.join(SRC, relFrom);
  const to = path.join(DEST, relTo);
  if (!fs.existsSync(from)) {
    console.warn("MISSING", from);
    return false;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  let body = fs.readFileSync(from);
  if (css || relFrom.endsWith(".css")) {
    const text = remapCss(body.toString("utf8"));
    fs.writeFileSync(to, text, "utf8");
  } else {
    fs.writeFileSync(to, body);
  }
  console.log("copied", relFrom, "->", relTo);
  return true;
}

function copyDir(relFrom, relTo) {
  const from = path.join(SRC, relFrom);
  const to = path.join(DEST, relTo);
  if (!fs.existsSync(from)) {
    console.warn("MISSING DIR", from);
    return;
  }
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    const s = path.join(from, name);
    const d = path.join(to, name);
    if (fs.statSync(s).isDirectory()) copyDir(path.join(relFrom, name), path.join(relTo, name));
    else fs.copyFileSync(s, d);
  }
  console.log("copied dir", relFrom, "->", relTo);
}

for (const page of PAGES) {
  const html = fs.readFileSync(path.join(SRC, `${page}.html`), "utf8");
  const startMatch = html.match(/<div\s+class="[^"]*sportsbook-layout[^"]*"/i);
  if (!startMatch) throw new Error(`No sportsbook-layout in ${page}`);
  const start = startMatch.index;
  let layout = extractBalancedDiv(html, start);

  // Append nt-mobile-mode for national team pages (lives outside layout in 1xbet)
  if (page === "national-team" || page === "live-national-team") {
    const mode = extractNav(html, "nt-mobile-mode");
    if (mode) layout += "\n" + mode + "\n";
  }

  layout = remapHtml(layout);
  const outPath = path.join(DEST, "partials", `sportsbook-${page}-layout.html`);
  fs.writeFileSync(outPath, layout + "\n", "utf8");
  console.log("wrote", outPath, `(${layout.length} chars)`);
}

// CSS / JS
[
  "css/long-term-bets.css",
  "css/big-tournaments.css",
  "css/fast-bet.css",
  "js/long-term-bets.js",
  "js/big-tournaments.js",
  "js/fast-bet.js",
  "mobile/css/mobile-big-tournaments.css",
  "mobile/js/mobile-big-tournaments.js",
  "mobile/css/mobile-long-term.css",
  "mobile/js/mobile-long-term.js",
  "mobile/js/mobile-markets-filter.js",
  "mobile/css/mobile-markets-filter.css",
  "partials/bt-mobile-board.html",
].forEach((rel) => copyFile(rel, rel, { css: rel.endsWith(".css") }));

copyDir("assets/images/fast-bet", "assets/images/fast-bet");
copyDir("mobile/assets/banners", "mobile/assets/banners");

// Remap bt-mobile-board partial if present
const btBoard = path.join(DEST, "partials/bt-mobile-board.html");
if (fs.existsSync(btBoard)) {
  fs.writeFileSync(btBoard, remapHtml(fs.readFileSync(btBoard, "utf8")), "utf8");
  console.log("remapped bt-mobile-board.html");
}

console.log("Done.");
