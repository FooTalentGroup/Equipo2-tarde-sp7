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
			inquilinos: () => "/agent/clients/inquilinos",
			propietarios: () => "/agent/clients/propietarios",
			searchProperties: () => "/agent/clients/search",
		},
		owners: {
			detail: (id: string) => `/agent/clients/propietarios/${id}`,
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
		dashboard: () => "/admin/users",
		users: {
			create: () => "/admin/users/create",
		},
	},
} as const;
