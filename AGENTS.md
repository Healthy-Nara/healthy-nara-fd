# AGENTS.md — healthy-nara-fd

**Important:** Always respond to the user in **Myanmar (Burmese) language**.

## Commands

```sh
npm run dev      # Vite dev server with --host (network accessible)
npm run build    # Production build
npm run lint     # ESLint (flat config, .js/.jsx only)
npm run preview  # Preview production build
```

No test, typecheck, or formatter commands exist. No CI workflows.

## Architecture

- **React 19 SPA** via **Vite 8** — NOT Next.js. No SSR, no file-based routing.
- **react-router-dom v7** with `createBrowserRouter` (`src/App.jsx`). Routes: `/login` (PublicRoute), `/home` (ProtectedRoute), `/` (redirect).
- **Plain JavaScript (JSX)** — no TypeScript in source. `@types/react` are for IDE only; do not generate `.ts`/`.tsx` files.
- **No testing setup** — do not write test files.

## Critical known bug — token key mismatch

- Route guards in `src/App.jsx` check `localStorage.getItem("nara_token")`
- Login (`src/components/pages/Login.jsx:38`) stores `localStorage.setItem("token", ...)`
- After login, the user is redirected back to `/login` because the guard looks for the wrong key.
- Home (`src/components/pages/Home.jsx:12`) correctly reads `"token"`.

## Styling — Tailwind CSS v4

- Uses `@tailwindcss/vite` plugin (no `postcss.config.js`, no `tailwind.config.js`).
- Custom theme in `src/index.css` via `@theme inline {}`:
  - Fonts: `font-poppins`, `font-nato`
  - Colors: `text-primary` (#1cb89b), `text-secondry` (#48a0d8), `text-gary` (#4a494e), `text-border` (#ffffff)
- Google Fonts `@import` must appear **before** `@import "tailwindcss"` in CSS.
- `src/index.css` has commented-out `@font-face` blocks for local Poppins and AJ11 fonts (not active).

## API

- Axios calls to Railway backend (`https://healthy-nara-vouncher-api-production.up.railway.app`).
- Env vars: `import.meta.env.VITE_LOGIN_API`, `import.meta.env.VITE_DUTY_API`.
- Login: `POST` (no auth). Duty fetch: `GET` with `Authorization: Bearer <token>`.

## Content / i18n

- All UI text is in Burmese, stored in `src/data/data.js` as a static dictionary.
- Images live in `public/images/`, referenced as `/images/...`.
- Language dropdown exists in `Nav.jsx` but English content is not implemented.

## State management

- No external state library. Uses `useState`, `useEffect`, and `localStorage` directly.
- No React Context, no custom hooks.

## Layout

- `MainLayout` (`src/layouts/MainLayout.jsx`) is minimal — only renders `<Outlet />`.
- `Footer.jsx` exists in the tree but is unused / commented out.
