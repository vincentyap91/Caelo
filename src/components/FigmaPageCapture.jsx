import { useCallback, useEffect, useState } from 'react';
import { toBlob } from 'html-to-image';
import {
  captureFilter,
  copyPngToClipboard,
  defaultCaptureRoot,
  downloadBlob,
  isCaptureUiNode,
  layersToSvg,
  slugFromLocation,
} from '../utils/figmaPageCapture';
import './FigmaPageCapture.css';

const STORAGE_KEY = 'caelo-figma-page-capture';

function shouldStartOpen() {
  try {
    if (new URLSearchParams(window.location.search).get('figmaCapture')) return true;
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function captureOptions(pixelRatio) {
  const bg = getComputedStyle(document.body).backgroundColor;
  return {
    pixelRatio,
    cacheBust: false,
    skipFonts: true,
    skipAutoScale: true,
    filter: captureFilter,
    imagePlaceholder: TRANSPARENT_PIXEL,
    onImageErrorHandler: () => undefined,
    backgroundColor: bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : '#ffffff',
  };
}

function errorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  if (error && typeof error === 'object' && error.message) return String(error.message);
  return String(error || 'Capture failed');
}

async function blobFromTarget(target, mode) {
  const pixelRatio = mode === 'page' ? 1 : 2;
  const options = captureOptions(pixelRatio);
  if (mode === 'view') {
    const width = Math.max(1, Math.round(window.innerWidth));
    const height = Math.max(1, Math.round(window.innerHeight));
    return toBlob(target, { ...options, width, height });
  }
  return toBlob(target, options);
}

export default function FigmaPageCapture() {
  const [open, setOpen] = useState(shouldStartOpen);
  const [mode, setMode] = useState('view');
  const [picking, setPicking] = useState(false);
  const [hoverRect, setHoverRect] = useState(null);
  const [picked, setPicked] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Ctrl+Shift+F toggles this bar. Copy PNG, then Ctrl+V in Figma.');

  const persistOpen = useCallback((next) => {
    setOpen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && picking) {
        setPicking(false);
        setHoverRect(null);
        document.body.classList.remove('figma-page-capture-picking');
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        persistOpen(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, persistOpen, picking]);

  useEffect(() => {
    if (!picking) return undefined;
    document.body.classList.add('figma-page-capture-picking');
    const onMove = (event) => {
      const el = document.elementsFromPoint(event.clientX, event.clientY).find((node) => !isCaptureUiNode(node));
      if (!el) {
        setHoverRect(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setHoverRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };
    const onClick = (event) => {
      const el = document.elementsFromPoint(event.clientX, event.clientY).find((node) => !isCaptureUiNode(node));
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      setPicked(el);
      setPicking(false);
      setHoverRect(null);
      document.body.classList.remove('figma-page-capture-picking');
      setStatus(`Selected ${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(' ')[0]}` : ''}`);
    };
    window.addEventListener('mousemove', onMove, true);
    window.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('mousemove', onMove, true);
      window.removeEventListener('click', onClick, true);
      document.body.classList.remove('figma-page-capture-picking');
    };
  }, [picking]);

  const resolveTarget = useCallback(() => {
    if (mode === 'select') return picked || defaultCaptureRoot();
    return defaultCaptureRoot();
  }, [mode, picked]);

  const runCapture = useCallback(
    async (as) => {
      const target = resolveTarget();
      if (!target) {
        setStatus('Nothing to capture.');
        return;
      }
      setBusy(true);
      setStatus(as === 'png' ? 'Capturing PNG…' : 'Building SVG layers…');
      try {
        if (as === 'svg') {
          const { svg, layerCount } = layersToSvg(target);
          downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${slugFromLocation()}.svg`);
          setStatus(`Downloaded SVG (${layerCount} layers). Drag the file onto the Figma canvas.`);
          return;
        }
        const blob = await blobFromTarget(target, mode === 'select' ? 'page' : mode);
        if (!blob) throw new Error('Capture returned empty');
        try {
          await copyPngToClipboard(blob);
          setStatus('Copied PNG. In Figma: click the canvas, then Ctrl+V.');
        } catch {
          downloadBlob(blob, `${slugFromLocation()}.png`);
          setStatus('Clipboard blocked. PNG downloaded — drop it onto the Figma canvas.');
        }
      } catch (error) {
        console.error('Figma page capture failed', error);
        setStatus(errorMessage(error));
      } finally {
        setBusy(false);
      }
    },
    [mode, resolveTarget]
  );

  if (!open) {
    if (!shouldStartOpen()) return null;
    return (
      <button
        type="button"
        className="figma-page-capture__launch"
        data-figma-capture-ui="1"
        onClick={() => persistOpen(true)}
      >
        Capture
      </button>
    );
  }

  return (
    <>
      {picking && hoverRect ? (
        <div
          className="figma-page-capture__hover"
          data-figma-capture-ui="1"
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        />
      ) : null}
      <aside className="figma-page-capture" data-figma-capture-ui="1">
        <div className="figma-page-capture__head">
          <p className="figma-page-capture__title">Figma capture</p>
          <button type="button" className="figma-page-capture__close" onClick={() => persistOpen(false)}>
            Hide
          </button>
        </div>
        <div className="figma-page-capture__modes">
          {[
            ['view', 'Viewport'],
            ['page', 'Full page'],
            ['select', 'Select'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`figma-page-capture__mode${mode === id ? ' is-active' : ''}`}
              onClick={() => {
                setMode(id);
                if (id === 'select') setPicking(true);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="figma-page-capture__actions">
          <button
            type="button"
            className="figma-page-capture__btn figma-page-capture__btn--primary"
            disabled={busy}
            onClick={() => runCapture('png')}
          >
            {busy ? 'Working…' : 'Copy to clipboard'}
          </button>
          <button
            type="button"
            className="figma-page-capture__btn figma-page-capture__btn--ghost"
            disabled={busy}
            onClick={() => runCapture('svg')}
          >
            Download SVG
          </button>
        </div>
        <p className="figma-page-capture__status">{status}</p>
        <p className="figma-page-capture__hint">
          Copy is a PNG paste (same Ctrl+V as html.to.design). SVG is editable-ish layers you drag into Figma.
        </p>
      </aside>
    </>
  );
}
