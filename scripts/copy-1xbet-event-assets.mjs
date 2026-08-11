/**
 * Copy all image assets referenced by 1xbet event.html / event.js / event.css / multi-live.css
 * into public/sportsbook. Safe to re-run.
 * Run: node scripts/copy-1xbet-event-assets.mjs
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

function collectRefs(text) {
  const refs = new Set();
  const patterns = [
    /(?:src|href)=["']([^"']+)["']/g,
    /url\(\s*['"]?([^'")]+)['"]?\s*\)/g,
    /["']((?:\/sportsbook\/)?(?:assets|mobile\/assets)\/[^"']+)["']/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text))) {
      let u = (m[1] || '').split('#')[0].split('?')[0].trim();
      u = u.replace(/^\/sportsbook\//, '');
      u = u.replace(/^(\.\.\/)+/, '');
      if (u.startsWith('assets/') || u.startsWith('mobile/assets/')) refs.add(u);
    }
  }
  return refs;
}

const scanFiles = [
  path.join(SRC, 'event.html'),
  path.join(SRC, 'js/event.js'),
  path.join(SRC, 'css/event.css'),
  path.join(SRC, 'css/multi-live.css'),
];

const refs = new Set();
for (const f of scanFiles) {
  if (!fs.existsSync(f)) continue;
  for (const r of collectRefs(fs.readFileSync(f, 'utf8'))) refs.add(r);
}

const IMAGE_RE = /\.(png|jpe?g|webp|gif|svg|ico|avif)$/i;
const images = [...refs].filter((u) => IMAGE_RE.test(u)).sort();

let copied = 0;
let existed = 0;
const missing = [];

for (const rel of images) {
  const from = path.join(SRC, rel);
  const to = path.join(DST, rel);
  if (!fs.existsSync(from)) {
    missing.push(rel);
    continue;
  }
  if (!fs.statSync(from).isFile()) continue;
  if (fs.existsSync(to)) {
    existed++;
    continue;
  }
  copyFile(from, to);
  copied++;
}

// Bulk-copy event board icon families so te-/ei-/team logos are complete
const bulkDirs = [
  { dir: 'assets/icons', test: (n) => /^(te-|rb-|nav-|icon-|search\.svg|sport-)/.test(n) },
  { dir: 'assets/icons/lnt', test: () => true },
  { dir: 'assets/icons/collapse', test: () => true },
  { dir: 'assets/images/mobile-home/teams', test: () => true },
  { dir: 'mobile/assets/icons', test: (n) => /^(ei-|sp-|tab-)/.test(n) },
];

let bulkCopied = 0;
for (const { dir, test } of bulkDirs) {
  const fromDir = path.join(SRC, dir);
  if (!fs.existsSync(fromDir)) continue;
  for (const name of fs.readdirSync(fromDir)) {
    if (!IMAGE_RE.test(name) || !test(name)) continue;
    const from = path.join(fromDir, name);
    if (!fs.statSync(from).isFile()) continue;
    const to = path.join(DST, dir, name);
    if (fs.existsSync(to)) continue;
    copyFile(from, to);
    bulkCopied++;
  }
}

// Explicit event.html image assets often missed by chrome-only ports
const extras = [
  'assets/images/team-santos.webp',
  'assets/images/team-america.webp',
  'assets/images/rb-generator-art.png',
  'assets/images/rb-phone-qr.png',
  'assets/images/mobile-home/teams/team-01.webp',
  'assets/images/mobile-home/teams/team-02.webp',
];
let extraCopied = 0;
for (const rel of extras) {
  const from = path.join(SRC, rel);
  const to = path.join(DST, rel);
  if (!fs.existsSync(from) || fs.existsSync(to)) continue;
  copyFile(from, to);
  extraCopied++;
}

console.log(
  JSON.stringify(
    {
      scannedImages: images.length,
      copied,
      existed,
      bulkCopied,
      extraCopied,
      missingCount: missing.length,
      missing,
      newlyCopiedTotal: copied + bulkCopied + extraCopied,
    },
    null,
    2
  )
);
