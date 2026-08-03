# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Docusaurus site scaffold with real project identity (Russian title/tagline, navbar,
  footer, landing page, README) replacing the framework placeholder (closes #8).
- Digitization of the Bühler primer from the corrected reprint edition (Likhushina v2.0),
  delivered lesson-by-lesson and in slices through lesson 40: consonant-stem declensions,
  vas-participles, composita, and athematic conjugation classes II/III/V/VII/VIII/IX.
  (Lessons 41–48, completing the primer, are in progress on a separate open PR.)
- `scripts/deva2slp1.mjs` Devanagari→SLP1 converter used for exercise blocks.
- Grammatical-term Sanskrit shorthand remark plugin (`__GTS_`) applied across lessons.
- Local full-text search.
- Vocabulary appended to the four dictionary TSVs (noun/verb/adjective/other) per lesson.

### Fixed
- `noun.tsv` lesson-20 rows: dropped a duplicate id column that shifted every field and
  broke lesson-20 dictionary lookups.
