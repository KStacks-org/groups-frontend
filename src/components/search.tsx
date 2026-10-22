import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SearchInput } from "@/components/search-input";
import { SearchResults } from "@/components/search-results";
import api from "@/lib/axios";

import type { Course } from "@/types/course";

async function fetchCourses(query: string): Promise<Course[]> {
	const res = await api.get<{ data: Course[] }>("/catalog/courses", {
		params: { q: query, termCode: import.meta.env.VITE_CATALOG_TERM_CODE },
	});
	return res.data.data;
}

export function Search() {
	const [searchQuery, setSearchQuery] = useState("");

	const {
		data: results = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["courses", import.meta.env.VITE_CATALOG_TERM_CODE, searchQuery],
		queryFn: () => fetchCourses(searchQuery),
		enabled: !!searchQuery,
	});

	return (
		<div className="relative w-full max-w-3xl">
			<SearchInput setSearchQuery={setSearchQuery} />
			{isError ? (
				<div className="mt-1 border rounded-sm p-2">
					<p className="text-xs text-destructive text-center py-2">
						Something went wrong. Please try again.
					</p>
				</div>
			) : (
				<SearchResults
					results={results}
					isLoading={isLoading}
					query={searchQuery}
				/>
			)}
		</div>
	);
}
