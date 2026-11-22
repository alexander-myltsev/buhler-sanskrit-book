# Bug hunt — buhler-sanskrit-book — 22.11.2026

_Created: 22-11-2026 · Last updated: 22-11-2026_

_Dr. Mārcis Gasūns_

Nightly bug hunt (MG ruling 26-09-2026: nightly, one repo, auto-fix HIGH). Executor: GLM 5.3 Flash (`glm-5.3-flash`). Scope: `scripts/`, `src/` (remark plugins + types), `.githooks/`, `.github/workflows/`, root configs (`docusaurus.config.ts`, `sidebars.ts`, `vitest.config.ts`, `package.json`, `.gitattributes`, `.pre-commit-config.yaml`) — ~5 000 LOC read in full. Skipped: `node_modules/`, `package-lock.json`, doc bodies (`docs/*.mdx` prose — tables touched only via the aligner's data path), vendored/dependency code.

Every finding below carries file:line and live evidence actually run on this box (macOS, clone `gasyoun/buhler-sanskrit-book`, `core.hooksPath=.githooks` wired, HEAD `4902602`).

**No stenogrammy/ paths exist in this repo** — 152-FZ fence trivially respected. No committed secrets found (sweep: `sk-`, `AKIA…`, `ghp_…`, `xox…`, PEM blocks, `api_key=` literals over all code dirs — 0 hits).

---

## Verified green (actually run this session)

| Gate | Result |
|---|---|
| `npx vitest run` | **26/26 passed** (4 files, incl. the live-network drift-guard) |
| `npx tsc --noEmit` | exit 0 — clean |
| `python3 -m py_compile scripts/*.py` | exit 0 — clean |
| `node --check scripts/align-rst-tables.mjs` | exit 0 — clean |
| Secrets sweep (code dirs) | 0 hits |
| `npm run align` idempotence over current `docs/` | "All rst-table grids already aligned" (run on a scratch copy, working tree untouched) |

---

## Findings (ranked)

### 🔴 HIGH-1 — Shared-main-tree commit guard is dead on macOS: canonical path is a Windows literal

**File:** [.githooks/pre-commit:23](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-commit#L23), comparison at [lines 25-28](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-commit#L25-L28)

The guard that refuses direct commits in the shared main clone (protection against the H214/H685 tree-intermix work-loss class) hardcodes:

```bash
CANONICAL_MAIN_TREE="C:/Users/user/Documents/GitHub/buhler-sanskrit-book"
```

This clone lives at `/Users/mac/Documents/GitHub/buhler-sanskrit-book`, and `core.hooksPath` **is** set to `.githooks` on it (verified: `git config core.hooksPath` → `.githooks`). The hook therefore *runs on every commit here* and *never blocks*: normalized `toplevel` = `/users/mac/documents/github/buhler-sanskrit-book` vs normalized `canonical` = `c:/users/user/documents/github/buhler-sanskrit-book` — never equal. A data-loss guard silently inert on one of the estate's two boxes is exactly the "dead config wiring" class.

**Live evidence (run this session):**

- `bash .githooks/pre-commit; echo $?` → `0`, **no output** — silent no-op in the shared main tree (a working guard exits 1 with a BLOCKED banner there).
- Normalized-path printout shows the two strings can never match on this box.
- Negative control: in a worktree the hook correctly exits 0 (and must keep doing so).
- Prior art: the Uprava original already fixed this exact defect in its own 26-09-2026 bughunt — [Uprava/.githooks/pre-commit](https://github.com/gasyoun/Uprava/blob/main/.githooks/pre-commit) adds `CANONICAL_MAIN_TREE_HOME="${HOME:-}/Documents/GitHub/<repo>"` (plus an env override) and blocks on a match against either. This repo's vendored copy predates/lacks it.

**Disposition: HIGH CODE bug — auto-fixed in this run** (port of the Uprava crossbox `$HOME`-twin pattern; the `C:/…` literal stays for the Windows box, the `$HOME` twin covers macOS; positive control = hook blocks in the main tree, negative controls = worktree pass + `ALLOW_MAIN_TREE_COMMIT=1` pass). Fix landed as a separate PR off fresh `origin/main`; see the `[Unreleased]` CHANGELOG bullet "typecheck-crossbox main-tree guard".

### 🟠 MEDIUM-1 — `npm run align` corrupts wrapped (multi-line) table cells

**File:** [scripts/align-rst-tables.mjs:81-95](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/scripts/align-rst-tables.mjs#L81-L95)

`modelFromGrid()` treats *every* empty value cell as a rowspan continuation (`cont[r][c] = body[r][c] === ''`, line 83). The canonical remark parser ([src/remark/rstTableParser.ts:96-105](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/src/remark/rstTableParser.ts#L96-L105)) instead joins all interior lines of a cell with spaces — the two disagree for any cell whose text wraps across lines, which real RST grid tables allow and the parser explicitly supports.

**Live evidence (synthetic wrapped cell run through the real script):**

```
+------+----------+
| Stem | Meaning  |
+======+==========+
| gac- | goes,    |
|      | moving   |
+------+----------+
```

→ after `node scripts/align-rst-tables.mjs`:

```
| gac- | goes,   |     ← gets an invented rowSpan=2 border merge
+      +---------+
|      | moving  |     ← "moving" became its own body row
```

One wrapped cell became two cells, and `gac-` gained a bogus rowspan — silent content corruption on a documented workflow (`npm run align` is in `package.json` scripts). Currently latent: all 40 content lines across the 11 `rst-table` blocks in `docs/` are single-line (census run this session), and `align` is idempotent on today's docs. Report only per the auto-fix fence (MEDIUM = no code edits).

### 🟠 MEDIUM-2 — 5 of 8 pre-push gates reference checker scripts this repo does not carry

**File:** [.githooks/pre-push](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push) — gates at [line 259](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push#L259) (`scripts/pre_push_queue_truth.py`), [288](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push#L288) (`scripts/changelog_unreleased_gate.py`), [313](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push#L313) (`scripts/pushed_conflict_markers.py`), [359](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push#L359) (`scripts/pre_push_main_line_gate.py`), [390](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push#L390) (`tools/build_test_manifest.py`); telemetry at [109-110](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push#L109-L110) (`scripts/guard_firing_log.py`); tag-reservation best-effort at [127](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.githooks/pre-push#L127) (`tools/cut_release.py`).

`ls scripts/` carries none of these files — each gate fails open with a per-push WARNING (by design "fail-open, but never silently", so the wiring itself is honest). Consequences measured by reading + one dry run: every push to `main` in this clone prints 2-3 WARNING lines of guard noise; the forced-push/rewind fail-closed protection (main-line gate) that the stale-base checker's own docstring leans on ("refused fail-closed by `scripts/pre_push_main_line_gate.py` check 2") **does not exist here**, so that backstop is prose-only; and the S27 guard-firing telemetry never records anything (`log_firing()` returns early when `guard_filing_log.py` is absent). Additionally gate 4's model (changelog_queue/ fragments) does not match this repo's CHANGELOG style (direct `[Unreleased]` bullets), so even a later vendoring of the checker would be inert policy-wise. Report only (MEDIUM): wiring/deployment decision, not a code defect.

### 🟡 LOW-1 — Undeclared runtime dependencies in the AST builder

**File:** [src/remark/rstTableAst.ts:2-4](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/src/remark/rstTableAst.ts#L2-L4)

`mdast-util-from-markdown`, `micromark-extension-mdxjs`, `mdast-util-mdx` are imported but absent from `package.json` `dependencies`/`devDependencies` (verified via `npm ls`: they resolve only through the `@docusaurus/core → @docusaurus/mdx-loader` transitive chain). Works today (build + tests green); breaks under a Dependabot major bump or npm dedupe change inside Docusaurus. Report only.

### 🟡 LOW-2 — CI skips typecheck on a stale justification

**File:** [.github/workflows/test.yml:13-17](https://github.com/gasyoun/buhler-sanskrit-book/blob/main/.github/workflows/test.yml#L13-L17)

The comment says `npm run typecheck` is deliberately not wired into CI because of "pre-existing, unrelated `tsc` errors" in `src/pages/`/`src/components/`. Those were fixed in v0.1.2 (H3603, see CHANGELOG) and `npx tsc --noEmit` exits 0 on today's HEAD (verified this session, including those paths — the files exist). The typecheck-in-CI coverage gap and the stale comment survive. Report only.

---

## Explicitly checked, no finding

- `scripts/pre_push_stale_base_check.py` (2 072 lines, read in full): exemption classes, budget/circuit-breaker paths, FF/non-FF gate, blame porcelain parsing, hunk line accounting — internally consistent; its assumptions hold under this repo's hook caller (`$local_sha $origin/<branch>`).
- `scripts/eol_census.py`: `-z` triple stride, cat-file streaming/pipe-deadlock thread, binary heuristic, ratchet logic in `--changed-since` mode — consistent; args match the hook caller.
- `scripts/changelog_released_headings.py`: the `CHANGELOG_GUARD_BASE` all-zero-sha `.strip('0 \t')` truthiness trick is safe (the original string is used for the actual base).
- `scripts/changelog_duplicate_bullets.py` + released-headings twin: both pass on this repo's changelog shape (CI green on main).
- `docusaurus.config.ts`, `sidebars.ts`, `vitest.config.ts`, `.gitattributes`, `.pre-commit-config.yaml`: no defects found. (`url`/`editUrl` still point at the upstream `alexander-myltsev` fork — metadata inherited from upstream, not a code bug.)

## Dispositions

- **HIGH-1: auto-fixed in this run** (MG ruling 26-09-2026 authorizes HIGH code fixes). No credential/infra HIGHs were found, so no GTD row was needed.
- MEDIUM-1, MEDIUM-2, LOW-1, LOW-2: report only, no code edits, per the run fences.

---

Elapsed (hunt + report): ~12 min wall. Fix phase followed in a separate PR off fresh `origin/main` (HIGH-1), landing the same night.
