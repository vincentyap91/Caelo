/**
 * Port 1xbet event.html match-details shell into public/sportsbook.
 * Run: node scripts/port-1xbet-event.mjs
 */
import fs from 'fs';
import path from 'path';

const SRC = 'C:/Users/Vincent/OneDrive/Desktop/1xbet';
const DST = path.resolve('public/sportsbook');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(from, to) {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

function rewriteAssetUrls(text) {
  return text
    .replace(/(src|href)=(["'])(assets\/[^"']+)\2/g, '$1=$2/sportsbook/$3$2')
    .replace(/(src|href)=(["'])(mobile\/[^"']+)\2/g, '$1=$2/sportsbook/$3$2')
    .replace(/url\((['"]?)(assets\/[^'")]+)\1\)/g, 'url($1/sportsbook/$2$1)')
    .replace(/url\((['"]?)(mobile\/[^'")]+)\1\)/g, 'url($1/sportsbook/$2$1)');
}

function rewriteCssUrls(css) {
  return css
    .replace(/url\(\s*(['"]?)(?:\.\.\/)?assets\//g, 'url($1/sportsbook/assets/')
    .replace(/url\(\s*(['"]?)(?:\.\.\/)?mobile\//g, 'url($1/sportsbook/mobile/');
}

ensureDir(path.join(DST, 'css'));
ensureDir(path.join(DST, 'js'));
ensureDir(path.join(DST, 'partials'));

copyFile(path.join(SRC, 'css/event.css'), path.join(DST, 'css/event.css'));
copyFile(path.join(SRC, 'css/multi-live.css'), path.join(DST, 'css/multi-live.css'));
copyFile(path.join(SRC, 'js/event.js'), path.join(DST, 'js/event.js'));

const html = fs.readFileSync(path.join(SRC, 'event.html'), 'utf8');
const start = html.indexOf('<div class="sportsbook-layout">');
const footerComment = html.indexOf('<!-- ========== FOOTER', start);
if (start < 0 || footerComment < 0) throw new Error('event sportsbook-layout markers not found');
const end = html.lastIndexOf('</div>', footerComment) + '</div>'.length;

let fragment = html.slice(start, end);
fragment = rewriteAssetUrls(fragment);
// SPA back targets
fragment = fragment.replace(
  /href="javascript:history\.back\(\)"/g,
  'href="/sportsbook"'
);
fragment = fragment.replace(/href="index\.html"/g, 'href="/sportsbook"');
fragment = fragment.replace(/href="multi-live\.html"/g, 'href="/sportsbook"');

fs.writeFileSync(path.join(DST, 'partials/sportsbook-event-layout.html'), fragment);

// Chrome: reuse homepage chrome if present; else extract from event.html
const chromePath = path.join(DST, 'partials/sportsbook-chrome.html');
if (!fs.existsSync(chromePath)) {
  const chromeStart = html.indexOf('<div class="drawer-backdrop"');
  const chromeEnd = html.indexOf('<script src="js/favourites-store.js"');
  if (chromeStart < 0 || chromeEnd < 0) throw new Error('event chrome markers not found');
  let chrome = html.slice(chromeStart, chromeEnd).trim() + '\n';
  chrome = rewriteAssetUrls(chrome);
  fs.writeFileSync(chromePath, chrome);
}

// CSS URL rewrite
for (const name of ['event.css', 'multi-live.css']) {
  const p = path.join(DST, 'css', name);
  let c = fs.readFileSync(p, 'utf8');
  c = rewriteCssUrls(c);
  fs.writeFileSync(p, c);
}

// event.js asset paths + SPA links
{
  const p = path.join(DST, 'js/event.js');
  let j = fs.readFileSync(p, 'utf8');
  j = j.replace(/(["'])(assets\/)/g, '$1/sportsbook/$2');
  j = j.replace(/(["'])(mobile\/assets\/)/g, '$1/sportsbook/$2');
  j = j.replace(/href="index\.html"/g, 'href="/sportsbook"');
  j = j.replace(/href="index\.html#live-events"/g, 'href="/sportsbook#live-events"');
  j = j.replace(
    /document\.title = ev\.home \+ " vs " \+ ev\.away \+ " — Event — 1xBet";/,
    'document.title = ev.home + " vs " + ev.away + " — Event — Caelo";'
  );
  fs.writeFileSync(p, j);
}

// Patch script.js openEventPage → SPA /sportsbook/event
{
  const p = path.join(DST, 'js/script.js');
  let j = fs.readFileSync(p, 'utf8');
  const before = j;
  j = j.replace(
    /window\.location\.href = `event\.html\?id=\$\{encodeURIComponent\(eventId\)\}`;/g,
    `(() => {
      const url = \`/sportsbook/event?id=\${encodeURIComponent(eventId)}\`;
      try {
        window.history.pushState({}, "", url);
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch (_) {
        window.location.href = url;
      }
    })();`
  );
  if (j === before) {
    console.warn('WARN: openEventPage href patch not applied (pattern missing)');
  }
  fs.writeFileSync(p, j);
}

// Collect + copy assets referenced by event layout / event.js
const refs = new Set();
const eventJs = fs.readFileSync(path.join(DST, 'js/event.js'), 'utf8');
const blobs = [fragment, eventJs];
for (const blob of blobs) {
  for (const m of blob.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const u = m[1].replace(/^\/sportsbook\//, '').split('?')[0];
    if (u.startsWith('assets/') || u.startsWith('mobile/assets/')) refs.add(u);
  }
  for (const m of blob.matchAll(/["']((?:\/sportsbook\/)?(?:assets|mobile\/assets)\/[^"']+)["']/g)) {
    const u = m[1].replace(/^\/sportsbook\//, '').split('?')[0];
    if (u.startsWith('assets/') || u.startsWith('mobile/assets/')) refs.add(u);
  }
}

let copied = 0;
const missing = [];
for (const rel of [...refs].sort()) {
  const from = path.join(SRC, rel);
  const to = path.join(DST, rel);
  if (!fs.existsSync(from)) {
    missing.push(rel);
    continue;
  }
  const st = fs.statSync(from);
  if (st.isDirectory()) continue;
  if (fs.existsSync(to)) continue;
  copyFile(from, to);
  copied++;
}

// Also copy te-* / ei-* icon dirs commonly needed by event board
const extraGlobs = [
  ['assets/icons', /^te-/],
  ['assets/icons/lnt', /./],
  ['mobile/assets/icons', /^ei-/],
  ['assets/images/mobile-home/teams', /./],
];
for (const [dir, re] of extraGlobs) {
  const fromDir = path.join(SRC, dir);
  if (!fs.existsSync(fromDir)) continue;
  for (const name of fs.readdirSync(fromDir)) {
    if (!re.test(name)) continue;
    const from = path.join(fromDir, name);
    if (!fs.statSync(from).isFile()) continue;
    const to = path.join(DST, dir, name);
    if (fs.existsSync(to)) continue;
    copyFile(from, to);
    copied++;
  }
}

console.log(
  JSON.stringify(
    {
      fragmentBytes: fragment.length,
      copied,
      missingCount: missing.length,
      missing: missing.slice(0, 30),
      hasEvBoard: /id="ev-board"/.test(fragment),
      hasEvTabs: /id="ev-tabs"/.test(fragment),
      hasEvStats: /id="ev-stats"/.test(fragment),
    },
    null,
    2
  )
);
