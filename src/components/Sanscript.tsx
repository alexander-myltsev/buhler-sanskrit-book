import React from 'react';
import Sanscript from '@indic-transliteration/sanscript';

interface SanscriptProps {
    children?: string;
    text?: string;
    from?: string;
    to?: string;
}

/**
 * Component to convert transliterated Sanskrit text to Devanagari script
 * @param children - The transliterated text (for tag syntax)
 * @param text - The transliterated text (for prop syntax)
 * @param from - Source transliteration scheme (default: 'slp1')
 * @param to - Target script (default: 'devanagari')
 */
const SanscriptComponent: React.FC<SanscriptProps> = ({
                                                          children,
                                                          text,
                                                          from = 'slp1',
                                                          to = 'devanagari'
                                                      }) => {
    const content = text || children || '';
    const converted = Sanscript.t(content, from, to);
    // Devanagari first, IAST after (issue #3) — sentence-level, so the
    // transliteration helps beginners without duplicating inline tokens
    // daṇḍas come out as '|' in the sanscript IAST scheme; render them as periods
    const iast = to === 'devanagari'
        ? Sanscript.t(content, from, 'iast').replace(/\|/g, '.')
        : null;
    return (
        <div className="sanscript-text" style={{fontSize: '1.2em', display: 'block', marginBottom: '1em'}}>
            {converted}
            {iast && <span className="sanscript-iast">{iast}</span>}
        </div>
    );
};

export default SanscriptComponent;
