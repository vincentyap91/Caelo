const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const htmlPath = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function fileToDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  const content = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${content.toString('base64')}`;
}

function getAssetFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAssetFiles(fullPath) : [fullPath];
  });
}

if (!fs.existsSync(htmlPath)) {
  throw new Error(`Missing build output: ${htmlPath}`);
}

let html = fs.readFileSync(htmlPath, 'utf8');
const inlinedAssets = new Set();
const assetFiles = getAssetFiles(assetsDir);
const assetMap = new Map(
  assetFiles.map((filePath) => {
    const relativePath = path.relative(distDir, filePath).replace(/\\/g, '/');
    return [relativePath, fileToDataUrl(filePath)];
  }),
);

for (const [relativePath, dataUrl] of assetMap.entries()) {
  html = html.split(`./${relativePath}`).join(dataUrl);
  html = html.split(`/${relativePath}`).join(dataUrl);
  html = html.split(relativePath).join(dataUrl);
}

html = html.replace(/<link([^>]*?)href="(.+?\.css)"([^>]*?)>/g, (match, beforeHref, href, afterHref) => {
  const assetPath = path.resolve(distDir, href);
  if (!fs.existsSync(assetPath)) {
    return match;
  }

  inlinedAssets.add(assetPath);
  let css = fs.readFileSync(assetPath, 'utf8');
  for (const [relativePath, dataUrl] of assetMap.entries()) {
    css = css.split(`./${relativePath}`).join(dataUrl);
    css = css.split(`../${relativePath}`).join(dataUrl);
    css = css.split(`/${relativePath}`).join(dataUrl);
    css = css.split(relativePath).join(dataUrl);
  }
  return `<style${beforeHref}${afterHref}>${css}</style>`;
});

html = html.replace(/<script([^>]*?)src="(.+?\.js)"([^>]*)><\/script>/g, (match, beforeSrc, src, afterSrc) => {
  const assetPath = path.resolve(distDir, src);
  if (!fs.existsSync(assetPath)) {
    return match;
  }

  inlinedAssets.add(assetPath);
  let js = fs.readFileSync(assetPath, 'utf8');
  for (const [relativePath, dataUrl] of assetMap.entries()) {
    js = js.split(`./${relativePath}`).join(dataUrl);
    js = js.split(`/${relativePath}`).join(dataUrl);
    js = js.split(relativePath).join(dataUrl);
  }
  return `<script${beforeSrc}${afterSrc}>${js}</script>`;
});

fs.writeFileSync(htmlPath, html);

for (const filePath of new Set([...inlinedAssets, ...assetFiles])) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

if (fs.existsSync(assetsDir) && fs.readdirSync(assetsDir).length === 0) {
  fs.rmdirSync(assetsDir);
}
