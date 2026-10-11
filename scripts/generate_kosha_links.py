#!/usr/bin/env python3
"""Generate src/dictionary/kosha-links.tsv linking every glossary headword
(verb root, noun/adjective word, other entity) to its kosha per-lemma
static card, when one exists.

Kosha (H4833, kosha PR #557) serves per-lemma cards at
  https://gasyoun.github.io/kosha/w/<card_token>.html
where <card_token> is the headword's SLP1 spelling with every character
outside [a-z0-9] escaped as `_<lowercase-hex-byte>` (e.g. "kfzRa" ->
"kfz_52a", "Bagavat" -> "_42agavat").

Resolution checks the kosha checkout's w/ directory (the committed HTML
pages actually published to gh-pages), NOT docs/cards/ — docs/cards/
holds 50k+ card JSONs but only ~11k have a built w/<token>.html page as
of 2026-09-15; a card_token with a JSON and no HTML page 404s live
(confirmed live-probed, e.g. "saMdigDa" -> sa_4ddig_44a.json exists,
sa_4ddig_44a.html does not).

Resolution is an EXACT card_token(headword) match only. A hyphenated
preverb form ("A-gam") is deliberately NOT stripped to its bare root
("gam") before lookup: the bare-root card names a different lexeme
(gam "go" vs a-gam "come"), so a stripped-prefix match would link to
the wrong lemma. Those rows stay unresolved (reason "prefixed_no_card")
until kosha keys prefixed forms directly.

Sibling of generate_samskrtam_links.py (verb-root -> samskrtam.ru id);
this one covers all four glossary TSVs and prefers the kosha card,
falling back to the existing samskrtam.ru link for anything unresolved.

Usage:  python scripts/generate_kosha_links.py [--pages-dir DIR]
"""
import argparse
import csv
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

OUT_TSV = 'src/dictionary/kosha-links.tsv'

SOURCES = [
    ('src/dictionary/verb.tsv', 'root', 'verb'),
    ('src/dictionary/noun.tsv', 'word', 'noun'),
    ('src/dictionary/adjective.tsv', 'word', 'adjective'),
    ('src/dictionary/other.tsv', 'entity', 'other'),
]


def card_token(word: str) -> str:
    out = []
    for ch in word:
        if re.match(r'[a-z0-9]', ch):
            out.append(ch)
        else:
            out.append('_%02x' % ord(ch))
    return ''.join(out)


def load_published_pages(pages_dir: str) -> set:
    return {os.path.splitext(f)[0] for f in os.listdir(pages_dir)
            if f.endswith('.html')}


def resolve(headword: str, pages: set):
    tok = card_token(headword)
    return (tok, headword) if tok in pages else (None, None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pages-dir', default=None,
                     help='local kosha checkout w/ dir of published '
                          'per-lemma HTML pages (default: ../kosha/w '
                          'next to this repo)')
    args = ap.parse_args()

    pages_dir = args.pages_dir
    if not pages_dir:
        guess = os.path.join('..', 'kosha', 'w')
        if os.path.isdir(guess):
            pages_dir = guess
    if not pages_dir or not os.path.isdir(pages_dir):
        print('no kosha w/ pages dir found; pass --pages-dir', file=sys.stderr)
        sys.exit(1)

    pages = load_published_pages(pages_dir)
    print(f'{len(pages)} kosha pages indexed from {pages_dir}')

    rows_out = []
    resolved_n = 0
    unresolved_n = 0
    for path, col, dict_name in SOURCES:
        with open(path, encoding='utf-8') as f:
            rows = list(csv.DictReader(f, delimiter='\t'))
        for row in rows:
            headword = row[col].strip()
            if not headword:
                continue
            tok, matched = resolve(headword, pages)
            if tok:
                rows_out.append((dict_name, headword, tok, 'ok'))
                resolved_n += 1
            else:
                reason = 'no_card'
                if '-' in headword:
                    reason = 'prefixed_no_card'
                rows_out.append((dict_name, headword, '', reason))
                unresolved_n += 1

    with open(OUT_TSV, 'w', encoding='utf-8', newline='') as f:
        f.write('dictionary\theadword\tcard_token\tstatus\n')
        for dict_name, headword, tok, status in rows_out:
            f.write(f'{dict_name}\t{headword}\t{tok}\t{status}\n')

    total = resolved_n + unresolved_n
    print(f'{resolved_n}/{total} rows resolved to a kosha card -> {OUT_TSV}')
    print(f'{unresolved_n} rows fall back to samskrtam.ru / stay unlinked')


if __name__ == '__main__':
    main()
