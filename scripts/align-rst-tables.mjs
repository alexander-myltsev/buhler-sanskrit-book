#!/usr/bin/env node
// Re-align every ```rst-table grid in docs/*.mdx so the +/-/| borders match the
// cell contents. Edit cell text freely, then run `npm run align` — column widths
// are recomputed and merges (empty value cell = rowspan continuation) preserved.
import fs from 'node:fs';
import path from 'node:path';

const DOCS_DIR = 'docs';

// Serialize a cell model to an aligned RST grid table (vertical merges = rowSpan).
function serialize({ header, bodyRows }) {
  const C = header.length;
  const B = bodyRows.length;
  const occ = Array.from({ length: B }, () => new Array(C).fill(null));
  for (let r = 0; r < B; r++) {
    let ci = 0;
    for (const cell of bodyRows[r]) {
      while (occ[r][ci]) ci++;
      for (let rr = r; rr < r + cell.rowSpan; rr++)
        occ[rr][ci] = { cell, isStart: rr === r };
      ci++;
    }
  }
  const iw = new Array(C).fill(1);
  for (let c = 0; c < C; c++) {
    let w = header[c].text.length;
    for (let r = 0; r < B; r++) {
      const o = occ[r][c];
      if (o && o.isStart) w = Math.max(w, o.cell.text.length);
    }
    iw[c] = Math.max(1, w);
  }
  const S = iw.map((w) => w + 2);
  const border = (fill) =>
    '+' + iw.map((_, c) => fill(c).repeat(S[c])).join('+') + '+';
  const contentLine = (getText) =>
    '|' + iw.map((w, c) => ' ' + getText(c).padEnd(w) + ' ').join('|') + '|';
  const lines = [];
  lines.push(border(() => '-'));
  lines.push(contentLine((c) => header[c].text));
  lines.push(border(() => '='));
  for (let r = 0; r < B; r++) {
    lines.push(
      contentLine((c) =>
        occ[r][c] && occ[r][c].isStart ? occ[r][c].cell.text : '',
      ),
    );
    if (r < B - 1) {
      lines.push(
        border((c) => {
          const here = occ[r][c];
          const below = occ[r + 1][c];
          return here && below && below.cell === here.cell ? ' ' : '-';
        }),
      );
    } else {
      lines.push(border(() => '-'));
    }
  }
  return lines.join('\n');
}

// This aligner models only single-row headers and vertical merges. A grid with a
// multi-row header or a horizontal merge (colspan) cannot be represented by
// modelFromGrid, and rewriting it would silently drop cells — so such grids are
// left untouched. `remarkRstTable` renders them fine; keep them hand-aligned.
function isLossless(gridText) {
  const lines = gridText.split('\n');
  const content = lines.filter((l) => l.trimStart().startsWith('|'));
  if (content.length === 0) return false;
  const sepIdx = lines.findIndex(
    (l) => l.includes('=') && l.trimStart().startsWith('+'),
  );
  if (sepIdx !== -1) {
    const headerLines = lines
      .slice(0, sepIdx)
      .filter((l) => l.trimStart().startsWith('|'));
    if (headerLines.length > 1) return false; // multi-row header
  }
  const width = (l) => l.split('|').length;
  const w0 = width(content[0]);
  return content.every((l) => width(l) === w0); // any narrower row means a colspan
}

const splitRow = (line) =>
  line
    .split('|')
    .slice(1, -1)
    .map((s) => s.trim());

// Reconstruct a model from a (possibly misaligned) grid: cell text from content
// lines; an empty value cell continues the cell above it (rowSpan).
function modelFromGrid(gridText) {
  const rows = gridText
    .split('\n')
    .filter((l) => l.trimStart().startsWith('|'))
    .map(splitRow);
  const header = rows[0];
  const body = rows.slice(1);
  const C = header.length;
  const B = body.length;

  const cont = Array.from({ length: B }, () => new Array(C).fill(false));
  for (let c = 0; c < C; c++)
    for (let r = 1; r < B; r++) if (body[r][c] === '') cont[r][c] = true;

  const bodyRows = [];
  for (let r = 0; r < B; r++) {
    const row = [];
    for (let c = 0; c < C; c++) {
      if (cont[r][c]) continue;
      let rs = 1;
      while (r + rs < B && cont[r + rs][c]) rs++;
      row.push({ text: body[r][c], rowSpan: rs });
    }
    bodyRows.push(row);
  }
  return { header: header.map((t) => ({ text: t, rowSpan: 1 })), bodyRows };
}

let filesChanged = 0;
let blocksAligned = 0;
for (const name of fs.readdirSync(DOCS_DIR).sort()) {
  if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue;
  const file = path.join(DOCS_DIR, name);
  const src = fs.readFileSync(file, 'utf8');
  let n = 0;
  let skipped = 0;
  const out = src.replace(/```rst-table\n([\s\S]*?)```/g, (_full, grid) => {
    if (!isLossless(grid)) {
      skipped++;
      return _full;
    }
    n++;
    return '```rst-table\n' + serialize(modelFromGrid(grid)) + '\n```';
  });
  if (skipped)
    console.log(
      `skipped ${skipped} spanning grid${skipped === 1 ? '' : 's'} in ${name}` +
        ' (multi-row header or colspan — kept as written)',
    );
  if (out !== src) {
    fs.writeFileSync(file, out);
    filesChanged++;
    blocksAligned += n;
    console.log(`aligned ${name} (${n} table${n === 1 ? '' : 's'})`);
  }
}
console.log(
  filesChanged
    ? `\nDone: ${blocksAligned} table(s) realigned across ${filesChanged} file(s).`
    : 'All rst-table grids already aligned.',
);
