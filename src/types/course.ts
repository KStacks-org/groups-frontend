export interface Course {
	id: string;
	code: string;
	number: string;
	title: string;
	fullCode?: string;
	credits: number;
}

export interface GetCourseResponse {
	data: Course;
	status: string;
}

export interface CourseSection {
	id: string;
	sectionCode: string;
	branch: string | null;
}

export interface GetCourseSectionsResponse {
	data: CourseSection[];
	status: string;
}
