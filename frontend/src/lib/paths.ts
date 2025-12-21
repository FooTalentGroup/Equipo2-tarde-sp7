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
				index: () => "/agent/clients/tenants",
				new: (id?: string | number) =>
					id
						? `/agent/clients/create/tenants/${id}`
						: "/agent/clients/create/tenants",
				detail: (id: string | number) => `/agent/clients/tenants/${id}`,
				edit: (id: string | number) => `/agent/clients/edit/tenants/${id}`,
			},
			owners: {
				index: () => "/agent/clients/owners",
				new: (id?: string | number) =>
					id
						? `/agent/clients/create/owners/${id}`
						: "/agent/clients/create/owners",
				detail: (id: string | number) => `/agent/clients/owners/${id}`,
				edit: (id: string | number) => `/agent/clients/edit/owners/${id}`,
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
