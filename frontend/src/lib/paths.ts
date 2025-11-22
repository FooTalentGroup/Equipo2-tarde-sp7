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
		clients: {
			index: () => "/admin/clients",
			create: () => "/admin/clients/create",
			edit: () => "/admin/clients/edit",
			delete: () => "/admin/clients/delete",
			filter: () => "/admin/clients/filter",
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
