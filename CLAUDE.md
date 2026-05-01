# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Crisp is a mobile-first PWA for daily communication practice. The user picks a "drill" (3–10 min exercise grounded in cited research), runs a timer, optionally logs a one-line observation, and builds a streak. v0.5 is intentionally drill-only — no recording, no AI feedback.

## Commands

```bash
npm run dev      # next dev (http://localhost:3000)
npm run build    # next build
npm run start    # production server
npm run lint     # eslint (eslint-config-next, flat config in eslint.config.mjs)
```

No test framework is configured.

## Environment

`.env.local` (or `.env`) must define:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Optional: `AUTH_DISABLED=true` makes the middleware skip the auth gate (useful when iterating on UI without a Supabase session).

## Architecture

### Stack
- **Next.js 16.2.2** App Router, **React 19.2.4**, **TypeScript** (`@/*` → `./src/*`)
- **Tailwind v4** via `@tailwindcss/postcss`. There is **no `tailwind.config.*`** — design tokens are declared in [src/app/globals.css](src/app/globals.css) using `@theme inline` (paper/ink neutrals, sky/gold accents, and per-category `cat-*` colors). Use these token classes (`bg-paper-dim`, `text-ink-muted`, `bg-cat-presence`, etc.), not raw hex.
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`) for auth (email OTP) and the `practice_logs` table.

### Data model: drills are code, logs and seeds are data
- All drill content (categories, durations, science citations, instructions, variations) lives in [src/lib/drills.ts](src/lib/drills.ts) as exported constants `CATEGORIES` and `DRILLS`. Adding/editing a drill = editing this file. Helpers: `getDrillById`, `getDrillsByCategory`, `getRandomDrill`, `formatDuration`.
- [src/app/drill/[id]/page.tsx](src/app/drill/[id]/page.tsx) calls `generateStaticParams()` over `DRILLS`, so each drill is statically generated at build time. New drill IDs only become routable after a rebuild.
- **Two Supabase tables:**
  - `practice_logs` — every drill completion (drives streak). Columns: `id`, `user_id`, `drill_id`, `drill_name`, `category`, `noticed` (nullable), `completed_at`. Read by [getStreak](src/lib/streak.ts) and [LogPage](src/app/log/page.tsx).
  - `seeds` — long-form writing artifacts. Columns: `id`, `user_id`, `body`, `source_drill_id` (nullable), `category` (nullable), `status` (enum: `seed` / `drafting` / `shipped` / `killed`), `created_at`, `updated_at`. Schema in [supabase/migrations/20260501_seeds.sql](supabase/migrations/20260501_seeds.sql). RLS enforces user-owned access; a trigger sets `updated_at` on every update.

### Drills with `producesSeed`
A `Drill` can opt into `producesSeed: true`. When set, [DrillView](src/components/DrillView.tsx) shows a larger writing area instead of the one-line "noticed" prompt, and `handleSave` writes both a `practice_logs` row (with `noticed = null`) and a `seeds` row. After save, the user is routed to `/seeds/[id]` to keep editing. The Writing category drills (`swap-test`, `generation-sprint`, `anchor-it`, `quadrant-audit`, `atomic-essay`) use this; `read-to-notice` and `levels-check` stay log-only.

### The Seeds surface
[src/app/seeds/](src/app/seeds/) is the writer's workshop — a separate surface from drills.
- [seeds/page.tsx](src/app/seeds/page.tsx) — server component, fetches the user's last 100 seeds ordered by `updated_at desc`, hands them to [SeedsClient](src/app/seeds/SeedsClient.tsx) which renders the list + "+ New" button (free-write — creates a blank seed and routes into the editor).
- [seeds/[id]/page.tsx](src/app/seeds/[id]/page.tsx) — server component fetches one seed (scoped to `auth.uid() = user_id` via RLS), [SeedEditor](src/app/seeds/[id]/SeedEditor.tsx) renders the textarea + status pills.
- **Autosave** — body changes debounce 1.5s then `update`. Status changes save immediately. Three states: `saved` / `saving` / `dirty`. There's no manual save button.
- Status enum is enforced by a Postgres CHECK constraint, so the client can't drift.

### Auth flow
- [src/app/login/page.tsx](src/app/login/page.tsx) — email + 6-digit OTP via `supabase.auth.signInWithOtp` then `verifyOtp({ type: "email" })`. Magic-link clicks would land on [src/app/auth/callback/route.ts](src/app/auth/callback/route.ts), which calls `exchangeCodeForSession`.
- [src/middleware.ts](src/middleware.ts) gates every non-static request. Public paths: `/login`, `/playbook`, `/auth/callback`. Everything else redirects to `/login` if `supabase.auth.getUser()` returns no user. `AUTH_DISABLED=true` short-circuits the gate. **Note:** Next.js 16 renamed middleware to `proxy.ts`; this repo still uses the legacy `middleware.ts` filename — preserve it unless you intentionally migrate.
- Two Supabase client factories. **Pick the right one:**
  - [src/lib/supabase/server.ts](src/lib/supabase/server.ts) — `await createClient()` from Server Components, Route Handlers, and `page.tsx`. Uses `next/headers` cookies. Its `setAll` is wrapped in try/catch because Server Components cannot write cookies — the middleware is what actually refreshes them.
  - [src/lib/supabase/client.ts](src/lib/supabase/client.ts) — `createClient()` (sync) from `"use client"` components.

### Server / Client split
- Pages that read auth state ([app/page.tsx](src/app/page.tsx), [app/log/page.tsx](src/app/log/page.tsx)) declare `export const dynamic = "force-dynamic"` and pass data into a client component (e.g. `HomeContent`) for interactivity. Follow this pattern when adding pages that need both `await createClient()` and `useState`.
- Auth failures in these pages are swallowed (`try/catch`) so the page still renders for unauthenticated users — the middleware is the single enforcement point.

### Streaks
[getStreak](src/lib/streak.ts) groups `practice_logs.completed_at` into distinct **UTC** date strings and walks backward from today/yesterday. Streak resets if the newest log is older than yesterday. Note: timezones are approximated via UTC — a user practicing late at night locally may see the date roll early.

### PWA
- Manifest is generated by [src/app/manifest.ts](src/app/manifest.ts) (served at `/manifest.webmanifest`).
- Service worker is **hand-written** at [public/sw.js](public/sw.js) and registered by [src/components/RegisterSW.tsx](src/components/RegisterSW.tsx) in the root layout. Strategy: network-first for navigations (caches `/drill/*` and `/playbook` for offline), cache-first for `/_next/*` and image/font assets. [next.config.ts](next.config.ts) sets `Cache-Control: no-cache` on `/sw.js` so updates ship immediately. **Bump `CACHE_NAME` in `sw.js`** when changing caching behavior so old caches get purged on activate.
- Middleware matcher excludes `sw.js`, `manifest.webmanifest`, icons, and svgs so they remain reachable without a session.

### Layout shell
[src/app/layout.tsx](src/app/layout.tsx) renders `<main>` + `<BottomNav>` + `<RegisterSW>` for every page. [BottomNav](src/components/BottomNav.tsx) is a 4-tab nav (Home / Log / Seeds / Playbook), hidden on `/login`. `pb-20` on `<main>` accounts for the fixed nav.

## Conventions

- Routes that need auth state → server component with `dynamic = "force-dynamic"` + delegate UI to a `"use client"` child.
- Icons are inline SVGs (no icon library). Match the existing `strokeWidth={1.5}` (nav) / `strokeWidth={2}` (chevrons/actions) style.
- Use the design-token utility classes from globals.css instead of raw colors. Category cards/badges read color from the `cat-{id}` token name stored on each `Category` in `drills.ts`.
- Drill `duration` is **seconds**; `formatDuration` renders it as `Nm` or `Nm Ss`.
