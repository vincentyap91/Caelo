const UI_ATTR = 'data-figma-capture-ui';

export function isCaptureUiNode(node) {
  if (!node || node.nodeType !== 1) return false;
  return Boolean(node.closest?.(`[${UI_ATTR}]`));
}

export function captureFilter(node) {
  if (node?.nodeType === 1 && node.hasAttribute?.(UI_ATTR)) return false;
  if (isCaptureUiNode(node)) return false;
  const tag = node?.tagName;
  if (tag === 'IFRAME' || tag === 'VIDEO') return false;
  return true;
}

export function defaultCaptureRoot() {
  return (
    document.querySelector('[data-sportsbook-shell]') ||
    document.getElementById('root') ||
    document.body
  );
}

function parseCssColor(input) {
  if (!input || input === 'transparent' || input === 'none') return null;
  const canvas = parseCssColor._ctx || (parseCssColor._ctx = document.createElement('canvas').getContext('2d'));
  canvas.fillStyle = '#000000';
  canvas.fillStyle = input;
  const value = canvas.fillStyle;
  const match = String(value).match(/[\d.]+/g);
  if (!match || match.length < 3) return null;
  const r = Number(match[0]);
  const g = Number(match[1]);
  const b = Number(match[2]);
  const a = match[3] == null ? 1 : Number(match[3]);
  if (!Number.isFinite(a) || a <= 0.01) return null;
  return { r, g, b, a };
}

function rgba({ r, g, b, a }) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${Number(a.toFixed(3))})`;
}

function xmlEscape(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isHidden(el, style) {
  if (el.hasAttribute(UI_ATTR) || isCaptureUiNode(el)) return true;
  if (style.display === 'none' || style.visibility === 'hidden') return true;
  if (Number(style.opacity) === 0) return true;
  return false;
}

function sameFill(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.r === b.r && a.g === b.g && a.b === b.b && Math.abs(a.a - b.a) < 0.02;
}

function collectSvgLayers(root) {
  const rootRect = root.getBoundingClientRect();
  const width = Math.max(1, Math.round(root.scrollWidth || rootRect.width));
  const height = Math.max(1, Math.round(root.scrollHeight || rootRect.height));
  const layers = [];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'LINK', 'META', 'HEAD', 'BR', 'WBR']);
  const walkLimit = 4000;
  let walked = 0;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.currentNode;
  while (node && walked < walkLimit) {
    walked += 1;
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      const parent = node.parentElement;
      if (text && parent && !SKIP.has(parent.tagName)) {
        const style = getComputedStyle(parent);
        if (!isHidden(parent, style) && style.color) {
          const range = document.createRange();
          range.selectNodeContents(node);
          const rect = range.getBoundingClientRect();
          range.detach?.();
          if (rect.width >= 1 && rect.height >= 1) {
            const fill = parseCssColor(style.color);
            if (fill) {
              layers.push({
                kind: 'text',
                x: rect.left - rootRect.left + root.scrollLeft,
                y: rect.top - rootRect.top + root.scrollTop,
                w: rect.width,
                h: rect.height,
                text,
                fill,
                fontSize: parseFloat(style.fontSize) || 14,
                fontWeight: style.fontWeight || '400',
                fontFamily: (style.fontFamily || 'Poppins').split(',')[0].replace(/['"]/g, '').trim() || 'Poppins',
              });
            }
          }
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      if (!SKIP.has(el.tagName) && !isCaptureUiNode(el)) {
        const style = getComputedStyle(el);
        if (!isHidden(el, style)) {
          const rect = el.getBoundingClientRect();
          if (rect.width >= 1 && rect.height >= 1) {
            const x = rect.left - rootRect.left + root.scrollLeft;
            const y = rect.top - rootRect.top + root.scrollTop;
            const bg = parseCssColor(style.backgroundColor);
            const parent = el.parentElement;
            const parentBg = parent ? parseCssColor(getComputedStyle(parent).backgroundColor) : null;
            const radius = parseFloat(style.borderTopLeftRadius) || 0;
            const borderColor = parseCssColor(style.borderTopColor);
            const borderWidth = parseFloat(style.borderTopWidth) || 0;
            const isImg = el.tagName === 'IMG' && el.currentSrc;

            if (isImg) {
              layers.push({
                kind: 'image',
                x,
                y,
                w: rect.width,
                h: rect.height,
                href: el.currentSrc,
                radius,
              });
            } else if (bg && !sameFill(bg, parentBg)) {
              layers.push({
                kind: 'rect',
                x,
                y,
                w: rect.width,
                h: rect.height,
                fill: bg,
                radius,
                stroke: borderWidth >= 0.5 && borderColor ? borderColor : null,
                strokeWidth: borderWidth,
              });
            } else if (borderWidth >= 1 && borderColor) {
              layers.push({
                kind: 'rect',
                x,
                y,
                w: rect.width,
                h: rect.height,
                fill: null,
                radius,
                stroke: borderColor,
                strokeWidth: borderWidth,
              });
            }
          }
        }
      }
    }
    node = walker.nextNode();
  }

  return { width, height, layers };
}

export function layersToSvg(root) {
  const { width, height, layers } = collectSvgLayers(root);
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
  ];
  for (const layer of layers) {
    const x = Number(layer.x.toFixed(2));
    const y = Number(layer.y.toFixed(2));
    const w = Number(layer.w.toFixed(2));
    const h = Number(layer.h.toFixed(2));
    if (layer.kind === 'rect') {
      const fill = layer.fill ? rgba(layer.fill) : 'none';
      const extra = layer.stroke
        ? ` stroke="${rgba(layer.stroke)}" stroke-width="${Number(layer.strokeWidth.toFixed(2))}"`
        : '';
      const rx = layer.radius ? ` rx="${Number(Math.min(layer.radius, w / 2, h / 2).toFixed(2))}"` : '';
      parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${rx}${extra}/>`);
    } else if (layer.kind === 'image') {
      const rx = layer.radius ? ` rx="${Number(Math.min(layer.radius, w / 2, h / 2).toFixed(2))}"` : '';
      parts.push(
        `<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" href="${xmlEscape(layer.href)}"${rx}/>`
      );
    } else if (layer.kind === 'text') {
      parts.push(
        `<text x="${x}" y="${y}" font-size="${Number(layer.fontSize.toFixed(2))}" font-weight="${xmlEscape(String(layer.fontWeight))}" font-family="${xmlEscape(layer.fontFamily)}" fill="${rgba(layer.fill)}" dominant-baseline="hanging">${xmlEscape(layer.text)}</text>`
      );
    }
  }
  parts.push('</svg>');
  return { svg: parts.join(''), width, height, layerCount: layers.length };
}

export async function copyPngToClipboard(blob) {
  if (!blob) throw new Error('No image to copy');
  if (navigator.clipboard?.write && window.ClipboardItem) {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type || 'image/png']: blob })]);
    return;
  }
  throw new Error('Clipboard API unavailable');
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function slugFromLocation() {
  const path = (window.location.pathname || '/').replace(/[^\w/-]+/g, '').replace(/\//g, '-') || 'page';
  return `caelo${path}`.replace(/-+/g, '-');
}
