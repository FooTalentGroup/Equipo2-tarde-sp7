/**
 * Centralized path definitions for the application
 * This ensures consistency and makes refactoring easier
 */

export const paths = {
	public: {
		home: () => "/",
		properties: () => "/properties",
	},

	auth: {
		login: () => "/login",
		register: () => "/register",
	},

	admin: {
		dashboard: () => "/admin/dashboard",
		clients: {
			index: () => "/admin/clients",
			new: () => "/admin/clients/create",
			leads: () => "/admin/clients/leads",
			searchProperties: () => "/admin/clients/search",
		},
		properties: {
			index: () => "/admin/properties",
			detail: (id: string) => `/admin/properties/${id}`,
			new: () => "/admin/properties/new",
		},
		reports: {
			index: () => "/admin/reports",
		},
		inquiries: {
			index: () => "/admin/inquiries",
		},
	},
} as const;
