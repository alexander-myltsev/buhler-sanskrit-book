_Created: 31-07-2026 · Last updated: 05-09-2026_

# Changelog

All notable changes to **buhler-sanskrit-book** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Nightly bug hunt 22-11-2026** (GLM 5.3 Flash `glm-5.3-flash`, 22-11-2026).
  Static hunt over `scripts/`, `src/`, `.githooks/`, `.github/`: 1 HIGH (shared-main-tree
  pre-commit guard dead on macOS — Windows-only canonical path; auto-fixed in a
  follow-up PR the same night), 2 MEDIUM (aligner corrupts wrapped table cells;
  5 of 8 pre-push gates reference checkers absent from this repo) and 2 LOW
  (undeclared mdast/mdx runtime deps; stale typecheck-skip justification in CI)
  report-only; 26/26 tests, `tsc`, `py_compile`, `node --check` green.
  Findings: [BUGHUNT-FINDINGS-buhler-sanskrit-book-22.11.2026.md](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/BUGHUNT-FINDINGS-buhler-sanskrit-book-22.11.2026.md).

## [0.1.2] - 2026-08-28

### Fixed

- **H3603 — typecheck true red fixed (dual-run adjudicated)** (OxAlpha
  `glm-5.3-flash`, 28-08-2026). `npm run typecheck` exited 2 with three tsc
  errors (2× TS2307 `Cannot find module '@theme/Heading'`, 1× TS2322 `title`
  on `@theme/Layout` Props). Root cause: only
  `@docusaurus/module-type-aliases`' reduced `@theme/*` declarations reached
  the tsc program — `theme-classic.d.ts` (which declares `@theme/Heading` and
  the full Layout `title`/`description`/`noFooter`/`wrapperClassName` Props)
  was never included. Fix: `src/types/theme-classic.d.ts` pulling
  `/// <reference types="@docusaurus/theme-classic" />` into the program;
  the parallel hand-rolled declarations from PR #18
  (`src/types/docusaurus.d.ts`) are superseded by the upstream canonical set
  (their optional-`as` Heading Props would conflict with theme-classic's
  required-`as` under declaration merging). Verified: `tsc` exit 0,
  lint_census green, vitest 26/26.

## [0.1.1] - 2026-08-24


### Changed

- **H2820 — CLAUDE.md truth-pass** (Grok 4.6 `grok-4.6`, 16-08-2026). What this
  repo is (Docusaurus site for Bühler's 20 Russian lessons), how to run
  (`npm start` / `build` / `typecheck`), do-not-touch (`build/`, second
  dictionary parser; keep `rstTable*` in sync with SanskritGrammar). AGENTS.md
  twin regenerated.
## [0.1.0] - 2026-07-31

### Added
- **Initial changelog** (H2012 Phase F residual, Grok 4.5 `grok-4.5`): records current
  repository state after 85 commits since first recorded commit (2025-10-11). Historical
  detail was not reconstructed commit-by-commit; see `git log` for the full trail.

_Dr. Mārcis Gasūns_
