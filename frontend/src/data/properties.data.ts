export interface Property {
	id: number;
	title: string;
	description: string | null;
	property_type: {
		id: number;
		name: string;
	};
	owner: {
		id: number;
		name: string;
		email: string;
		phone: string;
	} | null; // null si no tiene dueño
	main_address: {
		full_address: string;
		neighborhood: string | null;
		city: {
			id: number;
			name: string;
			province: {
				name: string;
			};
		};
	};
	main_price: {
		price: string;
		currency: {
			id: number;
			name: string;
			symbol: string;
		};
		operation_type: {
			id: number;
			name: string;
		};
	};
	bedrooms_count: number;
	bathrooms_count: number;
}

export const MOCK_PROPERTIES: Property[] = [
	{
		id: 1,
		title: "Hermosa Casa en Palermo - Oportunidad Única",
		description:
			"Casa moderna con jardín y piscina, 3 habitaciones en suite, 2 baños completos",
		property_type: {
			id: 1,
			name: "Casa",
		},
		owner: {
			id: 1,
			name: "Juan Pérez",
			email: "juan.perez@example.com",
			phone: "221-123-4567",
		},
		main_address: {
			full_address: "Av. Santa Fe 1234",
			neighborhood: "Palermo",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "250000.00",
			currency: {
				id: 1,
				name: "Peso Argentino",
				symbol: "ARS",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 3,
		bathrooms_count: 2,
	},
	{
		id: 2,
		title: "Departamento Luminoso en Recoleta",
		description: "Departamento de 2 ambientes con balcón, totalmente equipado",
		property_type: {
			id: 2,
			name: "Departamento",
		},
		owner: null,
		main_address: {
			full_address: "Av. Corrientes 2421 3B",
			neighborhood: "Recoleta",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "120000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 1,
		bathrooms_count: 1,
	},
	{
		id: 3,
		title: "Local Comercial en Microcentro",
		description: "Excelente ubicación, ideal para oficina o comercio",
		property_type: {
			id: 3,
			name: "Local Comercial",
		},
		owner: null,
		main_address: {
			full_address: "Av. Córdoba 3456",
			neighborhood: "Microcentro",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "CABA",
				},
			},
		},
		main_price: {
			price: "80000.00",
			currency: {
				id: 1,
				name: "Peso Argentino",
				symbol: "ARS",
			},
			operation_type: {
				id: 2,
				name: "Alquiler",
			},
		},
		bedrooms_count: 0,
		bathrooms_count: 2,
	},
	{
		id: 4,
		title: "Casa con Piscina en Belgrano",
		description: "Hermosa casa de 4 ambientes con jardín y pileta",
		property_type: {
			id: 1,
			name: "Casa",
		},
		owner: {
			id: 2,
			name: "María González",
			email: "maria.gonzalez@mail.com",
			phone: "11-5678-9012",
		},
		main_address: {
			full_address: "Av. Las Heras 2890",
			neighborhood: "Belgrano",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "350000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 4,
		bathrooms_count: 3,
	},
	{
		id: 5,
		title: "Departamento a Estrenar en Núñez",
		description: "Monoambiente moderno, excelente terminación",
		property_type: {
			id: 2,
			name: "Departamento",
		},
		owner: null,
		main_address: {
			full_address: "Av. Libertador 7890 10B",
			neighborhood: "Núñez",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "95000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 0,
		bathrooms_count: 1,
	},
	{
		id: 6,
		title: "Oficina Premium en Puerto Madero",
		description: "Oficina equipada con vista al río",
		property_type: {
			id: 4,
			name: "Oficina",
		},
		owner: null,
		main_address: {
			full_address: "Av. Alicia Moreau de Justo 1234",
			neighborhood: "Puerto Madero",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "CABA",
				},
			},
		},
		main_price: {
			price: "150000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 2,
				name: "Alquiler",
			},
		},
		bedrooms_count: 0,
		bathrooms_count: 2,
	},
	{
		id: 7,
		title: "Departamento 3 Ambientes en Caballito",
		description: "Amplio departamento con balcón y cochera",
		property_type: {
			id: 2,
			name: "Departamento",
		},
		owner: null,
		main_address: {
			full_address: "Av. Rivadavia 5678 4D",
			neighborhood: "Caballito",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "180000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 2,
		bathrooms_count: 1,
	},
	{
		id: 8,
		title: "Casa Quinta en San Isidro",
		description: "Amplia casa quinta con parque y quincho",
		property_type: {
			id: 1,
			name: "Casa",
		},
		owner: {
			id: 3,
			name: "Carlos Rodríguez",
			email: "carlos.rodriguez@email.com",
			phone: "11-3456-7890",
		},
		main_address: {
			full_address: "Av. Belgrano 3210",
			neighborhood: "San Isidro",
			city: {
				id: 42,
				name: "San Isidro",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "450000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 5,
		bathrooms_count: 4,
	},
	{
		id: 9,
		title: "Local a Estrenar en Villa Crespo",
		description: "Local comercial con vidriera sobre avenida",
		property_type: {
			id: 3,
			name: "Local Comercial",
		},
		owner: null,
		main_address: {
			full_address: "Av. Corrientes 6789",
			neighborhood: "Villa Crespo",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "CABA",
				},
			},
		},
		main_price: {
			price: "65000.00",
			currency: {
				id: 1,
				name: "Peso Argentino",
				symbol: "ARS",
			},
			operation_type: {
				id: 2,
				name: "Alquiler",
			},
		},
		bedrooms_count: 0,
		bathrooms_count: 1,
	},
	{
		id: 10,
		title: "Departamento con Vista Panorámica",
		description: "Piso alto con vista a la ciudad, 2 dormitorios",
		property_type: {
			id: 2,
			name: "Departamento",
		},
		owner: null,
		main_address: {
			full_address: "Av. 9 de Julio 1500 15A",
			neighborhood: "San Nicolás",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "CABA",
				},
			},
		},
		main_price: {
			price: "200000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 2,
		bathrooms_count: 2,
	},
	{
		id: 11,
		title: "Casa en Barrio Cerrado - Nordelta",
		description: "Casa de 3 plantas con amenities completos",
		property_type: {
			id: 1,
			name: "Casa",
		},
		owner: {
			id: 4,
			name: "Sofía Fernández",
			email: "sofia.fernandez@mail.com",
			phone: "11-7654-3210",
		},
		main_address: {
			full_address: "Los Sauces 456",
			neighborhood: "Nordelta",
			city: {
				id: 43,
				name: "Tigre",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "550000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 4,
		bathrooms_count: 3,
	},
	{
		id: 12,
		title: "Loft Moderno en Villa Urquiza",
		description: "Loft tipo industrial con doble altura",
		property_type: {
			id: 2,
			name: "Departamento",
		},
		owner: null,
		main_address: {
			full_address: "Av. Triunvirato 4321",
			neighborhood: "Villa Urquiza",
			city: {
				id: 41,
				name: "Buenos Aires",
				province: {
					name: "Buenos Aires",
				},
			},
		},
		main_price: {
			price: "160000.00",
			currency: {
				id: 2,
				name: "Dólar Estadounidense",
				symbol: "USD",
			},
			operation_type: {
				id: 1,
				name: "Venta",
			},
		},
		bedrooms_count: 1,
		bathrooms_count: 1,
	},
];

export const getPropertiesWithoutOwner = (): Property[] => {
	return MOCK_PROPERTIES.filter((property) => property.owner === null);
};

export const formatPropertyAddress = (property: Property): string => {
	const { full_address, neighborhood } = property.main_address;
	return neighborhood ? `${full_address} - ${neighborhood}` : full_address;
};
