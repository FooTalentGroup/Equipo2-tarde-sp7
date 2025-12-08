/**
 * Role-Based Access Control (RBAC) utilities
 * Functions for checking user roles and permissions
 */

import "server-only";

import { paths } from "@src/lib/paths";
import type { User } from "@src/types";
import { ROLES, type Role } from "@src/types/user";

import { getCurrentUser } from "./dal";

/**
 * Checks if the current user has a specific role
 */
export async function hasRole(role: Role): Promise<boolean> {
	const user = await getCurrentUser();

	if (!user) {
		return false;
	}

	return user.role === role;
}

/**
 * Checks if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
	return hasRole(ROLES.ADMIN);
}

/**
 * Checks if the current user is an agent
 */
export async function isAgent(): Promise<boolean> {
	return hasRole(ROLES.AGENT);
}

/**
 * Gets the dashboard path based on user role
 */
export function getDashboardPath(user: User): string {
	if (user.role === ROLES.ADMIN) {
		return paths.admin.dashboard();
	}

	if (user.role === ROLES.AGENT) {
		return paths.agent.dashboard();
	}

	return "/";
}

/**
 * Checks if user has access to admin routes
 */
export function canAccessAdmin(user: User | null): boolean {
	return user?.role === ROLES.ADMIN;
}

/**
 * Checks if user has access to agent routes
 */
export function canAccessAgent(user: User | null): boolean {
	return user?.role === ROLES.AGENT;
}
