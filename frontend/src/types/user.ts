import { z } from "zod";

/**
 * User schema - Representa un usuario del sistema
 */
export const userSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	role: z.string(),
	createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
