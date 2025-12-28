/**
 * Data Access Layer (DAL)
 *
 * Provides cached query functions for retrieving authentication data in Server Components.
 * All functions are optimized with React cache() to deduplicate requests within a single render.
 *
 * @module dal
 * @layer Data Access
 * @usage Import in Server Components for reading user data
 * @security All functions are server-only and never exposed to the client
 */

import "server-only";
import { cache } from "react";

import type { User } from "@src/types";

import { getToken, getUser, setSession } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gets the current user from the cookie
 * Reads user data stored in cookies without making backend requests
 */
export const getCurrentUser = cache(
	async (): Promise<User | null> => await getUser(),
);

/**
 * Verifies the current session by consulting the backend
 * Validates that the token is valid and returns authentication status
 */
export const verifySession = cache(
	async (): Promise<{
		isAuth: boolean;
		user: User | null;
	}> => {
		const token = await getToken();

		if (!token) {
			return { isAuth: false, user: null };
		}

		try {
			const response = await fetch(`${API_URL}/auth/me`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				cache: "no-store",
			});

			if (!response.ok) {
				return { isAuth: false, user: null };
			}

			const user: User = await response.json();
			return { isAuth: true, user };
		} catch (error) {
			console.error("Error verifying session:", error);
			return { isAuth: false, user: null };
		}
	},
);

/**
 * Refreshes user data from the backend and updates the cookie
 * Fetches the most recent user data from the backend
 */
export const refreshUser = cache(async (): Promise<User | null> => {
	const token = await getToken();

	if (!token) {
		return null;
	}

	try {
		const response = await fetch(`${API_URL}/auth/me`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const user: User = await response.json();

		await setSession(token, user);

		return user;
	} catch (error) {
		console.error("Error refreshing user:", error);
		return null;
	}
});

/**
 * Checks if the user has a specific role
 * Compares the current user's role_id with the allowed roles
 */
export async function checkUserRole(allowedRoles: string[]): Promise<boolean> {
	const user = await getCurrentUser();

	if (!user) {
		return false;
	}

	return allowedRoles.includes(user.role_id);
}
