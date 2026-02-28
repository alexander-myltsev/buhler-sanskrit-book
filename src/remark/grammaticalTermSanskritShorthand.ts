import Sanscript from '@indic-transliteration/sanscript';
import {createShorthandPlugin, type MdxNode} from './grammaticalTermShorthand';

function makeSanskritTermSpan(slp1Term: string): MdxNode {
    const devanagari = Sanscript.t(slp1Term, 'slp1', 'devanagari');
    const iast = Sanscript.t(slp1Term, 'slp1', 'iast');
    return {
        type: 'mdxJsxTextElement',
        name: 'span',
        attributes: [
            {type: 'mdxJsxAttribute', name: 'className', value: 'grammatical-term-sanskrit'},
        ],
        children: [
            {type: 'text', value: `${devanagari} (${iast})`},
        ],
    };
}

export default createShorthandPlugin({
    regex: /__GTS_(.+?)__/g,
    prefix: 'GTS_',
    makeSpan: makeSanskritTermSpan,
});
