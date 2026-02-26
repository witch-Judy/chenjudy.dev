# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Static personal portfolio/blog site built with **Astro v5**, **Tailwind CSS v4**, and **TypeScript**. No backend, no database, no external services required.

### Commands

Standard commands are in `README.md` and `package.json`. Key ones:

- **Dev server**: `pnpm dev` (runs on `localhost:4321`, base path `/chenjudy.dev`)
- **Lint**: `pnpm run lint` (ESLint)
- **Format check**: `pnpm run format:check` (Prettier)
- **Build**: `pnpm run build` (includes `astro check`, `astro build`, and `pagefind` indexing)
- **Preview**: `pnpm run preview`

### Gotchas

- The site uses base path `/chenjudy.dev`, so all local URLs are at `http://localhost:4321/chenjudy.dev/`.
- `pnpm-workspace.yaml` contains `onlyBuiltDependencies` for `esbuild`, `sharp`, and `@resvg/resvg-js` — these are required for native module builds. Without this, `pnpm install` will skip build scripts and image processing / OG image generation will fail.
- There are no automated tests (Playwright is a dependency but no test files exist).
- `format:check` may report pre-existing formatting issues; these are not regressions.
