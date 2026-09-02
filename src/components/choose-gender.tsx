import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth-user";
import type { SelectableGender, SetGenderRequest } from "@/types/gender";
import type { GroupsApiError } from "@/types/group";

const options: Array<{ value: SelectableGender; label: string }> = [
	{ value: "MALE", label: "Male" },
	{ value: "FEMALE", label: "Female" },
];

/**
 * Shown when the auth service could not predict a gender from the account name.
 * Course groups are gender-separated, so the app cannot show anything useful
 * until this is answered.
 */
export function ChooseGender() {
	const [selected, setSelected] = useState<SelectableGender | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();

	async function confirm() {
		if (!selected) return;

		setError(null);
		setIsSubmitting(true);
		try {
			const request: SetGenderRequest = { gender: selected };
			const { data } = await api.patch<AuthUser>("/auth/me", request);
			// seed the cache from the response rather than invalidating: this
			// notifies subscribers immediately, so the gate re-renders and this
			// prompt unmounts without a second round trip
			queryClient.setQueryData(["authUser"], data);
		} catch (caught) {
			setError(
				(isAxiosError<GroupsApiError>(caught) &&
					caught.response?.data.message) ||
					"Could not save your choice. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md border border-border bg-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<img
					src="/kgroups-light.svg"
					alt=""
					aria-hidden="true"
					className="block dark:hidden h-12 w-auto mx-auto mb-6"
				/>
				<img
					src="/kgroups-dark.svg"
					alt=""
					aria-hidden="true"
					className="hidden dark:block h-12 w-auto mx-auto mb-6"
				/>

				<h1 className="text-xl font-bold tracking-tight mb-6 text-center">
					Choose your gender
				</h1>

				<fieldset className="mb-4" disabled={isSubmitting}>
					<legend className="sr-only">Gender</legend>
					<div className="grid grid-cols-2 gap-3">
						{options.map((option) => (
							<label
								key={option.value}
								className={cn(
									"flex cursor-pointer items-center justify-center border px-4 py-3 text-sm font-medium transition-colors",
									"has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring",
									selected === option.value
										? "border-primary bg-primary/10 text-foreground"
										: "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<input
									type="radio"
									name="gender"
									value={option.value}
									checked={selected === option.value}
									onChange={() => setSelected(option.value)}
									className="sr-only"
								/>
								{option.label}
							</label>
						))}
					</div>
				</fieldset>

				<div className="mb-5 flex items-start gap-2.5 border border-destructive/30 bg-destructive/5 p-3">
					<LuTriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
					<p className="text-xs leading-relaxed text-destructive">
						This choice is permanent. Your gender cannot be changed once you
						confirm it, so make sure it is correct.
					</p>
				</div>

				{error && (
					<p className="mb-4 text-sm text-destructive" role="alert">
						{error}
					</p>
				)}

				<Button
					size="lg"
					className="w-full"
					disabled={!selected || isSubmitting}
					onClick={confirm}
				>
					{isSubmitting && <Spinner data-icon="inline-start" />}
					{isSubmitting ? "Saving..." : "Confirm"}
				</Button>
			</div>
		</main>
	);
}
