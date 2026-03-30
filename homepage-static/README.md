# Homepage static build

`homepage-static/index.html` is now copied from the real offline React build.

## Result

- Same homepage UI and layout as the app build, not a hand-made approximation.
- Opens directly as a single HTML file.
- No `npm run dev` needed.

## How it was generated

- Build command: `npm run build:offline`
- Output copied from `dist/index.html` to `homepage-static/index.html`

## Notes

- This file is a large single-file build with inline JS and CSS.
- It keeps the app behavior that works without a backend, such as the local demo login flow.
