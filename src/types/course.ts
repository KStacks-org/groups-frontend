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
