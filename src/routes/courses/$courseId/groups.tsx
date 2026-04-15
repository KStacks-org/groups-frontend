import api from "@/lib/axios";
import { columns } from "@/components/groups/columns";
import { GroupsTable } from "@/components/groups/groups-table";
import type { GetGroupsResponse } from "@/types/group";
import type { GetCourseResponse } from "@/types/course";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

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
            const res = await api.get<GetCourseResponse>(`/catalog/courses/${courseId}`);
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

	return (
		<main className="flex-1 flex flex-col px-4 py-8 max-w-5xl mx-auto w-full">
			<div className="mb-6">
				{isCourseLoading ? (
					<div className="h-16 animate-pulse bg-muted rounded-md" />
				) : isCourseError || !course ? (
					<p className="text-destructive text-sm">
						Failed to load course details.
					</p>
				) : (
					<div>
						<p className="text-sm text-muted-foreground mb-1">
							{`${course.code} ${course.number}`}
							{" · "}
							credits: {course.credits}
						</p>
						<h1 className="text-2xl font-bold">{course.title}</h1>
					</div>
				)}
			</div>
			<h2 className="text-lg font-semibold mb-4">Groups</h2>
			{isPending ? (
				<p className="text-muted-foreground text-sm">Loading...</p>
			) : isError ? (
				<p className="text-destructive text-sm">Failed to load groups.</p>
			) : groups.length === 0 ? (
				<p className="text-muted-foreground text-sm">No groups found.</p>
			) : (
				<GroupsTable columns={columns} data={groups} />
			)}
		</main>
	);
}
