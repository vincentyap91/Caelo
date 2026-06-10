/**
 * Map Figma variable path → WEB code syntax per VARIABLE-RULES.en.md.
 * Inverse of cssNameToFigmaPath in parse-theme-css-for-figma.mjs.
 */
export function figmaPathToCssVar(figmaPath) {
  if (figmaPath.startsWith('color/')) {
    const rest = figmaPath.slice('color/'.length);
    if (rest.startsWith('gradient/')) {
      const gradRest = rest.slice('gradient/'.length);
      if (gradRest.endsWith('/start')) {
        return `var(--color-gradient-${gradRest.slice(0, -'/start'.length).replace(/\//g, '-')}-start)`;
      }
      if (gradRest.endsWith('/end')) {
        return `var(--color-gradient-${gradRest.slice(0, -'/end'.length).replace(/\//g, '-')}-end)`;
      }
      return `var(--color-gradient-${gradRest.replace(/\//g, '-')})`;
    }
    return `var(--color-${rest.replace(/\//g, '-')})`;
  }

  if (figmaPath.startsWith('raw/')) {
    const rest = figmaPath.slice(4);
    if (rest.startsWith('gradient/')) {
      const gradRest = rest.slice('gradient/'.length);
      if (gradRest.endsWith('/start')) {
        return `var(--raw-gradient-${gradRest.slice(0, -'/start'.length).replace(/\//g, '-')}-start)`;
      }
      if (gradRest.endsWith('/end')) {
        return `var(--raw-gradient-${gradRest.slice(0, -'/end'.length).replace(/\//g, '-')}-end)`;
      }
    }
    if (rest.startsWith('scrim/')) {
      return `var(--raw-scrim-${rest.slice('scrim/'.length).replace(/\//g, '-')})`;
    }
    return `var(--raw-${rest.replace(/\//g, '-')})`;
  }

  if (figmaPath.startsWith('accent/brown/')) {
    return `var(--accent-brown-${figmaPath.slice('accent/brown/'.length)})`;
  }
  if (figmaPath.startsWith('support/')) {
    return `var(--support-${figmaPath.slice('support/'.length)})`;
  }

  const slash = figmaPath.indexOf('/');
  if (slash === -1) return `var(--${figmaPath})`;
  return `var(--${figmaPath.slice(0, slash)}-${figmaPath.slice(slash + 1)})`;
}
