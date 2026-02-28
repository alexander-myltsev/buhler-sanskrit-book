import type {Node} from 'unist';
import {visit} from 'unist-util-visit';

const GT_REGEX = /__GT_(.+?)__/g;
const GT_PREFIX = 'GT_';

function makeGrammaticalTermSpan(term: string): { type: string; name: string; attributes: unknown[]; children: unknown[] } {
    return {
        type: 'mdxJsxTextElement',
        name: 'span',
        attributes: [
            {type: 'mdxJsxAttribute', name: 'className', value: 'grammatical-term'},
        ],
        children: [{type: 'text', value: term}],
    };
}

function extractTextFromNode(node: { type?: string; value?: string; children?: unknown[] }): string | null {
    if (node.type === 'text' && typeof node.value === 'string') return node.value;
    if (node.type === 'strong' && Array.isArray(node.children)) {
        const texts: string[] = [];
        for (const child of node.children) {
            const c = child as { type?: string; value?: string };
            if (c.type === 'text' && typeof c.value === 'string') texts.push(c.value);
        }
        return texts.join('');
    }
    return null;
}

function expandTextWithPattern(value: string): unknown[] {
    const parts: unknown[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    GT_REGEX.lastIndex = 0;
    while ((match = GT_REGEX.exec(value)) !== null) {
        if (match.index > lastIndex) {
            parts.push({type: 'text', value: value.slice(lastIndex, match.index)});
        }
        parts.push(makeGrammaticalTermSpan(match[1]));
        lastIndex = GT_REGEX.lastIndex;
    }
    if (lastIndex < value.length) {
        parts.push({type: 'text', value: value.slice(lastIndex)});
    }
    return parts.length > 0 ? parts : [{type: 'text', value}];
}

interface ParentWithChildren {
    children: unknown[];
}

export default function grammaticalTermShorthand() {
    return (ast: Node) => {
        visit(ast, (node: { type?: string; value?: string; children?: unknown[] }) => {
            const parent = node as ParentWithChildren;
            if (!parent.children || !Array.isArray(parent.children)) return;

            const newChildren: unknown[] = [];
            for (const child of parent.children) {
                const c = child as { type?: string; value?: string; children?: unknown[] };
                const text = extractTextFromNode(c);
                if (text !== null && text.startsWith(GT_PREFIX)) {
                    newChildren.push(makeGrammaticalTermSpan(text.slice(GT_PREFIX.length)));
                } else if (c.type === 'text' && typeof c.value === 'string' && GT_REGEX.test(c.value)) {
                    GT_REGEX.lastIndex = 0;
                    newChildren.push(...expandTextWithPattern(c.value));
                } else {
                    newChildren.push(child);
                }
            }
            parent.children = newChildren;
        });
    };
}
