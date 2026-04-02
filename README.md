# Caelo

Vite + React front-end for the Caelo web project.

## Environment

- Node.js: use the version from [`.nvmrc`](./.nvmrc) (`22.12.0`)
- Package manager: `npm`
- Framework: React + Vite
- Styling: Tailwind CSS
- Deployment target: Vercel

## Deployment

This project is configured as a single-page app deployment on Vercel.

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite config: [`vercel.json`](./vercel.json)

The Vercel rewrite sends all routes to `index.html`, so client-side routes like `/referral`, `/profile`, or `/withdrawal` continue to work after deployment.

## Homepage: which file is which "header"?

On **`/`** (home), several stacked areas can all be called a "header" in conversation. Here is where to edit each part.

| What you see on the page | Source file | Notes |
|----------------------------|-------------|--------|
| **Top navigation** - logo, main menu (Casino, Slots, ...), login / register, account menu | `src/components/Navbar.jsx` | Same bar appears on **all** routes. Mounted once in `src/App.jsx` (search for `<Navbar>`). |
| **Floating side buttons** (e.g. social / chat shortcuts) fixed on the edge | `src/components/FloatingSocials.jsx` | Also global; rendered in `App.jsx` above the navbar. |
| **Big hero banner** under the nav + marquee / ticker strip below it | `src/components/HeroSection.jsx` | **Home only.** Wired in `App.jsx` when `page === 'home'` (directly under `<Navbar />`). Banner image: `src/assets/homebanner.jpg`. |
| **Section titles** inside the home content column (e.g. "Top Games", category rows) | Often `src/components/SectionHeader.jsx` | Reused by blocks such as `FeaturesRow`, `GameCategories`, `TopGames`, `VipTier`, etc. Edit the **parent section** component if you need layout around the title, or `SectionHeader.jsx` for shared title styling. |

**Where the homepage layout is composed:** `src/App.jsx` - look for `{page === 'home' ? (`; the children are the hero plus the scrollable column (`FeaturesRow`, `GameCategories`, ...).

**Spacing under the fixed nav:** the wrapper `div` with `pt-[113px] md:pt-[92px]` in `App.jsx` offsets content so it sits below `Navbar`.

---

## Static HTML homepage (share without Node)

Folder **`homepage-static/`** contains a **plain `index.html` + `styles.css` + `assets/homebanner.jpg`**. Your colleague can double-click `homepage-static/index.html` to preview the general layout (not the full React app). See **`homepage-static/README.md`**.

---

## Local preview

- Install: `npm install`
- Dev: `npm run dev`
- Production build: `npm run build`
- Preview production build locally: `npm run preview`

Optional single-file build (one large HTML, e.g. offline handoff): `npm run build:offline`

## Stack

- React 19.2
- Vite 2.9
- Tailwind CSS 3.4
- Lucide React icons
- npm
- Node.js
