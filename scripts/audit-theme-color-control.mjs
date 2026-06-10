/**
 * Audit color usage outside src/theme.css semantic tokens.
 * Run: node scripts/audit-theme-color-control.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');

const SKIP_FILES = new Set([
  path.join(SRC, 'theme.css'),
  path.join(SRC, 'theme-riocity.css'),
]);

const ALLOWED_COLOR_TOKENS = new Set(
  [...fs.readFileSync(path.join(SRC, 'theme-riocity.css'), 'utf8').matchAll(/^\s*(--color-[^:]+):/gm)].map(
    (m) => m[1]
  )
);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', 'dist', 'assets'].includes(e.name)) walk(p, acc);
    else if (/\.(jsx?|tsx?|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const PATTERNS = [
  { id: 'hex', re: /#[0-9a-fA-F]{3,8}\b/g, label: 'Hex literal' },
  { id: 'rgb', re: /\b(?:rgb|rgba|hsl|hsla)\([^)]*\)/g, label: 'RGB/HSL literal' },
  { id: 'named', re: /\b(?:fill|stroke|stopColor|floodColor|background|color|borderColor|boxShadow|textShadow|filter)\s*[:=]\s*['"]?(?:white|black|red|blue|green|yellow|orange|purple|pink|gray|grey)['"]?/gi, label: 'Named color in style/SVG' },
  { id: 'tailwindPalette', re: /\b(?:bg|text|border|ring|from|via|to|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?(?:\/\d+)?\b/g, label: 'Tailwind palette class' },
  { id: 'arbitraryColor', re: /(?:bg|text|border|ring|shadow)-\[(?:#[0-9a-fA-F]{3,8}|rgb[a]?\([^)]+\)|hsl[a]?\([^)]+\)|color-mix\([^)]+\)|[^[\]]*rgba?\([^)]+\)[^[\]]*)\]/g, label: 'Arbitrary Tailwind color' },
  { id: 'shadowRgba', re: /shadow-\[[^\]]*rgba?\([^)]+\)[^\]]*\]/g, label: 'Arbitrary shadow with rgba' },
  { id: 'ringWhite', re: /ring-(?:white|black)(?:\/\d+)?/g, label: 'ring white/black' },
  { id: 'colorMixWhite', re: /color-mix\([^)]*,\s*white\)/g, label: 'color-mix with white' },
  { id: 'primitiveDirect', re: /var\(\s*--(?:mono|brand|accent|support|overlay|raw)-[a-z0-9-]+/g, label: 'Direct primitive var (not --color-*)' },
  { id: 'semantic', re: /var\(\s*--color-[a-z0-9-]+/g, label: 'Semantic --color-* (good)' },
  { id: 'gradientUtility', re: /\b(?:bg-)?gradient-[a-z0-9-]+/g, label: 'Gradient utility class' },
];

function lineContext(text, index) {
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  const col = index - before.lastIndexOf('\n');
  const lines = text.split('\n');
  const snippet = (lines[line - 1] || '').trim().slice(0, 140);
  return { line, col, snippet };
}

function auditFile(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  const findings = [];

  for (const { id, re, label } of PATTERNS) {
    if (id === 'semantic') continue;
    const reCopy = new RegExp(re.source, re.flags);
    let m;
    while ((m = reCopy.exec(text))) {
      const ctx = lineContext(text, m.index);
      findings.push({ id, label, match: m[0], ...ctx });
    }
  }

  const semanticCount = (text.match(/var\(\s*--color-[a-z0-9-]+/g) || []).length;
  const disallowedSemantic = [];
  for (const m of text.matchAll(/var\(\s*(--color-[a-z0-9-]+)/g)) {
    const name = m[1];
    if (!ALLOWED_COLOR_TOKENS.has(name)) {
      const ctx = lineContext(text, m.index);
      disallowedSemantic.push({ name, ...ctx });
    }
  }
  const issueIds = new Set(findings.map((f) => f.id));
  if (disallowedSemantic.length) issueIds.add('disallowedSemantic');
  const isClean = findings.length === 0 && disallowedSemantic.length === 0 && semanticCount > 0;

  return { rel, findings, disallowedSemantic, semanticCount, isClean, issueCount: findings.length + disallowedSemantic.length };
}

const files = walk(SRC).filter((f) => !SKIP_FILES.has(f));
const results = files.map(auditFile);

const byCategory = {};
for (const r of results) {
  for (const f of r.findings) {
    if (!byCategory[f.id]) byCategory[f.id] = [];
    byCategory[f.id].push({ file: r.rel, ...f });
  }
  for (const d of r.disallowedSemantic) {
    if (!byCategory.disallowedSemantic) byCategory.disallowedSemantic = [];
    byCategory.disallowedSemantic.push({
      file: r.rel,
      id: 'disallowedSemantic',
      label: 'Semantic token not in theme-riocity.css allowlist',
      match: d.name,
      line: d.line,
      snippet: d.snippet,
    });
  }
}

const dirtyFiles = results
  .filter((r) => r.issueCount > 0)
  .sort((a, b) => b.issueCount - a.issueCount);

const cleanFiles = results.filter((r) => r.isClean).map((r) => r.rel);

const totalSemantic = results.reduce((s, r) => s + r.semanticCount, 0);
const filesWithSemantic = results.filter((r) => r.semanticCount > 0).length;

const svgFiles = results.filter(
  (r) =>
    r.rel.endsWith('.jsx') &&
    (fs.readFileSync(path.join(ROOT, r.rel), 'utf8').includes('<svg') ||
      fs.readFileSync(path.join(ROOT, r.rel), 'utf8').includes('stopColor') ||
      fs.readFileSync(path.join(ROOT, r.rel), 'utf8').includes('fill="'))
);

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    filesScanned: files.length,
    filesWithIssues: dirtyFiles.length,
    filesClean: cleanFiles.length,
    filesWithSemanticUsage: filesWithSemantic,
    allowedSemanticTokens: ALLOWED_COLOR_TOKENS.size,
    totalSemanticRefs: totalSemantic,
    issueCountsByCategory: Object.fromEntries(
      Object.entries(byCategory).map(([k, v]) => [k, v.length])
    ),
  },
  topOffenders: dirtyFiles.slice(0, 25).map((r) => ({
    file: r.rel,
    issues: r.issueCount,
    semanticRefs: r.semanticCount,
  })),
  byCategory: Object.fromEntries(
    Object.entries(byCategory).map(([k, v]) => [
      k,
      v.slice(0, 40).map(({ file, line, match, snippet }) => ({ file, line, match, snippet })),
    ])
  ),
  cleanFilesSample: cleanFiles.slice(0, 30),
  svgCandidateFiles: svgFiles
    .filter((r) => r.issueCount > 0)
    .slice(0, 20)
    .map((r) => ({ file: r.rel, issues: r.issueCount })),
};

const outJson = path.join(ROOT, 'docs', 'theme-color-audit-data.json');
fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
console.log(`\nWrote ${path.relative(ROOT, outJson)}`);
