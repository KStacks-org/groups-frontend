import api from "@/lib/axios";
import { columns } from "@/components/groups/columns";
import { GroupsTable } from "@/components/groups/groups-table";
import type { GetGroupsResponse } from "@/types/group";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/$courseId/groups")({
    component: CourseGroupsPage,
});

function CourseGroupsPage() {
    const { courseId } = Route.useParams();

    const { data: groups = [], isPending, isError } = useQuery({
        queryKey: ["groups", courseId],
        queryFn: async () => {
            const res = await api.get<GetGroupsResponse>(
                `/groups?courseId=${courseId}`
            );
            return res.data.groups;
        },
    });

    return (
        <main className="flex-1 flex flex-col px-4 py-8 max-w-5xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-6">Groups</h1>
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
