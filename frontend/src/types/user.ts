import { z } from "zod";

export const ROLES = {
	ADMIN: "admin",
	AGENT: "agent",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const userSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	first_name: z.string(),
	last_name: z.string(),
	role_id: z.string(),
	role: z.enum([ROLES.ADMIN, ROLES.AGENT]),
	created_at: z.string(),
	updated_at: z.string(),
});

export type User = z.infer<typeof userSchema>;
