/**
 * Profile Management Server Actions
 *
 * Handles user profile mutations (update profile, change settings) from Client Components.
 * Automatically refreshes cached user data after successful updates.
 *
 * @module profile.actions
 * @layer Server Actions
 * @usage Import and call from Client Components (profile forms, settings)
 */

"use server";

import { revalidatePath } from "next/cache";

import { refreshUser } from "../lib/dal";
import { getToken } from "../lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UpdateProfileData = {
	first_name?: string;
	last_name?: string;
	email?: string;
};

type ActionResult = {
	success: boolean;
	message?: string;
	errors?: Record<string, string[]>;
};

/**
 * Server Action to update user profile
 * Updates user information and refreshes cached data
 */
export async function updateProfileAction(
	data: UpdateProfileData,
): Promise<ActionResult> {
	try {
		const token = await getToken();

		if (!token) {
			return {
				success: false,
				message: "Not authenticated",
			};
		}

		const response = await fetch(`${API_URL}/users/profile`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			return {
				success: false,
				message: error.message || "Error updating profile",
			};
		}

		await refreshUser();

		revalidatePath("/admin/profile");
		revalidatePath("/admin/dashboard");

		return {
			success: true,
			message: "Profile updated successfully",
		};
	} catch (error) {
		console.error("Update profile error:", error);
		return {
			success: false,
			message: "Error updating profile. Please try again.",
		};
	}
}
