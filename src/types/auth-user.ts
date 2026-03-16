import type { Gender } from "@/types/gender";

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	gender: Gender;
}