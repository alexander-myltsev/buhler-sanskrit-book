# Lesson Authoring Guide

This document is the standard for composing a new lesson page. It defines the file structure, the shorthand notation for Sanskrit text, table format, and component usage.

## Overview

A lesson is an MDX file in `docs/` written in Russian with Sanskrit examples. Sanskrit is encoded in **SLP1** using concise shorthand notation (never raw `<Latin>` components), paradigm tables are **RST grid tables**, and every section is a real `##` heading so the page gets a local per-page TOC.

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
- The grammar block opens with `## Грамматика`, followed by one numbered `### 1. ...`, `### 2. ...` subheading per topic. Never use bold text, `<u>...</u>` underlining, or escaped numbered paragraphs (`1\.`, `2\.`) as pseudo-headings — they get no anchor and are invisible to the TOC.
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

Use the `=explanation` form only when it adds something over the auto-generated IAST (a morphological breakdown, a `(s)`/`(su)` marker, a translation). If the explanation would just repeat the IAST, use plain `__S_...__`: `__S_A__`, not `__S_A=ā__`.

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

- Simple phonemes — plain form: `__S_i__`, `__S_u__`, `__S_n__`, `__S_S__` (ś), `__S_z__` (ṣ), `__S_Y__` (ñ), `__S_R__` (ṇ), `__S_q__` (ḍ), `__S_w__` (ṭ).
- Aspirates and other phonemes whose IAST is a digraph — use the `=explanation` form so the reader sees the familiar IAST: `__S_J=jh__`, `__S_Q=ḍh__`, `__S_W=ṭh__`, `__S_T=th__`, `__S_C=ch__`.

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

### Sandhi Transformations

Show sandhi rules with `=` between the unmerged and merged forms, in shorthand:

```mdx
__S_nfpaH__ __S_atra__ = __S_nfpo__ '__S_tra__
```

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
- No IAST, mixed-case leftovers, or stray annotations inside the `text` attribute.
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
- [ ] Grammar topics are numbered `### 1. ...` subheadings under `## Грамматика` (local TOC works)
- [ ] All Sanskrit in prose uses `__S_slp1__` / `__S_slp1=breakdown__` shorthand, including single phonemes (`__S_n__`; aspirates as `__S_J=jh__`)
- [ ] All grammatical terms use `__GT_` (Latin) / `__GTS_` (Sanskrit, canonical spellings — `saMDi`)
- [ ] Paradigms are ` ```rst-table ` blocks; `(s)` markers inside the shorthand; grid realigned with `npm run align`
- [ ] `<Latin />` used only for actual Latin (gender markers, terminology); Roman numerals are plain text
- [ ] Vocabulary added to the `src/dictionary/` TSVs and rendered via `<Dictionary lesson="N" />` under `## Словарь` with `### ` per part of speech
- [ ] Reading blocks under `## Чтение`; `<Sanscript>` text is clean SLP1, no `from` attribute
- [ ] Daṇḍas are `.` / `..`, never `|`; avagraha is `'`
- [ ] Exercises numbered with word-order hints; grammatical hints in `__GT_`/`__S_` shorthand
- [ ] Footnotes use `\*` markers with the note paragraph immediately after the paragraph that carries the marker
- [ ] SLP1 is clean: `npm run validate:slp1` reports no IAST leftovers
- [ ] Build passes: `npm run build`
