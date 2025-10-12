import React from 'react';

interface LatinProps {
    children?: string;
    text?: string;
}

/**
 * Component to display Latin text with appropriate styling
 * @param children - The Latin text to display (for tag syntax)
 * @param text - The Latin text to display (for prop syntax)
 */
const Latin: React.FC<LatinProps> = ({children, text}) => {
    const content = text || children || '';
    return <span className="latin-text" style={{fontStyle: 'italic'}}>{content}</span>;
};

export default Latin;
