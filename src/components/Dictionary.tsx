import React from 'react';
import Papa from 'papaparse';

import verbDictionary from '../dictionary/verb.tsv';
import nounDictionary from '../dictionary/noun.tsv';
import adjectiveDictionary from '../dictionary/adjective.tsv';
import otherDictionary from '../dictionary/other.tsv';

interface DictionaryProps {
    name: 'verb' | 'noun' | 'adjective' | 'other';
    lesson: string;
    tag?: string;
    format?: string;
}

function parseDictionaryTsv(tsvContent: string): Array<Record<string, string>> {
    const result = Papa.parse(tsvContent, {
        delimiter: '\t',
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => value.trim(),
        complete: (results) => {
            const criticalErrors = results.errors.filter(error =>
                error.type !== 'FieldMismatch' ||
                (error.type === 'FieldMismatch' && error.code !== 'TooFewFields')
            );
            if (criticalErrors.length > 0) {
                console.warn('Critical TSV parsing errors:', criticalErrors);
            }
        }
    });

    return result.data as Array<Record<string, string>>;
}

/**
 * Component to display dictionary entries from TSV files
 * @param name - The dictionary file name (verb, noun, adjective, or other)
 * @param lesson - The lesson to filter entries by (e.g., "lesson1")
 * @param tag - Optional secondary tag filter (e.g., "lesson3-VI")
 * @param format - Custom format string with column placeholders marked with $ (e.g., "$root - $translation")
 */
const Dictionary: React.FC<DictionaryProps> = ({name, lesson, tag, format}) => {
    if (!format) {
        return <div style={{color: 'red', fontWeight: 'bold'}}>Dictionary: no format provided</div>;
    }

    let tsvDictionaryContent: string;
    switch (name) {
        case 'verb':
            tsvDictionaryContent = verbDictionary;
            break;
        case 'noun':
            tsvDictionaryContent = nounDictionary;
            break;
        case 'adjective':
            tsvDictionaryContent = adjectiveDictionary;
            break;
        case 'other':
            tsvDictionaryContent = otherDictionary;
            break;
        default:
            return <div>Unknown dictionary: {name}</div>;
    }

    const allEntries = parseDictionaryTsv(tsvDictionaryContent);
    let filteredEntries = allEntries.filter(entry => entry.lesson === lesson);
    if (tag) {
        filteredEntries = filteredEntries.filter(entry => entry.tag === tag);
    }

    if (filteredEntries.length === 0) {
        const filterMessage = tag ? `lesson: ${lesson} and tag: ${tag}` : `lesson: ${lesson}`;
        return <div>No entries found for {filterMessage}</div>;
    }

    const getMainColumns = () => {
        switch (name) {
            case 'verb':
                return {sanskrit: 'root', translation: 'translation'};
            case 'noun':
                return {sanskrit: 'word', translation: 'translation'};
            case 'adjective':
                return {sanskrit: 'word', translation: 'translation'};
            case 'other':
                return {sanskrit: 'entity', translation: 'translation'};
            default:
                return {sanskrit: 'root', translation: 'translation'};
        }
    };

    const {sanskrit: sanskritColumn} = getMainColumns();

    const renderFormattedEntry = (entry: Record<string, string>, formatString: string) => {
        const placeholderRegex = /\$([a-zA-Z0-9_]+)/g;
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | [any, any];

        while ((match = placeholderRegex.exec(formatString)) !== null) {
            const [fullMatch, columnName] = match;
            const value = entry[columnName] || '';

            if (match.index > lastIndex) {
                const beforeText = formatString.slice(lastIndex, match.index);
                if (beforeText) {
                    parts.push(
                        <span key={`text-${parts.length}`} style={{color: 'inherit'}}>
                            {beforeText}
                        </span>
                    );
                }
            }

            if (columnName === sanskritColumn) {
                parts.push(
                    <span key={`placeholder-${parts.length}`} style={{color: '#88b4ff', fontWeight: '500'}}>
                        {value}
                    </span>
                );
            } else {
                parts.push(
                    <span key={`placeholder-${parts.length}`} style={{color: 'inherit'}}>
                        {value}
                    </span>
                );
            }

            lastIndex = match.index + fullMatch.length;
        }

        if (lastIndex < formatString.length) {
            const remainingText = formatString.slice(lastIndex);
            if (remainingText) {
                parts.push(
                    <span key={`text-${parts.length}`} style={{color: 'inherit'}}>
                        {remainingText}
                    </span>
                );
            }
        }

        return parts;
    };

    return (
        <div className="dictionary-list" style={{marginBottom: '1.5em'}}>
            {filteredEntries.map((entry, index) => (
                <div
                    key={entry.id || index}
                    style={{
                        marginBottom: '0.5em',
                        lineHeight: '1.4'
                    }}
                >
                    {renderFormattedEntry(entry, format)}
                </div>
            ))}
        </div>
    );
};

export default Dictionary;
