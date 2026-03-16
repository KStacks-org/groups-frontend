import { useState } from "react";

import type { Course } from "@/types/course";

import { SearchResultsItem } from "@/components/search-results-item";

const INITIAL_LIMIT = 3;

interface SearchResultsProps {
    results: Course[];
    isLoading: boolean;
    query: string;
}

export function SearchResults({ results, isLoading, query }: SearchResultsProps) {
    const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
    const showAll = expandedQuery === query;

    if (!query) return null;

    const panelClass = "mt-1 w-full border border-input bg-popover shadow-md";

    if (isLoading) {
        return (
            <div className={panelClass}>
                <p className="text-xs text-muted-foreground text-center py-4">Searching...</p>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className={panelClass}>
                <p className="text-xs text-muted-foreground text-center py-4">No results for "{query}"</p>
            </div>
        );
    }

    const visible = showAll ? results : results.slice(0, INITIAL_LIMIT);
    const hasMore = results.length > INITIAL_LIMIT;

    return (
        <div className={panelClass}>
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-input">
                Suggested Results
            </p>
            {visible.map((course) => (
                <SearchResultsItem key={course.id} course={course} />
            ))}
            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpandedQuery(showAll ? null : query)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground py-2 border-t border-input transition-colors"
                >
                    {showAll ? "Show less" : `Show ${results.length - INITIAL_LIMIT} more`}
                </button>
            )}
        </div>
    );
}
