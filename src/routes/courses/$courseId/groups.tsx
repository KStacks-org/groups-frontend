import api from "@/lib/axios";
import { columns } from "@/components/groups/columns";
import { GroupsTable } from "@/components/groups/groups-table";
import { getCourseIcon } from "@/lib/course-icons";
import type { GetGroupsResponse } from "@/types/group";
import type { GetCourseResponse } from "@/types/course";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { LuArrowLeft, LuBookOpen } from "react-icons/lu";

export const Route = createFileRoute("/courses/$courseId/groups")({
	component: CourseGroupsPage,
});

function CourseGroupsPage() {
	const { courseId } = Route.useParams();

	const {
		data: course,
		isPending: isCourseLoading,
		isError: isCourseError,
	} = useQuery({
		queryKey: ["course", courseId],
		queryFn: async () => {
			const res = await api.get<GetCourseResponse>(
				`/catalog/courses/${courseId}`,
			);
			return res.data.data;
		},
	});

	const {
		data: groups = [],
		isPending,
		isError,
	} = useQuery({
		queryKey: ["groups", courseId],
		queryFn: async () => {
			const res = await api.get<GetGroupsResponse>(
				`/groups?courseId=${courseId}`,
			);
			return res.data.groups;
		},
	});

	const CourseIcon = course
		? getCourseIcon(course.fullCode ?? course.code)
		: LuBookOpen;

	return (
		<main className="flex-1 flex flex-col px-4 py-8 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Back navigation */}
			<Link
				to="/"
				className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors mb-6 w-fit"
			>
				<LuArrowLeft className="h-4 w-4" />
				Back to search
			</Link>

			{/* Course header */}
			<div className="mb-8">
				{isCourseLoading ? (
					<div className="space-y-2">
						<div className="h-5 w-32 animate-pulse bg-muted rounded-md" />
						<div className="h-8 w-80 animate-pulse bg-muted rounded-md" />
					</div>
				) : isCourseError || !course ? (
					<p className="text-destructive text-sm">
						Failed to load course details.
					</p>
				) : (
					<div className="flex items-start gap-4">
						<div className="mt-1 p-2.5 rounded-md bg-muted text-muted-foreground shrink-0">
							<CourseIcon size={22} />
						</div>
						<div>
							<div className="flex items-center gap-2 mb-1 flex-wrap">
								<span className="text-sm font-mono font-semibold text-green-600 dark:text-green-400">
									{course.fullCode ?? `${course.code} ${course.number}`}
								</span>
								<span className="text-xs text-muted-foreground px-2 py-0.5 border border-border rounded-full">
									{course.credits} cr
								</span>
							</div>
							<h1 className="text-2xl font-bold tracking-tight" dir="rtl">
								{course.title}
							</h1>
						</div>
					</div>
				)}
			</div>

			{/* Groups section */}
			<div>
				<h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wide mb-4">
					Available Groups
				</h2>

				{isPending ? (
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
							<div
								key={i}
								className="h-10 animate-pulse bg-muted rounded-md"
								style={{ animationDelay: `${i * 60}ms` }}
							/>
						))}
					</div>
				) : isError ? (
					<p className="text-destructive text-sm">Failed to load groups.</p>
				) : groups.length === 0 ? (
					<p className="text-muted-foreground text-sm">No groups found.</p>
				) : (
					<GroupsTable columns={columns} data={groups} />
				)}
			</div>
		</main>
	);
}
