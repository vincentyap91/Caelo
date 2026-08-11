/**
 * One-shot: extract 1xbet sportsbook shell (layout + chrome), copy assets,
 * rewrite paths, scope CSS tokens for React port.
 * Always starts from fresh source copies (safe to re-run).
 * Run: node scripts/port-1xbet-sportsbook.mjs
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

function copyDir(from, to) {
  ensureDir(to);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const dstPath = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, dstPath);
    else if (entry.isFile()) fs.copyFileSync(srcPath, dstPath);
  }
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

// Fresh CSS / JS / mobile
ensureDir(path.join(DST, 'css'));
ensureDir(path.join(DST, 'js'));
ensureDir(path.join(DST, 'mobile/css'));
ensureDir(path.join(DST, 'mobile/js'));

copyFile(path.join(SRC, 'css/styles.css'), path.join(DST, 'css/styles.css'));
copyFile(path.join(SRC, 'css/auth-modals.css'), path.join(DST, 'css/auth-modals.css'));
copyFile(path.join(SRC, 'css/account.css'), path.join(DST, 'css/account.css'));

const jsFiles = [
  'favourites-store.js',
  'accumulators.js',
  'bet-save-load.js',
  'bet-slip-generator.js',
  'auth-modals.js',
  'script.js',
];
for (const jf of jsFiles) {
  copyFile(path.join(SRC, 'js', jf), path.join(DST, 'js', jf));
}
copyFile(
  path.join(SRC, 'mobile/css/mobile-sports-filter.css'),
  path.join(DST, 'mobile/css/mobile-sports-filter.css')
);
copyFile(
  path.join(SRC, 'mobile/js/mobile-sports-filter.js'),
  path.join(DST, 'mobile/js/mobile-sports-filter.js')
);

copyDir(path.join(SRC, 'assets/icons'), path.join(DST, 'assets/icons'));
copyDir(path.join(SRC, 'assets/games/sports'), path.join(DST, 'assets/games/sports'));
if (fs.existsSync(path.join(SRC, 'mobile/assets/icons'))) {
  copyDir(path.join(SRC, 'mobile/assets/icons'), path.join(DST, 'mobile/assets/icons'));
}
// Auth modal images
if (fs.existsSync(path.join(SRC, 'assets/images/auth'))) {
  copyDir(path.join(SRC, 'assets/images/auth'), path.join(DST, 'assets/images/auth'));
}

const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');

// --- sportsbook-layout (no header/footer/home-social) ---
const start = html.indexOf('<div class="sportsbook-layout">');
if (start < 0) throw new Error('sportsbook-layout not found');
const footerComment = html.indexOf('<!-- ========== FOOTER', start);
if (footerComment < 0) throw new Error('FOOTER marker not found');
const end = html.lastIndexOf('</div>', footerComment) + '</div>'.length;

let fragment = html.slice(start, end);
fragment = fragment.replace(/\s*<div class="home-social"[\s\S]*?<\/div>\s*(?=\s*<\/main>)/i, '\n');
fragment = rewriteAssetUrls(fragment);

// --- chrome after page-shell: drawers / mobile tabbar / mh-sf / toast ---
const chromeStart = html.indexOf('<div class="drawer-backdrop"');
const chromeEnd = html.indexOf('<script src="js/favourites-store.js"');
if (chromeStart < 0 || chromeEnd < 0) throw new Error('chrome shell markers not found');
let chrome = html.slice(chromeStart, chromeEnd).trim() + '\n';
chrome = rewriteAssetUrls(chrome);

const refs = new Set();
for (const blob of [fragment, chrome]) {
  for (const m of blob.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const u = m[1].replace(/^\/sportsbook\//, '').split('?')[0].replace(/\/$/, '');
    if (u.startsWith('assets/') || u.startsWith('mobile/assets/')) refs.add(u);
  }
}

for (const jf of jsFiles) {
  const j = fs.readFileSync(path.join(SRC, 'js', jf), 'utf8');
  for (const m of j.matchAll(/["']((?:assets|mobile\/assets)\/[^"']+)["']/g)) {
    const u = m[1].split('?')[0].replace(/\/$/, '');
    if (u.includes('/marble/') || u.includes('/lnt/') || u.includes('/references/')) continue;
    if (u.includes('big-wins') || u.includes('payouts') || u.includes('referral')) continue;
    refs.add(u);
  }
}

let copied = 0;
const missing = [];
for (const rel of [...refs].sort()) {
  if (
    rel.startsWith('assets/icons/') ||
    rel.startsWith('assets/games/sports/') ||
    rel.startsWith('mobile/assets/icons/') ||
    rel.startsWith('assets/images/auth/')
  ) {
    continue;
  }
  const from = path.join(SRC, rel);
  const to = path.join(DST, rel);
  if (!fs.existsSync(from)) {
    missing.push(rel);
    continue;
  }
  const st = fs.statSync(from);
  if (st.isDirectory()) {
    ensureDir(to);
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      fs.copyFileSync(path.join(from, entry.name), path.join(to, entry.name));
      copied++;
    }
    continue;
  }
  copyFile(from, to);
  copied++;
}

ensureDir(path.join(DST, 'partials'));
fs.writeFileSync(path.join(DST, 'partials/sportsbook-layout.html'), fragment);
fs.writeFileSync(path.join(DST, 'partials/sportsbook-chrome.html'), chrome);

// Rewrite JS asset paths → /sportsbook/...
for (const jf of jsFiles) {
  const p = path.join(DST, 'js', jf);
  let j = fs.readFileSync(p, 'utf8');
  j = j.replace(/(["'])(assets\/)/g, '$1/sportsbook/$2');
  j = j.replace(/(["'])(mobile\/assets\/)/g, '$1/sportsbook/$2');
  if (jf === 'script.js') {
    j = j.replace(
      /\/\* Load desktop full-menu companion[\s\S]*?catch \(e\) \{ \/\* ignore \*\/ \}/,
      '/* desktop-menu auto-load disabled for React port */'
    );
  }
  if (jf === 'auth-modals.js') {
    j = j.replace(/link\.href\s*=\s*["']css\/auth-modals\.css["']/, 'link.href = "/sportsbook/css/auth-modals.css"');
    j = j.replace(/link\.href\s*=\s*["']css\/account\.css["']/, 'link.href = "/sportsbook/css/account.css"');
  }
  fs.writeFileSync(p, j);
}

// Scope CSS — tokens on shell + body so JS-injected modals (on body) keep 1xbet colors
const TOKEN_HOST = '.sportsbook-root,\nbody.sportsbook-port-active';

const cssPath = path.join(DST, 'css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/:root\b/g, TOKEN_HOST);
css = rewriteCssUrls(css);

css = css.replace(
  /\/\* =+\s*\n\s*2\. Reset[\s\S]*?(?=\/\* =+\s*\n\s*3\. )/m,
  (block) => {
    let b = block;
    b = b.replace(/^html\s*\{/m, '.sportsbook-root {');
    b = b.replace(/^body\s*\{/m, '.sportsbook-root {');
    b = b.replace(
      /^\*,\s*\n\*::before,\s*\n\*::after\s*\{/m,
      '.sportsbook-root,\n.sportsbook-root *,\n.sportsbook-root *::before,\n.sportsbook-root *::after {'
    );
    b = b.replace(
      /^\/\* Site-wide thin scrollbars[^\n]*\*\/\s*\n\*\s*\{/m,
      '/* Scoped thin scrollbars */\n.sportsbook-root, .sportsbook-root * {'
    );
    b = b.replace(/^\*::-webkit-scrollbar/gm, '.sportsbook-root *::-webkit-scrollbar');
    b = b.replace(
      /^button,\s*\ninput,\s*\nselect\s*\{/m,
      '/* :where() keeps reset at ~0,1,0 so .odd-btn / .btn-* win */\n.sportsbook-root :where(button),\n.sportsbook-root :where(input),\n.sportsbook-root :where(select) {'
    );
    b = b.replace(/^a\s*\{/m, '.sportsbook-root :where(a) {');
    b = b.replace(/^ul\s*\{/m, '.sportsbook-root :where(ul) {');
    b = b.replace(/^img\s*\{/m, '.sportsbook-root :where(img) {');
    b = b.replace(/^button\s*\{/m, '.sportsbook-root :where(button) {');
    b = b.replace(
      /^button:focus-visible,\s*\ninput:focus-visible,\s*\nselect:focus-visible,\s*\na:focus-visible\s*\{/m,
      '.sportsbook-root :where(button):focus-visible,\n.sportsbook-root :where(input):focus-visible,\n.sportsbook-root :where(select):focus-visible,\n.sportsbook-root :where(a):focus-visible {'
    );
    return b;
  }
);

css = css.replace(
  /(@media \(max-width: 900px\) \{[\s\S]*?)(\n  html,\n  body \{[\s\S]*?\n  \})/,
  '$1\n  .sportsbook-root { max-width: 100%; overflow-x: clip; }'
);
css = css.replace(
  /(@media \(max-width: 900px\) \{[\s\S]*?)(\n  body \{\n    padding-bottom:[\s\S]*?\n  \})/,
  '$1\n  .sportsbook-root {\n    padding-bottom: calc(var(--mobile-tabbar-h) + env(safe-area-inset-bottom, 0px));\n  }'
);

// 1xbet footer chrome must not override Caelo <footer class="site-footer">
css = css.replace(/(^|[^-\w.])\.site-footer\b/gm, '$1.sportsbook-root .site-footer');

fs.writeFileSync(cssPath, css);

for (const name of ['auth-modals.css', 'account.css']) {
  const p = path.join(DST, 'css', name);
  let c = fs.readFileSync(p, 'utf8');
  c = rewriteCssUrls(c);
  c = c.replace(/(["'])\.\.\/assets\//g, '$1/sportsbook/assets/');
  c = c.replace(/(["'])assets\//g, '$1/sportsbook/assets/');
  fs.writeFileSync(p, c);
}

const mcssPath = path.join(DST, 'mobile/css/mobile-sports-filter.css');
if (fs.existsSync(mcssPath)) {
  let mcss = fs.readFileSync(mcssPath, 'utf8');
  mcss = mcss.replace(/(['"])\.\.\/\.\.\/assets\//g, '$1/sportsbook/assets/');
  mcss = mcss.replace(/(['"])\.\.\/assets\//g, '$1/sportsbook/mobile/assets/');
  fs.writeFileSync(mcssPath, mcss);
}

const mjsPath = path.join(DST, 'mobile/js/mobile-sports-filter.js');
if (fs.existsSync(mjsPath)) {
  let mjs = fs.readFileSync(mjsPath, 'utf8');
  mjs = mjs.replace(/(["'])(assets\/)/g, '$1/sportsbook/$2');
  mjs = mjs.replace(/(["'])(mobile\/assets\/)/g, '$1/sportsbook/$2');
  fs.writeFileSync(mjsPath, mjs);
}

console.log(
  JSON.stringify(
    {
      fragmentBytes: fragment.length,
      chromeBytes: chrome.length,
      copied,
      missingCount: missing.length,
      missing: missing.slice(0, 20),
      refs: refs.size,
      hasHomeSocial: /home-social/.test(fragment),
      hasToast: /id="toast"/.test(chrome),
      hasAuthCss: fs.existsSync(path.join(DST, 'css/auth-modals.css')),
    },
    null,
    2
  )
);
