# Lesson Authoring Guide

This document is the standard for composing a new lesson page. It defines the file structure, the shorthand notation for Sanskrit text, table format, and component usage.

## Overview

A lesson is an MDX file in `docs/` written in Russian with Sanskrit examples. Sanskrit is encoded in **SLP1** using concise shorthand notation (never raw `<Latin>` components), paradigm tables are **RST grid tables**, and every section is a real `##` heading so the page gets a local per-page TOC.

**Source fidelity:** this guide governs markup and encoding only. Bühler's own text is preserved as-is — his wording, topic numbering, notation (`>` vs `=`, printed signs like `:=` for the visarga), and abbreviation style (e.g. `__GT_Dat.__` vs `__GT_D.__` in prose) are never "normalized". Convert the encoding, keep the text.

---

## File Structure

```mdx
---
sidebar_position: N
---

import Sanscript from '@site/src/components/Sanscript';
import Latin from '@site/src/components/Latin';
import Dictionary from '@site/src/components/Dictionary';

УРОК N
======

## Грамматика

### 1. Первая тема

Text with __S_sanskrit__ and __GT_latin__ shorthand...

### 2. Вторая тема

...

## Словарь

### Глаголы

<Dictionary name="verb" format="$root $class_roman – $translation" lesson="N" />

### Существительные

<Dictionary name="noun" format="$word $gender – $translation" lesson="N" />

## Чтение

<Sanscript text="example sentences in SLP1" />

## Упражнения

Numbered translation sentences...
```

Rules:

- The title is a setext heading `УРОК N` with the lesson number in Roman numerals (`УРОК VI`).
- Import only the components the page actually uses (e.g. drop the `Latin` import when the lesson has no genuinely Latin material).
- The four top-level sections are always `## Грамматика`, `## Словарь`, `## Чтение`, `## Упражнения`, in that order.
- The grammar block opens with `## Грамматика`, followed by one `### 1. ...`, `### 2. ...` subheading per topic, keeping the book's own topic numbers — never renumber. A preamble topic the book gives no number stays an unnumbered `###` before `### 1. ...` (e.g. `### Таблица подъема гласных`). Never use bold text, `<u>...</u>` underlining, or escaped numbered paragraphs (`1\.`, `2\.`) as pseudo-headings — they get no anchor and are invisible to the TOC.
- Vocabulary goes under `## Словарь`, with one `### ...` subheading per part of speech (`### Глаголы`, `### Существительные`, `### Прилагательные`, `### Наречия`…).
- Reading sentences go under a `## Чтение` heading — never directly after the dictionaries.
- Each `<Sanscript>` reading block holds one line of connected sentences; use several consecutive blocks for a longer passage.

---

## Shorthand Notation System

### `__S_text__` — Sanskrit Text

Renders Sanskrit in Devanagari with IAST transliteration in parentheses.

**Input:** SLP1 transliteration
**Output:** `देव (deva)`

```mdx
__S_deva__
```

### `__S_text=explanation__` — Sanskrit with Custom Explanation

Renders Devanagari with a custom explanation instead of auto-generated IAST. Use it for morphological breakdowns.

**Input:** SLP1 + custom text after `=`
**Output:** `देवः (dev-aḥ)`

```mdx
__S_devaH=dev-aḥ__
```

Use the `=explanation` form only when it adds something over the auto-generated IAST (a morphological breakdown, a `(s)`/`(su)` marker, a translation). If the explanation would just repeat the IAST, use plain `__S_...__`: `__S_A__`, not `__S_A=ā__`; `__S_C__`, not `__S_C=ch__`.

### `__GT_term__` — Latin Grammatical Term

Renders Latin grammatical terms with special styling (green text).

```mdx
__GT_Nominativus__
__GT_Accusativus__
__GT_indicativus__
__GT_Nom.__
__GT_Acc.__
__GT_Instr.__
```

### `__GTS_term__` — Sanskrit Grammatical Term

Renders Sanskrit grammatical terms in Devanagari with IAST.

```mdx
__GTS_guRa__          → गुण (guṇa)
__GTS_vfdDi__         → वृद्धि (vṛddhi)
__GTS_saMDi__         → संधि (sandhi)
__GTS_parasmEpada__   → परस्मैपद (parasmēpada)
__GTS_Atmanepada__    → आत्मनेपद (ātmanepada)
__GTS_anusvAra__      → अनुस्वार (anusvāra)
```

**Canonical spellings:** always `__GTS_saMDi__` for sandhi — never `__GTS_sanDi__`.

---

## Sanskrit in Running Text

All Sanskrit words, roots, stems, and forms in grammar prose use `__S_` shorthand:

```mdx
Корни __S_kzip__-__S_kzipa__, __S_tud__-__S_tuda__
```

Single phonemes under discussion also use `__S_` shorthand, so they render in Devanagari (a trailing consonant gets a virama: `__S_n__` → न् (n)):

Always the plain form — the auto-generated IAST already spells the phoneme the familiar way, digraphs included: `__S_i__`, `__S_u__`, `__S_n__`, `__S_S__` (ś), `__S_z__` (ṣ), `__S_Y__` (ñ), `__S_R__` (ṇ), `__S_q__` (ḍ), `__S_w__` (ṭ), and equally `__S_J__` (jh), `__S_Q__` (ḍh), `__S_W__` (ṭh), `__S_T__` (th), `__S_C__` (ch). Never write the IAST out after `=` — `__S_C=ch__` renders exactly what `__S_C__` renders.

This applies inside headings too — `### 2. Существительные ср. р. на __S_u__`, not `... на u`. Unlike JSX, the shorthand is plain text at the Markdown level, so it survives into the heading and its local-TOC entry — but such a heading also needs an explicit anchor (see **Heading Anchors** below).

### `<Latin />` — Actual Latin Only

The `<Latin />` component is reserved for genuinely Latin material:

- Gender markers: `<Latin text="m" />`, `<Latin text="n" />`, `<Latin text="f" />`
- Latin grammatical terminology not in shorthand: `<Latin text="commodi"/>`, `<Latin text="partitivus"/>`

Never use it for Sanskrit words. Roman numerals (verb classes, lesson numbers) are plain text — `УРОК I`, `### Глаголы I класса` — they are numerals, not Latin words, and JSX inside a heading gets stripped from its anchor slug.

### Footnotes

Mark the annotated spot with an escaped asterisk (`\*`) directly after the word or example it qualifies, and put the note text — a paragraph starting with `\*` — immediately after the paragraph that carries the marker (not at the bottom of the section):

```mdx
а) Корни IV кл. на __S_iv__ удлиняют гласный\* перед признаком этого класса...

\* Корневые __S_i__ и __S_u__, за которыми следует группа согласных, начинающаяся с __S_r__
или __S_v__, удлиняются.
```

In a reading passage the marker goes **inside** the `<Sanscript>` text, directly after the word it annotates (the `*` passes through as a literal asterisk), and the `\*` note paragraph follows that block:

```mdx
<Sanscript text="sadA devAn smaranti. gfhaM* gacCAmaH." />

\* Конечный __S_m__ обыкновенно перед начальными согласными превращается в __GTS_anusvAra__ ...
```

### Sandhi Transformations

Show sandhi rules in shorthand, with the operator the book uses — `=` between the unmerged and merged spellings, `>` where the book shows a combination yielding a form:

```mdx
__S_nfpaH__ __S_atra__ = __S_nfpo__ '__S_tra__
__S_agni__ + __S_su__ > __S_agnizu__
```

Keep the original's choice per example — don't normalize `>` to `=` or vice versa.

---

## Heading Anchors

The shorthand plugins are registered as `beforeDefaultRemarkPlugins` in `docusaurus.config.ts`, so shorthand in a heading is already expanded when Docusaurus builds the local TOC — the TOC shows संधि saṃdhi, not a raw `GTS_saMDi`. The same expansion feeds the anchor slug, which would otherwise pick up Devanagari and diacritics (`#3-правила-संधिsaṃdhi`).

So **every heading containing `__S_`, `__GT_`, or `__GTS_` shorthand carries an explicit anchor**, appended as `{#...}`:

```mdx
### 3. Правила __GTS_saMDi__ {#3-правила-samdhi}
### 1. Существительные жен. р. на __S_A__ {#1-существительные-жен-р-на-a}
### 4. Удвоение начального __S_C__ {#4-удвоение-начального-ch}
### 1. __GT_Indic.__ __GT_Praes.__ __GTS_Atmanepada__ (__GT_Medium__) {#1-indic-praes-atmanepada-medium}
```

Slug convention — the shape Docusaurus would generate itself, with the Sanskrit spelled out in bare ASCII:

- Lowercase; spaces → `-`; drop `.`, `,`, parentheses and other punctuation. Keep the book's topic number as the first segment (`### 3. Правила …` → `3-правила-…`).
- Russian words stay Cyrillic, matching the auto-generated anchors of shorthand-free headings (`#грамматика`, `#словарь`, `#чтение`).
- `__S_`/`__GTS_` shorthand becomes its IAST with diacritics stripped: `__GTS_saMDi__` → `samdhi`, `__GTS_Atmanepada__` → `atmanepada`, `__GTS_parasmEpada__` → `parasmaipada`, `__S_A__` → `a`, `__S_E__` → `ai`, `__S_C__` → `ch`.
- `__GT_` terms are already Latin — lowercase them and drop the periods: `__GT_Indicativus praesens__` → `indicativus-praesens`, `__GT_Indic.__ __GT_Praes.__` → `indic-praes`.
- Anchors must be unique within a page. Distinct phonemes can collapse onto the same letter (`__S_a__` and `__S_A__` both give `a`), so keep the surrounding words and the topic number in the slug to separate them.

Headings without shorthand need no `{#...}` — their auto-generated slug is already clean. Never put JSX in a heading: it is stripped from the slug and serialises badly into the TOC.

---

## Paradigm Tables

Declension/conjugation paradigms are RST grid tables inside a ` ```rst-table ` fenced code block, rendered by the `remarkRstTable` plugin. Do **not** use HTML/JSX `<table>` markup or Markdown pipe tables.

````mdx
```rst-table
+-------------+------------------------------+------------------------------+
|             | Ед.ч.                        | Дв.ч.                        |
+=============+==============================+==============================+
| __GT_N.__   | __S_maDu__                   | __S_maDunI=madhu-n-ī__       |
+-------------+                              +                              +
| __GT_Acc.__ |                              |                              |
+-------------+------------------------------+------------------------------+
```
````

Conventions inside `rst-table` cells:

- Cells support the full MDX shorthand: `__S_...__`, `__S_...=breakdown__`, `__GT_...__`, `__GTS_...__`.
- Merge identical adjacent forms with grid spans (omit the `+---+` border / `|` separator) instead of repeating the form.
- Case labels go in the first column as `__GT_N.__`, `__GT_Acc.__`, `__GT_I.__`, `__GT_D.__`, `__GT_Abl.__`, `__GT_G.__`, `__GT_L.__`, `__GT_V.__`. If a header cell contains a word like «падеж», wrap it in `__GT_` shorthand too.
- Sandhi-affected forms are marked with `(s)` **inside** the shorthand's explanation part: `__S_maDuBiH=madhu-bhiḥ (s)__`, not `__S_maDuBiH=madhu-bhiḥ__ (s)`. The Loc. pl. ending marker `(su)` follows the same rule: `__S_devezu=dev-e-ṣu (su)__`, not `__S_devezu=dev-e-ṣu__ (__S_su__)`.
- After editing a table, realign the grid with `npm run align` (runs `scripts/align-rst-tables.mjs`).

---

## `<Sanscript>` Blocks

- Text is **SLP1 only**. SLP1 is the component's default source script — do not pass `from="slp1"` explicitly.
- Daṇḍas: use `.` for । and `..` for ॥. Never use `|` — in SLP1 it is not a daṇḍa and renders as a garbage retroflex ligature (ळ्ह्).
- Avagraha: use `'` (apostrophe), e.g. `nfpo 'tra`.
- No IAST, mixed-case leftovers, or stray annotations inside the `text` attribute. The one exception is a footnote `*` marker directly after a word (see Footnotes).
- Run `npm run validate:slp1` (`scripts/validate-slp1.mjs`) to catch IAST leftovers: it flags IAST digraphs (`bh`, `gh`, `dh`, `kh`, `ph`, `ch`, `th`, `Bh`…), IAST diphthongs (`ai`, `au` — in SLP1 these are `E`, `O`), and diacritic characters (ā, ṛ, ḥ…) in `<Sanscript text>` attributes and in the SLP1 part (before `=`) of `__S_`/`__GTS_` shorthands.

---

## Dictionary Component Usage

Vocabulary lives in the TSV files under `src/dictionary/` (`verb.tsv`, `noun.tsv`, `adjective.tsv`, `other.tsv`); the lesson page only renders it. Add the lesson's words to the TSVs with the lesson number, then reference them.

Preferred (single list per part of speech, class/gender shown inline):

| Type | Example |
|------|---------|
| Verbs | `<Dictionary name="verb" format="$root $class_roman – $translation" lesson="N" />` |
| Nouns | `<Dictionary name="noun" format="$word $gender – $translation" lesson="N" />` |
| Adjectives | `<Dictionary name="adjective" format="$word $gender – $translation" lesson="N" />` |
| Other (adverbs etc.) | `<Dictionary name="other" format="$entity – $translation" lesson="N" />` |

When a lesson needs split lists (by verb class, gender, or stem), use `tag` filtering and put the group marker before each list:

```mdx
### Глаголы VI класса

<Dictionary name="verb" format="$root ($stem-) – $translation" lesson="N" tag="VI" />

### Существительные

<Latin text="m" />

<Dictionary name="noun" format="$word – $translation" lesson="N" tag="m" />
```

---

## Упражнения (Exercises)

Russian sentences for translation into Sanskrit, one per paragraph. Word-order numbers go in parentheses after each word; grammatical hints use shorthand:

```mdx
Царь (4) дает (3) (обоим) людям (1) денег (2, __GT_Acc.__).

Вода (2, __S_vAri__, __S_jala__) (его) слез (1) орошает (4) (его) ноги (3).
```

- Case/number hints: `__GT_` shorthand — `(__GT_Acc.__)`, `(__GT_In.__)`.
- Sanskrit word hints: `__S_` shorthand — `(2, __S_rakz__ и __S_gup__)`.

---

## IAST to SLP1 Conversion Reference

| IAST | SLP1 | IAST | SLP1 |
|------|------|------|------|
| ā    | A    | ṃ    | M    |
| ī    | I    | ṅ    | N    |
| ū    | U    | ñ    | Y    |
| ṛ    | f    | ṇ    | R    |
| ṝ    | F    | ś    | S    |
| ḷ    | x    | ṣ    | z    |
| ḹ    | X    | ḥ    | H    |
| ai   | E    | th   | T    |
| au   | O    | dh   | D    |
| e    | e    | ph   | P    |
| o    | o    | bh   | B    |
| kh   | K    | ch   | C    |
| gh   | G    | jh   | J    |

**Note:** Consonants without diacritics remain the same (k, g, c, j, t, d, p, b, n, m, y, r, l, v, s, h).

### Common SLP1 Patterns

| Sanskrit | SLP1 |
|----------|------|
| agni | agni |
| deva | deva |
| devāḥ | devAH |
| phalam | Palam |
| guṇa | guRa |
| vṛddhi | vfdDi |
| sandhi | saMDi |
| ātmanepada | Atmanepada |
| parasmēpada | parasmEpada |
| anusvāra | anusvAra |
| visarga | visarga |
| kṣip | kzip |
| tud | tud |
| kṛṣ | kfz |
| dhū | DU |
| bhū | BU |

---

## Checklist for a New Lesson

- [ ] Frontmatter has `sidebar_position: N`; title is setext `УРОК N` (Roman numeral)
- [ ] Sections are `## Грамматика` / `## Словарь` / `## Чтение` / `## Упражнения`, in that order
- [ ] Grammar topics are `### 1. ...` subheadings under `## Грамматика` with the book's own numbers (unnumbered `###` preamble allowed; local TOC works)
- [ ] All Sanskrit in prose uses `__S_slp1__` / `__S_slp1=breakdown__` shorthand, including single phonemes (`__S_n__`, `__S_J__`); `=` only where it adds a breakdown, `(s)` marker or translation — never a copy of the auto IAST
- [ ] All grammatical terms use `__GT_` (Latin) / `__GTS_` (Sanskrit, canonical spellings — `saMDi`)
- [ ] Every heading containing shorthand has an explicit `{#...}` anchor (Cyrillic words kept, Sanskrit as bare ASCII IAST — `{#3-правила-samdhi}`), unique within the page
- [ ] Paradigms are ` ```rst-table ` blocks; `(s)` markers inside the shorthand; grid realigned with `npm run align`
- [ ] `<Latin />` used only for actual Latin (gender markers, terminology); Roman numerals are plain text
- [ ] Vocabulary added to the `src/dictionary/` TSVs and rendered via `<Dictionary lesson="N" />` under `## Словарь` with `### ` per part of speech
- [ ] Reading blocks under `## Чтение`; `<Sanscript>` text is clean SLP1, no `from` attribute
- [ ] Daṇḍas are `.` / `..`, never `|`; avagraha is `'`
- [ ] Exercises numbered with word-order hints; grammatical hints in `__GT_`/`__S_` shorthand
- [ ] Footnotes use `\*` markers with the note paragraph immediately after the paragraph that carries the marker
- [ ] Bühler's text preserved: wording, topic numbers, `>`/`=` notation, abbreviation style unchanged — only encoding converted
- [ ] SLP1 is clean: `npm run validate:slp1` reports no IAST leftovers
- [ ] Build passes: `npm run build`
