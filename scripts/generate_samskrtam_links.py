#!/usr/bin/env python3
"""Generate src/dictionary/samskrtam-verb-links.tsv from https://samskrtam.ru/z/.

The samskrtam.ru verb-root dictionary addresses entries by numeric id
(/z/verb.php?id=N), so linking glossary headwords (issue #2) needs a static
root -> id table. This script scrapes the index once, resolves every root in
src/dictionary/verb.tsv against it and writes the mapping consumed by
src/components/Dictionary.tsx.

Resolution order per root:
  1. exact match ("gam")
  2. bare root after stripping preverbs ("a-gam" -> "gam")
  3. zero-grade of the bare root ("kar" -> "kṛ") - Buhler cites some roots in
     full grade, samskrtam.ru in zero grade
  4. manual alias table for spelling differences ("pracch" -> "prach")

Roots that resolve nowhere are listed in the report and simply stay unlinked
in the UI.

Usage:  python scripts/generate_samskrtam_links.py
"""
import csv
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

INDEX_URL = 'https://samskrtam.ru/z/'
VERB_TSV = 'src/dictionary/verb.tsv'
OUT_TSV = 'src/dictionary/samskrtam-verb-links.tsv'

# Buhler citation form -> samskrtam.ru citation form
ALIASES = {
    'dhyai': 'dhyā',
    'div': 'dīv',
    'pracch': 'prach',
    'marg': 'mārg',
    'kalp': 'kḷp',
}


def scrape_index():
    """Return {iast_root: id} from the /z/ verb index table."""
    html = urllib.request.urlopen(INDEX_URL).read().decode('utf-8')
    rows = re.findall(
        r"<tr><td><a href='/z/verb\.php\?id=(\d+)'.*?>.*?</a></td>\s*(.*?)</tr>",
        html, re.S)
    mapping = {}
    for id_, rest in rows:
        tds = re.findall(r'<td>(.*?)</td>', rest, re.S)
        # second cell is the clean IAST citation, e.g. "1 as" or "1 aś, aṃś"
        raw = re.sub(r'^\d+\s+', '', tds[1].strip())
        for variant in (v.strip() for v in raw.split(',')):
            if variant and variant not in mapping:
                mapping[variant] = id_
    return mapping


def candidates(root):
    yield root
    bare = root.split('-')[-1]
    if bare != root:
        yield bare
    if 'ar' in bare:
        yield bare.replace('ar', 'ṛ')
    if root in ALIASES:
        yield ALIASES[root]
    if bare in ALIASES:
        yield ALIASES[bare]


def main():
    mapping = scrape_index()
    print(f'scraped {len(mapping)} roots from {INDEX_URL}')

    with open(VERB_TSV, encoding='utf-8') as f:
        buhler_roots = sorted({row['root'].strip()
                               for row in csv.DictReader(f, delimiter='\t')})

    resolved, unresolved = [], []
    for root in buhler_roots:
        for cand in candidates(root):
            if cand in mapping:
                resolved.append((root, mapping[cand], cand))
                break
        else:
            unresolved.append(root)

    with open(OUT_TSV, 'w', encoding='utf-8', newline='') as f:
        f.write('root\tsamskrtam_id\tsamskrtam_root\n')
        for root, id_, cand in resolved:
            f.write(f'{root}\t{id_}\t{cand}\n')

    print(f'{len(resolved)}/{len(buhler_roots)} roots resolved -> {OUT_TSV}')
    if unresolved:
        print('unresolved (left unlinked):', ', '.join(unresolved))


if __name__ == '__main__':
    main()
