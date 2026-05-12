import * as z from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(1, "Please select a role."),
  workspaceName: z.string().min(2, "Workspace name is required."),
  workspaceSlug: z.string().min(2, "Workspace URL is required."),
  invites: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
