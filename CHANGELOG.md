# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Docusaurus site scaffold with real project identity (Russian title/tagline, navbar,
  footer, landing page, README) replacing the framework placeholder (closes #8).
- Digitization of the Bühler primer from the corrected reprint edition (Likhushina v2.0),
  complete at 48 of 48 lessons: consonant-stem declensions, vas-participles, composita,
  athematic conjugation classes II/III/V/VII/VIII/IX, the perfect, both futures, the
  aorists, and the desiderative/intensive/denominative stems.
- `guides/LESSON_AUTHORING.md`, the authoring standard the lesson pages follow: SLP1
  shorthand, RST grid tables, section layout, and heading anchors.
- `scripts/deva2slp1.mjs` Devanagari→SLP1 converter used for exercise blocks.
- `scripts/validate-slp1.mjs` and `scripts/align-rst-tables.mjs` (`npm run validate:slp1`,
  `npm run align`).
- Grammatical-term Sanskrit shorthand remark plugin (`__GTS_`) applied across lessons.
- Local full-text search.
- Vocabulary appended to the four dictionary TSVs (noun/verb/adjective/other) per lesson.
- CC BY 4.0 for the lesson text and dictionary data (`docs/`, `src/dictionary/`), with the
  attribution required on reuse; the site code and design stay with the maintainer.
- Dependabot config, and a workflow that auto-merges its non-major pull requests.

### Changed
- Docusaurus 3.9.1 → 3.10.2. `future.v4` now implies `fasterByDefault`, so
  `@docusaurus/faster` is a direct dependency; it also implies
  `mdx1CompatDisabledByDefault`, so `markdown.mdx1Compat.headingIds` is set explicitly to
  keep the `{#explicit-anchor}` heading syntax the lessons rely on.

### Fixed
- `noun.tsv` lesson-20 rows: dropped a duplicate id column that shifted every field and
  broke lesson-20 dictionary lookups.
- Dictionary rows for lessons 21–48 were written in IAST, but `Dictionary.tsx`
  transliterates `root`/`stem`/`word`/`entity` *from* SLP1, so they rendered as garbage
  Devanagari (भ्हर् for भर्, अउṣअद्ह for औषध); converted to SLP1.
- Reading passages in several lessons mixed Harvard-Kyoto into SLP1 (`R` for ṛ, `z` for ś,
  `S` for ṣ), which renders the wrong Devanagari and which `validate:slp1` does not catch.
- `align-rst-tables.mjs` rewrote grids it cannot model — a multi-row header or a colspan —
  silently dropping cells; it now leaves those untouched.
