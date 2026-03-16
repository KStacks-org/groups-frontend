import { Link } from "@tanstack/react-router";
import { getCourseIcon } from "@/lib/course-icons";
import type { Course } from "@/types/course";

interface SearchResultsItemProps {
	course: Course;
}

export function SearchResultsItem({ course }: SearchResultsItemProps) {
	const Icon = getCourseIcon(course.fullCode);

	return (
		<Link
			to="/courses/$courseId"
			params={{ courseId: course.id }}
			className="flex items-center gap-3 px-3 py-2 hover:bg-accent"
		>
			<Icon className="shrink-0 text-muted-foreground" size={20}/>
			<span className="text-xs font-mono font-medium">{course.fullCode}</span>
			<span
				className="text-xs text-muted-foreground text-end ml-auto"
				dir="rtl"
			>
				{course.title}
			</span>
		</Link>
	);
}
