/**
 * Centralized path definitions for the application
 * This ensures consistency and makes refactoring easier
 */

export const paths = {
	home: () => "/",

	auth: {
		login: () => "/login",
		register: () => "/register",
	},

	admin: {
		dashboard: () => "/admin/dashboard",
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
		},
	},

	// Mantener por compatibilidad
	dashboard: () => "/admin/dashboard",
} as const;
