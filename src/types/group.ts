export type Group = {
	id: string;
	section: string | null;
	link: string;
	generalGroup: boolean;
	generalGroupMaleAndFemale: boolean;
};

export type GetGroupsResponse = {
	groups: Group[];
};

export type GeneralGroupType =
	| "GENERAL"
	| "GENERAL_MALE_ONLY"
	| "GENERAL_FEMALE_ONLY";

export type AddGroupRequest = {
	courseId: string;
	groupLink: string;
} & (
	| { groupType: GeneralGroupType; sectionId?: never }
	| { sectionId: string; groupType?: never }
);

export type AddGroupResponse = {
	id: string;
	link: string;
};

export type GroupsApiError = {
	timestamp: string;
	status: number;
	error: string;
	code: string;
	message: string;
	path: string;
};
