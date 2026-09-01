import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import type { GetCourseSectionsResponse } from "@/types/course";
import type {
	AddGroupRequest,
	AddGroupResponse,
	GroupsApiError,
} from "@/types/group";

const addGroupSchema = z
	.object({
		groupLink: z
			.string()
			.trim()
			.url("Enter a valid WhatsApp group link")
			.regex(/^https:\/\/chat\.whatsapp\.com\//, "Use a WhatsApp invite link")
			.refine(
				(value) => value.split("?")[0].length === 48,
				"WhatsApp invite links must be 48 characters",
			),
		groupType: z.enum([
			"GENERAL",
			"GENERAL_MALE_ONLY",
			"GENERAL_FEMALE_ONLY",
			"SECTION",
		]),
		sectionId: z.string(),
	})
	.superRefine((value, context) => {
		if (value.groupType === "SECTION" && !value.sectionId) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["sectionId"],
				message: "Select a section",
			});
		}
	});

type AddGroupValues = z.infer<typeof addGroupSchema>;

const groupTypeItems = [
	{ value: "SECTION", label: "Course section" },
	{ value: "GENERAL", label: "Both genders" },
	{ value: "GENERAL_MALE_ONLY", label: "Male only" },
	{ value: "GENERAL_FEMALE_ONLY", label: "Female only" },
] satisfies Array<{ value: AddGroupValues["groupType"]; label: string }>;

export function AddGroupDialog({ courseId }: { courseId: string }) {
	const [open, setOpen] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const { data: sections = [], isPending: isSectionsPending } = useQuery({
		queryKey: ["courseSections", courseId],
		enabled: open,
		queryFn: async () => {
			const response = await api.get<GetCourseSectionsResponse>(
				`/catalog/courses/${courseId}/sections`,
			);
			return response.data.data;
		},
	});

	const form = useForm({
		defaultValues: {
			groupLink: "",
			groupType: "SECTION" as AddGroupValues["groupType"],
			sectionId: "",
		},
		validators: { onSubmit: addGroupSchema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);
			try {
				const request: AddGroupRequest = {
					courseId,
					groupLink: value.groupLink,
					...(value.groupType === "SECTION"
						? { sectionId: value.sectionId }
						: { groupType: value.groupType }),
				};
				await api.post<AddGroupResponse>("/groups", request);
				await queryClient.invalidateQueries({ queryKey: ["groups", courseId] });
				form.reset();
				setOpen(false);
			} catch (error) {
				setSubmitError(
					(isAxiosError<GroupsApiError>(error) &&
						error.response?.data.message) ||
						"Could not add this group. Please try again.",
				);
			}
		},
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					form.reset();
					setSubmitError(null);
				}
			}}
		>
			<DialogTrigger render={<Button size="sm" />}>Add group</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add a group</DialogTitle>
					<DialogDescription>
						Share a WhatsApp invite link with students in this course.
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-5"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field name="groupType">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Group type</FieldLabel>
									<Select
										items={groupTypeItems}
										value={field.state.value}
										onValueChange={(value) =>
											field.handleChange(value as AddGroupValues["groupType"])
										}
									>
										<SelectTrigger id={field.name} className="w-full">
											<SelectValue placeholder="Choose a group type" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{groupTypeItems.map((item) => (
													<SelectItem key={item.value} value={item.value}>
														{item.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>
							)}
						</form.Field>

						<form.Subscribe selector={(state) => state.values.groupType}>
							{(groupType) =>
								groupType === "SECTION" && (
									<form.Field name="sectionId">
										{(field) => (
											<Field data-invalid={field.state.meta.errors.length > 0}>
												<FieldLabel htmlFor={field.name}>Section</FieldLabel>
												<Select
													items={sections.map((section) => ({
														value: section.id,
														label: `${section.sectionCode}${section.branch ? ` - ${section.branch}` : ""}`,
													}))}
													value={field.state.value || null}
													onValueChange={(value) =>
														field.handleChange(value ?? "")
													}
												>
													<SelectTrigger
														id={field.name}
														className="w-full"
														disabled={isSectionsPending}
													>
														<SelectValue
															placeholder={
																isSectionsPending
																	? "Loading sections..."
																	: "Choose a section"
															}
														/>
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{sections.map((section) => (
																<SelectItem key={section.id} value={section.id}>
																	{section.sectionCode}
																	{section.branch ? ` - ${section.branch}` : ""}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
												<FieldError
													errors={field.state.meta.errors.map((message) => ({
														message: String(message),
													}))}
												/>
											</Field>
										)}
									</form.Field>
								)
							}
						</form.Subscribe>

						<form.Field name="groupLink">
							{(field) => (
								<Field data-invalid={field.state.meta.errors.length > 0}>
									<FieldLabel htmlFor={field.name}>
										WhatsApp invite link
									</FieldLabel>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										aria-invalid={field.state.meta.errors.length > 0}
										placeholder="https://chat.whatsapp.com/..."
									/>
									<FieldDescription>
										Paste the full invite link.
									</FieldDescription>
									<FieldError
										errors={field.state.meta.errors.map((message) => ({
											message: String(message),
										}))}
									/>
								</Field>
							)}
						</form.Field>
					</FieldGroup>
					{submitError && (
						<p className="text-sm text-destructive" role="alert">
							{submitError}
						</p>
					)}
					<DialogFooter>
						<Button type="submit" disabled={form.state.isSubmitting}>
							{form.state.isSubmitting && <Spinner data-icon="inline-start" />}
							{form.state.isSubmitting ? "Adding..." : "Add group"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
