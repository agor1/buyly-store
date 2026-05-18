# Repository Guidelines

## Project Structure & Module Organization

This repository is split into two TypeScript applications:

- `backend/`: Express API, Prisma database layer, validation schemas, and services.
- `backend/src/controllers`, `routes`, `services`, `schemas`, `middleware`, `types`: keep API concerns separated by responsibility.
- `backend/prisma/`: Prisma schema and migrations.
- `frontend/`: Next.js app using the App Router.
- `frontend/app/`: route groups for guest, customer, and admin pages.
- `frontend/components/`: shared UI, layout, auth, product, cart, and motion components.
- `frontend/lib/`: API clients, stores, validators, schemas, and utility functions.

## Build, Test, and Development Commands

Install dependencies per app:

```bash
cd backend && npm install
cd frontend && npm install
```

Backend commands:

- `npm run dev`: generates Prisma client and runs `server.ts` with `tsx watch`.
- `npm run build`: generates Prisma client and compiles TypeScript to `dist/`.
- `npm start`: runs the compiled backend from `dist/server.js`.

Frontend commands:

- `npm run dev`: starts the Next.js development server.
- `npm run build`: creates the production Next.js build.
- `npm start`: serves the production build.
- `npm run lint`: runs ESLint with Next.js core web vitals and TypeScript rules.

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow the existing style: two-space indentation in JSON, semicolons in frontend config, named files by domain and role such as `product.service.ts`, `auth.routes.ts`, and `cart-store.ts`. React components use PascalCase exports from kebab-case or descriptive filenames. Keep backend validation in Zod schema files and avoid duplicating request validation in controllers.

## Testing Guidelines

There is no active automated test setup yet; `backend` has the default failing `npm test` placeholder and `frontend` has no test script. Until a test framework is added, verify changes with `npm run build` in the touched app and `npm run lint` for frontend changes. When adding tests, colocate them near the feature or use a clear `tests/` directory, and name files after the unit or route under test.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries with optional scopes, for example `fix: refactor product UI state and sort constants`, `frontend: add checkout success page`, and `frontend/backend: rebuild of cart and other small fixes`. Keep commits focused and mention the affected area first when useful.

Pull requests should include a concise description, testing performed, linked issues when applicable, and screenshots or screen recordings for visible frontend changes. Note any Prisma migration or environment variable changes explicitly.

## Security & Configuration Tips

Do not commit secrets or local `.env` files. Backend configuration is loaded through `backend/src/config/env.ts`; document any new required variable in the PR. Review Prisma migrations before merging and keep generated build output out of version control.

## Skill: Creating Git commits

The agent may prepare Git commits only after an explicit user request.

Valid trigger examples:

- "create commit"
- "commit changes"
- "commit this"
- "prepare commit"
- "make a commit"

Rules::

1. Before every commit, agent must show the user:

- the list of changed files,
- a short summary of changes,
- the proposed commit message

2. The agent must ask for confirmation before creating the commit, for example:

   > Czy zgadzasz się na utworzenie tego commita?

3. The agent may create the commit only after a clear user confirmation, such as:

- "tak"
- "commit"

4. If the user does not confirm, the agent mustn't create the commit.

5. The agent must never run `git push` without separate explicit confirmation from the user

6. Before running `git push`, the agent must show:

- the branch name,
- the latest commit,
- the remote repository,
- the exact command it plans to execute.

7. The agent may push changes only after a separate explicit confirmation from the user.

Preferred commit message format:

type(scope): short description

Examples:

feat(auth): add role middleware
fix(api): handle missing product id
refactor(store): simplify product service
docs(readme): update setup instructions

Allowed commit types:

- feat — new feature
- fix — bug fix
- refactor — code refactoring without behavior changes
- docs — documentation changes
- style — formatting/style changes
- test — tests
- chore — maintenance/technical changes
- build — build system/config changes
- ci — CI/CD changes

## Skill: Writing and Updating Documentation

The agent must update or create documentation only when explicitly requested by the user.

Valid trigger examples:

- "update documentation"
- "update docs"
- "generate docs"
- "refresh README"
- "document this"
- "sync documentation"

Rules:

1. The agent must NOT modify documentation automatically after code changes.

2. Documentation updates happen only after an explicit user request.

3. When triggered, the agent should update relevant documentation files, including:
   - `README.md`
   - API documentation
   - setup instructions
   - environment variable documentation
   - changelogs

4. Documentation should be:
   - concise,
   - accurate,
   - structured,
   - beginner-friendly.

5. The agent should include:
   - practical examples,
   - setup instructions,
   - usage examples,
   - configuration details when relevant.

6. Before applying documentation changes, the agent should provide:
   - affected files,
   - summary of changes,
   - proposed documentation sections.

7. Documentation changes should follow the existing project style and formatting conventions.

Preferred documentation structure:

```md
# Title

## Overview

## Installation

## Usage

## Configuration

## API

## Troubleshooting
```

Documentation principles:

Prefer clarity over cleverness.
Prefer examples over theory.
Keep documentation synchronized with the codebase.
