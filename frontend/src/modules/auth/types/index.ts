import { userSchema } from "@src/types";
import { z } from "zod";

export const authResponseSchema = z.object({
	token: z.string(),
	user: userSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const authErrorSchema = z.object({
	message: z.string(),
	statusCode: z.number(),
	error: z.string().optional(),
});

export type AuthError = z.infer<typeof authErrorSchema>;
