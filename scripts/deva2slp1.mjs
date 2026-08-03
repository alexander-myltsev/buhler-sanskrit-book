// Convert Devanagari exercise text (from the reprint) to SLP1 for <Sanscript> blocks.
// Usage: node scripts/deva2slp1.mjs < input.txt
import Sanscript from '@indic-transliteration/sanscript';
import { readFileSync } from 'fs';

const input = readFileSync(0, 'utf-8');
for (const line of input.split(/\r?\n/)) {
    if (!line.trim()) { console.log(''); continue; }
    let slp = Sanscript.t(line.trim(), 'devanagari', 'slp1');
    // devanagari digits in verse numbers come out as arabic already via scheme;
    // normalize avagraha spacing artifacts none needed
    console.log(slp);
}
