export type Gender = "MALE" | "FEMALE" | "UNKNOWN";

/**
 * The genders a user can pick for themselves. UNKNOWN is only ever assigned by
 * the auth service when it cannot predict a gender from the account's name.
 */
export type SelectableGender = Exclude<Gender, "UNKNOWN">;

export type SetGenderRequest = {
	gender: SelectableGender;
};
