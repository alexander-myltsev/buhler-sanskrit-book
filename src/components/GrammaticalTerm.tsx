import React from 'react';

interface GrammaticalTermProps {
    children?: string;
    text?: string;
}

/**
 * Component to display grammatical terms with appropriate styling
 * @param children - The grammatical term to display (for tag syntax)
 * @param text - The grammatical term to display (for prop syntax)
 */
const GrammaticalTerm: React.FC<GrammaticalTermProps> = ({children, text}) => {
    const content = text || children || '';
    return <span className="grammatical-term">{content}</span>;
};

export default GrammaticalTerm;
