/**
 * Centralized path definitions for the application
 * This ensures consistency and makes refactoring easier
 */

export const paths = {
	home: () => "/",

	properties: {
		index: () => "/properties",
		new: () => "/properties/new",
		detail: (id: string) => `/properties/${id}`,
		edit: (id: string) => `/properties/${id}/edit`,
	},

	auth: {
		login: () => "/login",
		register: () => "/register",
	},

	dashboard: () => "/admin/dashboard",
} as const;
