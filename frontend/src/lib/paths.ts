/**
 * Centralized path definitions for the application
 * This ensures consistency and makes refactoring easier
 */

export const paths = {
	public: {
		home: () => "/",
		properties: () => "/properties",
		unauthorized: () => "/unauthorized",
	},

	auth: {
		login: () => "/login",
		register: () => "/register",
	},

	agent: {
		dashboard: () => "/agent/dashboard",
		clients: {
			index: () => "/agent/clients",
			new: () => "/agent/clients/create",
			leads: () => "/agent/clients/leads",
			searchProperties: () => "/agent/clients/search",
		},
		properties: {
			index: () => "/agent/properties",
			detail: (id: string) => `/agent/properties/${id}`,
			new: () => "/agent/properties/new",
		},
		reports: {
			index: () => "/agent/reports",
		},
		inquiries: {
			index: () => "/agent/inquiries",
		},
	},

	admin: {
		dashboard: () => "/admin/dashboard",
		users: {
			index: () => "/admin/users",
			new: () => "/admin/users/new",
			detail: (id: string) => `/admin/users/${id}`,
		},
	},
} as const;
