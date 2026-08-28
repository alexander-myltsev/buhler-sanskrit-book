# Changelog

All notable changes to **buhler-sanskrit-book** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed

- **H3603 — typecheck true red fixed** (OxAlpha `glm-5.3-flash`, 28-08-2026).
  `npm run typecheck` exited 2 with three tsc errors (2× TS2307
  `Cannot find module '@theme/Heading'`, 1× TS2322 `title` on `@theme/Layout`
  Props). Root cause: only `@docusaurus/module-type-aliases`' reduced `@theme/*`
  declarations reached the tsc program — `theme-classic.d.ts` (which declares
  `@theme/Heading` and the full Layout `title`/`description` Props) was never
  included. Fix: `src/types/theme-classic.d.ts` pulling
  `/// <reference types="@docusaurus/theme-classic" />` into the program.
  Verified: `tsc` exit 0, lint_census green, vitest 26/26.

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
