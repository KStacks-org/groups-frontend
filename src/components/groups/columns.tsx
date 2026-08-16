import type { ColumnDef } from "@tanstack/react-table";
import type { Group } from "@/types/group";
import type { GroupsTableFeatures } from "./groups-table";

export const columns: ColumnDef<GroupsTableFeatures, Group>[] = [
    {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }) => {
            const { section, generalGroup, generalGroupMaleAndFemale } =
                row.original;
            if (generalGroupMaleAndFemale) return "General Group for both genders";
            if (generalGroup) return "General Group";
            return section;
        },
    },
    {
        accessorKey: "link",
        header: "Group Link",
        cell: ({ row }) => {
            const link = row.getValue<string>("link");
            return (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                >
                    Join Group
                </a>
            );
        },
    },
];
