import type { ColumnDef } from "@tanstack/react-table";
import type { Group } from "@/types/group";
import type { GroupsTableFeatures } from "./groups-table";

function GeneralGroupCell({ label, description }: { label: string; description: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400 ring-1 ring-inset ring-green-600/20 dark:ring-green-400/20">
                    General
                </span>
                <span className="font-medium text-sm">{label}</span>
            </div>
            <span className="text-xs text-muted-foreground">{description}</span>
        </div>
    );
}

export const columns: ColumnDef<GroupsTableFeatures, Group>[] = [
    {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }) => {
            const { section, generalGroup, generalGroupMaleAndFemale } =
                row.original;
            if (generalGroupMaleAndFemale)
                return (
                    <GeneralGroupCell
                        label="All students"
                        description="Open to both male and female students — not tied to a specific section"
                    />
                );
            if (generalGroup)
                return (
                    <GeneralGroupCell
                        label="Same gender"
                        description="Open to all students of the same gender — not tied to a specific section"
                    />
                );
            return <span className="text-sm">{section}</span>;
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
