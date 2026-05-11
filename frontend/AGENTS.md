<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Buyly Store Agent Notes

These notes are for AI/code agents working inside `frontend/`.

## Project Shape

- Next.js `16.2.4`, React `19.2.4`, TypeScript, App Router.
- Route groups:
  - `app/(guest)` for public pages.
  - `app/(customer)` for logged-in customer pages.
  - `app/(admin)` for logged-in admin pages.
- Shared components live in `components/`.
- shadcn/Radix-style primitives live in `components/ui/`.
- API/client state helpers live in `lib/`.
- Global theme tokens and Tailwind 4 setup live in `app/globals.css`.

## Before Editing Next Code

- Because this project uses Next 16, check `node_modules/next/dist/docs/` when touching framework-specific APIs, metadata, routing, caching, config, fonts, server/client boundaries, or build behavior.
- Preserve the App Router conventions already used in `app/`.
- Add `"use client"` only to components that need browser APIs, hooks, client state, event handlers, or animation libraries.
- Prefer server components by default for static/render-only pages.

## Commands

Run commands from `frontend/`:

- `npm run lint` - lint the frontend.
- `npm run build` - production build/type validation.
- `npm run dev` - local dev server.

Use `npm` because the repo has `package-lock.json`.

## Styling And UI

- Use Tailwind classes and the design tokens from `app/globals.css` (`bg-base`, `bg-surface`, `bg-elevated`, `text-text`, `text-text-bright`, `text-cyan`, `border-border`, etc.).
- Keep the cyber/terminal Buyly style: dark-first, thin borders, compact spacing, cyan accents, mono/display fonts.
- Prefer existing `components/ui/*` primitives before creating new low-level UI.
- Use `@phosphor-icons/react` for icons, matching the existing navbar.
- Keep layouts responsive and compact; check mobile states for nav, forms, and profile/customer pages.
- Avoid large unrelated redesigns when a focused change is requested.

## Data, Auth, And API

- Use `lib/api.ts` for backend requests so auth headers and credentials stay centralized.
- Use `useAuthStore` from `lib/auth-store.ts` for persisted session state.
- Use `useAuth` from `app/hooks/useAuth.ts` for auth workflows when appropriate.
- API base URL comes from `NEXT_PUBLIC_API_URL`, falling back to `http://localhost:5000/api`.
- Be careful using `window`, `localStorage`, or `document`; they require client components or client-only guards.

## Code Style

- Keep imports using the `@/` alias where the project already does.
- Keep TypeScript explicit at module boundaries, especially API payloads and shared data shapes.
- Prefer small, local components for repeated page sections.
- Do not introduce new state libraries, styling systems, or icon libraries without a clear need.
- Keep comments rare and useful.

## Safety

- Do not edit generated/cache files such as `.next/`, `node_modules/`, or `tsconfig.tsbuildinfo`.
- Do not overwrite `.env` files.
- Do not revert user changes unless explicitly asked.
- When fixing text, watch for mojibake in Polish labels and preserve proper UTF-8.

## Verification

- For most frontend changes, run `npm run lint`.
- Run `npm run build` when touching routing, server/client boundaries, config, metadata, or shared types.
- After visual/UI changes, start `npm run dev` and inspect the affected page in the browser when practical.
