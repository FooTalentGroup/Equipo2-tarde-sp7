/**
 * Centralized path definitions for the application
 * This ensures consistency and makes refactoring easier
 */

export const paths = {
	public: {
		landing: () => "/",
		properties: () => "/properties",
		rent: () => "/rent",
		sale: () => "/sale",
		property: (id: string) => `/properties/${id}`,
		unauthorized: () => "/unauthorized",
		contact: () => "/contact",
	},

	auth: {
		login: () => "/login",
		register: () => "/register",
	},

	agent: {
		dashboard: () => "/agent/dashboard",
		clients: {
			index: () => "/agent/clients",
			searchProperties: () => "/agent/clients/search",
			leads: {
				index: () => "/agent/clients/leads",
				new: () => "/agent/clients/create/leads",
				detail: (id: string | number) => `/agent/clients/leads/${id}`,
				edit: (id: string | number) => `/agent/clients/edit/leads/${id}`,
			},
			inquilinos: {
				index: () => "/agent/clients/inquilinos",
				new: (id?: string | number) =>
					id
						? `/agent/clients/create/inquilinos/${id}`
						: "/agent/clients/create/inquilinos",
				detail: (id: string | number) => `/agent/clients/inquilinos/${id}`,
				edit: (id: string | number) => `/agent/clients/edit/inquilinos/${id}`,
			},
			owners: {
				index: () => "/agent/clients/propietarios",
				new: (id?: string | number) =>
					id
						? `/agent/clients/create/propietarios/${id}`
						: "/agent/clients/create/propietarios",
				detail: (id: string | number) => `/agent/clients/propietarios/${id}`,
				edit: (id: string | number) => `/agent/clients/edit/propietarios/${id}`,
			},
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
