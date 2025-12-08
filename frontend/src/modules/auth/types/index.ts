import { userSchema } from "@src/types";
import { z } from "zod";

// Auth response schema y tipo
export const authResponseSchema = z.object({
	token: z.string(),
	user: userSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// Error response schema y tipo
export const authErrorSchema = z.object({
	message: z.string(),
	statusCode: z.number(),
	error: z.string().optional(),
});

export type AuthError = z.infer<typeof authErrorSchema>;
