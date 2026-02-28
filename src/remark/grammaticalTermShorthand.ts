import type {Node} from 'unist';
import {visit} from 'unist-util-visit';

type MdxNode = { type: string; name: string; attributes: unknown[]; children: unknown[] };

interface ShorthandConfig {
    regex: RegExp;
    prefix: string;
    makeSpan: (term: string) => MdxNode;
}

function makeTextSpan(className: string, term: string): MdxNode {
    return {
        type: 'mdxJsxTextElement',
        name: 'span',
        attributes: [
            {type: 'mdxJsxAttribute', name: 'className', value: className},
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

function expandTextWithPattern(value: string, config: ShorthandConfig): unknown[] {
    const parts: unknown[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    config.regex.lastIndex = 0;
    while ((match = config.regex.exec(value)) !== null) {
        if (match.index > lastIndex) {
            parts.push({type: 'text', value: value.slice(lastIndex, match.index)});
        }
        parts.push(config.makeSpan(match[1]));
        lastIndex = config.regex.lastIndex;
    }
    if (lastIndex < value.length) {
        parts.push({type: 'text', value: value.slice(lastIndex)});
    }
    return parts.length > 0 ? parts : [{type: 'text', value}];
}

interface ParentWithChildren {
    children: unknown[];
}

export function createShorthandPlugin(config: ShorthandConfig) {
    return () => (ast: Node) => {
        visit(ast, (node: { type?: string; value?: string; children?: unknown[] }) => {
            const parent = node as ParentWithChildren;
            if (!parent.children || !Array.isArray(parent.children)) return;

            const newChildren: unknown[] = [];
            for (const child of parent.children) {
                const c = child as { type?: string; value?: string; children?: unknown[] };
                const text = extractTextFromNode(c);
                if (text !== null && text.startsWith(config.prefix)) {
                    newChildren.push(config.makeSpan(text.slice(config.prefix.length)));
                } else if (c.type === 'text' && typeof c.value === 'string' && config.regex.test(c.value)) {
                    config.regex.lastIndex = 0;
                    newChildren.push(...expandTextWithPattern(c.value, config));
                } else {
                    newChildren.push(child);
                }
            }
            parent.children = newChildren;
        });
    };
}

export {makeTextSpan};
export type {MdxNode, ShorthandConfig};

export default createShorthandPlugin({
    regex: /__GT_(.+?)__/g,
    prefix: 'GT_',
    makeSpan: (term) => makeTextSpan('grammatical-term', term),
});
