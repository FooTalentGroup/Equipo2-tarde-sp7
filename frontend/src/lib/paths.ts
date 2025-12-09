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
			newLeads: () => "/agent/clients/create/leads",
			newInquilinos: () => "/agent/clients/create/inquilinos",
			leads: () => "/agent/clients/leads",
			inquilinos: () => "/agent/clients/inquilinos",
			propietarios: () => "/agent/clients/propietarios",
			searchProperties: () => "/agent/clients/search",
		},
		owners: {
			new: () => "/agent/clients/create/propietarios",
			detail: (id: string) => `/agent/clients/propietarios/${id}`,
		},
		properties: {
			index: () => "/agent/properties",
			detail: (id: string) => `/agent/properties/${id}`,
			edit: (id: string | number) => `/agent/properties/${id}/edit`,
			new: () => "/agent/properties/new",
		},
		reports: {
			index: () => "/agent/reports",
		},
		inquiries: {
			index: () => "/agent/consultations",
		},
	},

	admin: {
		dashboard: () => "/admin/users",
		users: {
			create: () => "/admin/users/create",
		},
	},
} as const;
