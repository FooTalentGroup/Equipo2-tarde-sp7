/**
 * Session Management Layer
 *
 * Provides low-level primitives for managing authentication sessions via cookies.
 * Handles secure storage of authentication tokens and user data.
 *
 * @module session
 * @layer Infrastructure
 * @security Uses httpOnly cookies for tokens to prevent XSS attacks
 */

import "server-only";

import { cookies } from "next/headers";

import type { User } from "@src/types";

const TOKEN_NAME = "auth_token";
const USER_DATA_NAME = "auth_user";

/**
 * Sets up a session by storing the token and user data in cookies
 */
export async function setSession(token: string, user: User) {
	const cookieStore = await cookies();

	cookieStore.set(TOKEN_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});

	cookieStore.set(USER_DATA_NAME, JSON.stringify(user), {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});
}

/**
 * Gets the authentication token from the current session
 */
export async function getToken(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get(TOKEN_NAME)?.value;
}

/**
 * Gets the user data from the current session
 */
export async function getUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get(USER_DATA_NAME)?.value;

	if (!userCookie) {
		return null;
	}

	try {
		return JSON.parse(userCookie) as User;
	} catch {
		return null;
	}
}

/**
 * Deletes the current session by removing all authentication cookies
 */
export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(TOKEN_NAME);
	cookieStore.delete(USER_DATA_NAME);
}

/**
 * Checks if there is an active session
 */
export async function hasSession(): Promise<boolean> {
	const token = await getToken();
	return !!token;
}
