/**
 * Authentication Utilities
 *
 * Provides reusable helper functions for common authentication patterns.
 * Contains shared logic used across Server Components and Server Actions.
 *
 * @module utils
 * @layer Utilities
 * @usage Import in Server Components, Layouts, and Server Actions
 */

import "server-only";

import { redirect } from "next/navigation";

import { paths } from "@src/lib/paths";
import type { User } from "@src/types";

import { getCurrentUser } from "./dal";

/**
 * Gets the authenticated user or redirects to login
 * Guarantees that a valid user is always returned (never null)
 */
export async function getAuthenticatedUser(): Promise<User> {
	const user = await getCurrentUser();

	if (!user) {
		redirect(paths.auth.login());
	}

	return user;
}
