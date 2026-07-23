import Sanscript from '@indic-transliteration/sanscript';
import { createShorthandPlugin, makeTextSpan, type MdxNode } from './shorthand';

function makeSanskritTextSpan(term: string): MdxNode {
  const eqIndex = term.indexOf('=');
  if (eqIndex !== -1) {
    const slp1Part = term.slice(0, eqIndex);
    const translationPart = term.slice(eqIndex + 1);
    const devanagari = Sanscript.t(slp1Part, 'slp1', 'devanagari');
    return makeTextSpan(
      'sanskrit-text',
      `${devanagari}\u00A0${translationPart}`,
    );
  } else {
    const devanagari = Sanscript.t(term, 'slp1', 'devanagari');
    const iast = Sanscript.t(term, 'slp1', 'iast');
    return makeTextSpan('sanskrit-text', `${devanagari}\u00A0${iast}`);
  }
}

export default createShorthandPlugin({
  regex: /__S_(.+?)__/g,
  prefix: 'S_',
  makeSpan: makeSanskritTextSpan,
});
